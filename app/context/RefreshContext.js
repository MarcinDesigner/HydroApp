// Plik: app/context/RefreshContext.js
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const RefreshContext = createContext();

const REFRESH_INTERVALS = {
  '5min': 5 * 60 * 1000,
  '15min': 15 * 60 * 1000,
  '30min': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
};

export const RefreshProvider = ({ children }) => {
  const [refreshInterval, setRefreshInterval] = useState('15min');
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const refreshTimerRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const listenersRef = useRef([]);

  // Ładowanie zapisanego interwału odświeżania
  useEffect(() => {
    const loadRefreshInterval = async () => {
      try {
        const savedInterval = await AsyncStorage.getItem('refresh_interval');
        if (savedInterval !== null && REFRESH_INTERVALS[savedInterval]) {
          setRefreshInterval(savedInterval);
        }
      } catch (error) {
        console.error('Błąd podczas ładowania interwału odświeżania:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadRefreshInterval();

    // Monitorowanie stanu połączenia sieciowego
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Monitorowanie stanu aplikacji (aktywna/w tle)
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // Aplikacja wróciła na pierwszy plan, sprawdźmy czy trzeba odświeżyć dane
        checkIfRefreshNeeded();
      }
      appState.current = nextAppState;
    });

    return () => {
      unsubscribeNetInfo();
      subscription.remove();
      clearAutoRefresh();
    };
  }, []);

  // Zapisywanie interwału odświeżania przy zmianie
  useEffect(() => {
    const saveRefreshInterval = async () => {
      if (!isLoaded) return;
      
      try {
        await AsyncStorage.setItem('refresh_interval', refreshInterval);
      } catch (error) {
        console.error('Błąd podczas zapisywania interwału odświeżania:', error);
      }
    };

    saveRefreshInterval();
    setupAutoRefresh();
  }, [refreshInterval, isLoaded]);

  // Funkcja sprawdzająca czy potrzebne jest odświeżenie
  const checkIfRefreshNeeded = useCallback(() => {
    if (!isConnected) return;
    
    const now = new Date();
    const timeSinceLastRefresh = now - lastRefreshTime;
    const currentInterval = REFRESH_INTERVALS[refreshInterval];
    
    if (timeSinceLastRefresh >= currentInterval) {
      refreshData();
    }
  }, [lastRefreshTime, refreshInterval, isConnected]);

  // Ustaw timer automatycznego odświeżania
  const setupAutoRefresh = useCallback(() => {
    clearAutoRefresh();
    
    if (isLoaded && isConnected) {
      const intervalMs = REFRESH_INTERVALS[refreshInterval];
      refreshTimerRef.current = setInterval(() => {
        if (appState.current === 'active') {
          refreshData();
        }
      }, intervalMs);
    }
  }, [refreshInterval, isLoaded, isConnected]);

  // Czyszczenie timera
  const clearAutoRefresh = () => {
    if (refreshTimerRef.current !== null) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  // Funkcja do ręcznego odświeżania danych
  const refreshData = useCallback(() => {
    if (isRefreshing || !isConnected) return;
    
    setIsRefreshing(true);
    
    // Powiadomienie wszystkich listenerów o odświeżaniu
    listenersRef.current.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Błąd podczas wywoływania listenera odświeżania:', error);
      }
    });
    
    // Zakończenie odświeżania
    setTimeout(() => {
      setLastRefreshTime(new Date());
      setIsRefreshing(false);
    }, 1500);
  }, [isRefreshing, isConnected]);

  // Funkcje do zarządzania listenerami
  const addListener = (listener) => {
    listenersRef.current.push(listener);
  };

  const removeListener = (listener) => {
    listenersRef.current = listenersRef.current.filter(l => l !== listener);
  };

  return (
    <RefreshContext.Provider value={{ 
      refreshInterval,
      lastRefreshTime,
      isRefreshing,
      isConnected,
      changeRefreshInterval: async (newInterval) => {
        if (REFRESH_INTERVALS[newInterval]) {
          setRefreshInterval(newInterval);
        }
      },
      refreshData,
      addListener,
      removeListener,
      refreshIntervals: Object.keys(REFRESH_INTERVALS)
    }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);