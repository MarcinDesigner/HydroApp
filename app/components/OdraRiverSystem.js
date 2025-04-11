// Plik: app/components/OdraRiverSystem.js
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRefresh } from '../context/RefreshContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

const OdraRiverSystem = ({ stations, theme }) => {
  const navigation = useNavigation();
  const { isRefreshing, addListener, removeListener } = useRefresh();
  const [stationData, setStationData] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeRiver, setActiveRiver] = useState('Odra'); // 'Odra', 'Nysa Kłodzka', itd.

  // Efekt do obsługi odświeżania danych
  useEffect(() => {
    const handleRefresh = () => {
      console.log("Odświeżanie danych rzek...");
      setLoading(true);
      
      // Symulacja odświeżania danych
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
    
    // Dodaj nasłuchiwacz odświeżania
    addListener(handleRefresh);
    
    // Cleanup
    return () => {
      removeListener(handleRefresh);
    };
  }, [addListener, removeListener]);
  
  useEffect(() => {
    if (stations && stations.length > 0) {
      // Przekształć tablicę stacji na obiekt do łatwego dostępu
      const stationsObject = {};
      stations.forEach(station => {
        stationsObject[station.name] = station;
      });
      setStationData(stationsObject);
    }
  }, [stations]);

  // Grupy stacji według rzek
  const riverStations = {
    'Odra': [
      "Chałupki", "Olza", "Krzyżanowice", "Racibórz-Miedonia", 
      "Koźle", "Krapkowice", "Opole-Groszowice", "Ujście Nysy Kłodzkiej", 
      "Brzeg", "Oława", "Trestno", "Wrocław Odra", "Brzeg Dolny", 
      "Malczyce", "Ścinawa", "Głogów", "Nowa Sól", "Cigacice", 
      "Nietków", "Połęcko", "Biała Góra", "Słubice", "Kostrzyn n. Odrą", 
      "Gozdowice", "Bielinek", "Gryfino", "Szczecin Most Długi"
    ],
    'Nysa Kłodzka': [
      "Nysa Kłodzka", "Bystrzyca Kłodzka", "Kłodzko", "Bardo", 
      "Nysa", "Kopice", "Skorogoszcz", "Ujście Nysy Kłodzkiej"
    ],
    'Widawa': [
      "Zbytowa", "Krzyżanowice", 
      "Wrocław Odra"
    ],
    'Oława': [
      "Oława (rzeka)", "Zborowice", "Oława (miejscowość)", 
      "Wrocław (ujście Oławy)", "Wrocław Odra"
    ],
    'Ślęza': [
      "Ślęza", "Białobrzegie", "Borów", 
      "Ślęza (miejscowość)", "Wrocław Odra"
    ],
    'Bystrzyca': [
      "Bystrzyca", "Krasków", "Mietków", 
      "Jarnołtów", "Wrocław Odra"
    ],
    'Bóbr': [
      "Pilchowice", "Dąbrowa Bolesławiecka", 
      "Szprotawa", "Żagań", "Dobroszów Wielki", 
      "Nowogród Bobrzański", "Stary Raduszec", "Połęcko"
    ]
  };

  // Funkcja do renderowania przycisku rzeki
  const renderRiverButton = (riverName) => {
    const isActive = activeRiver === riverName;
    
    return (
      <TouchableOpacity
        key={riverName}
        style={[
          styles.riverButton,
          isActive && { backgroundColor: theme.colors.primary }
        ]}
        onPress={() => setActiveRiver(riverName)}
      >
        <Text style={[
          styles.riverButtonText,
          isActive && { color: 'white' }
        ]}>
          {riverName}
        </Text>
      </TouchableOpacity>
    );
  };

// POPRAWIONA FUNKCJA getStationByName
const getStationByName = (name) => {
  if (!name) return null;
  console.log("Próbuję pobrać stację:", name);
  
  // Mapa specjalnych przypadków dla stacji, które mogą być błędnie interpretowane
  const specialCases = {
    "Brzeg": "Brzeg", // Zapewnia, że "Brzeg" zawsze dopasuje do "Brzeg", a nie "Kołobrzeg"
    "Kołobrzeg": "Kołobrzeg",
    "Ujście Nysy Kłodzkiej": "Ujście Nysy Kłodzkiej",
    "Biała Góra": "Biała Góra"
  };
  
  // Sprawdź czy mamy specjalny przypadek
  if (specialCases[name]) {
    const specialCaseName = specialCases[name];
    if (stationData[specialCaseName]) {
      console.log("Znaleziono stację przez specjalny przypadek:", specialCaseName);
      return stationData[specialCaseName];
    }
  }
  
  // 1. Dokładne dopasowanie
  if (stationData[name]) {
    console.log("Znaleziono stację w stationData po nazwie:", name);
    return stationData[name];
  }
  
  // 2. Dokładne dopasowanie ignorujące wielkość liter
  const stationNames = Object.keys(stationData);
  const exactMatchIgnoreCase = stationNames.find(
    (stationName) => stationName.toLowerCase() === name.toLowerCase()
  );
  
  if (exactMatchIgnoreCase) {
    console.log("Znaleziono stację przez dokładne dopasowanie ignorujące wielkość liter:", exactMatchIgnoreCase);
    return stationData[exactMatchIgnoreCase];
  }
  
  // 3. Pełne słowo - ważne dla rozróżnienia "Brzeg" vs "Kołobrzeg"
  const fullWordMatch = stationNames.find(stationName => {
    const words = stationName.toLowerCase().split(/\s+/);
    return words.includes(name.toLowerCase());
  });
  
  if (fullWordMatch) {
    console.log("Znaleziono stację przez dopasowanie pełnego słowa:", fullWordMatch);
    return stationData[fullWordMatch];
  }
  
  // 4. Częściowe dopasowanie (tylko jeśli nie ma konfliktu z nazwami podobnymi)
  // Tworzymy listę potencjalnych dopasowań
  const partialMatches = stationNames.filter(
    (stationName) =>
      stationName.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(stationName.toLowerCase())
  );
  
  // Jeśli mamy dokładnie jedno dopasowanie
  if (partialMatches.length === 1) {
    console.log("Znaleziono stację przez częściowe dopasowanie:", partialMatches[0]);
    return stationData[partialMatches[0]];
  }
  // Jeśli mamy więcej dopasowań, preferujemy te, które zaczynają się od szukanej nazwy
  else if (partialMatches.length > 1) {
    const priorityMatch = partialMatches.find(stationName => 
      stationName.toLowerCase().startsWith(name.toLowerCase())
    );
    
    if (priorityMatch) {
      console.log("Znaleziono stację przez priorytetowe dopasowanie:", priorityMatch);
      return stationData[priorityMatch];
    }
    
    // Jeśli nadal mamy wiele dopasowań, preferujemy krótsze nazwy (często bardziej specyficzne)
    partialMatches.sort((a, b) => a.length - b.length);
    console.log("Znaleziono stację przez najkrótsze częściowe dopasowanie:", partialMatches[0]);
    return stationData[partialMatches[0]];
  }
  
  // 5. Dopasowanie po normalizacji nazw (bez spacji, myślników, itd.)
  const normalizedName = name.toLowerCase().replace(/[-\s]/g, '');
  const normalizedMatches = stationNames.filter(stationName => {
    const normalizedStationName = stationName.toLowerCase().replace(/[-\s]/g, '');
    return normalizedStationName === normalizedName || 
           normalizedStationName.includes(normalizedName) || 
           normalizedName.includes(normalizedStationName);
  });
  
  // Podobnie jak wyżej, jeśli mamy wiele dopasowań, preferujemy krótsze nazwy
  if (normalizedMatches.length > 0) {
    normalizedMatches.sort((a, b) => a.length - b.length);
    console.log("Znaleziono stację przez normalizację nazw:", normalizedMatches[0]);
    return stationData[normalizedMatches[0]];
  }
  
  // 6. Obsługa specjalnych przypadków
  if (name === "UJŚCIE NYSY KŁODZKIEJ" || name === "Ujście Nysy Kłodzkiej") {
    const alternativeNames = ["Ujście Nysy", "Nysa Kłodzka Ujście", "Nysa Kłodzka-Ujście"];
    for (const altName of alternativeNames) {
      const altMatch = stationNames.find(
        (stationName) => stationName.includes(altName) || altName.includes(stationName)
      );
      if (altMatch) {
        console.log("Znaleziono stację przez alternatywną nazwę:", altMatch);
        return stationData[altMatch];
      }
    }
  }
  
  console.log("Nie znaleziono stacji:", name);
  return null;
};

  // Funkcja zwracająca kolor dla statusu stacji
  const getStatusColor = (stationName) => {
    console.log("Próbuję pobrać kolor dla stacji:", stationName);
    const station = getStationByName(stationName);
    console.log("Znaleziona stacja:", station);
    if (!station) return theme.colors.info; // Domyślny kolor
    
    switch (station.status) {
      case 'alarm': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      case 'normal': return theme.colors.safe;
      default: return theme.colors.info;
    }
  };

  // Funkcja zwracająca poziom wody dla stacji
  const getWaterLevel = (stationName) => {
    const station = getStationByName(stationName);
    return station ? station.level : '?';
  };

  // Funkcja do obsługi kliknięcia w stację
  const handleStationPress = (stationName) => {
    const station = getStationByName(stationName);
    if (station) {
      navigation.navigate('StationDetails', { 
        stationId: station.id,
        stationName: station.name
      });
    }
  };
  
  // Renderuje pojedynczą stację jako box
  const renderStationItem = ({ item: stationName, index }) => {
    const statusColor = getStatusColor(stationName);
    const waterLevel = getWaterLevel(stationName);
    const isMainJunction = stationName.toUpperCase() === stationName;
    
    return (
      <TouchableOpacity
        style={[
          styles.stationItem,
          { borderLeftColor: statusColor },
          isMainJunction && styles.mainJunctionStation
        ]}
        onPress={() => handleStationPress(stationName)}
      >
        <Text style={[
          styles.stationName,
          isMainJunction && styles.mainJunctionText,
          { color: theme.colors.text }
        ]}>
          {stationName}
        </Text>
        
        <View style={styles.stationDetails}>
          <Text style={[styles.waterLevel, { color: theme.colors.text }]}>
            {waterLevel} cm
          </Text>
          
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        </View>
        
        <Ionicons name="chevron-forward" size={18} color={theme.dark ? '#AAA' : '#666'} />
      </TouchableOpacity>
    );
  };

  // Dodawanie strzałek przepływu między stacjami
  const renderFlowArrows = () => {
    return (
      riverStations[activeRiver].slice(0, -1).map((_, index) => (
        <View key={`arrow-${index}`} style={styles.flowArrowContainer}>
          <Ionicons 
            name="arrow-down" 
            size={20} 
            color={activeRiver === 'Odra' ? theme.colors.primary : theme.colors.info} 
          />
        </View>
      ))
    );
  };

  return (
    <View style={styles.container}>
      {/* Wybór rzeki */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.riverButtonsContainer}
        contentContainerStyle={styles.riverButtonsContent}
      >
        {Object.keys(riverStations).map(renderRiverButton)}
      </ScrollView>

      {/* Tytuł aktywnej rzeki */}
      <View style={[
        styles.riverTitleContainer,
        { backgroundColor: activeRiver === 'Odra' ? theme.colors.primary : theme.colors.info }
      ]}>
        <Text style={styles.riverTitle}>
          {activeRiver.toUpperCase()}
        </Text>
      </View>

      {/* Lista stacji */}
      <View style={styles.flowContainer}>
        {loading || isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              Aktualizowanie danych...
            </Text>
          </View>
        ) : (
          <>
            {riverStations[activeRiver].map((stationName, index) => (
              <React.Fragment key={`station-${index}`}>
                {index > 0 && (
                  <View style={styles.flowArrowContainer}>
                    <Ionicons 
                      name="arrow-down" 
                      size={20} 
                      color={activeRiver === 'Odra' ? theme.colors.primary : theme.colors.info} 
                    />
                  </View>
                )}
                <TouchableOpacity
                  style={[
                    styles.stationItem,
                    { 
                      borderLeftColor: getStatusColor(stationName),
                      backgroundColor: theme.colors.card 
                    },
                    stationName.toUpperCase() === stationName && styles.mainJunctionStation
                  ]}
                  onPress={() => handleStationPress(stationName)}
                >
                  <Text style={[
                    styles.stationName,
                    stationName.toUpperCase() === stationName && styles.mainJunctionText,
                    { color: theme.colors.text }
                  ]}>
                    {stationName}
                  </Text>
                  
                  <View style={styles.stationDetails}>
                    <Text style={[styles.waterLevel, { color: theme.colors.text }]}>
                      {getWaterLevel(stationName)} cm
                    </Text>
                    
                    <View style={[
                      styles.statusDot, 
                      { backgroundColor: getStatusColor(stationName) }
                    ]} />
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </>
        )}
      </View>

      {/* Legenda */}
      <View style={[styles.legendContainer, { backgroundColor: theme.dark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }]}>
        <Text style={[styles.legendTitle, { color: theme.colors.text }]}>Stan rzek</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.colors.safe }]} />
            <Text style={[styles.legendText, { color: theme.colors.text }]}>Normalny</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.colors.warning }]} />
            <Text style={[styles.legendText, { color: theme.colors.text }]}>Ostrzegawczy</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.colors.danger }]} />
            <Text style={[styles.legendText, { color: theme.colors.text }]}>Alarmowy</Text>
          </View>
        </View>
      </View>
      
      <Text style={[styles.infoText, { color: theme.dark ? '#AAA' : '#666' }]}>
        Dotknij stacji, aby zobaczyć szczegóły
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  riverButtonsContainer: {
    maxHeight: 50,
    marginBottom: 16,
    width: '100%',
  },
  riverButtonsContent: {
    paddingHorizontal: 16,
  },
  riverButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  riverButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  riverTitleContainer: {
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: 16,
  },
  riverTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  flowContainer: {
    width: '90%',
    alignItems: 'center',
  },
  stationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 4,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mainJunctionStation: {
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#f8f8f8',
    borderLeftWidth: 6,
  },
  stationName: {
    fontSize: 14,
    flex: 1,
  },
  mainJunctionText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  stationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  waterLevel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  flowArrowContainer: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  legendContainer: {
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
    width: '90%',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  }
});

// Funkcja pomocnicza do logowania dostępnych stacji
const logAvailableStations = () => {
  console.log("=== DOSTĘPNE STACJE ===");
  Object.keys(stationData).forEach(stationName => {
    console.log(`- ${stationName} (ID: ${stationData[stationName].id})`);
  });
  console.log("======================");
};

export default React.memo(OdraRiverSystem);