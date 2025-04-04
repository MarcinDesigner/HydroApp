// Plik: app/screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform // Dodaj import Platform, jeśli będziemy go używać
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Załóżmy, że masz lub dodasz te komponenty:
// import SegmentedControl from '../components/SegmentedControl'; // Przykład
// import RadioButtonGroup from '../components/RadioButtonGroup'; // Przykład

// --- Komponenty pomocnicze dla struktury ---

// Wiersz ustawienia (ikona, tekst, kontrolka po prawej)
const SettingRow = ({ icon, title, subtitle, control, onPress }) => {
  const { theme } = useTheme();
  const Component = onPress ? TouchableOpacity : View; // Użyj TouchableOpacity jeśli jest onPress
  return (
    <Component style={styles.settingRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      {icon && <Ionicons name={icon} size={24} color={theme.colors.primary} style={styles.icon} />}
      <View style={styles.textContainer}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: theme.colors.caption }]}>{subtitle}</Text>}
      </View>
      {control && <View style={styles.controlContainer}>{control}</View>}
    </Component>
  );
};



// Karta grupująca ustawienia
const SettingsCard = ({ children }) => {
    const { theme } = useTheme();
    return <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>{children}</View>;
};

// Nagłówek sekcji
const SectionHeader = ({ title }) => {
    const { theme } = useTheme();
    return <Text style={[styles.sectionHeader, { color: theme.colors.primary }]}>{title}</Text>;
};

// --- Główny komponent ekranu ---

