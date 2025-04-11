// Plik: app/components/AppNotificationWrapper.js
import React, { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import CustomAlertManager from './CustomAlertManager';
import { useNavigation } from '@react-navigation/native';
import { useNotifications } from '../context/NotificationContext';

/**
 * Komponent opakowujący aplikację, który zarządza powiadomieniami w całej aplikacji
 * niezależnie od aktualnego ekranu
 */
const AppNotificationWrapper = ({ children }) => {
  const { 
    notifications, 
    refreshNotifications, 
    enabled,
    markAsRead
  } = useNotifications();
  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  
  // Filtruj tylko nieprzeczytane powiadomienia do wyświetlenia
  useEffect(() => {
    if (enabled) {
      setVisibleNotifications(notifications.filter(notification => !notification.read));
    } else {
      setVisibleNotifications([]);
    }
  }, [notifications, enabled]);
  
  // Sprawdzanie nowych powiadomień przy wznowieniu aplikacji
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) && 
        nextAppState === 'active' && 
        enabled
      ) {
        // Aplikacja wraca na pierwszy plan - odśwież powiadomienia
        refreshNotifications();
      }
      
      appState.current = nextAppState;
    };
    
    // Dodaj nasłuchiwacz zmian stanu aplikacji
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [enabled, refreshNotifications]);
  
  // Obsługa kliknięcia w powiadomienie
  const handleNotificationPress = (notification) => {
    if (notification.stationId) {
      // Oznacz jako przeczytane
      markAsRead(notification.id);
      
      // Nawiguj do ekranu szczegółów stacji
      navigation.navigate('StationDetails', {
        stationId: notification.stationId,
        stationName: notification.stationName
      });
    }
  };
  
  return (
    <>
      {children}
      
      {/* Menedżer powiadomień wyświetlany ponad całą aplikacją */}
      <CustomAlertManager 
        alerts={visibleNotifications}
        onPress={handleNotificationPress}
        onDismiss={markAsRead}
        autoHide={true}
        duration={7000}
      />
    </>
  );
};

export default AppNotificationWrapper;