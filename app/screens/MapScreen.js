// Plik: app/screens/MapScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Animated } from 'react-native';
import MapView, { Marker, Callout, UrlTile, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import Loader from '../components/Loader';
import CustomCallout from '../components/CustomCallout';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { fetchStations } from '../api/stationsApi';
import { HYDRO_STATION_COORDINATES } from '../services/stationCoordinatesService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Współrzędne miast wojewódzkich w Polsce
const VOIVODESHIP_CAPITALS = {
  "Warszawa": { latitude: 52.2297, longitude: 21.0122 },
  // pozostałe współrzędne bez zmian
};

export default function MapScreen() {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const { isRefreshing, addListener, removeListener } = useRefresh();
  const [stations, setStations] = useState([]);
  const [stationsWithCoords, setStationsWithCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(6);
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 52.2297,
    longitude: 19.0122,
    latitudeDelta: 6,
    longitudeDelta: 6,
  });
  
  // Stany dla lokalizacji
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [locationEnabled, setLocationEnabled] = useState(false);
  
  // Nowe stany dla funkcjonalności chowania elementów
  const [showLegend, setShowLegend] = useState(true);
  const [showNearbyStations, setShowNearbyStations] = useState(false); // Domyślnie ukryte
  const [isMapGrayscale, setIsMapGrayscale] = useState(false);
  
  // Animacje dla zwijania/rozwijania
  const nearbyStationsHeight = useRef(new Animated.Value(0)).current; // Zaczynamy od zwinietej (0)
  const legendHeight = useRef(new Animated.Value(160)).current; // Wysokość legendy

  // Funkcja do określania rozmiaru markera w zależności od przybliżenia
  const getMarkerSize = () => {
    return currentZoom < 7 ? 36 :
           currentZoom < 9 ? 40 :
           currentZoom < 11 ? 44 :
           currentZoom < 13 ? 48 : 
           52;
  };

  // Wybór odpowiedniego URL dla kafelków mapy bazowej
  const getTileUrlTemplate = () => {
    if (isMapGrayscale) {
      // Czarno-biały styl mapy
      return 'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png';
    } else if (isDarkMode) {
      // Ciemny styl
      return 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
    } else {
      // Standardowy styl
      return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  // *** POBIERANIE USTAWIEŃ Z ASYNCSTORAGE ***
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Ładowanie ustawień lokalizacji
        const locationEnabled = await AsyncStorage.getItem('location_enabled');
        setLocationEnabled(locationEnabled === 'true');
        
        // Ładowanie ustawień widoczności legendy
        const legendVisible = await AsyncStorage.getItem('legend_visible');
        if (legendVisible !== null) {
          const isVisible = legendVisible === 'true';
          setShowLegend(isVisible);
          // Ustaw początkową wartość animacji
          legendHeight.setValue(isVisible ? 160 : 36); // Tylko nagłówek jeśli ukryte
        }
        
        // Ładowanie ustawień trybu czarno-białego
        const mapGrayscale = await AsyncStorage.getItem('map_grayscale');
        if (mapGrayscale !== null) {
          setIsMapGrayscale(mapGrayscale === 'true');
        }
      } catch (error) {
        console.error('Błąd podczas ładowania ustawień:', error);
      }
    };

    loadSettings();
  }, []);

  // *** FUNKCJA DO POBIERANIA LOKALIZACJI UŻYTKOWNIKA ***
  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Brak uprawnień do lokalizacji');
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      // Po uzyskaniu lokalizacji, oblicz najbliższe stacje
      if (stations.length > 0) {
        calculateNearbyStations(location.coords, stations);
      }
      
    } catch (error) {
      console.error('Błąd podczas pobierania lokalizacji:', error);
    }
  };

  // *** FUNKCJA DO OBLICZANIA ODLEGŁOŚCI DO STACJI ***
  const calculateNearbyStations = (userCoords, stationsList) => {
    if (!userCoords || !stationsList.length) return;
    
    const stationsWithDistance = stationsList
      .filter(station => station.latitude && station.longitude)
      .map(station => {
        const distance = getDistance(
          { latitude: userCoords.latitude, longitude: userCoords.longitude },
          { latitude: station.latitude, longitude: station.longitude }
        );
        
        return { ...station, distance };
      })
      .sort((a, b) => a.distance - b.distance);
    
    setNearbyStations(stationsWithDistance.slice(0, 5));
  };

  // *** WYWOŁANIE LOKALIZACJI GDY ZMIENIĄ SIĘ STACJE LUB USTAWIENIA ***
  useEffect(() => {
    if (locationEnabled && stations.length > 0) {
      getUserLocation();
    }
  }, [stations, locationEnabled]);

  // Główne ładowanie danych
  useEffect(() => {
    loadStations();
  }, []);

  // Efekt dla automatycznego odświeżania
  useEffect(() => {
    const onRefreshCallback = () => {
      loadStations(true);
    };
    addListener(onRefreshCallback);
    return () => {
      removeListener(onRefreshCallback);
    };
  }, [addListener, removeListener]);

  // Po załadowaniu stacji, przygotowujemy dane z współrzędnymi
  useEffect(() => {
    if (stations.length > 0) {
      const stationsMap = new Map();
      
      stations.forEach(station => {
        // Sprawdź czy stacja ma współrzędne bezpośrednio
        if (station.latitude && station.longitude) {
          stationsMap.set(station.id, station);
          return;
        }
        
        // Sprawdź czy mamy współrzędne w naszej bazie dla tej stacji
        const stationCoords = HYDRO_STATION_COORDINATES[station.name];
        if (stationCoords) {
          stationsMap.set(station.id, {
            ...station,
            latitude: stationCoords.latitude,
            longitude: stationCoords.longitude
          });
          return;
        }
        
        // Sprawdź, czy nazwa stacji zawiera nazwę któregoś z miast wojewódzkich
        const matchingCapital = Object.keys(VOIVODESHIP_CAPITALS).find(capitalName => 
          station.name.includes(capitalName)
        );
        
        if (matchingCapital && VOIVODESHIP_CAPITALS[matchingCapital]) {
          stationsMap.set(station.id, {
            ...station,
            latitude: VOIVODESHIP_CAPITALS[matchingCapital].latitude,
            longitude: VOIVODESHIP_CAPITALS[matchingCapital].longitude
          });
        }
      });
      
      setStationsWithCoords(Array.from(stationsMap.values()));
    }
  }, [stations]);

  const loadStations = async (silent = false) => {
    try {
      if (!silent) {
        setRefreshing(true);
      }
      
      const data = await fetchStations();
      setStations(data);
      
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
      }
    } catch (error) {
      console.error('Error loading stations:', error);
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  const handleMarkerPress = (station) => {
    navigation.navigate('StationDetails', { 
      stationId: station.id,
      stationName: station.name
    });
  };

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    
    // Oblicz przybliżenie na podstawie rozmiaru widoku
    const newZoom = Math.round(Math.log2(360 / newRegion.latitudeDelta));
    setCurrentZoom(newZoom);
  };

  // Funkcja pomocnicza do ustalania koloru na podstawie statusu stacji
  const getStatusColor = (status) => {
    switch (status) {
      case 'alarm': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      case 'normal': return theme.colors.safe;
      default: return theme.colors.info;
    }
  };
  
  // Funkcja do ustalenia czy stacja jest widoczna na podstawie przybliżenia
  const isStationVisible = (station, zoom, region) => {
    // Przy małym przybliżeniu pokazuj stacje z większą ważnością
    if (zoom < 7) {
      const isImportantRiver = station.river && 
        ['Wisła', 'Odra', 'Warta', 'Bug', 'San', 'Narew'].includes(station.river);
      
      return isImportantRiver;
    }
    
    // Przy dużym przybliżeniu pokazuj wszystkie stacje w obszarze widoku
    if (zoom >= 13) {
      const latDelta = region.latitudeDelta * 0.6;
      const lonDelta = region.longitudeDelta * 0.6;
      
      return (
        station.latitude >= region.latitude - latDelta &&
        station.latitude <= region.latitude + latDelta &&
        station.longitude >= region.longitude - lonDelta &&
        station.longitude <= region.longitude + lonDelta
      );
    }
    
    // Obliczamy odległość od aktualnego centrum mapy
    const distanceFromCenter = Math.sqrt(
      Math.pow(station.latitude - region.latitude, 2) +
      Math.pow(station.longitude - region.longitude, 2)
    );
    
    // Określamy widoczność stacji w zależności od przybliżenia i odległości od centrum
    const visibilityThreshold = zoom < 9 ? 0.6 : 
                               zoom < 11 ? 1.2 : 
                               zoom < 13 ? 2.5 : 4.0;
    
    return distanceFromCenter <= visibilityThreshold;
  };
  
  // *** NOWE FUNKCJE DO OBSŁUGI PANELI ***
  
  // Przełączanie widoczności legendy
  const toggleLegend = async () => {
    const newValue = !showLegend;
    setShowLegend(newValue);
    
    // Animacja wysokości
    Animated.timing(legendHeight, {
      toValue: newValue ? 160 : 36, // Rozwinięta lub tylko nagłówek
      duration: 300,
      useNativeDriver: false
    }).start();
    
    // Zapisz ustawienie
    try {
      await AsyncStorage.setItem('legend_visible', newValue.toString());
    } catch (error) {
      console.error('Błąd podczas zapisywania ustawień legendy:', error);
    }
  };
  
  // Przełączanie widoczności panelu najbliższych stacji
  const toggleNearbyStations = () => {
    const newValue = !showNearbyStations;
    setShowNearbyStations(newValue);
    
    // Animacja wysokości
    Animated.timing(nearbyStationsHeight, {
      toValue: newValue ? 300 : 0, // Pokazane lub całkowicie ukryte
      duration: 300,
      useNativeDriver: false
    }).start();
  };
  
  // Przełączanie trybu czarno-białego mapy
  const toggleMapGrayscale = async () => {
    const newValue = !isMapGrayscale;
    setIsMapGrayscale(newValue);
    
    // Zapisz ustawienie
    try {
      await AsyncStorage.setItem('map_grayscale', newValue.toString());
    } catch (error) {
      console.error('Błąd podczas zapisywania ustawień mapy:', error);
    }
  };

  if (loading && !refreshing) {
    return <Loader message="Ładowanie mapy..." />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        rotateEnabled={true}
        zoomEnabled={true}
        minZoomLevel={4}
        maxZoomLevel={19}
        attributionEnabled={true}
      >
        {/* Dostawca kafelków OSM */}
        <UrlTile 
          urlTemplate={getTileUrlTemplate()}
          maximumZ={19}
          flipY={false}
        />
        
        {/* Markery stacji z kolorami wskazującymi stan rzeki */}
        {stationsWithCoords.map(station => {
          if (!isStationVisible(station, currentZoom, region)) return null;
          
          // Określ kolor markera na podstawie statusu
          const markerColor = getStatusColor(station.status);
          
          return (
            <Marker
              key={`station-${station.id}-${station.name}`}
              coordinate={{
                latitude: station.latitude,
                longitude: station.longitude
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              onPress={() => handleMarkerPress(station)}
            >
              <View style={styles.customMarkerContainer}>
                <View style={[
                  styles.customMarker, 
                  { 
                    backgroundColor: markerColor,
                    width: getMarkerSize(),
                    height: getMarkerSize(),
                    borderRadius: getMarkerSize() / 2
                  }
                ]}>
                  <Text style={[
                    styles.markerText, 
                    { fontSize: currentZoom < 8 ? 10 : 12 }
                  ]}>
                    {station.level}
                  </Text>
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>
      
      {/* Przycisk trybu czarno-białego */}
      <TouchableOpacity 
        style={[styles.mapModeButton, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }]}
        onPress={toggleMapGrayscale}
      >
        <Ionicons 
          name={isMapGrayscale ? "color-palette-outline" : "contrast-outline"} 
          size={24} 
          color={theme.colors.primary} 
        />
      </TouchableOpacity>

      {/* Przycisk do pokazywania najbliższych stacji */}
      {locationEnabled && userLocation && nearbyStations.length > 0 && (
        <TouchableOpacity 
          style={[styles.locationButton, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }]}
          onPress={toggleNearbyStations}
        >
          <Ionicons 
            name="location-outline" 
            size={24} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
      )}

      {/* Panel informacyjny o najbliższych stacjach - używamy Animated.View dla animacji */}
      {locationEnabled && userLocation && nearbyStations.length > 0 && (
        <Animated.View 
          style={[
            styles.nearbyStationsContainer, 
            { 
              backgroundColor: theme.dark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
              height: nearbyStationsHeight,
              opacity: nearbyStationsHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
              })
            }
          ]}
        >
          {showNearbyStations && (
            <>
              <View style={styles.nearbyStationsHeader}>
                <Text style={[styles.nearbyStationsTitle, { color: theme.colors.text }]}>
                  Najbliższe stacje
                </Text>
                <TouchableOpacity onPress={toggleNearbyStations}>
                  <Ionicons 
                    name="close-outline" 
                    size={24} 
                    color={theme.colors.text} 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.nearbyStationsContent}>
                {nearbyStations.map((station) => (
                  <TouchableOpacity
                    key={station.id}
                    style={styles.stationItem}
                    onPress={() => navigation.navigate('StationDetails', { 
                      stationId: station.id,
                      stationName: station.name 
                    })}
                  >
                    <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(station.status) }]} />
                    <View style={styles.stationInfo}>
                      <Text style={[styles.stationName, { color: theme.colors.text }]}>{station.name}</Text>
                      <Text style={[styles.riverName, { color: theme.colors.caption }]}>{station.river || 'Brak danych'}</Text>
                    </View>
                    <View style={styles.stationDistance}>
                      <Text style={[styles.distanceText, { color: theme.colors.primary }]}>{(station.distance/1000).toFixed(1)} km</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={theme.colors.caption} />
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </Animated.View>
      )}

      {/* Legenda z przyciskiem strzałki */}
      <Animated.View 
        style={[
          styles.legendContainer, 
          { 
            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
            height: legendHeight
          }
        ]}
      >
        <View style={styles.legendHeader}>
          <Text style={[styles.legendTitle, { color: theme.colors.text }]}>Legenda</Text>
          <TouchableOpacity onPress={toggleLegend}>
            <Ionicons 
              name={showLegend ? "chevron-down-outline" : "chevron-up-outline"} 
              size={20} 
              color={theme.colors.text} 
            />
          </TouchableOpacity>
        </View>

        {showLegend && (
          <View style={styles.legendContent}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.safe }]} />
              <Text style={[styles.legendText, { color: theme.colors.text }]}>Normalny</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.warning }]} />
              <Text style={[styles.legendText, { color: theme.colors.text }]}>Ostrzegawczy</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.danger }]} />
              <Text style={[styles.legendText, { color: theme.colors.text }]}>Alarmowy</Text>
            </View>
          </View>
        )}
      </Animated.View>
      
      {/* Atrybucja OpenStreetMap (wymagana prawnie) */}
      <View style={[styles.attributionContainer, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }]}>
        <Text style={[styles.attributionText, { color: theme.colors.text }]}>
          © OpenStreetMap contributors
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  // Nowe style dla markerów
  customMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  customMarker: {
    padding: 8,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  // Legendę i atrybuty przesuwamy w prawo, aby zrobić miejsce dla przycisku
  legendContainer: {
    position: 'absolute',
    bottom: 25,
    left: 16,
    width: 140,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  legendContent: {
    padding: 12,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  // Przycisk trybu mapy
  mapModeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  // Przycisk lokalizacji do pokazywania najbliższych stacji
  locationButton: {
    position: 'absolute',
    top: 70,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  attributionContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  attributionText: {
    fontSize: 10,
  },
  // Style dla sekcji najbliższych stacji z dodaniem nagłówka
  nearbyStationsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden', // Aby zawartość nie wychodziła poza zaokrąglone rogi
  },
  nearbyStationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  nearbyStationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nearbyStationsContent: {
    flex: 1,
    paddingVertical: 4,
  },
  stationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 14,
    fontWeight: '500',
  },
  riverName: {
    fontSize: 12,
  },
  stationDistance: {
    marginHorizontal: 8,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: 'bold',
  }
});