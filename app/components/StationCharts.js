// Plik: app/components/StationCharts.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator 
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/**
 * Komponent wyświetlający interaktywne wykresy dla stacji hydrologicznej
 * @param {Object} station - Obiekt zawierający dane stacji
 * @param {Object} theme - Obiekt zawierający motyw aplikacji
 */
const StationCharts = ({ station, theme }) => {
  const [timeRange, setTimeRange] = useState('7d'); // '24h', '7d', '30d'
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Resetuj wybrany punkt po zmianie zakresu czasu
  useEffect(() => {
    setSelectedPoint(null);
  }, [timeRange]);

  // Sprawdź czy stacja ma dane wykresu
  const hasChartData = station && 
                      station.chartData && 
                      station.chartData[timeRange] &&
                      station.chartData[timeRange].labels &&
                      station.chartData[timeRange].values;

  // Jeśli brak danych do wykresu
  if (!hasChartData) {
    return (
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Poziom wody w czasie
        </Text>
        <View style={styles.errorContainer}>
          <Ionicons name="analytics-outline" size={40} color={theme.colors.primary} style={styles.errorIcon} />
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            Brak danych do wyświetlenia wykresu
          </Text>
        </View>
      </View>
    );
  }

  // Obsługa dotknięcia punktu na wykresie
  const handleDataPointClick = (data) => {
    // data przychodzi z LineChart i zawiera indeks wybranego punktu
    if (data && data.index >= 0) {
      const chartData = station.chartData[timeRange];
      
      if (chartData && chartData.labels && chartData.values) {
        const pointInfo = {
          label: chartData.labels[data.index],
          value: chartData.values[data.index],
          index: data.index
        };
        
        setSelectedPoint(pointInfo);
      }
    }
  };

  // Obsługa zmiany zakresu czasu
  const handleTimeRangeChange = (newRange) => {
    setLoading(true);
    setTimeRange(newRange);
    
    // Symulacja ładowania danych (w rzeczywistej aplikacji tutaj byłoby zapytanie do API)
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  // Formatowanie danych dla wykresu
  const chartData = {
    labels: station.chartData[timeRange].labels,
    datasets: [
      {
        data: station.chartData[timeRange].values,
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  // Konfiguracja wykresu
  const chartConfig = {
    backgroundColor: theme.colors.card,
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.dark 
      ? `rgba(255, 255, 255, ${opacity})` 
      : `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => theme.dark 
      ? `rgba(255, 255, 255, ${opacity})` 
      : `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: theme.colors.primary
    },
    propsForLabels: {
      fontSize: 12
    }
  };

  // Określanie trendów dla wyświetlanych danych
  const determineCurrentTrend = () => {
    if (!hasChartData || station.chartData[timeRange].values.length < 2) return null;
    
    const values = station.chartData[timeRange].values;
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const difference = lastValue - firstValue;
    
    if (Math.abs(difference) < 3) return { type: 'stable', value: difference };
    else if (difference > 0) return { type: 'up', value: difference };
    else return { type: 'down', value: difference };
  };
  
  const currentTrend = determineCurrentTrend();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Poziom wody w czasie
        </Text>
        
        {/* Wyświetlanie trendu */}
        {currentTrend && (
          <View style={styles.trendContainer}>
            <Ionicons 
              name={
                currentTrend.type === 'up' ? 'arrow-up' : 
                currentTrend.type === 'down' ? 'arrow-down' : 'remove'
              } 
              size={16} 
              color={
                currentTrend.type === 'up' ? theme.colors.danger : 
                currentTrend.type === 'down' ? theme.colors.safe : 
                theme.dark ? '#AAA' : '#666'
              } 
            />
            <Text style={[
              styles.trendText, 
              { 
                color: 
                  currentTrend.type === 'up' ? theme.colors.danger : 
                  currentTrend.type === 'down' ? theme.colors.safe : 
                  theme.dark ? '#AAA' : '#666'
              }
            ]}>
              {currentTrend.value > 0 ? '+' : ''}{currentTrend.value} cm
              {currentTrend.type === 'stable' ? ' (stabilny)' : 
               currentTrend.type === 'up' ? ' (wzrost)' : 
               ' (spadek)'}
            </Text>
          </View>
        )}
      </View>
      
      {/* Przyciski wyboru zakresu czasu */}
      <View style={styles.timeRangeContainer}>
        {['24h', '7d', '30d'].map(range => (
          <TouchableOpacity
            key={range}
            style={[
              styles.timeRangeButton,
              timeRange === range && { 
                backgroundColor: theme.colors.primary
              }
            ]}
            onPress={() => handleTimeRangeChange(range)}
          >
            <Text 
              style={[
                styles.timeRangeText,
                timeRange === range && { color: 'white' }
              ]}
            >
              {range === '24h' ? '24 godz.' : range === '7d' ? '7 dni' : '30 dni'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Wskaźnik ładowania */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          {/* Wykres */}
          <LineChart
            data={chartData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            onDataPointClick={handleDataPointClick}
            withDots={true}
            withShadow={false}
            withInnerLines={true}
            withOuterLines={false}
          />
          
          {/* Informacje o wybranym punkcie */}
          {selectedPoint && (
            <View style={[styles.pointInfoContainer, { backgroundColor: theme.dark ? '#333' : '#f5f5f5' }]}>
              <Text style={[styles.pointInfoTitle, { color: theme.colors.text }]}>
                {timeRange === '24h' ? 'Godzina: ' : 'Data: '}
                <Text style={[styles.pointInfoValue, { color: theme.colors.primary }]}>
                  {selectedPoint.label}
                </Text>
              </Text>
              <Text style={[styles.pointInfoTitle, { color: theme.colors.text }]}>
                Poziom: 
                <Text style={[styles.pointInfoValue, { color: theme.colors.primary }]}>
                  {' '}{selectedPoint.value} cm
                </Text>
              </Text>
            </View>
          )}
          
          {/* Legenda */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.legendText, { color: theme.colors.text }]}>
                Poziom wody (cm)
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

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
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    marginLeft: 4,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#EEEEEE',
  },
  timeRangeText: {
    fontSize: 14,
    color: '#555555',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointInfoContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pointInfoTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  pointInfoValue: {
    fontWeight: 'bold',
  },
  legendContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
  errorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorIcon: {
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  }
});

export default StationCharts;