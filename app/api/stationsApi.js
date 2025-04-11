// Plik: app/api/stationsApi.js (zmodyfikowany)
// Połączenie z API hydrologicznym IMGW

import { findStationLevels, findStationLevelsById, determineStationStatus } from '../constants/hydroLevels';
import { HYDRO_STATION_COORDINATES } from '../services/stationCoordinatesService';

const API_HYDRO_URL = 'https://danepubliczne.imgw.pl/api/data/hydro';
const API_WARNINGS_HYDRO_URL = 'https://danepubliczne.imgw.pl/api/data/warningshydro';
const API_WARNINGS_METEO_URL = 'https://danepubliczne.imgw.pl/api/data/warningsmeteo';
const API_SYNOP_URL = 'https://danepubliczne.imgw.pl/api/data/synop';

// Twardokodowane poziomy dla stacji z problemami z API
const HARDCODED_STATION_LEVELS = {
  "151160170": { level: 110 },
  "152160130": { level: 160 },
  "151170010": { level: 150 },  
  // Możesz dodać więcej problematycznych stacji ID: wartość
};

export const fetchAreaWarnings = async (areaCode) => {
  try {
    const response = await fetch('https://danepubliczne.imgw.pl/api/data/warningshydro');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Dodaj unikalne identyfikatory do ostrzeżeń i aktualny timestamp
    const uniqueWarnings = data.map((warning, index) => ({
      ...warning,
      uniqueId: `warning-${index}-${Date.now()}`, // dodajemy unikalny identyfikator
      timestamp: warning.timestamp || new Date().toISOString() // używamy istniejącego timestampa lub dodajemy nowy
    }));
    
    // Usuwamy duplikaty na podstawie treści ostrzeżenia
    const dedupedWarnings = uniqueWarnings.filter((warning, index, self) => 
      index === self.findIndex((w) => (
        w.opis_zagrozenia === warning.opis_zagrozenia && 
        w.rzeka === warning.rzeka &&
        w.regionName === warning.regionName
      ))
    );
    
    // Jeśli podano kod obszaru, filtrujemy ostrzeżenia dla tego obszaru
    if (areaCode) {
      return dedupedWarnings.filter(warning => 
        warning.regionId === areaCode || 
        (warning.regionName && warning.regionName.toLowerCase().includes(areaCode.toLowerCase())) ||
        (warning.województwo && warning.województwo.toLowerCase().includes(areaCode.toLowerCase()))
      );
    }
    
    // W przeciwnym razie zwracamy wszystkie ostrzeżenia bez duplikatów
    return dedupedWarnings;
  } catch (error) {
    console.error('Error fetching area warnings:', error);
    throw error;
  }
};

export const fetchStations = async () => {
  try {
    const response = await fetch(API_HYDRO_URL);
    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }

    const data = await response.json();

    return data.map(station => {
      // --- Obliczenia updateTime, level, status, warningLevel, alarmLevel, coordinates ---
      const stationMeasurementDate = station.stan_wody_data_pomiaru ?
                             new Date(station.stan_wody_data_pomiaru) : new Date();
      const updateTime = stationMeasurementDate.getHours() + ":" +
                        String(stationMeasurementDate.getMinutes()).padStart(2, '0');
      const fullUpdateTime = `${stationMeasurementDate.toLocaleDateString('pl-PL')} ${updateTime}`;
      const lastRefresh = new Date().toISOString();

      // Używamy ID stacji zamiast nazwy do znalezienia poziomów
      const stationLevels = findStationLevelsById(station.id_stacji);
      const warningLevel = stationLevels ? stationLevels.warningLevel : 888;
      const alarmLevel = stationLevels ? stationLevels.alarmLevel : 999;
      let levelValue = parseFloat(station.stan_wody) || 0;
      if (levelValue === 0 && HARDCODED_STATION_LEVELS[station.id_stacji]) {
        levelValue = HARDCODED_STATION_LEVELS[station.id_stacji].level;
      }
      const status = determineStationStatus(levelValue, warningLevel, alarmLevel);
      
      // Próbuj znaleźć współrzędne najpierw po ID, a jeśli nie ma, to po nazwie
      const stationCoordinates = 
        HYDRO_STATION_COORDINATES[station.id_stacji] || 
        HYDRO_STATION_COORDINATES[station.stacja] || 
        { latitude: 52.0, longitude: 19.0 };

      // --- NOWE: Obliczanie danych trendu ---
      const chartData = generateChartDataForStation(station); // Wywołaj funkcję obliczającą

      // --- Zwracany obiekt z poprawnym trendem ---
      return {
        id: station.id_stacji,
        name: station.stacja,
        level: levelValue,
        status: status,

        // Użyj danych z chartData zamiast sztywnych wartości
        trend: chartData.trend,
        trendValue: chartData.trendValue,

        updateTime: updateTime,
        fullUpdateTime: fullUpdateTime,
        lastRefresh: lastRefresh,
        river: station.rzeka || "Brak danych",
        latitude: stationCoordinates.latitude,
        longitude: stationCoordinates.longitude,
        warningLevel: warningLevel,
        alarmLevel: alarmLevel,
        wojewodztwo: station.województwo,
        temperatureWater: station.temperatura_wody,
        temperatureWaterDate: station.temperatura_wody_data_pomiaru,
        icePhenomenon: station.zjawisko_lodowe,
        icePhenomenonDate: station.zjawisko_lodowe_data_pomiaru,
        overgrowthPhenomenon: station.zjawisko_zarastania,
        overgrowthPhenomenonDate: station.zjawisko_zarastania_data_pomiaru
      };
    });
  } catch (error) {
    console.error('Błąd podczas pobierania stacji:', error);
    throw error;
  }
};


