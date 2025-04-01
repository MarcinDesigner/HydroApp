// Plik: app/screens/MapScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, Circle, UrlTile } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import Loader from '../components/Loader';
import CustomCallout from '../components/CustomCallout';
import { fetchStations } from '../api/stationsApi';
import { HYDRO_STATION_COORDINATES } from '../services/stationCoordinatesService';

// Współrzędne miast wojewódzkich w Polsce
const VOIVODESHIP_CAPITALS = {
  "Warszawa": { latitude: 52.2297, longitude: 21.0122 },
  "Kraków": { latitude: 50.0647, longitude: 19.9450 },
  "Gdańsk": { latitude: 54.3520, longitude: 18.6466 },
  "Wrocław": { latitude: 51.1079, longitude: 17.0385 },
  "Poznań": { latitude: 52.4064, longitude: 16.9252 },
  "Łódź": { latitude: 51.7592, longitude: 19.4560 },
  "Szczecin": { latitude: 53.4289, longitude: 14.5530 },
  "Bydgoszcz": { latitude: 53.1235, longitude: 18.0084 },
  "Lublin": { latitude: 51.2465, longitude: 22.5684 },
  "Katowice": { latitude: 50.2599, longitude: 19.0285 },
  "Białystok": { latitude: 53.1325, longitude: 23.1688 },
  "Rzeszów": { latitude: 50.0412, longitude: 21.9991 },
  "Olsztyn": { latitude: 53.7785, longitude: 20.4907 },
  "Kielce": { latitude: 50.8660, longitude: 20.6286 },
  "Opole": { latitude: 50.6751, longitude: 17.9213 },
  "Gorzów Wielkopolski": { latitude: 52.7368, longitude: 15.2299 },
  "Zielona Góra": { latitude: 51.9355, longitude: 15.5062 },
  "Toruń": { latitude: 53.0138, longitude: 18.5981 }
};

