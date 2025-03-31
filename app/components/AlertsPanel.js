// Plik: app/components/AlertsPanel.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AlertsPanel({ station, theme }) {
  // Filtrujemy przestarzałe powiadomienia (starsze niż 30 dni)
  const filterCurrentAlerts = (alerts) => {
    if (!alerts) return [];
    
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    return alerts.filter(alert => {
      // Jeśli alert nie ma daty lub data jest nieprawidłowa, pomijamy go
      if (!alert.time) return false;
      
      // Sprawdzamy czy alert zawiera datę (można rozpoznać po formacie)
      const hasDate = /\d{1,2}\.\d{1,2}\.\d{4}/.test(alert.time) || 
                     /\d{4}-\d{1,2}-\d{1,2}/.test(alert.time);
      
      if (!hasDate) return true; // Jeśli nie ma daty, zachowujemy (nie mamy jak filtrować)
      
      try {
        // Próbujemy wyłuskać datę z różnych formatów
        let alertDate;
        if (alert.time.includes('.')) {
          // Format DD.MM.YYYY
          const parts = alert.time.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
          if (parts) {
            alertDate = new Date(parts[3], parts[2] - 1, parts[1]);
          }
        } else if (alert.time.includes('-')) {
          // Format YYYY-MM-DD
          alertDate = new Date(alert.time.split(' ')[0]);
        }
        
        // Jeśli nie udało się sparsować daty, zachowujemy alert
        if (!alertDate || isNaN(alertDate.getTime())) return true;
        
        // Filtrujemy alerty starsze niż 30 dni
        return alertDate >= thirtyDaysAgo;
      } catch (error) {
        console.warn('Błąd parsowania daty alertu:', error);
        return true; // W razie błędu, zachowujemy alert
      }
    });
  };
  
  // Pobieramy aktualne alerty
  const currentAlerts = filterCurrentAlerts(station.alerts);
  
  // Jeśli stacja ma dane o temperaturze wody, dodajemy aktualne powiadomienie
  const generateCurrentWaterTempAlert = () => {
    if (station.temperatureWater) {
      const currentDate = new Date();
      const dateString = `${currentDate.toLocaleDateString('pl-PL')} ${currentDate.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}`;
      
      return {
        id: 'current-water-temp',
        type: 'info',
        message: `Temperatura wody: ${station.temperatureWater}°C`,
        time: dateString,
        stationName: station.name,
        river: station.river,
        isNew: true // Oznaczamy jako nowe powiadomienie
      };
    }
    return null;
  };
  
  // Dodajemy bieżące powiadomienie o temperaturze wody
  const waterTempAlert = generateCurrentWaterTempAlert();
  const allAlerts = waterTempAlert 
    ? [waterTempAlert, ...currentAlerts.filter(a => a.id !== 'current-water-temp')]
    : currentAlerts;

  if (!allAlerts || allAlerts.length === 0) {
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
        {allAlerts.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{allAlerts.length}</Text>
          </View>
        )}
      </View>
      
      {allAlerts.map(alert => (
        <View
          key={alert.id}
          style={[
            styles.alertItem,
            { borderBottomColor: theme.dark ? '#333' : '#EEE' },
            alert.isNew && styles.newAlert
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
              {alert.isNew && <Text style={styles.newBadge}> • Nowe</Text>}
            </Text>
            <Text style={[styles.alertTime, { color: theme.dark ? '#AAA' : '#666' }]}>
              {alert.time}
            </Text>
          </View>
        </View>
      ))}
      
      {allAlerts.length > 1 && (
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
  newAlert: {
    backgroundColor: 'rgba(33, 150, 243, 0.05)',
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
  newBadge: {
    color: '#2196F3',
    fontWeight: 'bold',
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