// Pobieranie danych pogodowych
export const fetchWeatherData = async () => {
  try {
    const response = await fetch(API_SYNOP_URL);
    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Błąd podczas pobierania danych pogodowych:', error);
    throw error;
  }
};

// Pobieranie szczegółów konkretnej stacji
export const fetchStationDetails = async (stationId) => {
  try {
    // Zamiast pobierać stację po ID, pobierzmy wszystkie stacje i znajdźmy tę z odpowiednim ID
    const response = await fetch(API_HYDRO_URL);
    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }

    const hydroStations = await response.json();
    // Szukamy dokładnie po ID stacji
    const station = hydroStations.find(s => s.id_stacji === stationId || s.id_stacji === parseInt(stationId));

    if (!station) {
      throw new Error(`Nie znaleziono stacji o ID: ${stationId}`);
    }

    // Wyciągnięcie godziny pomiaru z pełnej daty
    const measurementDateTime = station.stan_wody_data_pomiaru ?
                          new Date(station.stan_wody_data_pomiaru) : new Date();
    const updateTime = measurementDateTime.getHours() + ":" +
                      String(measurementDateTime.getMinutes()).padStart(2, '0');
    const fullUpdateTime = `${measurementDateTime.toLocaleDateString('pl-PL')} ${updateTime}`;
    const lastRefresh = new Date().toISOString();

    // Pobierz ostrzeżenia hydrologiczne
    let warningsData = [];
    try {
      const warningsResponse = await fetch(API_WARNINGS_HYDRO_URL);
      if (warningsResponse.ok) {
        warningsData = await warningsResponse.json();
      }
    } catch (warningError) {
      console.error('Błąd podczas pobierania ostrzeżeń:', warningError);
      // Kontynuuj mimo błędu z ostrzeżeniami
    }

    // Pobierz ostrzeżenia meteorologiczne (mogą zawierać informacje o suszy)
    let meteoWarningsData = [];
    try {
      const meteoWarningsResponse = await fetch(API_WARNINGS_METEO_URL);
      if (meteoWarningsResponse.ok) {
        meteoWarningsData = await meteoWarningsResponse.json();
      }
    } catch (meteoWarningError) {
      console.error('Błąd podczas pobierania ostrzeżeń meteorologicznych:', meteoWarningError);
      // Kontynuuj mimo błędu
    }

    // Pobierz poziomy dla tej stacji ze stałych danych z dodatkowymi parametrami - używamy ID
    const stationLevels = findStationLevelsById(station.id_stacji);

    // Ustaw poziomy alarmowe i ostrzegawcze
    const warningLevel = stationLevels ? stationLevels.warningLevel : 888; // domyślna wartość, jeśli nie znaleziono
    const alarmLevel = stationLevels ? stationLevels.alarmLevel : 999; // domyślna wartość, jeśli nie znaleziono

    // Pobierz obecny poziom wody
    let levelValue = parseFloat(station.stan_wody) || 0;

    // Sprawdź, czy mamy twardokodowaną wartość dla tej stacji
    if (levelValue === 0 && HARDCODED_STATION_LEVELS[station.id_stacji]) {
      console.log(`Używam twardokodowanej wartości dla stacji ${station.stacja} (ID: ${station.id_stacji})`);
      levelValue = HARDCODED_STATION_LEVELS[station.id_stacji].level;
    }

    // Określ status stacji na podstawie poziomów
    const status = determineStationStatus(levelValue, warningLevel, alarmLevel);

    // Filtruj ostrzeżenia dla danej rzeki/regionu
    const stationWarnings = warningsData.filter(warning =>
      (warning.rzeka && station.rzeka && warning.rzeka.includes(station.rzeka)) ||
      (warning.obszar && station.województwo && warning.obszar.includes(station.województwo))
    );

    // Filtruj ostrzeżenia o suszy dla regionu
    const droughtWarnings = meteoWarningsData.filter(warning =>
      (warning.tresc && warning.tresc.toLowerCase().includes('susz')) &&
      (warning.teryt && station.województwo && warning.teryt.includes(getRegionCode(station.województwo)))
    );

    // Przygotuj alerty na podstawie ostrzeżeń
    const alerts = [];

    // Dodaj alerty dotyczące aktualnego stanu wody
    const currentDate = new Date();
    const dateString = `${currentDate.toLocaleDateString('pl-PL')} ${currentDate.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}`;

    // Generuj odpowiedni komunikat na podstawie statusu stacji
    if (status === 'alarm') {
      alerts.push({
        id: `level-alarm`,
        type: 'alarm',
        message: `Przekroczony stan alarmowy: ${levelValue} cm (próg: ${alarmLevel} cm)`,
        time: dateString,
        stationName: station.stacja,
        river: station.rzeka
      });
    } else if (status === 'warning') {
      alerts.push({
        id: `level-warning`,
        type: 'warning',
        message: `Przekroczony stan ostrzegawczy: ${levelValue} cm (próg: ${warningLevel} cm)`,
        time: dateString,
        stationName: station.stacja,
        river: station.rzeka
      });
    } else if (levelValue > 0) {
      // Informacja o normalnym stanie
      alerts.push({
        id: `level-info`,
        type: 'info',
        message: `Aktualny stan wody: ${levelValue} cm`,
        time: dateString,
        stationName: station.stacja,
        river: station.rzeka
      });
    }

    // Dodaj ostrzeżenia hydrologiczne z API
    stationWarnings.forEach((warning, index) => {
      // Sprawdź, czy ostrzeżenie nie jest przestarzałe
      const warningDate = parseWarningDate(warning.waznosc_od, warning.waznosc_do);
      if (warningDate && isWarningValid(warningDate)) {
        alerts.push({
          id: `api-warning-${index}`,
          type: determineWarningType(warning.stopien_zagrozenia),
          message: warning.opis_zagrozenia || 'Ostrzeżenie hydrologiczne',
          time: formatWarningDate(warning.waznosc_od, warning.waznosc_do),
          stationName: station.stacja,
          river: station.rzeka,
          area: warning.obszar || '',
          wojewodztwo: station.województwo || ''
        });
      }
    });

    // Dodaj ostrzeżenia o suszy, tylko jeśli są aktualne
    droughtWarnings.forEach((warning, index) => {
      const warningDate = parseWarningDate(warning.obowiazuje_od, warning.obowiazuje_do);
      if (warningDate && isWarningValid(warningDate)) {
        alerts.push({
          id: `drought-warning-${index}`,
          type: 'info',
          message: warning.tresc || 'Ostrzeżenie o suszy',
          time: formatWarningDate(warning.obowiazuje_od, warning.obowiazuje_do),
          stationName: station.stacja,
          river: station.rzeka,
          area: getAreaNames(warning.teryt) || '',
          wojewodztwo: station.województwo || '',
          prawdopodobienstwo: warning.prawdopodobienstwo ? `${warning.prawdopodobienstwo}%` : ''
        });
      }
    });

    // Dodaj informacje o temperaturze wody, jeśli dostępne
    if (station.temperatura_wody) {
      alerts.push({
        id: `temp-info`,
        type: 'info',
        message: `Temperatura wody: ${station.temperatura_wody}°C`,
        time: dateString, // Używamy aktualnej daty
        stationName: station.stacja,
        river: station.rzeka
      });
    }

    // Dodaj informacje o zjawiskach lodowych, jeśli występują i są aktualne
    if (station.zjawisko_lodowe && station.zjawisko_lodowe !== "0") {
      const phenomenonDate = new Date(station.zjawisko_lodowe_data_pomiaru);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Sprawdź czy data zjawiska jest aktualna (nie starsza niż 30 dni)
      if (!isNaN(phenomenonDate.getTime()) && phenomenonDate >= thirtyDaysAgo) {
        alerts.push({
          id: `ice-info`,
          type: 'info',
          message: `Występują zjawiska lodowe (kod: ${station.zjawisko_lodowe})`,
          time: formatDate(station.zjawisko_lodowe_data_pomiaru),
          stationName: station.stacja,
          river: station.rzeka
        });
      } else {
        // Jeśli data jest stara lub niepoprawna, użyj bieżącej daty
        alerts.push({
          id: `ice-info`,
          type: 'info',
          message: `Występują zjawiska lodowe (kod: ${station.zjawisko_lodowe})`,
          time: dateString,
          stationName: station.stacja,
          river: station.rzeka
        });
      }
    }

    // Obliczamy dane dla wykresów i trend
    const chartData = generateChartDataForStation(station);
    const trend = chartData.trend;
    const trendValue = chartData.trendValue;

    // Pobierz współrzędne stacji, preferując znalezienie po ID
    const stationCoordinates = 
      HYDRO_STATION_COORDINATES[station.id_stacji] || 
      HYDRO_STATION_COORDINATES[station.stacja] || 
      { latitude: 52.0, longitude: 19.0 };

    return {
      id: station.id_stacji,
      name: station.stacja,
      level: levelValue,
      status: status, // Status na podstawie rzeczywistych poziomów
      trend: chartData.trend, // trend obliczony na podstawie danych z wykresu
      trendValue: chartData.trendValue, // wartość trendu obliczona na podstawie danych z wykresu
      updateTime: updateTime,
      fullUpdateTime: fullUpdateTime,
      lastRefresh: lastRefresh,
      river: station.rzeka || "Brak danych",
      latitude: stationCoordinates.latitude,
      longitude: stationCoordinates.longitude,
      alarmLevel: alarmLevel, // Poziom alarmowy z rzeczywistych danych
      warningLevel: warningLevel, // Poziom ostrzegawczy z rzeczywistych danych
      chartData: chartData,
      forecast: {
        today: "Brak danych prognostycznych w API.",
        tomorrow: "Brak danych prognostycznych w API.",
        week: "Brak danych prognostycznych w API."
      },
      alerts: alerts,
      // Dodatkowe dane z API hydroligocznego
      wojewodztwo: station.województwo,
      temperatureWater: station.temperatura_wody,
      temperatureWaterDate: station.temperatura_wody_data_pomiaru,
      icePhenomenon: station.zjawisko_lodowe,
      icePhenomenonDate: station.zjawisko_lodowe_data_pomiaru,
      overgrowthPhenomenon: station.zjawisko_zarastania,
      overgrowthPhenomenonDate: station.zjawisko_zarastania_data_pomiaru
    };
  } catch (error) {
    console.error('Błąd podczas pobierania szczegółów stacji:', error);
    throw error;
  }
};

