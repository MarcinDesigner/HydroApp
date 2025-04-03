// Plik: app/screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react'; // Dodano useCallback
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Text,
  Pressable,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import StationCard from '../components/StationCard'; // Zakładamy, że StationCard używa logiki kolorów
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import Loader from '../components/Loader';
import { fetchStations } from '../api/stationsApi';

// Funkcja pomocnicza do sortowania stacji według statusu
const sortStationsByStatus = (stations) => {
  return [...stations].sort((a, b) => {
    const statusPriority = { 'alarm': 0, 'warning': 1, 'normal': 2 };
    // Użycie ?? (nullish coalescing) jest bezpieczniejsze niż ||, jeśli 0 jest poprawną wartością
    const aPriority = statusPriority[a.status] ?? 3;
    const bPriority = statusPriority[b.status] ?? 3;
    return aPriority - bPriority;
  });
};

// *** LOGIKA KOLORU STATUSU (zgodnie z instrukcją) ***
// Ta funkcja powinna być idealnie używana wewnątrz komponentu StationCard
// lub przekazana do niego jako prop. Pokazuje, jak logika powinna wyglądać.
// Jeśli StationCard ma własną logikę kolorów, tę funkcję można usunąć z HomeScreen.js
const getCardStatusColor = (station, theme) => {
  if (!station || !theme) {
    return theme?.colors?.info || '#888888';
  }
  const isWarningUndefined = station.warningLevel === "nie określono" || station.warningLevel == null || station.warningLevel === 888;
  const isAlarmUndefined = station.alarmLevel === "nie określono" || station.alarmLevel == null || station.alarmLevel === 999;

  if (station.status === 'alarm' && isAlarmUndefined) {
    return theme.colors.info;
  }
  if (station.status === 'warning' && isWarningUndefined) {
    return theme.colors.info;
  }
  switch (station.status) {
    case 'alarm': return theme.colors.danger;
    case 'warning': return theme.colors.warning;
    case 'normal': return theme.colors.safe;
    default: return theme.colors.info;
  }
};
// *** KONIEC LOGIKI KOLORU STATUSU ***

