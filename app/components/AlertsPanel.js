// Plik: app/components/AlertsPanel.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AlertsPanel({ station, theme }) {
  if (!station.alerts || station.alerts.length === 0) {
    return (
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Powiadomienia
        </Text>
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="notifications-off-outline" 
            size={48} 
            color={theme.dark ? '#555' : '#CCC'} 
          />
          <Text style={[styles.emptyText, { color: theme.dark ? '#AAA' : '#666' }]}>
            Brak aktualnych powiadomień
          </Text>
        </View>
      </View>
    );
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'alarm': return 'warning';
      case 'warning': return 'alert-circle';
      case 'info': return 'information-circle';
      default: return 'ellipse';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'alarm': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.text;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Powiadomienia
        </Text>
        {station.alerts.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{station.alerts.length}</Text>
          </View>
        )}
      </View>
      
      {station.alerts.map(alert => (
        <View
          key={alert.id}
          style={[
            styles.alertItem,
            { borderBottomColor: theme.dark ? '#333' : '#EEE' }
          ]}
        >
          <Ionicons 
            name={getAlertIcon(alert.type)} 
            size={24} 
            color={getAlertColor(alert.type)} 
            style={styles.alertIcon}
          />
          <View style={styles.alertContent}>
            <Text style={[styles.alertMessage, { color: theme.colors.text }]}>
              {alert.message}
            </Text>
            <Text style={[styles.alertTime, { color: theme.dark ? '#AAA' : '#666' }]}>
              {alert.time}
            </Text>
          </View>
        </View>
      ))}
      
      {station.alerts.length > 0 && (
        <TouchableOpacity style={styles.showAllButton}>
          <Text style={[styles.showAllText, { color: theme.colors.primary }]}>
            Pokaż wszystkie powiadomienia
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  countBadge: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
  },
  alertItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  alertIcon: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
  },
  showAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    padding: 8,
  },
  showAllText: {
    fontSize: 14,
    marginRight: 4,
  },
});