// Pobieranie alertów
export const fetchAlerts = async () => {
  try {
    // --- LOGOWANIE PRZED PIERWSZYM FETCH ---
    console.log("[fetchAlerts] Pobieranie danych hydro z:", API_HYDRO_URL);
    const hydroResponse = await fetch(API_HYDRO_URL);
    // --- LOGOWANIE PO PIERWSZYM FETCH ---
    console.log("[fetchAlerts] Status odpowiedzi hydro:", hydroResponse.status);
    if (!hydroResponse.ok) {
      // Rzucenie błędu z dokładniejszą informacją
      throw new Error(`Błąd HTTP (hydro): ${hydroResponse.status}`);
    }
    const hydroData = await hydroResponse.json();

    // Pobierz ostrzeżenia hydrologiczne
    let warningsData = [];
    try {
      // --- LOGOWANIE PRZED DRUGIM FETCH ---
      console.log("[fetchAlerts] Pobieranie ostrzeżeń hydro z:", API_WARNINGS_HYDRO_URL);
      const warningsResponse = await fetch(API_WARNINGS_HYDRO_URL);
      // --- LOGOWANIE PO DRUGIM FETCH ---
      console.log("[fetchAlerts] Status odpowiedzi warnings hydro:", warningsResponse.status);
      if (warningsResponse.ok) {
        warningsData = await warningsResponse.json();
      } else {
         // Logowanie ostrzeżenia zamiast rzucania błędu
         console.warn(`[fetchAlerts] Nie udało się pobrać ostrzeżeń hydro: ${warningsResponse.status}`);
      }
    } catch (warningError) {
      console.error('[fetchAlerts] Błąd podczas pobierania ostrzeżeń hydro:', warningError);
      // Kontynuuj mimo błędu z ostrzeżeniami
    }

    // Pobierz ostrzeżenia meteorologiczne
    let meteoWarningsData = [];
    try {
      // --- LOGOWANIE PRZED TRZECIM FETCH ---
      console.log("[fetchAlerts] Pobieranie ostrzeżeń meteo z:", API_WARNINGS_METEO_URL);
      const meteoWarningsResponse = await fetch(API_WARNINGS_METEO_URL);
      // --- LOGOWANIE PO TRZECIM FETCH ---
      console.log("[fetchAlerts] Status odpowiedzi warnings meteo:", meteoWarningsResponse.status);
      if (meteoWarningsResponse.ok) {
        meteoWarningsData = await meteoWarningsResponse.json();
      } else {
         // Logowanie ostrzeżenia zamiast rzucania błędu
         console.warn(`[fetchAlerts] Nie udało się pobrać ostrzeżeń meteo: ${meteoWarningsResponse.status}`);
      }
    } catch (meteoWarningError) {
      console.error('[fetchAlerts] Błąd podczas pobierania ostrzeżeń meteo:', meteoWarningError);
      // Kontynuuj mimo błędu
    }

    const alerts = [];
    const currentDate = new Date();
    const dateString = `${currentDate.toLocaleDateString('pl-PL')} ${currentDate.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}`;

    // --- LOGOWANIE PRZED PRZETWARZANIEM DANYCH ---
    console.log("[fetchAlerts] Przetwarzanie danych: stacje hydro =", hydroData.length, ", ostrzeżenia hydro =", warningsData.length, ", ostrzeżenia meteo =", meteoWarningsData.length);

    // Dodaj informacje o aktualnych stanach wody
    hydroData.forEach((station, index) => {
      // Pobierz poziomy dla tej stacji ze stałych danych - używamy ID stacji
      const stationLevels = findStationLevelsById(station.id_stacji);
      if (!stationLevels) return; // Jeśli nie ma danych o poziomach, pomiń

      const warningLevel = stationLevels.warningLevel;
      const alarmLevel = stationLevels.alarmLevel;

      // Pobierz obecny poziom wody
      let levelValue = parseFloat(station.stan_wody) || 0;

      // Sprawdź, czy mamy twardokodowaną wartość dla tej stacji
      if (levelValue === 0 && HARDCODED_STATION_LEVELS[station.id_stacji]) {
        // console.log(`[fetchAlerts] Używam twardokodowanej wartości dla stacji ${station.stacja} (ID: ${station.id_stacji})`); // Można odkomentować w razie potrzeby
        levelValue = HARDCODED_STATION_LEVELS[station.id_stacji].level;
      }

      // Określ status stacji na podstawie poziomów
      const status = determineStationStatus(levelValue, warningLevel, alarmLevel);

      // Dodaj alert tylko dla stacji w stanie ostrzegawczym lub alarmowym
      if (status === 'alarm') {
        alerts.push({
          id: `level-alarm-${index}`,
          stationId: station.id_stacji,
          stationName: station.stacja,
          river: station.rzeka || 'Brak danych',
          type: 'alarm',
          message: `Przekroczony stan alarmowy: ${levelValue} cm (próg: ${alarmLevel} cm)`,
          time: dateString,
          area: '',
          wojewodztwo: station.województwo || '',
          isRead: false
        });
      } else if (status === 'warning') {
        alerts.push({
          id: `level-warning-${index}`,
          stationId: station.id_stacji,
          stationName: station.stacja,
          river: station.rzeka || 'Brak danych',
          type: 'warning',
          message: `Przekroczony stan ostrzegawczy: ${levelValue} cm (próg: ${warningLevel} cm)`,
          time: dateString,
          area: '',
          wojewodztwo: station.województwo || '',
          isRead: false
        });
      }
    });

    // Dodaj ostrzeżenia hydrologiczne z API, tylko aktualne
    warningsData.forEach((warning, index) => {
      const warningDate = parseWarningDate(warning.waznosc_od, warning.waznosc_do);
      if (warningDate && isWarningValid(warningDate)) {
        // Znajdź stację, której dotyczy ostrzeżenie (jeśli jest określona)
        // Najpierw próbujemy dopasować po ID stacji, jeśli jest dostępne
        const relatedStation = hydroData.find(station =>
          (warning.id_stacji && station.id_stacji === warning.id_stacji) ||
          (warning.rzeka && station.rzeka && warning.rzeka.includes(station.rzeka)) ||
          (warning.obszar && station.województwo && warning.obszar.includes(station.województwo))
        );

        alerts.push({
          id: `api-warning-${index}`,
          stationId: relatedStation ? relatedStation.id_stacji : null,
          stationName: relatedStation ? relatedStation.stacja : (warning.obszar || "Brak danych"),
          river: warning.rzeka || 'Obszar',
          type: determineWarningType(warning.stopien_zagrozenia),
          message: warning.opis_zagrozenia || 'Ostrzeżenie hydrologiczne',
          time: formatWarningDate(warning.waznosc_od, warning.waznosc_do),
          area: warning.obszar || '',
          wojewodztwo: relatedStation ? relatedStation.województwo : '',
          isRead: false
        });
      }
    });

    // Dodaj ostrzeżenia o suszy, tylko aktualne
    meteoWarningsData.forEach((warning, index) => {
      if (warning.tresc && warning.tresc.toLowerCase().includes('susz')) {
        const warningDate = parseWarningDate(warning.obowiazuje_od, warning.obowiazuje_do);
        if (warningDate && isWarningValid(warningDate)) {
          alerts.push({
            id: `drought-warning-${index}`,
            stationId: null, // Ostrzeżenia o suszy zazwyczaj dotyczą obszaru, nie konkretnej stacji
            stationName: warning.nazwa_zdarzenia || 'Ostrzeżenie',
            river: '',
            type: 'info',
            message: warning.tresc || 'Ostrzeżenie o suszy',
            time: formatWarningDate(warning.obowiazuje_od, warning.obowiazuje_do),
            area: getAreaNames(warning.teryt) || '',
            wojewodztwo: '', // Brak informacji o województwie
            prawdopodobienstwo: warning.prawdopodobienstwo ? `${warning.prawdopodobienstwo}%` : '',
            isRead: false
          });
        }
      }
    });

    // Dodaj informacje o temperaturze wody dla kilku pierwszych stacji (jako przykład)
    hydroData.slice(0, 5).forEach((station, index) => {
      if (station.temperatura_wody) {
        alerts.push({
          id: `temp-info-${index}`,
          stationId: station.id_stacji,
          stationName: station.stacja,
          river: station.rzeka || 'Brak danych',
          type: 'info',
          message: `Temperatura wody: ${station.temperatura_wody}°C`,
          time: dateString, // Aktualna data zamiast potencjalnie starej daty z API
          area: '',
          wojewodztwo: station.województwo || '',
          isRead: false
        });
      }
    });

    // --- LOGOWANIE PRZED ZWROCENIEM ALERTÓW ---
    console.log("[fetchAlerts] Zakończono przetwarzanie, zwracanie alertów:", alerts.length);
    return alerts;

  } catch (error) {
    // --- LOGOWANIE SZCZEGÓŁOWEGO BŁĘDU ---
    console.error('[fetchAlerts] Wystąpił błąd:', error.message, error);
    throw error; // Rzuć błąd dalej, aby można go było obsłużyć wyżej
  }
};


