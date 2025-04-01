// Plik: app/screens/WidgetScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import StationWidget from '../widgets/StationWidget';

const WidgetScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  useEffect(() => {
    // Dodawanie przycisku powrotu w nagłówku
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 8 }}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Zarządzanie widgetem
      </Text>
      
      <Text style={[styles.description, { color: theme.colors.text }]}>
        Dodaj widget stacji hydrologicznej do ekranu głównego, aby monitorować stan wody w wybranej stacji.
      </Text>
      
      {/* StationWidget jest teraz bezpośrednio w ScrollView */}
      <StationWidget />
      
      <View style={styles.helpContainer}>
        <Text style={[styles.helpTitle, { color: theme.colors.text }]}>
          Potrzebujesz pomocy?
        </Text>
        
        <View style={[styles.helpItem, { borderColor: theme.colors.border }]}>
          <Ionicons name="help-circle" size={24} color={theme.colors.primary} style={styles.helpIcon} />
          <Text style={[styles.helpText, { color: theme.colors.text }]}>
            Jeśli widget nie jest widoczny po dodaniu, spróbuj ponownie zaktualizować dane lub zrestartować urządzenie.
          </Text>
        </View>
        
        <View style={[styles.helpItem, { borderColor: theme.colors.border }]}>
          <Ionicons name="refresh" size={24} color={theme.colors.primary} style={styles.helpIcon} />
          <Text style={[styles.helpText, { color: theme.colors.text }]}>
            Widget aktualizuje się automatycznie co 30 minut. Możesz również zaktualizować go ręcznie, naciskając ten ekran.
          </Text>
        </View>
        
        <View style={[styles.helpItem, { borderColor: theme.colors.border }]}>
          <Ionicons name="settings" size={24} color={theme.colors.primary} style={styles.helpIcon} />
          <Text style={[styles.helpText, { color: theme.colors.text }]}>
            Możesz zmienić stację wyświetlaną na widgecie w dowolnym momencie na tym ekranie.
          </Text>
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
    paddingBottom: 40, // Dodatkowy padding na dole, aby zapewnić miejsce do przewijania
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  helpContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  helpIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default WidgetScreen;