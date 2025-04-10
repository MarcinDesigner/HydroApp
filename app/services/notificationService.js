// Plik: app/services/notificationService.js (zmodyfikowany)
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sprawdź czy Notifications są dostępne
const isNotificationsAvailable = () => {
  return Notifications && typeof Notifications.setNotificationHandler === 'function';
};

// Konfiguracja obsługi powiadomień
if (isNotificationsAvailable()) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

// Funkcja do rejestracji tokenu powiadomień
export const registerForPushNotificationsAsync = async () => {
  try {
    if (!isNotificationsAvailable()) {
      console.log('Powiadomienia nie są dostępne w tym środowisku');
      return false;
    }

    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Nie uzyskano pozwolenia na powiadomienia!');
        return false;
      }
      
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const token = tokenData?.data;
        
        if (token) {
          await AsyncStorage.setItem('notification_token', token);
          console.log('Token powiadomień:', token);
          return true;
        } else {
          console.log('Nie można uzyskać tokenu');
          return false;
        }
      } catch (tokenError) {
        console.error('Błąd podczas uzyskiwania tokenu:', tokenError);
        return false;
      }
    } else {
      console.log('Powiadomienia push wymagają fizycznego urządzenia');
      return false;
    }
  } catch (error) {
    console.error('Błąd podczas rejestracji powiadomień:', error);
    return false;
  }
};

// Pozostałe funkcje również zabezpiecz sprawdzaniem dostępności
export const sendLocalNotification = async (title, body, data = {}) => {
  try {
    if (!isNotificationsAvailable()) {
      console.log('Powiadomienia nie są dostępne w tym środowisku');
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // natychmiastowe powiadomienie
    });
    
    console.log('Wysłano powiadomienie:', title);
    return true;
  } catch (error) {
    console.error('Błąd podczas wysyłania powiadomienia:', error);
    return false;
  }
};

export const cancelAllScheduledNotifications = async () => {
  try {
    if (!isNotificationsAvailable()) {
      console.log('Powiadomienia nie są dostępne w tym środowisku');
      return false;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Wyczyszczono wszystkie zaplanowane powiadomienia');
    return true;
  } catch (error) {
    console.error('Błąd podczas czyszczenia powiadomień:', error);
    return false;
  }
};