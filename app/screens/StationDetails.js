// Plik: app/screens/StationDetails.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Share,
  Animated
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { useRefresh } from '../context/RefreshContext';
import Loader from '../components/Loader';
import StationInfo from '../components/StationInfo';
import StationCharts from '../components/StationCharts';
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
  const isFavorited = isFavorite(stationId);
  
  // Animacje
  const favoriteScale = new Animated.Value(1);

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
          <TouchableOpacity 
            onPress={() => {
              // Animacja przycisku ulubionych
              Animated.sequence([
                Animated.timing(favoriteScale, {
                  toValue: 1.3,
                  duration: 150,
                  useNativeDriver: true
                }),
                Animated.timing(favoriteScale, {
                  toValue: 1,
                  duration: 150,
                  useNativeDriver: true
                })
              ]).start();
              
              // Przełącz stan ulubionych
              toggleFavorite(stationId);
            }} 
            style={styles.headerButton}
          >
            <Animated.View style={{
              transform: [{ scale: favoriteScale }]
            }}>
              <Ionicons 
                name={isFavorited ? 'heart' : 'heart-outline'} 
                size={24} 
                color="white" 
              />
            </Animated.View>
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
          
          {/* Wykresy stacji */}
          <StationCharts station={station} theme={theme} />

          {/* Przyciski akcji */}
          <View style={styles.actionButtonsContainer}>
            {station && station.river && (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back" size={20} color="white" style={styles.actionButtonIcon} />
                  <Text style={styles.actionButtonText}>Powrót</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.colors.secondary || '#009688' }]}
                  onPress={() => navigation.navigate('Map', { highlightStationId: station.id })}
                >
                  <Ionicons name="map-outline" size={20} color="white" style={styles.actionButtonIcon} />
                  <Text style={styles.actionButtonText}>Pokaż na mapie</Text>
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
    borderRadius: 12,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
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