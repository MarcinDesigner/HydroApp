// Plik: app/context/NotificationContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAreaWarnings } from '../api/stationsApi';

// Tworzymy kontekst
const NotificationContext = createContext();

/**
 * Provider dla kontekstu powiadomień
 * Zarządza listą alertów i powiadomień w całej aplikacji
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Ładowanie ustawienia powiadomień
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const notificationsEnabled = await AsyncStorage.getItem('notifications_enabled');
        setEnabled(notificationsEnabled === null || notificationsEnabled === 'true');
      } catch (error) {
        console.error('Błąd podczas ładowania ustawień powiadomień:', error);
      }
    };

    loadSettings();
  }, []);

  // Funkcja do odświeżania listy powiadomień
  const refreshNotifications = async () => {
    if (!enabled) return [];
    
    try {
      setLoading(true);
      
      // W tym miejscu pobieramy ostrzeżenia z API
      const areaWarnings = await fetchAreaWarnings();
      
      // Mapuj ostrzeżenia na format powiadomień
      const newNotifications = areaWarnings.map((warning, index) => ({
        id: warning.uniqueId || `warning-${index}-${Date.now()}`,
        title: warning.opis_zagrozenia || 'Ostrzeżenie hydrologiczne',
        message: warning.zjawisko || warning.opis_zagrozenia || 'Alert hydrologiczny',
        description: warning.przebieg || `Poziom: ${warning.stan || 'N/A'} cm`,
        type: warning.stan > (warning.stan_ostrzegawczy || 0) * 1.5 ? 'alarm' : 
            warning.stan > (warning.stan_ostrzegawczy || 0) ? 'warning' : 'info',
        stationId: warning.id_stacji,
        stationName: warning.stacja || warning.nazwa_obszaru || 'Nieznana stacja',
        regionName: warning.regionName || warning.nazwa_obszaru || warning.wojewodztwo || 'Nieznany region',
        time: new Date().toISOString(),
        read: false
      }))
      .filter(notification => {
        // Filtrowanie powiadomień (np. tylko te z dzisiaj)
        const notificationTime = new Date(notification.time);
        const currentTime = new Date();
        // Weź tylko powiadomienia z ostatnich 24h
        return (currentTime - notificationTime) < 24 * 60 * 60 * 1000;
      });
      
      // Ustawienie nowych powiadomień
      setNotifications(newNotifications);
      setLastUpdate(new Date());
      setLoading(false);
      
      return newNotifications;
    } catch (error) {
      console.error('Błąd podczas odświeżania powiadomień:', error);
      setLoading(false);
      return [];
    }
  };

  // Funkcja do przełączania powiadomień
  const toggleNotifications = async (value) => {
    try {
      setEnabled(value);
      await AsyncStorage.setItem('notifications_enabled', value.toString());
      
      // Jeśli włączamy powiadomienia, odśwież listę
      if (value) {
        refreshNotifications();
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania ustawień powiadomień:', error);
    }
  };

  // Funkcja do oznaczania powiadomienia jako przeczytane
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Funkcja do usuwania powiadomienia
  const removeNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  // Funkcja do czyszczenia wszystkich powiadomień
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider 
      value={{
        notifications,
        enabled,
        loading,
        lastUpdate,
        refreshNotifications,
        toggleNotifications,
        markAsRead,
        removeNotification,
        clearAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook do korzystania z kontekstu powiadomień
export const useNotifications = () => useContext(NotificationContext);