export default function HomeScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  // Usunięto nieużywane zmienne z useRefresh: refreshData, lastRefreshTime
  const { isRefreshing, addListener, removeListener } = useRefresh();
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Dla RefreshControl
  const [filter, setFilter] = useState('all'); // 'all', 'warning', 'alarm'

  // Użycie useCallback do opakowania loadStations
  const loadStations = useCallback(async (silent = false) => {
    // Tylko ustawianie 'refreshing' jeśli jest to ręczne odświeżenie przez RefreshControl
    // 'loading' jest ustawiane niezależnie
    if (!silent && !isRefreshing) { // Nie ustawiaj loading jeśli już odświeżamy
        setLoading(true);
    }
    try {
      const data = await fetchStations();
      setStations(data); // Aktualizuj główną listę stacji
    } catch (error) {
      console.error('Error loading stations:', error);
      // Tutaj można dodać obsługę błędów dla użytkownika, np. Toast
    } finally {
      // Zawsze wyłączaj wskaźniki po zakończeniu, niezależnie od sukcesu/błędu
      if (!silent) {
         setLoading(false);
      }
      // Refreshing jest kontrolowane przez onRefresh i RefreshControl
      // setRefreshing(false); // Nie resetujemy tutaj
    }
  }, [isRefreshing]); // Zależność od isRefreshing, aby uniknąć setLoading podczas auto-refresh

  useEffect(() => {
    loadStations(); // Pierwsze ładowanie
  }, [loadStations]); // Zależność od useCallback

  // Ustawienie opcji nawigacji
  useEffect(() => {
   navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('RiverFlow')}
            style={{ marginRight: 20 }} // Zwiększony margines
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Większy obszar kliknięcia
          >
            <Ionicons name="git-network-outline" size={25} color={theme.colors.headerText} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={{ marginRight: 16 }}
             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="settings-outline" size={24} color={theme.colors.headerText} />
          </TouchableOpacity>
        </View>
      ),
      // Można też dynamicznie ustawić tytuł, jeśli potrzeba
      // headerTitle: 'Stacje Hydrologiczne',
    });
  }, [navigation, theme]); // Zależność od theme

  // Efekt dla automatycznego odświeżania z kontekstu
  useEffect(() => {
    const onRefreshCallback = () => {
      if (!isRefreshing && !loading) { // Unikaj jednoczesnego odświeżania
         loadStations(true); // Cicha aktualizacja
      }
    };
    addListener(onRefreshCallback);
    return () => removeListener(onRefreshCallback);
  }, [addListener, removeListener, loadStations, isRefreshing, loading]); // Dodane zależności

  // Efekt dla filtrowania i sortowania stacji - GŁÓWNA ZMIANA TUTAJ
  useEffect(() => {
    // Nie filtruj, jeśli stacje nie są jeszcze załadowane
    if (loading && stations.length === 0) {
        setFilteredStations([]); // Ustaw pustą tablicę podczas ładowania
        return;
    };

    let tempFiltered = [...stations];

    // 1. Filtrowanie według wyszukiwania
    if (searchQuery.trim() !== '') {
      const lowerCaseQuery = searchQuery.toLowerCase();
      tempFiltered = tempFiltered.filter(station =>
        station.name.toLowerCase().includes(lowerCaseQuery) ||
        (station.river && station.river.toLowerCase().includes(lowerCaseQuery))
      );
    }

    // 2. Filtrowanie według statusu (POPRAWIONA LOGIKA)
    if (filter === 'alarm') {
      // Zachowaj tylko te ze statusem 'alarm'
      tempFiltered = tempFiltered.filter(station => station.status === 'alarm'); // <-- POPRAWKA: dodano funkcję callback
    } else if (filter === 'warning') {
      // Zachowaj te ze statusem 'warning' LUB 'alarm'
      tempFiltered = tempFiltered.filter(station => station.status === 'warning' || station.status === 'alarm'); // <-- POPRAWKA: dodano funkcję callback
    }
    // Dla filter === 'all' nie robimy nic (wszystkie przechodzą)

    // 3. Sortowanie według statusu (alarmy i ostrzeżenia najwyżej)
    tempFiltered = sortStationsByStatus(tempFiltered);

    // 4. Aktualizacja stanu z przefiltrowanymi i posortowanymi stacjami
    setFilteredStations(tempFiltered);

  }, [searchQuery, stations, filter, loading]); // Dodano loading jako zależność

  // Funkcja do ręcznego odświeżania (pull-to-refresh)
  const onRefresh = useCallback(async () => {
    setRefreshing(true); // Uruchom wskaźnik RefreshControl
    await loadStations(); // Załaduj dane ponownie (nie cicho)
    setRefreshing(false); // Zatrzymaj wskaźnik RefreshControl
  }, [loadStations]); // Zależność od loadStations

  const handleStationPress = useCallback((station) => {
    navigation.navigate('StationDetails', {
      stationId: station.id,
      stationName: station.name
    });
  }, [navigation]);

  // Obliczanie liczby stacji dla filtrów i podsumowania (memonizacja dla optymalizacji)
  const { alarmCount, warningCount, normalCount, totalCount } = React.useMemo(() => {
      let alarms = 0;
      let warnings = 0;
      stations.forEach(station => {
          if (station.status === 'alarm') alarms++;
          else if (station.status === 'warning') warnings++;
      });
      const total = stations.length;
      return {
          alarmCount: alarms,
          warningCount: warnings,
          normalCount: total - alarms - warnings,
          totalCount: total
      };
  }, [stations]); // Zależność tylko od głównej listy stacji

  // Renderowanie nagłówka z filtrami
  const renderHeader = () => (
    <View style={styles.filtersContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.filterButton,
          filter === 'all' && { backgroundColor: theme.colors.primary },
          filter !== 'all' && { backgroundColor: theme.colors.card }, // Domyślny kolor tła
          filter !== 'all' && pressed && { backgroundColor: theme.colors.border } // Efekt naciśnięcia
        ]}
        onPress={() => setFilter('all')}
        accessibilityRole="button"
        accessibilityLabel={`Pokaż wszystkie stacje, ${totalCount} stacji`}
        accessibilityState={{ selected: filter === 'all' }}
      >
        <Text style={[
          styles.filterButtonText,
          filter === 'all' ? styles.activeFilterText : { color: theme.colors.text }
        ]}>
          Wszystkie ({totalCount})
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.filterButton,
          filter === 'warning' && { backgroundColor: theme.colors.warning },
          filter !== 'warning' && { backgroundColor: theme.colors.card },
          filter !== 'warning' && pressed && { backgroundColor: theme.colors.border }
        ]}
        onPress={() => setFilter('warning')}
        accessibilityRole="button"
        accessibilityLabel={`Pokaż stacje ostrzegawcze i alarmowe, ${alarmCount + warningCount} stacji`}
        accessibilityState={{ selected: filter === 'warning' }}
      >
        <Text style={[
          styles.filterButtonText,
          filter === 'warning' ? styles.activeFilterTextWarning : { color: theme.colors.text } // Inny kolor tekstu dla warning
        ]}>
          Ostrz./Alarm ({alarmCount + warningCount})
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.filterButton,
          filter === 'alarm' && { backgroundColor: theme.colors.danger },
          filter !== 'alarm' && { backgroundColor: theme.colors.card },
          filter !== 'alarm' && pressed && { backgroundColor: theme.colors.border }
        ]}
        onPress={() => setFilter('alarm')}
        accessibilityRole="button"
        accessibilityLabel={`Pokaż stacje alarmowe, ${alarmCount} stacji`}
        accessibilityState={{ selected: filter === 'alarm' }}
      >
        <Text style={[
          styles.filterButtonText,
          filter === 'alarm' ? styles.activeFilterText : { color: theme.colors.text }
        ]}>
          Alarmowe ({alarmCount})
        </Text>
      </Pressable>
    </View>
  );

  // Status podsumowujący stany rzek
  const renderStatusSummary = () => {
    // Nie pokazuj podsumowania podczas ładowania lub gdy nie ma stacji
    if (loading || totalCount === 0) return null;

    return (
      <View style={[styles.statusSummary, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.statusText, { color: theme.colors.text }]}>
          <Text style={{ fontWeight: 'bold' }}>Podsumowanie:</Text>
          <Text style={{ color: theme.colors.danger }}> {alarmCount}A</Text> |
          <Text style={{ color: theme.colors.warning }}> {warningCount}O</Text> |
          <Text style={{ color: theme.colors.text }}> {normalCount}N</Text>
        </Text>
      </View>
    );
  };

  // Renderowanie pojedynczego elementu listy
  const renderStationItem = useCallback(({ item }) => (
    <StationCard
      station={item}
      onPress={() => handleStationPress(item)}
      // Przekazanie funkcji do pobrania koloru lub użycie logiki wewnątrz StationCard
      // getStatusColor={(s) => getCardStatusColor(s, theme)}
    />
  ), [handleStationPress, theme]); // Dodano theme jako zależność, jeśli getCardStatusColor jest przekazywane

  // Komunikat pustej listy
  const renderEmptyList = () => (
      <View style={styles.emptyContainer}>
          <Ionicons name="water-outline" size={64} color={theme.dark ? '#555' : '#CCC'} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              {searchQuery.trim() !== ''
                  ? 'Nie znaleziono stacji pasujących do wyszukiwania.'
                  : filter === 'alarm'
                  ? 'Brak stacji w stanie alarmowym.'
                  : filter === 'warning'
                  ? 'Brak stacji w stanie ostrzegawczym lub alarmowym.'
                  : 'Brak dostępnych stacji.' // Ogólny komunikat
              }
          </Text>
      </View>
  );


  // Główny widok ekranu
  if (loading && stations.length === 0) { // Pokaż loader tylko przy pierwszym ładowaniu
    return <Loader message="Ładowanie stacji..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Pasek wyszukiwania */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Ionicons name="search" size={20} color={theme.colors.placeholder} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Szukaj (nazwa stacji, rzeka...)"
          placeholderTextColor={theme.colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing" // Przycisk czyszczenia na iOS
        />
        {/* Przycisk czyszczenia dla Androida (opcjonalnie) */}
        {searchQuery.length > 0 && Platform.OS === 'android' && (
          <Ionicons
            name="close-circle"
            size={20}
            color={theme.colors.placeholder}
            style={styles.clearIcon}
            onPress={() => setSearchQuery('')}
          />
        )}
      </View>

      {/* Podsumowanie i Filtry */}
      {renderStatusSummary()}
      {renderHeader()}

      {/* Lista stacji */}
      <FlatList
        data={filteredStations}
        renderItem={renderStationItem} // Użycie zoptymalizowanej funkcji renderującej
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Używaj stanu 'refreshing'
            onRefresh={onRefresh} // Używaj funkcji onRefresh
            colors={[theme.colors.primary]} // Kolor wskaźnika Android
            tintColor={theme.colors.primary} // Kolor wskaźnika iOS
          />
        }
        ListEmptyComponent={renderEmptyList} // Komponent dla pustej listy
        contentContainerStyle={styles.listContent} // Styl dla kontenera listy
        keyboardShouldPersistTaps="handled" // Pozwala klikać elementy, gdy klawiatura jest widoczna
      />
    </View>
  );
}

