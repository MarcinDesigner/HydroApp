// Plik: app/screens/AlertsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import Loader from '../components/Loader';
import { fetchAlerts, fetchMeteoWarnings } from '../api/stationsApi';

export default function AlertsScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { isRefreshing, addListener, removeListener } = useRefresh();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

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

  const loadAlerts = async (silent = false) => {
    try {
      if (!silent) {
        setRefreshing(true);
      }
      
      // Pobierz oba rodzaje alertów równolegle
      const [hydroAlerts, meteoAlerts] = await Promise.all([
        fetchAlerts(),
        fetchMeteoWarnings()
      ]);
      
      // Połącz alerty i posortuj wg daty (najnowsze na górze)
      const allAlerts = [...hydroAlerts, ...meteoAlerts].sort((a, b) => {
        // Zakładamy, że czas jest w formacie, który można porównywać stringowo
        return b.time?.localeCompare(a.time || '') || 0;
      });
      
      setAlerts(allAlerts);
      setError(null);
      
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
      }
    } catch (error) {
      console.error('Błąd podczas ładowania alertów:', error);
      setError(error.message || 'Nie udało się pobrać alertów.');
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  const handleAlertPress = (alert) => {
    if (alert.stationId) {
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
    }
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

  if (error) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons 
          name="cloud-offline-outline" 
          size={64} 
          color={theme.dark ? '#555' : '#CCC'} 
        />
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          Błąd połączenia
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.dark ? '#AAA' : '#666' }]}>
          {error}
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => loadAlerts()}
        >
          <Text style={styles.retryText}>Spróbuj ponownie</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
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
              {item.title && (
                <Text style={[styles.alertTitle, { color: theme.colors.text }]}>
                  {item.title}
                </Text>
              )}
              <Text style={[styles.stationName, { color: theme.colors.text }]}>
                {item.stationName} {item.river ? `(${item.river})` : ''}
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
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
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
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});