export default function SettingsScreen() {
  const navigation = useNavigation();
  // Logika stanu i kontekstów (bez zmian)
  const { theme, isDarkMode, toggleTheme, setSystemTheme, themeType } = useTheme(); // Dodano themeType
  const { refreshInterval, changeRefreshInterval, refreshIntervals } = useRefresh();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [measurementUnits, setMeasurementUnits] = useState('cm');
  // Usunięto themeMode, użyjemy themeType z useTheme
  // const [themeMode, setThemeMode] = useState('system');

  // Ładowanie zapisanych ustawień (bez zmian)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Nie musimy ładować motywu, bo zarządza nim useTheme
        // const themeChoice = await AsyncStorage.getItem('theme_choice');
        // if (themeChoice) {
        //   // Zamiast setThemeMode, powinniśmy inicjalizować useTheme odpowiednio
        // }

        const notificationsEnabled = await AsyncStorage.getItem('notifications_enabled');
        if (notificationsEnabled !== null) {
          setNotifications(notificationsEnabled === 'true');
        }

        const locationEnabled = await AsyncStorage.getItem('location_enabled');
        if (locationEnabled !== null) {
          setLocationServices(locationEnabled === 'true');
        }

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


  // Funkcje obsługi (większość bez zmian, modyfikacja handleThemeModeChange)
  const handleThemeModeChange = async (mode) => {
    // Zapisujemy wybór użytkownika
    try {
      await AsyncStorage.setItem('theme_choice', mode);
    } catch (error) {
       console.error('Błąd zapisu wyboru motywu:', error);
    }

    // Aktualizujemy motyw przez kontekst
    if (mode === 'system') {
      await setSystemTheme(); // Funkcja z useTheme
    } else {
        // Bezpośrednie przełączenie na light/dark
        // Potrzebujemy funkcji setLight lub setDark w useTheme, albo modyfikacji toggleTheme
        // Tymczasowo użyjemy toggleTheme, jeśli obecny stan jest inny
        if ((mode === 'dark' && !isDarkMode) || (mode === 'light' && isDarkMode)) {
             await toggleTheme(); // Może wymagać dostosowania w useTheme
        }
    }
    // Stan themeMode nie jest już potrzebny, bo mamy themeType z kontekstu
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
    Alert.alert(/* ... definicja Alert bez zmian ... */);
  };

  // Opcje dla kontrolek
  const themeOptions = ['Jasny', 'Ciemny', 'Systemowy'];
  const themeMapFromLabel = { 'Jasny': 'light', 'Ciemny': 'dark', 'Systemowy': 'system' };
  const themeMapToLabel = { 'light': 'Jasny', 'dark': 'Ciemny', 'system': 'Systemowy' };
  const currentThemeLabel = themeMapToLabel[themeType] || 'Systemowy'; // Pobierz etykietę z kontekstu

  const unitOptions = ['cm', 'm'];

  const refreshOptions = ['5 min', '15 min', '30 min', '1 godz'];
  const refreshMap = { '5 min': '5min', '15 min': '15min', '30 min': '30min', '1 godz': '1h' };
  const refreshReverseMap = { '5min': '5 min', '15min': '15 min', '30min': '30 min', '1h': '1 godz' };
  const currentRefreshLabel = refreshReverseMap[refreshInterval] || '30 min';

  // Mapowanie wartości z useRefresh na etykiety dla RadioButtonGroup
  const refreshRadioOptions = refreshIntervals.map(value => ({
      label: refreshReverseMap[value] || value, // Użyj etykiety z mapy
      value: value // Zachowaj oryginalną wartość dla logiki
  }));


  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <SectionHeader title="WYGLĄD" />
      <SettingsCard>
         <View style={styles.settingItem}>
             {/* Część tekstowa */}
             <View style={styles.settingTextOnly}>
                <Ionicons name="contrast-outline" size={24} color={theme.colors.primary} style={styles.icon} />
                <View style={styles.textContainer}>
                   <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Tryb motywu</Text>
                   <Text style={[styles.settingSubtitle, { color: theme.colors.caption }]}>Wybierz motyw wizualny aplikacji</Text>
                </View>
             </View>
             {/* --- Placeholder dla SegmentedControl --- */}
             <View style={styles.segmentedControlContainer}>
               {themeOptions.map((option) => (
                 <TouchableOpacity
                   key={option}
                   style={[
                     styles.segmentButton,
                     themeMapFromLabel[option] === themeType ? styles.segmentButtonActive : {},
                     themeMapFromLabel[option] === themeType ? { backgroundColor: theme.colors.primary } : { borderColor: theme.colors.border },
                   ]}
                   onPress={() => handleThemeModeChange(themeMapFromLabel[option])}
                 >
                   <Text style={[
                       styles.segmentButtonText,
                       themeMapFromLabel[option] === themeType ? styles.segmentButtonTextActive: { color: theme.colors.text }
                   ]}>
                     {option}
                   </Text>
                 </TouchableOpacity>
               ))}
             </View>
             {/* Zastąp powyższy placeholder prawdziwym SegmentedControl, jeśli masz */}
             {/* <SegmentedControl
                values={themeOptions}
                selectedIndex={themeOptions.findIndex(opt => themeMapFromLabel[opt] === themeType)}
                onChange={(event) => {
                  handleThemeModeChange(themeMapFromLabel[themeOptions[event.nativeEvent.selectedSegmentIndex]]);
                }}
             /> */}
         </View>
      </SettingsCard>

      <SectionHeader title="POWIADOMIENIA" />
      <SettingsCard>
        {/* Użycie SettingRow dla elementów z kontrolką po prawej */}
        <SettingRow
          icon="notifications-outline"
          title="Powiadomienia"
          subtitle="Otrzymuj powiadomienia o alertach"
          control={<Switch value={notifications} onValueChange={toggleNotifications} trackColor={{ false: "#767577", true: theme.colors.primary }} thumbColor={theme.dark ? theme.colors.primary : "#f4f3f4"} />}
        />
      </SettingsCard>

      <SectionHeader title="DANE I PRYWATNOŚĆ" />
      <SettingsCard>
        <SettingRow
          icon="location-outline"
          title="Usługi lokalizacji"
          subtitle="Pozwala na pokazywanie najbliższych stacji"
          control={<Switch value={locationServices} onValueChange={toggleLocationServices} trackColor={{ false: "#767577", true: theme.colors.primary }} thumbColor={theme.dark ? theme.colors.primary : "#f4f3f4"} />}
        />
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
         <View style={styles.settingItem}>
             {/* Część tekstowa */}
             <View style={styles.settingTextOnly}>
                <Ionicons name="time-outline" size={24} color={theme.colors.primary} style={styles.icon} />
                <View style={styles.textContainer}>
                  <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Częstotliwość odświeżania</Text>
                  <Text style={[styles.settingSubtitle, { color: theme.colors.caption }]}>Jak często pobierać nowe dane</Text>
                </View>
             </View>
             {/* --- Placeholder dla RadioButtonGroup --- */}
              <View style={styles.radioGroupContainer}>
                 {refreshRadioOptions.map(option => (
                     <TouchableOpacity key={option.value} style={styles.radioOption} onPress={() => changeRefreshInterval(option.value)}>
                         <View style={[styles.radioOuter, { borderColor: theme.colors.primary }]}>
                            {refreshInterval === option.value && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
                         </View>
                         <Text style={[styles.radioLabel, { color: theme.colors.text }]}>{option.label}</Text>
                     </TouchableOpacity>
                 ))}
              </View>
             {/* Zastąp powyższy placeholder prawdziwym RadioButtonGroup, jeśli masz */}
             {/* <RadioButtonGroup
                options={refreshRadioOptions} // Użyj zmapowanych opcji
                selectedValue={refreshInterval} // Użyj wartości z useRefresh
                onValueChange={changeRefreshInterval} // Użyj funkcji z useRefresh
             /> */}
         </View>
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
         <View style={styles.settingItem}>
              {/* Część tekstowa */}
              <View style={styles.settingTextOnly}>
                 <Ionicons name="options-outline" size={24} color={theme.colors.primary} style={styles.icon} />
                 <View style={styles.textContainer}>
                    <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Jednostki miary</Text>
                    <Text style={[styles.settingSubtitle, { color: theme.colors.caption }]}>Wybierz jednostkę dla poziomów wody</Text>
                 </View>
              </View>
              {/* --- Placeholder dla SegmentedControl --- */}
               <View style={styles.segmentedControlContainer}>
                 {unitOptions.map((option) => (
                   <TouchableOpacity
                     key={option}
                     style={[
                       styles.segmentButton,
                       styles.segmentButtonHalf, // Styl dla dwóch segmentów
                       measurementUnits === option ? styles.segmentButtonActive : {},
                       measurementUnits === option ? { backgroundColor: theme.colors.primary } : { borderColor: theme.colors.border },
                     ]}
                     onPress={() => saveMeasurementUnits(option)}
                   >
                     <Text style={[
                         styles.segmentButtonText,
                         measurementUnits === option ? styles.segmentButtonTextActive: { color: theme.colors.text }
                     ]}>
                       {option}
                     </Text>
                   </TouchableOpacity>
                 ))}
               </View>
              {/* Zastąp powyższy placeholder prawdziwym SegmentedControl, jeśli masz */}
              {/* <SegmentedControl
                 values={unitOptions}
                 selectedIndex={unitOptions.findIndex(opt => opt === measurementUnits)}
                 onChange={(event) => {
                   saveMeasurementUnits(unitOptions[event.nativeEvent.selectedSegmentIndex]);
                 }}
              /> */}
         </View>
      </SettingsCard>

      <SectionHeader title="APLIKACJA" />
      <SettingsCard>
         {/* Użycie SettingRow dla elementów nawigacyjnych/akcji */}
         <SettingRow
           icon="apps-outline"
           title="Widgety stacji"
           onPress={() => navigation.navigate('Widget')} // Zakładając, że masz taki ekran
           control={<Ionicons name="chevron-forward" size={22} color={theme.colors.caption} />}
         />
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
         <SettingRow
           icon="trash-outline" // Lepsza ikona
           title="Wyczyść dane aplikacji"
           onPress={handleClearData}
           // Nie potrzebujemy kontrolki, ale możemy zmienić kolor tytułu
           // Można by dodać stylizację do SettingRow, aby zmieniać kolor tekstu
         />
         <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <SettingRow
           icon="help-circle-outline" // Lepsza ikona
           title="Pomoc i wsparcie"
           onPress={() => Alert.alert("Pomoc", "Funkcjonalność w przygotowaniu.")} // Przykładowa akcja
           control={<Ionicons name="chevron-forward" size={22} color={theme.colors.caption} />}
         />
      </SettingsCard>

      {/* Wersja aplikacji */}
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: theme.colors.caption }]}>
          Wersja aplikacji: 1.0.1 {/* Przykładowa wersja */}
        </Text>
      </View>

      {/* Dodatkowy margines na dole */}
      <View style={{ height: 30 }} />

    </ScrollView>
  );
}


