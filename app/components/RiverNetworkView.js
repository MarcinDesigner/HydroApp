// Plik: app/components/RiverNetworkView.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Svg, { Path, G, Rect, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

const RiverNetworkView = ({ stations, riverName }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [networkData, setNetworkData] = useState([]);
  const [riverStations, setRiverStations] = useState([]);

  useEffect(() => {
    // Filtruj stacje dla głównej rzeki
    if (stations && stations.length > 0) {
      const riverStations = stations
        .filter(station => station.river === riverName)
        .sort((a, b) => a.name.localeCompare(b.name));
      
      setRiverStations(riverStations);
      
      // Generuj strukturę sieci rzecznej (główna rzeka i dopływy)
      generateRiverNetwork(stations, riverName);
    }
  }, [stations, riverName]);

  const generateRiverNetwork = (allStations, mainRiver) => {
    // Uproszczona reprezentacja sieci rzecznej na potrzeby demonstracji
    // W rzeczywistości wymagałoby to dokładniejszych danych o sieci rzecznej
    const mainRiverStations = allStations
      .filter(station => station.river === mainRiver)
      .sort((a, b) => a.name.localeCompare(b.name));
    
    // Znajdź rzeki, które mogą być dopływami
    // (uproszczone podejście - w rzeczywistości potrzebne byłyby dane o dopływach)
    const potentialTributaries = [...new Set(
      allStations
        .filter(station => station.river !== mainRiver)
        .map(station => station.river)
    )].filter(river => river);
    
    // Wybierz losowo kilka rzek jako dopływy (dla demonstracji)
    const tributaries = potentialTributaries
      .slice(0, Math.min(3, potentialTributaries.length))
      .map(tributaryName => {
        return {
          name: tributaryName,
          stations: allStations
            .filter(station => station.river === tributaryName)
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, 3) // Ogranicz do maksymalnie 3 stacji na dopływ
        };
      });
    
    setNetworkData({
      mainRiver: {
        name: mainRiver,
        stations: mainRiverStations
      },
      tributaries: tributaries
    });
  };

  const getStatusColor = (station) => {
    const percentage = getLevelPercentage(station);
    
    if (percentage > 60) return theme.colors.danger;
    if (percentage > 30) return theme.colors.warning;
    return '#4CAF50'; // zielony dla niskich poziomów
  };
  
  const getLevelPercentage = (station) => {
    // Przykładowa skala
    const maxLevel = 500;
    const percentage = (station.level / maxLevel) * 100;
    return Math.min(percentage, 100);
  };

  const handleStationPress = (station) => {
    navigation.navigate('StationDetails', { 
      stationId: station.id,
      stationName: station.name
    });
  };

  if (riverStations.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          Brak danych dla rzeki {riverName}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      horizontal={false}
    >
      <View style={styles.networkContainer}>
        <Text style={[styles.networkTitle, { color: theme.colors.text }]}>
          Sieć rzeczna {riverName}
        </Text>
        
        {/* Wizualizacja sieci rzecznej */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Svg width={1000} height={600} viewBox="0 0 1000 600">
            {/* Główna rzeka */}
            {networkData.mainRiver && networkData.mainRiver.stations.map((station, index, arr) => {
              const stationX = 500; // Środek 
              const stationY = 50 + index * 120;
              const color = getStatusColor(station);
              
              // Połączenie między stacjami (rzeka)
              const isLastStation = index === arr.length - 1;
              
              return (
                <G key={station.id}>
                  {/* Linia rzeki */}
                  {!isLastStation && (
                    <Path 
                      d={`M${stationX} ${stationY + 60} L${stationX} ${stationY + 120}`} 
                      stroke={theme.colors.primary}
                      strokeWidth={3}
                    />
                  )}
                  
                  {/* Stacja */}
                  <G onPress={() => handleStationPress(station)}>
                    <Rect
                      x={stationX - 100}
                      y={stationY}
                      width={200}
                      height={60}
                      rx={8}
                      fill={theme.dark ? '#2c3e50' : '#ecf0f1'}
                      stroke={theme.colors.primary}
                      strokeWidth={1}
                    />
                    
                    {/* Nazwa stacji */}
                   SvgText
  x={stationX}
  y={stationY + 40}
  textAnchor="middle"
  fontSize={10}
  fill={theme.colors.text}
>
  {station.level} cm {station.trendValue > 0 ? '↑' : station.trendValue < 0 ? '↓' : '→'}
</SvgText>                    
                    {/* Wskaźnik poziomu */}
                    <Rect
                      x={stationX - 80}
                      y={stationY + 30}
                      width={160}
                      height={10}
                      rx={5}
                      fill="#ddd"
                    />
                    
                    <Rect
                      x={stationX - 80}
                      y={stationY + 30}
                      width={160 * getLevelPercentage(station) / 100}
                      height={10}
                      rx={5}
                      fill={color}
                    />
                    
                    {/* Poziom wody */}
                    <SvgText
                      x={stationX}
                      y={stationY + 50}
                      textAnchor="middle"
                      fontSize={12}
                      fill={theme.colors.text}
                    >
                      {getLevelPercentage(station).toFixed(2)}% | {station.level} cm
                    </SvgText>
                  </G>
                </G>
              );
            })}
            
            {/* Dopływy */}
            {networkData.tributaries && networkData.tributaries.map((tributary, tributaryIndex) => {
              // Ustal punkt rozpoczęcia dopływu
              const mainStations = networkData.mainRiver.stations;
              // Każdy dopływ łączy się z inną stacją głównej rzeki
              const connectionIndex = Math.min(
                Math.floor((tributaryIndex / networkData.tributaries.length) * mainStations.length),
                mainStations.length - 1
              );
              
              const startY = 50 + connectionIndex * 120 + 30; // Środek stacji
              
              // Lewa lub prawa strona
              const direction = tributaryIndex % 2 === 0 ? -1 : 1; // -1 lewo, 1 prawo
              const startX = 500; // Środek głównej rzeki
              
              return (
                <G key={tributary.name}>
                  {/* Nazwa dopływu */}
                  <Rect
                    x={startX + direction * 200 - 75}
                    y={startY - 50}
                    width={150}
                    height={40}
                    rx={20}
                    fill={theme.colors.primary}
                  />
                  
                  <SvgText
                    x={startX + direction * 200}
                    y={startY - 25}
                    textAnchor="middle"
                    fontSize={14}
                    fontWeight="bold"
                    fill="white"
                  >
                    {tributary.name}
                  </SvgText>
                  
                  {/* Linia łącząca z główną rzeką */}
                  <Path
                    d={`M${startX} ${startY} L${startX + direction * 150} ${startY}`}
                    stroke={theme.colors.primary}
                    strokeWidth={2}
                  />
                  
                  {/* Stacje dopływu */}
                  {tributary.stations.map((station, stationIndex) => {
                    const stationX = startX + direction * (200 + stationIndex * 150);
                    const stationY = startY + (stationIndex * 60);
                    const color = getStatusColor(station);
                    
                    // Linia dopływu
                    const isFirstStation = stationIndex === 0;
                    
                    return (
                      <G key={station.id}>
                        {/* Linia rzeki */}
                        {isFirstStation ? (
                          <Path
                            d={`M${startX + direction * 150} ${startY} L${stationX} ${stationY}`}
                            stroke={theme.colors.primary}
                            strokeWidth={2}
                          />
                        ) : (
                          <Path
                            d={`M${startX + direction * (200 + (stationIndex - 1) * 150)} ${startY + ((stationIndex - 1) * 60) + 30} L${stationX} ${stationY}`}
                            stroke={theme.colors.primary}
                            strokeWidth={2}
                          />
                        )}
                        
                        {/* Stacja */}
                        <G onPress={() => handleStationPress(station)}>
                          <Rect
                            x={stationX - 60}
                            y={stationY}
                            width={120}
                            height={50}
                            rx={8}
                            fill={theme.dark ? '#2c3e50' : '#ecf0f1'}
                            stroke={theme.colors.primary}
                            strokeWidth={1}
                          />
                          
                          {/* Nazwa stacji */}
                          <SvgText
                            x={stationX}
                            y={stationY + 15}
                            textAnchor="middle"
                            fontSize={12}
                            fontWeight="bold"
                            fill={theme.colors.text}
                          >
                            {station.name}
                          </SvgText>
                          
                          {/* Wskaźnik poziomu */}
                          <Rect
                            x={stationX - 45}
                            y={stationY + 25}
                            width={90}
                            height={8}
                            rx={4}
                            fill="#ddd"
                          />
                          
                          <Rect
                            x={stationX - 45}
                            y={stationY + 25}
                            width={90 * getLevelPercentage(station) / 100}
                            height={8}
                            rx={4}
                            fill={color}
                          />
                          
                          {/* Poziom wody */}
                          <SvgText
                            x={stationX}
                            y={stationY + 40}
                            textAnchor="middle"
                            fontSize={10}
                            fill={theme.colors.text}
                          >
                            {station.level} cm
                          </SvgText>
                        </G>
                      </G>
                    );
                  })}
                </G>
              );
            })}
            
            {/* Punkt końcowy rzeki */}
            {networkData.mainRiver && networkData.mainRiver.stations.length > 0 && (
              <G>
                <Rect
                  x={425}
                  y={50 + networkData.mainRiver.stations.length * 120}
                  width={150}
                  height={60}
                  rx={8}
                  fill="#2E7D32"
                />
                <SvgText
                  x={500}
                  y={50 + networkData.mainRiver.stations.length * 120 + 35}
                  textAnchor="middle"
                  fontSize={16}
                  fontWeight="bold"
                  fill="white"
                >
                  {riverName}
                </SvgText>
              </G>
            )}
          </Svg>
        </ScrollView>
      </View>
      
      <View style={styles.legend}>
        <Text style={[styles.legendTitle, { color: theme.colors.text }]}>Legenda:</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
          <Text style={[styles.legendText, { color: theme.colors.text }]}>Stan normalny</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.warning }]} />
          <Text style={[styles.legendText, { color: theme.colors.text }]}>Stan ostrzegawczy</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.danger }]} />
          <Text style={[styles.legendText, { color: theme.colors.text }]}>Stan alarmowy</Text>
        </View>
      </View>
      
      <Text style={[styles.instruction, { color: theme.dark ? '#AAA' : '#666' }]}>
        Dotknij stacji, aby zobaczyć szczegóły
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  networkTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  networkContainer: {
    marginBottom: 20,
  },
  legend: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 20,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
  },
  instruction: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});

export default RiverNetworkView;