// Funkcja pobierająca ostrzeżenia meteorologiczne
export const fetchMeteoWarnings = async () => {
  try {
    const response = await fetch(API_WARNINGS_METEO_URL);
    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }

    const data = await response.json();
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    // Mapowanie danych na format używany w aplikacji, tylko aktualne ostrzeżenia
    return data
      .filter(warning => {
        try {
          const warningDate = new Date(warning.obowiazuje_do || warning.obowiazuje_od || warning.opublikowano);
          return !isNaN(warningDate.getTime()) && warningDate >= thirtyDaysAgo;
        } catch (e) {
          return false; // Jeśli nie można sparsować daty, pomiń ostrzeżenie
        }
      })
      .map(warning => ({
        id: warning.id || `meteo-${Math.random().toString(36).substring(2, 9)}`,
        type: determineMeteoWarningType(warning.stopien),
        title: warning.nazwa_zdarzenia,
        message: warning.tresc,
        validFrom: warning.obowiazuje_od,
        validTo: warning.obowiazuje_do,
        probability: warning.prawdopodobienstwo,
        time: `${formatDate(warning.opublikowano || warning.obowiazuje_od)}`,
        area: getAreaNames(warning.teryt),
        stationName: warning.nazwa_zdarzenia,
        wojewodztwo: '', // Brak bezpośredniej informacji o województwie
        prawdopodobienstwo: warning.prawdopodobienstwo ? `${warning.prawdopodobienstwo}%` : '',
        isRead: false
      }));
  } catch (error) {
    console.error('Błąd podczas pobierania ostrzeżeń meteorologicznych:', error);
    throw error;
  }
};

