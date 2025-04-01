// Plik: app/screens/SplashScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  StatusBar, 
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  const handleContinue = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };
  
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../assets/flood-background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>HydroApp</Text>
            <Text style={styles.slogan}>Aplikacja Przeciwpowodziowa</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Przejdź dalej</Text>
            <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
          </TouchableOpacity>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Monitoruj stany rzek w czasie rzeczywistym
            </Text>
            <Text style={styles.infoText}>
              Bądź na bieżąco z ostrzeżeniami powodziowymi
            </Text>
            <Text style={styles.infoText}>
              Dane dostarczane przez IMGW-PIB hydro.imgw.pl
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 58,
    paddingBottom: 48,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 16,
  },
  slogan: {
    fontSize: 24,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});