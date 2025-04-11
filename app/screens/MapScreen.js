// Plik: app/screens/MapScreen.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Alert, Animated } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import Loader from '../components/Loader';
import { fetchStations } from '../api/stationsApi';
import { HYDRO_STATION_COORDINATES } from '../services/stationCoordinatesService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCoordinatesForPlace } from '../services/geocodingService';

// Minimalna odległość między współrzędnymi (stopnie), aby uznać je za różne punkty
const MIN_COORDINATE_DISTANCE = 0.001;

export default function MapScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme, isDarkMode } = useTheme();
  const { isRefreshing, addListener, removeListener } = useRefresh();
  
  // Stan stacji
  const [rawStations, setRawStations] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Stan interfejsu
  const [region, setRegion] = useState({
    latitude: 52.0,
    longitude: 19.0,
    latitudeDelta: 5.5,
    longitudeDelta: 5.5,
  });
  const [currentZoom, setCurrentZoom] = useState(6);
  const [activeStation, setActiveStation] = useState(null);
  const [showLegend, setShowLegend] = useState(true);
  
  // Refy
  const mapRef = useRef(null);
  const legendHeight = useRef(new Animated.Value(160)).current;

  // ----------------------
  // FUNKCJE POMOCNICZE
  // ----------------------
  
  // Obliczanie przybliżenia na podstawie delty regionu
  const calculateZoomLevel = (latitudeDelta) => {
    return Math.round(Math.log2(360 / latitudeDelta));
  };
  
  // Deduplikacja stacji na podstawie współrzędnych
  const deduplicateStations = (stations) => {
    // Klucz do grupowania stacji o podobnych współrzędnych
    const getGroupKey = (lat, lng) => {
      // Zaokrąglamy do 3 miejsc po przecinku, co daje ok. 111 metrów dokładności
      const roundedLat = Math.round(lat * 1000) / 1000;
      const roundedLng = Math.round(lng * 1000) / 1000;
      return `${roundedLat},${roundedLng}`;
    };
    
    const stationGroups = {};
    
    // Grupujemy stacje według zaokrąglonych współrzędnych
    stations.forEach(station => {
      if (!station.latitude || !station.longitude) return;
      
      const groupKey = getGroupKey(station.latitude, station.longitude);
      
      if (!stationGroups[groupKey]) {
        stationGroups[groupKey] = [];
      }
      
      stationGroups[groupKey].push(station);
    });
    
    // Dla każdej grupy wybieramy reprezentanta grupy
    const uniqueStations = Object.values(stationGroups).map(group => {
      if (group.length === 1) {
        return group[0]; // Tylko jedna stacja, zwracamy ją bez zmian
      }
      
      // Dla wielu stacji w tej samej lokalizacji, wybieramy najważniejszą
      // Priorytety: alarm > warning > normal, większa rzeka, większy poziom wody
      return group.reduce((best, current) => {
        // Status - priorytet dla alarmów
        if (current.status === 'alarm' && best.status !== 'alarm') {
          return current;
        }
        if (current.status === 'warning' && best.status === 'normal') {
          return current;
        }
        
        // Większy poziom wody
        if (current.level > best.level) {
          return current;
        }
        
        // Główne rzeki mają priorytet
        const mainRivers = ['Wisła', 'Odra', 'Warta', 'Bug'];
        if (mainRivers.includes(current.river) && !mainRivers.includes(best.river)) {
          return current;
        }
        
        return best;
      }, group[0]);
    });
    
    return uniqueStations;
  };

  // Określanie, które stacje powinny być widoczne na mapie
  const filterVisibleStations = (stations, zoom, mapRegion) => {
    if (!stations || stations.length === 0) return [];
    
    // Najpierw filtrujemy stacje bez określonych poziomów
    const stationsWithLevels = stations.filter(station => 
      station.latitude && station.longitude && 
      !(station.warningLevel === 'nie określono' || station.alarmLevel === 'nie określono' ||
        station.warningLevel === 888 || station.alarmLevel === 999)
    );
    
    // Tworzymy wynikową tablicę od razu ze stacjami alarmowymi i ostrzegawczymi
    // (zawsze je pokazujemy, niezależnie od zoomu)
    const result = stationsWithLevels.filter(station => 
      (station.status === 'alarm' || station.status === 'warning')
    );
    
    console.log(`Liczba stacji alarmowych/ostrzegawczych: ${result.length}`);
    
    // Przy niskim zoomie (domyślny widok) pokaż wszystkie stacje z określonymi poziomami
    if (zoom <= 6) {
      stationsWithLevels.forEach(station => {
        // Jeśli stacja jest już w wynikach (jako alarmowa/ostrzegawcza), pomijamy
        if (result.some(s => s.id === station.id)) return;
        
        // Dodaj wszystkie pozostałe stacje
        result.push(station);
      });
    }
    // Przy średnim przybliżeniu 
    else if (zoom <= 8) {
      // Sprawdzamy, czy stacja jest w widocznym obszarze (z marginesem)
      stationsWithLevels.forEach(station => {
        // Jeśli stacja jest już w wynikach (jako alarmowa/ostrzegawcza), pomijamy
        if (result.some(s => s.id === station.id)) return;
        
        const latDelta = mapRegion.latitudeDelta * 0.6;
        const lonDelta = mapRegion.longitudeDelta * 0.6;
        
        if (
          station.latitude >= mapRegion.latitude - latDelta &&
          station.latitude <= mapRegion.latitude + latDelta &&
          station.longitude >= mapRegion.longitude - lonDelta &&
          station.longitude <= mapRegion.longitude + lonDelta
        ) {
          result.push(station);
        }
      });
    }
    // Przy dużym przybliżeniu
    else {
      // Wszystkie stacje w widocznym obszarze
      stationsWithLevels.forEach(station => {
        // Jeśli stacja jest już w wynikach (jako alarmowa/ostrzegawcza), pomijamy
        if (result.some(s => s.id === station.id)) return;
        
        const latDelta = mapRegion.latitudeDelta * 0.7;
        const lonDelta = mapRegion.longitudeDelta * 0.7;
          
        if (
          station.latitude >= mapRegion.latitude - latDelta &&
          station.latitude <= mapRegion.latitude + latDelta &&
          station.longitude >= mapRegion.longitude - lonDelta &&
          station.longitude <= mapRegion.longitude + lonDelta
        ) {
          result.push(station);
        }
      });
    }
    
    return result;
  };
  
  // Ustalanie koloru markera z uwzględnieniem specjalnych przypadków
  const getStationColor = (station) => {
    if (!station) return theme.colors.info;
    
    // Sprawdź czy poziomy są określone i nie są wartościami specjalnymi
    const isWarningUndefined = station.warningLevel === "nie określono" || station.warningLevel == null || station.warningLevel === 888;
    const isAlarmUndefined = station.alarmLevel === "nie określono" || station.alarmLevel == null || station.alarmLevel === 999;

    // Jeśli oba poziomy są nieokreślone, użyj koloru info
    if (isWarningUndefined && isAlarmUndefined) {
      return theme.colors.info;
    }

    // Jeśli status alarmowy, ale poziom alarmowy jest nieokreślony, użyj info
    if (station.status === 'alarm' && isAlarmUndefined) {
      return theme.colors.info;
    }

    // Jeśli status ostrzegawczy, ale poziom ostrzegawczy jest nieokreślony, użyj info
    if (station.status === 'warning' && isWarningUndefined) {
      return theme.colors.info;
    }

    // Standardowe kolory dla określonych poziomów
    switch (station.status) {
      case 'alarm': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      case 'normal': return theme.colors.safe;
      default: return theme.colors.info;
    }
  };
  
  // Funkcja ustalająca rozmiar markera
  const getMarkerSize = (status, zoom) => {
    // Bazowy rozmiar zależny od przybliżenia
    const baseSize = zoom < 7 ? 36 :
                    zoom < 9 ? 40 :
                    zoom < 11 ? 44 :
                    zoom < 13 ? 48 : 
                    52;
    
    // Zwiększamy rozmiar dla stacji alarmowych i ostrzegawczych
    if (status === 'alarm') {
      return baseSize * 1.5; // 50% większe dla alarmów
    } else if (status === 'warning') {
      return baseSize * 1.2; // 20% większe dla ostrzeżeń
    }
    
    return baseSize;
  };
  
  // Pobranie stacji z API
  const loadStations = async (silent = false) => {
    try {
      if (!silent) {
        setRefreshing(true);
      }
      
      // Dodaj logi debugujące
      console.log("Pobieranie stacji z API...");
      const data = await fetchStations();
      console.log(`Pobrano ${data.length} stacji z API`);
      
      // Sprawdź, ile stacji ma współrzędne geograficzne
      const stationsWithCoords = data.filter(s => 
        s.latitude && s.longitude && 
        (s.latitude !== 52.0 || s.longitude !== 19.0) // Pomijamy domyślne współrzędne
      );
      console.log(`Stacje ze współrzędnymi: ${stationsWithCoords.length}/${data.length}`);
      
      // Sprawdź liczbę stacji alarmowych i ostrzegawczych
      const alarmStations = data.filter(s => s.status === 'alarm');
      const warningStations = data.filter(s => s.status === 'warning');
      console.log(`Stacje alarmowe: ${alarmStations.length}, Stacje ostrzegawcze: ${warningStations.length}`);
      
      // Zapisujemy surowe dane
      setRawStations(data);
      
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

  // Funkcja pomocnicza do trybu diagnostycznego - zaktualizowana
  const runDiagnostics = () => {
    // Upewnij się, że wszystkie wartości są dostępne
    console.log("Wykonuję diagnostykę stacji...");
    console.log("Liczba stacji w stations:", stations.length);
    console.log("Liczba stacji w rawStations:", rawStations.length);
    console.log("Liczba stacji w visibleStations:", visibleStations.length);
    
    // Liczenie stacji według statusu
    const alarmStations = stations.filter(s => s.status === 'alarm');
    const warningStations = stations.filter(s => s.status === 'warning');
    const normalStations = stations.filter(s => s.status !== 'alarm' && s.status !== 'warning');
    const stationsWithoutCoords = stations.filter(s => 
      !s.latitude || !s.longitude || 
      (s.latitude === 52.0 && s.longitude === 19.0)
    );
    const stationsWithoutLevels = stations.filter(s => 
      s.warningLevel === 'nie określono' || s.alarmLevel === 'nie określono' ||
      s.warningLevel === 888 || s.alarmLevel === 999
    );
    
    console.log("Stacje alarmowe:", alarmStations.length);
    console.log("Stacje ostrzegawcze:", warningStations.length);
    console.log("Stacje normalne:", normalStations.length);
    console.log("Stacje bez współrzędnych:", stationsWithoutCoords.length);
    console.log("Stacje bez poziomów:", stationsWithoutLevels.length);
    
    Alert.alert(
      "Diagnostyka stacji", 
      `Całkowita liczba stacji: ${stations.length}\n` +
      `Widoczne stacje: ${visibleStations.length}\n` +
      `Stacje z API: ${rawStations.length}\n` +
      `Stacje alarmowe: ${alarmStations.length}\n` +
      `Stacje ostrzegawcze: ${warningStations.length}\n` +
      `Stacje normalne: ${normalStations.length}\n` +
      `Stacje bez współrzędnych: ${stationsWithoutCoords.length}\n` +
      `Stacje bez poziomów: ${stationsWithoutLevels.length}`
    );
  };

  // ----------------------
  // HOOKI
  // ----------------------



  
  // Ładowanie cache'owanych współrzędnych przed pobieraniem stacji
  useEffect(() => {
    const loadCachedCoordinates = async () => {
      try {
        const cachedCoords = await AsyncStorage.getItem('station_coordinates_cache');
        if (cachedCoords) {
          const coordsData = JSON.parse(cachedCoords);
          // Połącz cache z istniejącymi współrzędnymi
          Object.entries(coordsData).forEach(([id, coords]) => {
            if (!HYDRO_STATION_COORDINATES[id]) {
              HYDRO_STATION_COORDINATES[id] = coords;
            }
          });
          console.log(`Załadowano ${Object.keys(coordsData).length} współrzędnych z cache`);
        }
      } catch (error) {
        console.error("Błąd podczas ładowania cache współrzędnych:", error);
      }
    };
    
    loadCachedCoordinates();
  }, []);
  
  // Ładowanie stacji
  useEffect(() => {
    loadStations();
    
    // Pobierz parametr highlightStationId
    const highlightStationId = route?.params?.highlightStationId;
    
    // Ustawiamy tytuł i przycisk powrotu
    navigation.setOptions({
      title: 'Mapa',
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{ marginLeft: 10 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity 
            onPress={runDiagnostics}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="analytics-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation]);
  
  // Odświeżanie automatyczne
  useEffect(() => {
    const onRefreshCallback = () => {
      loadStations(true);
    };
    
    addListener(onRefreshCallback);
    
    return () => {
      removeListener(onRefreshCallback);
    };
  }, [addListener, removeListener]);
  
  // Uzupełnianie współrzędnych i deduplikacja stacji
  useEffect(() => {
    if (rawStations.length === 0) return;
    
    // Funkcja uzupełniająca współrzędne
    const enhanceStationsWithCoordinates = async () => {
      // Stacje, które będą wymagały geocodingu
      const stationsNeedingGeocoding = [];
      
      // Wstępne uzupełnienie ze stałej bazy
      const enhancedStations = rawStations.map(station => {
        // Jeśli stacja ma już współrzędne, używamy ich
        if (station.latitude && station.longitude) {
          return station;
        }
        
        // Sprawdzamy, czy mamy współrzędne w naszej bazie dla tej stacji
        const stationCoords = HYDRO_STATION_COORDINATES[station.id] || HYDRO_STATION_COORDINATES[station.name];
        if (stationCoords) {
          return {
            ...station,
            latitude: stationCoords.latitude,
            longitude: stationCoords.longitude
          };
        }
        
        // Jeśli nie ma współrzędnych, dodajemy do listy do geocodingu (jeśli mamy nazwę rzeki lub miejscowości)
        if (station.name && (station.name !== "-" || station.river && station.river !== "-")) {
          stationsNeedingGeocoding.push(station);
          
          // Zwracamy tymczasowo stację z domyślnymi współrzędnymi dla Polski
          return {
            ...station,
            latitude: 52.0,
            longitude: 19.0,
            needsGeocoding: true // Flaga do identyfikacji stacji wymagających geocodingu
          };
        }
        
        // Jeśli nie ma współrzędnych i nie możemy geocodować, stosujemy domyślne dla Polski
        return {
          ...station,
          latitude: 52.0,
          longitude: 19.0
        };
      });
      
      // Przeprowadzamy geocoding dla stacji, które tego potrzebują (w grupach, aby nie przeciążyć API)
      if (stationsNeedingGeocoding.length > 0) {
        try {
          console.log(`Przeprowadzam geocoding dla ${stationsNeedingGeocoding.length} stacji...`);
          
          // Przygotuj batche po 10 stacji i rób opóźnienie między nimi
          const BATCH_SIZE = 10;
          const DELAY_MS = 2000; // 2 sekundy przerwy między batchami
          
          for (let i = 0; i < stationsNeedingGeocoding.length; i += BATCH_SIZE) {
            const batchStations = stationsNeedingGeocoding.slice(i, i + BATCH_SIZE);
            
            // Równoległe przetwarzanie dla bieżącego batcha
            const batchPromises = batchStations.map(async station => {
              // Przygotuj zapytanie - preferuj rzekę + miejscowość jeśli dostępne
              let queryPlace = station.name;
              if (station.river && station.river !== "-") {
                queryPlace = `${station.name} ${station.river}`;
              }
              
              if (station.wojewodztwo) {
                queryPlace += `, ${station.wojewodztwo}`;
              }
              
              const coordinates = await getCoordinatesForPlace(queryPlace, 'Polska');
              
              // Aktualizuj stację w tablicy enhancedStations
              if (coordinates) {
                const stationIndex = enhancedStations.findIndex(s => s.id === station.id);
                if (stationIndex !== -1) {
                  enhancedStations[stationIndex].latitude = coordinates.latitude;
                  enhancedStations[stationIndex].longitude = coordinates.longitude;
                  enhancedStations[stationIndex].needsGeocoding = false;
                }
              }
              
              return true; // Zwracamy cokolwiek, aby Promise.all działał
            });
            
            // Czekaj na zakończenie obecnej partii
            await Promise.all(batchPromises);
            
            // Opóźnienie przed następną partią, aby nie przekroczyć limitów API
            if (i + BATCH_SIZE < stationsNeedingGeocoding.length) {
              await new Promise(resolve => setTimeout(resolve, DELAY_MS));
            }
          }
          
          console.log("Geocoding zakończony.");
        } catch (error) {
          console.error("Błąd podczas geocodingu:", error);
        }
      }
      
      // Deduplikacja stacji o podobnych współrzędnych
      const uniqueStations = deduplicateStations(enhancedStations);
      setStations(uniqueStations);
      
      // Zapisz wyniki geocodingu lokalnie do ponownego użycia
      try {
        const geocodingResults = {};
        enhancedStations.forEach(station => {
          if (station.latitude && station.longitude && !station.needsGeocoding && 
              (station.latitude !== 52.0 || station.longitude !== 19.0)) {
            geocodingResults[station.id] = {
              latitude: station.latitude,
              longitude: station.longitude
            };
          }
        });
        
        await AsyncStorage.setItem('station_coordinates_cache', JSON.stringify(geocodingResults));
      } catch (error) {
        console.error("Błąd podczas zapisywania cache geocodingu:", error);
      }
      
      // Sprawdź, czy mamy podświetlić konkretną stację
      const highlightedStationId = route?.params?.highlightStationId;
      if (highlightedStationId) {
        // Znajdź stację do podświetlenia
        const stationToHighlight = uniqueStations.find(s => s.id === highlightedStationId);
        if (stationToHighlight && stationToHighlight.latitude && stationToHighlight.longitude) {
          console.log("Znaleziono stację do podświetlenia:", stationToHighlight.name);
          
          // Ustaw aktywną stację
          setActiveStation(stationToHighlight);
          
          // Przejdź do lokalizacji stacji na mapie
          setTimeout(() => {
            mapRef.current?.animateToRegion({
              latitude: stationToHighlight.latitude - 0.10,
              longitude: stationToHighlight.longitude,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }, 1000);
          }, 500); // Małe opóźnienie, żeby mapa zdążyła się załadować
        }
      }
    };
    
    enhanceStationsWithCoordinates();
  }, [rawStations, route?.params]);
    
  // Obsługa zmiany regionu mapy
  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    setCurrentZoom(calculateZoomLevel(newRegion.latitudeDelta));
  };
  
  // Obsługa kliknięcia markera
  const handleMarkerPress = (station) => {
    setActiveStation(station);
    
    // Animowane przesunięcie do wybranej stacji
    mapRef.current?.animateToRegion({
      latitude: station.latitude - 0.10,
      longitude: station.longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    }, 1000);
  };
  
  // Przejście do szczegółów stacji
  const goToStationDetails = () => {
    if (activeStation) {
      navigation.navigate('StationDetails', {
        stationId: activeStation.id,
        stationName: activeStation.name
      });
    }
  };
  
  // Resetowanie widoku
  const resetMapView = () => {
    setActiveStation(null);
    
    mapRef.current?.animateToRegion({
      latitude: 52.0,
      longitude: 19.0,
      latitudeDelta: 5.5,
      longitudeDelta: 5.5,
    }, 1000);
  };
  
  // Przełączanie widoczności legendy
  const toggleLegend = () => {
    const newValue = !showLegend;
    setShowLegend(newValue);
    
    Animated.timing(legendHeight, {
      toValue: newValue ? 160 : 36,
      duration: 300,
      useNativeDriver: false
    }).start();
    
    // Zapisz ustawienie (opcjonalne)
    try {
      AsyncStorage.setItem('legend_visible', newValue.toString());
    } catch (error) {
      console.error('Błąd podczas zapisywania ustawień legendy:', error);
    }
  };
  
  // Filtrowanie widocznych stacji
  const visibleStations = useMemo(() => {
    return filterVisibleStations(stations, currentZoom, region);
  }, [stations, currentZoom, region]);
  
  // Obliczanie statystyk stanu stacji
  const calculateStats = useMemo(() => {
    if (!stations || stations.length === 0) {
      return { alarm: 0, warning: 0, normal: 0, total: 0 };
    }
    
    let alarm = 0;
    let warning = 0;
    let normal = 0;
    
    stations.forEach(station => {
      if (station.status === 'alarm') alarm++;
      else if (station.status === 'warning') warning++;
      else normal++;
    });
    
    return {
      alarm,
      warning,
      normal,
      total: stations.length
    };
  }, [stations]);
  
  // Generowanie markerów
  const stationMarkers = useMemo(() => {
    return visibleStations.map(station => {
      const markerColor = getStationColor(station);
      const markerSize = getMarkerSize(station.status, currentZoom);
      
      return (
        <Marker
          key={`station-${station.id}`}
          coordinate={{
            latitude: station.latitude,
            longitude: station.longitude
          }}
          // Ustawiamy większy priorytet (zIndex) dla stacji alarmowych i ostrzegawczych,
          // aby były zawsze na wierzchu
          zIndex={station.status === 'alarm' ? 3 : station.status === 'warning' ? 2 : 1}
          onPress={() => handleMarkerPress(station)}
        >
          <View style={styles.markerContainer}>
            <View style={[
              styles.marker, 
              { 
                backgroundColor: markerColor,
                width: markerSize,
                height: markerSize,
                borderRadius: markerSize / 2,
                // Dodajemy efekt pulsowania dla alarmów (opcjonalnie)
                borderWidth: station.status === 'alarm' ? 3 : 2,
                borderColor: 'white',
              }
            ]}>
              <Text style={[
                styles.markerText, 
                { 
                  fontSize: station.status === 'alarm' ? 14 : 
                            station.status === 'warning' ? 13 : 12 
                }
              ]}>
                {station.level}
              </Text>
            </View>
          </View>
        </Marker>
      );
    });
  }, [visibleStations, currentZoom, theme.colors]);
  
  // Renderowanie podczas ładowania
  if (loading && !refreshing) {
    return <Loader message="Ładowanie mapy..." />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChange}
        rotateEnabled={true}
        zoomEnabled={true}
      >
        {stationMarkers}
      </MapView>
      
      
      {/* Panel statystyk */}
      <View style={[
        styles.statsPanel, 
        { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }
      ]}>
        <Text style={[styles.statsTitle, { color: theme.colors.text }]}>
          Statystyki stanu rzek
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: theme.colors.danger }]} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {calculateStats.alarm}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text }]}>
              Alarmowe
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: theme.colors.warning }]} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {calculateStats.warning}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text }]}>
              Ostrzegawcze
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: theme.colors.safe }]} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {calculateStats.normal}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text }]}>
              Normalne
            </Text>
          </View>
        </View>
        <Text style={[styles.statsTotal, { color: theme.colors.text }]}>
          Razem: {calculateStats.total} stacji
        </Text>
        
        {/* Przycisk pokazujący tylko stacje alarmowe i ostrzegawcze */}
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            // Znajdź środek wszystkich stacji alarmowych i ostrzegawczych
            const alarmStations = stations.filter(
              s => (s.status === 'alarm' || s.status === 'warning') && s.latitude && s.longitude
            );
            
            if (alarmStations.length > 0) {
              // Oblicz środek
              let sumLat = 0, sumLng = 0;
              alarmStations.forEach(s => {
                sumLat += s.latitude;
                sumLng += s.longitude;
              });
              
              const centerLat = sumLat / alarmStations.length;
              const centerLng = sumLng / alarmStations.length;
              
              // Dostosuj deltę, aby objąć wszystkie stacje
              let maxLatDelta = 0, maxLngDelta = 0;
              alarmStations.forEach(s => {
                maxLatDelta = Math.max(maxLatDelta, Math.abs(s.latitude - centerLat));
                maxLngDelta = Math.max(maxLngDelta, Math.abs(s.longitude - centerLng));
              });
              
              // Animuj mapę, aby pokazać wszystkie stacje alarmowe i ostrzegawcze
              mapRef.current?.animateToRegion({
                latitude: centerLat,
                longitude: centerLng,
                latitudeDelta: Math.max(maxLatDelta * 2.5, 1.0),
                longitudeDelta: Math.max(maxLngDelta * 2.5, 1.0),
              }, 1000);
            }
          }}
        >
          <Text style={styles.filterButtonText}>
            Pokaż stacje alarmowe
          </Text>
          <Ionicons name="warning" size={16} color="white" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
      
      {/* Panel aktywnej stacji */}
      {activeStation && (
        <View style={[styles.stationPanel, { backgroundColor: theme.colors.card }]}>
          <View style={styles.stationHeaderRow}>
            <Text style={[styles.stationName, { color: theme.colors.text }]}>
              {activeStation.name}
            </Text>
            <TouchableOpacity onPress={resetMapView}>
              <Ionicons name="close-circle" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.stationDetailRow}>
            <Text style={[styles.stationLabel, { color: theme.colors.text }]}>Rzeka:</Text>
            <Text style={[styles.stationValue, { color: theme.colors.text }]}>
              {activeStation.river || "Brak danych"}
            </Text>
          </View>
          
          <View style={styles.stationDetailRow}>
            <Text style={[styles.stationLabel, { color: theme.colors.text }]}>Poziom wody:</Text>
            <Text style={[styles.stationValue, { color: theme.colors.text }]}>
              {activeStation.level} cm
            </Text>
          </View>
          
          <View style={styles.stationDetailRow}>
            <Text style={[styles.stationLabel, { color: theme.colors.text }]}>Poziom ostrzegawczy:</Text>
            <Text style={[styles.stationValue, { color: theme.colors.text }]}>
              {activeStation.warningLevel === 'nie określono' || activeStation.warningLevel === 888 
                ? "nie określono" 
                : `${activeStation.warningLevel} cm`}
            </Text>
          </View>
          
          <View style={styles.stationDetailRow}>
            <Text style={[styles.stationLabel, { color: theme.colors.text }]}>Poziom alarmowy:</Text>
            <Text style={[styles.stationValue, { color: theme.colors.text }]}>
              {activeStation.alarmLevel === 'nie określono' || activeStation.alarmLevel === 999 
                ? "nie określono" 
                : `${activeStation.alarmLevel} cm`}
            </Text>
          </View>
          
          <View style={styles.stationDetailRow}>
            <Text style={[styles.stationLabel, { color: theme.colors.text }]}>Status:</Text>
            <View style={[
              styles.statusIndicator, 
              { backgroundColor: getStationColor(activeStation) }
            ]}>
              <Text style={styles.statusText}>
                {activeStation.status === 'alarm' ? 'ALARMOWY' : 
                 activeStation.status === 'warning' ? 'OSTRZEGAWCZY' : 'NORMALNY'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.detailsButton, { backgroundColor: theme.colors.primary }]}
            onPress={goToStationDetails}
          >
            <Text style={styles.detailsButtonText}>Szczegóły stacji</Text>
            <Ionicons name="chevron-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Przycisk resetowania widoku */}
      <TouchableOpacity 
        style={[styles.resetButton, { backgroundColor: theme.colors.primary }]}
        onPress={resetMapView}
      >
        <Ionicons name="refresh" size={20} color="white" />
      </TouchableOpacity>
      
     
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
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  statsText: {
    fontSize: 12,
    fontWeight: '500',
  },
  stationPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stationName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  stationDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stationLabel: {
    width: 140,
    fontSize: 14,
    fontWeight: '500',
  },
  stationValue: {
    fontSize: 14,
    flex: 1,
  },
  statusIndicator: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  resetButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Style dla panelu statystyk
  statsPanel: {
    position: 'absolute',
    top: 20, // Poniżej przycisku resetowania
    left: 20,
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    width: 200,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 10,
  },
  statsTotal: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginTop: 4,
  },
  filterButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});