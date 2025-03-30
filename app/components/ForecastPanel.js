// Plik: app/components/ForecastPanel.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ForecastPanel({ station, theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
        Prognoza hydrologiczna
      </Text>
      
      <View 
        style={[
          styles.forecastItem, 
          { borderBottomColor: theme.dark ? '#333' : '#EEE' }
        ]}
      >
        <View style={styles.forecastIconContainer}>
          <Ionicons name="today-outline" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.forecastContent}>
          <Text style={[styles.forecastPeriod, { color: theme.colors.text }]}>
            Dziś
          </Text>
          <Text style={[styles.forecastText, { color: theme.colors.text }]}>
            {station.forecast?.today || 'Brak prognozy'}
          </Text>
        </View>
      </View>
      
      <View 
        style={[
          styles.forecastItem, 
          { borderBottomColor: theme.dark ? '#333' : '#EEE' }
        ]}
      >
        <View style={styles.forecastIconContainer}>
          <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.forecastContent}>
          <Text style={[styles.forecastPeriod, { color: theme.colors.text }]}>
            Jutro
          </Text>
          <Text style={[styles.forecastText, { color: theme.colors.text }]}>
            {station.forecast?.tomorrow || 'Brak prognozy'}
          </Text>
        </View>
      </View>
      
      <View style={styles.forecastItem}>
        <View style={styles.forecastIconContainer}>
          <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.forecastContent}>
          <Text style={[styles.forecastPeriod, { color: theme.colors.text }]}>
            Najbliższy tydzień
          </Text>
          <Text style={[styles.forecastText, { color: theme.colors.text }]}>
            {station.forecast?.week || 'Brak prognozy długoterminowej'}
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
  forecastItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  forecastIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  forecastContent: {
    flex: 1,
  },
  forecastPeriod: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  forecastText: {
    fontSize: 14,
    lineHeight: 20,
  },
});