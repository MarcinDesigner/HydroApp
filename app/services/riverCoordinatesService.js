// Plik: app/services/riverCoordinatesService.js
// Ten plik zawiera przybliżone współrzędne dla głównych polskich rzek
// W rzeczywistej aplikacji te dane powinny być pobierane z API geograficznego

// Przykładowe współrzędne dla kilku głównych rzek w Polsce
// UWAGA: Te dane są przybliżone i używane tylko do demonstracji
// W prawdziwej aplikacji należy użyć rzeczywistych danych geograficznych
export const MAIN_POLISH_RIVERS = {
  "Wisła": [
    { latitude: 49.6512, longitude: 19.0650 }, // Źródło - Beskidy
    { latitude: 49.9833, longitude: 19.7897 }, // Kraków
    { latitude: 50.0722, longitude: 20.2222 },
    { latitude: 50.3500, longitude: 20.6500 },
    { latitude: 51.4000, longitude: 21.9500 }, // Puławy
    { latitude: 52.2298, longitude: 21.0118 }, // Warszawa
    { latitude: 52.6500, longitude: 19.0833 }, // Płock
    { latitude: 53.0333, longitude: 18.6167 }, // Toruń
    { latitude: 54.3520, longitude: 18.6466 }  // Gdańsk - ujście
  ],
  "Odra": [
    { latitude: 49.5607, longitude: 17.9082 }, // Źródło - Góry Odrzańskie
    { latitude: 50.2833, longitude: 18.2328 }, // Racibórz
    { latitude: 50.6711, longitude: 17.8872 }, // Opole
    { latitude: 51.1268, longitude: 17.0417 }, // Wrocław
    { latitude: 51.6500, longitude: 16.0833 }, // Głogów
    { latitude: 52.4311, longitude: 14.5558 }, // Słubice
    { latitude: 53.0667, longitude: 14.3333 }, // Szczecin
    { latitude: 53.5500, longitude: 14.5833 }  // Ujście do Zalewu Szczecińskiego
  ],
  "Warta": [
    { latitude: 50.8083, longitude: 19.1333 }, // Źródło - Zawiercie
    { latitude: 50.8122, longitude: 19.1195 }, // Częstochowa
    { latitude: 51.7667, longitude: 18.0833 }, // Sieradz
    { latitude: 52.4069, longitude: 16.9299 }, // Poznań
    { latitude: 52.7000, longitude: 15.4000 }, // Gorzów Wielkopolski
    { latitude: 52.5900, longitude: 14.6228 }  // Ujście do Odry
  ],
  "Bug": [
    { latitude: 49.9167, longitude: 24.7833 }, // Źródło - Ukraina
    { latitude: 50.5000, longitude: 24.0167 }, // Granica Polski
    { latitude: 51.5500, longitude: 23.5500 }, // Włodawa
    { latitude: 52.0833, longitude: 23.1167 }, // Brześć
    { latitude: 52.5000, longitude: 21.9167 }, // Małkinia Górna
    { latitude: 52.6833, longitude: 21.0833 }, // Serock - ujście do Narwi
  ],
  "Narew": [
    { latitude: 53.1333, longitude: 23.9167 }, // Źródło - Białoruś
    { latitude: 53.1328, longitude: 22.9236 }, // Łomża
    { latitude: 53.0167, longitude: 22.0500 }, // Tykocin
    { latitude: 52.8500, longitude: 21.6167 }, // Pułtusk
    { latitude: 52.4667, longitude: 20.9333 }, // Nowy Dwór Mazowiecki - ujście do Wisły
  ],
  "San": [
    { latitude: 49.0167, longitude: 22.8667 }, // Źródło - Bieszczady
    { latitude: 49.6000, longitude: 22.0500 }, // Sanok
    { latitude: 50.0631, longitude: 22.2236 }, // Przemyśl
    { latitude: 50.5167, longitude: 22.1167 }, // Jarosław
    { latitude: 50.6900, longitude: 21.8500 }  // Ujście do Wisły
  ],
  "Noteć": [
    { latitude: 52.7000, longitude: 18.0000 }, // Źródło - okolice Inowrocławia
    { latitude: 52.8500, longitude: 17.7167 }, // Nakło nad Notecią
    { latitude: 52.9000, longitude: 16.4500 }, // Czarnków
    { latitude: 52.7500, longitude: 15.4000 }, // Drezdenko
    { latitude: 52.7167, longitude: 14.7000 }  // Ujście do Warty
  ],
  "Pilica": [
    { latitude: 50.6000, longitude: 19.5000 }, // Źródło - okolice Częstochowy
    { latitude: 50.7667, longitude: 19.9167 }, // Koniecpol
    { latitude: 51.0500, longitude: 20.3833 }, // Sulejów
    { latitude: 51.4500, longitude: 20.5500 }, // Nowe Miasto nad Pilicą
    { latitude: 51.6414, longitude: 21.1900 }  // Ujście do Wisły
  ],
  "Bzura": [
    { latitude: 51.9000, longitude: 19.2500 }, // Źródło - okolice Łodzi
    { latitude: 52.0500, longitude: 19.9000 }, // Łowicz
    { latitude: 52.2167, longitude: 20.3167 }, // Sochaczew
    { latitude: 52.3833, longitude: 20.4000 }  // Ujście do Wisły
  ]
};

// Funkcja do pobierania koordynatów dla rzeki
export const getRiverCoordinates = (riverName) => {
  // Normalizujemy nazwę rzeki dla porównania (usuwamy polskie znaki, sprowadzamy do małych liter)
  const normalizedName = riverName.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, 'l');
  
  // Szukamy w naszych predefiniowanych rzekach
  const riverKey = Object.keys(MAIN_POLISH_RIVERS).find(key => {
    const normalizedKey = key.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/ł/g, 'l');
    
    return normalizedKey === normalizedName;
  });
  
  if (riverKey) {
    return MAIN_POLISH_RIVERS[riverKey];
  }
  
  // Jeśli nie znaleźliśmy rzeki, zwracamy pustą tablicę
  return [];
};

// Funkcja do interpolacji punktów pośrednich między stacjami na rzece
export const interpolateRiverPoints = (riverCoordinates, stationsOnRiver) => {
  if (!riverCoordinates || riverCoordinates.length < 2 || !stationsOnRiver || stationsOnRiver.length < 2) {
    return riverCoordinates || [];
  }
  
  // Tutaj można zaimplementować bardziej złożoną logikę interpolacji,
  // na przykład dopasowując stacje do najbliższych punktów na predefiniowanej ścieżce rzeki
  // Na razie zwracamy po prostu istniejące punkty
  
  return riverCoordinates;
};