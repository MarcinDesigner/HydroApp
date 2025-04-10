// Plik: app/components/CustomAlertManager.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAlerts } from '../context/AlertsContext';
import { sendLocalNotification } from '../services/notificationService';

const CustomAlertManager = ({ stationId, stationName, currentLevel, theme }) => {
  const { 
    getAlertsForStation, 
    addAlert, 
    removeAlert, 
    checkThresholdExceeded 
  } = useAlerts();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [threshold, setThreshold] = useState('');
  const [operation, setOperation] = useState('above'); // 'above' lub 'below'
  const [stationAlerts, setStationAlerts] = useState([]);
  
  // Ładowanie alertów dla tej stacji
  useEffect(() => {
    if (stationId) {
      setStationAlerts(getAlertsForStation(stationId));
    }
  }, [stationId, getAlertsForStation]);
  
  // Funkcja dodająca nowy alert
  const handleAddAlert = () => {
    const thresholdValue = parseInt(threshold);
    
    if (isNaN(thresholdValue) || thresholdValue <= 0) {
      Alert.alert('Błąd', 'Podaj prawidłowy próg alertu (wartość większa od 0)');
      return;
    }
    
    const newAlert = {
      stationId,
      stationName,
      threshold: thresholdValue,
      operation,
      type: 'custom',
      message: `Poziom wody ${operation === 'above' ? 'powyżej' : 'poniżej'} ${thresholdValue} cm`
    };
    
    const success = addAlert(newAlert);
    
    if (success) {
      setStationAlerts(getAlertsForStation(stationId));
      setModalVisible(false);
      setThreshold('');
      
      // Sprawdź, czy alert nie jest od razu przekroczony
      if (
        (operation === 'above' && currentLevel >= thresholdValue) ||
        (operation === 'below' && currentLevel <= thresholdValue)
      ) {
        sendLocalNotification(
          `Alert dla stacji ${stationName}`,
          `Aktualny poziom (${currentLevel} cm) jest ${operation === 'above' ? 'powyżej' : 'poniżej'} ustawionego progu (${thresholdValue} cm)`
        );
      }
    } else {
      Alert.alert('Błąd', 'Nie udało się dodać alertu. Być może taki alert już istnieje.');
    }
  };
  
  // Funkcja usuwająca alert
  const handleRemoveAlert = (alertId) => {
    Alert.alert(
      'Usuwanie alertu',
      'Czy na pewno chcesz usunąć ten alert?',
      [
        {
          text: 'Anuluj',
          style: 'cancel'
        },
        {
          text: 'Usuń',
          onPress: () => {
            removeAlert(alertId);
            setStationAlerts(getAlertsForStation(stationId));
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Personalizowane alerty
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>Dodaj alert</Text>
        </TouchableOpacity>
      </View>
      
      {stationAlerts.length > 0 ? (
        <ScrollView style={styles.alertsList}>
          {stationAlerts.map(alert => (
            <View 
              key={alert.id}
              style={[
                styles.alertItem,
                {
                  backgroundColor: 
                    (operation === 'above' && currentLevel >= alert.threshold) ||
                    (operation === 'below' && currentLevel <= alert.threshold)
                      ? 'rgba(255, 0, 0, 0.1)'
                      : theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }
              ]}
            >
              <View style={styles.alertInfo}>
                <Text style={[styles.alertText, { color: theme.colors.text }]}>
                  {alert.operation === 'above' ? 'Gdy poziom powyżej' : 'Gdy poziom poniżej'} {alert.threshold} cm
                </Text>
                <Text style={[styles.alertSubtext, { color: theme.colors.caption }]}>
                  Utworzono: {new Date(alert.createdAt).toLocaleString('pl-PL')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveAlert(alert.id)}
              >
                <Ionicons 
                  name="trash-outline" 
                  size={20} 
                  color={theme.colors.danger} 
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.caption }]}>
            Brak ustawionych alertów dla tej stacji
          </Text>
        </View>
      )}
      
      {/* Modal do dodawania nowego alertu */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Dodaj nowy alert
            </Text>
            
            <View style={styles.operationSelector}>
              <TouchableOpacity 
                style={[
                  styles.operationButton,
                  operation === 'above' && { backgroundColor: theme.colors.primary }
                ]}
                onPress={() => setOperation('above')}
              >
                <Text style={[
                  styles.operationButtonText,
                  operation === 'above' && { color: 'white' }
                ]}>
                  Poziom powyżej
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.operationButton,
                  operation === 'below' && { backgroundColor: theme.colors.primary }
                ]}
                onPress={() => setOperation('below')}
              >
                <Text style={[
                  styles.operationButtonText,
                  operation === 'below' && { color: 'white' }
                ]}>
                  Poziom poniżej
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  { 
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                  }
                ]}
                value={threshold}
                onChangeText={setThreshold}
                placeholder="Próg (cm)"
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="numeric"
              />
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>cm</Text>
            </View>
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleAddAlert}
              >
                <Text style={styles.saveButtonText}>Zapisz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  alertsList: {
    maxHeight: 200,
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  alertInfo: {
    flex: 1,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '500',
  },
  alertSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  operationSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  operationButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  operationButtonText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#DDDDDD',
  },
  cancelButtonText: {
    color: '#333333',
    fontWeight: 'bold',
  },
  saveButton: {
    // Kolor dodawany dynamicznie (theme.colors.primary)
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default CustomAlertManager;