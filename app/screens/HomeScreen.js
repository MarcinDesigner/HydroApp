// Plik: app/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  RefreshControl, 
  TextInput, 
  TouchableOpacity, 
  Text,
  Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import StationCard from '../components/StationCard';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import Loader from '../components/Loader';
import { fetchStations } from '../api/stationsApi';

// Funkcja pomocnicza do sortowania stacji według statusu
const sortStationsByStatus = (stations) => {
  return [...stations].sort((a, b) => {
    // Priorytet dla statusów: 'alarm' > 'warning' > 'normal'
    const statusPriority = {
      'alarm': 0,
      'warning': 1,
      'normal': 2
    };
    
    // Porównaj według statusu
    const aPriority = statusPriority[a.status] || 3; // Jeśli nieznany status, najniższy priorytet
    const bPriority = statusPriority[b.status] || 3;
    
    return aPriority - bPriority;
  });
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { refreshData, isRefreshing, lastRefreshTime, addListener, removeListener } = useRefresh();
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'warning', 'alarm'

  useEffect(() => {
    loadStations();
  }, []);

  useEffect(() => {
   navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('RiverFlow')}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="git-network-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Settings')}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  // Efekt dla automatycznego odświeżania
  useEffect(() => {
    const onRefreshCallback = () => {
      loadStations(true); // true = cicha aktualizacja (bez wskaźnika ładowania)
    };

    addListener(onRefreshCallback);

    return () => {
      removeListener(onRefreshCallback);
    };
  }, []);

  // Efekt dla filtrowania i sortowania stacji
  useEffect(() => {
    if (stations.length === 0) return;
    
    let filtered = [...stations];
    
    // Filtrowanie według wyszukiwania
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(station => 
        station.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtrowanie według statusu
    if (filter === 'alarm') {
      filtered = filtered.filter(station => station.status === 'alarm');
    } else if (filter === 'warning') {
      filtered = filtered.filter(station => station.status === 'warning' || station.status === 'alarm');
    }
    
    // Sortowanie według statusu (alarmy najpierw)
    filtered = sortStationsByStatus(filtered);
    
    setFilteredStations(filtered);
  }, [searchQuery, stations, filter]);

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

  const onRefresh = () => {
    loadStations();
  };

  const handleStationPress = (station) => {
    navigation.navigate('StationDetails', { 
      stationId: station.id,
      stationName: station.name
    });
  };

  // Zwróć liczbę stacji w stanie alarmowym/ostrzegawczym
  const getStatusCount = (statusType) => {
    return stations.filter(station => station.status === statusType).length;
  };
  
  const alarmCount = getStatusCount('alarm');
  const warningCount = getStatusCount('warning');
  
  // Renderowanie nagłówka z filtrami
  const renderHeader = () => (
    <View style={styles.filtersContainer}>
      <Pressable
        style={[
          styles.filterButton, 
          filter === 'all' && styles.activeFilterButton,
          filter === 'all' && { backgroundColor: theme.colors.primary }
        ]}
        onPress={() => setFilter('all')}
      >
        <Text style={[
          styles.filterButtonText,
          filter === 'all' && styles.activeFilterText
        ]}>
          Wszystkie ({stations.length})
        </Text>
      </Pressable>
      
      <Pressable
        style={[
          styles.filterButton, 
          filter === 'warning' && styles.activeFilterButton,
          filter === 'warning' && { backgroundColor: theme.colors.warning }
        ]}
        onPress={() => setFilter('warning')}
      >
        <Text style={[
          styles.filterButtonText,
          filter === 'warning' && styles.activeFilterText
        ]}>
          Ostrzegawczy ({alarmCount + warningCount})
        </Text>
      </Pressable>
      
      <Pressable
        style={[
          styles.filterButton, 
          filter === 'alarm' && styles.activeFilterButton,
          filter === 'alarm' && { backgroundColor: theme.colors.danger }
        ]}
        onPress={() => setFilter('alarm')}
      >
        <Text style={[
          styles.filterButtonText,
          filter === 'alarm' && styles.activeFilterText
        ]}>
          Alarmowy ({alarmCount})
        </Text>
      </Pressable>
    </View>
  );

  // Status podsumowujący stany rzek
  const renderStatusSummary = () => {
    if (loading || refreshing) return null;
    
    return (
      <View style={[styles.statusSummary, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.statusText, { color: theme.colors.text }]}>
          Stan rzek: {stations.length > 0 ? (
            <>
              <Text style={{ color: theme.colors.danger }}>{alarmCount} alarmowych</Text>, 
              <Text style={{ color: theme.colors.warning }}>{warningCount} ostrzegawczych</Text>, 
              <Text>{stations.length - alarmCount - warningCount} normalnych</Text>
            </>
          ) : 'brak danych'}
        </Text>
      </View>
    );
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
      
      {renderStatusSummary()}
      {renderHeader()}
      
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="water-outline" size={64} color={theme.dark ? '#555' : '#CCC'} />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              {filter !== 'all' 
                ? `Brak stacji w stanie ${filter === 'alarm' ? 'alarmowym' : 'ostrzegawczym'}`
                : 'Brak stacji spełniających kryteria'}
            </Text>
          </View>
        }
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
    marginBottom: 8,
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
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
    flex: 1,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#2196F3',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  statusSummary: {
    margin: 16,
    marginTop: 0,
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  }
});