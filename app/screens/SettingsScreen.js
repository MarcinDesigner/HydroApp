// Plik: app/screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { theme, isDarkMode, toggleTheme, setSystemTheme } = useTheme();
  const { refreshInterval, changeRefreshInterval, refreshIntervals } = useRefresh();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [measurementUnits, setMeasurementUnits] = useState('cm');
  const [themeMode, setThemeMode] = useState('system');

  // Ładowanie zapisanych ustawień
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Wczytanie trybu motywu
        const themeChoice = await AsyncStorage.getItem('theme_choice');
        if (themeChoice) {
          setThemeMode(themeChoice);
        } else {
          setThemeMode(isDarkMode ? 'dark' : 'light');
        }

        // Wczytanie stanu powiadomień
        const notificationsEnabled = await AsyncStorage.getItem('notifications_enabled');
        if (notificationsEnabled !== null) {
          setNotifications(notificationsEnabled === 'true');
        }

        // Wczytanie stanu usług lokalizacji
        const locationEnabled = await AsyncStorage.getItem('location_enabled');
        if (locationEnabled !== null) {
          setLocationServices(locationEnabled === 'true');
        }

        // Wczytanie jednostek miary
        const units = await AsyncStorage.getItem('measurement_units');
        if (units) {
          setMeasurementUnits(units);
        }
      } catch (error) {
        console.error('Błąd podczas ładowania ustawień:', error);
      }
    };

    loadSettings();
  }, []);

  const handleThemeModeChange = async (mode) => {
    setThemeMode(mode);
    
    if (mode === 'system') {
      await setSystemTheme();
    } else if (mode === 'dark' && !isDarkMode) {
      await toggleTheme();
    } else if (mode === 'light' && isDarkMode) {
      await toggleTheme();
    }
  };

  const toggleNotifications = async (value) => {
    try {
      setNotifications(value);
      await AsyncStorage.setItem('notifications_enabled', value.toString());
    } catch (error) {
      console.error('Błąd podczas zapisywania ustawień powiadomień:', error);
    }
  };

  const toggleLocationServices = async (value) => {
    try {
      setLocationServices(value);
      await AsyncStorage.setItem('location_enabled', value.toString());
    } catch (error) {
      console.error('Błąd podczas zapisywania ustawień lokalizacji:', error);
    }
  };

  const saveMeasurementUnits = async (units) => {
    try {
      setMeasurementUnits(units);
      await AsyncStorage.setItem('measurement_units', units);
    } catch (error) {
      console.error('Błąd podczas zapisywania jednostek miary:', error);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Czyszczenie danych',
      'Czy na pewno chcesz wyczyścić dane aplikacji? Ta operacja spowoduje utratę ulubionych stacji oraz historii.',
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Wyczyść',
          style: 'destructive',
          onPress: async () => {
            try {
              // Oryginalne dane do zachowania
              const themeChoice = await AsyncStorage.getItem('theme_choice');
              const themeMode = await AsyncStorage.getItem('theme_mode');
              
              // Czyszczenie wszystkich danych
              await AsyncStorage.clear();
              
              // Przywrócenie ustawień motywu
              if (themeChoice) {
                await AsyncStorage.setItem('theme_choice', themeChoice);
              }
              
              if (themeMode) {
                await AsyncStorage.setItem('theme_mode', themeMode);
              }
              
              Alert.alert('Sukces', 'Dane aplikacji zostały wyczyszczone.');
            } catch (error) {
              console.error('Błąd podczas czyszczenia danych:', error);
              Alert.alert('Błąd', 'Nie udało się wyczyścić danych aplikacji.');
            }
          },
        },
      ]
    );
  };

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
        {title}
      </Text>
      <View 
        style={[
          styles.sectionContent, 
          { backgroundColor: theme.colors.card }
        ]}
      >
        {children}
      </View>
    </View>
  );

  const SettingItem = ({ icon, title, description, children }) => (
    <View 
      style={[
        styles.settingItem, 
        { borderBottomColor: theme.dark ? '#333' : '#EEE' }
      ]}
    >
      <Ionicons name={icon} size={24} color={theme.colors.primary} style={styles.settingIcon} />
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.settingDescription, { color: theme.dark ? '#AAA' : '#666' }]}>
            {description}
          </Text>
        )}
      </View>
      <View style={styles.settingControl}>
        {children}
      </View>
    </View>
  );

  const RadioButton = ({ selected, onPress, label }) => (
    <TouchableOpacity 
      style={styles.radioButton} 
      onPress={onPress}
    >
      <View 
        style={[
          styles.radioOuter, 
          { borderColor: theme.colors.primary }
        ]}
      >
        {selected && (
          <View 
            style={[
              styles.radioInner, 
              { backgroundColor: theme.colors.primary }
            ]} 
          />
        )}
      </View>
      <Text 
        style={[
          styles.radioLabel, 
          { color: theme.colors.text }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <SettingSection title="WYGLĄD">
        <SettingItem
          icon="contrast"
          title="Tryb motywu"
          description="Wybierz motyw aplikacji"
        >
          <View style={styles.radioGroup}>
            <RadioButton
              selected={themeMode === 'light'}
              onPress={() => handleThemeModeChange('light')}
              label="Jasny"
            />
            <RadioButton
              selected={themeMode === 'dark'}
              onPress={() => handleThemeModeChange('dark')}
              label="Ciemny"
            />
            <RadioButton
              selected={themeMode === 'system'}
              onPress={() => handleThemeModeChange('system')}
              label="Systemowy"
            />
          </View>
        </SettingItem>
      </SettingSection>
      
      <SettingSection title="POWIADOMIENIA">
        <SettingItem
          icon="notifications"
          title="Powiadomienia"
          description="Otrzymuj powiadomienia o alertach"
        >
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: '#2196F3' }}
            thumbColor={notifications ? '#fff' : '#f4f3f4'}
          />
        </SettingItem>
      </SettingSection>
      
      <SettingSection title="DANE I PRYWATNOŚĆ">
        <SettingItem
          icon="locate"
          title="Usługi lokalizacji"
          description="Pozwala na pokazywanie najbliższych stacji"
        >
          <Switch
            value={locationServices}
            onValueChange={toggleLocationServices}
            trackColor={{ false: '#767577', true: '#2196F3' }}
            thumbColor={locationServices ? '#fff' : '#f4f3f4'}
          />
        </SettingItem>
        
        <SettingItem
          icon="time"
          title="Częstotliwość odświeżania"
          description="Jak często aplikacja ma pobierać nowe dane"
        >
          <View style={styles.radioGroup}>
            {refreshIntervals.map(value => (
              <RadioButton
                key={value}
                selected={refreshInterval === value}
                onPress={() => changeRefreshInterval(value)}
                label={value === '5min' ? '5 min' : 
                       value === '15min' ? '15 min' : 
                       value === '30min' ? '30 min' : 
                       '1 godz'}
              />
            ))}
          </View>
        </SettingItem>
        
        <SettingItem
          icon="options"
          title="Jednostki miary"
          description="Wybierz jednostkę miary dla poziomów wody"
        >
          <View style={styles.radioGroupHorizontal}>
            <RadioButton
              selected={measurementUnits === 'cm'}
              onPress={() => saveMeasurementUnits('cm')}
              label="cm"
            />
            <RadioButton
              selected={measurementUnits === 'm'}
              onPress={() => saveMeasurementUnits('m')}
              label="m"
            />
          </View>
        </SettingItem>
      </SettingSection>
      
      <SettingSection title="APLIKACJA">
        <TouchableOpacity 
          style={styles.buttonItem}
          onPress={() => navigation.navigate('Widget')}
        >
          <Ionicons name="apps" size={24} color={theme.colors.primary} style={styles.settingIcon} />
          <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
            Widgety stacji
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.buttonItem}
          onPress={handleClearData}
        >
          <Ionicons name="trash" size={24} color={theme.colors.danger} style={styles.settingIcon} />
          <Text style={[styles.buttonText, { color: theme.colors.danger }]}>
            Wyczyść dane aplikacji
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.buttonItem}
        >
          <Ionicons name="help-circle" size={24} color={theme.colors.primary} style={styles.settingIcon} />
          <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
            Pomoc i wsparcie
          </Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.dark ? '#AAA' : '#666' }]}>
            Wersja aplikacji: 1.0.0
          </Text>
        </View>
      </SettingSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 8,
  },
  sectionContent: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
  },
  settingControl: {
    alignItems: 'flex-end',
  },
  radioGroup: {
    width: '100%',
  },
  radioGroupHorizontal: {
    flexDirection: 'row',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioLabel: {
    fontSize: 14,
  },
  buttonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  buttonText: {
    fontSize: 16,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 16,
  },
  versionText: {
    fontSize: 14,
  },
});