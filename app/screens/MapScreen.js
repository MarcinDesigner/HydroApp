// Plik: app/screens/MapScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import Loader from '../components/Loader';
import CustomCallout from '../components/CustomCallout';
import { fetchStations } from '../api/stationsApi';

export default function MapScreen() {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const { refreshData, isRefreshing } = useRefresh();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [region, setRegion] = useState({
    latitude: 52.2297,     // Centered on Poland
    longitude: 21.0122,
    latitudeDelta: 6,
    longitudeDelta: 6,
  });

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
    refreshData.addListener(onRefreshCallback);

    // Cleanup
    return () => {
      refreshData.removeListener(onRefreshCallback);
    };
  }, []);

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

  const getMarkerColor = (status) => {
    switch (status) {
      case 'alarm': return 'red';
      case 'warning': return 'orange';
      case 'normal': return 'green';
      default: return 'blue';
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
        userInterfaceStyle={isDarkMode ? 'dark' : 'light'}
      >
        {stations.map(station => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude
            }}
            pinColor={getMarkerColor(station.status)}
          >
            <Callout
              tooltip
              onPress={() => handleMarkerPress(station)}
            >
              <CustomCallout station={station} />
            </Callout>
          </Marker>
        ))}
      </MapView>
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
});