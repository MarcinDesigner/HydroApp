// Plik: app/components/RiverFlowView.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const RiverFlowView = ({ stations, riverName }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [filteredStations, setFilteredStations] = useState([]);

  useEffect(() => {
    // Filtruj stacje dla wybranej rzeki i sortuj je
    if (stations && stations.length > 0 && riverName) {
      console.log(`Filtrowanie stacji dla rzeki: ${riverName}, liczba stacji: ${stations.length}`);
      const riverStations = stations
        .filter(station => station.river === riverName)
        .sort((a, b) => a.name.localeCompare(b.name));
      
      console.log(`Znaleziono ${riverStations.length} stacji dla rzeki ${riverName}`);
      setFilteredStations(riverStations);
    } else {
      console.log('Brak stacji lub nazwy rzeki');
      setFilteredStations([]);
    }
  }, [stations, riverName]);

  const getStatusColor = (station) => {
    // Kolor bazujący na statusie stacji
    switch(station.status) {
      case 'alarm': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      default: return '#4CAF50'; // zielony dla normalnego stanu
    }
  };
  
  useEffect(() => {
  // Filtruj stacje dla wybranej rzeki i sortuj je
  if (stations && stations.length > 0 && riverName) {
    console.log(`Filtrowanie stacji dla rzeki: ${riverName}, liczba stacji: ${stations.length}`);
    
    // Najpierw dokładne dopasowanie
    let riverStations = stations.filter(station => 
      station.river && station.river.toLowerCase() === riverName.toLowerCase()
    );
    
    // Jeśli nie znaleziono żadnych wyników, spróbuj częściowego dopasowania
    if (riverStations.length === 0) {
      riverStations = stations.filter(station => 
        station.river && 
        (station.river.toLowerCase().includes(riverName.toLowerCase()) || 
         riverName.toLowerCase().includes(station.river.toLowerCase()))
      );
    }
    
    // Sortuj stacje według nazwy
    const sortedStations = riverStations.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`Znaleziono ${sortedStations.length} stacji dla rzeki ${riverName}`);
    setFilteredStations(sortedStations);
  } else {
    console.log('Brak stacji lub nazwy rzeki');
    setFilteredStations([]);
  }
}, [stations, riverName]);
  
  // Funkcja pomocnicza do określania wypełnienia wskaźnika poziomu
  const getLevelPercentage = (station) => {
    // Jeśli nie mamy wartości stanu alarmowego/ostrzegawczego, używamy prostej skali
    // W prawdziwej implementacji powinniśmy użyć danych o stanach ostrzegawczych
    const maxLevel = 500; // przykładowa wartość maksymalna
    const percentage = (station.level / maxLevel) * 100;
    return Math.min(percentage, 100).toFixed(2);
  };

  const getColorBasedOnPercentage = (percentage) => {
    const numPercentage = parseFloat(percentage);
    if (numPercentage > 60) return theme.colors.danger;
    if (numPercentage > 30) return theme.colors.warning;
    return '#4CAF50'; // zielony dla niskich wartości
  };

  const handleStationPress = (station) => {
    navigation.navigate('StationDetails', { 
      stationId: station.id,
      stationName: station.name
    });
  };

  if (filteredStations.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="water-outline" size={64} color={theme.dark ? '#555' : '#CCC'} />
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
    >
      {/* Nagłówek z nazwą rzeki */}
      <View style={styles.headerContainer}>
        <View style={[styles.riverNameBox, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="water" size={24} color="white" style={styles.riverIcon} />
          <Text style={styles.riverNameText}>{riverName}</Text>
        </View>
      </View>
      
      {/* Wizualny przepływ rzeki */}
      <View style={[styles.riverFlowContainer, { borderColor: theme.colors.primary }]}>
        {filteredStations.map((station, index) => {
          const levelPercentage = getLevelPercentage(station);
          const levelColor = getColorBasedOnPercentage(levelPercentage);
          
          return (
            <React.Fragment key={station.id}>
              {/* Łączniki między stacjami */}
              {index > 0 && (
                <View style={styles.connectorContainer}>
                  <View style={[styles.connector, { backgroundColor: theme.colors.primary }]} />
                  <Ionicons 
                    name="arrow-down" 
                    size={24} 
                    color={theme.colors.primary} 
                    style={styles.arrowIcon}
                  />
                </View>
              )}
              
              {/* Stacja pomiarowa */}
              <TouchableOpacity
                style={[
                  styles.stationBox, 
                  { 
                    backgroundColor: theme.dark ? '#2c3e50' : '#fff',
                    borderColor: levelColor,
                    shadowColor: theme.dark ? '#000' : '#666'
                  }
                ]}
                onPress={() => handleStationPress(station)}
              >
                <View style={styles.stationHeader}>
                  <Text style={[styles.stationName, { color: theme.colors.text }]}>{station.name}</Text>
                  <View style={[styles.statusDot, { backgroundColor: levelColor }]} />
                </View>
                
                <View style={styles.levelIndicatorContainer}>
                  <View style={[styles.levelBar, { backgroundColor: theme.dark ? '#444' : '#f0f0f0' }]}>
                    <View 
                      style={[
                        styles.levelFill, 
                        { 
                          width: `${levelPercentage}%`,
                          backgroundColor: levelColor
                        }
                      ]} 
                    />
                  </View>
                  
                  <View style={styles.levelInfoContainer}>
                    <Text style={[styles.levelText, { color: theme.colors.text }]}>
                      {station.level} cm
                    </Text>
                    <Text style={[styles.percentageText, { color: levelColor }]}>
                      {levelPercentage}%
                    </Text>
                  </View>
                  
                  <Text style={[styles.updateText, { color: theme.dark ? '#aaa' : '#777' }]}>
                    {station.updateTime}
                  </Text>
                </View>
                
                <View style={styles.detailsRow}>
                  <View style={styles.trendContainer}>
                  <Ionicons 
                    name={
                    station.trend === 'up' ? 'arrow-up' : 
                    station.trend === 'down' ? 'arrow-down' : 'remove'
                    } 
                    size={16} 
                    color={
                      station.trend === 'up' ? theme.colors.danger : 
                      station.trend === 'down' ? '#4CAF50' : theme.dark ? '#aaa' : '#777'
                    } 
                  />
                  <Text style={[
                    styles.trendText, 
                    { 
                      color: station.trend === 'up' ? theme.colors.danger : 
                            station.trend === 'down' ? '#4CAF50' : theme.dark ? '#aaa' : '#777'
                    }
                  ]}>
                    {station.trendValue > 0 ? '+' : ''}{station.trendValue} cm
                    {station.trend === 'stable' ? ' (stabilny)' : 
                     station.trend === 'up' ? ' (wzrost)' : 
                     ' (spadek)'}
                  </Text>
                </View>
                  
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={theme.colors.primary} 
                    style={styles.chevron}
                  />
                </View>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>
      
      {/* Wizualizacja ujścia rzeki */}
      <View style={styles.riverEndContainer}>
        <View style={[styles.riverEndLine, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.riverEnd, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="water" size={24} color="white" />
          <Text style={styles.riverEndText}>Ujście rzeki {riverName}</Text>
        </View>
      </View>
      
      {/* Legenda */}
      <View style={[styles.legend, { backgroundColor: theme.dark ? '#222' : '#f5f5f5' }]}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
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
    marginTop: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  riverNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  riverIcon: {
    marginRight: 8,
  },
  riverNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  riverFlowContainer: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 0,
  },
  connectorContainer: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'space-between',
  },
  connector: {
    width: 4,
    height: 20,
  },
  arrowIcon: {
    marginVertical: 2,
  },
  stationBox: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  levelIndicatorContainer: {
    marginBottom: 12,
  },
  levelBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  levelFill: {
    height: '100%',
    borderRadius: 6,
  },
  levelInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '700',
  },
  updateText: {
    fontSize: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    marginLeft: 4,
  },
  chevron: {
    marginLeft: 5,
  },
  riverEndContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  riverEndLine: {
    width: 4,
    height: 24,
  },
  riverEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  riverEndText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  legend: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 24,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    fontSize: 15,
  },
});

export default RiverFlowView;