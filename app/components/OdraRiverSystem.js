// Plik: app/components/OdraRiverSystem.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Svg, G, Line, Circle, Path, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SVG_WIDTH = SCREEN_WIDTH - 32; // Uwzględniając padding
const SVG_HEIGHT = 2300; // Wysokość SVG dla całej wizualizacji

const OdraRiverSystem = ({ stations, theme }) => {
  const navigation = useNavigation();
  const [stationData, setStationData] = useState({});
  
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

  // Znajdź dane stacji po nazwie
  const getStationByName = (name) => {
    // Szukaj dokładnego dopasowania
    if (stationData[name]) {
      return stationData[name];
    }
    
    // Szukaj częściowego dopasowania
    const stationNames = Object.keys(stationData);
    const matchingName = stationNames.find(stationName => 
      stationName.includes(name) || name.includes(stationName)
    );
    
    return matchingName ? stationData[matchingName] : null;
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

  // Koordynaty dla głównych stacji na Odrze (x, y)
  const mainRiverPath = [
    { name: "Strona czeska", x: SVG_WIDTH / 2, y: 50 },
    { name: "Chałupki", x: SVG_WIDTH / 2, y: 100 },
    { name: "Olza", x: SVG_WIDTH / 2, y: 150 },
    { name: "Krzyżanowice", x: SVG_WIDTH / 2, y: 200 },
    { name: "Racibórz-Miedonia", x: SVG_WIDTH / 2, y: 250 },
    { name: "Koźle", x: SVG_WIDTH / 2, y: 300 },
    { name: "Krapkowice", x: SVG_WIDTH / 2, y: 350 },
    { name: "Opole-Groszowice", x: SVG_WIDTH / 2, y: 400 },
    { name: "UJŚCIE NYSY KŁODZKIEJ", x: SVG_WIDTH / 2, y: 450 },
    { name: "Brzeg", x: SVG_WIDTH / 2, y: 500 },
    { name: "Oława", x: SVG_WIDTH / 2, y: 550 },
    { name: "Trestno", x: SVG_WIDTH / 2, y: 600 },
    { name: "WROCŁAW ODRA", x: SVG_WIDTH / 2, y: 700 },
    { name: "Brzeg Dolny", x: SVG_WIDTH / 2, y: 800 },
    { name: "Malczyce", x: SVG_WIDTH / 2, y: 850 },
    { name: "Ścinawa", x: SVG_WIDTH / 2, y: 900 },
    { name: "Głogów", x: SVG_WIDTH / 2, y: 950 },
    { name: "Nowa Sól", x: SVG_WIDTH / 2, y: 1000 },
    { name: "Cigacice", x: SVG_WIDTH / 2, y: 1050 },
    { name: "Nietków", x: SVG_WIDTH / 2, y: 1100 },
    { name: "Połęcko", x: SVG_WIDTH / 2, y: 1150 },
    { name: "Biała Góra", x: SVG_WIDTH / 2, y: 1200 },
    { name: "Słubice", x: SVG_WIDTH / 2, y: 1250 },
    { name: "Kostrzyn nad Odrą", x: SVG_WIDTH / 2, y: 1300 },
    { name: "Gozdowice", x: SVG_WIDTH / 2, y: 1350 },
    { name: "Bielinek", x: SVG_WIDTH / 2, y: 1400 },
    { name: "Gryfino", x: SVG_WIDTH / 2, y: 1450 },
    { name: "SZCZECIN MOST DŁUGI", x: SVG_WIDTH / 2, y: 1500 }
  ];

  // Koordynaty dla Nysy Kłodzkiej
  const nysaPath = [
    { name: "Nysa Kłodzka", x: SVG_WIDTH / 2 - 150, y: 200 },
    { name: "Bystrzyca Kłodzka", x: SVG_WIDTH / 2 - 150, y: 250 },
    { name: "Kłodzko", x: SVG_WIDTH / 2 - 150, y: 300 },
    { name: "Bardo", x: SVG_WIDTH / 2 - 150, y: 350 },
    { name: "Nysa", x: SVG_WIDTH / 2 - 150, y: 380 },
    { name: "Kopice", x: SVG_WIDTH / 2 - 120, y: 410 },
    { name: "Skorogoszcz", x: SVG_WIDTH / 2 - 90, y: 430 },
    // Połączenie z Odrą
    { name: "UJŚCIE NYSY KŁODZKIEJ", x: SVG_WIDTH / 2, y: 450 }
  ];

  // Koordynaty dla Widawy
  const widawaPath = [
    { name: "Widawa", x: SVG_WIDTH / 2 - 120, y: 600 },
    { name: "Zbytowa", x: SVG_WIDTH / 2 - 100, y: 620 },
    { name: "Krzyżanowice (Widawa)", x: SVG_WIDTH / 2 - 80, y: 640 },
    { name: "Wrocław (ujście Widawy)", x: SVG_WIDTH / 2 - 40, y: 680 },
    { name: "WROCŁAW ODRA", x: SVG_WIDTH / 2, y: 700 }
  ];

  // Koordynaty dla Oławy
  const olawaPath = [
    { name: "Oława (rzeka)", x: SVG_WIDTH / 2 + 120, y: 600 },
    { name: "Zborowice", x: SVG_WIDTH / 2 + 100, y: 620 },
    { name: "Oława (miejscowość)", x: SVG_WIDTH / 2 + 80, y: 640 },
    { name: "Wrocław (ujście Oławy)", x: SVG_WIDTH / 2 + 40, y: 680 },
    { name: "WROCŁAW ODRA", x: SVG_WIDTH / 2, y: 700 }
  ];

  // Koordynaty dla Ślęzy
  const slezaPath = [
    { name: "Ślęza", x: SVG_WIDTH / 2 - 120, y: 720 },
    { name: "Białobrzegie", x: SVG_WIDTH / 2 - 100, y: 730 },
    { name: "Borów", x: SVG_WIDTH / 2 - 80, y: 740 },
    { name: "Ślęza (miejscowość)", x: SVG_WIDTH / 2 - 60, y: 750 },
    { name: "WROCŁAW ODRA", x: SVG_WIDTH / 2, y: 700 }
  ];

  // Koordynaty dla Bystrzycy
  const bystrzycaPath = [
    { name: "Bystrzyca", x: SVG_WIDTH / 2 + 120, y: 720 },
    { name: "Krasków", x: SVG_WIDTH / 2 + 100, y: 730 },
    { name: "Mietków", x: SVG_WIDTH / 2 + 80, y: 740 },
    { name: "Jarnołtów", x: SVG_WIDTH / 2 + 60, y: 750 },
    { name: "WROCŁAW ODRA", x: SVG_WIDTH / 2, y: 700 }
  ];

  // Koordynaty dla Bobru
  const bobrPath = [
    { name: "Bóbr", x: SVG_WIDTH / 2 + 150, y: 950 },
    { name: "Pilchowice", x: SVG_WIDTH / 2 + 150, y: 980 },
    { name: "Dąbrowa Bolesławiecka", x: SVG_WIDTH / 2 + 150, y: 1010 },
    { name: "Szprotawa", x: SVG_WIDTH / 2 + 150, y: 1040 },
    { name: "Żagań", x: SVG_WIDTH / 2 + 130, y: 1070 },
    { name: "Dobroszów Wielki", x: SVG_WIDTH / 2 + 110, y: 1090 },
    { name: "Nowogród Bobrzański", x: SVG_WIDTH / 2 + 90, y: 1110 },
    { name: "Stary Raduszec", x: SVG_WIDTH / 2 + 60, y: 1130 },
    { name: "Połęcko", x: SVG_WIDTH / 2, y: 1150 }
  ];

  // Funkcja generująca ścieżkę SVG
  const generatePathD = (pathPoints) => {
    return pathPoints.map((point, index) => 
      (index === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`)
    ).join(' ');
  };

  // Generowanie strzałek wskazujących kierunek przepływu
  const createFlowArrow = (x1, y1, x2, y2, key) => {
    // Oblicz kąt linii
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    // Oblicz punkt środkowy
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    return (
      <G key={`arrow-${key}`} transform={`translate(${midX}, ${midY}) rotate(${angle})`}>
        <Path 
          d="M-5,-5 L0,0 L-5,5" 
          stroke={theme.dark ? '#FFFFFF' : '#000000'}
          strokeWidth="1.5"
          fill="none"
        />
      </G>
    );
  };

  // Funkcja renderująca stację jako punkt na mapie
  const renderStation = (station, index, isMainStation = false) => {
    const statusColor = getStatusColor(station.name);
    const waterLevel = getWaterLevel(station.name);
    const isMainJunction = station.name.toUpperCase() === station.name;
    
    return (
      <G 
        key={`station-${index}`}
        onPress={() => handleStationPress(station.name)}
      >
        {/* Punkt stacji */}
        <Circle 
          cx={station.x} 
          cy={station.y} 
          r={isMainJunction ? 8 : 6} 
          fill={statusColor}
          stroke={theme.dark ? '#FFFFFF' : '#000000'}
          strokeWidth="1"
        />
        
        {/* Etykieta z nazwą stacji */}
        <SvgText
          x={station.x}
          y={station.y - 12}
          fontSize={isMainJunction ? 12 : 10}
          fontWeight={isMainJunction ? 'bold' : 'normal'}
          fill={theme.colors.text}
          textAnchor="middle"
        >
          {station.name}
        </SvgText>
        
        {/* Poziom wody */}
        <SvgText
          x={station.x}
          y={station.y + 18}
          fontSize={11}
          fill={theme.dark ? '#FFFFFF' : '#000000'}
          textAnchor="middle"
        >
          {waterLevel} cm
        </SvgText>
      </G>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal={false} 
        showsVerticalScrollIndicator={true}
        style={styles.scrollView}
      >
        <Svg width={SVG_WIDTH} height={SVG_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          {/* Główny bieg Odry */}
          <Path 
            d={generatePathD(mainRiverPath)} 
            fill="none" 
            stroke={theme.colors.primary} 
            strokeWidth="3"
          />
          
          {/* Strzałki na głównym biegu */}
          {mainRiverPath.map((point, index) => {
            if (index === 0) return null;
            return createFlowArrow(
              mainRiverPath[index-1].x, 
              mainRiverPath[index-1].y,
              point.x,
              point.y,
              `main-${index}`
            );
          })}
          
          {/* Nysa Kłodzka */}
          <Path 
            d={generatePathD(nysaPath)} 
            fill="none" 
            stroke={theme.colors.info} 
            strokeWidth="2.5"
          />
          
          {/* Strzałki na Nysie Kłodzkiej */}
          {nysaPath.map((point, index) => {
            if (index === 0) return null;
            return createFlowArrow(
              nysaPath[index-1].x, 
              nysaPath[index-1].y,
              point.x,
              point.y,
              `nysa-${index}`
            );
          })}
          
          {/* Widawa */}
          <Path 
            d={generatePathD(widawaPath)} 
            fill="none" 
            stroke={theme.colors.info} 
            strokeWidth="2.5"
          />
          
          {/* Strzałki na Widawie */}
          {widawaPath.map((point, index) => {
            if (index === 0) return null;
            return createFlowArrow(
              widawaPath[index-1].x, 
              widawaPath[index-1].y,
              point.x,
              point.y,
              `widawa-${index}`
            );
          })}
          
          {/* Oława */}
          <Path 
            d={generatePathD(olawaPath)} 
            fill="none" 
            stroke={theme.colors.info} 
            strokeWidth="2.5"
          />
          
          {/* Strzałki na Oławie */}
          {olawaPath.map((point, index) => {
            if (index === 0) return null;
            return createFlowArrow(
              olawaPath[index-1].x, 
              olawaPath[index-1].y,
              point.x,
              point.y,
              `olawa-${index}`
            );
          })}
          
          {/* Ślęza */}
          <Path 
            d={generatePathD(slezaPath)} 
            fill="none" 
            stroke={theme.colors.info} 
            strokeWidth="2.5"
          />
          
          {/* Strzałki na Ślęzie */}
          {slezaPath.map((point, index) => {
            if (index === 0) return null;
            return createFlowArrow(
              slezaPath[index-1].x, 
              slezaPath[index-1].y,
              point.x,
              point.y,
              `sleza-${index}`
            );
          })}
          
          {/* Bystrzyca */}
          <Path 
            d={generatePathD(bystrzycaPath)} 
            fill="none" 
            stroke={theme.colors.info} 
            strokeWidth="2.5"
          />
          
          {/* Strzałki na Bystrzycy */}
          {bystrzycaPath.map((point, index) => {
            if (index === 0) return null;
            return createFlowArrow(
              bystrzycaPath[index-1].x, 
              bystrzycaPath[index-1].y,
              point.x,
              point.y,
              `bystrzyca-${index}`
            );
          })}
          
          {/* Bóbr */}
          <Path 
            d={generatePathD(bobrPath)} 
            fill="none" 
            stroke={theme.colors.info} 
            strokeWidth="2.5"
          />
          
          {/* Strzałki na Bobrze */}
          {bobrPath.map((point, index) => {
            if (index === 0) return null;
            return createFlowArrow(
              bobrPath[index-1].x, 
              bobrPath[index-1].y,
              point.x,
              point.y,
              `bobr-${index}`
            );
          })}
          
          {/* Stacje na głównym biegu Odry */}
          {mainRiverPath.map((station, index) => renderStation(station, index, true))}
          
          {/* Stacje na Nysie Kłodzkiej */}
          {nysaPath.slice(0, -1).map((station, index) => renderStation(station, `nysa-${index}`))}
          
          {/* Stacje na Widawie */}
          {widawaPath.slice(0, -1).map((station, index) => renderStation(station, `widawa-${index}`))}
          
          {/* Stacje na Oławie */}
          {olawaPath.slice(0, -1).map((station, index) => renderStation(station, `olawa-${index}`))}
          
          {/* Stacje na Ślęzie */}
          {slezaPath.slice(0, -1).map((station, index) => renderStation(station, `sleza-${index}`))}
          
          {/* Stacje na Bystrzycy */}
          {bystrzycaPath.slice(0, -1).map((station, index) => renderStation(station, `bystrzyca-${index}`))}
          
          {/* Stacje na Bobrze */}
          {bobrPath.slice(0, -1).map((station, index) => renderStation(station, `bobr-${index}`))}
          
          {/* Etykiety rzek */}
          <SvgText
            x={SVG_WIDTH / 2}
            y={25}
            fontSize={14}
            fontWeight="bold"
            fill={theme.colors.primary}
            textAnchor="middle"
          >
            ODRA
          </SvgText>
          
          <SvgText
            x={SVG_WIDTH / 2 - 150}
            y={180}
            fontSize={12}
            fontWeight="bold"
            fill={theme.colors.info}
            textAnchor="middle"
          >
            NYSA KŁODZKA
          </SvgText>
          
          <SvgText
            x={SVG_WIDTH / 2 - 120}
            y={580}
            fontSize={12}
            fontWeight="bold"
            fill={theme.colors.info}
            textAnchor="middle"
          >
            WIDAWA
          </SvgText>
          
          <SvgText
            x={SVG_WIDTH / 2 + 120}
            y={580}
            fontSize={12}
            fontWeight="bold"
            fill={theme.colors.info}
            textAnchor="middle"
          >
            OŁAWA
          </SvgText>
          
          <SvgText
            x={SVG_WIDTH / 2 - 120}
            y={700}
            fontSize={12}
            fontWeight="bold"
            fill={theme.colors.info}
            textAnchor="middle"
          >
            ŚLĘZA
          </SvgText>
          
          <SvgText
            x={SVG_WIDTH / 2 + 120}
            y={700}
            fontSize={12}
            fontWeight="bold"
            fill={theme.colors.info}
            textAnchor="middle"
          >
            BYSTRZYCA
          </SvgText>
          
          <SvgText
            x={SVG_WIDTH / 2 + 150}
            y={930}
            fontSize={12}
            fontWeight="bold"
            fill={theme.colors.info}
            textAnchor="middle"
          >
            BÓBR
          </SvgText>
        </Svg>
      </ScrollView>
      
      <View style={[styles.legendContainer, { backgroundColor: theme.dark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }]}>
        <Text style={[styles.legendTitle, { color: theme.colors.text }]}>Stan rzek</Text>
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
        <View style={styles.legendItem}>
          <View style={[styles.legendLineColor, { backgroundColor: theme.colors.primary }]} />
          <Text style={[styles.legendText, { color: theme.colors.text }]}>Odra</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLineColor, { backgroundColor: theme.colors.info }]} />
          <Text style={[styles.legendText, { color: theme.colors.text }]}>Dopływy</Text>
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
    alignItems: 'center',
    marginBottom: 20,
  },
  scrollView: {
    width: '100%',
  },
  legendContainer: {
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
    width: '90%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  legendLineColor: {
    width: 20,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
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

export default OdraRiverSystem;