export default function MapScreen() {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const { isRefreshing, addListener, removeListener } = useRefresh();
  const [stations, setStations] = useState([]);
  const [capitalStations, setCapitalStations] = useState([]);
  const [stationsWithCoords, setStationsWithCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(6); // Początkowy poziom przybliżenia
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 52.2297,     // Centered on Poland
    longitude: 19.0122,
    latitudeDelta: 6,
    longitudeDelta: 6,
  });

  // Wybór odpowiedniego URL dla kafelków mapy bazowej
  const tileUrlTemplate = isDarkMode 
    ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'  // Ciemny styl
    : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';  // Standardowy styl OSM

  // Główne ładowanie danych
  useEffect(() => {
    loadStations();
  }, []);

  // Efekt dla automatycznego odświeżania
  useEffect(() => {
    // Rejestrujemy funkcję odświeżania w kontekście
    const onRefreshCallback = () => {
      loadStations(true); // true = cicha aktualizacja (bez wskaźnika ładowania)
    };

    // Dodaj listener dla globalnego refreshData
    addListener(onRefreshCallback);

    // Cleanup
    return () => {
      removeListener(onRefreshCallback);
    };
  }, []);

  // Po załadowaniu stacji, przygotowujemy dane z współrzędnymi
  useEffect(() => {
    if (stations.length > 0) {
      // Tworzymy mapę, aby uniknąć duplikatów
      const stationsMap = new Map();
      
      // Pobierz wszystkie stacje z współrzędnymi (z naszych danych lub z API)
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
      
      // Konwertuj mapę z powrotem na tablicę
      setStationsWithCoords(Array.from(stationsMap.values()));
      
      // Nie potrzebujemy już oddzielnej listy dla stacji w miastach wojewódzkich
      setCapitalStations([]);
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
    // Im mniejsze latitudeDelta, tym większe przybliżenie
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
    // (np. te z większym przepływem lub w większych miastach)
    if (zoom < 7) {
      // Pokazuj tylko najważniejsze stacje przy małym przybliżeniu
      // Możemy użyć prostego filtra bazującego na nazwie rzeki lub wartości przepływu
      const isImportantRiver = station.river && 
        ['Wisła', 'Odra', 'Warta', 'Bug', 'San', 'Narew'].includes(station.river);
      
      return isImportantRiver;
    }
    
    // Przy dużym przybliżeniu (zoom >= 13) pokazuj wszystkie stacje w obszarze widoku
    if (zoom >= 13) {
      // Sprawdź czy stacja jest w aktualnym obszarze widoku (z marginesem)
      const latDelta = region.latitudeDelta * 0.6; // 60% zakresu jako margines
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
  
  // Funkcja do określania rozmiaru kółka w zależności od przybliżenia
  const getCircleRadius = () => {
    // Znaczne zmniejszenie rozmiarów kółek, aby nie nakładały się na siebie
    return currentZoom < 7 ? 8000 :  // Duże kółka przy małym przybliżeniu
           currentZoom < 9 ? 4000 :  // Średnie kółka przy średnim przybliżeniu
           currentZoom < 11 ? 2000 : // Mniejsze kółka przy dużym przybliżeniu
           currentZoom < 13 ? 1000 : // Małe kółka przy bardzo dużym przybliżeniu
           500;                     // Bardzo małe kółka przy maksymalnym przybliżeniu
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
        attributionEnabled={true}  // Atrybucja OSM (wymagana prawnie)
      >
        {/* Dostawca kafelków OSM */}
        <UrlTile 
          urlTemplate={tileUrlTemplate}
          maximumZ={19}
          flipY={false}
        />
        
        {/* Kółka dla wszystkich stacji z poziomem wody */}
        {stationsWithCoords.map(station => {
          // Sprawdzamy, czy stacja powinna być widoczna przy obecnym przybliżeniu
          if (!isStationVisible(station, currentZoom, region)) return null;
          
          // Promień kółka zależny od przybliżenia
          const radius = getCircleRadius();
          
          return (
            <React.Fragment key={`station-${station.id}-${station.name}`}>
              <Circle
                center={{
                  latitude: station.latitude,
                  longitude: station.longitude
                }}
                radius={radius}
                fillColor={`${getStatusColor(station.status)}80`} // Dodanie przezroczystości (alpha 80)
                strokeColor={getStatusColor(station.status)}
                strokeWidth={1}
                zIndex={1}
              />
              {/* Dodanie etykiety z wartością poziomu wody dla większych przybliżeń */}
              {currentZoom >= 10 && (
                <Marker
                  coordinate={{
                    latitude: station.latitude,
                    longitude: station.longitude
                  }}
                  anchor={{ x: 0.5, y: 0.5 }}
                  title={station.name}
                  tracksViewChanges={false}
                >
                  <View style={[styles.levelLabel, { backgroundColor: theme.dark ? '#000000AA' : '#FFFFFFAA' }]}>
                    <Text style={[styles.levelText, { color: theme.dark ? '#FFF' : '#000' }]}>
                      {station.level}
                    </Text>
                  </View>
                </Marker>
              )}
              <Marker
                coordinate={{
                  latitude: station.latitude,
                  longitude: station.longitude
                }}
                title={station.name}
                description={`${station.river || 'Brak danych'} - ${station.level} cm`}
                pinColor="transparent"
                opacity={0} // Ukryty marker, tylko do callout
                zIndex={2}
              >
                <Callout
                  tooltip
                  onPress={() => handleMarkerPress(station)}
                >
                  <CustomCallout station={station} />
                </Callout>
              </Marker>
            </React.Fragment>
          );
        })}
        
        {/* Usunięto fragment, który został połączony z kodem dla wszystkich stacji powyżej */}
        
        {/* Usunięto markery dla miast wojewódzkich bez stacji */}
      </MapView>

      {/* Panel informacyjny o przybliżeniu */}
      <View style={[styles.zoomInfo, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }]}>
        <Text style={[styles.zoomText, { color: theme.colors.text }]}>
          Przybliżenie: {currentZoom}
        </Text>
        <Text style={[styles.zoomHint, { color: theme.dark ? '#AAA' : '#666' }]}>
          {currentZoom < 7 
            ? 'Widoczne miasta wojewódzkie' 
            : currentZoom < 9 
              ? 'Widoczne ważniejsze stacje' 
              : currentZoom < 11
                ? 'Widoczne większość stacji'
                : currentZoom < 13
                  ? 'Widoczne szczegółowe stacje'
                  : 'Widoczne wszystkie stacje o jednakowym rozmiarze'}
        </Text>
      </View>

      {/* Legenda */}
      <View style={[styles.legendContainer, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }]}>
        <Text style={[styles.legendTitle, { color: theme.colors.text }]}>Stan rzek</Text>
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
  legendContainer: {
    position: 'absolute',
    bottom: 40, // Zostawiamy miejsce na atrybucję
    right: 16,
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
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
  zoomInfo: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  zoomText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  zoomHint: {
    fontSize: 10,
    marginTop: 2,
  },
  capitalCallout: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    minWidth: 120,
  },
  capitalName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  capitalDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  levelLabel: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    fontSize: 10,
    fontWeight: 'bold',
  }
});