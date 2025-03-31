// Plik: app/services/stationCoordinatesService.js
// Zawiera mapowanie stacji hydrologicznych na współrzędne geograficzne

// Rozszerzona lista współrzędnych stacji hydrologicznych (na podstawie rzeczywistych lokalizacji)
export const HYDRO_STATION_COORDINATES = {
  // Stacje na Wiśle
  "Warszawa": { latitude: 52.2297, longitude: 21.0122 },
  "Kraków": { latitude: 50.0647, longitude: 19.9450 },
  "Tczew": { latitude: 54.0919, longitude: 18.7959 },
  "Płock": { latitude: 52.5463, longitude: 19.7064 },
  "Włocławek": { latitude: 52.6483, longitude: 19.0679 },
  "Toruń": { latitude: 53.0138, longitude: 18.5981 },
  "Puławy": { latitude: 51.4161, longitude: 21.9667 },
  "Sandomierz": { latitude: 50.6828, longitude: 21.7498 },
  
  // Stacje na Odrze
  "Wrocław": { latitude: 51.1079, longitude: 17.0385 },
  "Opole": { latitude: 50.6683, longitude: 17.9230 },
  "Brzeg Dolny": { latitude: 51.2705, longitude: 16.7118 },
  "Głogów": { latitude: 51.6639, longitude: 16.0843 },
  "Słubice": { latitude: 52.3482, longitude: 14.5602 },
  "Szczecin": { latitude: 53.4289, longitude: 14.5530 },
  "Gozdowice": { latitude: 52.7575, longitude: 14.3198 },
  
  // Stacje na Warcie
  "Poznań": { latitude: 52.4064, longitude: 16.9252 },
  "Gorzów Wielkopolski": { latitude: 52.7331, longitude: 15.2392 },
  "Śrem": { latitude: 52.0894, longitude: 17.0162 },
  "Sieradz": { latitude: 51.5942, longitude: 18.7321 },
  "Działoszyn": { latitude: 51.1188, longitude: 18.8634 },
  
  // Stacje na Noteci
  "Nakło": { latitude: 53.1394, longitude: 17.6047 },
  "Ujście": { latitude: 53.0525, longitude: 16.7298 },
  "Krzyż": { latitude: 52.8794, longitude: 16.0272 },
  "Drezdenko": { latitude: 52.8383, longitude: 15.8314 },
  
  // Stacje na Bugu
  "Włodawa": { latitude: 51.5469, longitude: 23.5500 },
  "Wyszków": { latitude: 52.5947, longitude: 21.4664 },
  "Frankopol": { latitude: 52.2836, longitude: 22.9005 },
  
  // Stacje na Narwi
  "Zambski Kościelne": { latitude: 52.7914, longitude: 21.2897 },
  "Pułtusk": { latitude: 52.7056, longitude: 21.0883 },
  "Nowy Dwór Mazowiecki": { latitude: 52.4312, longitude: 20.6950 },
  
  // Stacje na różnych rzekach
  "Przewoźniki": { latitude: 51.4569, longitude: 15.2481 }, // na Nysie Łużyckiej
  "Biała Góra": { latitude: 53.9214, longitude: 18.8840 }, // na Nogacie
  "Jawor": { latitude: 51.0519, longitude: 16.1903 }, // na Nysa Szalona
  "Gubin": { latitude: 51.9581, longitude: 14.7183 }, // na Nysie Łużyckiej
  "Białobrzegi": { latitude: 51.6550, longitude: 20.9469 }, // na Pilicy
  "Nowa Sól": { latitude: 51.8097, longitude: 15.7144 }, // na Odrze
  "Racibórz-Miedonia": { latitude: 50.0981, longitude: 18.1942 }, // na Odrze
  "Krosno Odrzańskie": { latitude: 52.0582, longitude: 15.0994 }, // na Odrze
  "Cigacice": { latitude: 52.0356, longitude: 15.6128 }, // na Odrze
  "Nietków": { latitude: 52.0130, longitude: 15.5012 }, // na Odrze
  "Przemyśl": { latitude: 49.7835, longitude: 22.7677 }, // na Sanie
  "Żagań": { latitude: 51.6196, longitude: 15.3264 }, // na Bobrze
  "Trzebiatów": { latitude: 54.0594, longitude: 15.2733 }, // na Redze
  "Białogard": { latitude: 54.0067, longitude: 15.9892 }, // na Parsęcie
  "Koszalin": { latitude: 54.1941, longitude: 16.1725 }, // na Dzierżęcince
  "Kalisz": { latitude: 51.7624, longitude: 18.0895 }, // na Prośnie
  "Drawsko Pomorskie": { latitude: 53.5292, longitude: 15.8083 }, // na Drawie
  "Piła": { latitude: 53.1512, longitude: 16.7383 } // na Gwdzie
};

