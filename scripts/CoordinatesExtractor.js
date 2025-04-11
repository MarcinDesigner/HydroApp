// Plik: scripts/CoordinatesExtractor.js
// Wersja kompatybilna z Node.js (CommonJS)
const fetch = require('node-fetch');
const fs = require('fs');

// Cache dla wyników geocodingu
const geocodingCache = {};

// Funkcja do opóźnienia wykonania (żeby nie przekroczyć limitów API)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Uproszczona wersja funkcji getCoordinatesForPlace
async function getCoordinatesForPlace(placeName, country = 'Polska') {
  // Sprawdź czy mamy wynik w cache
  const cacheKey = `${placeName},${country}`;
  if (geocodingCache[cacheKey]) {
    return geocodingCache[cacheKey];
  }
  
  try {
    // Konstruujemy URL zapytania
    const params = new URLSearchParams({
      q: `${placeName}, ${country}`,
      format: 'json',
      limit: 1,
      addressdetails: 1
    });
    
    // Pobieramy dane
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: {
        // Zgodnie z zasadami Nominatim, należy dodać User-Agent
        'User-Agent': `HydroApp/Node-Script`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Sprawdzamy czy mamy wyniki
    if (data && data.length > 0) {
      const result = {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
      
      // Zapisujemy wynik w cache
      geocodingCache[cacheKey] = result;
      
      return result;
    }
    
    return null;
  } catch (error) {
    console.error(`Błąd geocodingu dla "${placeName}":`, error);
    return null;
  }
}

// Uproszczona wersja do pobierania stacji
async function fetchStations() {
  try {
    const response = await fetch('https://danepubliczne.imgw.pl/api/data/hydro');
    
    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Błąd podczas pobierania stacji:', error);
    throw error;
  }
}

// Poniżej możesz wkleić zawartość stałej HYDRO_STATION_COORDINATES z pliku stationCoordinatesService.js
// lub zaimportować ją bezpośrednio jeśli korzystasz z ES modules
const HYDRO_STATION_COORDINATES = {
  // Mapowanie po ID stacji
  "149180160": { latitude: 52.2297, longitude: 21.0122 }, // Warszawa
  "149190050": { latitude: 50.0647, longitude: 19.9450 }, // Kraków
  "149200090": { latitude: 54.0919, longitude: 18.7959 }, // Tczew
  "149180140": { latitude: 52.5463, longitude: 19.7064 }, // Płock
  "149180120": { latitude: 52.6483, longitude: 19.0679 }, // Włocławek
  "149200040": { latitude: 53.0138, longitude: 18.5981 }, // Toruń
  "149190190": { latitude: 51.4161, longitude: 21.9667 }, // Puławy
  "149190230": { latitude: 50.6828, longitude: 21.7498 }, // Sandomierz
  
  // ... można skopiować resztę stałej z pliku stationCoordinatesService.js
};

// Główna funkcja skryptu
async function extractCoordinates() {
  console.log('Pobieranie danych stacji...');
  const allStations = await fetchStations();
  console.log(`Pobrano ${allStations.length} stacji`);

  // Filtruj stacje bez współrzędnych
  const stationsWithoutCoordinates = allStations.filter(station => {
    // Sprawdź, czy stacja ma już współrzędne
    if (station.latitude && station.longitude) {
      return false;
    }
    
    // Sprawdź, czy mamy współrzędne w bazie HYDRO_STATION_COORDINATES
    const stationId = station.id_stacji || station.id;
    return !(HYDRO_STATION_COORDINATES[stationId] || HYDRO_STATION_COORDINATES[station.stacja || station.name]);
  });

  console.log(`Znaleziono ${stationsWithoutCoordinates.length} stacji bez współrzędnych`);

  // Zbiorcza struktura dla nowych współrzędnych
  const newCoordinates = {};
  let processedCount = 0;

  // Przetwarzaj stacje w małych grupach, aby nie przeciążyć API
  const BATCH_SIZE = 5;
  const DELAY_MS = 1000; // 1 sekunda przerwy między pojedynczymi zapytaniami

  for (let i = 0; i < stationsWithoutCoordinates.length; i++) {
    const station = stationsWithoutCoordinates[i];
    const stationId = station.id_stacji || station.id;
    const stationName = station.stacja || station.name;
    
    try {
      // Przygotuj zapytanie do geocodingu
      let queryPlace = stationName;
      if (station.rzeka && station.rzeka !== "-") {
        queryPlace = `${stationName} ${station.rzeka}`;
      } else if (station.river && station.river !== "-") {
        queryPlace = `${stationName} ${station.river}`;
      }
      
      if (station.województwo) {
        queryPlace += `, ${station.województwo}`;
      } else if (station.wojewodztwo) {
        queryPlace += `, ${station.wojewodztwo}`;
      }

      console.log(`[${i+1}/${stationsWithoutCoordinates.length}] Pobieranie współrzędnych dla: ${queryPlace}`);
      
      // Pobierz współrzędne
      const coordinates = await getCoordinatesForPlace(queryPlace, 'Polska');
      
      if (coordinates) {
        newCoordinates[stationId] = coordinates;
        processedCount++;
        console.log(`✓ Znaleziono współrzędne: ${JSON.stringify(coordinates)}`);
      } else {
        console.log(`✗ Nie znaleziono współrzędnych dla: ${queryPlace}`);
      }
    } catch (error) {
      console.error(`Błąd podczas pobierania współrzędnych dla ${stationName}:`, error);
    }
    
    // Poczekaj przed przetworzeniem następnej stacji
    await delay(DELAY_MS);
    
    // Co BATCH_SIZE stacji, rób dłuższą przerwę
    if ((i + 1) % BATCH_SIZE === 0) {
      console.log(`Przetworzono ${i + 1} stacji, pauza...`);
      await delay(5000); // 5 sekund przerwy
    }
  }

  console.log(`\nPrzetwarzanie zakończone. Znaleziono współrzędne dla ${processedCount} stacji.`);
  
  // Zapisz wyniki
  const combinedCoordinates = {
    ...HYDRO_STATION_COORDINATES,
    ...newCoordinates
  };
  
  // Formatuj dane do zapisu w pliku jako JavaScript stałą
  let outputContent = '// Plik: app/services/stationCoordinatesService.js\n';
  outputContent += '// Wygenerowano automatycznie przez CoordinatesExtractor.js\n\n';
  outputContent += 'export const HYDRO_STATION_COORDINATES = {\n';
  
  // Dodaj wpisy dla każdej stacji
  Object.entries(combinedCoordinates).forEach(([id, coords]) => {
    const station = allStations.find(s => (s.id_stacji || s.id) === id) || { stacja: id, name: id };
    const stationName = station.stacja || station.name || 'Nieznana stacja';
    outputContent += `  "${id}": { latitude: ${coords.latitude}, longitude: ${coords.longitude} }, // ${stationName}\n`;
  });
  
  outputContent += '};\n';
  

  // Predefiniowane współrzędne dla trudnych lokalizacji
const MANUAL_COORDINATES = {
  "Międuniszki Węgorapa": { latitude: 54.1812, longitude: 22.0305 },
  "Kudowa Zdrój-Zakrze KŁ": { latitude: 50.4386, longitude: 16.2419 },
  "Szypry Jez. Wadąg": { latitude: 53.8261, longitude: 20.4732 },
  "Grudziądz Wisła": { latitude: 53.4843, longitude: 18.7558 },
  // Możesz dodać więcej lokalizacji
};

// Zmodyfikuj funkcję getCoordinatesForPlace
async function getCoordinatesForPlace(placeName, country = 'Polska') {
  // Sprawdź czy mamy predefiniowaną lokalizację
  if (MANUAL_COORDINATES[placeName]) {
    return MANUAL_COORDINATES[placeName];
  }
  
  // Sprawdź cache
  const cacheKey = `${placeName},${country}`;
  if (geocodingCache[cacheKey]) {
    return geocodingCache[cacheKey];
  }
  
  // Upraszczamy nazwę do wyszukiwania
  const searchName = placeName
    .replace(/[-–—]/g, ' ') // usuń myślniki
    .replace(/\s+/g, ' ')   // usuń wielokrotne spacje
    .trim();
  
  // Pierwsza próba - pełna nazwa
  try {
    const coords = await nominatimGeocode(searchName, country);
    if (coords) {
      geocodingCache[cacheKey] = coords;
      return coords;
    }
  } catch (error) {
    console.error(`Błąd podczas pierwszej próby geocodingu dla "${placeName}":`, error);
  }
  
  // Druga próba - tylko pierwsza część nazwy (przed pierwszym myślnikiem lub spacją)
  const simplifiedName = searchName.split(/\s+/)[0];
  if (simplifiedName && simplifiedName !== searchName) {
    try {
      console.log(`Próba z uproszczoną nazwą: "${simplifiedName}"`);
      const coords = await nominatimGeocode(simplifiedName, country);
      if (coords) {
        geocodingCache[cacheKey] = coords;
        return coords;
      }
    } catch (error) {
      console.error(`Błąd podczas drugiej próby geocodingu dla "${simplifiedName}":`, error);
    }
  }
  
  // Nie znaleziono współrzędnych
  return null;
}

// Wydziel funkcję nominatimGeocode
async function nominatimGeocode(place, country) {
  const params = new URLSearchParams({
    q: `${place}, ${country}`,
    format: 'json',
    limit: 1,
    addressdetails: 1
  });
  
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: {
      'User-Agent': `HydroApp/Node-Script`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Błąd HTTP: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data && data.length > 0) {
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon)
    };
  }
  
  return null;
}
Zmodyfikuj główną pętlę w ten sposób:
javascriptfor (let i = 0; i < stationsWithoutCoordinates.length; i++) {
  const station = stationsWithoutCoordinates[i];
  const stationId = station.id_stacji || station.id;
  const stationName = station.stacja || station.name;
  
  try {
    // Przygotuj zapytanie do geocodingu
    let queryPlace = stationName;
    if (station.rzeka && station.rzeka !== "-") {
      queryPlace = `${stationName} ${station.rzeka}`;
    } else if (station.river && station.river !== "-") {
      queryPlace = `${stationName} ${station.river}`;
    }
    
    // Także próbuj samej nazwy stacji
    console.log(`[${i+1}/${stationsWithoutCoordinates.length}] Pobieranie współrzędnych dla: ${queryPlace}`);
    
    // Pobierz współrzędne
    let coordinates = await getCoordinatesForPlace(queryPlace, 'Polska');
    
    // Jeśli nie znaleziono, spróbuj samej nazwy
    if (!coordinates && queryPlace !== stationName) {
      console.log(`  Druga próba: ${stationName}`);
      coordinates = await getCoordinatesForPlace(stationName, 'Polska');
    }
    
    if (coordinates) {
      newCoordinates[stationId] = coordinates;
      processedCount++;
      console.log(`✓ Znaleziono współrzędne: ${JSON.stringify(coordinates)}`);
    } else {
      console.log(`✗ Nie znaleziono współrzędnych dla: ${queryPlace}`);
      
      // Zapisz do listy nieznalezionych współrzędnych
      notFoundCoordinates.push(stationName);
    }
  } catch (error) {
    console.error(`Błąd podczas pobierania współrzędnych dla ${stationName}:`, error);
  }
  
  // Zapisz do pliku
  fs.writeFileSync('./coordinates_output.js', outputContent);
  console.log('Dane zostały zapisane do pliku coordinates_output.js');
}

// Uruchom skrypt
extractCoordinates().catch(console.error);

/*
INSTRUKCJA UŻYCIA:

1. Zainstaluj wymagane zależności:
   npm install node-fetch@2

2. Uruchom skrypt za pomocą:
   node scripts/CoordinatesExtractor.js
   
3. Po zakończeniu działania skryptu, plik coordinates_output.js będzie zawierał
   pełną bazę współrzędnych, którą można wykorzystać do aktualizacji
   stationCoordinatesService.js
*/