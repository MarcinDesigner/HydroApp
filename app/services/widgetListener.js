// Plik: app/services/widgetListener.js
import { Platform } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import widgetService from './widgetService';
import { fetchStationDetails } from '../api/stationsApi';

/**
 * Hook nasłuchujący zdarzeń związanych z widgetami
 * @param {Object} navigation - Obiekt nawigacji
 * @param {Function} onWidgetRefresh - Funkcja wywoływana po odświeżeniu widgetu
 */
export const useWidgetListener = (navigation, onWidgetRefresh) => {
  useEffect(() => {
    const refreshWidgetData = async () => {
      try {
        // Pobieramy ID stacji widgetu z AsyncStorage
        const widgetEnabled = await AsyncStorage.getItem('widget_enabled');
        if (widgetEnabled !== 'true') return;
        
        const stationId = await AsyncStorage.getItem('widget_station_id');
        if (!stationId) return;
        
        // Pobieramy dane stacji
        const stationData = await fetchStationDetails(stationId);
        
        // Aktualizujemy widget
        await widgetService.updateWidgetData(stationData);
        
        // Wywołujemy callback
        if (onWidgetRefresh) {
          onWidgetRefresh(stationData);
        }
      } catch (error) {
        console.error('Błąd podczas odświeżania danych widgetu:', error);
      }
    };
    
    // Ustawiamy interwał odświeżania widgetu (co 30 minut)
    const widgetRefreshInterval = setInterval(() => {
      refreshWidgetData();
    }, 30 * 60 * 1000);
    
    // Odświeżamy dane widgetu przy uruchomieniu
    refreshWidgetData();
    
    // Sprzątamy interwał przy odmontowaniu
    return () => {
      clearInterval(widgetRefreshInterval);
    };
  }, [onWidgetRefresh]);
  
  // Dodajemy nasłuchiwanie na zdarzenia uruchomienia aplikacji (np. z widgetu)
  useEffect(() => {
    // Tutaj można dodać kod nasłuchujący na zdarzenia uruchomienia aplikacji
    // np. z widgetu poprzez parametry przekazane w intent/url
  }, [navigation]);
};