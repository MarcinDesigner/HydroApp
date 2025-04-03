// Plik: app/components/WaterConditionInfo.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WaterConditionInfo = ({ level, theme }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Ocena dla wędkarzy
  const getFishingCondition = (level) => {
    if (level < 80) return { status: 'Zbyt niski', color: 'orange', description: 'Woda często zbyt płytka, ryby mniej aktywne, dostęp do dobrych miejsc ograniczony' };
    if (level >= 100 && level <= 180) return { status: 'Dobry', color: 'green', description: 'Stabilny przepływ, dobre warunki do połowu z brzegu lub z łodzi' };
    if (level > 200) return { status: 'Zbyt wysoki', color: 'red', description: 'Trudny dostęp do brzegu, silniejszy nurt, ryby mniej przewidywalne' };
    return { status: 'Graniczny', color: 'yellow', description: 'Stan między poziomami, wymaga ostrożności' };
  };

  // Ocena dla kajakarzy
  const getCanoingCondition = (level) => {
    if (level < 60) return { status: 'Bardzo niski', color: 'orange', description: 'Konieczność przenoszenia kajaka, bardzo płytko' };
    if (level >= 80 && level <= 150) return { status: 'Optymalny', color: 'green', description: 'Wygodna i bezpieczna nawigacja, dobry przepływ' };
    if (level > 150 && level <= 180) return { status: 'Wysoki', color: 'yellow', description: 'Zwiększony nurt, zachować ostrożność' };
    if (level > 180) return { status: 'Niebezpieczny', color: 'red', description: 'Silny nurt, możliwe trudności, uważać na przeszkody' };
    return { status: 'Graniczny', color: 'yellow', description: 'Stan między poziomami, wymaga ostrożności' };
  };

  const fishingCondition = getFishingCondition(level);
  const canoingCondition = getCanoingCondition(level);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setShowDetails(!showDetails)}
      >
        <Text style={[styles.headerText, { color: theme.colors.text }]}>
          Warunki dla aktywności wodnych
        </Text>
        <Ionicons 
          name={showDetails ? "chevron-down-outline" : "chevron-up-outline"} 
          size={20} 
          color={theme.colors.text} 
        />
      </TouchableOpacity>

      {showDetails && (
        <View style={styles.detailsContainer}>
          {/* Sekcja dla wędkarzy */}
          <View style={styles.conditionSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Dla wędkarzy:
            </Text>
            <View style={styles.conditionRow}>
              <View style={[styles.statusBadge, { backgroundColor: fishingCondition.color }]}>
                <Text style={styles.statusText}>{fishingCondition.status}</Text>
              </View>
              <Text style={[styles.descriptionText, { color: theme.colors.text }]}>
                {fishingCondition.description}
              </Text>
            </View>
          </View>

          {/* Sekcja dla kajakarzy */}
          <View style={styles.conditionSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Dla kajakarzy:
            </Text>
            <View style={styles.conditionRow}>
              <View style={[styles.statusBadge, { backgroundColor: canoingCondition.color }]}>
                <Text style={styles.statusText}>{canoingCondition.status}</Text>
              </View>
              <Text style={[styles.descriptionText, { color: theme.colors.text }]}>
                {canoingCondition.description}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginTop: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailsContainer: {
    padding: 12,
  },
  conditionSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  descriptionText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  }
});

export default WaterConditionInfo;