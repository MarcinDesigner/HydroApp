// Plik: app/constants/hydroLevels.js
// Stałe dane poziomów hydrologicznych dla stacji

/**
 * Określa status stacji na podstawie aktualnego poziomu
 * @param {number} currentLevel - Aktualny poziom wody
 * @param {number} warningLevel - Poziom ostrzegawczy
 * @param {number} alarmLevel - Poziom alarmowy
 * @param {number} [lowLevel] - Opcjonalny poziom suszy (niski)
 * @returns {string} - Status: 'low', 'normal', 'warning', 'alarm'
 */
export const determineStationStatus = (currentLevel, warningLevel, alarmLevel, lowLevel = null) => {
  if (currentLevel >= alarmLevel) return 'alarm';
  if (currentLevel >= warningLevel) return 'warning';
  if (lowLevel !== null && currentLevel <= lowLevel) return 'low';
  return 'normal';
};

/**
 * Dane poziomów hydrologicznych dla poszczególnych stacji.
 * Zawiera informacje o stanach alarmowych i ostrzegawczych.
 * Usunięto zduplikowane wpisy.
 *
 * Struktura:
 * {
 *   stationName: string - nazwa stacji
 *   warningLevel: number - stan ostrzegawczy w cm
 *   alarmLevel: number - stan alarmowy w cm
 *   voivodeship: string - województwo
 *   riverId: string - znormalizowana nazwa rzeki (ID)
 * }
 */
