// Plik: app/services/offlineService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { fetchStations, fetchStationDetails } from '../api/stationsApi';

// Klucze do przechowywania danych w pamięci
const OFFLINE_DATA_KEY = 'hydro_offline_data';
const OFFLINE_TIMESTAMP_KEY = 'hydro_offline_timestamp';
const OFFLINE_MODE_KEY = 'hydro_offline_mode';

// Funkcja sprawdzająca, czy aplikacja jest w trybie offline
export const isOfflineMode = async () => {
  try {
    const offlineMode = await AsyncStorage.getItem(OFFLINE_MODE_KEY);
    return offlineMode === 'true';
  } catch (error) {
    console.error('Błąd podczas sprawdzania trybu offline:', error);
    return false;
  }
};

// Funkcja włączająca/wyłączająca tryb offline
export const setOfflineMode = async (enabled) => {
  try {
    await AsyncStorage.setItem(OFFLINE_MODE_KEY, enabled.toString());
    return true;
  } catch (error) {
    console.error('Błąd podczas ustawiania trybu offline:', error);
    return false;
  }
};

// Funkcja sprawdzająca połączenie internetowe
export const checkConnectivity = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  } catch (error) {
    console.error('Błąd podczas sprawdzania połączenia:', error);
    return false;
  }
};

// Funkcja pobierająca dane ze źródła online lub offline
export const getStationsData = async (forceOffline = false) => {
  try {
    // Sprawdź tryb offline
    const offlineMode = forceOffline || await isOfflineMode();
    
    // Sprawdź połączenie
    const isConnected = await checkConnectivity();
    
    // Jeśli jesteśmy w trybie offline lub nie ma połączenia, użyj danych z pamięci
    if (offlineMode || !isConnected) {
      console.log('Używam danych offline');
      const offlineData = await AsyncStorage.getItem(OFFLINE_DATA_KEY);
      if (offlineData) {
        return JSON.parse(offlineData);
      }
      throw new Error('Brak zapisanych danych offline');
    }
    
    // Pobierz dane online
    console.log('Pobieram dane online');
    const stationsData = await fetchStations();
    
    // Zapisz dane do pamięci podręcznej
    await AsyncStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(stationsData));
    await AsyncStorage.setItem(OFFLINE_TIMESTAMP_KEY, Date.now().toString());
    
    return stationsData;
  } catch (error) {
    console.error('Błąd podczas pobierania danych stacji:', error);
    
    // W przypadku błędu, spróbuj użyć danych z pamięci podręcznej
    const offlineData = await AsyncStorage.getItem(OFFLINE_DATA_KEY);
    if (offlineData) {
      return JSON.parse(offlineData);
    }
    
    throw error; // Rzuć błąd dalej, jeśli nie ma danych w pamięci
  }
};

// Funkcja pobierająca szczegóły stacji ze źródła online lub offline
export const getStationDetails = async (stationId, forceOffline = false) => {
  try {
    // Sprawdź tryb offline
    const offlineMode = forceOffline || await isOfflineMode();
    
    // Sprawdź połączenie
    const isConnected = await checkConnectivity();
    
    // Jeśli jesteśmy w trybie offline lub nie ma połączenia, użyj danych z pamięci
    if (offlineMode || !isConnected) {
      console.log('Używam szczegółów stacji z pamięci');
      const stationData = await AsyncStorage.getItem(`hydro_station_${stationId}`);
      if (stationData) {
        return JSON.parse(stationData);
      }
      throw new Error('Brak zapisanych szczegółów stacji');
    }
    
    // Pobierz dane online
    console.log('Pobieram szczegóły stacji online');
    const stationDetails = await fetchStationDetails(stationId);
    
    // Zapisz dane do pamięci podręcznej
    await AsyncStorage.setItem(`hydro_station_${stationId}`, JSON.stringify(stationDetails));
    
    return stationDetails;
  } catch (error) {
    console.error(`Błąd podczas pobierania szczegółów stacji ${stationId}:`, error);
    
    // W przypadku błędu, spróbuj użyć danych z pamięci podręcznej
    const stationData = await AsyncStorage.getItem(`hydro_station_${stationId}`);
    if (stationData) {
      return JSON.parse(stationData);
    }
    
    throw error; // Rzuć błąd dalej, jeśli nie ma danych w pamięci
  }
};

// Funkcja pobierająca dane dla trybu offline
export const downloadOfflineData = async () => {
  try {
    // Pobierz wszystkie stacje
    const stations = await fetchStations();
    
    // Zapisz dane stacji
    await AsyncStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(stations));
    await AsyncStorage.setItem(OFFLINE_TIMESTAMP_KEY, Date.now().toString());
    
    // Pobierz szczegóły dla 20 najbardziej znaczących stacji
    // (np. stacje w stanie alarmowym lub ostrzegawczym)
    const significantStations = stations
      .filter(station => station.status === 'alarm' || station.status === 'warning')
      .slice(0, 20);
    
    // Pobierz szczegóły dla każdej znaczącej stacji
    for (const station of significantStations) {
      try {
        const details = await fetchStationDetails(station.id);
        await AsyncStorage.setItem(`hydro_station_${station.id}`, JSON.stringify(details));
        // Poczekaj 200ms między zapytaniami, aby nie przeciążyć API
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (stationError) {
        console.error(`Błąd podczas pobierania szczegółów stacji ${station.id}:`, stationError);
        // Kontynuuj mimo błędu
      }
    }
    
    return {
      success: true,
      stationsCount: stations.length,
      detailsCount: significantStations.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Błąd podczas pobierania danych offline:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Funkcja sprawdzająca, kiedy ostatnio pobierano dane offline
export const getOfflineDataTimestamp = async () => {
  try {
    const timestamp = await AsyncStorage.getItem(OFFLINE_TIMESTAMP_KEY);
    return timestamp ? new Date(parseInt(timestamp)) : null;
  } catch (error) {
    console.error('Błąd podczas pobierania znacznika czasu danych offline:', error);
    return null;
  }
};

// Funkcja czyszcząca dane offline
export const clearOfflineData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const hydroKeys = keys.filter(key => 
      key.startsWith('hydro_') && 
      key !== OFFLINE_MODE_KEY
    );
    
    if (hydroKeys.length > 0) {
      await AsyncStorage.multiRemove(hydroKeys);
      console.log('Wyczyszczono dane offline');
    }
    
    return true;
  } catch (error) {
    console.error('Błąd podczas czyszczenia danych offline:', error);
    return false;
  }
};