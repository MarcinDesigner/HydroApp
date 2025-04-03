import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// *** LOGIKA KOLORU STATUSU (zgodnie z instrukcją) ***
const getStatusColorForIndicator = (station, theme) => {
  // Sprawdź, czy obiekt station i theme istnieją
  if (!station || !theme || typeof station.level !== 'number') {
    return theme?.colors?.info || '#888888'; // Domyślny kolor, jeśli brak danych lub poziomu
  }

  // Definicja warunków dla nieokreślonych poziomów
  // Konwersja na liczbę, jeśli to możliwe, na wypadek gdyby poziomy były stringami
  const warningLevelNum = parseFloat(station.warningLevel);
  const alarmLevelNum = parseFloat(station.alarmLevel);

  const isWarningLevelInvalid = isNaN(warningLevelNum) || station.warningLevel === "nie określono" || station.warningLevel === 888;
  const isAlarmLevelInvalid = isNaN(alarmLevelNum) || station.alarmLevel === "nie określono" || station.alarmLevel === 999;

  // Jeśli oba poziomy są nieprawidłowe/nieokreślone, użyj koloru info niezależnie od statusu
  if (isWarningLevelInvalid && isAlarmLevelInvalid) {
    return theme.colors.info;
  }

  // Jeśli poziom alarmowy jest nieprawidłowy, traktuj stan alarmowy jako nieokreślony
  if (station.level >= alarmLevelNum && isAlarmLevelInvalid) {
      return theme.colors.info;
  }
  // Jeśli poziom ostrzegawczy jest nieprawidłowy, traktuj stan ostrzegawczy jako nieokreślony
  if (station.level >= warningLevelNum && isWarningLevelInvalid) {
      return theme.colors.info;
  }

  // Standardowa logika kolorów oparta na *poprawnych* poziomach
  if (!isAlarmLevelInvalid && station.level >= alarmLevelNum) {
    return theme.colors.danger;
  }
  if (!isWarningLevelInvalid && station.level >= warningLevelNum) {
    return theme.colors.warning;
  }

  // Domyślnie stan normalny
  return theme.colors.safe;
};
// *** KONIEC LOGIKI KOLORU STATUSU ***