export const HYDRO_LEVELS = [
    // --- zachodniopomorskie ---
  { stationName: "Bardy", warningLevel: 360, alarmLevel: 400, voivodeship: "zachodniopomorskie", riverId: "parsęta" },
  { stationName: "Białogard", warningLevel: 270, alarmLevel: 290, voivodeship: "zachodniopomorskie", riverId: "parsęta" },
  { stationName: "Białogórzyno", warningLevel: 190, alarmLevel: 210, voivodeship: "zachodniopomorskie", riverId: "radew" },
  { stationName: "Bielinek", warningLevel: 480, alarmLevel: 550, voivodeship: "zachodniopomorskie", riverId: "odra" },
  { stationName: "Darłowo", warningLevel: 570, alarmLevel: 610, voivodeship: "zachodniopomorskie", riverId: "morze bałtyckie" },
  { stationName: "Dziwnów", warningLevel: 560, alarmLevel: 580, voivodeship: "zachodniopomorskie", riverId: "morze bałtyckie" },
  { stationName: "Goleniów", warningLevel: 270, alarmLevel: 320, voivodeship: "zachodniopomorskie", riverId: "ina" },
  { stationName: "Gozdowice", warningLevel: 480, alarmLevel: 530, voivodeship: "zachodniopomorskie", riverId: "odra" },
  { stationName: "Gozdowice", warningLevel: 440, alarmLevel: 500, voivodeship: "zachodniopomorskie", riverId: "odra" },
  { stationName: "Gryfino", warningLevel: 570, alarmLevel: 600, voivodeship: "zachodniopomorskie", riverId: "odra" },
  { stationName: "Kołobrzeg", warningLevel: 570, alarmLevel: 610, voivodeship: "zachodniopomorskie", riverId: "morze bałtyckie" },
  { stationName: "Resko", warningLevel: 410, alarmLevel: 430, voivodeship: "zachodniopomorskie", riverId: "rega" },
  { stationName: "Stargard", warningLevel: 250, alarmLevel: 280, voivodeship: "zachodniopomorskie", riverId: "ina" },
  { stationName: "Stary Kraków", warningLevel: 460, alarmLevel: 500, voivodeship: "zachodniopomorskie", riverId: "wieprza" },
  { stationName: "Szczecin Most Długi", warningLevel: 570, alarmLevel: 600, voivodeship: "zachodniopomorskie", riverId: "odra" },
  { stationName: "Szczecin-Podjuchy", warningLevel: 580, alarmLevel: 610, voivodeship: "zachodniopomorskie", riverId: "regalica" },
  { stationName: "Świnoujście", warningLevel: 560, alarmLevel: 580, voivodeship: "zachodniopomorskie", riverId: "morze bałtyckie" },
  { stationName: "Trzebież", warningLevel: 540, alarmLevel: 560, voivodeship: "zachodniopomorskie", riverId: "zalew szczeciński" },
  { stationName: "Tychówko", warningLevel: 320, alarmLevel: 380, voivodeship: "zachodniopomorskie", riverId: "parsęta" },
  { stationName: "Widuchowa", warningLevel: 630, alarmLevel: 650, voivodeship: "zachodniopomorskie", riverId: "odra" },
  { stationName: "Wolin", warningLevel: 560, alarmLevel: 580, voivodeship: "zachodniopomorskie", riverId: "cieśnina dziwna" },
  { stationName: "Grabowo", warningLevel: 160, alarmLevel: 170, voivodeship: "zachodniopomorskie", riverId: "grabowa" },
  { stationName: "Trzebiatów", warningLevel: 350, alarmLevel: 370, voivodeship: "zachodniopomorskie", riverId: "rega" },

  // --- wielkopolskie ---
  { stationName: "Dębe", warningLevel: 220, alarmLevel: 250, voivodeship: "wielkopolskie", riverId: "swędrnia" },
  { stationName: "Rydzyna", warningLevel: 200, alarmLevel: 240, voivodeship: "wielkopolskie", riverId: "polski rów" },
  { stationName: "Bogdaj", warningLevel: 250, alarmLevel: 300, voivodeship: "wielkopolskie", riverId: "polska woda" },
  { stationName: "Bogusław", warningLevel: 250, alarmLevel: 300, voivodeship: "wielkopolskie", riverId: "prosna" },
  { stationName: "Czarnków", warningLevel: 250, alarmLevel: 300, voivodeship: "wielkopolskie", riverId: "noteć" },
  { stationName: "Drawiny", warningLevel: 120, alarmLevel: 170, voivodeship: "wielkopolskie", riverId: "drawa" },
  { stationName: "Grzegorzew", warningLevel: 240, alarmLevel: 280, voivodeship: "wielkopolskie", riverId: "riglewka" },
  { stationName: "Kościan", warningLevel: 180, alarmLevel: 210, voivodeship: "wielkopolskie", riverId: "kanał mosiński" },
  { stationName: "Kraszewice", warningLevel: 240, alarmLevel: 260, voivodeship: "wielkopolskie", riverId: "łużczyca" },
  { stationName: "Międzychód", warningLevel: 380, alarmLevel: 430, voivodeship: "wielkopolskie", riverId: "warta" },
  { stationName: "Odolanów", warningLevel: 120, alarmLevel: 150, voivodeship: "wielkopolskie", riverId: "barycz" },
  { stationName: "Odolanów", warningLevel: 160, alarmLevel: 190, voivodeship: "wielkopolskie", riverId: "barycz" },
  { stationName: "Ołobok", warningLevel: 220, alarmLevel: 260, voivodeship: "wielkopolskie", riverId: "ołobok" },
  { stationName: "Piła", warningLevel: 190, alarmLevel: 220, voivodeship: "wielkopolskie", riverId: "gwda" },
  { stationName: "Piwonice", warningLevel: 200, alarmLevel: 230, voivodeship: "wielkopolskie", riverId: "prosna" },
  { stationName: "Posoka", warningLevel: 260, alarmLevel: 300, voivodeship: "wielkopolskie", riverId: "powa" },
  { stationName: "Ptusza", warningLevel: 240, alarmLevel: 290, voivodeship: "wielkopolskie", riverId: "gwda" },
  { stationName: "Trąbczyn", warningLevel: 180, alarmLevel: 230, voivodeship: "wielkopolskie", riverId: "czarna struga" },
  { stationName: "Ujście", warningLevel: 310, alarmLevel: 330, voivodeship: "wielkopolskie", riverId: "noteć" },
  { stationName: "Białośliwie", warningLevel: 280, alarmLevel: 330, voivodeship: "wielkopolskie", riverId: "noteć" },
  { stationName: "Dąbie", warningLevel: 250, alarmLevel: 300, voivodeship: "wielkopolskie", riverId: "ner" },
  { stationName: "Koło", warningLevel: 340, alarmLevel: 390, voivodeship: "wielkopolskie", riverId: "warta" },
  { stationName: "Kościelec", warningLevel: 240, alarmLevel: 270, voivodeship: "wielkopolskie", riverId: "kiebłaska duża" },
  { stationName: "Ląd", warningLevel: 330, alarmLevel: 370, voivodeship: "wielkopolskie", riverId: "warta" },
  { stationName: "Nowa Wieś Podgórna", warningLevel: 430, alarmLevel: 480, voivodeship: "wielkopolskie", riverId: "warta" },
  { stationName: "Oborniki", warningLevel: 420, alarmLevel: 560, voivodeship: "wielkopolskie", riverId: "warta" },
  { stationName: "Odolanów", warningLevel: 160, alarmLevel: 190, voivodeship: "wielkopolskie", riverId: "kuroch" },
  { stationName: "Poznań-Most Rocha", warningLevel: 400, alarmLevel: 500, voivodeship: "wielkopolskie", riverId: "warta" },
  { stationName: "Pyzdry", warningLevel: 410, alarmLevel: 450, voivodeship: "wielkopolskie", riverId: "warta" },
  { stationName: "Sławsk", warningLevel: 450, alarmLevel: 480, voivodeship: "wielkopolskie", riverId: "warta" },
  { stationName: "Śrem", warningLevel: 350, alarmLevel: 400, voivodeship: "wielkopolskie", riverId: "warta" },
  { stationName: "Śrem", warningLevel: 400, alarmLevel: 460, voivodeship: "wielkopolskie", riverId: "warta" },
  { stationName: "Wronki", warningLevel: 380, alarmLevel: 470, voivodeship: "wielkopolskie", riverId: "warta" },
  { stationName: "Wyrzysk", warningLevel: 160, alarmLevel: 200, voivodeship: "wielkopolskie", riverId: "łobżonka" },

  // --- lubelskie ---
  { stationName: "Biłgoraj", warningLevel: 180, alarmLevel: 220, voivodeship: "lubelskie", riverId: "łada" },
  { stationName: "Biskupice", warningLevel: 410, alarmLevel: 450, voivodeship: "lubelskie", riverId: "gielczewka" },
  { stationName: "Gozdów", warningLevel: 290, alarmLevel: 350, voivodeship: "lubelskie", riverId: "huczwa" },
  { stationName: "Krasnystaw", warningLevel: 420, alarmLevel: 470, voivodeship: "lubelskie", riverId: "wieprz" },
  { stationName: "Krzyczew", warningLevel: 380, alarmLevel: 480, voivodeship: "lubelskie", riverId: "bug" },
  { stationName: "Malowa Góra", warningLevel: 310, alarmLevel: 350, voivodeship: "lubelskie", riverId: "krzna" },
  { stationName: "Sobianowice", warningLevel: 240, alarmLevel: 270, voivodeship: "lubelskie", riverId: "bystrzyca" },
  { stationName: "Annopol", warningLevel: 500, alarmLevel: 550, voivodeship: "lubelskie", riverId: "wisła" },
  { stationName: "Dęblin", warningLevel: 400, alarmLevel: 500, voivodeship: "lubelskie", riverId: "wisła" },
  { stationName: "Dorohusk", warningLevel: 290, alarmLevel: 430, voivodeship: "lubelskie", riverId: "bug" },
  { stationName: "Kośmin", warningLevel: 350, alarmLevel: 400, voivodeship: "lubelskie", riverId: "wieprz" },
  { stationName: "Kryłów", warningLevel: 440, alarmLevel: 540, voivodeship: "lubelskie", riverId: "bug" },
  { stationName: "Lubartów", warningLevel: 430, alarmLevel: 480, voivodeship: "lubelskie", riverId: "wieprz" },
  { stationName: "Michałów", warningLevel: 110, alarmLevel: 170, voivodeship: "lubelskie", riverId: "wieprz" },
  { stationName: "Michałów", warningLevel: 160, alarmLevel: 190, voivodeship: "lubelskie", riverId: "wieprz" },
  { stationName: "Nielisz", warningLevel: 200, alarmLevel: 230, voivodeship: "lubelskie", riverId: "wieprz" },
  { stationName: "Osuchy", warningLevel: 320, alarmLevel: 400, voivodeship: "lubelskie", riverId: "tanew" },
  { stationName: "Puławy-Azoty", warningLevel: 450, alarmLevel: 550, voivodeship: "lubelskie", riverId: "wisła" },
  { stationName: "Strzyżów", warningLevel: 650, alarmLevel: 800, voivodeship: "lubelskie", riverId: "bug" },
  { stationName: "Tchórzew", warningLevel: 350, alarmLevel: 400, voivodeship: "lubelskie", riverId: "tyśmienica" },
  { stationName: "Trawniki", warningLevel: 450, alarmLevel: 500, voivodeship: "lubelskie", riverId: "wieprz" },
  { stationName: "Wirkowice", warningLevel: 290, alarmLevel: 350, voivodeship: "lubelskie", riverId: "wieprz" },
  { stationName: "Włodawa", warningLevel: 300, alarmLevel: 390, voivodeship: "lubelskie", riverId: "bug" },
  { stationName: "Zakłodzie", warningLevel: 190, alarmLevel: 230, voivodeship: "lubelskie", riverId: "pór" },

  // --- małopolskie ---
  { stationName: "Balice", warningLevel: 340, alarmLevel: 380, voivodeship: "małopolskie", riverId: "rudawa" },
  { stationName: "Biskupice", warningLevel: 410, alarmLevel: 450, voivodeship: "małopolskie", riverId: "stradomka" },
  { stationName: "Borzęcin", warningLevel: 300, alarmLevel: 400, voivodeship: "małopolskie", riverId: "uszwianka" },
  { stationName: "Grybów", warningLevel: 320, alarmLevel: 400, voivodeship: "małopolskie", riverId: "biała" },
  { stationName: "Jawiszowice", warningLevel: 480, alarmLevel: 630, voivodeship: "małopolskie", riverId: "wisła" },
  { stationName: "Koniówka", warningLevel: 250, alarmLevel: 290, voivodeship: "małopolskie", riverId: "czarny dunajec" },
  { stationName: "Kraków-Bielany", warningLevel: 370, alarmLevel: 520, voivodeship: "małopolskie", riverId: "wisła" },
  { stationName: "Niedzica", warningLevel: 200, alarmLevel: 260, voivodeship: "małopolskie", riverId: "niedziczanka" },
  { stationName: "Nowy Targ-Kowaniec", warningLevel: 300, alarmLevel: 380, voivodeship: "małopolskie", riverId: "kowaniec" },
  { stationName: "Poronin", warningLevel: 220, alarmLevel: 250, voivodeship: "małopolskie", riverId: "poroniec" },
  { stationName: "Smolice", warningLevel: 450, alarmLevel: 630, voivodeship: "małopolskie", riverId: "wisła" },
  { stationName: "Sromowce Wyżne", warningLevel: 280, alarmLevel: 360, voivodeship: "małopolskie", riverId: "dunajec" },
  { stationName: "Stradomka", warningLevel: 280, alarmLevel: 350, voivodeship: "małopolskie", riverId: "stradomka" },
  { stationName: "Trybsz 2", warningLevel: 280, alarmLevel: 320, voivodeship: "małopolskie", riverId: "biała" },
  { stationName: "Zakopane-Harenda", warningLevel: 200, alarmLevel: 240, voivodeship: "małopolskie", riverId: "biały dunajec" },
  { stationName: "Zator", warningLevel: 240, alarmLevel: 370, voivodeship: "małopolskie", riverId: "skawa" },
  { stationName: "Czernichów-Prom", warningLevel: 580, alarmLevel: 840, voivodeship: "małopolskie", riverId: "wisła" },
  { stationName: "Gorlice", warningLevel: 390, alarmLevel: 450, voivodeship: "małopolskie", riverId: "sękówka" },
  { stationName: "Karsy", warningLevel: 550, alarmLevel: 750, voivodeship: "małopolskie", riverId: "wisła" },
  { stationName: "Kasinka Mała", warningLevel: 350, alarmLevel: 420, voivodeship: "małopolskie", riverId: "raba" },
  { stationName: "Krościenko", warningLevel: 320, alarmLevel: 390, voivodeship: "małopolskie", riverId: "dunajec" },
  { stationName: "Krościenko", warningLevel: 160, alarmLevel: 210, voivodeship: "małopolskie", riverId: "dunajec" },
  { stationName: "Kościelisko-Kiry", warningLevel: 140, alarmLevel: 180, voivodeship: "małopolskie", riverId: "kirowa woda" },
  { stationName: "Krościenko", warningLevel: 320, alarmLevel: 390, voivodeship: "małopolskie", riverId: "przełom" },
  { stationName: "Krościenko", warningLevel: 160, alarmLevel: 210, voivodeship: "małopolskie", riverId: "przełom" },
  { stationName: "Ludźmierz", warningLevel: 230, alarmLevel: 300, voivodeship: "małopolskie", riverId: "wielki rogoźnik" },
  { stationName: "Ludźmierz", warningLevel: 280, alarmLevel: 350, voivodeship: "małopolskie", riverId: "wielki rogoźnik" },
  { stationName: "Ludźmierz", warningLevel: 230, alarmLevel: 300, voivodeship: "małopolskie", riverId: "lepietnica" },
  { stationName: "Ludźmierz", warningLevel: 280, alarmLevel: 350, voivodeship: "małopolskie", riverId: "lepietnica" },
  { stationName: "Łysa Polana", warningLevel: 220, alarmLevel: 260, voivodeship: "małopolskie", riverId: "rybi potok" },
  { stationName: "Mszana Dolna", warningLevel: 320, alarmLevel: 380, voivodeship: "małopolskie", riverId: "mszanka" },
  { stationName: "Mszana Dolna", warningLevel: 240, alarmLevel: 340, voivodeship: "małopolskie", riverId: "mszanka" },
  { stationName: "Muszyna", warningLevel: 210, alarmLevel: 290, voivodeship: "małopolskie", riverId: "poprad" },
  { stationName: "Muszyna-Milik", warningLevel: 260, alarmLevel: 350, voivodeship: "małopolskie", riverId: "poprad" },
  { stationName: "Nowy Sącz", warningLevel: 300, alarmLevel: 380, voivodeship: "małopolskie", riverId: "lubinka" },
  { stationName: "Nowy Sącz", warningLevel: 250, alarmLevel: 380, voivodeship: "małopolskie", riverId: "lubinka" },
  { stationName: "Nowy Sącz", warningLevel: 200, alarmLevel: 260, voivodeship: "małopolskie", riverId: "lubinka" },
  { stationName: "Nowy Targ", warningLevel: 260, alarmLevel: 350, voivodeship: "małopolskie", riverId: "dunajec" },
  { stationName: "Nowy Sącz", warningLevel: 300, alarmLevel: 380, voivodeship: "małopolskie", riverId: "kamienica" },
  { stationName: "Nowy Sącz", warningLevel: 250, alarmLevel: 380, voivodeship: "małopolskie", riverId: "kamienica" },
  { stationName: "Nowy Sącz", warningLevel: 200, alarmLevel: 260, voivodeship: "małopolskie", riverId: "kamienica" },
  { stationName: "Popędzynka", warningLevel: 580, alarmLevel: 750, voivodeship: "małopolskie", riverId: "spółka" },
  { stationName: "Ropa", warningLevel: 280, alarmLevel: 370, voivodeship: "małopolskie", riverId: "rogoźniczanka" },
  { stationName: "Rudze", warningLevel: 220, alarmLevel: 320, voivodeship: "małopolskie", riverId: "wisła" },
  { stationName: "Stary Sącz", warningLevel: 300, alarmLevel: 400, voivodeship: "małopolskie", riverId: "poprad" },
  { stationName: "Stróża", warningLevel: 220, alarmLevel: 290, voivodeship: "małopolskie", riverId: "raba" },
  { stationName: "Sucha Beskidzka", warningLevel: 215, alarmLevel: 285, voivodeship: "małopolskie", riverId: "skawa" },
  { stationName: "Sucha Beskidzka", warningLevel: 220, alarmLevel: 270, voivodeship: "małopolskie", riverId: "skawa" },
  { stationName: "Tylmanowa", warningLevel: 200, alarmLevel: 250, voivodeship: "małopolskie", riverId: "ochotnica" },
  { stationName: "Uście Gorlickie", warningLevel: 230, alarmLevel: 280, voivodeship: "małopolskie", riverId: "rupa" },
  { stationName: "Koszyce Wielkie", warningLevel: 330, alarmLevel: 440, voivodeship: "małopolskie", riverId: "baba" },
  { stationName: "Oświęcim", warningLevel: 370, alarmLevel: 460, voivodeship: "małopolskie", riverId: "soła" },
  { stationName: "Stróża", warningLevel: 220, alarmLevel: 290, voivodeship: "małopolskie", riverId: "sława" },
  { stationName: "Sucha Beskidzka", warningLevel: 215, alarmLevel: 285, voivodeship: "małopolskie", riverId: "stryszawka" },
  { stationName: "Sucha Beskidzka", warningLevel: 220, alarmLevel: 270, voivodeship: "małopolskie", riverId: "stryszawka" },

  // --- lubuskie ---
  { stationName: "Bledzew", warningLevel: 200, alarmLevel: 220, voivodeship: "lubuskie", riverId: "obra" },
  { stationName: "Cigacice", warningLevel: 350, alarmLevel: 400, voivodeship: "lubuskie", riverId: "odra" },
  { stationName: "Gościmiec", warningLevel: 290, alarmLevel: 380, voivodeship: "lubuskie", riverId: "noteć" },
  { stationName: "Gubin", warningLevel: 300, alarmLevel: 400, voivodeship: "lubuskie", riverId: "nysa łużycka" },
  { stationName: "Iłowa", warningLevel: 180, alarmLevel: 200, voivodeship: "lubuskie", riverId: "czarna mała" },
  { stationName: "Kostrzyn Nad Odrą", warningLevel: 360, alarmLevel: 410, voivodeship: "lubuskie", riverId: "warta" },
  { stationName: "Kostrzyn Nad Odrą", warningLevel: 420, alarmLevel: 470, voivodeship: "lubuskie", riverId: "odra" },
  { stationName: "Łozy", warningLevel: 280, alarmLevel: 330, voivodeship: "lubuskie", riverId: "kwisa" },
  { stationName: "Łozy", warningLevel: 350, alarmLevel: 400, voivodeship: "lubuskie", riverId: "kwisa" },
  { stationName: "Nietków", warningLevel: 370, alarmLevel: 400, voivodeship: "lubuskie", riverId: "odra" },
  { stationName: "Nowa Sól", warningLevel: 400, alarmLevel: 450, voivodeship: "lubuskie", riverId: "odra" },
  { stationName: "Nowe Drezdenko", warningLevel: 290, alarmLevel: 340, voivodeship: "lubuskie", riverId: "noteć" },
  { stationName: "Nowogród Bobrzański", warningLevel: 250, alarmLevel: 300, voivodeship: "lubuskie", riverId: "bóbr" },
  { stationName: "Połęcko", warningLevel: 310, alarmLevel: 350, voivodeship: "lubuskie", riverId: "odra" },
  { stationName: "Przewoźniki", warningLevel: 220, alarmLevel: 240, voivodeship: "lubuskie", riverId: "skroda" },
  { stationName: "Przewoźniki", warningLevel: 300, alarmLevel: 340, voivodeship: "lubuskie", riverId: "skroda" },
  { stationName: "Przewóz", warningLevel: 290, alarmLevel: 350, voivodeship: "lubuskie", riverId: "nysa łużycka" },
  { stationName: "Santok", warningLevel: 420, alarmLevel: 490, voivodeship: "lubuskie", riverId: "warta" },
  { stationName: "Santok", warningLevel: 250, alarmLevel: 330, voivodeship: "lubuskie", riverId: "noteć" },
  { stationName: "Słubice", warningLevel: 430, alarmLevel: 480, voivodeship: "lubuskie", riverId: "odra" },
  { stationName: "Słubice", warningLevel: 360, alarmLevel: 410, voivodeship: "lubuskie", riverId: "odra" },
  { stationName: "Szprotawa", warningLevel: 230, alarmLevel: 270, voivodeship: "lubuskie", riverId: "szprotawa" },
  { stationName: "Szprotawa", warningLevel: 200, alarmLevel: 250, voivodeship: "lubuskie", riverId: "szprotawa" },
  { stationName: "Świerkocin", warningLevel: 450, alarmLevel: 500, voivodeship: "lubuskie", riverId: "warta" },
  { stationName: "Żagań", warningLevel: 130, alarmLevel: 150, voivodeship: "lubuskie", riverId: "czarna wielka" },
  { stationName: "Żagań", warningLevel: 340, alarmLevel: 400, voivodeship: "lubuskie", riverId: "czarna wielka" },
  { stationName: "Biała Góra", warningLevel: 360, alarmLevel: 470, voivodeship: "lubuskie", riverId: "odra" },
  { stationName: "Gorzów Wielkopolski", warningLevel: 380, alarmLevel: 430, voivodeship: "lubuskie", riverId: "warta" },
  { stationName: "Gorzów Wielkopolski", warningLevel: 390, alarmLevel: 470, voivodeship: "lubuskie", riverId: "warta" },
  { stationName: "Pleśno", warningLevel: 160, alarmLevel: 200, voivodeship: "lubuskie", riverId: "lubsza" },
  { stationName: "Stary Raduszec", warningLevel: 450, alarmLevel: 500, voivodeship: "lubuskie", riverId: "bóbr" },
  { stationName: "Szprotawa", warningLevel: 230, alarmLevel: 270, voivodeship: "lubuskie", riverId: "bóbr" },
  { stationName: "Szprotawa", warningLevel: 200, alarmLevel: 250, voivodeship: "lubuskie", riverId: "bóbr" },
  { stationName: "Żagań", warningLevel: 130, alarmLevel: 150, voivodeship: "lubuskie", riverId: "bóbr" },
  { stationName: "Żagań", warningLevel: 340, alarmLevel: 400, voivodeship: "lubuskie", riverId: "bóbr" },
  { stationName: "Gubin", warningLevel: 300, alarmLevel: 400, voivodeship: "lubuskie", riverId: "lubsza" },
  { stationName: "Skwierzyna", warningLevel: 380, alarmLevel: 460, voivodeship: "lubuskie", riverId: "warta" },

  // --- łódzkie ---
  { stationName: "Bielawy", warningLevel: 310, alarmLevel: 360, voivodeship: "łódzkie", riverId: "mroga" },
  { stationName: "Bobry", warningLevel: 130, alarmLevel: 150, voivodeship: "łódzkie", riverId: "warta" },
  { stationName: "Dąbrowa", warningLevel: 370, alarmLevel: 400, voivodeship: "łódzkie", riverId: "czarna" },
  { stationName: "Grabno", warningLevel: 230, alarmLevel: 280, voivodeship: "łódzkie", riverId: "grabia" },
  { stationName: "Kęszyce", warningLevel: 350, alarmLevel: 400, voivodeship: "łódzkie", riverId: "rawka" },
  { stationName: "Kłudzice", warningLevel: 350, alarmLevel: 380, voivodeship: "łódzkie", riverId: "łuciąża" },
  { stationName: "Kwiatkówek", warningLevel: 200, alarmLevel: 250, voivodeship: "łódzkie", riverId: "bzura" },
  { stationName: "Łask", warningLevel: 160, alarmLevel: 180, voivodeship: "łódzkie", riverId: "grabia" },
  { stationName: "Łowicz", warningLevel: 350, alarmLevel: 400, voivodeship: "łódzkie", riverId: "bzura" },
  { stationName: "Mirków", warningLevel: 230, alarmLevel: 270, voivodeship: "łódzkie", riverId: "prosna" },
  { stationName: "Niechmirów", warningLevel: 170, alarmLevel: 220, voivodeship: "łódzkie", riverId: "oleśnica" },
  { stationName: "Osjaków", warningLevel: 280, alarmLevel: 340, voivodeship: "łódzkie", riverId: "warta" },
  { stationName: "Burzenin", warningLevel: 280, alarmLevel: 320, voivodeship: "łódzkie", riverId: "warta" },
  { stationName: "Działoszyn", warningLevel: 290, alarmLevel: 340, voivodeship: "łódzkie", riverId: "warta" },
  { stationName: "Działoszyn", warningLevel: 530, alarmLevel: 570, voivodeship: "łódzkie", riverId: "warta" },
  { stationName: "Poddębice", warningLevel: 240, alarmLevel: 290, voivodeship: "łódzkie", riverId: "ner" },
  { stationName: "Podgórze", warningLevel: 290, alarmLevel: 330, voivodeship: "łódzkie", riverId: "widawka" },
  { stationName: "Przedbórz", warningLevel: 360, alarmLevel: 400, voivodeship: "łódzkie", riverId: "pilica" },
  { stationName: "Sieradz", warningLevel: 320, alarmLevel: 370, voivodeship: "łódzkie", riverId: "warta" },
  { stationName: "Sieradz", warningLevel: 390, alarmLevel: 440, voivodeship: "łódzkie", riverId: "warta" },
  { stationName: "Spała", warningLevel: 220, alarmLevel: 280, voivodeship: "łódzkie", riverId: "pilica" },
  { stationName: "Sulejów-Kopalnia", warningLevel: 230, alarmLevel: 260, voivodeship: "łódzkie", riverId: "pilica" },
  { stationName: "Szczerców", warningLevel: 190, alarmLevel: 230, voivodeship: "łódzkie", riverId: "widawka" },
  { stationName: "Uniejów", warningLevel: 220, alarmLevel: 270, voivodeship: "łódzkie", riverId: "warta" },

  // --- mazowieckie ---
  { stationName: "Białobrzeg Bliższy", warningLevel: 180, alarmLevel: 220, voivodeship: "mazowieckie", riverId: "omulew" },
  { stationName: "Białobrzegi", warningLevel: 200, alarmLevel: 250, voivodeship: "mazowieckie", riverId: "pilica" },
  { stationName: "Białobrzegi", warningLevel: 200, alarmLevel: 240, voivodeship: "mazowieckie", riverId: "pilica" },
  { stationName: "Czarnowo", warningLevel: 270, alarmLevel: 320, voivodeship: "mazowieckie", riverId: "orz" },
  { stationName: "Krubice", warningLevel: 220, alarmLevel: 280, voivodeship: "mazowieckie", riverId: "utrata" },
  { stationName: "Małkinia", warningLevel: 350, alarmLevel: 430, voivodeship: "mazowieckie", riverId: "okrzejka" },
  { stationName: "Piaseczno 2", warningLevel: 300, alarmLevel: 350, voivodeship: "mazowieckie", riverId: "jeziorka" },
  { stationName: "Popowo", warningLevel: 330, alarmLevel: 370, voivodeship: "mazowieckie", riverId: "wkra" },
  { stationName: "Szkwa", warningLevel: 460, alarmLevel: 500, voivodeship: "mazowieckie", riverId: "szkwa" },
  { stationName: "Trzciniec", warningLevel: 280, alarmLevel: 330, voivodeship: "mazowieckie", riverId: "wkra" },
  { stationName: "Walery", warningLevel: 300, alarmLevel: 340, voivodeship: "mazowieckie", riverId: "rozoga" },
  { stationName: "Zabuże", warningLevel: 450, alarmLevel: 520, voivodeship: "mazowieckie", riverId: "bug" },
  { stationName: "Żuków", warningLevel: 300, alarmLevel: 350, voivodeship: "mazowieckie", riverId: "bzura" },
  { stationName: "Borkowo", warningLevel: 280, alarmLevel: 300, voivodeship: "mazowieckie", riverId: "wkra" },
  { stationName: "Gusin", warningLevel: 370, alarmLevel: 420, voivodeship: "mazowieckie", riverId: "wisła" },
  { stationName: "Kazanów", warningLevel: 195, alarmLevel: 270, voivodeship: "mazowieckie", riverId: "iłżanka" },
  { stationName: "Kępa Polska", warningLevel: 450, alarmLevel: 500, voivodeship: "mazowieckie", riverId: "wisła" },
  { stationName: "Łochów", warningLevel: 300, alarmLevel: 350, voivodeship: "mazowieckie", riverId: "liwiec" },
  { stationName: "Maków Mazowiecki", warningLevel: 370, alarmLevel: 390, voivodeship: "mazowieckie", riverId: "orycz" },
  { stationName: "Modlin", warningLevel: 650, alarmLevel: 700, voivodeship: "mazowieckie", riverId: "wisła" },
  { stationName: "Nowe Miasto", warningLevel: 160, alarmLevel: 200, voivodeship: "mazowieckie", riverId: "pilica" },
  { stationName: "Odrzywół", warningLevel: 220, alarmLevel: 260, voivodeship: "mazowieckie", riverId: "drzewiczka" },
  { stationName: "Orzechowo", warningLevel: 320, alarmLevel: 400, voivodeship: "mazowieckie", riverId: "narew" },
  { stationName: "Ostrołęka", warningLevel: 360, alarmLevel: 380, voivodeship: "mazowieckie", riverId: "narew" },
  { stationName: "Słowik", warningLevel: 260, alarmLevel: 300, voivodeship: "mazowieckie", riverId: "radomka" },
  { stationName: "Warszawa-Bulwary", warningLevel: 600, alarmLevel: 650, voivodeship: "mazowieckie", riverId: "wisła" },
  { stationName: "Wyszków", warningLevel: 400, alarmLevel: 450, voivodeship: "mazowieckie", riverId: "bug" },
  { stationName: "Wyszogród", warningLevel: 500, alarmLevel: 550, voivodeship: "mazowieckie", riverId: "wisła" },
  { stationName: "Zambski Kościelne", warningLevel: 420, alarmLevel: 480, voivodeship: "mazowieckie", riverId: "narew" },
  { stationName: "Zawady", warningLevel: 380, alarmLevel: 400, voivodeship: "mazowieckie", riverId: "rzgoda" },
  { stationName: "Nowe Miasto", warningLevel: 160, alarmLevel: 200, voivodeship: "mazowieckie", riverId: "sona" },
  { stationName: "Płock", warningLevel: 700, alarmLevel: 800, voivodeship: "mazowieckie", riverId: "wisła" },
  { stationName: "Płock", warningLevel: 210, alarmLevel: 250, voivodeship: "mazowieckie", riverId: "wisła" },
  { stationName: "Różan", warningLevel: 400, alarmLevel: 450, voivodeship: "mazowieckie", riverId: "narew" },

  // --- opolskie ---
  { stationName: "Branice", warningLevel: 180, alarmLevel: 240, voivodeship: "opolskie", riverId: "boczne koryto opawy" },
  { stationName: "Branice", warningLevel: 180, alarmLevel: 250, voivodeship: "opolskie", riverId: "opawa" },
  { stationName: "Branice", warningLevel: 180, alarmLevel: 240, voivodeship: "opolskie", riverId: "opawa" },
  { stationName: "Brzeg", warningLevel: 460, alarmLevel: 530, voivodeship: "opolskie", riverId: "odra" },
  { stationName: "Dobra", warningLevel: 140, alarmLevel: 200, voivodeship: "opolskie", riverId: "biała" },
  { stationName: "Gorzów Śląski", warningLevel: 160, alarmLevel: 210, voivodeship: "opolskie", riverId: "prosna" },
  { stationName: "Grabówka", warningLevel: 90, alarmLevel: 140, voivodeship: "opolskie", riverId: "bierawka" },
  { stationName: "Koźle", warningLevel: 400, alarmLevel: 500, voivodeship: "opolskie", riverId: "odra" },
  { stationName: "Krapkowice", warningLevel: 340, alarmLevel: 450, voivodeship: "opolskie", riverId: "odra" },
  { stationName: "Krzywa Góra", warningLevel: 170, alarmLevel: 240, voivodeship: "opolskie", riverId: "budkowiczanka" },
  { stationName: "Lenartowice", warningLevel: 210, alarmLevel: 260, voivodeship: "opolskie", riverId: "kłodnica" },
  { stationName: "Namysłów", warningLevel: 210, alarmLevel: 250, voivodeship: "opolskie", riverId: "widawa" },
  { stationName: "Niemodlin", warningLevel: 320, alarmLevel: 350, voivodeship: "opolskie", riverId: "ścianawa niemodlińska" },
  { stationName: "Opole-Groszowice", warningLevel: 500, alarmLevel: 600, voivodeship: "opolskie", riverId: "odra" },
  { stationName: "Ozimek", warningLevel: 210, alarmLevel: 250, voivodeship: "opolskie", riverId: "mała panew" },
  { stationName: "Prudnik", warningLevel: 180, alarmLevel: 230, voivodeship: "opolskie", riverId: "prudnik" },
  { stationName: "Racławice Śląskie", warningLevel: 300, alarmLevel: 350, voivodeship: "opolskie", riverId: "osobłoga" },
  { stationName: "Ujście Nysy Kłodzkiej", warningLevel: 400, alarmLevel: 530, voivodeship: "opolskie", riverId: "odra" },
  { stationName: "Domaradz", warningLevel: 200, alarmLevel: 250, voivodeship: "opolskie", riverId: "bogacica" },
  { stationName: "Jarnołtówek", warningLevel: 120, alarmLevel: 170, voivodeship: "opolskie", riverId: "złoty potok" },
  { stationName: "Kamionka", warningLevel: 180, alarmLevel: 240, voivodeship: "opolskie", riverId: "stradunia" },
  { stationName: "Kopice", warningLevel: 300, alarmLevel: 380, voivodeship: "opolskie", riverId: "nysa kłodzka" },
  { stationName: "Nysa", warningLevel: 380, alarmLevel: 450, voivodeship: "opolskie", riverId: "nysa kłodzka" },
  { stationName: "Skorogoszcz", warningLevel: 250, alarmLevel: 280, voivodeship: "opolskie", riverId: "nysa kłodzka" },
  { stationName: "Staniszcze Wielkie", warningLevel: 230, alarmLevel: 300, voivodeship: "opolskie", riverId: "mała panew" },
  { stationName: "Turawa", warningLevel: 210, alarmLevel: 250, voivodeship: "opolskie", riverId: "mała panew" },
  { stationName: "Racibórz-Miedonia", warningLevel: 400, alarmLevel: 600, voivodeship: "śląskie", riverId: "Strefa stanów średnich" },

  // --- podkarpackie ---
  { stationName: "Dwernik", warningLevel: 200, alarmLevel: 260, voivodeship: "podkarpackie", riverId: "san" },
  { stationName: "Dynów", warningLevel: 300, alarmLevel: 460, voivodeship: "podkarpackie", riverId: "san" },
  { stationName: "Głowaczowa", warningLevel: 220, alarmLevel: 300, voivodeship: "podkarpackie", riverId: "grąbnika" },
  { stationName: "Grębów", warningLevel: 320, alarmLevel: 400, voivodeship: "podkarpackie", riverId: "łęg" },
  { stationName: "Jarosław", warningLevel: 440, alarmLevel: 620, voivodeship: "podkarpackie", riverId: "san" },
  { stationName: "Kalnica", warningLevel: 370, alarmLevel: 420, voivodeship: "podkarpackie", riverId: "wetlina" },
  { stationName: "Krówniki", warningLevel: 400, alarmLevel: 650, voivodeship: "podkarpackie", riverId: "wiar" },
  { stationName: "Lesko", warningLevel: 250, alarmLevel: 330, voivodeship: "podkarpackie", riverId: "san" },
  { stationName: "Łabuzie", warningLevel: 620, alarmLevel: 810, voivodeship: "podkarpackie", riverId: "pielnica" },
  { stationName: "Nowosielce", warningLevel: 210, alarmLevel: 260, voivodeship: "podkarpackie", riverId: "pielnica" },
  { stationName: "Polana", warningLevel: 380, alarmLevel: 430, voivodeship: "podkarpackie", riverId: "czarna" },
  { stationName: "Przemyśl", warningLevel: 380, alarmLevel: 570, voivodeship: "podkarpackie", riverId: "san" },
  { stationName: "Puławy", warningLevel: 400, alarmLevel: 450, voivodeship: "podkarpackie", riverId: "wisłok" },
  { stationName: "Puławy", warningLevel: 250, alarmLevel: 300, voivodeship: "podkarpackie", riverId: "wisłok" },
  { stationName: "Rybotycze", warningLevel: 270, alarmLevel: 350, voivodeship: "podkarpackie", riverId: "wiar" },
  { stationName: "Sarzyna", warningLevel: 260, alarmLevel: 320, voivodeship: "podkarpackie", riverId: "trzebośnica" },
  { stationName: "Sieniawa", warningLevel: 220, alarmLevel: 280, voivodeship: "podkarpackie", riverId: "wisłok" },
  { stationName: "Terka", warningLevel: 200, alarmLevel: 260, voivodeship: "podkarpackie", riverId: "solinka" },
  { stationName: "Zatwarnica", warningLevel: 250, alarmLevel: 320, voivodeship: "podkarpackie", riverId: "san" },
  { stationName: "Brzeźnica", warningLevel: 270, alarmLevel: 450, voivodeship: "podkarpackie", riverId: "brzeźnica" },
  { stationName: "Cisna", warningLevel: 190, alarmLevel: 240, voivodeship: "podkarpackie", riverId: "solinka" },
  { stationName: "Godowa", warningLevel: 740, alarmLevel: 880, voivodeship: "podkarpackie", riverId: "stobnica" },
  { stationName: "Gorliczyna", warningLevel: 360, alarmLevel: 480, voivodeship: "podkarpackie", riverId: "mleczka" },
  { stationName: "Harasiuki", warningLevel: 270, alarmLevel: 330, voivodeship: "podkarpackie", riverId: "tanew" },
  { stationName: "Hoczew", warningLevel: 200, alarmLevel: 260, voivodeship: "podkarpackie", riverId: "hoczwka" },
  { stationName: "Iskrzynia", warningLevel: 350, alarmLevel: 480, voivodeship: "podkarpackie", riverId: "morwawa" },
  { stationName: "Jasło", warningLevel: 300, alarmLevel: 420, voivodeship: "podkarpackie", riverId: "jasiołka" },
  { stationName: "Koło", warningLevel: 460, alarmLevel: 680, voivodeship: "podkarpackie", riverId: "wisła" }, // Kept due to warning/alarm levels, despite location potential issue
  { stationName: "Krajowice", warningLevel: 330, alarmLevel: 450, voivodeship: "podkarpackie", riverId: "wisłoka" },
  { stationName: "Krempna-Kotań", warningLevel: 360, alarmLevel: 410, voivodeship: "podkarpackie", riverId: "wisłoka" },
  { stationName: "Krosno", warningLevel: 360, alarmLevel: 400, voivodeship: "podkarpackie", riverId: "wisłok" },
  { stationName: "Krosno", warningLevel: 350, alarmLevel: 480, voivodeship: "podkarpackie", riverId: "wisłok" },
  { stationName: "Krościenko", warningLevel: 320, alarmLevel: 390, voivodeship: "podkarpackie", riverId: "strwiąż" },
  { stationName: "Krościenko", warningLevel: 160, alarmLevel: 210, voivodeship: "podkarpackie", riverId: "strwiąż" },
  { stationName: "Mielec 2", warningLevel: 480, alarmLevel: 650, voivodeship: "podkarpackie", riverId: "wisłoka" },
  { stationName: "Nienowice", warningLevel: 340, alarmLevel: 460, voivodeship: "podkarpackie", riverId: "wisznia" },
  { stationName: "Nisko", warningLevel: 370, alarmLevel: 500, voivodeship: "podkarpackie", riverId: "san" },
  { stationName: "Pastwiska", warningLevel: 200, alarmLevel: 250, voivodeship: "podkarpackie", riverId: "wisłok" },
  { stationName: "Pustków", warningLevel: 520, alarmLevel: 720, voivodeship: "podkarpackie", riverId: "wisłoka" },
  { stationName: "Radomyśl", warningLevel: 460, alarmLevel: 620, voivodeship: "podkarpackie", riverId: "san" },
  { stationName: "Ruda Jastkowska", warningLevel: 160, alarmLevel: 240, voivodeship: "podkarpackie", riverId: "bukowa" },
  { stationName: "Rzeszów", warningLevel: 300, alarmLevel: 420, voivodeship: "podkarpackie", riverId: "wisłok" },
  { stationName: "Rzuchów", warningLevel: 570, alarmLevel: 750, voivodeship: "podkarpackie", riverId: "san" },
  { stationName: "Stuposiany", warningLevel: 210, alarmLevel: 250, voivodeship: "podkarpackie", riverId: "wołosaty" },
  { stationName: "Topoliny", warningLevel: 220, alarmLevel: 380, voivodeship: "podkarpackie", riverId: "ropa" },
  { stationName: "Wampierzów", warningLevel: 340, alarmLevel: 450, voivodeship: "podkarpackie", riverId: "breń" },
  { stationName: "Zagórz", warningLevel: 180, alarmLevel: 240, voivodeship: "podkarpackie", riverId: "osława" },
  { stationName: "Zapałów", warningLevel: 250, alarmLevel: 350, voivodeship: "podkarpackie", riverId: "lubaczówka" },
  { stationName: "Zboiska", warningLevel: 250, alarmLevel: 320, voivodeship: "podkarpackie", riverId: "jasiołka" },
  { stationName: "Żarnowa", warningLevel: 400, alarmLevel: 490, voivodeship: "podkarpackie", riverId: "wisłok" },
  { stationName: "Żółków", warningLevel: 220, alarmLevel: 350, voivodeship: "podkarpackie", riverId: "wisłoka" },

  // --- podlaskie ---
  { stationName: "Babino", warningLevel: 540, alarmLevel: 570, voivodeship: "podlaskie", riverId: "narew" },
  { stationName: "Białowieża-Park", warningLevel: 180, alarmLevel: 200, voivodeship: "podlaskie", riverId: "narewka" },
  { stationName: "Chraboły", warningLevel: 310, alarmLevel: 350, voivodeship: "podlaskie", riverId: "orlanka" },
  { stationName: "Czachy", warningLevel: 320, alarmLevel: 360, voivodeship: "podlaskie", riverId: "wissa" },
  { stationName: "Harasimowicze", warningLevel: 590, alarmLevel: 620, voivodeship: "podlaskie", riverId: "sidra" },
  { stationName: "Karpowicze", warningLevel: 290, alarmLevel: 330, voivodeship: "podlaskie", riverId: "brzozówka" },
  { stationName: "Narewka", warningLevel: 260, alarmLevel: 290, voivodeship: "podlaskie", riverId: "narewka" },
  { stationName: "Nowosiółki", warningLevel: 200, alarmLevel: 240, voivodeship: "podlaskie", riverId: "supraśl" },
  { stationName: "Sochonie", warningLevel: 100, alarmLevel: 120, voivodeship: "podlaskie", riverId: "czarna" },
  { stationName: "Sokołda", warningLevel: 250, alarmLevel: 300, voivodeship: "podlaskie", riverId: "sokołda" },
  { stationName: "Suraż", warningLevel: 320, alarmLevel: 340, voivodeship: "podlaskie", riverId: "narew" },
  { stationName: "Zaruzie", warningLevel: 220, alarmLevel: 260, voivodeship: "podlaskie", riverId: "ruż" },
  { stationName: "Białobrzegi", warningLevel: 200, alarmLevel: 250, voivodeship: "podlaskie", riverId: "netta" },
  { stationName: "Białobrzegi", warningLevel: 200, alarmLevel: 240, voivodeship: "podlaskie", riverId: "netta" },
  { stationName: "Brańsk", warningLevel: 250, alarmLevel: 300, voivodeship: "podlaskie", riverId: "nurzec" },
  { stationName: "Burzyn", warningLevel: 380, alarmLevel: 400, voivodeship: "podlaskie", riverId: "biebrza" },
  { stationName: "Dobrylas", warningLevel: 250, alarmLevel: 290, voivodeship: "podlaskie", riverId: "pisa" },
  { stationName: "Fasty", warningLevel: 220, alarmLevel: 250, voivodeship: "podlaskie", riverId: "supraśl" },
  { stationName: "Frankopol", warningLevel: 250, alarmLevel: 350, voivodeship: "podlaskie", riverId: "bug" },
  { stationName: "Kulesze-Chobotki", warningLevel: 330, alarmLevel: 360, voivodeship: "podlaskie", riverId: "nereśl" },
  { stationName: "Narew", warningLevel: 170, alarmLevel: 200, voivodeship: "podlaskie", riverId: "narew" },
  { stationName: "Nowogród", warningLevel: 360, alarmLevel: 400, voivodeship: "podlaskie", riverId: "narew" },
  { stationName: "Osowiec", warningLevel: 400, alarmLevel: 430, voivodeship: "podlaskie", riverId: "biebrza" },
  { stationName: "Osowiec", warningLevel: 460, alarmLevel: 490, voivodeship: "podlaskie", riverId: "biebrza" },
  { stationName: "Piątnica-Łomża", warningLevel: 410, alarmLevel: 460, voivodeship: "podlaskie", riverId: "narew" },
  { stationName: "Ploski", warningLevel: 330, alarmLevel: 370, voivodeship: "podlaskie", riverId: "narew" },
  { stationName: "Przechody", warningLevel: 330, alarmLevel: 360, voivodeship: "podlaskie", riverId: "ełk" },
  { stationName: "Ptaki", warningLevel: 210, alarmLevel: 240, voivodeship: "podlaskie", riverId: "pisa" },
  { stationName: "Rajgród", warningLevel: 225, alarmLevel: 240, voivodeship: "podlaskie", riverId: "lega" },
  { stationName: "Rajgród", warningLevel: 140, alarmLevel: 160, voivodeship: "podlaskie", riverId: "lega" },
  { stationName: "Strękowa Góra", warningLevel: 420, alarmLevel: 440, voivodeship: "podlaskie", riverId: "narew" },
  { stationName: "Supraśl", warningLevel: 220, alarmLevel: 260, voivodeship: "podlaskie", riverId: "supraśl" },
  { stationName: "Sztabin", warningLevel: 270, alarmLevel: 290, voivodeship: "podlaskie", riverId: "biebrza" },
  { stationName: "Wizna", warningLevel: 440, alarmLevel: 470, voivodeship: "podlaskie", riverId: "narew" },
  { stationName: "Zawady", warningLevel: 380, alarmLevel: 400, voivodeship: "podlaskie", riverId: "ślinia" },
  { stationName: "Zawady", warningLevel: 380, alarmLevel: 400, voivodeship: "podlaskie", riverId: "biała" },

  // --- pomorskie ---
  { stationName: "Bożepole Szlacheckie", warningLevel: 150, alarmLevel: 180, voivodeship: "pomorskie", riverId: "wierzyca" },
  { stationName: "Charnowo", warningLevel: 290, alarmLevel: 340, voivodeship: "pomorskie", riverId: "słupia" },
  { stationName: "Gardna Wielka", warningLevel: 570, alarmLevel: 610, voivodeship: "pomorskie", riverId: "jez. gardno (łupawa)" },
  { stationName: "Gdańsk - Port Północny", warningLevel: 550, alarmLevel: 570, voivodeship: "pomorskie", riverId: "morze bałtyckie" },
  { stationName: "Gdańsk - Przegalina", warningLevel: 650, alarmLevel: 700, voivodeship: "pomorskie", riverId: "wisła" },
  { stationName: "Gdańsk - Sobieszewo", warningLevel: 550, alarmLevel: 570, voivodeship: "pomorskie", riverId: "martwa wisła" },
  { stationName: "Gdańsk - Świbno", warningLevel: 600, alarmLevel: 680, voivodeship: "pomorskie", riverId: "wisła" },
  { stationName: "Gdańsk - Ujście Wisły", warningLevel: 600, alarmLevel: 680, voivodeship: "pomorskie", riverId: "wisła" },
  { stationName: "Gdańska Głowa", warningLevel: 730, alarmLevel: 810, voivodeship: "pomorskie", riverId: "wisła" },
  { stationName: "Gdynia", warningLevel: 550, alarmLevel: 570, voivodeship: "pomorskie", riverId: "morze bałtyckie" },
  { stationName: "Hel", warningLevel: 550, alarmLevel: 570, voivodeship: "pomorskie", riverId: "morze bałtyckie" },
  { stationName: "Kwidzyn", warningLevel: 300, alarmLevel: 340, voivodeship: "pomorskie", riverId: "liwa" },
  { stationName: "Lębork 2", warningLevel: 150, alarmLevel: 200, voivodeship: "pomorskie", riverId: "leba" },
  { stationName: "Nowy Dwór Gdański", warningLevel: 570, alarmLevel: 590, voivodeship: "pomorskie", riverId: "tuga" },
  { stationName: "Osłonka", warningLevel: 570, alarmLevel: 590, voivodeship: "pomorskie", riverId: "zalew wiślany" },
  { stationName: "Puck", warningLevel: 550, alarmLevel: 570, voivodeship: "pomorskie", riverId: "morze bałtyckie" },
  { stationName: "Słupsk", warningLevel: 220, alarmLevel: 260, voivodeship: "pomorskie", riverId: "słupia" },
  { stationName: "Smołdzino", warningLevel: 170, alarmLevel: 200, voivodeship: "pomorskie", riverId: "łupawa" },
  { stationName: "Soszyca", warningLevel: 120, alarmLevel: 140, voivodeship: "pomorskie", riverId: "słupia" },
  { stationName: "Suchy Dąb", warningLevel: 600, alarmLevel: 620, voivodeship: "pomorskie", riverId: "bielawa" },
  { stationName: "Tczew", warningLevel: 820, alarmLevel: 850, voivodeship: "pomorskie", riverId: "wisła" },
  { stationName: "Tczew", warningLevel: 700, alarmLevel: 820, voivodeship: "pomorskie", riverId: "wisła" },
  { stationName: "Tujsk", warningLevel: 570, alarmLevel: 590, voivodeship: "pomorskie", riverId: "szkarpawa" },
  { stationName: "Ustka", warningLevel: 570, alarmLevel: 600, voivodeship: "pomorskie", riverId: "morze bałtyckie" },
  { stationName: "Wejherowo", warningLevel: 130, alarmLevel: 160, voivodeship: "pomorskie", riverId: "reda" },
  { stationName: "Władysławowo", warningLevel: 550, alarmLevel: 570, voivodeship: "pomorskie", riverId: "morze bałtyckie" },
  { stationName: "Brody Pomorskie", warningLevel: 320, alarmLevel: 350, voivodeship: "pomorskie", riverId: "wierzyca" },
  { stationName: "Ciecholewy", warningLevel: 210, alarmLevel: 240, voivodeship: "pomorskie", riverId: "brda" },
  { stationName: "Czarna Woda", warningLevel: 130, alarmLevel: 150, voivodeship: "pomorskie", riverId: "wda" },
  { stationName: "Goręczyno", warningLevel: 210, alarmLevel: 240, voivodeship: "pomorskie", riverId: "radunia" },
  { stationName: "Korzybie", warningLevel: 130, alarmLevel: 160, voivodeship: "pomorskie", riverId: "wieprza" },
  { stationName: "Łupawa", warningLevel: 130, alarmLevel: 160, voivodeship: "pomorskie", riverId: "łupawa" },
  { stationName: "Miłoszewo", warningLevel: 250, alarmLevel: 260, voivodeship: "pomorskie", riverId: "leba" },

  // --- śląskie ---
  { stationName: "Bieruń Nowy", warningLevel: 220, alarmLevel: 330, voivodeship: "śląskie", riverId: "wisła" },
  { stationName: "Brynica", warningLevel: 180, alarmLevel: 220, voivodeship: "śląskie", riverId: "brynica" },
  { stationName: "Chałupki", warningLevel: 300, alarmLevel: 420, voivodeship: "śląskie", riverId: "odra" },
  { stationName: "Cieszyn", warningLevel: 140, alarmLevel: 230, voivodeship: "śląskie", riverId: "olza" },
  { stationName: "Cieszyn", warningLevel: 140, alarmLevel: 230, voivodeship: "śląskie", riverId: "młynówka" },
  { stationName: "Czechowice-Bestwina", warningLevel: 190, alarmLevel: 260, voivodeship: "śląskie", riverId: "biała" },
  { stationName: "Goczałkowice", warningLevel: 290, alarmLevel: 410, voivodeship: "śląskie", riverId: "wisła" },
  { stationName: "Goczałkowice", warningLevel: 290, alarmLevel: 410, voivodeship: "śląskie", riverId: "szczynka" },
  { stationName: "Górki Wielkie", warningLevel: 220, alarmLevel: 260, voivodeship: "śląskie", riverId: "brennica" },
  { stationName: "Istebna", warningLevel: 190, alarmLevel: 210, voivodeship: "śląskie", riverId: "olza" },
  { stationName: "Kamesznica", warningLevel: 210, alarmLevel: 260, voivodeship: "śląskie", riverId: "bystrza" },
  { stationName: "Olza", warningLevel: 500, alarmLevel: 610, voivodeship: "śląskie", riverId: "odra" },
  { stationName: "Przeczyce", warningLevel: 100, alarmLevel: 150, voivodeship: "śląskie", riverId: "czarna" },
  { stationName: "Pszczyna", warningLevel: 290, alarmLevel: 340, voivodeship: "śląskie", riverId: "pszczynka" },
  { stationName: "Racibórz-Miedonia", warningLevel: 400, alarmLevel: 600, voivodeship: "śląskie", riverId: "odra" },
  { stationName: "Radocha", warningLevel: 90, alarmLevel: 130, voivodeship: "śląskie", riverId: "przemsza" },
  { stationName: "Wisła", warningLevel: 150, alarmLevel: 180, voivodeship: "śląskie", riverId: "soła" },
  { stationName: "Wisła", warningLevel: 150, alarmLevel: 180, voivodeship: "śląskie", riverId: "wisła" },
  { stationName: "Wisła-Czarne (Biała Wisełka)", warningLevel: 90, alarmLevel: 110, voivodeship: "śląskie", riverId: "biała wisełka" },
  { stationName: "Bojanów", warningLevel: 150, alarmLevel: 210, voivodeship: "śląskie", riverId: "pśina" },
  { stationName: "Czechowice-Dziedzice", warningLevel: 330, alarmLevel: 420, voivodeship: "śląskie", riverId: "iłówka" },
  { stationName: "Kozłowa Góra", warningLevel: 90, alarmLevel: 120, voivodeship: "śląskie", riverId: "brynica" },
  { stationName: "Krupski Młyn", warningLevel: 160, alarmLevel: 250, voivodeship: "śląskie", riverId: "mała panew" },
  { stationName: "Kule", warningLevel: 250, alarmLevel: 300, voivodeship: "śląskie", riverId: "liswarta" },
  { stationName: "Kuźnica Sulikowska", warningLevel: 210, alarmLevel: 260, voivodeship: "śląskie", riverId: "mitręga" },
  { stationName: "Pewel Mała", warningLevel: 150, alarmLevel: 230, voivodeship: "śląskie", riverId: "koszarawa" },
  { stationName: "Rajcza", warningLevel: 290, alarmLevel: 370, voivodeship: "śląskie", riverId: "soła" },
  { stationName: "Ruda Kozielska", warningLevel: 250, alarmLevel: 310, voivodeship: "śląskie", riverId: "ruda" },
  { stationName: "Szabelnia", warningLevel: 70, alarmLevel: 100, voivodeship: "śląskie", riverId: "brynica" },
  { stationName: "Ujsoły", warningLevel: 270, alarmLevel: 320, voivodeship: "śląskie", riverId: "woda ujsołska" },
  { stationName: "Wisła-Czarne", warningLevel: 100, alarmLevel: 120, voivodeship: "śląskie", riverId: "wisła" },
  { stationName: "Żabnica", warningLevel: 160, alarmLevel: 200, voivodeship: "śląskie", riverId: "żabniczanka" },
  { stationName: "Żywiec", warningLevel: 280, alarmLevel: 340, voivodeship: "śląskie", riverId: "soła" },
  { stationName: "Niwka", warningLevel: 260, alarmLevel: 280, voivodeship: "śląskie", riverId: "biała przemsza" },
  { stationName: "Bojszowy", warningLevel: 170, alarmLevel: 230, voivodeship: "śląskie", riverId: "pszczynka" },

  // --- świętokrzyskie ---
  { stationName: "Bocheniec", warningLevel: 320, alarmLevel: 370, voivodeship: "świętokrzyskie", riverId: "wierna rzeka" },
  { stationName: "Brody Iłżeckie", warningLevel: 200, alarmLevel: 270, voivodeship: "świętokrzyskie", riverId: "kamienna" },
  { stationName: "Czekarzewice", warningLevel: 160, alarmLevel: 220, voivodeship: "świętokrzyskie", riverId: "kamienna" },
  { stationName: "Daleszyce", warningLevel: 200, alarmLevel: 260, voivodeship: "świętokrzyskie", riverId: "czarna nida" },
  { stationName: "Januszewice", warningLevel: 360, alarmLevel: 410, voivodeship: "świętokrzyskie", riverId: "czarna" },
  { stationName: "Koprzywnica", warningLevel: 290, alarmLevel: 360, voivodeship: "świętokrzyskie", riverId: "koprzywianka" },
  { stationName: "Kunów", warningLevel: 200, alarmLevel: 300, voivodeship: "świętokrzyskie", riverId: "kamienna" },
  { stationName: "Michałów", warningLevel: 110, alarmLevel: 170, voivodeship: "świętokrzyskie", riverId: "kamienna" },
  { stationName: "Michałów", warningLevel: 160, alarmLevel: 190, voivodeship: "świętokrzyskie", riverId: "kamienna" },
  { stationName: "Mniszek", warningLevel: 270, alarmLevel: 310, voivodeship: "świętokrzyskie", riverId: "nida" },
  { stationName: "Mocha", warningLevel: 370, alarmLevel: 420, voivodeship: "świętokrzyskie", riverId: "łagowica" },
  { stationName: "Nietulisko Duże", warningLevel: 460, alarmLevel: 510, voivodeship: "świętokrzyskie", riverId: "świslina" },
  { stationName: "Słowik", warningLevel: 260, alarmLevel: 300, voivodeship: "świętokrzyskie", riverId: "bobrza" },
  { stationName: "Staszów", warningLevel: 220, alarmLevel: 260, voivodeship: "świętokrzyskie", riverId: "czarna" },
  { stationName: "Brzegi", warningLevel: 240, alarmLevel: 300, voivodeship: "świętokrzyskie", riverId: "nida" },
  { stationName: "Bzin", warningLevel: 180, alarmLevel: 230, voivodeship: "świętokrzyskie", riverId: "kamienna" },
  { stationName: "Michałów", warningLevel: 110, alarmLevel: 170, voivodeship: "świętokrzyskie", riverId: "mierzawa" },
  { stationName: "Michałów", warningLevel: 160, alarmLevel: 190, voivodeship: "świętokrzyskie", riverId: "mierzawa" },
  { stationName: "Morawica", warningLevel: 250, alarmLevel: 340, voivodeship: "świętokrzyskie", riverId: "czarna nida" },
  { stationName: "Połaniec", warningLevel: 290, alarmLevel: 350, voivodeship: "świętokrzyskie", riverId: "czarna" },
  { stationName: "Raków", warningLevel: 220, alarmLevel: 260, voivodeship: "świętokrzyskie", riverId: "czarna" },
  { stationName: "Rzepin", warningLevel: 400, alarmLevel: 420, voivodeship: "świętokrzyskie", riverId: "świslina" },
  { stationName: "Sandomierz", warningLevel: 580, alarmLevel: 630, voivodeship: "świętokrzyskie", riverId: "wisła" },
  { stationName: "Sandomierz", warningLevel: 420, alarmLevel: 610, voivodeship: "świętokrzyskie", riverId: "wisła" },
  { stationName: "Tokarnia", warningLevel: 240, alarmLevel: 300, voivodeship: "świętokrzyskie", riverId: "czarna nida" },
  { stationName: "Wąchock", warningLevel: 140, alarmLevel: 190, voivodeship: "świętokrzyskie", riverId: "kamienna" },
  { stationName: "Włochy", warningLevel: 300, alarmLevel: 450, voivodeship: "świętokrzyskie", riverId: "pokrzywianka" },
  { stationName: "Zawichost", warningLevel: 480, alarmLevel: 620, voivodeship: "świętokrzyskie", riverId: "wisła" },
  { stationName: "Pińczów", warningLevel: 250, alarmLevel: 300, voivodeship: "świętokrzyskie", riverId: "nida" },

  // --- warmińsko-mazurskie ---
  { stationName: "Iława", warningLevel: 930, alarmLevel: 940, voivodeship: "warmińsko-mazurskie", riverId: "jez. jeziorak" },
  { stationName: "Bornity", warningLevel: 380, alarmLevel: 440, voivodeship: "warmińsko-mazurskie", riverId: "wałsza" },
  { stationName: "Braniewo", warningLevel: 720, alarmLevel: 780, voivodeship: "warmińsko-mazurskie", riverId: "pasłęka" },
  { stationName: "Dziarny", warningLevel: 130, alarmLevel: 140, voivodeship: "warmińsko-mazurskie", riverId: "iławka" },
  { stationName: "Elbląg", warningLevel: 590, alarmLevel: 610, voivodeship: "warmińsko-mazurskie", riverId: "elbląg" },
  { stationName: "Ełk", warningLevel: 220, alarmLevel: 235, voivodeship: "warmińsko-mazurskie", riverId: "jez. ełckie" },
  { stationName: "Ełk", warningLevel: 200, alarmLevel: 230, voivodeship: "warmińsko-mazurskie", riverId: "jez. ełckie" },
  { stationName: "Gołdap 2", warningLevel: 180, alarmLevel: 210, voivodeship: "warmińsko-mazurskie", riverId: "gołdapa" },
  { stationName: "Jurkiszki", warningLevel: 180, alarmLevel: 210, voivodeship: "warmińsko-mazurskie", riverId: "gołdapa" },
  { stationName: "Krosno", warningLevel: 360, alarmLevel: 400, voivodeship: "warmińsko-mazurskie", riverId: "drwęca warmińska" },
  { stationName: "Krosno", warningLevel: 350, alarmLevel: 480, voivodeship: "warmińsko-mazurskie", riverId: "drwęca warmińska" },
  { stationName: "Kuligi", warningLevel: 150, alarmLevel: 180, voivodeship: "warmińsko-mazurskie", riverId: "wel" },
  { stationName: "Lidzbark", warningLevel: 110, alarmLevel: 120, voivodeship: "warmińsko-mazurskie", riverId: "wel" },
  { stationName: "Łozy", warningLevel: 280, alarmLevel: 330, voivodeship: "warmińsko-mazurskie", riverId: "pasłęka" },
  { stationName: "Łozy", warningLevel: 350, alarmLevel: 400, voivodeship: "warmińsko-mazurskie", riverId: "pasłęka" },
  { stationName: "Nowa Pasłęka", warningLevel: 590, alarmLevel: 630, voivodeship: "warmińsko-mazurskie", riverId: "zalew wiślany" },
  { stationName: "Nowakowo", warningLevel: 590, alarmLevel: 630, voivodeship: "warmińsko-mazurskie", riverId: "zalew wiślany" },
  { stationName: "Nowe Miasto Lubawskie", warningLevel: 330, alarmLevel: 340, voivodeship: "warmińsko-mazurskie", riverId: "drwęca" },
  { stationName: "Nowe Sadłuki", warningLevel: 300, alarmLevel: 390, voivodeship: "warmińsko-mazurskie", riverId: "bauda" },
  { stationName: "Nowotki", warningLevel: 570, alarmLevel: 590, voivodeship: "warmińsko-mazurskie", riverId: "nogat" },
  { stationName: "Ostróda", warningLevel: 500, alarmLevel: 510, voivodeship: "warmińsko-mazurskie", riverId: "jez. drwęckie (drwęca)" },
  { stationName: "Pasłęk", warningLevel: 620, alarmLevel: 630, voivodeship: "warmińsko-mazurskie", riverId: "wąska" },
  { stationName: "Rodzone", warningLevel: 280, alarmLevel: 320, voivodeship: "warmińsko-mazurskie", riverId: "drwęca" },
  { stationName: "Sępopol", warningLevel: 420, alarmLevel: 450, voivodeship: "warmińsko-mazurskie", riverId: "łyna" },
  { stationName: "Tolkmicko", warningLevel: 590, alarmLevel: 630, voivodeship: "warmińsko-mazurskie", riverId: "zalew wiślany" },
  { stationName: "Banie Mazurskie", warningLevel: 260, alarmLevel: 290, voivodeship: "warmińsko-mazurskie", riverId: "gołdapa" },
  { stationName: "Giżycko", warningLevel: 130, alarmLevel: 150, voivodeship: "warmińsko-mazurskie", riverId: "pisa" },
  { stationName: "Kalisty", warningLevel: 170, alarmLevel: 190, voivodeship: "warmińsko-mazurskie", riverId: "pasłęka" },
  { stationName: "Maldanin", warningLevel: 140, alarmLevel: 160, voivodeship: "warmińsko-mazurskie", riverId: "jez. roś (pisa)" },
  { stationName: "Mieduniszki", warningLevel: 400, alarmLevel: 450, voivodeship: "warmińsko-mazurskie", riverId: "węgorapa" },
  { stationName: "Mikołajki", warningLevel: 110, alarmLevel: 120, voivodeship: "warmińsko-mazurskie", riverId: "jez. mikołajskie (pisa)" },
  { stationName: "Olsztyn-Kortowo", warningLevel: 140, alarmLevel: 160, voivodeship: "warmińsko-mazurskie", riverId: "łyna" },
  { stationName: "Pisz", warningLevel: 270, alarmLevel: 290, voivodeship: "warmińsko-mazurskie", riverId: "pisa" },
  { stationName: "Prosna", warningLevel: 300, alarmLevel: 330, voivodeship: "warmińsko-mazurskie", riverId: "guber" },
  { stationName: "Prostki", warningLevel: 190, alarmLevel: 220, voivodeship: "warmińsko-mazurskie", riverId: "ełk" },
  { stationName: "Prynowo", warningLevel: 250, alarmLevel: 280, voivodeship: "warmińsko-mazurskie", riverId: "węgorapa" },
  { stationName: "Przystań", warningLevel: 160, alarmLevel: 180, voivodeship: "warmińsko-mazurskie", riverId: "jez. mamry (węgorapa)" },
  { stationName: "Tomaryny", warningLevel: 280, alarmLevel: 300, voivodeship: "warmińsko-mazurskie", riverId: "pasłęka" },
  { stationName: "Węgorzewo", warningLevel: 250, alarmLevel: 280, voivodeship: "warmińsko-mazurskie", riverId: "węgorapa" },

// --- Dolnośląskie ---
 { stationName: "Brzeg Dolny", warningLevel: 510, alarmLevel: 630, voivodeship: "dolnośląskie", riverId: "odra" },

];