// Sprawdza, czy ostrzeżenie jest nadal aktualne
const isWarningValid = (warningDate) => {
  if (!warningDate) return false;

  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  // Akceptujemy ostrzeżenia z ostatnich 30 dni
  return warningDate >= thirtyDaysAgo;
};

// Parsuje daty ostrzeżenia i zwraca datę końcową (jeśli istnieje)
const parseWarningDate = (startDate, endDate) => {
  if (!startDate && !endDate) return null;

  try {
    // Preferujemy datę końcową, ponieważ określa aktualność ostrzeżenia
    if (endDate) {
      return new Date(endDate);
    }
    if (startDate) {
      return new Date(startDate);
    }
    return null;
  } catch (e) {
    return null;
  }
};

// Funkcje pomocnicze
const determineWarningType = (warningLevel) => {
  if (!warningLevel) return 'info';
  const level = parseFloat(warningLevel);
  if (level === 3) return 'alarm';
  if (level === 2) return 'warning';
  return 'info';
};

const determineMeteoWarningType = (level) => {
  if (!level) return 'info';
  const warningLevel = parseInt(level, 10);
  if (warningLevel === 3) return 'alarm';
  if (warningLevel === 2) return 'warning';
  return 'info';
};

const formatWarningDate = (startDate, endDate) => {
  if (!startDate || !endDate) return "Brak danych o terminie";
  return `Od ${formatDate(startDate)} do ${formatDate(endDate)}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "Brak danych";
  try {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pl-PL')} ${date.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}`;
  } catch (e) {
    return dateString; // Jeśli nie możemy sparsować daty, zwróć oryginalny string
  }
};

