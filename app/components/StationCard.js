// Plik: app/components/StationCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Funkcja do pobierania koloru statusu (zakładamy, że jest poprawna)
const getStatusColor = (station, theme) => {
  if (!station || !theme) return theme?.colors?.info || '#cccccc';
  const isWarningUndefined = station.warningLevel === "nie określono" || station.warningLevel == null || station.warningLevel === 888;
  const isAlarmUndefined = station.alarmLevel === "nie określono" || station.alarmLevel == null || station.alarmLevel === 999;

  if (station.status === 'alarm' && isAlarmUndefined) return theme.colors.info;
  if (station.status === 'warning' && isWarningUndefined) return theme.colors.info;

  switch (station.status) {
    case 'alarm': return theme.colors.danger;
    case 'warning': return theme.colors.warning;
    case 'normal': return theme.colors.safe;
    default: return theme.colors.info;
  }
};

export default function StationCard({ station, onPress }) {
  const { theme } = useTheme();

  if (!station) {
    return null;
  }

  // Funkcja formatująca tekst trendu (bez zmian)
  const formatTrend = () => {
    if (station.trend == null || station.trendValue == null) {
      return "Brak danych";
    }
    const sign = station.trendValue > 0 ? '+' : '';
    const trendDesc = station.trend === 'stable' ? 'stabilny' : (station.trend === 'up' ? 'wzrost' : 'spadek');
    const trendSymbol = station.trend === 'stable' ? '—' : (station.trend === 'up' ? '↑' : '↓');

    // Zwracamy tekst bez koloru - kolor ustawiamy w stylu
    return `${trendSymbol} ${sign}${station.trendValue} cm (${trendDesc})`;
  };

  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: theme.colors.card }]}>
      {/* --- Górny wiersz: Nazwa i Status --- */}
      <View style={styles.headerRow}>
        <Text style={[styles.stationName, { color: theme.colors.text }]}>{station.name}</Text>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(station, theme) }]} />
      </View>

      {/* --- Środkowy wiersz: Poziom (lewo) vs Trend/Aktualizacja (prawo) --- */}
      <View style={styles.mainContentRow}>
        {/* Lewa Kolumna: Poziom wody */}
        <View style={styles.levelContainer}>
          <Text style={[styles.levelValue, { color: theme.colors.text }]}>
            {typeof station.level === 'number' ? station.level : '?'}
          </Text>
          <Text style={[styles.levelUnit, { color: theme.colors.text }]}>cm</Text>
        </View>

        {/* Prawa Kolumna: Trend i Aktualizacja */}
        <View style={styles.detailsContainer}>
          {/* --- MODYFIKACJA STYLU KOLORU TUTAJ --- */}
          <Text style={[
            styles.trendText,
            { // Dynamiczny kolor na podstawie trendu
              color: station.trend === 'up'
                ? theme.colors.danger // Czerwony dla 'up'
                : station.trend === 'down'
                  ? theme.colors.safe   // Zielony dla 'down'
                  : theme.colors.text // Domyślny dla 'stable' lub innych
            }
          ]}>
            {formatTrend()}
          </Text>
          {/* ---------------------------------------- */}
          <Text style={[styles.updateTimeText, { color: theme.dark ? '#AAA' : '#666' }]}>
            Aktualizacja: {station.updateTime || '??:??'}
          </Text>
        </View>
      </View>

      {/* --- Dolny wiersz: Rzeka i Strzałka --- */}
      <View style={styles.footerRow}>
        <View style={styles.riverContainer}>
          <Ionicons name="water" size={14} color={theme.colors.primary} />
          <Text style={[styles.riverName, { color: theme.colors.text }]}>
            {station.river || 'Brak danych'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.dark ? '#AAA' : '#666'} />
      </View>
    </TouchableOpacity>
  );
}

// Style (bez zmian w definicjach stylów)
const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stationName: {
    fontSize: 17,
    fontWeight: '600',
    flexShrink: 1,
    marginRight: 8,
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 16,
  },
  mainContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  levelValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  levelUnit: {
    fontSize: 16,
    marginLeft: 4,
    fontWeight: '500',
  },
  detailsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexShrink: 1,
  },
  trendText: { // Podstawowe style dla tekstu trendu
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    marginBottom: 4,
  },
  updateTimeText: {
    fontSize: 12,
    textAlign: 'right',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  riverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: 8,
  },
  riverName: {
     marginLeft: 6,
     fontSize: 16,
     opacity: 0.8,
  },
});