export default function StationInfo({ station, theme }) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // Logowanie danych dla debugowania
  // useEffect(() => {
  //   console.log("Dane stacji w StationInfo:", JSON.stringify(station, null, 2));
  // }, [station]);

  useEffect(() => {
    if (typeof station.level !== 'number') {
      animatedWidth.setValue(0); // Ustaw na 0, jeśli poziom nie jest liczbą
      return;
    }

    // Używaj tylko poprawnych liczbowych wartości poziomów do obliczeń
    const warningLevelNum = parseFloat(station.warningLevel);
    const alarmLevelNum = parseFloat(station.alarmLevel);
    const levelNum = station.level; // Zakładamy, że station.level jest już liczbą

    const validAlarmLevel = !isNaN(alarmLevelNum) && station.alarmLevel !== "nie określono" && station.alarmLevel !== 999 ? alarmLevelNum : -Infinity;
    const validWarningLevel = !isNaN(warningLevelNum) && station.warningLevel !== "nie określono" && station.warningLevel !== 888 ? warningLevelNum : -Infinity;

    // Ustal maksymalną wartość dla skali, biorąc pod uwagę obecny poziom i *prawidłowe* poziomy alarmowe/ostrzegawcze
    const maxLevelForScale = Math.max(levelNum, validAlarmLevel > -Infinity ? validAlarmLevel * 1.2 : 0, validWarningLevel > -Infinity ? validWarningLevel * 1.5 : 0, 250); // 250 jako minimum

    // Oblicz procent, upewniając się, że maxLevelForScale nie jest zerem
    const levelPercentage = maxLevelForScale > 0 ? Math.min(100, (levelNum / maxLevelForScale) * 100) : 0;

    Animated.timing(animatedWidth, {
      toValue: levelPercentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [station.level, station.warningLevel, station.alarmLevel, animatedWidth]); // Dodano zależności


  const getLevelIndicator = () => {
    if (typeof station.level !== 'number') {
        return <View style={styles.levelIndicatorContainer}><Text style={{color: theme.colors.text}}>Brak danych o poziomie</Text></View>; // Obsługa braku danych
    }

    const warningLevelNum = parseFloat(station.warningLevel);
    const alarmLevelNum = parseFloat(station.alarmLevel);
    const levelNum = station.level;

    const validAlarmLevel = !isNaN(alarmLevelNum) && station.alarmLevel !== "nie określono" && station.alarmLevel !== 999 ? alarmLevelNum : -Infinity;
    const validWarningLevel = !isNaN(warningLevelNum) && station.warningLevel !== "nie określono" && station.warningLevel !== 888 ? warningLevelNum : -Infinity;

    const maxLevelForScale = Math.max(levelNum, validAlarmLevel > -Infinity ? validAlarmLevel * 1.2 : 0, validWarningLevel > -Infinity ? validWarningLevel * 1.5 : 0, 250);

    // Oblicz pozycje procentowe tylko dla *prawidłowych* poziomów
    const warningPercentage = (validWarningLevel > -Infinity && maxLevelForScale > 0) ? (validWarningLevel / maxLevelForScale) * 100 : -1;
    const alarmPercentage = (validAlarmLevel > -Infinity && maxLevelForScale > 0) ? (validAlarmLevel / maxLevelForScale) * 100 : -1;

    // Pobierz kolor wskaźnika używając nowej logiki
    const indicatorColor = getStatusColorForIndicator(station, theme);

    return (
      <View style={styles.levelIndicatorContainer}>
        <View style={styles.levelIndicatorBackground}>
          <Animated.View
            style={[
              styles.levelIndicatorFill,
              {
                width: animatedWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: indicatorColor, // Użyj koloru z nowej logiki
              },
            ]}
          />
          {/* Renderuj marker tylko jeśli poziom jest poprawny i w zakresie 0-100% */}
          {warningPercentage >= 0 && warningPercentage <= 100 && (
            <View style={[styles.markerAbsolute, { left: `${warningPercentage}%` }]}>
              <View style={[styles.marker, { backgroundColor: theme.colors.warning }]} />
            </View>
          )}
          {alarmPercentage >= 0 && alarmPercentage <= 100 && (
            <View style={[styles.markerAbsolute, { left: `${alarmPercentage}%` }]}>
              <View style={[styles.marker, { backgroundColor: theme.colors.danger }]} />
            </View>
          )}
        </View>
      </View>
    );
  };

  // Funkcja pomocnicza do formatowania poziomu
  const formatLevel = (level) => {
      if (level === "nie określono" || level == null) return "nie określono";
      if (level === 888 || level === 999) return "nie określono"; // Specjalne wartości
      const num = parseFloat(level);
      return isNaN(num) ? "błąd" : `${num} cm`;
  };


  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      {/* Header (bez zmian) */}
      <View style={styles.header}>
        <View style={styles.riverInfo}>
          <View style={styles.row}>
            <Ionicons name="water" size={18} color={theme.colors.primary} />
            <Text style={[styles.riverName, { color: theme.colors.text }]}>
              {station.river || "Brak danych o rzece"}
            </Text>
          </View>
          {station.wojewodztwo && (
            <View style={styles.row}>
              <Text style={[styles.wojewodztwoName, { color: theme.colors.text }]}>
                {station.wojewodztwo}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.updateContainer}>
          <Text style={[styles.updateTime, { color: theme.dark ? '#AAA' : '#666' }]}>
            Pomiar: {station.fullUpdateTime || station.updateTime || "brak danych"}
          </Text>
          {station.lastRefresh && (
            <Text style={[styles.refreshTime, { color: theme.dark ? '#AAA' : '#666' }]}>
              Odświeżono: {new Date(station.lastRefresh).toLocaleTimeString('pl-PL')}
            </Text>
          )}
        </View>
      </View>

      {/* Poziom wody (bez zmian) */}
      <View style={styles.levelContainer}>
        <Text style={[styles.levelValue, { color: theme.colors.text }]}>
          {typeof station.level === 'number' ? station.level : "?"} {/* Wyświetl '?' jeśli nie jest liczbą */}
        </Text>
        <Text style={[styles.levelUnit, { color: theme.colors.text }]}>cm</Text>
      </View>

      {/* Trend (bez zmian) */}
      <View style={styles.trendContainer}>
         {station.trend && station.trendValue != null ? ( // Sprawdź czy dane trendu istnieją
            <>
                <Ionicons
                    name={
                        station.trend === 'up'
                        ? 'arrow-up'
                        : station.trend === 'down'
                        ? 'arrow-down'
                        : 'remove' // Dla 'stable' lub innych
                    }
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
                        color:
                            station.trend === 'up'
                            ? theme.colors.danger
                            : station.trend === 'down'
                            ? theme.colors.safe
                            : theme.colors.text,
                        },
                    ]}
                >
                    {station.trendValue > 0 ? '+' : ''}
                    {station.trendValue} cm / {station.trendInterval || 'okres'} {/* Domyślny tekst jeśli brak interwału */}
                    {station.trend === 'stable'
                        ? ' (stabilny)'
                        : station.trend === 'up'
                        ? ' (wzrost)'
                        : station.trend === 'down'
                        ? ' (spadek)'
                        : '' // Nic nie wyświetlaj, jeśli trend nieznany
                    }
                </Text>
            </>
         ) : (
            <Text style={[
  styles.trendText, // Podstawowy styl tekstu trendu
  { // Dynamiczny obiekt stylu dla koloru
    color: station.trend === 'up'
      ? theme.colors.danger // Czerwony dla wzrostu ('up')
      : station.trend === 'down'
        ? theme.colors.safe   // Zielony dla spadku ('down')
        : theme.colors.text // Domyślny kolor (np. dla 'stable')
  }
]}>
  {formatTrend()}
</Text>
         )}
      </View>


      {/* Wskaźnik poziomu (używa getLevelIndicator) */}
      {getLevelIndicator()}

      {/* Poziomy statusów (użyj funkcji formatLevel) */}
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: theme.colors.warning,
                marginRight: 6,
              }}
            />
            <Text style={[styles.statusLabel, { color: theme.colors.text }]}>Ostrzegawczy:</Text>
          </View>
          <Text style={[styles.statusValue, { color: theme.colors.text }]}>
             {formatLevel(station.warningLevel)} {/* Formatowanie */}
          </Text>
        </View>

        <View style={styles.statusItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: theme.colors.danger,
                marginRight: 6,
              }}
            />
            <Text style={[styles.statusLabel, { color: theme.colors.text }]}>Alarmowy:</Text>
          </View>
          <Text style={[styles.statusValue, { color: theme.colors.text }]}>
             {formatLevel(station.alarmLevel)} {/* Formatowanie */}
          </Text>
        </View>
      </View>
    </View>
  );
}

