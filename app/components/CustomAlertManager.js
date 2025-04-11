// Plik: app/components/CustomAlertManager.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Vibration
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

/**
 * Komponent zarządzający wyświetlaniem alertów w aplikacji
 * @param {Object} props - Właściwości komponentu
 * @param {Array} props.alerts - Lista alertów do wyświetlenia
 * @param {Function} props.onDismiss - Funkcja wywoływana po zamknięciu alertu
 * @param {Function} props.onPress - Funkcja wywoływana po kliknięciu alertu
 * @param {boolean} props.autoHide - Czy alert ma się automatycznie ukrywać
 * @param {number} props.duration - Czas wyświetlania alertu w ms (domyślnie 5000)
 */
const CustomAlertManager = ({ 
  alerts = [], 
  onDismiss, 
  onPress, 
  autoHide = true, 
  duration = 5000 
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [visibleAlert, setVisibleAlert] = useState(null);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimeout = useRef(null);

  // Sprawdź, czy powiadomienia są włączone
  useEffect(() => {
    const checkNotificationsEnabled = async () => {
      try {
        const setting = await AsyncStorage.getItem('notifications_enabled');
        setNotificationsEnabled(setting === null || setting === 'true');
      } catch (error) {
        console.error('Błąd podczas sprawdzania ustawień powiadomień:', error);
        setNotificationsEnabled(true); // Domyślnie włączone
      }
    };
    
    checkNotificationsEnabled();
  }, []);

  // Efekt, który zarządza wyświetlaniem alertów
  useEffect(() => {
    // Nie pokazuj alertów, jeśli są wyłączone w ustawieniach
    if (!notificationsEnabled) {
      return;
    }
    
    // Jeśli mamy alerty i nie wyświetlamy żadnego, pokaż kolejny
    if (alerts.length > 0 && !visibleAlert) {
      // Znajdź pierwszy alert, który nie został jeszcze odrzucony
      const nextAlertIndex = alerts.findIndex(alert => 
        !dismissedAlerts.includes(alert.id)
      );
      
      if (nextAlertIndex !== -1) {
        setCurrentAlertIndex(nextAlertIndex);
        showNextAlert(nextAlertIndex);
      }
    }

    // Czyszczenie timeoutu przy odmontowaniu komponentu
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, [alerts, visibleAlert, dismissedAlerts, notificationsEnabled]);

  // Funkcja pokazująca następny alert
  const showNextAlert = (index = currentAlertIndex) => {
    if (alerts.length > index) {
      const alert = alerts[index];
      
      // Sprawdź, czy alert nie został już odrzucony
      if (dismissedAlerts.includes(alert.id)) {
        return;
      }
      
      setVisibleAlert(alert);
      
      // Wibracja dla alertów o wysokim priorytecie
      if (alert.severity === 'high' || alert.type === 'alarm') {
        const pattern = Platform.OS === 'android' 
          ? [0, 100, 100, 100] // android: wait, vibrate, wait, vibrate
          : [0, 100, 30, 100]; // ios
        Vibration.vibrate(pattern);
      }

      // Animacja pokazywania alertu
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();

      // Jeśli autoHide, ukryj alert po określonym czasie
      if (autoHide) {
        hideTimeout.current = setTimeout(() => {
          hideAlert(false);
        }, duration);
      }
    }
  };

  // Funkcja ukrywająca aktualny alert
  const hideAlert = (closeButtonPressed = false) => {
    // Animacja ukrywania alertu
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      // Po zakończeniu animacji
      if (visibleAlert) {
        // Dodaj alert do odrzuconych, jeśli został zamknięty ręcznie
        if (closeButtonPressed) {
          setDismissedAlerts(prev => [...prev, visibleAlert.id]);
        }
        
        // Wywołaj callback, jeśli istnieje
        if (onDismiss) {
          onDismiss(visibleAlert);
        }
      }
      
      // Resetuj stany
      setVisibleAlert(null);
      
      // Znajdź następny alert do wyświetlenia tylko jeśli alert nie był zamknięty ręcznie
      if (!closeButtonPressed) {
        let nextIndex = currentAlertIndex + 1;
        
        // Znajdź następny alert, który nie został odrzucony
        while (nextIndex < alerts.length && dismissedAlerts.includes(alerts[nextIndex].id)) {
          nextIndex++;
        }
        
        if (nextIndex < alerts.length) {
          setCurrentAlertIndex(nextIndex);
        } else {
          // Wróć do początku, jeśli przeszliśmy przez wszystkie alerty
          setCurrentAlertIndex(0);
        }
      }
    });

    // Wyczyść timeout
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  };

  // Obsługa kliknięcia w alert
  const handleAlertPress = () => {
    // Wyczyść timeout
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    
    // Wywołaj funkcję onPress, jeśli została przekazana
    if (onPress && visibleAlert) {
      onPress(visibleAlert);
    }
    
    // Ukryj alert, ale nie zaznaczaj go jako odrzucony
    hideAlert(false);
  };
  
  // Obsługa kliknięcia w przycisk zamknięcia
  const handleClosePress = (event) => {
    // Zatrzymaj propagację zdarzenia
    if (event) {
      event.stopPropagation();
    }
    
    // Ukryj alert i zaznacz go jako odrzucony
    hideAlert(true);
  };

  // Określa ikonę w zależności od typu alertu
  const getAlertIcon = (alert) => {
    if (!alert) return 'information-circle-outline';
    
    switch (alert.type) {
      case 'alarm':
        return 'warning';
      case 'warning':
        return 'alert-circle';
      case 'info':
      default:
        return 'information-circle-outline';
    }
  };

  // Określa kolor alertu w zależności od typu
  const getAlertColor = (alert) => {
    if (!alert) return theme.colors.info;
    
    switch (alert.type) {
      case 'alarm':
        return theme.colors.danger;
      case 'warning':
        return theme.colors.warning;
      case 'info':
      default:
        return theme.colors.info;
    }
  };

  // Jeśli powiadomienia są wyłączone lub nie ma alertu do wyświetlenia, nie renderuj nic
  if (!notificationsEnabled || !visibleAlert) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.alertBox,
          { backgroundColor: theme.dark ? '#2c3e50' : 'white' }
        ]}
        onPress={handleAlertPress}
        activeOpacity={0.9}
      >
        <View style={[styles.alertContent, { borderLeftColor: getAlertColor(visibleAlert) }]}>
          <Ionicons 
            name={getAlertIcon(visibleAlert)} 
            size={24} 
            color={getAlertColor(visibleAlert)} 
            style={styles.alertIcon}
          />
          <View style={styles.textContainer}>
            <Text 
              style={[styles.alertTitle, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {visibleAlert.title || 'Powiadomienie'}
            </Text>
            <Text 
              style={[styles.alertMessage, { color: theme.dark ? '#aaa' : '#666' }]}
              numberOfLines={2}
            >
              {visibleAlert.message || visibleAlert.description || 'Brak opisu'}
            </Text>
          </View>
          {alerts.length > 1 && (
            <View style={styles.counterContainer}>
              <Text style={[styles.counterText, { color: theme.colors.primary }]}>
                {currentAlertIndex + 1}/{alerts.length}
              </Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={handleClosePress}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons name="close" size={20} color={theme.dark ? '#aaa' : '#666'} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 10,
    right: 10,
    zIndex: 1000,
  },
  alertBox: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  alertContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    borderRadius: 8,
  },
  alertIcon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 13,
  },
  counterContainer: {
    marginLeft: 8,
    padding: 2,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
});

export default CustomAlertManager;