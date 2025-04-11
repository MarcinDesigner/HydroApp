// Plik: app/screens/AboutScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function AboutScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{ marginLeft: 10 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.headerText || 'white'} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme]);

  const openWebsite = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Nie można otworzyć URL: " + url);
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Ionicons name="water" size={60} color={theme.colors.primary} />
            <Text style={[styles.appName, { color: theme.colors.text }]}>Hydro</Text>
            <Text style={[styles.appVersion, { color: theme.colors.caption }]}>Wersja 1.0.1</Text>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>O aplikacji</Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Aplikacja Hydro to mobilne narzędzie do monitorowania stanu rzek i poziomów wód w Polsce. 
            Nasza aplikacja dostarcza aktualne dane hydrologiczne, ostrzeżenia powodziowe i informacje o stanie wód 
            z oficjalnych źródeł, prezentując je w przystępny i intuicyjny sposób.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Funkcje</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="location" size={24} color={theme.colors.primary} style={styles.featureIcon} />
              <View style={styles.featureTextContainer}>
                <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Mapa stacji</Text>
                <Text style={[styles.featureDescription, { color: theme.colors.text }]}>
                  Interaktywna mapa wszystkich stacji pomiarowych w Polsce z kolorowym oznaczeniem ich stanu.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="analytics" size={24} color={theme.colors.primary} style={styles.featureIcon} />
              <View style={styles.featureTextContainer}>
                <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Wykresy i trendy</Text>
                <Text style={[styles.featureDescription, { color: theme.colors.text }]}>
                  Szczegółowe wykresy poziomów wód z ostatnich godzin, dni i tygodni.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="warning" size={24} color={theme.colors.primary} style={styles.featureIcon} />
              <View style={styles.featureTextContainer}>
                <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Alerty i ostrzeżenia</Text>
                <Text style={[styles.featureDescription, { color: theme.colors.text }]}>
                  Powiadomienia o przekroczeniu stanów ostrzegawczych i alarmowych.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="heart" size={24} color={theme.colors.primary} style={styles.featureIcon} />
              <View style={styles.featureTextContainer}>
                <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Ulubione stacje</Text>
                <Text style={[styles.featureDescription, { color: theme.colors.text }]}>
                  Możliwość zapisywania ulubionych stacji dla szybkiego dostępu.
                </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Źródła danych</Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Aplikacja korzysta z danych udostępnianych przez Instytut Meteorologii i Gospodarki Wodnej (IMGW) 
            poprzez publiczne API. Dane są aktualizowane regularnie zgodnie z harmonogramem IMGW.
          </Text>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.primary }]} 
            onPress={() => openWebsite('https://imgw.pl')}
          >
            <Text style={styles.buttonText}>Odwiedź stronę IMGW</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Kontakt</Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            W przypadku pytań, sugestii lub zgłaszania problemów, skontaktuj się z nami:
          </Text>
          <Text style={[styles.contactInfo, { color: theme.colors.text }]}>
            E-mail: kontakt@aplikacja-hydro.pl
          </Text>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.primary }]} 
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Text style={styles.buttonText}>Polityka Prywatności</Text>
          </TouchableOpacity>

          <Text style={[styles.copyright, { color: theme.colors.caption }]}>
            © 2025 Aplikacja Hydro. Wszelkie prawa zastrzeżone.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  appLogo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  appVersion: {
    fontSize: 14,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  featuresList: {
    marginTop: 8,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactInfo: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
  },
  copyright: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
});