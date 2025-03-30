// Plik: app/components/Card.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Card({ title, children, style }) {
  const { theme } = useTheme();
  
  return (
    <View 
      style={[
        styles.card, 
        { backgroundColor: theme.colors.card },
        style
      ]}
    >
      {title && (
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
});