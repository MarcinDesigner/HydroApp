// Plik: app/services/stationHistoryService.js (nowy plik)
import AsyncStorage from '@react-native-async-storage/async-storage';

// Funkcja do generowania danych historycznych na podstawie ID stacji
// W rzeczywistej aplikacji zastąpiłbyś to danymi z API
const generateHistoricalData = (stationId, days = 90) => {
  const baseLevel = 100 + (stationId % 100); // Przykładowy poziom bazowy
  const result = [];
  const endDate = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(endDate.getDate() - i);
    
    // Deterministyczna wartość na podstawie ID i daty
    const seed = stationId + date.getDate() + date.getMonth();
    const variation = Math.sin(seed * 0.1) * 20;
    const level = Math.max(0, Math.round(baseLevel + variation));
    
    result.push({
      date: date.toISOString().split('T')[0], // Format YYYY-MM-DD
      level: level
    });
  }
  
  return result;
};

// Klucz do przechowywania historii w AsyncStorage
const getHistoryKey = (stationId) => `hydro_history_${stationId}`;

// Pobieranie historii stacji - najpierw próbuje z cache, potem pobiera z API
export const fetchStationHistory = async (stationId, days = 90) => {
  try {
    // 1. Sprawdź czy dane są w cache
    const storageKey = getHistoryKey(stationId);
    const cachedData = await AsyncStorage.getItem(storageKey);
    
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const cacheTimestamp = parsedData.timestamp || 0;
      const now = Date.now();
      
      // Jeśli cache jest świeży (nie starszy niż 24h), użyj go
      if (now - cacheTimestamp < 24 * 60 * 60 * 1000) {
        console.log('Używam danych historycznych z cache');
        return parsedData.data;
      }
    }
    
    // 2. Jeśli danych nie ma w cache lub są nieaktualne, pobierz z API/generuj
    // W rzeczywistej aplikacji zamieniłbyś to na faktyczne zapytanie do API
    const historicalData = generateHistoricalData(stationId, days);
    
    // 3. Zapisz pobrane dane do cache z aktualną datą
    const dataToCache = {
      data: historicalData,
      timestamp: Date.now()
    };
    
    await AsyncStorage.setItem(storageKey, JSON.stringify(dataToCache));
    console.log('Zapisano nowe dane historyczne do cache');
    
    return historicalData;
  } catch (error) {
    console.error('Błąd podczas pobierania historii stacji:', error);
    // W przypadku błędu, wygeneruj dane lokalnie
    return generateHistoricalData(stationId, days);
  }
};

// Funkcja do czyszczenia cache historii
export const clearHistoryCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const historyKeys = keys.filter(key => key.startsWith('hydro_history_'));
    
    if (historyKeys.length > 0) {
      await AsyncStorage.multiRemove(historyKeys);
      console.log('Wyczyszczono cache historii stacji');
    }
  } catch (error) {
    console.error('Błąd podczas czyszczenia cache historii:', error);
  }
};