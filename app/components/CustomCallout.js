// Plik: app/components/CustomCallout.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomCallout({ station }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'alarm': return '#F44336';
      case 'warning': return '#FFC107';
      case 'normal': return '#4CAF50';
      default: return '#2196F3';
    }
  };
  
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.title}>{station.name}</Text>
        <Text style={styles.river}>{station.river}</Text>
        
        <View style={styles.levelRow}>
          <Text style={styles.levelValue}>{station.level} cm</Text>
          <Text 
            style={[
              styles.trend, 
              { 
                color: station.trend === 'up' 
                  ? '#F44336' 
                  : station.trend === 'down' 
                    ? '#4CAF50' 
                    : '#757575'
              }
            ]}
          >
  {getTrendIcon(station.trend)} {station.trendValue > 0 ? '+' : ''}{station.trendValue} cm
          </Text>
        </View>
        
        <View 
          style={[
            styles.statusIndicator, 
            { backgroundColor: getStatusColor(station.status) }
          ]}
        />
      </View>
      <View style={styles.arrowBorder} />
      <View style={styles.arrow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  bubble: {
    width: 150,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderColor: '#CCCCCC',
    borderWidth: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  river: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 6,
  },
  levelRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  trend: {
    fontSize: 14,
  },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#FFFFFF',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#CCCCCC',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
  },
});