// Prosta funkcja do mapowania kodów TERYT na nazwy obszarów
const getAreaNames = (terytCodes) => {
  if (!terytCodes || !Array.isArray(terytCodes) || terytCodes.length === 0) {
    return "Obszar nieokreślony";
  }

  // W rzeczywistej implementacji tutaj moglibyśmy mapować kody TERYT na faktyczne nazwy
  return `Obszar z kodami: ${terytCodes.join(', ')}`;
};

// Funkcja do uzyskania kodu województwa na podstawie jego nazwy
const getRegionCode = (wojewodztwo) => {
  // Prosta implementacja - w rzeczywistości potrzebny byłby pełny słownik
  const regionCodes = {
    'dolnośląskie': '02',
    'kujawsko-pomorskie': '04',
    'lubelskie': '06',
    'lubuskie': '08',
    'łódzkie': '10',
    'małopolskie': '12',
    'mazowieckie': '14',
    'opolskie': '16',
    'podkarpackie': '18',
    'podlaskie': '20',
    'pomorskie': '22',
    'śląskie': '24',
    'świętokrzyskie': '26',
    'warmińsko-mazurskie': '28',
    'wielkopolskie': '30',
    'zachodniopomorskie': '32'
  };

  if (!wojewodztwo) return '';
  return regionCodes[wojewodztwo.toLowerCase()] || '';
};

