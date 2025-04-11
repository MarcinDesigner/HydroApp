// Plik: app/services/stationCoordinatesService.js
// Zawiera mapowanie stacji hydrologicznych na współrzędne geograficzne

// Rozszerzona lista współrzędnych stacji hydrologicznych (na podstawie rzeczywistych lokalizacji)
export const HYDRO_STATION_COORDINATES = {
  "149180110": { latitude: 49.6829259, longitude: 18.8192434 }, // Ustroń Obłaziec
  "149180120": { latitude: 52.6483, longitude: 19.0679 }, // Górki Wielkie
  "149180130": { latitude: 49.5752509, longitude: 18.9080462 }, // Istebna
  "149180140": { latitude: 52.5463, longitude: 19.7064 }, // Wisła
  "149180160": { latitude: 52.2297, longitude: 21.0122 }, // Wisła Czarne
  "149180180": { latitude: 49.6199808, longitude: 18.9395366 }, // Wisła Czarne
  "149190030": { latitude: 49.7824358, longitude: 19.074643 }, // Mikuszowice
  "149190050": { latitude: 50.0647, longitude: 19.945 }, // Rajcza
  "149190100": { latitude: 49.6786452, longitude: 19.1688404 }, // Żywiec
  "149190180": { latitude: 49.8717783, longitude: 19.505537547212356 }, // Wadowice
  "149190190": { latitude: 51.4161, longitude: 21.9667 }, // 149190190
  "149190220": { latitude: 49.6783252, longitude: 19.6466045 }, // Skawica Dolna
  "149190230": { latitude: 50.6828, longitude: 21.7498 }, // Czernichów - Prom
  "149190280": { latitude: 49.3944683, longitude: 19.8209236 }, // Koniówka
  "149200030": { latitude: 49.445721, longitude: 19.84294977295919 }, // Nowy Targ
  "149200040": { latitude: 53.0138, longitude: 18.5981 }, // Kasinka Mała
  "149200060": { latitude: 49.63603975, longitude: 20.026863681200773 }, // Mszana Dolna
  "149200090": { latitude: 54.0919, longitude: 18.7959 }, // Dobczyce
  "149200130": { latitude: 49.920734, longitude: 20.3166669 }, // Stradomka
  "149200150": { latitude: 49.5132491, longitude: 20.3967372 }, // Tylmanowa
  "149200200": { latitude: 49.7427778, longitude: 20.6244444 }, // Jakubkowice
  "149200290": { latitude: 49.3281329, longitude: 20.907597405393993 }, // Muszyna
  "149200310": { latitude: 49.6163155, longitude: 20.94843385 }, // Grybów
  "149200360": { latitude: 49.85894, longitude: 20.5274 }, // Lipnica Murowana
  "149210010": { latitude: 49.5740914, longitude: 21.07046513054306 }, // Ropa
  "149220050": { latitude: 49.5176154, longitude: 22.2643185 }, // Zagórz
  "150150040": { latitude: 50.94184, longitude: 15.59754 }, // Barcinek
  "150150090": { latitude: 50.351238, longitude: 16.5821356 }, // Łomnica
  "150160020": { latitude: 50.8482859, longitude: 16.2912418 }, // Świebodzice
  "150160080": { latitude: 50.5333306, longitude: 16.4839194 }, // Tłumaczów
  "150160150": { latitude: 50.2968684, longitude: 16.652017 }, // Bystrzyca Kłodzka 2
  "150160160": { latitude: 51.1035608, longitude: 16.8293994 }, // Mietków
  "150170030": { latitude: 50.9841256, longitude: 17.2458482 }, // Oława 2
  "150170060": { latitude: 50.4638685, longitude: 17.0372984 }, // Nysa
  "150170110": { latitude: 50.3217212, longitude: 17.5801041 }, // Prudnik
  "150180110": { latitude: 50.2011932, longitude: 18.4151519 }, // Ruda Kozielska
  "150190010": { latitude: 50.3499995, longitude: 19.0522414 }, // Brynica
  "150190070": { latitude: 50.2618303, longitude: 19.1288786 }, // Szabelnia
  "150190160": { latitude: 50.0307875, longitude: 19.216135474822657 }, // Oświęcim
  "150190330": { latitude: 50.2107146, longitude: 19.808567520269985 }, // Ojców
  "150200080": { latitude: 50.52024945, longitude: 20.519080651681925 }, // Pinczów
  "150210020": { latitude: 50.31095345, longitude: 21.087613939240505 }, // Szczucin
  "150210090": { latitude: 50.963367, longitude: 21.275823 }, // Kunów
  "150210160": { latitude: 50.5855788, longitude: 21.57704013663988 }, // Koprzywnica
  "150210170": { latitude: 50.67524, longitude: 21.75996 }, // Sandomierz
  "150210180": { latitude: 50.8874713, longitude: 21.864082469007137 }, // Annopol
  "150210190": { latitude: 50.802288, longitude: 21.861138 }, // Zawichost
  "151150090": { latitude: 51.4894339, longitude: 15.3605323 }, // Łozy
  "151150130": { latitude: 51.55132465, longitude: 15.545092744040256 }, // Szprotawa 2
  "151160130": { latitude: 51.409151300000005, longitude: 16.436490538215693 }, // Ścinawa
  "151160150": { latitude: 51.21815035, longitude: 16.49921804946748 }, // Malczyce
  "151160190": { latitude: 51.1035608, longitude: 16.8293994 }, // Jarnołtów
  "151160230": { latitude: 50.8849809, longitude: 16.9134261 }, // Ślęza
  "151180010": { latitude: 51.6353887, longitude: 18.0679429 }, // Ołobok
  "151180080": { latitude: 51.6030132, longitude: 18.7303652 }, // Sieradz
  "151180130": { latitude: 51.115376999999995, longitude: 18.886817906241234 }, // Działoszyn
  "151190090": { latitude: 51.089696149999995, longitude: 19.864938485258236 }, // Przedbórz
  "151190120": { latitude: 51.3169683, longitude: 19.9718424 }, // Dąbrowa
  "151200090": { latitude: 51.616692, longitude: 20.5796171 }, // Nowe Miasto/Pilicą
  "151200100": { latitude: 51.1080901, longitude: 20.8505854 }, // Bzin
  "151210190": { latitude: 51.4376142, longitude: 21.9510552 }, // Puławy
  "151230040": { latitude: 51.5160756, longitude: 23.5857364 }, // Włodawa
  "152140050": { latitude: 52.3489603, longitude: 14.5573223 }, // Słubice
  "152140060": { latitude: 52.58143145, longitude: 14.634568050396574 }, // Kostrzyn n. Odrą
  "152150040": { latitude: 52.7309926, longitude: 15.2400451 }, // Gorzów Wielkopolski
  "152150200": { latitude: 52.605266, longitude: 15.902233 }, // Międzychód
  "152180120": { latitude: 52.1991697, longitude: 18.6505806 }, // Koło
  "152180150": { latitude: 52.1542446, longitude: 18.7238889 }, // Dąbie
  "152190030": { latitude: 52.595077599999996, longitude: 19.467530156310588 }, // Włocławek
  "152200150": { latitude: 52.3985094, longitude: 20.4154795 }, // Wychódźc
  "152210090": { latitude: 52.59239895, longitude: 21.447176652920984 }, // Wyszków
  "152230090": { latitude: 53.226235149999994, longitude: 22.069270131493468 }, // Narew
  "152230100": { latitude: 52.8488848, longitude: 23.767440017021322 }, // Narewka
  "152230190": { latitude: 52.864919150000006, longitude: 23.881010150857755 }, // Białowieża
  "153140050": { latitude: 53.414508850000004, longitude: 14.573801508592387 }, // Szczecin
  "153140070": { latitude: 54.0223927, longitude: 14.7387291 }, // Dziwnów
  "153140090": { latitude: 53.5576648, longitude: 14.825029198405728 }, // Goleniów
  "153150010": { latitude: 53.339557, longitude: 15.031126 }, // Stargard
  "153160180": { latitude: 53.170880350000004, longitude: 16.753209453854005 }, // Piła
  "153180020": { latitude: 53.1477778, longitude: 18.1694444 }, // Fordon
  "153180090": { latitude: 52.9257622, longitude: 18.8075683 }, // Toruń
  "153190040": { latitude: 53.9658918, longitude: 19.3577451 }, // Bągart
  "153200070": { latitude: 53.7299477, longitude: 20.456542 }, // Olsztyn
  "153210090": { latitude: 53.0789906, longitude: 21.5566826 }, // Ostrołęka
  "153210140": { latitude: 53.187647, longitude: 21.6769594 }, // Szkwa
  "153220060": { latitude: 53.82395835, longitude: 22.361916488932224 }, // Ełk
  "153220080": { latitude: 53.7005864, longitude: 22.4324226 }, // Prostki
  "153230110": { latitude: 53.2100391, longitude: 23.3360728 }, // Supraśl
  "154150010": { latitude: 54.0627026, longitude: 15.2657157 }, // Trzebiatów
  "154150030": { latitude: 54.18682495, longitude: 15.563236484321907 }, // Kołobrzeg
  "154160020": { latitude: 54.0836774, longitude: 16.082033636747873 }, // Białogórzyno
  "154170080": { latitude: 54.4181463, longitude: 17.4127414 }, // Łupawa
  "154170160": { latitude: 54.7602483, longitude: 17.5549336 }, // Lębork
  "154180080": { latitude: 54.6028303, longitude: 18.3007039 }, // Wejherowo
  "154180090": { latitude: 54.636767, longitude: 18.640021293509456 }, // Puck
  "154180140": { latitude: 54.3482907, longitude: 18.6540233 }, // Gdańsk
  "154180150": { latitude: 54.074409200000005, longitude: 18.806318718326885 }, // Tczew
  "154190060": { latitude: 54.1988997, longitude: 19.44108568736702 }, // Elbląg
  "154220110": { latitude: 54.31037010387593, longitude: 22.26281313194163 }, // Gołdap 2
  "150170170": { latitude: 50.05115696574551, longitude: 17.771108818455563 }, // Branice 
  "150170290": { latitude: 50.6307882371267, longitude: 17.939698200123015 }, // Opole Groszowice
  "150180150": { latitude: 50.38049521969635, longitude: 18.540790809919745 }, // Pyskowice-Dzierżno Kłodnica
  "150180160": { latitude: 50.38230151329833, longitude: 18.543044823831504 }, // Pyskowice-Dzierżno Drama
  "153140030": { latitude: 53.257810051663135, longitude: 14.482472963101914 }, // Gryfino
  "152140010": { latitude: 52.93875451264944, longitude: 14.144041567014048 }, // Bielinek
  "152140020": { latitude: 52.76515658299761, longitude: 14.311073212763564 }, // Gozdowice
  "152140090": { latitude: 51.961470009950034, longitude: 14.710657630612495 }, // Biała Góra
  "152140130": { latitude: 52.05052970910082, longitude: 14.89583534770495 }, // Połecko
  "152150050": { latitude: 52.0470932767105, longitude: 15.35203554233761 }, // nietkow
  "152150130": { latitude: 52.030190833046085, longitude: 15.617936532682998 }, // Cigacice
  "149180020":{ latitude: 49.928597898666794, longitude: 18.33238599884516 }, // Chałupki
  "151170010":{ latitude: 51.17045342961488, longitude: 17.049382348508836 }, // Krzyżanowice
  "149180300":{ latitude: 49.95394914976493, longitude: 18.327087662870046 }, // Olza
  "150180060":{ latitude: 50.125246183090276, longitude: 18.232253901961517 }, // Racibórz-Miedonia
  "150180030":{ latitude: 50.35253009605726, longitude: 18.145608145241294 }, // Koźle
  "150170130":{ latitude: 50.818531372324856, longitude: 17.660122861422586 }, // Ujscie nysy
  "150170090":{ latitude: 50.86088212305835, longitude: 17.48118313917552 }, // Brzeg
  "150170040":{ latitude: 50.9444390388959, longitude: 17.30896603041942 }, // Oława
  "151170030":{ latitude: 51.07970384302907, longitude: 17.156661148529686 }, // Trestno
  "150160170":{ latitude: 50.31227688100171, longitude: 16.656739650914524 }, // Bystrzyca
  "150160180":{ latitude: 50.44182839937502, longitude: 16.65866777015615 }, // Kłodzko
  "150160220":{ latitude: 50.504715514840974, longitude: 16.74229423579278 }, // Bardo
  "150170100":{ latitude: 50.636973369067945, longitude: 17.477148236450944 }, // Kopice
  "150170140":{ latitude: 50.75862182805162, longitude: 17.675460309284578 }, // Skorogoszcz
  "151170050":{ latitude: 51.109213853814126, longitude: 17.434107320250874 }, // Zbytowa





};

