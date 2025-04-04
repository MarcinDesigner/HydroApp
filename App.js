// Plik: App.js - dodanie nowego ekranu Rzeki
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Konteksty
import { ThemeProvider } from './app/context/ThemeContext';
import { FavoritesProvider } from './app/context/FavoritesContext';
import { RefreshProvider } from './app/context/RefreshContext';

// Ekrany
import SplashScreen from './app/screens/SplashScreen';
import HomeScreen from './app/screens/HomeScreen';
import MapScreen from './app/screens/MapScreen';
import StationDetails from './app/screens/StationDetails';
import SettingsScreen from './app/screens/SettingsScreen';
import FavoritesScreen from './app/screens/FavoritesScreen';
import AlertsScreen from './app/screens/AlertsScreen';
import RiversScreen from './app/screens/RiversScreen'; // Nowy ekran Rzeki
import WidgetScreen from './app/screens/WidgetScreen';

// Jeśli używasz danych hydrologicznych z pliku constants
import { findStationLevels } from './app/constants/hydroLevels';
import { useWidgetListener } from './app/services/widgetListener';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'water' : 'water-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Alerts') {
            iconName = focused ? 'warning' : 'warning-outline';
          } else if (route.name === 'Rivers') {
            iconName = focused ? 'git-network' : 'git-network-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#1E88E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Stacje wodne' }} 
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ title: 'Mapa' }} 
      />
      <Tab.Screen 
        name="Rivers" 
        component={RiversScreen} 
        options={{ title: 'Rzeki' }} 
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ title: 'Ulubione' }} 
      />
      <Tab.Screen 
        name="Alerts" 
        component={AlertsScreen} 
        options={{ title: 'Alerty' }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
 
  useEffect(() => {
    console.log('Inicjalizacja aplikacji...');
    // Możesz tutaj dodać kod inicjalizacji danych, jeśli jest potrzebny
  }, []);
  
  // Nasłuchiwanie zdarzeń związanych z widgetami
  useWidgetListener(null, (stationData) => {
    console.log('Widget został odświeżony:', stationData?.name);
  });

  return (
    <ThemeProvider>
      <FavoritesProvider>
        <RefreshProvider>
          <SafeAreaProvider>
            <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
            <NavigationContainer>
              <Stack.Navigator 
                initialRouteName="Splash"
                screenOptions={{
                  headerStyle: {
                    backgroundColor: '#1E88E5',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              >
                <Stack.Screen 
                  name="Splash" 
                  component={SplashScreen} 
                  options={{ headerShown: false }} 
                />
                <Stack.Screen 
                  name="Main" 
                  component={MainTabs} 
                  options={{ headerShown: false }} 
                />
                <Stack.Screen 
                  name="StationDetails" 
                  component={StationDetails} 
                  options={({ route }) => ({ title: route.params?.stationName || 'Szczegóły stacji' })} 
                />
                <Stack.Screen 
                  name="Settings" 
                  component={SettingsScreen} 
                  options={{ title: 'Ustawienia' }} 
                />
                <Stack.Screen 
                  name="Widget" 
                  component={WidgetScreen} 
                  options={{ title: 'Widget' }} 
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </RefreshProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}