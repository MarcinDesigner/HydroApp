// Plik: app/screens/HomeScreen.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Text,
  Pressable,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
// import SegmentedControl from '@react-native-segmented-control/segmented-control'; // Przykład
import StationCard from '../components/StationCard';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import Loader from '../components/Loader';
import { fetchStations } from '../api/stationsApi';

// Funkcja sortowania (bez zmian)
const sortStationsByStatus = (stations) => {
    return [...stations].sort((a, b) => {
      const statusPriority = { 'alarm': 0, 'warning': 1, 'normal': 2 };
      const aPriority = statusPriority[a.status] ?? 3;
      const bPriority = statusPriority[b.status] ?? 3;
      return aPriority - bPriority;
    });
  };

export default function HomeScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { isRefreshing, addListener, removeListener } = useRefresh();
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'warning', 'alarm'

  // --- Logika ładowania, nawigacji, odświeżania (bez zmian) ---
  const loadStations = useCallback(async (silent = false) => {
    if (!silent && !isRefreshing) {
        setLoading(true);
    }
    try {
      const data = await fetchStations();
      setStations(data);
    } catch (error) {
      console.error('Error loading stations:', error);
    } finally {
      if (!silent) {
         setLoading(false);
      }
    }
  }, [isRefreshing]);

useEffect(() => {
  loadStations();
}, [loadStations]);

useEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 16 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="settings-outline" size={24} color={theme.colors.headerText || 'white'} />
        </TouchableOpacity>
      </View>
    ),
  });
}, [navigation, theme]);

  useEffect(() => {
    const onRefreshCallback = () => { if (!isRefreshing && !loading) loadStations(true); };
    addListener(onRefreshCallback);
    return () => removeListener(onRefreshCallback);
  }, [addListener, removeListener, loadStations, isRefreshing, loading]);

  // --- Efekt filtrowania i sortowania Z DODANYM WYSZUKIWANIEM PO ID ---
  useEffect(() => {
    if (loading && stations.length === 0) {
        setFilteredStations([]);
        return;
    };

    let tempFiltered = [...stations];

    // 1. Filtrowanie według wyszukiwania (NAZWA, RZEKA, ID)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.trim(); // Oryginalne zapytanie (np. dla ID)
      const lowerCaseQuery = query.toLowerCase(); // Wersja lowercase (dla nazwy, rzeki)

      tempFiltered = tempFiltered.filter(station => {
          // Bezpieczne pobranie wartości (na wypadek null/undefined)
          const stationIdString = station.id ? station.id.toString() : '';
          const stationNameLower = station.name ? station.name.toLowerCase() : '';
          const stationRiverLower = station.river ? station.river.toLowerCase() : '';

          return (
              // Warunek 1: Nazwa stacji zawiera zapytanie (ignore case)
              stationNameLower.includes(lowerCaseQuery) ||
              // Warunek 2: Nazwa rzeki zawiera zapytanie (ignore case)
              stationRiverLower.includes(lowerCaseQuery) ||
              // Warunek 3: ID stacji (jako string) zawiera zapytanie
              stationIdString.includes(query)
          );
      });
    }

    // 2. Filtrowanie według statusu (bez zmian)
    if (filter === 'alarm') {
      tempFiltered = tempFiltered.filter(station => station.status === 'alarm');
    } else if (filter === 'warning') {
      tempFiltered = tempFiltered.filter(station => station.status === 'warning' || station.status === 'alarm');
    }

    // 3. Sortowanie według statusu (bez zmian)
    tempFiltered = sortStationsByStatus(tempFiltered);

    // 4. Aktualizacja stanu (bez zmian)
    setFilteredStations(tempFiltered);

  }, [searchQuery, stations, filter, loading]); // Zależności bez zmian

  // --- Logika ręcznego odświeżania i nawigacji (bez zmian) ---
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStations();
    setRefreshing(false);
  }, [loadStations]);

  const handleStationPress = useCallback((station) => {
    navigation.navigate('StationDetails', {
      stationId: station.id,
      stationName: station.name
    });
  }, [navigation]);

  // --- Obliczanie liczników (bez zmian) ---
  const { alarmCount, warningCount, totalCount } = useMemo(() => {
      let alarms = 0;
      let warnings = 0;
      stations.forEach(station => {
          if (station.status === 'alarm') alarms++;
          else if (station.status === 'warning') warnings++;
      });
      return { alarmCount: alarms, warningCount: warnings, totalCount: stations.length };
  }, [stations]);

  // --- Funkcja renderująca element listy (bez zmian) ---
  const renderStationItem = useCallback(({ item }) => (
    <StationCard station={item} onPress={() => handleStationPress(item)} />
  ), [handleStationPress]);

  // --- Funkcja renderująca pustą listę (bez zmian) ---
  const renderEmptyList = () => (
      <View style={styles.emptyContainer}>
          <Ionicons name="water-outline" size={64} color={theme.dark ? '#555' : '#CCC'} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              {searchQuery.trim() !== ''
                  ? 'Nie znaleziono stacji pasujących do wyszukiwania.'
                  : filter === 'alarm'
                  ? 'Brak stacji w stanie alarmowym.'
                  : filter === 'warning'
                  ? 'Brak stacji w stanie ostrzegawczym lub alarmowym.'
                  : 'Brak dostępnych stacji.'
              }
          </Text>
      </View>
  );

   // --- Funkcja obsługująca zmianę filtra ---
   const handleFilterChange = (newFilterValue) => {
      setFilter(newFilterValue);
   };

  // --- Główny widok ekranu ---
  if (loading && stations.length === 0) {
    return <Loader message="Ładowanie stacji..." />;
  }

  // Opcje dla Segmented Control
  const filterOptions = [
      { label: `Wszystkie (${totalCount})`, value: 'all' },
      { label: `Ostrz./Alarm (${warningCount + alarmCount})`, value: 'warning' },
      { label: `Alarmowe (${alarmCount})`, value: 'alarm' },
  ];
  const selectedFilterIndex = filterOptions.findIndex(opt => opt.value === filter);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Sekcja Wyszukiwania i Filtrów */}
      <View style={styles.headerContainer}>
        {/* Pasek Wyszukiwania */}
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="search" size={20} color={theme.colors.placeholder} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Szukaj (nazwa, rzeka, ID...)" // Zaktualizowany placeholder
            placeholderTextColor={theme.colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && Platform.OS === 'android' && (
            <Ionicons name="close-circle" size={20} color={theme.colors.placeholder} style={styles.clearIcon} onPress={() => setSearchQuery('')} />
          )}
        </View>

        {/* Kontrolka Segmentowa (Placeholder) */}
        <View style={styles.filterControlContainer}>
          {filterOptions.map((option, index) => (
             <TouchableOpacity
                key={option.value}
                style={[
                    styles.segmentButton,
                    index === 0 && styles.segmentButtonFirst,
                    index === filterOptions.length - 1 && styles.segmentButtonLast,
                    selectedFilterIndex === index
                        ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                        : { borderColor: theme.colors.primary }
                ]}
                onPress={() => handleFilterChange(option.value)}
             >
                <Text style={[
                    styles.segmentButtonText,
                    selectedFilterIndex === index
                        ? { color: theme.colors.background }
                        : { color: theme.colors.primary }
                ]}>
                    {option.label}
                </Text>
             </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Lista stacji */}
      <FlatList
        data={filteredStations}
        renderItem={renderStationItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} tintColor={theme.colors.primary} />
        }
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

// Style (bez zmian)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 40,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
  },
  clearIcon: {
    padding: 4,
  },
  filterControlContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentButtonFirst: {
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
  },
  segmentButtonLast: {
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
  },
  segmentButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
   emptyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  }
});