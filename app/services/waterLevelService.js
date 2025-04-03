// Plik: app/services/waterLevelService.js
// Serwis do pobierania i przetwarzania danych o poziomach wody

import hydroStations from '../constants/hydroLevels'; // Zaimportuj dane o stacjach

// Przykładowe dane pomiarowe - zastąp to wywołaniem API
const mockMeasurements = {
  "Chałupki": 95,
  "Krzyżanowice": 111,
  "Racibórz-Miedonia": 120,
  "Koźle": 285,
  "Krapkowice": 164,
  "Opole-Groszowice": null,
  "UJŚCIE NYSY KŁODZKIEJ": null,
  "Brzeg": null,
  "Oława": 164,
  
  // ... dodaj więcej stacji
};

// Funkcja do pobierania aktualnych danych pomiarowych
export const fetchWaterLevels = async () => {
  // W rzeczywistej aplikacji tutaj byłoby wywołanie API
  // return await fetch('https://api.example.com/water-levels').then(res => res.json());
  
  // Na potrzeby przykładu zwracamy dane mockowe po krótkim opóźnieniu
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMeasurements);
    }, 500);
  });
};

// Funkcja do określania statusu stacji na podstawie poziomów
export const determineStationStatus = (currentLevel, warningLevel, alarmLevel) => {
  if (currentLevel === null || currentLevel === undefined) return 'unknown';
  if (currentLevel >= alarmLevel) return 'alarm';
  if (currentLevel >= warningLevel) return 'warning';
  return 'normal';
};

// Główna funkcja do pobierania pełnych danych o stacjach
export const getStationsData = async () => {
  try {
    // Pobierz aktualne pomiary
    const measurements = await fetchWaterLevels();
    
    // Łączymy dane o stacjach z pomiarami
    const stationsData = hydroStations.map(station => {
      // Znajdź aktualny pomiar dla stacji (jeśli istnieje)
      const currentLevel = measurements[station.stationName] || null;
      
      // Określ status na podstawie aktualnego poziomu i progów
      const status = determineStationStatus(
        currentLevel, 
        station.warningLevel, 
        station.alarmLevel
      );
      
      // Zwróć pełne dane stacji w formacie oczekiwanym przez komponent
      return {
        id: station.stationName.toLowerCase().replace(/\s+/g, '-'),
        name: station.stationName,
        level: currentLevel,
        warningLevel: station.warningLevel,
        alarmLevel: station.alarmLevel,
        status: status,
        voivodeship: station.voivodeship,
        riverId: station.riverId
      };
    });
    
    return stationsData;
  } catch (error) {
    console.error('Błąd podczas pobierania danych o stacjach:', error);
    return [];
  }
};
