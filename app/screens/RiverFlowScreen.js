// Plik: app/screens/RiverFlowScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import RiverFlowView from '../components/RiverFlowView';
import Loader from '../components/Loader';
import { fetchStations } from '../api/stationsApi';

const RiverFlowScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { isRefreshing, addListener, removeListener } = useRefresh();
  
  const [stations, setStations] = useState([]);
  const [rivers, setRivers] = useState([]);
  const [selectedRiver, setSelectedRiver] = useState(route.params?.riverName || null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Dodajemy useEffect dla przycisku powrotu
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 8 }}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Dodajemy timeout, aby upewnić się, że nie utknęliśmy w stanie ładowania
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoadingTimeout(true);
      }
    }, 10000); // 10 sekund na timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  // Pobieranie danych
  useEffect(() => {
    loadStations();

    // Rejestrujemy funkcję odświeżania
    const onRefreshCallback = () => {
      loadStations(true);
    };

    addListener(onRefreshCallback);

    return () => {
      removeListener(onRefreshCallback);
    };
  }, []);

  const loadStations = async (silent = false) => {
    try {
      if (!silent) {
        setRefreshing(true);
      }
      
      const data = await fetchStations();
      
      // Jeśli dane są puste, ustawiamy błąd
      if (!data || data.length === 0) {
        setError('Nie udało się pobrać danych o stacjach.');
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      setStations(data);
      
      // Ekstrakcja unikalnych rzek
      const uniqueRivers = [...new Set(data.map(station => station.river))].filter(river => river);
      setRivers(uniqueRivers.sort());
      
      // Jeśli nie wybrano rzeki, wybierz pierwszą dostępną
      if (!selectedRiver && uniqueRivers.length > 0) {
        setSelectedRiver(uniqueRivers[0]);
      }
      
      setError(null);
      
    } catch (error) {
      console.error('Błąd podczas pobierania stacji:', error);
      setError(error.message || 'Nie udało się pobrać danych o stacjach.');
    } finally {
      // Zawsze wykonaj, nawet w przypadku błędu
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderRiverTab = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.riverTab,
        selectedRiver === item && { backgroundColor: theme.colors.primary }
      ]}
      onPress={() => setSelectedRiver(item)}
    >
      <Text 
        style={[
          styles.riverTabText, 
          selectedRiver === item && { color: 'white' }
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  // Jeśli minęło zbyt dużo czasu, dajemy użytkownikowi możliwość ponownej próby
  if (loadingTimeout) {
    return (
      <View style={[styles.containerCenter, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
          Ładowanie trwa zbyt długo
        </Text>
        <Text style={[styles.errorMessage, { color: theme.dark ? '#AAA' : '#666' }]}>
          Sprawdź połączenie z internetem i spróbuj ponownie.
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            setLoadingTimeout(false);
            setLoading(true);
            loadStations();
          }}
        >
          <Text style={styles.retryText}>Spróbuj ponownie</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.containerCenter, { backgroundColor: theme.colors.background }]}>
        <Ionicons 
          name="cloud-offline-outline" 
          size={64} 
          color={theme.dark ? '#555' : '#CCC'} 
        />
        <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
          Błąd połączenia
        </Text>
        <Text style={[styles.errorMessage, { color: theme.dark ? '#AAA' : '#666' }]}>
          {error}
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            setLoading(true);
            loadStations();
          }}
        >
          <Text style={styles.retryText}>Spróbuj ponownie</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return <Loader message="Ładowanie danych o rzekach..." />;
  }

  if (rivers.length === 0) {
    return (
      <View style={[styles.containerCenter, { backgroundColor: theme.colors.background }]}>
        <Ionicons 
          name="water-outline" 
          size={64} 
          color={theme.dark ? '#555' : '#CCC'} 
        />
        <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
          Brak danych o rzekach
        </Text>
        <Text style={[styles.errorMessage, { color: theme.dark ? '#AAA' : '#666' }]}>
          Nie znaleziono żadnych informacji o rzekach.
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            setLoading(true);
            loadStations();
          }}
        >
          <Text style={styles.retryText}>Spróbuj ponownie</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.tabsContainer}>
        <FlatList
          horizontal
          data={rivers}
          renderItem={renderRiverTab}
          keyExtractor={(item, index) => `river-${index}-${item}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsList}
        />
      </View>
      
      {selectedRiver ? (
        <RiverFlowView 
          stations={stations} 
          riverName={selectedRiver} 
        />
      ) : (
        <View style={[styles.containerCenter, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            Wybierz rzekę, aby zobaczyć jej przepływ
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tabsContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabsList: {
    paddingHorizontal: 16,
  },
  riverTab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  riverTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RiverFlowScreen;