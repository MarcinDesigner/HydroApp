// Plik: app/screens/FavoritesScreen.js (zaktualizowany)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { useRefresh } from '../context/RefreshContext';
import StationCard from '../components/StationCard';
import Loader from '../components/Loader';
import stationService from '../services/stationService';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { favorites: favoriteIds } = useFavorites();
  const { isRefreshing, addListener, removeListener } = useRefresh();
  const [favoriteStations, setFavoriteStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

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
      setError(null);
      return;
    }

    try {
      if (!silent) {
        setRefreshing(true);
        setError(null);
      }
      
      // Użyj serwisu stationService zamiast bezpośredniego wywołania API
      const favorites = await stationService.getFavoriteStations(favoriteIds);
      
      setFavoriteStations(favorites);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading favorites:', error);
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
        setError('Nie udało się załadować ulubionych stacji. Spróbuj ponownie.');
      }
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

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.colors.danger} />
        <Text style={[styles.errorText, { color: theme.colors.text }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.refreshButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => loadFavorites()}
        >
          <Text style={styles.refreshButtonText}>Odśwież</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={favoriteStations}
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
            onRefresh={() => loadFavorites()}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={[
          styles.list,
          favoriteStations.length === 0 && styles.emptyList
        ]}
        ListEmptyComponent={() => (
          <View style={styles.noFavoritesContainer}>
            <Text style={[styles.noFavoritesText, { color: theme.colors.text }]}>
              Nie odnaleziono żadnych ulubionych stacji.
              Sprawdź połączenie internetowe lub dodaj nowe stacje do ulubionych.
            </Text>
          </View>
        )}
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
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noFavoritesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noFavoritesText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  }
});