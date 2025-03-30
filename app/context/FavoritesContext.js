// Plik: app/context/FavoritesContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Ładowanie ulubionych stacji z AsyncStorage przy uruchomieniu
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem('favorites');
        if (savedFavorites !== null) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Błąd podczas ładowania ulubionych stacji:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadFavorites();
  }, []);

  // Zapisywanie ulubionych stacji do AsyncStorage przy zmianie
  useEffect(() => {
    const saveFavorites = async () => {
      if (!isLoaded) return;
      
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Błąd podczas zapisywania ulubionych stacji:', error);
      }
    };

    saveFavorites();
  }, [favorites, isLoaded]);

  // Sprawdzanie czy stacja jest ulubiona
  const isFavorite = (stationId) => {
    return favorites.includes(stationId);
  };

  // Dodawanie lub usuwanie stacji z ulubionych
  const toggleFavorite = (stationId) => {
    if (isFavorite(stationId)) {
      setFavorites(favorites.filter(id => id !== stationId));
    } else {
      setFavorites([...favorites, stationId]);
    }
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      isFavorite, 
      toggleFavorite, 
      isLoaded 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);