/**
 * Funkcja znajdująca dane poziomów dla określonej stacji
 * @param {string} stationName - Nazwa stacji
 * @param {string} [voivodeship] - Opcjonalnie: województwo dla lepszego dopasowania
 * @param {string} [riverName] - Opcjonalnie: nazwa rzeki dla lepszego dopasowania
 * @returns {Object|null} - Dane poziomów lub null jeśli nie znaleziono
 */
export const findStationLevels = (stationName, voivodeship = null, riverName = null) => {
  if (!stationName) return null;

  const normalizedRiver = riverName ? normalizeRiverName(riverName).toLowerCase() : null;
  const normalizedStation = stationName.toLowerCase();
  const normalizedVoivodeship = voivodeship ? voivodeship.toLowerCase() : null;

  // 1. Najpierw próbujemy znaleźć dokładne dopasowanie z województwem i rzeką
  if (normalizedVoivodeship && normalizedRiver) {
    const exactMatchWithDetails = HYDRO_LEVELS.find(
      station =>
        station.stationName.toLowerCase() === normalizedStation &&
        station.voivodeship?.toLowerCase() === normalizedVoivodeship &&
        station.riverId?.toLowerCase() === normalizedRiver
    );
    if (exactMatchWithDetails) return exactMatchWithDetails;
  }

  // 2. Próba znalezienia dokładnego dopasowania z województwem (sprawdzamy wszystkie rzeki dla danej nazwy i województwa)
  if (normalizedVoivodeship) {
     const matchesWithVoivodeship = HYDRO_LEVELS.filter(
      station =>
        station.stationName.toLowerCase() === normalizedStation &&
        station.voivodeship?.toLowerCase() === normalizedVoivodeship
    );
    // Jeśli jest dokładnie jedno dopasowanie z województwem, zwracamy je
    if (matchesWithVoivodeship.length === 1) return matchesWithVoivodeship[0];
    // Jeśli jest więcej niż jedno, ale znamy rzekę, próbujemy dopasować
    if (matchesWithVoivodeship.length > 1 && normalizedRiver) {
        const specificRiverMatch = matchesWithVoivodeship.find(
            station => station.riverId?.toLowerCase() === normalizedRiver
        );
        if (specificRiverMatch) return specificRiverMatch;
        // Jeśli rzeka nie pasuje, ale jest tylko jedno dopasowanie z województwem, możemy je zwrócić jako najlepszy kandydat
         if (matchesWithVoivodeship.length === 1) return matchesWithVoivodeship[0];
         // Jeśli nadal jest wiele, zwracamy pierwsze jako domyślne dla tego województwa
         if (matchesWithVoivodeship.length > 0) return matchesWithVoivodeship[0];

    } else if (matchesWithVoivodeship.length > 0) {
         // Jeśli nie znamy rzeki, a jest wiele dopasowań, zwracamy pierwsze jako domyślne
         return matchesWithVoivodeship[0];
    }

  }

  // 3. Próba znalezienia dokładnego dopasowania z rzeką (sprawdzamy we wszystkich województwach)
  if (normalizedRiver) {
     const matchesWithRiver = HYDRO_LEVELS.filter(
      station =>
        station.stationName.toLowerCase() === normalizedStation &&
        station.riverId?.toLowerCase() === normalizedRiver
    );
     // Jeśli jest dokładnie jedno dopasowanie z rzeką, zwracamy je
     if (matchesWithRiver.length === 1) return matchesWithRiver[0];
      // Jeśli jest więcej niż jedno, ale znamy województwo, próbujemy dopasować
     if (matchesWithRiver.length > 1 && normalizedVoivodeship) {
         const specificVoivodeshipMatch = matchesWithRiver.find(
             station => station.voivodeship?.toLowerCase() === normalizedVoivodeship
         );
         if (specificVoivodeshipMatch) return specificVoivodeshipMatch;
         // Jeśli województwo nie pasuje, zwracamy pierwsze jako domyślne dla tej rzeki
          if (matchesWithRiver.length > 0) return matchesWithRiver[0];
     } else if (matchesWithRiver.length > 0) {
         // Jeśli nie znamy województwa, a jest wiele dopasowań, zwracamy pierwsze jako domyślne
         return matchesWithRiver[0];
     }
  }

  // 4. Próbujemy znaleźć dokładne dopasowanie samej nazwy stacji (pierwsze wystąpienie)
  const exactNameMatches = HYDRO_LEVELS.filter(
    station => station.stationName.toLowerCase() === normalizedStation
  );
  if (exactNameMatches.length === 1) return exactNameMatches[0];
  if (exactNameMatches.length > 1) {
      // Jeśli jest wiele stacji o tej samej nazwie, ale mamy dodatkowe info, próbujemy zawęzić
       if (normalizedVoivodeship && normalizedRiver) {
            const specificMatch = exactNameMatches.find(s => s.voivodeship?.toLowerCase() === normalizedVoivodeship && s.riverId?.toLowerCase() === normalizedRiver);
            if (specificMatch) return specificMatch;
        }
       if (normalizedVoivodeship) {
           const voivodeshipMatch = exactNameMatches.find(s => s.voivodeship?.toLowerCase() === normalizedVoivodeship);
           if (voivodeshipMatch) return voivodeshipMatch;
       }
       if (normalizedRiver) {
           const riverMatch = exactNameMatches.find(s => s.riverId?.toLowerCase() === normalizedRiver);
           if (riverMatch) return riverMatch;
       }
       // Jeśli nadal nie udało się zawęzić, zwracamy pierwsze znalezione
       return exactNameMatches[0];
  }


  // --- Wyszukiwanie częściowe ---
  // 5. Jeśli nie znaleziono dokładnego dopasowania, szukaj częściowego
  let partialMatches = HYDRO_LEVELS.filter(
    station => station.stationName.toLowerCase().includes(normalizedStation) ||
              normalizedStation.includes(station.stationName.toLowerCase())
  );

  // 6. Jeśli mamy wiele częściowych dopasowań i znamy województwo, filtrujemy dalej
  if (partialMatches.length > 1 && normalizedVoivodeship) {
    const voivodeshipMatches = partialMatches.filter(
      station => station.voivodeship?.toLowerCase() === normalizedVoivodeship
    );
    if (voivodeshipMatches.length > 0) {
      partialMatches = voivodeshipMatches;
    }
  }

  // 7. Jeśli nadal mamy wiele dopasowań i znamy rzekę, filtrujemy dalej
  if (partialMatches.length > 1 && normalizedRiver) {
    const riverMatches = partialMatches.filter(
      station => station.riverId?.toLowerCase() === normalizedRiver
    );
    if (riverMatches.length > 0) {
      partialMatches = riverMatches;
    }
  }

  // 8. Zwracamy pierwsze znalezione dopasowanie częściowe lub null
  return partialMatches.length > 0 ? partialMatches[0] : null;
};


/**
 * Normalizuje nazwę rzeki do jednolitego formatu (bez polskich znaków, spacji, myślników)
 * @param {string} riverName - Nazwa rzeki
 * @returns {string} - Znormalizowana nazwa rzeki
 */
const normalizeRiverName = (riverName) => {
  if (!riverName) return '';

  return riverName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Usuń znaki diakrytyczne
    .replace(/ł/g, "l") // Zamień ł na l
    // .replace(/[ąćęłńóśźż]/g, char => { // Usunięte, bo normalize NFD + replace diacritics jest lepsze
    //   const replacements = { 'ą': 'a', 'ć': 'c', 'ę': 'e', /*'ł': 'l',*/ 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z' };
    //   return replacements[char] || char;
    // })
    .replace(/[\s\-()]/g, ''); // Usuń spacje, myślniki i nawiasy
};
