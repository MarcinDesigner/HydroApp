// Plik: app/screens/AlertsScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import { fetchAreaWarnings } from '../api/stationsApi';

// Lista województw w Polsce
const REGIONS = [
  'dolnośląskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie', 'łódzkie',
  'małopolskie', 'mazowieckie', 'opolskie', 'podkarpackie', 'podlaskie',
  'pomorskie', 'śląskie', 'świętokrzyskie', 'warmińsko-mazurskie', 'wielkopolskie',
  'zachodniopomorskie'
];

export default function AlertsScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { isRefreshing, addListener, removeListener } = useRefresh();
  
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null); // null oznacza wszystkie regiony
  
  useEffect(() => {
    loadAlerts();
    
    // Dodaj listener dla globalnego refreshData
    const onRefreshCallback = () => {
      loadAlerts(true); // cicha aktualizacja
    };
    
    addListener(onRefreshCallback);
    
    // Cleanup
    return () => {
      removeListener(onRefreshCallback);
    };
  }, []);
  
  useEffect(() => {
    // Filtruj alerty po zmianie regionu lub alertów
    if (selectedRegion) {
      setFilteredAlerts(alerts.filter(alert => 
        alert.regionId === selectedRegion || 
        (alert.regionName && alert.regionName.toLowerCase().includes(selectedRegion.toLowerCase()))
      ));
    } else {
      setFilteredAlerts(alerts);
    }
  }, [selectedRegion, alerts]);
  
  const loadAlerts = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setRefreshing(true);
      }
      
      // Pobierz wszystkie alerty
      const data = await fetchAreaWarnings();
      
      // Mapowanie danych z API na format alertów używany w aplikacji
      const mappedAlerts = data.map((warning, index) => ({
        id: warning.uniqueId || `warning-${index}-${Date.now()}`,
        stationId: warning.id_stacji,
        stationName: warning.stacja || warning.nazwa_obszaru || 'Nieznana stacja',
        title: warning.opis_zagrozenia || 'Ostrzeżenie hydrologiczne',
        event: warning.zjawisko || warning.opis_zagrozenia || 'Alert hydrologiczny',
        course: warning.przebieg || `Poziom: ${warning.stan || 'N/A'} cm`,
        level: warning.stan ? parseInt(warning.stan) : 0,
        threshold: warning.stan_ostrzegawczy ? parseInt(warning.stan_ostrzegawczy) : 0,
        time: warning.waznosc_od ? `Od ${warning.waznosc_od} do ${warning.waznosc_do}` : new Date().toLocaleString(),
        regionName: warning.regionName || warning.nazwa_obszaru || warning.wojewodztwo || 'Nieznany region',
        regionId: warning.regionId || null
      }));
      
      setAlerts(mappedAlerts);
      
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };
  
  const onRefresh = () => {
    loadAlerts();
  };
  
  const showAlertDetails = (alert) => {
    Alert.alert(
      alert.title || 'Ostrzeżenie hydrologiczne',
      `Zdarzenie: ${alert.event || 'Brak informacji'}\n\nPrzebieg: ${alert.course || 'Brak informacji'}\n\nRegion: ${alert.regionName || 'Nieznany'}\n\nCzas: ${alert.time || new Date().toLocaleString()}\n\nPoziom: ${alert.level || 'Nieznany'} cm\n\nPróg: ${alert.threshold || 'Nieznany'} cm`,
      [{ text: 'OK' }]
    );
  };
  
  const navigateToStation = (stationId, stationName) => {
    if (stationId) {
      navigation.navigate('StationDetails', { stationId, stationName });
    }
  };
  
  const renderAlertItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.alertItem, 
        { 
          backgroundColor: 
            item.level > (item.threshold || 0) * 1.5 ? '#FF5252' : 
            item.level > (item.threshold || 0) ? '#FFA726' : '#42A5F5'
        }
      ]}
      onPress={() => showAlertDetails(item)}
    >
      <View style={styles.alertHeader}>
        <Ionicons name="warning-outline" size={24} color="white" />
        <Text style={styles.alertTitle}>
          {item.title || `Ostrzeżenie: ${item.regionName || 'Obszar nieznany'}`}
        </Text>
      </View>
      
      <View style={styles.alertContent}>
        <Text style={styles.alertText}>
          Zdarzenie: {item.event || 'Brak informacji'}
        </Text>
        <Text style={styles.alertText} numberOfLines={2}>
          Przebieg: {item.course || 'Brak informacji'}
        </Text>
        <Text style={styles.alertText}>
          Region: {item.regionName || 'Nieznany'}
        </Text>
        {item.stationId && (
          <TouchableOpacity 
            style={styles.stationButton}
            onPress={() => navigateToStation(item.stationId, item.stationName)}
          >
            <Text style={styles.stationButtonText}>
              Zobacz stację: {item.stationName}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.alertTime}>
          {item.time || new Date().toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.filterContainer}>
        <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
          Filtruj według województwa:
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Wszystkie', ...REGIONS].map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.regionButton,
                selectedRegion === (item === 'Wszystkie' ? null : item) && 
                  { backgroundColor: theme.colors.primary }
              ]}
              onPress={() => setSelectedRegion(item === 'Wszystkie' ? null : item)}
            >
              <Text
                style={[
                  styles.regionButtonText,
                  selectedRegion === (item === 'Wszystkie' ? null : item) && 
                    { color: 'white' }
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Ładowanie alertów...
          </Text>
        </View>
      ) : filteredAlerts.length > 0 ? (
        <FlatList
          data={filteredAlerts}
          renderItem={renderAlertItem}
          keyExtractor={(item) => item.id || `alert-${Math.random()}`}
          contentContainerStyle={styles.alertsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isRefreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      ) : (
        <View style={styles.noAlertsContainer}>
          <Ionicons 
            name="checkmark-circle-outline" 
            size={64} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.noAlertsText, { color: theme.colors.text }]}>
            Brak aktualnych ostrzeżeń
            {selectedRegion ? ` dla województwa ${selectedRegion}` : ''}
          </Text>
          <TouchableOpacity
            style={[styles.refreshButton, { backgroundColor: theme.colors.primary }]}
            onPress={onRefresh}
          >
            <Text style={styles.refreshButtonText}>Odśwież</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  regionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#EEEEEE',
  },
  regionButtonText: {
    fontSize: 14,
    color: '#555555',
  },
  alertsList: {
    padding: 16,
  },
  alertItem: {
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  alertTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  alertContent: {
    padding: 12,
  },
  alertText: {
    color: 'white',
    marginBottom: 4,
  },
  stationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    alignItems: 'center',
  },
  stationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  alertTime: {
    color: 'white',
    fontSize: 12,
    textAlign: 'right',
    fontStyle: 'italic',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  noAlertsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noAlertsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
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
});