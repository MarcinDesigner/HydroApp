// Plik: app/screens/HelpSupportScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function HelpSupportScreen() {
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

  const openPatronite = () => {
    Linking.openURL('https://patronite.pl/deximlabs.com');
  };

  const openEmail = () => {
    Linking.openURL('mailto:wsparcie@deximlabs.com?subject=Wsparcie%20aplikacji%20Hydro');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Ionicons name="help-buoy" size={50} color={theme.colors.primary} />
            <Text style={[styles.title, { color: theme.colors.text }]}>Pomoc i wsparcie</Text>
          </View>

          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Dziękujemy za korzystanie z aplikacji Hydro! Jeśli potrzebujesz pomocy lub chcesz wesprzeć dalszy rozwój aplikacji, 
            znajdziesz tutaj wszystkie potrzebne informacje.
          </Text>

          {/* Sekcja Najczęstsze pytania */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Najczęstsze pytania</Text>
          
          <View style={[styles.faqItem, { borderColor: theme.colors.border }]}>
            <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
              Jak dodać stację do ulubionych?
            </Text>
            <Text style={[styles.faqAnswer, { color: theme.colors.text }]}>
              Na ekranie szczegółów stacji, kliknij ikonę serca w prawym górnym rogu. Stacja pojawi się w zakładce "Ulubione".
            </Text>
          </View>

          <View style={[styles.faqItem, { borderColor: theme.colors.border }]}>
            <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
              Jak włączyć powiadomienia o alertach?
            </Text>
            <Text style={[styles.faqAnswer, { color: theme.colors.text }]}>
              Przejdź do zakładki "Ustawienia", a następnie włącz opcję "Powiadomienia" w sekcji "POWIADOMIENIA".
            </Text>
          </View>

          <View style={[styles.faqItem, { borderColor: theme.colors.border }]}>
            <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
              Jak często aktualizowane są dane o poziomach wód?
            </Text>
            <Text style={[styles.faqAnswer, { color: theme.colors.text }]}>
              Dane są aktualizowane automatycznie zgodnie z harmonogramem IMGW (zwykle co godzinę). Częstotliwość odświeżania danych w aplikacji możesz ustawić w zakładce "Ustawienia".
            </Text>
          </View>

          {/* Sekcja Kontakt */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Kontakt</Text>
          
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Masz pytanie, sugestię lub znalazłeś błąd w aplikacji? Skontaktuj się z nami:
          </Text>
          
          <TouchableOpacity 
            style={[styles.contactButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} 
            onPress={openEmail}
          >
            <Ionicons name="mail" size={24} color={theme.colors.primary} style={styles.buttonIcon} />
            <Text style={[styles.buttonText, { color: theme.colors.text }]}>wsparcie@deximlabs.com</Text>
          </TouchableOpacity>

          {/* Sekcja Wesprzyj nas */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Wesprzyj nas</Text>
          
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Aplikacja Hydro jest projektem non-profit, tworzonym z pasji do hydrologii i chęci dostarczania 
            użytecznych informacji społeczeństwu. Jeśli doceniasz naszą pracę i chciałbyś wesprzeć dalszy 
            rozwój aplikacji, możesz przekazać darowiznę przez platformę Patronite.
          </Text>

          <TouchableOpacity 
            style={[styles.patroniteButton, { backgroundColor: theme.colors.primary }]} 
            onPress={openPatronite}
          >
            <Ionicons name="heart" size={24} color="white" style={styles.buttonIcon} />
            <Text style={styles.patroniteButtonText}>Wesprzyj nas przez Patronite</Text>
          </TouchableOpacity>

          <View style={styles.benefitsContainer}>
            <Text style={[styles.benefitsTitle, { color: theme.colors.text }]}>
              Na co przeznaczamy środki?
            </Text>
            <View style={styles.benefitItem}>
              <Ionicons name="server-outline" size={20} color={theme.colors.primary} style={styles.benefitIcon} />
              <Text style={[styles.benefitText, { color: theme.colors.text }]}>
                Utrzymanie serwerów i infrastruktury
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="construct-outline" size={20} color={theme.colors.primary} style={styles.benefitIcon} />
              <Text style={[styles.benefitText, { color: theme.colors.text }]}>
                Rozwój nowych funkcji aplikacji
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="analytics-outline" size={20} color={theme.colors.primary} style={styles.benefitIcon} />
              <Text style={[styles.benefitText, { color: theme.colors.text }]}>
                Poprawę dokładności prognoz i analiz
              </Text>
            </View>
          </View>

          <Text style={[styles.thankyouText, { color: theme.colors.text }]}>
            Dziękujemy za wsparcie! ❤️
          </Text>

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
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 16,
  },
  faqItem: {
    borderLeftWidth: 3,
    paddingLeft: 14,
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 15,
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  patroniteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  patroniteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  benefitsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitIcon: {
    marginRight: 10,
  },
  benefitText: {
    fontSize: 15,
    lineHeight: 22,
  },
  thankyouText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 24,
  },
  copyright: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});