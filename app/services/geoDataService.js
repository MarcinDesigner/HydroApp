// Plik: app/services/geoDataService.js
import { HYDRO_STATION_COORDINATES } from './stationCoordinatesService';
import { getCoordinatesForPlace } from './geocodingService';
import { getRiverCoordinates } from './riverCoordinatesService';

/**
 * Serwis do obsługi danych geograficznych - współrzędnych stacji i geometrii rzek
 */
class GeoDataService {
  /**
   * Pobiera lub oblicza współrzędne dla podanych stacji
   * @param {Array} stations - Lista stacji do przetworzenia
   * @returns {Promise<Object>} - Obiekt mapujący ID stacji na współrzędne
   */
  async getStationsCoordinates(stations) {
    if (!stations || stations.length === 0) {
      return {};
    }

    const results = {};

    for (const station of stations) {
      // Najpierw sprawdź, czy mamy już współrzędne w stałej HYDRO_STATION_COORDINATES (po ID)
      if (HYDRO_STATION_COORDINATES[station.id]) {
        results[station.id] = HYDRO_STATION_COORDINATES[station.id];
        continue;
      }

      // Sprawdź po nazwie stacji
      if (station.name && HYDRO_STATION_COORDINATES[station.name]) {
        results[station.id] = HYDRO_STATION_COORDINATES[station.name];
        continue;
      }

      // Jeśli nie ma w stałych, użyj serwisu geocodingu (jeśli jest dostępny)
      if (station.name) {
        try {
          // Próba znalezienia współrzędnych na podstawie nazwy stacji
          const coords = await getCoordinatesForPlace(station.name, 'Polska');
          if (coords) {
            results[station.id] = coords;
            continue;
          }
        } catch (error) {
          console.warn(`Błąd podczas geocodingu dla stacji ${station.name}:`, error);
          // Kontynuuj mimo błędu
        }
      }

      // Jeśli to województwo lub rzeka, możemy spróbować użyć geocodingu dla tych nazw
      if (station.wojewodztwo) {
        try {
          const coords = await getCoordinatesForPlace(station.wojewodztwo, 'Polska');
          if (coords) {
            results[station.id] = coords;
            continue;
          }
        } catch (error) {
          console.warn(`Błąd podczas geocodingu dla województwa ${station.wojewodztwo}:`, error);
          // Kontynuuj mimo błędu
        }
      }

      if (station.river) {
        try {
          const coords = await getCoordinatesForPlace(station.river, 'Polska');
          if (coords) {
            results[station.id] = coords;
            continue;
          }
        } catch (error) {
          console.warn(`Błąd podczas geocodingu dla rzeki ${station.river}:`, error);
          // Kontynuuj mimo błędu
        }
      }

      // Domyślne współrzędne dla Polski
      results[station.id] = { latitude: 52.0, longitude: 19.0 };
    }

    return results;
  }

  /**
   * Pobiera geometrię rzeki (współrzędne punktów określających jej bieg)
   * @param {string} riverName - Nazwa rzeki
   * @returns {Promise<Array>} - Tablica współrzędnych geograficznych
   */
  async getRiverGeometry(riverName) {
    try {
      // Pobierz predefiniowane współrzędne rzeki z serwisu
      const riverCoords = getRiverCoordinates(riverName);
      if (riverCoords && riverCoords.length > 0) {
        return riverCoords;
      }

      // Jeśli nie ma predefiniowanych współrzędnych, możemy
      // zwrócić kilka punktów wzdłuż Polski jako przybliżenie
      console.warn(`Brak predefiniowanych współrzędnych dla rzeki ${riverName}, używam przybliżenia`);
      
      // Uproszczone przybliżenie biegu rzeki
      return [
        { latitude: 49.5 + Math.random() * 0.5, longitude: 19.0 + Math.random() * 0.5 }, // Południe Polski
        { latitude: 50.5 + Math.random() * 0.5, longitude: 19.5 + Math.random() * 0.5 },
        { latitude: 51.5 + Math.random() * 0.5, longitude: 20.0 + Math.random() * 0.5 }, // Środek Polski
        { latitude: 52.5 + Math.random() * 0.5, longitude: 19.5 + Math.random() * 0.5 },
        { latitude: 53.5 + Math.random() * 0.5, longitude: 19.0 + Math.random() * 0.5 }, // Północ Polski
        { latitude: 54.5 + Math.random() * 0.5, longitude: 18.5 + Math.random() * 0.5 }  // Wybrzeże
      ];
    } catch (error) {
      console.error(`Błąd podczas pobierania geometrii rzeki ${riverName}:`, error);
      return [];
    }
  }

  /**
   * Oblicza najbliższe stacje do podanej lokalizacji
   * @param {Object} location - Obiekt zawierający współrzędne (latitude, longitude)
   * @param {Array} stations - Lista stacji do przeszukania
   * @param {number} limit - Maksymalna liczba zwracanych stacji
   * @returns {Array} - Lista najbliższych stacji z dodanym polem distance (odległość w km)
   */
  findNearestStations(location, stations, limit = 5) {
    if (!location || !stations || stations.length === 0) {
      return [];
    }

    const stationsWithCoordinates = stations.filter(
      station => station.latitude && station.longitude
    );

    // Oblicz odległość od każdej stacji do podanej lokalizacji
    const stationsWithDistance = stationsWithCoordinates.map(station => {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        station.latitude,
        station.longitude
      );

      return {
        ...station,
        distance
      };
    });

    // Sortuj stacje po odległości (od najbliższej)
    const sortedStations = stationsWithDistance.sort((a, b) => a.distance - b.distance);

    // Zwróć określoną liczbę najbliższych stacji
    return sortedStations.slice(0, limit);
  }

  /**
   * Oblicza odległość między dwoma punktami geograficznymi (wzór Haversine)
   * @param {number} lat1 - Szerokość geograficzna punktu 1 (w stopniach)
   * @param {number} lon1 - Długość geograficzna punktu 1 (w stopniach)
   * @param {number} lat2 - Szerokość geograficzna punktu 2 (w stopniach)
   * @param {number} lon2 - Długość geograficzna punktu 2 (w stopniach)
   * @returns {number} - Odległość w kilometrach
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Promień Ziemi w km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Konwertuje stopnie na radiany
   * @param {number} degrees - Kąt w stopniach
   * @returns {number} - Kąt w radianach
   */
  toRadians(degrees) {
    return degrees * Math.PI / 180;
  }
}

// Eksportujemy instancję serwisu
export default new GeoDataService();