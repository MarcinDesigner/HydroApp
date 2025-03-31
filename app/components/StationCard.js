// Plik: app/components/StationCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function StationCard({ station, onPress }) {
  const { theme } = useTheme();
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'alarm': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      case 'normal': return theme.colors.safe;
      default: return theme.colors.info;
    }
  };
  
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'arrow-up';
      case 'down': return 'arrow-down';
      default: return 'remove';
    }
  };

  // Formatuj trend z odpowiednim znakiem
  const formatTrend = (trendValue) => {
    if (trendValue > 0) return `+${trendValue}`;
    return trendValue.toString();
  };

  // Formatuj opis trendu
  const getTrendDescription = (trend) => {
    switch (trend) {
      case 'up': return ' (wzrost)';
      case 'down': return ' (spadek)';
      default: return ' (stabilny)';
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.colors.card }]}
    >
      <View style={styles.header}>
        <Text style={[styles.stationName, { color: theme.colors.text }]}>
          {station.name}
        </Text>
        <View 
          style={[
            styles.statusIndicator, 
            { backgroundColor: getStatusColor(station.status) }
          ]}
        />
      </View>
      
      <View style={styles.content}>
        <View style={styles.levelContainer}>
          <Text style={[styles.levelValue, { color: theme.colors.text }]}>
            {station.level}
          </Text>
          <Text style={[styles.levelUnit, { color: theme.colors.text }]}>cm</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.trendContainer}>
            <Ionicons 
              name={getTrendIcon(station.trend)} 
              size={18} 
              color={
                station.trend === 'up' 
                  ? theme.colors.danger 
                  : station.trend === 'down' 
                    ? theme.colors.safe 
                    : theme.colors.text
              } 
            />
            <Text 
              style={[
                styles.trendText, 
                { 
                  color: station.trend === 'up' 
                    ? theme.colors.danger 
                    : station.trend === 'down' 
                      ? theme.colors.safe 
                      : theme.colors.text
                }
              ]}
            >
              {formatTrend(station.trendValue)} cm{getTrendDescription(station.trend)}
            </Text>
          </View>
          
          <Text style={[styles.updateTime, { color: theme.dark ? '#AAA' : '#666' }]}>
            Aktualizacja: {station.updateTime || 'nieznana'}
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.riverContainer}>
          <Ionicons name="water-outline" size={14} color={theme.colors.primary} />
          <Text style={[styles.riverName, { color: theme.dark ? '#AAA' : '#666' }]}>
            {station.river || 'Brak danych'}
          </Text>
        </View>
        
        <Ionicons name="chevron-forward" size={20} color={theme.dark ? '#AAA' : '#666'} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 16,
  },
  levelValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  levelUnit: {
    fontSize: 16,
    marginBottom: 4,
    marginLeft: 4,
  },
  detailsContainer: {
    flex: 1,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  trendText: {
    fontSize: 14,
    marginLeft: 4,
  },
  updateTime: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riverName: {
    fontSize: 14,
    marginLeft: 4,
  },
});