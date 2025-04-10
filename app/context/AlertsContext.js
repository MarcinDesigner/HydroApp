// Plik: app/context/AlertsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tworzenie kontekstu dla alertów
const AlertsContext = createContext();

// Klucz do przechowywania alertów w AsyncStorage
const STORAGE_KEY = 'hydro_custom_alerts';

// Provider dla kontekstu alertów
export const AlertsProvider = ({ children }) => {
  const [customAlerts, setCustomAlerts] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Ładowanie zapisanych alertów z AsyncStorage
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const savedAlerts = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedAlerts) {
          setCustomAlerts(JSON.parse(savedAlerts));
        }
        setInitialized(true);
      } catch (error) {
        console.error('Błąd podczas ładowania alertów:', error);
        setInitialized(true);
      }
    };

    loadAlerts();
  }, []);

  // Zapisywanie alertów do AsyncStorage po zmianach
  useEffect(() => {
    if (initialized) {
      const saveAlerts = async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(customAlerts));
        } catch (error) {
          console.error('Błąd podczas zapisywania alertów:', error);
        }
      };

      saveAlerts();
    }
  }, [customAlerts, initialized]);

  // Dodawanie nowego alertu
  const addAlert = (alert) => {
    if (!alert || !alert.stationId || !alert.threshold) {
      console.error('Niepoprawne dane alertu:', alert);
      return false;
    }

    // Sprawdź, czy nie ma już takiego samego alertu
    const existingAlertIndex = customAlerts.findIndex(
      a => a.stationId === alert.stationId && a.threshold === alert.threshold
    );

    if (existingAlertIndex >= 0) {
      console.log('Alert już istnieje');
      return false;
    }

    // Dodaj nowy alert
    setCustomAlerts(prev => [...prev, {
      ...alert,
      id: `custom-alert-${Date.now()}-${alert.stationId}`,
      createdAt: new Date().toISOString()
    }]);

    return true;
  };

  // Usuwanie alertu
  const removeAlert = (alertId) => {
    setCustomAlerts(prev => prev.filter(alert => alert.id !== alertId));
    return true;
  };

  // Sprawdzanie, czy stacja ma ustawione alerty
  const hasAlertsForStation = (stationId) => {
    return customAlerts.some(alert => alert.stationId === stationId);
  };

  // Pobieranie alertów dla konkretnej stacji
  const getAlertsForStation = (stationId) => {
    return customAlerts.filter(alert => alert.stationId === stationId);
  };

  // Sprawdzanie, czy poziom stacji przekracza próg ustawiony w alercie
  const checkThresholdExceeded = (station) => {
    if (!station || !station.id || !station.level) return [];

    const stationAlerts = getAlertsForStation(station.id);
    return stationAlerts.filter(alert => {
      // Sprawdź, czy poziom przekracza próg alertu
      if (alert.operation === 'above') {
        return station.level >= alert.threshold;
      } else if (alert.operation === 'below') {
        return station.level <= alert.threshold;
      }
      return false;
    });
  };

  return (
    <AlertsContext.Provider
      value={{
        customAlerts,
        addAlert,
        removeAlert,
        hasAlertsForStation,
        getAlertsForStation,
        checkThresholdExceeded,
        initialized
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};

// Hook do użycia kontekstu alertów
export const useAlerts = () => useContext(AlertsContext);