// Plik: app/context/AlertsContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAreaWarnings } from '../api/stationsApi';
import { useRefresh } from './RefreshContext';

// Tworzymy kontekst
const AlertsContext = createContext();

/**
 * Provider dla kontekstu alertów
 * Zarządza listą alertów i ostrzeżeń w aplikacji
 */
export const AlertsProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const { addListener, removeListener } = useRefresh();

  // Efekt inicjalizujący odświeżanie alertów
  useEffect(() => {
    // Pobierz alerty przy starcie
    loadAlerts();
    
    // Zarejestruj słuchacza odświeżania
    const refreshHandler = () => {
      loadAlerts(true);
    };
    
    addListener(refreshHandler);
    
    return () => {
      removeListener(refreshHandler);
    };
  }, [addListener, removeListener]);

  // Efekt filtrujący alerty po zmianie regionu
  useEffect(() => {
    if (selectedRegion) {
      setFilteredAlerts(alerts.filter(alert => 
        alert.regionId === selectedRegion || 
        (alert.regionName && alert.regionName.toLowerCase().includes(selectedRegion.toLowerCase()))
      ));
    } else {
      setFilteredAlerts(alerts);
    }
  }, [selectedRegion, alerts]);

  // Funkcja ładująca alerty
  const loadAlerts = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      
      // Pobieramy dane z API
      const data = await fetchAreaWarnings();
      
      // Mapowanie danych na format alertów
      const mappedAlerts = data.map((warning, index) => ({
        id: warning.uniqueId || `warning-${index}-${Date.now()}`,
        stationId: warning.id_stacji,
        stationName: warning.stacja || warning.nazwa_obszaru || 'Nieznana stacja',
        title: warning.opis_zagrozenia || 'Ostrzeżenie hydrologiczne',
        event: warning.zjawisko || warning.opis_zagrozenia || 'Alert hydrologiczny',
        course: warning.przebieg || `Poziom: ${warning.stan || 'N/A'} cm`,
        level: warning.stan ? parseInt(warning.stan) : 0,
        threshold: warning.stan_ostrzegawczy ? parseInt(warning.stan_ostrzegawczy) : 0,
        time: warning.waznosc_od ? `Od ${warning.waznosc_od} do ${warning.waznosc_do}` : new Date().toLocaleString(),
        regionName: warning.regionName || warning.nazwa_obszaru || warning.wojewodztwo || 'Nieznany region',
        regionId: warning.regionId || null,
        severity: warning.stopien_zagrozenia 
                ? parseInt(warning.stopien_zagrozenia) 
                : warning.stan > (warning.stan_ostrzegawczy || 0) * 1.5 ? 3 
                : warning.stan > (warning.stan_ostrzegawczy || 0) ? 2 
                : 1,
        type: warning.stan > (warning.stan_ostrzegawczy || 0) * 1.5 ? 'alarm' : 
              warning.stan > (warning.stan_ostrzegawczy || 0) ? 'warning' : 'info'
      }));
      
      setAlerts(mappedAlerts);
      setLastUpdate(new Date());
      
      if (!silent) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Błąd podczas ładowania alertów:', error);
      if (!silent) {
        setLoading(false);
      }
    }
  };

  // Funkcja zmieniająca wybrany region
  const changeRegion = (region) => {
    setSelectedRegion(region);
  };

  // Funkcja zwracająca alert po ID
  const getAlertById = (alertId) => {
    return alerts.find(alert => alert.id === alertId) || null;
  };

  return (
    <AlertsContext.Provider 
      value={{
        alerts,
        filteredAlerts,
        selectedRegion,
        loading,
        lastUpdate,
        loadAlerts,
        changeRegion,
        getAlertById
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};

// Hook do korzystania z kontekstu alertów
export const useAlerts = () => useContext(AlertsContext);