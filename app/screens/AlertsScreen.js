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
  ScrollView,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import { fetchAreaWarnings } from '../api/stationsApi';
import CustomAlertManager from '../components/CustomAlertManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [expandedAlertId, setExpandedAlertId] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Animacje
  const [fadeAnims] = useState(() => Array(20).fill(0).map(() => new Animated.Value(0)));
  
  // Sprawdź, czy powiadomienia są włączone
  useEffect(() => {
    const checkNotificationsEnabled = async () => {
      try {
        const setting = await AsyncStorage.getItem('notifications_enabled');
        setNotificationsEnabled(setting === null || setting === 'true');
      } catch (error) {
        console.error('Błąd podczas sprawdzania ustawień powiadomień:', error);
        setNotificationsEnabled(true); // Domyślnie włączone
      }
    };
    
    checkNotificationsEnabled();
  }, []);
  
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
    
    // Animuj pojawienie się nowych alertów
    fadeAnims.forEach((anim, index) => {
      if (index < alerts.length) {
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true
        }).start();
      }
    });
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
        regionId: warning.regionId || null,
        severity: warning.stopien_zagrozenia 
                ? parseInt(warning.stopien_zagrozenia) 
                : warning.stan > (warning.stan_ostrzegawczy || 0) * 1.5 ? 3 
                : warning.stan > (warning.stan_ostrzegawczy || 0) ? 2 
                : 1,
        type: warning.stan > (warning.stan_ostrzegawczy || 0) * 1.5 ? 'alarm' : 
              warning.stan > (warning.stan_ostrzegawczy || 0) ? 'warning' : 'info'
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
  
  // Funkcja zmiany regionu
  const changeRegion = (region) => {
    setSelectedRegion(region);
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
  
  // Przełącza rozwinięcie/zwinięcie alertu
  const toggleAlertExpansion = (alertId) => {
    setExpandedAlertId(expandedAlertId === alertId ? null : alertId);
  };
  
  // Określa kolor alertu na podstawie typu
  const getAlertColor = (alert) => {
    switch (alert.type) {
      case 'alarm': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      case 'info': default: return theme.colors.info;
    }
  };
  
  const renderAlertItem = ({ item, index }) => {
    const isExpanded = expandedAlertId === item.id;
    const alertColor = getAlertColor(item);
    
    return (
      <Animated.View style={{ opacity: fadeAnims[index] || 1 }}>
        <TouchableOpacity 
          style={[
            styles.alertItem, 
            { 
              backgroundColor: theme.dark ? '#2c3e50' : 'white',
              borderLeftColor: alertColor,
              borderLeftWidth: 4
            }
          ]}
          onPress={() => toggleAlertExpansion(item.id)}
        >
          <View style={styles.alertHeader}>
            <Ionicons 
              name={item.type === 'alarm' ? 'warning' : item.type === 'warning' ? 'alert-circle' : 'information-circle-outline'} 
              size={24} 
              color={alertColor} 
            />
            <Text style={[styles.alertTitle, { color: theme.colors.text }]}>
              {item.title || `Ostrzeżenie: ${item.regionName || 'Obszar nieznany'}`}
            </Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.dark ? '#aaa' : '#666'}
            />
          </View>
          
          {isExpanded ? (
            <View style={styles.alertContent}>
              <View style={styles.alertDetailRow}>
                <Ionicons name="flash-outline" size={16} color={theme.dark ? '#aaa' : '#666'} />
                <Text style={styles.alertDetailLabel}>Zdarzenie:</Text>
                <Text style={[styles.alertDetailText, { color: theme.colors.text }]}>
                  {item.event || 'Brak informacji'}
                </Text>
              </View>
              
              <View style={styles.alertDetailRow}>
                <Ionicons name="document-text-outline" size={16} color={theme.dark ? '#aaa' : '#666'} />
                <Text style={styles.alertDetailLabel}>Przebieg:</Text>
                <Text style={[styles.alertDetailText, { color: theme.colors.text }]} numberOfLines={3}>
                  {item.course || 'Brak informacji'}
                </Text>
              </View>
              
              <View style={styles.alertDetailRow}>
                <Ionicons name="location-outline" size={16} color={theme.dark ? '#aaa' : '#666'} />
                <Text style={styles.alertDetailLabel}>Region:</Text>
                <Text style={[styles.alertDetailText, { color: theme.colors.text }]}>
                  {item.regionName || 'Nieznany'}
                </Text>
              </View>
              
              <View style={styles.alertDetailRow}>
                <Ionicons name="time-outline" size={16} color={theme.dark ? '#aaa' : '#666'} />
                <Text style={styles.alertDetailLabel}>Czas:</Text>
                <Text style={[styles.alertDetailText, { color: theme.colors.text }]}>
                  {item.time || new Date().toLocaleString()}
                </Text>
              </View>
              
              {item.stationId && (
                <TouchableOpacity 
                  style={[styles.stationButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => navigateToStation(item.stationId, item.stationName)}
                >
                  <Ionicons name="navigate" size={16} color="white" style={styles.buttonIcon} />
                  <Text style={styles.stationButtonText}>
                    Zobacz stację: {item.stationName}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.detailsButton, { backgroundColor: theme.colors.secondary || '#009688' }]}
                onPress={() => showAlertDetails(item)}
              >
                <Ionicons name="information-circle-outline" size={16} color="white" style={styles.buttonIcon} />
                <Text style={styles.detailsButtonText}>
                  Więcej szczegółów
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.alertSummary}>
              <View style={styles.alertSummaryContent}>
                <Text style={[styles.alertEvent, { color: theme.colors.text }]} numberOfLines={1}>
                  {item.event || 'Brak informacji'}
                </Text>
                <Text style={styles.alertTime}>
                  {item.time || new Date().toLocaleString()}
                </Text>
              </View>
              <View style={[styles.severityBadge, { backgroundColor: alertColor }]}>
                <Text style={styles.severityText}>
                  {item.type === 'alarm' ? 'ALARM' : item.type === 'warning' ? 'OSTRZEŻENIE' : 'INFO'}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Manager alertów - pokazuje alerty jako wyskakujące powiadomienia */}
      {notificationsEnabled && (
        <CustomAlertManager 
          alerts={filteredAlerts.slice(0, 3).map(alert => ({
            ...alert,
            message: alert.event,
            description: alert.course
          }))} 
          onPress={(alert) => navigateToStation(alert.stationId, alert.stationName)}
        />
      )}
      
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
              onPress={() => changeRegion(item === 'Wszystkie' ? null : item)}
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
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  alertTitle: {
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
  alertSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  alertSummaryContent: {
    flex: 1,
    marginRight: 8,
  },
  alertEvent: {
    fontSize: 14,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  alertContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  alertDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  alertDetailLabel: {
    marginLeft: 6,
    marginRight: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  alertDetailText: {
    flex: 1,
    fontSize: 14,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 8,
  },
  stationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
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