// Lista współrzędnych stacji synoptycznych (pogodowych)
export const SYNOP_STATION_COORDINATES = {
  "Warszawa Okęcie": { latitude: 52.1656, longitude: 20.9671 },
  "Kraków Balice": { latitude: 50.0777, longitude: 19.7848 },
  "Gdańsk Port Płn": { latitude: 54.3958, longitude: 18.6581 },
  "Wrocław": { latitude: 51.1033, longitude: 16.8864 },
  "Poznań": { latitude: 52.4200, longitude: 16.8306 },
  "Łódź Lublinek": { latitude: 51.7219, longitude: 19.3981 },
  "Szczecin": { latitude: 53.3925, longitude: 14.6372 },
  "Bydgoszcz": { latitude: 53.0942, longitude: 17.9778 },
  "Lublin Radawiec": { latitude: 51.2167, longitude: 22.3936 },
  "Katowice Pyrzowice": { latitude: 50.4742, longitude: 19.0800 },
  "Białystok": { latitude: 53.1014, longitude: 23.1611 },
  "Rzeszów Jasionka": { latitude: 50.1100, longitude: 22.0425 },
  "Olsztyn": { latitude: 53.7761, longitude: 20.4339 },
  "Kielce": { latitude: 50.8142, longitude: 20.6950 },
  "Opole": { latitude: 50.6317, longitude: 17.9694 },
  "Gorzów Wielkopolski": { latitude: 52.7400, longitude: 15.2806 },
  "Zielona Góra": { latitude: 51.9344, longitude: 15.5333 },
  "Toruń": { latitude: 53.0458, longitude: 18.5964 },
  "Suwałki": { latitude: 54.1317, longitude: 22.9500 },
  "Kołobrzeg": { latitude: 54.1833, longitude: 15.5833 },
  "Lesko": { latitude: 49.4711, longitude: 22.3417 },
  "Mikołajki": { latitude: 53.7833, longitude: 21.5833 },
  "Płock": { latitude: 52.5858, longitude: 19.7228 },
  "Hala Gąsienicowa": { latitude: 49.2468, longitude: 19.9990 },
  "Zakopane": { latitude: 49.2925, longitude: 19.9617 },
  "Kasprowy Wierch": { latitude: 49.2317, longitude: 19.9822 },
  "Śnieżka": { latitude: 50.7361, longitude: 15.7397 },
  "Resko": { latitude: 53.7614, longitude: 15.4175 },
  "Kętrzyn": { latitude: 54.0750, longitude: 21.3731 },
  "Tarnów": { latitude: 50.0347, longitude: 20.9878 },
  "Siedlce": { latitude: 52.1664, longitude: 22.2508 },
  "Słubice": { latitude: 52.3483, longitude: 14.5944 },
  "Racibórz": { latitude: 50.0906, longitude: 18.2028 },
  "Jelenia Góra": { latitude: 50.8664, longitude: 15.7875 },
  "Leszno": { latitude: 51.8406, longitude: 16.5747 },
  "Kalisz": { latitude: 51.7800, longitude: 18.0833 },
  "Włodawa": { latitude: 51.5589, longitude: 23.5075 }
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