// Plik: app/services/stationService.js (zmodyfikowany)
import { fetchStations, fetchStationDetails, fetchAlerts, fetchAreaWarnings } from '../api/stationsApi';
import geoDataService from './geoDataService';
import { findNearestSynopStation } from './stationCoordinatesService';

/**
 * Pobiera wszystkie stacje z pełnymi danymi (w tym współrzędnymi)
 * @returns {Promise<Array>} Lista stacji z pełnymi danymi
 */
export const getAllStations = async () => {
  try {
    // Pobieramy stacje z API
    const stations = await fetchStations();
    
    // Dla stacji, które nie mają współrzędnych, pobieramy je
    const stationsWithoutCoordinates = stations.filter(
      station => !station.latitude || !station.longitude
    );
    
    if (stationsWithoutCoordinates.length > 0) {
      console.log(`Pobieranie współrzędnych dla ${stationsWithoutCoordinates.length} stacji bez lokalizacji`);
      
      // Pobieramy współrzędne dla stacji, które ich nie mają
      const coordinates = await geoDataService.getStationsCoordinates(stationsWithoutCoordinates);
      
      // Uzupełniamy stacje o współrzędne
      return stations.map(station => {
        if (!station.latitude || !station.longitude) {
          const coords = coordinates[station.id];
          if (coords) {
            return {
              ...station,
              latitude: coords.latitude,
              longitude: coords.longitude
            };
          }
        }
        return station;
      });
    }
    
    return stations;
  } catch (error) {
    console.error('Błąd podczas pobierania stacji:', error);
    throw error;
  }
};

/**
 * Pobiera szczegóły stacji z pełnymi danymi oraz geometrią rzeki
 * @param {string} stationId - ID stacji
 * @returns {Promise<Object>} Szczegóły stacji
 */
export const getStationWithRiverData = async (stationId) => {
  try {
    // Pobieramy szczegóły stacji
    const stationDetails = await fetchStationDetails(stationId);
    
    // Jeśli stacja ma rzekę, pobieramy jej geometrię
    if (stationDetails.river && stationDetails.river !== 'Brak danych') {
      try {
        const riverGeometry = await geoDataService.getRiverGeometry(stationDetails.river);
        
        if (riverGeometry && riverGeometry.length > 0) {
          return {
            ...stationDetails,
            riverGeometry
          };
        }
      } catch (riverError) {
        console.warn(`Błąd podczas pobierania geometrii rzeki dla stacji ${stationId}:`, riverError);
        // Kontynuujemy bez geometrii rzeki
      }
    }
    
    // Dodajemy dane pogodowe z najbliższej stacji synoptycznej
    try {
      const nearestSynopStation = findNearestSynopStation(stationId, stationDetails.name);
      if (nearestSynopStation) {
        return {
          ...stationDetails,
          synopStationName: nearestSynopStation.name,
          synopStationCoordinates: nearestSynopStation.coordinates,
          synopStationDistance: nearestSynopStation.distance
        };
      }
    } catch (weatherError) {
      console.warn(`Błąd podczas pobierania danych pogodowych dla stacji ${stationId}:`, weatherError);
      // Kontynuujemy bez danych pogodowych
    }
    
    return stationDetails;
  } catch (error) {
    console.error(`Błąd podczas pobierania szczegółów stacji ${stationId}:`, error);
    throw error;
  }
};

/**
 * Pobiera stacje dla danej rzeki
 * @param {string} riverName - Nazwa rzeki
 * @returns {Promise<Array>} Lista stacji na rzece
 */
export const getStationsForRiver = async (riverName) => {
  try {
    // Pobieramy wszystkie stacje
    const allStations = await getAllStations();
    
    // Filtrujemy stacje dla danej rzeki
    // Uwzględniamy możliwe różnice w zapisie nazwy rzeki
    const normalizedRiverName = riverName.toLowerCase().trim();
    
    return allStations.filter(station => {
      if (!station.river) return false;
      
      const stationRiver = station.river.toLowerCase().trim();
      return stationRiver === normalizedRiverName || 
             stationRiver.includes(normalizedRiverName) || 
             normalizedRiverName.includes(stationRiver);
    });
  } catch (error) {
    console.error(`Błąd podczas pobierania stacji dla rzeki ${riverName}:`, error);
    throw error;
  }
};

