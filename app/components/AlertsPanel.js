// Plik: app/components/AlertsPanel.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchAreaWarnings } from '../api/stationsApi';

export default function AlertsPanel({ station, theme, areaCode }) {
  const [alerts, setAlerts] = useState([]);
  const [areaAlerts, setAreaAlerts] = useState([]);
  const [showAreaAlerts, setShowAreaAlerts] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Inicjalizacja alertów ze stacji, jeśli istnieją
    if (station && station.alerts) {
      setAlerts(station.alerts);
    }
    
    // Pobierz alerty dla obszaru, jeśli podano kod obszaru
    if (areaCode) {
      loadAreaAlerts(areaCode);
    } else if (station && station.wojewodztwo) {
      // Używamy województwa stacji jako domyślnego obszaru
      loadAreaAlerts(station.wojewodztwo);
    }
  }, [station, areaCode]);

  const loadAreaAlerts = async (area) => {
    try {
      setLoading(true);
      const warnings = await fetchAreaWarnings(area);
      
      // Mapowanie danych z API na format alertów używany w aplikacji
      const formattedWarnings = warnings.map((warning, index) => ({
        id: warning.uniqueId || `area-warning-${index}-${Date.now()}`, // używamy unikalnego ID
        title: warning.nazwa_obszaru || warning.opis_zagrozenia || 'Ostrzeżenie hydrologiczne',
        event: warning.zjawisko || warning.opis_zagrozenia || 'Przekroczenie stanu ostrzegawczego',
        course: warning.przebieg || `Aktualny poziom: ${warning.stan} cm`,
        level: warning.stan ? parseInt(warning.stan) : undefined,
        threshold: warning.stan_ostrzegawczy ? parseInt(warning.stan_ostrzegawczy) : undefined,
        time: warning.waznosc_od ? `Od ${warning.waznosc_od} do ${warning.waznosc_do}` : new Date().toLocaleString(),
        regionName: warning.regionName || warning.nazwa_obszaru || area
      }));
      
      setAreaAlerts(formattedWarnings);
      setLoading(false);
    } catch (error) {
      console.error('Error loading area alerts:', error);
      setLoading(false);
      // W przypadku błędu, ustawmy puste alerty
      setAreaAlerts([]);
    }
  };

  const toggleAreaAlerts = () => {
    setShowAreaAlerts(!showAreaAlerts);
  };

  const showAlertDetails = (alert) => {
    Alert.alert(
      alert.title || 'Ostrzeżenie',
      `Zdarzenie: ${alert.event || 'Brak informacji'}\n\nPrzebieg: ${alert.course || 'Brak informacji'}\n\nCzas: ${alert.time || 'Nieznany'}\n\nPoziom: ${alert.level || 'Nieznany'} cm\n\nPróg: ${alert.threshold || 'Nieznany'} cm`,
      [{ text: 'OK' }]
    );
  };

  const renderAlertItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.alertItem, 
        { 
          backgroundColor: 
            item.level > (item.threshold || 0) * 1.5 ? '#FF5252' : 
            item.level > (item.threshold || 0) ? '#FFA726' : '#42A5F5'
        }
      ]}
      onPress={() => showAlertDetails(item)}
    >
      <View style={styles.alertHeader}>
        <Ionicons name="warning-outline" size={24} color="white" />
        <Text style={styles.alertTitle}>{item.title || `Ostrzeżenie hydrologiczne`}</Text>
      </View>
      <View style={styles.alertContent}>
        <Text style={styles.alertText}>
          Zdarzenie: {item.event || 'Przekroczenie stanu ostrzegawczego'}
        </Text>
        <Text style={styles.alertText} numberOfLines={2}>
          Przebieg: {item.course || `Aktualny poziom: ${item.level} cm (próg: ${item.threshold} cm)`}
        </Text>
        <Text style={styles.alertTime}>
          {item.time || new Date().toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Jeśli nie ma żadnych alertów, nie wyświetlamy panelu
  if ((!alerts || alerts.length === 0) && (!areaAlerts || areaAlerts.length === 0)) {
    return null;
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
        Alerty i ostrzeżenia
      </Text>

      {alerts && alerts.length > 0 ? (
        <View style={styles.alertsList}>
          {alerts.map((item, index) => (
            <View key={`station-alert-${index}`}>
              {renderAlertItem({ item })}
            </View>
          ))}
        </View>
      ) : (
        <Text style={[styles.noAlertsText, { color: theme.colors.text }]}>
          Brak aktualnych alertów dla tej stacji
        </Text>
      )}

      {/* Sekcja alertów dla obszaru */}
      <TouchableOpacity
        style={[styles.areaAlertButton, { backgroundColor: theme.colors.primary }]}
        onPress={toggleAreaAlerts}
      >
        <Text style={styles.areaAlertButtonText}>
          {showAreaAlerts ? 'Ukryj alerty obszaru' : 'Pokaż alerty dla obszaru'}
        </Text>
        <Ionicons
          name={showAreaAlerts ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="white"
        />
      </TouchableOpacity>

      {showAreaAlerts && (
        <>
          {loading ? (
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              Ładowanie alertów...
            </Text>
          ) : areaAlerts && areaAlerts.length > 0 ? (
            <View style={styles.alertsList}>
              {areaAlerts.map((item, index) => (
                <View key={`area-alert-${index}`}>
                  {renderAlertItem({ item })}
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.noAlertsText, { color: theme.colors.text }]}>
              Brak alertów dla wybranego obszaru
            </Text>
          )}
        </>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  alertsList: {
    marginBottom: 8,
  },
  alertItem: {
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  alertTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  alertContent: {
    padding: 12,
  },
  alertText: {
    color: 'white',
    marginBottom: 4,
  },
  alertTime: {
    color: 'white',
    fontSize: 12,
    textAlign: 'right',
    fontStyle: 'italic',
    marginTop: 4,
  },
  noAlertsText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 12,
  },
  areaAlertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
  },
  areaAlertButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
});