
// Plik: app/screens/RiverMonitorScreen.js
// Komponent ekranu używający ulepszonego OdraRiverSystem

import React, { useState, useEffect } from 'react';
import { 
  View, 
  ActivityIndicator, 
  StyleSheet, 
  Text,
  RefreshControl,
  ScrollView
} from 'react-native';
import OdraRiverSystem from '../components/OdraRiverSystem';
import { getStationsData } from '../services/waterLevelService';
import { useTheme } from '@react-navigation/native';

const RiverMonitorScreen = () => {
  const theme = useTheme();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Funkcja do ładowania danych
  const loadData = async () => {
    try {
      const stationsData = await getStationsData();
      setStations(stationsData);
    } catch (error) {
      console.error('Błąd podczas ładowania danych:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Ładowanie danych przy montowaniu komponentu
  useEffect(() => {
    loadData();
  }, []);

  // Funkcja obsługująca odświeżanie przez użytkownika
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Ładowanie danych...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <OdraRiverSystem stations={stations} theme={theme} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default RiverMonitorScreen;