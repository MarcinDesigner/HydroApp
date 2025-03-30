// Plik: app/api/stationsApi.js
// Symulowane API do pobrania danych o stacjach

export const fetchStations = () => {
  // Symulacja opóźnienia sieciowego
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Płock',
          level: 342,
          status: 'alarm',
          trend: 'up',
          trendValue: 15,
          updateTime: '14:30',
          river: 'Wisła',
          latitude: 52.5463,
          longitude: 19.7065,
        },
        {
          id: 2,
          name: 'Warszawa',
          level: 258,
          status: 'warning',
          trend: 'up',
          trendValue: 8,
          updateTime: '14:45',
          river: 'Wisła',
          latitude: 52.2297,
          longitude: 21.0122,
        },
        {
          id: 3,
          name: 'Kraków',
          level: 187,
          status: 'normal',
          trend: 'down',
          trendValue: 3,
          updateTime: '14:15',
          river: 'Wisła',
          latitude: 50.0647,
          longitude: 19.9450,
        },
        {
          id: 4,
          name: 'Wrocław',
          level: 224,
          status: 'normal',
          trend: 'stable',
          trendValue: 0,
          updateTime: '14:00',
          river: 'Odra',
          latitude: 51.1079,
          longitude: 17.0385,
        },
        {
          id: 5,
          name: 'Opole',
          level: 265,
          status: 'warning',
          trend: 'down',
          trendValue: 4,
          updateTime: '14:10',
          river: 'Odra',
          latitude: 50.6751,
          longitude: 17.9213,
        },
      ]);
    }, 1000);
  });
};

