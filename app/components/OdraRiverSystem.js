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
      "Strona czeska", "Chałupki", "Olza", "Krzyżanowice", "Racibórz-Miedonia", 
      "Koźle", "Krapkowice", "Opole-Groszowice", "UJŚCIE NYSY KŁODZKIEJ", 
      "Brzeg", "Oława", "Trestno", "WROCŁAW ODRA", "Brzeg Dolny", 
      "Malczyce", "Ścinawa", "Głogów", "Nowa Sól", "Cigacice", 
      "Nietków", "Połęcko", "Biała Góra", "Słubice", "Kostrzyn nad Odrą", 
      "Gozdowice", "Bielinek", "Gryfino", "SZCZECIN MOST DŁUGI"
    ],
    'Nysa Kłodzka': [
      "Nysa Kłodzka", "Bystrzyca Kłodzka", "Kłodzko", "Bardo", 
      "Nysa", "Kopice", "Skorogoszcz", "UJŚCIE NYSY KŁODZKIEJ"
    ],
    'Widawa': [
      "Widawa", "Zbytowa", "Krzyżanowice (Widawa)", 
      "Wrocław (ujście Widawy)", "WROCŁAW ODRA"
    ],
    'Oława': [
      "Oława (rzeka)", "Zborowice", "Oława (miejscowość)", 
      "Wrocław (ujście Oławy)", "WROCŁAW ODRA"
    ],
    'Ślęza': [
      "Ślęza", "Białobrzegie", "Borów", 
      "Ślęza (miejscowość)", "WROCŁAW ODRA"
    ],
    'Bystrzyca': [
      "Bystrzyca", "Krasków", "Mietków", 
      "Jarnołtów", "WROCŁAW ODRA"
    ],
    'Bóbr': [
      "Bóbr", "Pilchowice", "Dąbrowa Bolesławiecka", 
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

const getStationByName = (name) => {
  if (!stationData || Object.keys(stationData).length === 0) return null;

  // Dokładne dopasowanie
  if (stationData[name]) return stationData[name];

  // Częściowe dopasowanie (ignoruje wielkość liter)
  const stationNames = Object.keys(stationData);
  const match = stationNames.find(
    (stationName) =>
      stationName.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(stationName.toLowerCase())
  );
  return match ? stationData[match] : null;
};

  // Funkcja zwracająca kolor dla statusu stacji
  const getStatusColor = (stationName) => {
    const station = getStationByName(stationName);
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

export default React.memo(OdraRiverSystem);