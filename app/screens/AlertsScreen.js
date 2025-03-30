// Plik: app/screens/AlertsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import Loader from '../components/Loader';

export default function AlertsScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { isRefreshing, addListener, removeListener } = useRefresh();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  // Efekt dla automatycznego odświeżania
  useEffect(() => {
    // Rejestrujemy funkcję odświeżania w kontekście
    const onRefreshCallback = () => {
      loadAlerts(true); // true = cicha aktualizacja (bez wskaźnika ładowania)
    };

    // Dodaj listener dla globalnego refreshData
    addListener(onRefreshCallback);

    // Cleanup
    return () => {
      removeListener(onRefreshCallback);
    };
  }, []);

  const loadAlerts = (silent = false) => {
    // Symulowane dane alertów
    if (!silent) {
      setRefreshing(true);
    }

    setTimeout(() => {
      setAlerts([
        {
          id: 1,
          stationId: 1,
          stationName: 'Płock',
          river: 'Wisła',
          type: 'alarm',
          message: 'Przekroczony stan alarmowy o 22 cm',
          time: '14:00, 30.03.2025',
          isRead: false
        },
        {
          id: 2,
          stationId: 1,
          stationName: 'Płock',
          river: 'Wisła',
          type: 'info',
          message: 'Wprowadzono alarm przeciwpowodziowy w powiecie',
          time: '10:30, 30.03.2025',
          isRead: true
        },
        {
          id: 3,
          stationId: 2,
          stationName: 'Warszawa',
          river: 'Wisła',
          type: 'warning',
          message: 'Przekroczony stan ostrzegawczy o 18 cm',
          time: '14:30, 30.03.2025',
          isRead: false
        },
        {
          id: 4,
          stationId: 5,
          stationName: 'Opole',
          river: 'Odra',
          type: 'warning',
          message: 'Przekroczony stan ostrzegawczy o 5 cm',
          time: '09:15, 30.03.2025',
          isRead: true
        }
      ]);
      
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  const handleAlertPress = (alert) => {
    navigation.navigate('StationDetails', { 
      stationId: alert.stationId,
      stationName: alert.stationName
    });
    
    // Oznaczamy alert jako przeczytany
    setAlerts(currentAlerts => 
      currentAlerts.map(item => 
        item.id === alert.id 
          ? { ...item, isRead: true } 
          : item
      )
    );
  };

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

  if (loading && !refreshing) {
    return <Loader message="Ładowanie alertów..." />;
  }

  if (alerts.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons 
          name="notifications-off-outline" 
          size={64} 
          color={theme.dark ? '#555' : '#CCC'} 
        />
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          Brak alertów
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.dark ? '#AAA' : '#666' }]}>
          Aktualnie nie ma żadnych powiadomień o alertach hydrologicznych
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.alertItem, 
              { 
                backgroundColor: theme.colors.card,
                borderLeftColor: getAlertColor(item.type)
              },
              item.isRead ? styles.readAlert : null
            ]}
            onPress={() => handleAlertPress(item)}
          >
            <View style={styles.alertIconContainer}>
              <Ionicons 
                name={getAlertIcon(item.type)} 
                size={24} 
                color={getAlertColor(item.type)} 
              />
              {!item.isRead && (
                <View style={styles.unreadIndicator} />
              )}
            </View>
            
            <View style={styles.alertContent}>
              <Text style={[styles.stationName, { color: theme.colors.text }]}>
                {item.stationName} ({item.river})
              </Text>
              <Text style={[styles.alertMessage, { color: theme.colors.text }]}>
                {item.message}
              </Text>
              <Text style={[styles.alertTime, { color: theme.dark ? '#AAA' : '#666' }]}>
                {item.time}
              </Text>
            </View>
            
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={theme.dark ? '#AAA' : '#666'} 
            />
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isRefreshing}
            onRefresh={loadAlerts}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  readAlert: {
    opacity: 0.7,
  },
  alertIconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  unreadIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  alertContent: {
    flex: 1,
  },
  stationName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
  },
});