// Style (pozostają bez zmian)
const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
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
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    riverInfo: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        flexShrink: 1, // Pozwól tekstowi się zawijać
        marginRight: 8, // Odstęp od informacji o aktualizacji
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2, // Mały odstęp między wierszami
    },
    riverName: {
        fontSize: 16,
        marginLeft: 6,
        fontWeight: '500', // Lekkie pogrubienie nazwy rzeki
    },
    wojewodztwoName: {
        fontSize: 13,
        fontStyle: 'italic',
        marginLeft: 24, // Wcięcie dla województwa
    },
    updateContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        flexShrink: 0, // Nie pozwól temu elementowi się kurczyć
    },
    updateTime: {
        fontSize: 12,
        textAlign: 'right',
    },
    refreshTime: {
        fontSize: 11,
        marginTop: 2,
        textAlign: 'right',
    },
    levelContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end', // Wyrównaj do dolnej krawędzi
        marginBottom: 8,
        justifyContent: 'center', // Wyśrodkuj poziom wody
    },
    levelValue: {
        fontSize: 48,
        fontWeight: 'bold',
        lineHeight: 50, // Dopasuj wysokość linii
    },
    levelUnit: {
        fontSize: 18,
        // marginBottom: 8, // Usunięte - wyrównanie do baseline załatwia sprawę
        marginLeft: 6,
        paddingBottom: 6, // Lekkie podniesienie 'cm'
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        justifyContent: 'center', // Wyśrodkuj trend
    },
    trendText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 6,
    },
    levelIndicatorContainer: {
        marginBottom: 16,
        height: 12, // Ustaw wysokość kontenera na wysokość paska
    },
    levelIndicatorBackground: {
        height: '100%', // Wypełnij kontener
        backgroundColor: '#E0E0E0',
        borderRadius: 6,
        overflow: 'hidden',
        position: 'relative',
    },
    levelIndicatorFill: {
        height: '100%',
        borderRadius: 6,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    markerAbsolute: {
        position: 'absolute',
        top: -2, // Lekko wysuń markery ponad pasek
        bottom: -2,
        justifyContent: 'center',
        alignItems: 'center',
        width: 2, // Szerokość markera
        transform: [{ translateX: -1 }], // Wyśrodkuj marker względem jego pozycji 'left'
    },
    marker: {
        width: 2, // Szerokość linii markera
        height: 16, // Wysokość markera (większa niż pasek)
        borderRadius: 1, // Lekko zaokrąglony
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Równomierne rozmieszczenie
        marginTop: 8,
        borderTopWidth: 1, // Linia oddzielająca
        borderTopColor: '#eee', // Kolor linii
        paddingTop: 12, // Odstęp nad linią
    },
    statusItem: {
        alignItems: 'center', // Wyśrodkuj elementy w kolumnie
    },
    statusLabel: {
        fontSize: 13, // Mniejsza etykieta
        marginBottom: 2, // Mniejszy odstęp
    },
    statusValue: {
        fontSize: 15, // Nieco mniejsza wartość
        fontWeight: '500',
    },
});