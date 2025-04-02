import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StationInfo({ station, theme }) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const maxLevel = Math.max(station.level, station.alarmLevel * 1.5, 250);
    const levelPercentage = Math.min(100, (station.level / maxLevel) * 100);

    Animated.timing(animatedWidth, {
      toValue: levelPercentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [station.level]);

  const getLevelIndicator = () => {
    const maxLevel = Math.max(station.level, station.alarmLevel * 1.5, 250);
    const warningPercentage = (station.warningLevel / maxLevel) * 100;
    const alarmPercentage = (station.alarmLevel / maxLevel) * 100;

    let color;
    if (station.level >= station.alarmLevel) {
      color = theme.colors.danger;
    } else if (station.level >= station.warningLevel) {
      color = theme.colors.warning;
    } else {
      color = theme.colors.safe;
    }

    return (
      <View style={styles.levelIndicatorContainer}>
        <View style={styles.levelIndicatorBackground}>
          <Animated.View
            style={[
              styles.levelIndicatorFill,
              {
                width: animatedWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: color,
              },
            ]}
          />
          <View style={[styles.markerAbsolute, { left: `${warningPercentage}%` }]}>
            <View style={[styles.marker, { backgroundColor: theme.colors.warning }]} />
          </View>
          <View style={[styles.markerAbsolute, { left: `${alarmPercentage}%` }]}>
            <View style={[styles.marker, { backgroundColor: theme.colors.danger }]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <View style={styles.riverInfo}>
          <View style={styles.row}>
            <Ionicons name="water" size={18} color={theme.colors.primary} />
            <Text style={[styles.riverName, { color: theme.colors.text }]}>
              {station.river}
            </Text>
          </View>
          {station.wojewodztwo && (
            <View style={styles.row}>
              <Text style={[styles.wojewodztwoName, { color: theme.colors.text }]}>
                {station.wojewodztwo}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.updateContainer}>
          <Text style={[styles.updateTime, { color: theme.dark ? '#AAA' : '#666' }]}>
            Pomiar: {station.fullUpdateTime || station.updateTime}
          </Text>
          {station.lastRefresh && (
            <Text style={[styles.refreshTime, { color: theme.dark ? '#AAA' : '#666' }]}>
              Ostatnie odświeżenie: {new Date(station.lastRefresh).toLocaleTimeString('pl-PL')}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.levelContainer}>
        <Text style={[styles.levelValue, { color: theme.colors.text }]}>
          {station.level}
        </Text>
        <Text style={[styles.levelUnit, { color: theme.colors.text }]}>cm</Text>
      </View>

      <View style={styles.trendContainer}>
        <Ionicons
          name={
            station.trend === 'up'
              ? 'arrow-up'
              : station.trend === 'down'
              ? 'arrow-down'
              : 'remove'
          }
          size={18}
          color={
            station.trend === 'up'
              ? theme.colors.danger
              : station.trend === 'down'
              ? theme.colors.safe
              : theme.colors.text
          }
        />
        <Text
          style={[
            styles.trendText,
            {
              color:
                station.trend === 'up'
                  ? theme.colors.danger
                  : station.trend === 'down'
                  ? theme.colors.safe
                  : theme.colors.text,
            },
          ]}
        >
          {station.trendValue > 0 ? '+' : ''}
          {station.trendValue} cm / 24h
          {station.trend === 'stable'
            ? ' (stabilny)'
            : station.trend === 'up'
            ? ' (wzrost)'
            : ' (spadek)'}
        </Text>
      </View>

      {getLevelIndicator()}

      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: theme.colors.warning,
                marginRight: 6,
              }}
            />
            <Text style={[styles.statusLabel, { color: theme.colors.text }]}>Stan ostrzegawczy:</Text>
          </View>
          <Text style={[styles.statusValue, { color: theme.colors.text }]}>
            {station.warningLevel} cm
          </Text>
        </View>

        <View style={styles.statusItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: theme.colors.danger,
                marginRight: 6,
              }}
            />
            <Text style={[styles.statusLabel, { color: theme.colors.text }]}>Stan alarmowy:</Text>
          </View>
          <Text style={[styles.statusValue, { color: theme.colors.text }]}>
            {station.alarmLevel} cm
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  riverInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wojewodztwoName: {
    fontSize: 13,
    marginLeft: 4,
  },
  riverName: {
    fontSize: 16,
    marginLeft: 6,
  },
  updateContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  updateTime: {
    fontSize: 12,
  },
  refreshTime: {
    fontSize: 11,
    marginTop: 2,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  levelValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  levelUnit: {
    fontSize: 18,
    marginBottom: 8,
    marginLeft: 6,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trendText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },
  levelIndicatorContainer: {
    marginBottom: 16,
  },
  levelIndicatorBackground: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  levelIndicatorFill: {
    height: '100%',
    borderRadius: 6,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  markerAbsolute: {
    position: 'absolute',
    top: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 2,
  },
  marker: {
    width: 2,
    height: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusItem: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});