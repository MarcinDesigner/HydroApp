// Plik: app/widgets/StationWidget.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Switch, 
  Platform, 
  TextInput, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { fetchStations, fetchStationDetails } from '../api/stationsApi';
import widgetService from '../services/widgetService';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Komponent zarządzający widgetem stacji
 */
const StationWidget = () => {
  const { theme } = useTheme();
  const { favorites } = useFavorites();
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [widgetEnabled, setWidgetEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Stany dla wyszukiwania
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('favorites'); // 'favorites', 'code', 'river', 'location'
  const [searchResults, setSearchResults] = useState([]);
  const [allStations, setAllStations] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Ładowanie stanu widgetu i wybranej stacji przy inicjalizacji
  useEffect(() => {
    const loadWidgetState = async () => {
      try {
        // Ładowanie stanu włączenia widgetu
        const widgetEnabledStr = await AsyncStorage.getItem('widget_enabled');
        setWidgetEnabled(widgetEnabledStr === 'true');

        // Ładowanie ID wybranej stacji dla widgetu
        const stationId = await AsyncStorage.getItem('widget_station_id');
        if (stationId) {
          setSelectedStationId(stationId);
          loadStationDetails(stationId);
        }
        
        // Ładowanie wszystkich stacji dla wyszukiwania
        loadAllStations();
      } catch (error) {
        console.error('Błąd podczas ładowania stanu widgetu:', error);
      }
    };

    loadWidgetState();
  }, []);
  
  // Ładowanie wszystkich stacji
  const loadAllStations = async () => {
    try {
      setSearchLoading(true);
      const stations = await fetchStations();
      setAllStations(stations);
      setSearchLoading(false);
    } catch (error) {
      console.error('Błąd podczas ładowania stacji:', error);
      setSearchLoading(false);
    }
  };

  // Pobranie szczegółów stacji
  const loadStationDetails = async (stationId) => {
    if (!stationId) return;

    try {
      setLoading(true);
      const stationData = await fetchStationDetails(stationId);
      setSelectedStation(stationData);
      
      // Jeśli widget jest włączony, aktualizuj dane widgetu
      if (widgetEnabled) {
        await widgetService.updateWidgetData(stationData);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania szczegółów stacji:', error);
      Alert.alert('Błąd', 'Nie udało się pobrać danych stacji');
    } finally {
      setLoading(false);
    }
  };

  // Zmiana wybranej stacji
  const handleStationChange = (stationId) => {
    setSelectedStationId(stationId);
    
    // Zapisz ID stacji w AsyncStorage
    AsyncStorage.setItem('widget_station_id', stationId);
    
    // Pobierz dane stacji
    loadStationDetails(stationId);
    
    // Resetuj wyszukiwanie
    setSearchQuery('');
    setSearchResults([]);
    setSearchMode('favorites');
  };
  
  // Usuwanie wybranej stacji
  const handleRemoveStation = async () => {
    if (!selectedStationId) return;
    
    Alert.alert(
      'Usuń stację',
      'Czy na pewno chcesz usunąć tę stację z widgetu?',
      [
        {
          text: 'Anuluj',
          style: 'cancel'
        },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            // Usuń z AsyncStorage
            await AsyncStorage.removeItem('widget_station_id');
            
            // Resetuj stany
            setSelectedStationId(null);
            setSelectedStation(null);
            
            // Powiadom użytkownika
            Alert.alert('Sukces', 'Stacja została usunięta z widgetu');
          }
        }
      ]
    );
  };

  // Włączanie/wyłączanie widgetu
  const toggleWidget = async (value) => {
    setWidgetEnabled(value);
    
    // Zapisz stan widgetu w AsyncStorage
    await AsyncStorage.setItem('widget_enabled', value.toString());
    
    if (value && selectedStation) {
      // Włączenie widgetu - aktualizuj dane
      await widgetService.updateWidgetData(selectedStation);
      Alert.alert(
        'Widget włączony',
        'Dodaj widget stacji hydrologicznej do ekranu głównego, aby monitorować stan wody'
      );
    }
  };

  // Aktualizacja danych widgetu
  const updateWidget = async () => {
    if (!selectedStation) {
      Alert.alert('Uwaga', 'Najpierw wybierz stację');
      return;
    }

    try {
      setLoading(true);
      
      // Pobierz najnowsze dane stacji
      const updatedStation = await fetchStationDetails(selectedStationId);
      setSelectedStation(updatedStation);
      
      // Aktualizuj widget
      const success = await widgetService.updateWidgetData(updatedStation);
      
      if (success) {
        Alert.alert('Sukces', 'Widget został zaktualizowany');
      } else {
        Alert.alert('Błąd', 'Nie udało się zaktualizować widgetu');
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji widgetu:', error);
      Alert.alert('Błąd', 'Wystąpił problem podczas aktualizacji widgetu');
    } finally {
      setLoading(false);
    }
  };
  
  // Wyszukiwanie stacji
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    
    // Wyszukiwanie na podstawie wybranego trybu
    let results = [];
    const query = searchQuery.toLowerCase().trim();
    
    switch (searchMode) {
      case 'code':
        // Wyszukiwanie po kodzie stacji
        results = allStations.filter(station => 
          station.id && station.id.toString().includes(query)
        );
        break;
      
      case 'river':
        // Wyszukiwanie po nazwie rzeki
        results = allStations.filter(station => 
          station.river && station.river.toLowerCase().includes(query)
        );
        break;
      
      case 'location':
        // Wyszukiwanie po nazwie miejscowości
        results = allStations.filter(station => 
          station.name && station.name.toLowerCase().includes(query)
        );
        break;
      
      default:
        results = [];
    }
    
    setSearchResults(results);
    setSearchLoading(false);
  };
  
  // Efekt uruchamiający wyszukiwanie po zmianie zapytania
  useEffect(() => {
    if (searchMode !== 'favorites' && searchQuery.trim()) {
      // Używamy timeoutu, aby nie uruchamiać wyszukiwania przy każdym naciśnięciu klawisza
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchMode]);

  // Renderowanie paska wyszukiwania
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={[styles.searchInputContainer, { backgroundColor: theme.dark ? '#333' : '#f0f0f0' }]}>
        <Ionicons name="search" size={20} color={theme.dark ? '#AAA' : '#666'} />
        <TextInput 
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Wyszukaj stację..."
          placeholderTextColor={theme.dark ? '#AAA' : '#888'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.dark ? '#AAA' : '#666'} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.searchTabsContainer}>
        <TouchableOpacity 
          style={[
            styles.searchTab, 
            searchMode === 'favorites' && { 
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary 
            },
            { borderColor: theme.colors.border }
          ]}
          onPress={() => setSearchMode('favorites')}
        >
          <Text style={[
            styles.searchTabText, 
            { color: searchMode === 'favorites' ? 'white' : theme.colors.text }
          ]}>
            Ulubione
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.searchTab, 
            searchMode === 'code' && { 
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary 
            },
            { borderColor: theme.colors.border }
          ]}
          onPress={() => setSearchMode('code')}
        >
          <Text style={[
            styles.searchTabText, 
            { color: searchMode === 'code' ? 'white' : theme.colors.text }
          ]}>
            Kod
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.searchTab, 
            searchMode === 'river' && { 
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary 
            },
            { borderColor: theme.colors.border }
          ]}
          onPress={() => setSearchMode('river')}
        >
          <Text style={[
            styles.searchTabText, 
            { color: searchMode === 'river' ? 'white' : theme.colors.text }
          ]}>
            Rzeka
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.searchTab, 
            searchMode === 'location' && { 
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary 
            },
            { borderColor: theme.colors.border }
          ]}
          onPress={() => setSearchMode('location')}
        >
          <Text style={[
            styles.searchTabText, 
            { color: searchMode === 'location' ? 'white' : theme.colors.text }
          ]}>
            Miejscowość
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderowanie listy ulubionych stacji
  const renderFavoritesList = () => {
    if (favorites.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            Dodaj stacje do ulubionych, aby wybrać stację dla widgetu
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.stationsContainer}>
        {favorites.map((stationId) => {
          // Znajdź pełne dane stacji, jeśli są dostępne
          const stationData = allStations.find(s => s.id?.toString() === stationId?.toString());
          
          return (
            <TouchableOpacity
              key={stationId}
              style={[
                styles.stationItem,
                selectedStationId === stationId && { backgroundColor: theme.colors.primary },
                { borderColor: theme.colors.border }
              ]}
              onPress={() => handleStationChange(stationId)}
            >
              <View style={styles.stationItemContent}>
                <Text
                  style={[
                    styles.stationName,
                    { color: selectedStationId === stationId ? 'white' : theme.colors.text }
                  ]}
                >
                  {stationData ? stationData.name : stationId}
                </Text>
                {stationData && (
                  <Text
                    style={[
                      styles.stationSubtitle,
                      { color: selectedStationId === stationId ? '#E0E0E0' : theme.dark ? '#AAA' : '#666' }
                    ]}
                  >
                    {stationData.river || 'Brak danych'}
                  </Text>
                )}
              </View>
              {selectedStationId === stationId && (
                <Ionicons name="checkmark-circle" size={20} color="white" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  
  // Renderowanie wyników wyszukiwania
  const renderSearchResults = () => {
    if (searchLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Wyszukiwanie...
          </Text>
        </View>
      );
    }
    
    if (searchResults.length === 0 && searchQuery.trim() !== '') {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            Nie znaleziono stacji spełniających kryteria wyszukiwania
          </Text>
        </View>
      );
    }
    
    if (searchResults.length === 0) {
      return null;
    }
    
    // Użyjemy zwykłego View z map zamiast FlatList, aby uniknąć zagnieżdżania list
    return (
      <View style={styles.searchResultsList}>
        {searchResults.map(item => (
          <TouchableOpacity
            key={item.id.toString()}
            style={[
              styles.searchResultItem,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
            ]}
            onPress={() => handleStationChange(item.id)}
          >
            <View>
              <Text style={[styles.searchResultName, { color: theme.colors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.searchResultDetails, { color: theme.dark ? '#AAA' : '#666' }]}>
                {item.river ? `Rzeka: ${item.river}` : 'Brak danych o rzece'}
              </Text>
              <Text style={[styles.searchResultDetails, { color: theme.dark ? '#AAA' : '#666' }]}>
                ID: {item.id}
              </Text>
            </View>
            <View style={[
              styles.statusDot, 
              { 
                backgroundColor: 
                  item.status === 'alarm' ? theme.colors.danger :
                  item.status === 'warning' ? theme.colors.warning :
                  theme.colors.safe
              }
            ]} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Widget stacji hydrologicznej
        </Text>
      </View>

      <View style={styles.switchContainer}>
        <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
          Włącz widget
        </Text>
        <Switch
          value={widgetEnabled}
          onValueChange={toggleWidget}
          trackColor={{ false: '#767577', true: theme.colors.primary }}
          thumbColor={Platform.OS === 'android' ? (widgetEnabled ? theme.colors.primary : '#f4f3f4') : ''}
        />
      </View>

      {widgetEnabled && (
        <>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Wybierz stację do wyświetlania
          </Text>
          
          {/* Pasek wyszukiwania */}
          {renderSearchBar()}
          
          {/* Lista ulubionych lub wyniki wyszukiwania */}
          {searchMode === 'favorites' 
            ? renderFavoritesList() 
            : renderSearchResults()
          }

          {selectedStation && (
            <View style={[styles.previewContainer, { borderColor: theme.colors.border }]}>
              <View style={styles.previewHeader}>
                <Text style={[styles.previewTitle, { color: theme.colors.text }]}>
                  Podgląd widgetu
                </Text>
                
                {/* Przycisk do usuwania wybranej stacji */}
                {selectedStationId && (
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={handleRemoveStation}
                  >
                    <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={[styles.preview, { backgroundColor: 'white' }]}>
                <View style={styles.previewHeader}>
                  <Text style={styles.previewStationName}>{selectedStation.name}</Text>
                  <View 
                    style={[
                      styles.statusDot, 
                      { 
                        backgroundColor: 
                          selectedStation.status === 'alarm' ? theme.colors.danger :
                          selectedStation.status === 'warning' ? theme.colors.warning :
                          theme.colors.safe
                      }
                    ]} 
                  />
                </View>
                
                <Text style={styles.previewRiver}>{selectedStation.river}</Text>
                
                <View style={styles.previewLevel}>
                  <Text style={styles.previewLevelValue}>{selectedStation.level}</Text>
                  <Text style={styles.previewLevelUnit}>cm</Text>
                  
                  <Text style={[
                    styles.previewTrend,
                    { 
                      color: 
                        selectedStation.trend === 'up' ? theme.colors.danger :
                        selectedStation.trend === 'down' ? theme.colors.safe :
                        'gray'
                    }
                  ]}>
                    {selectedStation.trend === 'up' ? '↑' : 
                     selectedStation.trend === 'down' ? '↓' : '→'}
                  </Text>
                </View>
                
                <Text style={styles.previewUpdate}>
                  Aktualizacja: {selectedStation.updateTime}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.updateButton,
              { backgroundColor: theme.colors.primary },
              loading && { opacity: 0.7 }
            ]}
            onPress={updateWidget}
            disabled={loading || !selectedStation}
          >
            <Text style={styles.updateButtonText}>
              {loading ? 'Aktualizowanie...' : 'Aktualizuj widget'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, { color: theme.dark ? '#AAA' : '#666' }]}>
          {Platform.OS === 'android' 
            ? 'Dodaj widget do ekranu głównego poprzez długie przytrzymanie palca na pustym obszarze ekranu głównego, a następnie wybierz "Widgety" i znajdź "HydroApp".'
            : 'Dodaj widget do ekranu głównego poprzez długie przytrzymanie palca na pustym obszarze ekranu głównego, a następnie naciśnij "+" i znajdź "HydroApp".'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  stationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  stationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 120,
  },
  stationItemContent: {
    flex: 1,
    marginRight: 4,
  },
  stationName: {
    fontSize: 14,
    fontWeight: '500',
  },
  stationSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  previewContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
  },
  preview: {
    padding: 16,
    borderRadius: 8,
  },
  previewStationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  previewRiver: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 12,
  },
  previewLevel: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  previewLevelValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  previewLevelUnit: {
    fontSize: 14,
    color: 'black',
    marginLeft: 4,
    marginBottom: 4,
  },
  previewTrend: {
    fontSize: 18,
    marginLeft: 'auto',
  },
  previewUpdate: {
    fontSize: 12,
    color: 'gray',
  },
  updateButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
  },
  infoContainer: {
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  // Style dla wyszukiwania
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    paddingVertical: 4,
  },
  searchTabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  searchTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  searchTabText: {
    fontSize: 12,
    fontWeight: '500',
  },
  searchResultsList: {
    maxHeight: 200,
    marginBottom: 16,
    overflow: 'scroll',
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  searchResultDetails: {
    fontSize: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  }
});

export default StationWidget;