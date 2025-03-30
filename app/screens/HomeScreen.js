// Plik: app/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import StationCard from '../components/StationCard';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import Loader from '../components/Loader';
import { fetchStations } from '../api/stationsApi';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { refreshData, isRefreshing, lastRefreshTime } = useRefresh();
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStations(stations);
    } else {
      const filtered = stations.filter(station => 
        station.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStations(filtered);
    }
  }, [searchQuery, stations]);

  const loadStations = async (silent = false) => {
    try {
      if (!silent) {
        setRefreshing(true);
      }
      
      const data = await fetchStations();
      setStations(data);
      setFilteredStations(data);
      
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

  const onRefresh = () => {
    loadStations();
  };

  const handleStationPress = (station) => {
    navigation.navigate('StationDetails', { 
      stationId: station.id,
      stationName: station.name
    });
  };

  if (loading) {
    return <Loader message="Ładowanie stacji..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <Ionicons name="search" size={20} color={theme.colors.text} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Szukaj stacji..."
          placeholderTextColor={theme.dark ? '#888' : '#666'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color={theme.colors.text}
            style={styles.clearIcon}
            onPress={() => setSearchQuery('')}
          />
        )}
      </View>
      
      <FlatList
        data={filteredStations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <StationCard
            station={item}
            onPress={() => handleStationPress(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    margin: 16,
    borderRadius: 8,
    height: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  clearIcon: {
    padding: 4,
  },
  list: {
    padding: 16,
  },
});