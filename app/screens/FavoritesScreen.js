// Plik: app/screens/FavoritesScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { useRefresh } from '../context/RefreshContext';
import StationCard from '../components/StationCard';
import WaterConditionInfo from '../components/WaterConditionInfo';
import Loader from '../components/Loader';
import { fetchStations } from '../api/stationsApi';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { favorites: favoriteIds } = useFavorites();
  const { isRefreshing, addListener, removeListener } = useRefresh();
  const [favoriteStations, setFavoriteStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, [favoriteIds]); // Przeładuj gdy zmienią się ulubione ID

  // Efekt dla automatycznego odświeżania
  useEffect(() => {
    const onRefreshCallback = () => {
      loadFavorites(true); // true = cicha aktualizacja (bez wskaźnika ładowania)
    };

    addListener(onRefreshCallback);

    return () => {
      removeListener(onRefreshCallback);
    };
  }, []);

  const loadFavorites = async (silent = false) => {
    if (favoriteIds.length === 0) {
      setFavoriteStations([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      if (!silent) {
        setRefreshing(true);
      }
      
      const allStations = await fetchStations();
      
      // Filtruj tylko stacje, które są w ulubionych
      const favorites = allStations.filter(station => 
        favoriteIds.includes(station.id)
      );
      
      setFavoriteStations(favorites);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStationPress = (station) => {
    navigation.navigate('StationDetails', { 
      stationId: station.id,
      stationName: station.name
    });
  };

  if (favoriteIds.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons 
          name="heart-outline" 
          size={64} 
          color={theme.dark ? '#555' : '#CCC'} 
        />
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          Brak ulubionych stacji
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.dark ? '#AAA' : '#666' }]}>
          Dodaj stacje do ulubionych, aby szybko sprawdzać ich stan
        </Text>
      </View>
    );
  }

  if (loading && !refreshing) {
    return <Loader message="Ładowanie ulubionych stacji..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={favoriteStations}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          favoriteStations.length > 0 ? (
            <>
              {favoriteStations.map((station) => (
                <WaterConditionInfo 
                  key={`water-condition-${station.id}`}
                  level={station.level} 
                  theme={theme} 
                />
              ))}
            </>
          ) : null
        )}
        renderItem={({ item }) => (
          <StationCard
            station={item}
            onPress={() => handleStationPress(item)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isRefreshing}
            onRefresh={loadFavorites}
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
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});