// Lista współrzędnych stacji synoptycznych (pogodowych)
export const SYNOP_STATION_COORDINATES = {
  "WARSZAWA OKĘCIE": { latitude: 52.1656, longitude: 20.9671 },
  "KRAKÓW BALICE": { latitude: 50.0777, longitude: 19.7848 },
  "GDAŃSK PORT PŁN": { latitude: 54.3958, longitude: 18.6581 },
  "WROCŁAW": { latitude: 51.1033, longitude: 16.8864 },
  "POZNAŃ": { latitude: 52.4200, longitude: 16.8306 },
  "ŁÓDŹ LUBLINEK": { latitude: 51.7219, longitude: 19.3981 },
  "SZCZECIN": { latitude: 53.3925, longitude: 14.6372 },
  "BYDGOSZCZ": { latitude: 53.0942, longitude: 17.9778 },
  "LUBLIN RADAWIEC": { latitude: 51.2167, longitude: 22.3936 },
  "KATOWICE PYRZOWICE": { latitude: 50.4742, longitude: 19.0800 },
  "BIAŁYSTOK": { latitude: 53.1014, longitude: 23.1611 },
  "RZESZÓW JASIONKA": { latitude: 50.1100, longitude: 22.0425 },
  "OLSZTYN": { latitude: 53.7761, longitude: 20.4339 },
  "KIELCE": { latitude: 50.8142, longitude: 20.6950 },
  "OPOLE": { latitude: 50.6317, longitude: 17.9694 },
  "GORZÓW WIELKOPOLSKI": { latitude: 52.7400, longitude: 15.2806 },
  "ZIELONA GÓRA": { latitude: 51.9344, longitude: 15.5333 },
  "TORUŃ": { latitude: 53.0458, longitude: 18.5964 },
  "SUWAŁKI": { latitude: 54.1317, longitude: 22.9500 },
  "KOŁOBRZEG": { latitude: 54.1833, longitude: 15.5833 },
  "LESKO": { latitude: 49.4711, longitude: 22.3417 },
  "MIKOŁAJKI": { latitude: 53.7833, longitude: 21.5833 },
  "PŁOCK": { latitude: 52.5858, longitude: 19.7228 },
  "HALA GĄSIENICOWA": { latitude: 49.2468, longitude: 19.9990 },
  "ZAKOPANE": { latitude: 49.2925, longitude: 19.9617 },
  "KASPROWY WIERCH": { latitude: 49.2317, longitude: 19.9822 },
  "ŚNIEŻKA": { latitude: 50.7361, longitude: 15.7397 },
  "RESKO": { latitude: 53.7614, longitude: 15.4175 },
  "KĘTRZYN": { latitude: 54.0750, longitude: 21.3731 },
  "TARNÓW": { latitude: 50.0347, longitude: 20.9878 },
  "SIEDLCE": { latitude: 52.1664, longitude: 22.2508 },
  "SŁUBICE": { latitude: 52.3483, longitude: 14.5944 },
  "RACIBÓRZ": { latitude: 50.0906, longitude: 18.2028 },
  "JELENIA GÓRA": { latitude: 50.8664, longitude: 15.7875 },
  "LESZNO": { latitude: 51.8406, longitude: 16.5747 },
  "KALISZ": { latitude: 51.7800, longitude: 18.0833 },
  "WŁODAWA": { latitude: 51.5589, longitude: 23.5075 }
};

/**
 * Znajdź najbliższą stację synoptyczną do podanej stacji hydrologicznej
 * @param {string} hydroStationName - Nazwa stacji hydrologicznej
 * @returns {Object|null} - Obiekt z nazwą i współrzędnymi najbliższej stacji synoptycznej lub null
 */
export const findNearestSynopStation = (hydroStationName) => {
  // Pierwsza próba: dokładne dopasowanie nazwy
  if (HYDRO_STATION_COORDINATES[hydroStationName] && SYNOP_STATION_COORDINATES[hydroStationName]) {
    return {
      name: hydroStationName,
      coordinates: SYNOP_STATION_COORDINATES[hydroStationName]
    };
  }
  
  // Jeśli nie znaleziono dokładnego dopasowania, znajdź współrzędne stacji hydrologicznej
  const hydroCoordinates = HYDRO_STATION_COORDINATES[hydroStationName];
  if (!hydroCoordinates) {
    return null; // Brak współrzędnych dla podanej stacji hydrologicznej
  }
  
  // Znajdź najbliższą stację synoptyczną
  let nearestStation = null;
  let minDistance = Infinity;
  
  Object.entries(SYNOP_STATION_COORDINATES).forEach(([name, coordinates]) => {
    const distance = calculateDistance(
      hydroCoordinates.latitude,
      hydroCoordinates.longitude,
      coordinates.latitude,
      coordinates.longitude
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = {
        name: name,
        coordinates: coordinates,
        distance: distance // dystans w kilometrach
      };
    }
  });
  
  return nearestStation;
};

/**
 * Oblicza odległość między dwoma punktami geograficznymi (wzór haversine)
 * @param {number} lat1 - Szerokość geograficzna punktu 1 (w stopniach)
 * @param {number} lon1 - Długość geograficzna punktu 1 (w stopniach)
 * @param {number} lat2 - Szerokość geograficzna punktu 2 (w stopniach)
 * @param {number} lon2 - Długość geograficzna punktu 2 (w stopniach)
 * @returns {number} - Odległość w kilometrach
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Promień Ziemi w km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Konwertuje stopnie na radiany
 * @param {number} degrees - Kąt w stopniach
 * @returns {number} - Kąt w radianach
 */
const toRadians = (degrees) => {
  return degrees * Math.PI / 180;
};