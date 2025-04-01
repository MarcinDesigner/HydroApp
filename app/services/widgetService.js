// Plik: app/services/widgetService.js
import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importujemy ewentualne natywne moduły dla widgetów
const { WidgetModule } = NativeModules;

/**
 * Serwis do zarządzania danymi i aktualizacjami widgetów.
 * Obsługuje zarówno widgety iOS jak i Android.
 */
class WidgetService {
  /**
   * Aktualizuje dane widgetu dla wybranej stacji
   * @param {Object} station - Dane stacji hydrologicznej
   * @returns {Promise<boolean>} - Czy operacja się powiodła
   */
  async updateWidgetData(station) {
    if (!station) return false;
    
    try {
      // Tworzymy obiekt danych dla widgetu
      const stationData = {
        name: station.name || 'Brak danych',
        river: station.river || 'Brak danych',
        level: station.level || 0,
        trend: this._getTrendType(station.trend, station.trendValue),
        status: station.status || 'normal',
        updateTime: station.updateTime || this._getCurrentTime()
      };
      
      // Zapisujemy dane w AsyncStorage dla React Native
      await AsyncStorage.setItem('widget_station_data', JSON.stringify(stationData));
      
      // Wywoływanie natywnych metod dla każdej platformy
      if (Platform.OS === 'android') {
        return this._updateAndroidWidget(stationData);
      } else if (Platform.OS === 'ios') {
        return this._updateIosWidget(stationData);
      }
      
      return true;
    } catch (error) {
      console.error('Błąd podczas aktualizacji widgetu:', error);
      return false;
    }
  }
  
  /**
   * Pobiera dane ostatnio zapisanej stacji dla widgetu
   * @returns {Promise<Object|null>} - Dane stacji lub null
   */
  async getWidgetStationData() {
    try {
      const stationDataJson = await AsyncStorage.getItem('widget_station_data');
      if (stationDataJson) {
        return JSON.parse(stationDataJson);
      }
      return null;
    } catch (error) {
      console.error('Błąd podczas pobierania danych widgetu:', error);
      return null;
    }
  }
  
  /**
   * Aktualizuje widget w systemie Android
   * @param {Object} stationData - Dane stacji dla widgetu
   * @returns {Promise<boolean>} - Czy operacja się powiodła
   * @private
   */
  async _updateAndroidWidget(stationData) {
    try {
      if (WidgetModule && WidgetModule.updateWidget) {
        // Konwertujemy dane do formatu zrozumiałego przez Kotlina
        await WidgetModule.updateWidget(JSON.stringify(stationData));
      } else {
        // Jeśli moduł natywny nie jest dostępny, zapisujemy dane w SharedPreferences
        await AsyncStorage.setItem('widget_station_data', JSON.stringify(stationData));
      }
      return true;
    } catch (error) {
      console.error('Błąd podczas aktualizacji widgetu Android:', error);
      return false;
    }
  }
  
  /**
   * Aktualizuje widget w systemie iOS
   * @param {Object} stationData - Dane stacji dla widgetu
   * @returns {Promise<boolean>} - Czy operacja się powiodła
   * @private
   */
  async _updateIosWidget(stationData) {
    try {
      if (WidgetModule && WidgetModule.updateWidget) {
        // Konwertujemy dane do formatu zrozumiałego przez Swift
        await WidgetModule.updateWidget(stationData);
      } else {
        // Jeśli moduł natywny nie jest dostępny, zapisujemy dane w UserDefaults
        await AsyncStorage.setItem('widget_station_data', JSON.stringify(stationData));
      }
      return true;
    } catch (error) {
      console.error('Błąd podczas aktualizacji widgetu iOS:', error);
      return false;
    }
  }
  
  /**
   * Konwertuje trend na format zrozumiały dla widgetu
   * @param {string} trend - Trend z API ('up', 'down', 'stable')
   * @param {number} trendValue - Wartość trendu
   * @returns {string} - Trend w formacie dla widgetu
   * @private
   */
  _getTrendType(trend, trendValue) {
    if (!trend) {
      return Math.abs(trendValue || 0) < 2 ? 'stable' : (trendValue > 0 ? 'up' : 'down');
    }
    return trend;
  }
  
  /**
   * Zwraca aktualny czas w formacie HH:MM
   * @returns {string} - Czas w formacie HH:MM
   * @private
   */
  _getCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
}

// Eksportujemy instancję serwisu
export default new WidgetService();