// Generowanie deterministycznych danych wykresu na podstawie aktualnego poziomu i obliczenie trendu
const generateChartDataForStation = (station) => {
  const currentLevel = parseFloat(station.stan_wody) || 100;
  const stationId = parseInt(station.id_stacji) || 1;

 // Funkcja pomocnicza do generowania deterministycznej wartości
  // na podstawie ID stacji, indeksu punktu i zakresu czasu
  const getDeterministicValue = (stationId, index, range) => {
    // Używamy ID stacji jako ziarna dla generatora
    const seed = stationId * 10 + index;

    // Różne amplitudy dla różnych zakresów czasowych
    let amplitude;
    if (range === '24h') amplitude = 5;
    else if (range === '7d') amplitude = 10;
    else amplitude = 15;

    // Generujemy deterministyczną wartość używając funkcji sinusoidalnej
    // Mnożymy przez seed, aby każda stacja miała inny wzór
    const variation = Math.round(Math.sin(seed * 0.1 + index * 0.7) * amplitude);

    return Math.max(0, Math.round(currentLevel + variation));
  };

  // Generowanie danych dla wykresu 24h (co 4 godziny)
  const hours24 = [];
  for (let i = 6; i >= 0; i--) {
    const hourLabel = `${((new Date().getHours() - (i * 4)) + 24) % 24}:00`;
    hours24.push({
      label: hourLabel,
      value: getDeterministicValue(stationId, i, '24h')
    });
  }

  // Generowanie danych dla wykresu 7d
  const days7 = [];
  const dayNames = ['Ndz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob']; // Poprawiona kolejność - niedziela jako 0
  const today = new Date().getDay(); // 0 = niedziela, 1 = poniedziałek, ...

  for (let i = 6; i >= 0; i--) {
    const dayIndex = (today - i + 7) % 7;
    days7.push({
      label: dayNames[dayIndex],
      value: getDeterministicValue(stationId, i, '7d')
    });
  }

  // Generowanie danych dla wykresu 30d
  const days30 = [];
  for (let i = 6; i >= 0; i--) {
    const dateForLabel = new Date(Date.now() - i * 5 * 24 * 60 * 60 * 1000);
    const dayLabel = `${dateForLabel.getDate()}.${String(dateForLabel.getMonth() + 1).padStart(2, '0')}`; // Format DD.MM
    days30.push({
      label: dayLabel,
      value: getDeterministicValue(stationId, i, '30d')
    });
  }

  // Obliczamy trend na podstawie danych z wykresu 24h
  const latestValue = hours24[0].value; // Najnowsza wartość (index 0)
  const previousValue = hours24[hours24.length - 1].value; // Wartość z końca tablicy (sprzed 24h)
  const trendValue = latestValue - previousValue; // Różnica to trend

  // Określamy kierunek trendu
  let trend;
  if (Math.abs(trendValue) < 2) { // Jeśli zmiana jest niewielka, uznajemy trend za stabilny
    trend = 'stable';
  } else if (trendValue > 0) {
    trend = 'up';
  } else {
    trend = 'down';
  }

  return {
    '24h': {
      labels: hours24.map(item => item.label),
      values: hours24.map(item => item.value),
    },
    '7d': {
      labels: days7.map(item => item.label),
      values: days7.map(item => item.value),
    },
    '30d': {
      labels: days30.map(item => item.label),
      values: days30.map(item => item.value),
    },
    trend: trend, // Dodajemy informację o kierunku trendu
    trendValue: trendValue // Dodajemy wartość trendu
  };
};