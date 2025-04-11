// Plik: app/screens/RiversScreen.js
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
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useRefresh } from '../context/RefreshContext';
import { fetchStations } from '../api/stationsApi';
import OdraRiverSystem from '../components/OdraRiverSystem';

const RiversScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { isRefreshing, addListener, removeListener } = useRefresh();
  const [selectedRiver, setSelectedRiver] = useState('Odra');
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dodajemy useEffect dla przycisku powrotu
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
  <TouchableOpacity 
    onPress={() => navigation.goBack()} 
    style={{ marginLeft: 10 }}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Ionicons name="arrow-back" size={24} color="white" />
  </TouchableOpacity>
),
      title: "Rzeki"
    });
  }, [navigation]);

  // Pobieranie danych
  useEffect(() => {
    loadStations();

    // Rejestrujemy funkcję odświeżania
    const onRefreshCallback = () => {
      loadStations(true);
    };

    addListener(onRefreshCallback);

    return () => {
      removeListener(onRefreshCallback);
    };
  }, []);

  const loadStations = async (silent = false) => {
    try {
      if (!silent) {
        setRefreshing(true);
      }
      
      const data = await fetchStations();
      setStations(data);
      
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
      }
    } catch (error) {
      console.error('Błąd podczas ładowania stacji:', error);
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  // Lista dostępnych rzek do wyboru
  const riverSystems = [
    {
      id: 'odra',
      name: 'Odra',
      description: 'System rzeczny Odry i głównych dopływów'
    },
    // Tutaj możemy dodać więcej systemów rzecznych w przyszłości
  ];

  const renderRiverSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={[styles.selectorTitle, {color: theme.colors.text}]}>
        Wybierz system rzeczny:
      </Text>
      <View style={styles.riverButtons}>
        {riverSystems.map(river => (
          <TouchableOpacity
            key={river.id}
            style={[
              styles.riverButton,
              selectedRiver === river.name && {
                backgroundColor: theme.colors.primary
              }
            ]}
            onPress={() => setSelectedRiver(river.name)}
          >
            <Text
              style={[
                styles.riverButtonText,
                selectedRiver === river.name ? { color: 'white' } : { color: theme.colors.text }
              ]}
            >
              {river.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderRiverDescription = () => {
    const selectedRiverSystem = riverSystems.find(river => river.name === selectedRiver);
    
    return (
      <View style={[styles.descriptionContainer, {backgroundColor: theme.colors.card}]}>
        <Text style={[styles.descriptionText, {color: theme.colors.text}]}>
          {selectedRiverSystem?.description || 'System rzeczny'}
        </Text>
      </View>
    );
  };

  const renderRiverSystem = () => {
    switch(selectedRiver) {
      case 'Odra':
        return <OdraRiverSystem stations={stations} theme={theme} />;
      default:
        return (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: theme.colors.text}]}>
              Wybierz system rzeczny do wyświetlenia
            </Text>
          </View>
        );
    }
  };

  return (
    <ScrollView 
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      contentContainerStyle={styles.scrollContent}
    >
      {renderRiverSelector()}
      {renderRiverDescription()}
      {renderRiverSystem()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  selectorContainer: {
    marginBottom: 16,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  riverButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  riverButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  riverButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  }
});

export default RiversScreen;