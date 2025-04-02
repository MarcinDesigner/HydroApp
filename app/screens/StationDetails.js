// Plik: app/screens/StationDetails.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Share
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { useRefresh } from '../context/RefreshContext';
import Loader from '../components/Loader';
import StationInfo from '../components/StationInfo';
import AlertsPanel from '../components/AlertsPanel';
import { fetchStationDetails } from '../api/stationsApi';

export default function StationDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isRefreshing, addListener, removeListener } = useRefresh();
  
  // Pobieramy zarówno stationId jak i stationName z parametrów nawigacji
  const { stationId, stationName } = route.params;
  
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d'); // '24h', '7d', '30d'
  const isFavorited = isFavorite(stationId);

  useEffect(() => {
    loadStationDetails();
    
    // Ustawiamy tytuł ekranu na nazwę stacji, jeśli jest dostępna
    if (stationName) {
      navigation.setOptions({
        title: stationName
      });
    }
    
    // Add header right buttons
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => toggleFavorite(stationId)} style={styles.headerButton}>
            <Ionicons 
              name={isFavorited ? 'heart' : 'heart-outline'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareStation} style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isFavorited, stationName]);

  // Efekt dla automatycznego odświeżania
  useEffect(() => {
    // Rejestrujemy funkcję odświeżania w kontekście
    const onRefreshCallback = () => {
      loadStationDetails(true); // true = cicha aktualizacja (bez wskaźnika ładowania)
    };

    // Dodaj listener dla globalnego refreshData
    addListener(onRefreshCallback);

    // Cleanup
    return () => {
      removeListener(onRefreshCallback);
    };
  }, [stationId]);

  const loadStationDetails = async (silent = false) => {
    try {
      if (!silent) {
        setRefreshing(true);
      }
      
      const data = await fetchStationDetails(stationId);
      setStation(data);
      
      // Jeśli nie mieliśmy nazwy stacji z parametrów, ustawiamy ją teraz
      if (data && data.name && !stationName) {
        navigation.setOptions({
          title: data.name
        });
      }
      
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
      }
    } catch (error) {
      console.error('Error loading station details:', error);
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  const onRefresh = () => {
    loadStationDetails();
  };

  const shareStation = async () => {
    if (!station) return;
    
    try {
      await Share.share({
        message: `Sprawdź stację ${station.name} w aplikacji Hydro. Aktualny poziom wody: ${station.level} cm.`,
        title: `Stacja Hydro - ${station.name}`,
      });
    } catch (error) {
      console.error('Error sharing station:', error);
    }
  };

  if (loading && !refreshing) {
    return <Loader message="Ładowanie szczegółów stacji..." />;
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || isRefreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      {station ? (
        <>
          <StationInfo station={station} theme={theme} />
          
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Poziom wody w czasie
            </Text>
            
            <View style={styles.timeRangeContainer}>
              {['24h', '7d', '30d'].map(range => (
                <TouchableOpacity
                  key={range}
                  style={[
                    styles.timeRangeButton,
                    timeRange === range && { backgroundColor: theme.colors.primary }
                  ]}
                  onPress={() => setTimeRange(range)}
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
            
            {station.chartData && station.chartData[timeRange] && (
              <LineChart
                data={{
                  labels: station.chartData[timeRange].labels,
                  datasets: [
                    {
                      data: station.chartData[timeRange].values,
                      color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                      strokeWidth: 2
                    }
                  ]
                }}
                width={Dimensions.get('window').width - 64}
                height={220}
                chartConfig={{
                  backgroundColor: theme.colors.card,
                  backgroundGradientFrom: theme.colors.card,
                  backgroundGradientTo: theme.colors.card,
                  decimalPlaces: 0,
                  color: (opacity = 1) => 
                    theme.dark 
                      ? `rgba(255, 255, 255, ${opacity})` 
                      : `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => 
                    theme.dark 
                      ? `rgba(255, 255, 255, ${opacity})` 
                      : `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "4",
                    strokeWidth: "2",
                    stroke: theme.colors.primary
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
            )}
          </View>
          
          <AlertsPanel station={station} theme={theme} />

          {/* Dodajemy przycisk powrotu do mapy systemu rzeki */}
          <View style={styles.actionButtonsContainer}>
            {station && station.river && (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => navigation.navigate('RiverFlow', { riverName: station.river })}
                >
                  <Ionicons name="git-network-outline" size={20} color="white" style={styles.actionButtonIcon} />
                  <Text style={styles.actionButtonText}>Zobacz przepływ rzeki {station.river}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="map-outline" size={20} color="white" style={styles.actionButtonIcon} />
                  <Text style={styles.actionButtonText}>Powrót do mapy</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Ładowanie danych stacji...
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    marginVertical:.16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
});