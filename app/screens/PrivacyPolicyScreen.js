// Plik: app/screens/PrivacyPolicyScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function PrivacyPolicyScreen() {
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Polityka Prywatności</Text>
          <Text style={[styles.date, { color: theme.colors.caption }]}>Ostatnia aktualizacja: 11 kwietnia 2025</Text>
          
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Witamy w aplikacji Hydro. Nasza Polityka Prywatności wyjaśnia, jakie dane gromadzimy, w jaki sposób je wykorzystujemy i jak je chronimy.
          </Text>

          <Text style={[styles.header, { color: theme.colors.text }]}>1. Dane, które gromadzimy</Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            <Text style={styles.bold}>Dane dotyczące lokalizacji:</Text> Za Twoją zgodą możemy zbierać dane o lokalizacji w celu pokazywania najbliższych stacji hydrologicznych. Możesz w każdej chwili wyłączyć tę funkcję w ustawieniach aplikacji.
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            <Text style={styles.bold}>Dane o urządzeniu:</Text> Automatycznie zbieramy informacje o urządzeniu, takie jak model, system operacyjny, identyfikator urządzenia i dane dotyczące sieci.
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            <Text style={styles.bold}>Ulubione stacje:</Text> Przechowujemy listę Twoich ulubionych stacji do szybkiego dostępu. Te dane są przechowywane lokalnie na Twoim urządzeniu.
          </Text>

          <Text style={[styles.header, { color: theme.colors.text }]}>2. Jak wykorzystujemy dane</Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Wykorzystujemy zebrane informacje, aby:
          </Text>
          <Text style={[styles.bullet, { color: theme.colors.text }]}>• Dostarczać aktualne dane o poziomach wód i alertach powodziowych</Text>
          <Text style={[styles.bullet, { color: theme.colors.text }]}>• Personalizować listę stacji najbliższych Twojej lokalizacji</Text>
          <Text style={[styles.bullet, { color: theme.colors.text }]}>• Wysyłać powiadomienia o alertach hydrologicznych (tylko jeśli wyraziłeś zgodę)</Text>
          <Text style={[styles.bullet, { color: theme.colors.text }]}>• Poprawiać i optymalizować działanie aplikacji</Text>

          <Text style={[styles.header, { color: theme.colors.text }]}>3. Udostępnianie danych</Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Nie sprzedajemy ani nie udostępniamy Twoich danych osobowych stronom trzecim w celach marketingowych. Możemy udostępniać dane:
          </Text>
          <Text style={[styles.bullet, { color: theme.colors.text }]}>• Dostawcom usług, którzy pomagają nam obsługiwać aplikację</Text>
          <Text style={[styles.bullet, { color: theme.colors.text }]}>• Gdy jest to wymagane przez prawo lub w odpowiedzi na ważny proces prawny</Text>
          <Text style={[styles.bullet, { color: theme.colors.text }]}>• W celu ochrony bezpieczeństwa i integralności naszej aplikacji</Text>

          <Text style={[styles.header, { color: theme.colors.text }]}>4. Bezpieczeństwo danych</Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Stosujemy odpowiednie środki techniczne i organizacyjne, aby chronić Twoje dane przed nieuprawnionym dostępem, utratą lub modyfikacją. Większość danych przechowujemy lokalnie na Twoim urządzeniu.
          </Text>

          <Text style={[styles.header, { color: theme.colors.text }]}>5. Twoje prawa</Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            W zależności od Twojej lokalizacji, możesz mieć prawo do:
          </Text>
          <Text style={[styles.bullet, { color: theme.colors.text }]}>• Dostępu do swoich danych osobowych</Text>
          <Text style={[styles.bullet, { color: theme.colors.text }]}>• Poprawiania lub aktualizowania swoich danych</Text>
          <Text style={[styles.bullet, { color: theme.colors.text }]}>• Usunięcia swoich danych</Text>
          <Text style={[styles.bullet, { color: theme.colors.text }]}>• Ograniczenia przetwarzania</Text>
          <Text style={[styles.bullet, { color: theme.colors.text }]}>• Przenoszenia danych</Text>

          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Większość tych praw można zrealizować bezpośrednio z poziomu aplikacji, korzystając z opcji w ustawieniach.
          </Text>

          <Text style={[styles.header, { color: theme.colors.text }]}>6. Dzieci</Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Nasza aplikacja nie jest przeznaczona dla dzieci poniżej 13 roku życia i świadomie nie gromadzimy danych osobowych od dzieci poniżej tego wieku.
          </Text>

          <Text style={[styles.header, { color: theme.colors.text }]}>7. Zmiany w Polityce Prywatności</Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Możemy aktualizować naszą Politykę Prywatności od czasu do czasu. Poinformujemy Cię o wszelkich istotnych zmianach poprzez powiadomienie w aplikacji lub innymi odpowiednimi środkami.
          </Text>

          <Text style={[styles.header, { color: theme.colors.text }]}>8. Kontakt</Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            W przypadku pytań dotyczących naszej Polityki Prywatności lub sposobu, w jaki przetwarzamy Twoje dane, prosimy o kontakt pod adresem:
          </Text>
          <Text style={[styles.paragraph, { color: theme.colors.text, fontWeight: '500' }]}>
            kontakt@aplikacja-hydro.pl
          </Text>

          <Text style={[styles.footer, { color: theme.colors.caption }]}>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    paddingLeft: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    fontSize: 14,
    textAlign: 'center',
  },
});