// --- Nowe i zaktualizowane style ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Usunięto contentContainer, padding bezpośrednio w ScrollView
  sectionHeader: {
    fontSize: 13, // Mniejszy nagłówek sekcji
    fontWeight: '600', // Grubszy
    marginTop: 24,
    marginBottom: 10, // Większy margines
    marginLeft: 16, // Wyrównanie z kartą
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  card: {
    borderRadius: 10, // Mniejsze zaokrąglenie
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  settingItem: { // Używane dla elementów z kontrolką poniżej
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
   settingTextOnly: { // Tekst + ikona (gdy kontrolka poniżej)
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14, // Odstęp przed kontrolką
  },
  settingRow: { // Ikona, tekst, kontrolka w jednym wierszu
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15, // Dostosowany padding
    paddingHorizontal: 16,
    minHeight: 50, // Minimalna wysokość dla łatwiejszego klikania
  },
  icon: {
    marginRight: 16,
    width: 24, // Stała szerokość dla ikony
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'normal', // Normalna grubość
    marginBottom: 3, // Mniejszy odstęp
  },
  settingSubtitle: {
    fontSize: 13,
    opacity: 0.8,
  },
  controlContainer: {
    // Styl dla kontenera kontrolki po prawej
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 56, // Wcięcie = ikona (24) + margines (16) * 2 (przybliżone)
  },
  // --- Placeholdery/Style dla Kontrolek ---
  segmentedControlContainer: { // Kontener dla segmentów
    flexDirection: 'row',
    width: '100%',
    marginTop: 4, // Mały margines od tekstu powyżej
  },
  segmentButton: {
    flex: 1, // Równa szerokość segmentów
    paddingVertical: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
   segmentButtonHalf: { // Styl dla 2 segmentów (np. Jednostki)
    // Nie potrzebuje specjalnego stylu, flex: 1 wystarczy
   },
  segmentButtonActive: {
    // backgroundColor ustawiany dynamicznie
    borderColor: 'transparent', // Ukryj ramkę aktywnego
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  segmentButtonTextActive: {
    color: '#fff', // Biały tekst na aktywnym tle
    fontWeight: '600',
  },
  // Style dla Radio Button (placeholder)
  radioGroupContainer: {
    marginLeft: 56, // Wcięcie jak divider
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, // Zwiększony padding dla klikalności
  },
  radioOuter: {
    width: 22, // Większe kółko
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12, // Większy odstęp
  },
  radioInner: {
    width: 11, // Większe wewnętrzne kółko
    height: 11,
    borderRadius: 5.5,
  },
  radioLabel: {
    fontSize: 16, // Większa etykieta radio
  },
  // --- Koniec Kontrolek ---
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20, // Większy odstęp
  },
  versionText: {
    fontSize: 13, // Mniejsza wersja
    opacity: 0.7,
  },
});