/**
 * Pobiera alerty dla danego obszaru
 * @param {string} areaCode - Kod obszaru (np. województwa)
 * @returns {Promise<Array>} Lista alertów
 */
export const getAlertsForArea = async (areaCode) => {
  try {
    return await fetchAreaWarnings(areaCode);
  } catch (error) {
    console.error(`Błąd podczas pobierania alertów dla obszaru ${areaCode}:`, error);
    throw error;
  }
};

/**
 * Pobiera wszystkie dostępne alerty
 * @returns {Promise<Array>} Lista wszystkich alertów
 */
export const getAllAlerts = async () => {
  try {
    return await fetchAlerts();
  } catch (error) {
    console.error('Błąd podczas pobierania alertów:', error);
    throw error;
  }
};

/**
 * Pobiera stacje ulubione
 * @param {Array<string>} favoriteIds - Lista ID ulubionych stacji
 * @returns {Promise<Array>} Lista ulubionych stacji z pełnymi danymi
 */
export const getFavoriteStations = async (favoriteIds) => {
  if (!favoriteIds || favoriteIds.length === 0) {
    return [];
  }
  
  try {
    // Pobieramy wszystkie stacje
    const allStations = await getAllStations();
    
    // Filtrujemy tylko ulubione po ID
    const favorites = allStations.filter(station => 
      favoriteIds.includes(station.id) || favoriteIds.includes(station.id.toString())
    );
    
    return favorites;
  } catch (error) {
    console.error('Błąd podczas pobierania ulubionych stacji:', error);
    throw error;
  }
};

/**
 * Wyszukuje stacje po ID (preferowane) lub nazwie
 * @param {string} query - ID lub nazwa stacji do wyszukania
 * @returns {Promise<Array>} Lista znalezionych stacji
 */
export const searchStations = async (query) => {
  if (!query || typeof query !== 'string') {
    return [];
  }
  
  try {
    // Pobieramy wszystkie stacje
    const allStations = await getAllStations();
    
    // Najpierw szukamy dokładnego dopasowania ID
    const stationById = allStations.find(station => 
      station.id === query || station.id.toString() === query
    );
    
    if (stationById) {
      return [stationById];
    }
    
    // Następnie szukamy częściowego dopasowania ID
    const stationsByPartialId = allStations.filter(station => 
      station.id && station.id.toString().includes(query)
    );
    
    if (stationsByPartialId.length > 0) {
      return stationsByPartialId;
    }
    
    // Jeśli nie znaleziono po ID, szukamy po nazwie
    const query_lower = query.toLowerCase().trim();
    
    return allStations.filter(station => {
      const stationName = station.name ? station.name.toLowerCase() : '';
      const stationRiver = station.river ? station.river.toLowerCase() : '';
      
      return stationName.includes(query_lower) || stationRiver.includes(query_lower);
    });
  } catch (error) {
    console.error(`Błąd podczas wyszukiwania stacji dla zapytania ${query}:`, error);
    throw error;
  }
};

/**
 * Znajduje stację po dokładnym ID
 * @param {string} stationId - ID stacji
 * @returns {Promise<Object|null>} Znaleziona stacja lub null
 */
export const findStationById = async (stationId) => {
  try {
    // Pobieramy wszystkie stacje
    const allStations = await getAllStations();
    
    // Znajdujemy stację o podanym ID
    return allStations.find(station => 
      station.id === stationId || station.id.toString() === stationId
    ) || null;
  } catch (error) {
    console.error(`Błąd podczas wyszukiwania stacji o ID ${stationId}:`, error);
    throw error;
  }
};

export default {
  getAllStations,
  getStationWithRiverData,
  getStationsForRiver,
  getAlertsForArea,
  getAllAlerts,
  getFavoriteStations,
  searchStations,
  findStationById
};