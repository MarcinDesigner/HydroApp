// Plik: app/components/RiverFlowView.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
      <View style={styles.headerContainer}>
        <View style={[styles.riverNameBox, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.riverNameText}>{riverName}</Text>
        </View>
      </View>
      
      {filteredStations.map((station, index) => {
        const levelPercentage = getLevelPercentage(station);
        const levelColor = getColorBasedOnPercentage(levelPercentage);
        
        return (
          <React.Fragment key={station.id}>
            {index > 0 && (
              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-down" size={24} color={theme.dark ? '#666' : '#999'} />
              </View>
            )}
            
            <TouchableOpacity
              style={[styles.stationBox, { backgroundColor: theme.dark ? '#2c3e50' : '#ecf0f1', borderColor: theme.colors.primary }]}
              onPress={() => handleStationPress(station)}
            >
              <Text style={[styles.stationName, { color: theme.colors.text }]}>{station.name}</Text>
              
              <View style={styles.levelIndicatorContainer}>
                <View style={styles.levelBar}>
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
                <Text style={[styles.levelText, { color: theme.colors.text }]}>
                  {levelPercentage}% | {station.level} cm
                </Text>
                <Text style={[styles.updateText, { color: theme.dark ? '#aaa' : '#777' }]}>
                  {station.updateTime} temu
                </Text>
              </View>
              
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.dark ? '#aaa' : '#777'} 
                style={styles.chevron}
              />
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
      
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
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  riverNameBox: {
    padding: 10,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  riverNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  arrowContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  stationBox: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  levelIndicatorContainer: {
    flex: 2,
    marginHorizontal: 10,
  },
  levelBar: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  levelFill: {
    height: '100%',
    borderRadius: 5,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  updateText: {
    fontSize: 12,
  },
  chevron: {
    marginLeft: 5,
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
});

export default RiverFlowView;