export const fetchStationDetails = (stationId) => {
  // Symulacja opóźnienia sieciowego
  return new Promise((resolve) => {
    setTimeout(() => {
      // Dane symulowane dla różnych stacji
      const stations = {
        1: { // Płock
          id: 1,
          name: 'Płock',
          level: 342,
          status: 'alarm',
          trend: 'up',
          trendValue: 15,
          updateTime: '14:30',
          river: 'Wisła',
          latitude: 52.5463,
          longitude: 19.7065,
          alarmLevel: 320,
          warningLevel: 290,
          chartData: {
            '24h': {
              labels: ['8:00', '12:00', '16:00', '20:00', '0:00', '4:00', '8:00'],
              values: [312, 318, 325, 330, 335, 338, 342],
            },
            '7d': {
              labels: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'],
              values: [280, 295, 305, 310, 322, 335, 342],
            },
            '30d': {
              labels: ['1', '5', '10', '15', '20', '25', '30'],
              values: [250, 260, 275, 290, 305, 320, 342],
            },
          },
          forecast: {
            today: 'Spodziewany jest dalszy wzrost poziomu wody o 5-10 cm.',
            tomorrow: 'Prognozowany początek stabilizacji poziomu wody.',
            week: 'W ciągu tygodnia możliwe stopniowe obniżenie poziomu wody.'
          },
          alerts: [
            {
              id: 1,
              type: 'alarm',
              message: 'Przekroczony stan alarmowy o 22 cm',
              time: '14:00, 30.03.2025'
            },
            {
              id: 2,
              type: 'info',
              message: 'Wprowadzono alarm przeciwpowodziowy w powiecie',
              time: '10:30, 30.03.2025'
            }
          ]
        },
        2: { // Warszawa
          id: 2,
          name: 'Warszawa',
          level: 258,
          status: 'warning',
          trend: 'up',
          trendValue: 8,
          updateTime: '14:45',
          river: 'Wisła',
          latitude: 52.2297,
          longitude: 21.0122,
          alarmLevel: 280,
          warningLevel: 240,
          chartData: {
            '24h': {
              labels: ['8:00', '12:00', '16:00', '20:00', '0:00', '4:00', '8:00'],
              values: [242, 245, 248, 250, 254, 256, 258],
            },
            '7d': {
              labels: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'],
              values: [220, 228, 234, 240, 245, 252, 258],
            },
            '30d': {
              labels: ['1', '5', '10', '15', '20', '25', '30'],
              values: [200, 210, 215, 225, 235, 245, 258],
            },
          },
          forecast: {
            today: 'Prognozowany dalszy wzrost poziomu wody.',
            tomorrow: 'Możliwe osiągnięcie stanu alarmowego.',
            week: 'Sytuacja hydrologiczna pozostanie napięta.'
          },
          alerts: [
            {
              id: 1,
              type: 'warning',
              message: 'Przekroczony stan ostrzegawczy o 18 cm',
              time: '14:30, 30.03.2025'
            }
          ]
        },
        3: { // Kraków
          id: 3,
          name: 'Kraków',
          level: 187,
          status: 'normal',
          trend: 'down',
          trendValue: 3,
          updateTime: '14:15',
          river: 'Wisła',
          latitude: 50.0647,
          longitude: 19.9450,
          alarmLevel: 250,
          warningLevel: 220,
          chartData: {
            '24h': {
              labels: ['8:00', '12:00', '16:00', '20:00', '0:00', '4:00', '8:00'],
              values: [195, 193, 191, 190, 189, 188, 187],
            },
            '7d': {
              labels: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'],
              values: [210, 205, 200, 196, 192, 189, 187],
            },
            '30d': {
              labels: ['1', '5', '10', '15', '20', '25', '30'],
              values: [230, 225, 218, 210, 200, 195, 187],
            },
          },
          forecast: {
            today: 'Przewidywana dalsza stabilizacja poziomu wody.',
            tomorrow: 'Możliwe niewielkie spadki poziomu wody.',
            week: 'Sytuacja hydrologiczna stabilna.'
          },
          alerts: []
        },
        4: { // Wrocław
          id: 4,
          name: 'Wrocław',
          level: 224,
          status: 'normal',
          trend: 'stable',
          trendValue: 0,
          updateTime: '14:00',
          river: 'Odra',
          latitude: 51.1079,
          longitude: 17.0385,
          alarmLevel: 300,
          warningLevel: 270,
          chartData: {
            '24h': {
              labels: ['8:00', '12:00', '16:00', '20:00', '0:00', '4:00', '8:00'],
              values: [225, 224, 223, 224, 223, 224, 224],
            },
            '7d': {
              labels: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'],
              values: [230, 228, 227, 226, 225, 224, 224],
            },
            '30d': {
              labels: ['1', '5', '10', '15', '20', '25', '30'],
              values: [240, 235, 232, 229, 227, 225, 224],
            },
          },
          forecast: {
            today: 'Poziom wody stabilny.',
            tomorrow: 'Prognozowana stabilna sytuacja hydrologiczna.',
            week: 'Brak prognozowanych zmian poziomu wody.'
          },
          alerts: []
        },
        5: { // Opole
          id: 5,
          name: 'Opole',
          level: 265,
          status: 'warning',
          trend: 'down',
          trendValue: 4,
          updateTime: '14:10',
          river: 'Odra',
          latitude: 50.6751,
          longitude: 17.9213,
          alarmLevel: 300,
          warningLevel: 260,
          chartData: {
            '24h': {
              labels: ['8:00', '12:00', '16:00', '20:00', '0:00', '4:00', '8:00'],
              values: [275, 273, 270, 268, 267, 266, 265],
            },
            '7d': {
              labels: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'],
              values: [290, 285, 280, 275, 272, 268, 265],
            },
            '30d': {
              labels: ['1', '5', '10', '15', '20', '25', '30'],
              values: [310, 302, 295, 290, 282, 275, 265],
            },
          },
          forecast: {
            today: 'Prognozowany dalszy spadek poziomu wody.',
            tomorrow: 'Spodziewany powrót do stanu normalnego.',
            week: 'Sytuacja hydrologiczna stabilna, z tendencją spadkową.'
          },
          alerts: [
            {
              id: 1,
              type: 'warning',
              message: 'Przekroczony stan ostrzegawczy o 5 cm',
              time: '09:15, 30.03.2025'
            }
          ]
        }
      };
      
      // Zwracamy dane dla konkretnej stacji lub domyślnie pierwszą
      resolve(stations[stationId] || stations[1]);
    }, 1500);
  });
};