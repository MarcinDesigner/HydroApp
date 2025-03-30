// Plik: app/api/stationsApi.js
// Połączenie z API hydrologicznym IMGW

const API_HYDRO_URL = 'https://danepubliczne.imgw.pl/api/data/hydro';
const API_WARNINGS_HYDRO_URL = 'https://danepubliczne.imgw.pl/api/data/warningshydro';
const API_WARNINGS_METEO_URL = 'https://danepubliczne.imgw.pl/api/data/warningsmeteo';
const API_SYNOP_URL = 'https://danepubliczne.imgw.pl/api/data/synop';

// Pobieranie listy wszystkich stacji
export const fetchStations = async () => {
  try {
    const response = await fetch(API_HYDRO_URL);
    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Mapowanie danych z API do formatu oczekiwanego przez aplikację
    return data.map(station => {
      // Wyciągnięcie godziny pomiaru z pełnej daty
      const stationMeasurementDate = station.stan_wody_data_pomiaru ? 
                             new Date(station.stan_wody_data_pomiaru) : new Date();
      const updateTime = stationMeasurementDate.getHours() + ":" + 
                        String(stationMeasurementDate.getMinutes()).padStart(2, '0');
      
      // Wyciągnięcie trendu (symulowane - API nie ma tych danych)
      // W rzeczywistym scenariuszu należałoby porównywać z wcześniejszymi pomiarami
      const trendValue = 0; // brak danych o trendzie
      const trend = 'stable'; // domyślnie stabilny
      
      return {
        id: station.id_stacji,
        name: station.stacja,
        level: parseFloat(station.stan_wody) || 0,
        // Status symulowany, ponieważ API nie zawiera informacji o stanach ostrzegawczych/alarmowych
        status: 'normal', 
        trend: trend,
        trendValue: trendValue,
        updateTime: updateTime,
        river: station.rzeka || "Brak danych",
        // Używamy domyślnych współrzędnych dla Polski (środek kraju)
        latitude: 52.0,
        longitude: 19.0,
        // Dodatkowe dane
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
    const station = hydroStations.find(s => s.id_stacji === stationId || s.id_stacji === parseInt(stationId));
    
    if (!station) {
      throw new Error('Nie znaleziono stacji o podanym ID');
    }
    
    // Pobierz dane pogodowe
    let weatherData = [];
    try {
      weatherData = await fetchWeatherData();
    } catch (weatherError) {
      console.error('Błąd podczas pobierania danych pogodowych:', weatherError);
      // Kontynuuj mimo błędu
    }
    
    // Znajdź stację pogodową o tej samej lub najbliższej nazwie
   const weatherStation = weatherData.find(w => 
  w.stacja && station.stacja && 
  w.stacja.toLowerCase() === station.stacja.toLowerCase()
);

   // Dodaj logowanie aby zobaczyć, czy mamy dopasowanie
console.log("Stacja hydro:", station.stacja);
console.log("Znaleziona stacja synop:", weatherStation?.stacja);
    
    // Wyciągnięcie godziny pomiaru z pełnej daty
    const measurementDateTime = station.stan_wody_data_pomiaru ? 
                           new Date(station.stan_wody_data_pomiaru) : new Date();
    const updateTime = measurementDateTime.getHours() + ":" + 
                      String(measurementDateTime.getMinutes()).padStart(2, '0');
    
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
    
    // Dodaj ostrzeżenia hydrologiczne z API
    stationWarnings.forEach((warning, index) => {
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
    });
    
    // Dodaj ostrzeżenia o suszy
    droughtWarnings.forEach((warning, index) => {
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
    });
    
    // Dodaj informacje o temperaturze wody, jeśli dostępne
    if (station.temperatura_wody) {
      alerts.push({
        id: `temp-info`,
        type: 'info',
        message: `Temperatura wody: ${station.temperatura_wody}°C`,
        time: formatDate(station.temperatura_wody_data_pomiaru),
        stationName: station.stacja,
        river: station.rzeka
      });
    }
    
    // Dodaj informacje o zjawiskach lodowych, jeśli występują
    if (station.zjawisko_lodowe && station.zjawisko_lodowe !== "0") {
      alerts.push({
        id: `ice-info`,
        type: 'info',
        message: `Występują zjawiska lodowe (kod: ${station.zjawisko_lodowe})`,
        time: formatDate(station.zjawisko_lodowe_data_pomiaru),
        stationName: station.stacja,
        river: station.rzeka
      });
    }
    
    // Przygotuj dane dla wykresów (symulowane, bo API nie dostarcza historii)
    const chartData = generateChartDataForStation(station);
    
    return {
      id: station.id_stacji,
      name: station.stacja,
      level: parseFloat(station.stan_wody) || 0,
      status: 'normal', // symulowany status
      trend: 'stable', // symulowany trend
      trendValue: 0, // symulowany trend
      updateTime: updateTime,
      river: station.rzeka || "Brak danych",
      latitude: 52.0, // domyślna szerokość geograficzna dla Polski
      longitude: 19.0, // domyślna długość geograficzna dla Polski
      alarmLevel: 999, // symulowany stan alarmowy (brak w API)
      warningLevel: 888, // symulowany stan ostrzegawczy (brak w API)
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
      overgrowthPhenomenonDate: station.zjawisko_zarastania_data_pomiaru,
      
      // Dane pogodowe z API synoptycznego
      temperatura: weatherStation?.temperatura,
      suma_opadu: weatherStation?.suma_opadu,
      cisnienie: weatherStation?.cisnienie,
      wilgotnosc_wzgledna: weatherStation?.wilgotnosc_wzgledna,
      godzina_pomiaru: weatherStation?.godzina_pomiaru,
      predkosc_wiatru: weatherStation?.predkosc_wiatru,
      kierunek_wiatru: weatherStation?.kierunek_wiatru,
      synopStationName: weatherStation?.stacja
    };
  } catch (error) {
    console.error('Błąd podczas pobierania szczegółów stacji:', error);
    throw error;
  }
};

// Jeśli nie znaleziono dokładnego dopasowania, szukaj stacji z podobną nazwą
if (!weatherStation) {
  weatherStation = weatherData.find(w => 
    w.stacja && station.stacja && 
    (w.stacja.toLowerCase().includes(station.stacja.toLowerCase()) || 
     station.stacja.toLowerCase().includes(w.stacja.toLowerCase()))
  );
}

// Jeśli nadal nie znaleziono, szukaj stacji w tym samym województwie
if (!weatherStation && station.województwo) {
  const stationsInRegion = weatherData.filter(w => {
    // Tu możemy dodać mapowanie stacji pogodowych do województw,
    // ale na potrzeby przykładu po prostu bierzemy pierwszą znalezioną stację
    return true;
  });
  
  if (stationsInRegion.length > 0) {
    weatherStation = stationsInRegion[0];
  }
}

// Jeśli nadal nie znaleziono, użyj pierwszej dostępnej stacji
if (!weatherStation && weatherData.length > 0) {
  weatherStation = weatherData[0];
}

console.log("Wybrana stacja pogodowa:", weatherStation?.stacja);

// Znajdź stację pogodową o dokładnie tej samej nazwie
let weatherStation = weatherData.find(w => 
  w.stacja && station.stacja && 
  w.stacja.toLowerCase() === station.stacja.toLowerCase()
);

// Pobieranie alertów
export const fetchAlerts = async () => {
  try {
    // Pobierz dane hydrologiczne
    const hydroResponse = await fetch(API_HYDRO_URL);
    if (!hydroResponse.ok) {
      throw new Error(`Błąd HTTP: ${hydroResponse.status}`);
    }
    
    const hydroData = await hydroResponse.json();
    
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
    
    // Pobierz ostrzeżenia meteorologiczne
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
    
    const alerts = [];
    
    // Dodaj ostrzeżenia hydrologiczne
    warningsData.forEach((warning, index) => {
      // Znajdź stację, której dotyczy ostrzeżenie (jeśli jest określona)
      const relatedStation = hydroData.find(station => 
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
    });
    
    // Dodaj ostrzeżenia o suszy
    meteoWarningsData.forEach((warning, index) => {
      if (warning.tresc && warning.tresc.toLowerCase().includes('susz')) {
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
          time: formatDate(station.temperatura_wody_data_pomiaru),
          area: '',
          wojewodztwo: station.województwo || '',
          isRead: false
        });
      }
    });
    
    return alerts;
  } catch (error) {
    console.error('Błąd podczas pobierania alertów:', error);
    throw error;
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
    
    // Mapowanie danych na format używany w aplikacji
    return data.map(warning => ({
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

// Generowanie symulowanych danych wykresu na podstawie aktualnego poziomu
const generateChartDataForStation = (station) => {
  const currentLevel = parseFloat(station.stan_wody) || 100;
  
  // Generowanie danych dla wykresu 24h (co 4 godziny)
  const hours24 = [];
  for (let i = 6; i >= 0; i--) {
    const hourLabel = `${((new Date().getHours() - (i * 4)) + 24) % 24}:00`;
    // Losowe wahania +/- 5cm
    const randomVariation = Math.floor(Math.random() * 11) - 5; 
    hours24.push({
      label: hourLabel,
      value: Math.max(0, Math.round(currentLevel + randomVariation))
    });
  }
  
  // Generowanie danych dla wykresu 7d
  const days7 = [];
  const dayNames = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];
  const today = new Date().getDay(); // 0 = niedziela, 1 = poniedziałek, ...
  
  for (let i = 6; i >= 0; i--) {
    const dayIndex = (today - i + 7) % 7;
    // Losowe wahania +/- 10cm
    const randomVariation = Math.floor(Math.random() * 21) - 10;
    days7.push({
      label: dayNames[dayIndex],
      value: Math.max(0, Math.round(currentLevel + randomVariation))
    });
  }
  
  // Generowanie danych dla wykresu 30d
  const days30 = [];
  for (let i = 6; i >= 0; i--) {
    const dayLabel = `${new Date(Date.now() - i * 5 * 24 * 60 * 60 * 1000).getDate()}`;
    // Losowe wahania +/- 15cm
    const randomVariation = Math.floor(Math.random() * 31) - 15;
    days30.push({
      label: dayLabel,
      value: Math.max(0, Math.round(currentLevel + randomVariation))
    });
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
    }
  };
};