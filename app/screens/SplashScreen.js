// Plik: app/screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  StatusBar, 
  Dimensions,
  Image,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  // Animacje
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    // Sekwencja animacji
    Animated.sequence([
      // Logo fadeIn + scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ]),
      
      // Pojawienie się treści
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  const handleContinue = () => {
    // Animacja przycisku przy naciśnięciu
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Po zakończeniu animacji przycisku, przejdź do głównego ekranu
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
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
          {/* Logo animowane */}
          <Animated.View 
            style={[
              styles.logoContainer, 
              { 
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim }
                ] 
              }
            ]}
          >
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
          
          {/* Tytuł i slogan */}
          <Animated.View style={[
            styles.titleContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim }
              ]
            }
          ]}>
            <Text style={styles.title}>HydroApp</Text>
            <Text style={styles.slogan}>Aplikacja Przeciwpowodziowa</Text>
          </Animated.View>
          
          {/* Treść informacyjna */}
          <Animated.View style={[
            styles.infoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim }
              ]
            }
          ]}>
            <View style={styles.infoItem}>
              <Ionicons name="water-outline" size={24} color="white" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                Monitoruj stany rzek w czasie rzeczywistym
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="warning-outline" size={24} color="white" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                Bądź na bieżąco z ostrzeżeniami powodziowymi
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="cloud-done-outline" size={24} color="white" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                Dane dostarczane przez IMGW-PIB hydro.imgw.pl
              </Text>
            </View>
          </Animated.View>
          
          {/* Przycisk wejścia */}
          <Animated.View style={{
            transform: [{ scale: buttonScale }]
          }}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={handleContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Przejdź dalej</Text>
              <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
            </TouchableOpacity>
          </Animated.View>
          
          {/* Wersja aplikacji */}
          <Animated.View style={[styles.versionContainer, { opacity: fadeAnim }]}>
            <Text style={styles.versionText}>Wersja 1.0.0</Text>
          </Animated.View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 48,
    paddingBottom: 36,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 8,
  },
  slogan: {
    fontSize: 22,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  waveContainer: {
    alignItems: 'center',
    position: 'absolute',
    width: width,
    height: 100,
    top: height / 2 - 50,
    left: 0,
    zIndex: -1,
  },
  wave: {
    width: width * 1.5,
    height: 50,
    backgroundColor: 'rgba(64, 156, 255, 0.15)',
    borderRadius: 50,
  },
  infoContainer: {
    marginBottom: 30,
    marginTop: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
});