// Style (dodano drobne poprawki i nowe style)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16, // Dodano górny margines
    marginBottom: 8,
    paddingHorizontal: 12, // Zmniejszono padding
    borderRadius: 8,
    height: 44, // Nieco niższy
    borderWidth: 1, // Dodano ramkę
    // Usunięto elevation/shadow - ramka wystarczy
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15, // Nieco mniejsza czcionka
  },
  clearIcon: {
    padding: 4,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12, // Zmniejszono padding
    marginBottom: 12, // Zwiększono margines
    justifyContent: 'space-between',
    gap: 8, // Odstęp między przyciskami
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 10, // Mniejszy padding boczny
    borderRadius: 20, // Bardziej zaokrąglone
    flex: 1, // Równa szerokość przycisków
    alignItems: 'center',
    justifyContent: 'center', // Wyśrodkowanie tekstu
    minHeight: 36, // Minimalna wysokość
    borderWidth: 1,
    borderColor: 'transparent', // Domyślnie przezroczysta ramka
  },
  activeFilterText: {
    color: '#fff', // Kolor tekstu dla aktywnych filtrów (all, alarm)
    fontWeight: 'bold',
    fontSize: 12,
  },
   activeFilterTextWarning: {
    color: '#402E00', // Ciemniejszy kolor dla lepszego kontrastu na żółtym tle
    fontWeight: 'bold',
    fontSize: 12,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16, // Padding tylko po bokach
    paddingBottom: 16, // Padding na dole listy
  },
  statusSummary: {
    marginHorizontal: 16,
    marginBottom: 12, // Zwiększono margines
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1, // Dodano ramkę
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13, // Nieco mniejsza czcionka
    textAlign: 'center',
  },
  emptyContainer: {
    flexGrow: 1, // Aby zajmował dostępną przestrzeń
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20, // Odstęp od góry
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22, // Poprawa czytelności
  }
});