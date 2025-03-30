// Plik: app/components/WeatherPanel.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WeatherPanel({ station, theme }) {
  // Dodajmy logowanie, aby zobaczyć co otrzymujemy
  console.log("Dane stacji w WeatherPanel:", station);
  
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
        Pogoda
      </Text>
      
      <View 
        style={[
          styles.weatherItem, 
          { borderBottomColor: theme.dark ? '#333' : '#EEE' }
        ]}
      >
        <View style={styles.weatherIconContainer}>
          <Ionicons name="location-outline" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.weatherContent}>
          <Text style={[styles.weatherLabel, { color: theme.colors.text }]}>
            Lokalizacja
          </Text>
          <Text style={[styles.weatherValue, { color: theme.colors.text }]}>
            {station.synopStationName || station.name || 'Brak danych'}
          </Text>
        </View>
      </View>
      
      <View 
        style={[
          styles.weatherItem, 
          { borderBottomColor: theme.dark ? '#333' : '#EEE' }
        ]}
      >
        <View style={styles.weatherIconContainer}>
          <Ionicons name="thermometer-outline" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.weatherContent}>
          <Text style={[styles.weatherLabel, { color: theme.colors.text }]}>
            Temperatura
          </Text>
          <Text style={[styles.weatherValue, { color: theme.colors.text }]}>
            {station.temperatura 
              ? `${station.temperatura}°C` 
              : station.temperatureWater 
                ? `${station.temperatureWater}°C` 
                : 'Brak danych'
            }
          </Text>
        </View>
      </View>
      
      <View 
        style={[
          styles.weatherItem, 
          { borderBottomColor: theme.dark ? '#333' : '#EEE' }
        ]}
      >
        <View style={styles.weatherIconContainer}>
          <Ionicons name="water-outline" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.weatherContent}>
          <Text style={[styles.weatherLabel, { color: theme.colors.text }]}>
            Suma opadów (mm)
          </Text>
          <Text style={[styles.weatherValue, { color: theme.colors.text }]}>
            {station.suma_opadu != null 
              ? station.suma_opadu 
              : 'Brak danych'
            }
          </Text>
        </View>
      </View>
      
      <View style={styles.weatherItem}>
        <View style={styles.weatherIconContainer}>
          <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.weatherContent}>
          <Text style={[styles.weatherLabel, { color: theme.colors.text }]}>
            Godzina pomiaru
          </Text>
          <Text style={[styles.weatherValue, { color: theme.colors.text }]}>
            {station.godzina_pomiaru 
              ? `${station.godzina_pomiaru}:10` 
              : station.updateTime 
                ? station.updateTime 
                : 'Brak danych'
            }
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  weatherItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  weatherIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  weatherContent: {
    flex: 1,
  },
  weatherLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  weatherValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});