// Plik: app/screens/MapScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { Marker, Callout, Polyline, UrlTile } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import Loader from '../components/Loader';
import CustomCallout from '../components/CustomCallout';
import { fetchStations } from '../api/stationsApi';
import { getRiverCoordinates } from '../services/riverCoordinatesService';

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
  "Toruń": { latitude: 53.0138, longitude: 18.5981 } // Czasem wymieniane obok Bydgoszczy
};

// Funkcja pomocnicza do grupowania stacji według rzek
const groupStationsByRiver = (stations) => {
  const rivers = {};
  
  stations.forEach(station => {
    if (!station.river) return;
    
    if (!rivers[station.river]) {
      rivers[station.river] = [];
    }
    
    rivers[station.river].push(station);
  });
  
  return rivers;
};

// Funkcja do określania koloru rzeki na podstawie stanu stacji
const getRiverColor = (stations, theme) => {
  // Sprawdź czy którakolwiek ze stacji ma stan alarmowy
  if (stations.some(station => station.status === 'alarm')) {
    return theme.colors.danger;
  }
  
  // Sprawdź czy którakolwiek ze stacji ma stan ostrzegawczy
  if (stations.some(station => station.status === 'warning')) {
    return theme.colors.warning;
  }
  
  // Domyślnie: stan normalny
  return theme.colors.safe;
};

export default function MapScreen() {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const { isRefreshing, addListener, removeListener } = useRefresh();
  const [stations, setStations] = useState([]);
  const [capitalStations, setCapitalStations] = useState([]);
  const [rivers, setRivers] = useState({});
  const [riverPaths, setRiverPaths] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  // Po załadowaniu stacji, grupujemy je według rzek i przygotowujemy ścieżki rzek
  useEffect(() => {
    if (stations.length > 0) {
      // Filtruj tylko stacje w miastach wojewódzkich
      const stationsInCapitals = stations.filter(station => {
        // Sprawdź czy nazwa stacji zawiera nazwę któregoś z miast wojewódzkich
        return Object.keys(VOIVODESHIP_CAPITALS).some(capitalName => 
          station.name.includes(capitalName)
        );
      });
      
      // Przypisz współrzędne miast wojewódzkich
      const stationsWithCoordinates = stationsInCapitals.map(station => {
        const matchingCapital = Object.keys(VOIVODESHIP_CAPITALS).find(capitalName => 
          station.name.includes(capitalName)
        );
        
        if (matchingCapital && VOIVODESHIP_CAPITALS[matchingCapital]) {
          return {
            ...station,
            latitude: VOIVODESHIP_CAPITALS[matchingCapital].latitude,
            longitude: VOIVODESHIP_CAPITALS[matchingCapital].longitude
          };
        }
        
        return station;
      });
      
      setCapitalStations(stationsWithCoordinates);
      
      // Grupowanie stacji według rzek
      const groupedRivers = groupStationsByRiver(stations);
      setRivers(groupedRivers);
      
      // Tworzenie ścieżek dla rzek
      const paths = {};
      Object.keys(groupedRivers).forEach(riverName => {
        // Pobierz predefiniowane współrzędne dla rzeki
        const riverCoordinates = getRiverCoordinates(riverName);
        
        if (riverCoordinates.length > 0) {
          // Użyj predefiniowanych współrzędnych
          paths[riverName] = riverCoordinates;
        }
      });
      
      setRiverPaths(paths);
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

  // Funkcja pomocnicza do ustalania koloru markera na podstawie statusu stacji
  const getMarkerColor = (status) => {
    switch (status) {
      case 'alarm': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      case 'normal': return theme.colors.safe;
      default: return theme.colors.info;
    }
  };

  if (loading && !refreshing) {
    return <Loader message="Ładowanie mapy..." />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
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
        
        {/* Renderowanie linii rzek */}
        {Object.keys(riverPaths).map(riverName => {
          const riverPath = riverPaths[riverName];
          const riverStations = rivers[riverName] || [];
          const riverColor = getRiverColor(riverStations, theme);
          
          if (!riverPath || riverPath.length < 2) return null;
          
          return (
            <Polyline
              key={`river-${riverName}`}
              coordinates={riverPath}
              strokeColor={riverColor}
              strokeWidth={4}
              lineDashPattern={[1, 0]} // Linia ciągła
              lineJoin="round"
              zIndex={1} // Pod markerami
            />
          );
        })}

        {/* Renderowanie stacji tylko dla miast wojewódzkich */}
        {capitalStations.map(station => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude
            }}
            pinColor={getMarkerColor(station.status)}
            title={station.name}
            description={`${station.river || 'Brak danych'} - ${station.level} cm`}
            zIndex={2} // Nad liniami
          >
            <Callout
              tooltip
              onPress={() => handleMarkerPress(station)}
            >
              <CustomCallout station={station} />
            </Callout>
          </Marker>
        ))}
        
        {/* Renderowanie markerów dla miast wojewódzkich bez stacji */}
        {Object.entries(VOIVODESHIP_CAPITALS).map(([name, coords]) => {
          // Sprawdź czy miasto już ma stację
          const hasStation = capitalStations.some(station => 
            station.name.includes(name)
          );
          
          // Jeśli ma stację, nie pokazuj dodatkowego markera
          if (hasStation) return null;
          
          return (
            <Marker
              key={`capital-${name}`}
              coordinate={coords}
              pinColor={theme.colors.info}
              title={name}
              description="Miasto wojewódzkie"
              zIndex={2}
            />
          );
        })}
      </MapView>

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
    height: 4,
    borderRadius: 2,
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
});