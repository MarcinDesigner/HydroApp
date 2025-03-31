// Plik: app/services/geocodingService.js
import { Platform } from 'react-native';

// Wykorzystanie OpenStreetMap Nominatim API do geocodingu
// Nominatim jest darmowym serwisem, ale ma limity zapytań (1 zapytanie na sekundę)
// i wymaga dodania informacji o aplikacji w User-Agent
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

// Cache dla wyników geocodingu, aby uniknąć powtarzania zapytań
const geocodingCache = {};

/**
 * Pobiera współrzędne geograficzne dla nazwy miejscowości
 * @param {string} placeName - Nazwa miejscowości
 * @param {string} country - Kraj (opcjonalnie, domyślnie Polska)
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */
export const getCoordinatesForPlace = async (placeName, country = 'Polska') => {
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
    const response = await fetch(`${NOMINATIM_API}?${params}`, {
      headers: {
        // Zgodnie z zasadami Nominatim, należy dodać User-Agent
        'User-Agent': `HydroApp/${Platform.OS}-${Platform.Version}`
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
};

/**
 * Pobiera współrzędne dla wielu miejsc na raz
 * @param {Array<string>} placeNames - Tablica nazw miejsc
 * @param {string} country - Kraj (opcjonalnie)
 * @returns {Promise<Object>} - Obiekt mapujący nazwy miejsc na współrzędne
 */
export const batchGeocodeStations = async (stations, country = 'Polska') => {
  const results = {};
  
  // Unikalne nazwy stacji - unikamy duplikatów
  const uniqueStationNames = [...new Set(stations.map(station => station.name))];
  
  // Przetwarzamy partie po 5 zapytań jednocześnie,
  // aby nie przeciążyć serwisu Nominatim
  const batchSize = 5;
  
  for (let i = 0; i < uniqueStationNames.length; i += batchSize) {
    const batch = uniqueStationNames.slice(i, i + batchSize);
    
    // Wykonujemy zapytania równolegle dla partii
    const promises = batch.map(name => getCoordinatesForPlace(name, country));
    
    const batchResults = await Promise.all(promises);
    
    // Przypisujemy wyniki do końcowego obiektu
    batch.forEach((name, index) => {
      if (batchResults[index]) {
        results[name] = batchResults[index];
      }
    });
    
    // Dodajemy opóźnienie między partiami, aby nie przeciążyć API
    if (i + batchSize < uniqueStationNames.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
};

/**
 * Przybliżone współrzędne dla Polski, używane tylko jako ostateczność
 * @returns {{latitude: number, longitude: number}}
 */
export const getRandomPolishCoordinates = () => {
  // Przybliżone granice Polski
  const MIN_LAT = 49.0;
  const MAX_LAT = 54.8;
  const MIN_LON = 14.1;
  const MAX_LON = 24.1;
  
  const randomLat = MIN_LAT + Math.random() * (MAX_LAT - MIN_LAT);
  const randomLon = MIN_LON + Math.random() * (MAX_LON - MIN_LON);
  
  return {
    latitude: randomLat,
    longitude: randomLon
  };
};