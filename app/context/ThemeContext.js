// Plik: app/context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === 'dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Załadowanie zapisanego trybu przy uruchomieniu
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme_mode');
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        } else {
          setIsDarkMode(deviceTheme === 'dark');
        }
      } catch (error) {
        console.error('Błąd podczas ładowania ustawień motywu:', error);
        setIsDarkMode(deviceTheme === 'dark');
      } finally {
        setIsLoaded(true);
      }
    };

    loadSavedTheme();
  }, [deviceTheme]);

  // Automatyczne dostosowanie do zmian motywu systemowego, jeśli użytkownik nie wybrał ręcznie
  useEffect(() => {
    if (!isLoaded) return;
    
    const checkIfSystemMode = async () => {
      try {
        const savedThemeChoice = await AsyncStorage.getItem('theme_choice');
        if (savedThemeChoice === 'system') {
          setIsDarkMode(deviceTheme === 'dark');
        }
      } catch (error) {
        console.error('Błąd podczas sprawdzania trybu motywu:', error);
      }
    };

    checkIfSystemMode();
  }, [deviceTheme, isLoaded]);

  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('theme_mode', newMode ? 'dark' : 'light');
      await AsyncStorage.setItem('theme_choice', 'manual');
    } catch (error) {
      console.error('Błąd podczas zapisywania ustawień motywu:', error);
    }
  };

  const setSystemTheme = async () => {
    try {
      setIsDarkMode(deviceTheme === 'dark');
      await AsyncStorage.setItem('theme_choice', 'system');
    } catch (error) {
      console.error('Błąd podczas ustawiania motywu systemowego:', error);
    }
  };

  const theme = {
    dark: isDarkMode,
    colors: isDarkMode ? {
      primary: '#2196F3',
      background: '#121212',
      card: '#1E1E1E',
      text: '#FFFFFF',
      border: '#272727',
      notification: '#FF9800',
      danger: '#F44336',
      warning: '#FFC107',
      safe: '#4CAF50',
      info: '#2196F3',
    } : {
      primary: '#2196F3',
      background: '#F5F5F5',
      card: '#FFFFFF',
      text: '#212121',
      border: '#E0E0E0',
      notification: '#FF9800',
      danger: '#F44336',
      warning: '#FFC107',
      safe: '#4CAF50',
      info: '#2196F3',
    },
  };

  if (!isLoaded) {
    return null; // lub komponent ładowania
  }

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);