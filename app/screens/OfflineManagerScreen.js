// Plik: app/screens/OfflineManagerScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { 
  downloadOfflineData, 
  getOfflineDataTimestamp, 
  clearOfflineData,
  setOfflineMode,
  isOfflineMode
} from '../services/offlineService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OfflineManagerScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [lastDownload, setLastDownload] = useState(null);
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(false);
  const [storageInfo, setStorageInfo] = useState({
    stations: 0,
    stationDetails: 0,
    size: '0 KB'
  });
  
  // Ładowanie danych przy wejściu na ekran
  useEffect(() => {
    const loadData = async () => {
      // Pobierz timestamp ostatniego pobierania danych
      const timestamp = await getOfflineDataTimestamp();
      setLastDownload(timestamp);
      
      // Sprawdź, czy tryb offline jest włączony
      const offline = await isOfflineMode();
      setOfflineModeEnabled(offline);
      
      // Pobierz informacje o zajętości pamięci
      await calculateStorageUsage();
    };
    
    loadData();
    
    // Ustawienie przycisku powrotu
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 8 }}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
      ),
      title: "Zarządzanie trybem offline"
    });
  }, [navigation]);
  
  // Funkcja do obliczania zajętości pamięci przez dane
  const calculateStorageUsage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const hydroKeys = keys.filter(key => key.startsWith('hydro_'));
      
      const stationsKey = hydroKeys.find(key => key === 'hydro_offline_data');
      const stationDetailsKeys = hydroKeys.filter(key => key.startsWith('hydro_station_'));
      
      let totalSize = 0;
      
      // Oblicz rozmiar danych stacji
      if (stationsKey) {
        const stationsData = await AsyncStorage.getItem(stationsKey);
        totalSize += stationsData ? stationsData.length : 0;
      }
      
      // Oblicz rozmiar danych szczegółowych stacji
      for (const key of stationDetailsKeys) {
        const stationData = await AsyncStorage.getItem(key);
        totalSize += stationData ? stationData.length : 0;
      }
      
      // Konwertuj rozmiar na KB lub MB
      const sizeInKB = totalSize / 1024;
      const sizeStr = sizeInKB > 1024 
        ? `${(sizeInKB / 1024).toFixed(2)} MB` 
        : `${sizeInKB.toFixed(2)} KB`;
      
      setStorageInfo({
        stations: stationsKey ? 1 : 0,
        stationDetails: stationDetailsKeys.length,
        size: sizeStr
      });
    } catch (error) {
      console.error('Błąd podczas obliczania zajętości pamięci:', error);
    }
  };
  
  // Funkcja pobierająca dane offline
  const handleDownloadData = async () => {
    try {
      setLoading(true);
      setDownloadProgress('Przygotowanie do pobierania...');
      
      // Pobierz dane offline
      setDownloadProgress('Pobieranie danych stacji...');
      const result = await downloadOfflineData();
      
      setLoading(false);
      setDownloadProgress(null);
      
      if (result.success) {
        // Aktualizuj UI
        setLastDownload(new Date());
        await calculateStorageUsage();
        
        Alert.alert(
          'Sukces',
          `Pobrano dane ${result.stationsCount} stacji i szczegóły dla ${result.detailsCount} stacji.`
        );
      } else {
        Alert.alert(
          'Błąd',
          `Nie udało się pobrać danych: ${result.error}`
        );
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych offline:', error);
      setLoading(false);
      setDownloadProgress(null);
      
      Alert.alert(
        'Błąd',
        'Wystąpił problem podczas pobierania danych offline.'
      );
    }
  };
  
  // Funkcja włączająca/wyłączająca tryb offline
  const toggleOfflineMode = async () => {
    try {
      const newValue = !offlineModeEnabled;
      await setOfflineMode(newValue);
      setOfflineModeEnabled(newValue);
      
      // Pokaz komunikat
      Alert.alert(
        'Tryb offline',
        newValue 
          ? 'Tryb offline został włączony. Aplikacja będzie korzystać z zapisanych danych.'
          : 'Tryb offline został wyłączony. Aplikacja będzie pobierać aktualne dane z sieci.'
      );
    } catch (error) {
      console.error('Błąd podczas przełączania trybu offline:', error);
    }
  };
  
  // Funkcja czyszcząca dane offline
  const handleClearData = () => {
    Alert.alert(
      'Czyszczenie danych',
      'Czy na pewno chcesz usunąć wszystkie zapisane dane offline?',
      [
        {
          text: 'Anuluj',
          style: 'cancel'
        },
        {
          text: 'Wyczyść',
          onPress: async () => {
            try {
              setLoading(true);
              await clearOfflineData();
              setLastDownload(null);
              await calculateStorageUsage();
              setLoading(false);
            } catch (error) {
              console.error('Błąd podczas czyszczenia danych:', error);
              setLoading(false);
              
              Alert.alert(
                'Błąd',
                'Wystąpił problem podczas czyszczenia danych offline.'
              );
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Karta statusu */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Status danych offline
        </Text>
        
        <View style={styles.infoRow}>
          <Ionicons 
            name="time-outline" 
            size={20} 
            color={theme.colors.primary} 
            style={styles.infoIcon} 
          />
          <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
            Ostatnie pobranie:
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {lastDownload 
              ? lastDownload.toLocaleString('pl-PL') 
              : 'Brak'
            }
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons 
            name="server-outline" 
            size={20} 
            color={theme.colors.primary} 
            style={styles.infoIcon} 
          />
          <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
            Przechowywane dane:
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {storageInfo.stations > 0 
              ? `${storageInfo.stations} stacje, ${storageInfo.stationDetails} szczegóły` 
              : 'Brak danych'
            }
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons 
            name="save-outline" 
            size={20} 
            color={theme.colors.primary} 
            style={styles.infoIcon} 
          />
          <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
            Zajętość pamięci:
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {storageInfo.size}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons 
            name={offlineModeEnabled ? "cloud-offline-outline" : "cloud-outline"} 
            size={20} 
            color={theme.colors.primary} 
            style={styles.infoIcon} 
          />
          <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
            Tryb offline:
          </Text>
          <Text 
            style={[
              styles.infoValue, 
              { 
                color: offlineModeEnabled ? theme.colors.warning : theme.colors.text
              }
            ]}
          >
            {offlineModeEnabled ? 'Włączony' : 'Wyłączony'}
          </Text>
        </View>
      </View>
      
      {/* Sekcja akcji */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Zarządzanie danymi
        </Text>
        
        <Text style={[styles.cardDescription, { color: theme.colors.caption }]}>
          Pobierz dane stacji, aby móc korzystać z aplikacji bez dostępu do internetu.
          Włącz tryb offline, aby korzystać tylko z zapisanych danych.
        </Text>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.primary },
              loading && { opacity: 0.7 }
            ]}
            onPress={handleDownloadData}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="cloud-download-outline" size={20} color="white" />
            )}
            <Text style={styles.actionButtonText}>
              {loading ? 'Pobieranie...' : 'Pobierz dane offline'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              { 
                backgroundColor: offlineModeEnabled 
                  ? theme.colors.warning 
                  : theme.colors.secondary
              }
            ]}
            onPress={toggleOfflineMode}
          >
            <Ionicons 
              name={offlineModeEnabled ? "cloud-offline-outline" : "cloud-outline"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.actionButtonText}>
              {offlineModeEnabled ? 'Wyłącz tryb offline' : 'Włącz tryb offline'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.danger }
            ]}
            onPress={handleClearData}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.actionButtonText}>
              Wyczyść dane offline
            </Text>
          </TouchableOpacity>
        </View>
        
        {downloadProgress && (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.progressText, { color: theme.colors.text }]}>
              {downloadProgress}
            </Text>
          </View>
        )}
      </View>
      
      {/* Sekcja wskazówek */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Wskazówki
        </Text>
        
        <View style={styles.tipItem}>
          <Ionicons 
            name="information-circle-outline" 
            size={20} 
            color={theme.colors.primary} 
            style={styles.tipIcon} 
          />
          <Text style={[styles.tipText, { color: theme.colors.text }]}>
            Pobrane dane są przechowywane na urządzeniu i mogą być używane, gdy nie masz dostępu do internetu.
          </Text>
        </View>
        
        <View style={styles.tipItem}>
          <Ionicons 
            name="information-circle-outline" 
            size={20} 
            color={theme.colors.primary} 
            style={styles.tipIcon} 
          />
          <Text style={[styles.tipText, { color: theme.colors.text }]}>
            W trybie offline zobaczysz stare dane, które mogą nie odzwierciedlać aktualnego stanu wody.
          </Text>
        </View>
        
        <View style={styles.tipItem}>
          <Ionicons 
            name="information-circle-outline" 
            size={20} 
            color={theme.colors.primary} 
            style={styles.tipIcon} 
          />
          <Text style={[styles.tipText, { color: theme.colors.text }]}>
            Zalecamy aktualizować dane offline przynajmniej raz dziennie, gdy masz dostęp do internetu.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    width: 140,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  buttonsContainer: {
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  progressText: {
    marginLeft: 8,
    fontSize: 14,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  }
});

export default OfflineManagerScreen;