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
/**
 * Dane poziomów hydrologicznych dla poszczególnych stacji.
 * Zawiera informacje o stanach alarmowych i ostrzegawczych.
 *
 * Struktura:
 * {
 *   id: number - unikalny identyfikator stacji
 *   stationName: string - nazwa stacji
 *   warningLevel: number - stan ostrzegawczy w cm
 *   alarmLevel: number - stan alarmowy w cm
 *   voivodeship: string - województwo
 *   riverId: string - znormalizowana nazwa rzeki (ID)
 * }
 */

export const HYDRO_LEVELS = [
      // --- dolnośląskie ---
  { id: 150160180, stationName: "Kłodzko", warningLevel: 160, alarmLevel: 240, voivodeship: "dolnośląskie", riverId: "Nysa Kłodzka" },
  { id: 151150060, stationName: "Leśna", warningLevel: 70, alarmLevel: 100, voivodeship: "dolnośląskie", riverId: "Kwisa" },
  { id: 150160070, stationName: "Lubachów", warningLevel: 210, alarmLevel: 230, voivodeship: "dolnośląskie", riverId: "Bystrzyca" },
  { id: 150150060, stationName: "Pilchowice", warningLevel: 100, alarmLevel: 140, voivodeship: "dolnośląskie", riverId: "Bóbr" },
  { id: 150150040, stationName: "Barcinek", warningLevel: 80, alarmLevel: 110, voivodeship: "dolnośląskie", riverId: "Kamienica" },
  { id: 150160220, stationName: "Bardo", warningLevel: 180, alarmLevel: 250, voivodeship: "dolnośląskie", riverId: "Nysa Kłodzka" },
  { id: 150160250, stationName: "Białobrzezie", warningLevel: 90, alarmLevel: 120, voivodeship: "dolnośląskie", riverId: "Ślęza" },
  { id: 150140100, stationName: "Bogatynia", warningLevel: 100, alarmLevel: 125, voivodeship: "dolnośląskie", riverId: "Miedzianka" },
  { id: 150160280, stationName: "Borów", warningLevel: 160, alarmLevel: 200, voivodeship: "dolnośląskie", riverId: "Ślęza" },
  { id: 151160170, stationName: "Brzeg dolny", warningLevel: 510, alarmLevel: 630, voivodeship: "dolnośląskie", riverId: "Odra" },
  { id: 151160040, stationName: "Bukowna", warningLevel: 120, alarmLevel: 150, voivodeship: "dolnośląskie", riverId: "Czarna Woda" },
  { id: 150150120, stationName: "Bukówka", warningLevel: 150, alarmLevel: 180, voivodeship: "dolnośląskie", riverId: "Bóbr" },
  { id: 150160150, stationName: "Bystrzyca Kłodzka", warningLevel: 80, alarmLevel: 120, voivodeship: "dolnośląskie", riverId: "Bystrzyca" },
  { id: 150160170, stationName: "Bystrzyca Kłodzka", warningLevel: 110, alarmLevel: 180, voivodeship: "dolnośląskie", riverId: "Nysa Kłodzka" },
  { id: 151150180, stationName: "Chojnów", warningLevel: 120, alarmLevel: 150, voivodeship: "dolnośląskie", riverId: "Skora" },
  { id: 150160030, stationName: "Chwaliszów", warningLevel: 200, alarmLevel: 250, voivodeship: "dolnośląskie", riverId: "Strzegomka" },
  { id: 151150140, stationName: "Dąbrowa Bolesławiecka", warningLevel: 300, alarmLevel: 350, voivodeship: "dolnośląskie", riverId: "Bóbr" },
  { id: 150160140, stationName: "Dzierżoniów", warningLevel: 280, alarmLevel: 300, voivodeship: "dolnośląskie", riverId: "Piława" },
  { id: 151160060, stationName: "Głogów", warningLevel: 400, alarmLevel: 450, voivodeship: "dolnośląskie", riverId: "Odra" },
  { id: 150160290, stationName: "Gniechowice", warningLevel: 150, alarmLevel: 180, voivodeship: "dolnośląskie", riverId: "Czarna Woda" },
  { id: 150160100, stationName: "Gorzuchów", warningLevel: 120, alarmLevel: 160, voivodeship: "dolnośląskie", riverId: "Ścinawka" },
  { id: 151150110, stationName: "Gryfów Śląski", warningLevel: 220, alarmLevel: 260, voivodeship: "dolnośląskie", riverId: "Kwisa" },
  { id: 150150030, stationName: "Jakuszyce", warningLevel: 80, alarmLevel: 120, voivodeship: "dolnośląskie", riverId: "Kamienna" },
  { id: 151160190, stationName: "Jarnołtów", warningLevel: 230, alarmLevel: 270, voivodeship: "dolnośląskie", riverId: "Bystrzyca" },
  { id: 151160090, stationName: "Jawor", warningLevel: 100, alarmLevel: 150, voivodeship: "dolnośląskie", riverId: "Nysa Szalona" },
  { id: 150150070, stationName: "Jelenia Góra", warningLevel: 160, alarmLevel: 200, voivodeship: "dolnośląskie", riverId: "Kamienna" },
  { id: 150150080, stationName: "Jelenia Góra", warningLevel: 160, alarmLevel: 220, voivodeship: "dolnośląskie", riverId: "Bóbr" },
  { id: 150160060, stationName: "Jugowice", warningLevel: 180, alarmLevel: 230, voivodeship: "dolnośląskie", riverId: "Bystrzyca" },
  { id: 150160010, stationName: "Kamienna Góra", warningLevel: 120, alarmLevel: 180, voivodeship: "dolnośląskie", riverId: "Bóbr" },
  { id: 151160220, stationName: "Kancierowice", warningLevel: 230, alarmLevel: 260, voivodeship: "dolnośląskie", riverId: "Sąsiecznica" },
  { id: 151160200, stationName: "Korzeńsko", warningLevel: 220, alarmLevel: 260, voivodeship: "dolnośląskie", riverId: "Orla" },
  { id: 150150110, stationName: "Kowary", warningLevel: 100, alarmLevel: 150, voivodeship: "dolnośląskie", riverId: "Jedlica" },
  { id: 150160120, stationName: "Krasków", warningLevel: 200, alarmLevel: 250, voivodeship: "dolnośląskie", riverId: "Bystrzyca" },
  { id: 151170040, stationName: "Łąki", warningLevel: 280, alarmLevel: 310, voivodeship: "dolnośląskie", riverId: "Barycz" },
  { id: 150150020, stationName: "Mirsk", warningLevel: 160, alarmLevel: 200, voivodeship: "dolnośląskie", riverId: "Czarny Potok" },
  { id: 150160130, stationName: "Mościsko", warningLevel: 220, alarmLevel: 250, voivodeship: "dolnośląskie", riverId: "Piława" },
  { id: 151150100, stationName: "Nowogrodziec", warningLevel: 330, alarmLevel: 380, voivodeship: "dolnośląskie", riverId: "Kwisa" },
  { id: 150170030, stationName: "Oława", warningLevel: 200, alarmLevel: 250, voivodeship: "dolnośląskie", riverId: "Oława" },
  { id: 150170040, stationName: "Oława", warningLevel: 500, alarmLevel: 560, voivodeship: "dolnośląskie", riverId: "Odra" },
  { id: 151160140, stationName: "Osetno", warningLevel: 260, alarmLevel: 330, voivodeship: "dolnośląskie", riverId: "Barycz" },
  { id: 151150020, stationName: "Ostróżno", warningLevel: 250, alarmLevel: 300, voivodeship: "dolnośląskie", riverId: "Witka" },
  { id: 151160100, stationName: "Piątnica", warningLevel: 300, alarmLevel: 370, voivodeship: "dolnośląskie", riverId: "Kaczawa" },
  { id: 150150050, stationName: "Piechowice", warningLevel: 150, alarmLevel: 200, voivodeship: "dolnośląskie", riverId: "Kamienna" },
  { id: 150150190, stationName: "Podgórzyn", warningLevel: 290, alarmLevel: 320, voivodeship: "dolnośląskie", riverId: "Podgórna" },
  { id: 150140010, stationName: "Porajów", warningLevel: 120, alarmLevel: 160, voivodeship: "dolnośląskie", riverId: "Nysa Łużycka" },
  { id: 151140050, stationName: "Ręczyn", warningLevel: 350, alarmLevel: 380, voivodeship: "dolnośląskie", riverId: "Witka" },
  { id: 151160080, stationName: "Rzeszotary", warningLevel: 200, alarmLevel: 230, voivodeship: "dolnośląskie", riverId: "Czarna Woda" },
  { id: 150150200, stationName: "Sosnówka", warningLevel: 60, alarmLevel: 80, voivodeship: "dolnośląskie", riverId: "Sośniak" },
  { id: 151160130, stationName: "Ścinawa", warningLevel: 350, alarmLevel: 400, voivodeship: "dolnośląskie", riverId: "Odra" },
  { id: 151160230, stationName: "Ślęza", warningLevel: 270, alarmLevel: 300, voivodeship: "dolnośląskie", riverId: "Ślęza" },
  { id: 150160020, stationName: "Świebodzice", warningLevel: 140, alarmLevel: 160, voivodeship: "dolnośląskie", riverId: "Pełcznica" },
  { id: 151150170, stationName: "Świerzawa", warningLevel: 150, alarmLevel: 220, voivodeship: "dolnośląskie", riverId: "Kaczawa" },
  { id: 151170030, stationName: "Trestno", warningLevel: 380, alarmLevel: 450, voivodeship: "dolnośląskie", riverId: "Odra" },
  { id: 150140030, stationName: "Turoszów", warningLevel: 360, alarmLevel: 420, voivodeship: "dolnośląskie", riverId: "Miedzianka" },
  { id: 151160070, stationName: "Winnica", warningLevel: 80, alarmLevel: 100, voivodeship: "dolnośląskie", riverId: "Nysa Szalona" },
  { id: 150150100, stationName: "Wojanów", warningLevel: 260, alarmLevel: 320, voivodeship: "dolnośląskie", riverId: "Bóbr" },
  { id: 151150160, stationName: "Zagrodno", warningLevel: 120, alarmLevel: 150, voivodeship: "dolnośląskie", riverId: "Skora" },
  { id: 150170010, stationName: "Zborowice", warningLevel: 230, alarmLevel: 290, voivodeship: "dolnośląskie", riverId: "Oława" },
  { id: 151170050, stationName: "Zbytowa", warningLevel: 310, alarmLevel: 350, voivodeship: "dolnośląskie", riverId: "Widawa" },
  { id: 151150010, stationName: "Zgorzelec", warningLevel: 190, alarmLevel: 220, voivodeship: "dolnośląskie", riverId: "Czerwona Woda" },
  { id: 151140060, stationName: "Zgorzelec", warningLevel: 340, alarmLevel: 400, voivodeship: "dolnośląskie", riverId: "Nysa Łużycka" },
  { id: 150150130, stationName: "Błażkowa", warningLevel: 150, alarmLevel: 180, voivodeship: "dolnośląskie", riverId: "Bóbr" },
  { id: 151160180, stationName: "Bogdaszowice", warningLevel: 180, alarmLevel: 220, voivodeship: "dolnośląskie", riverId: "Strzegomka" },
  { id: 151160050, stationName: "Dunino", warningLevel: 130, alarmLevel: 200, voivodeship: "dolnośląskie", riverId: "Kaczawa" },
  { id: 150160270, stationName: "Kamieniec Ząbkowicki", warningLevel: 300, alarmLevel: 340, voivodeship: "dolnośląskie", riverId: "Budzówka" },
  { id: 150160040, stationName: "Kudowa-Zdrój-Zakrze", warningLevel: 280, alarmLevel: 310, voivodeship: "dolnośląskie", riverId: "Klikawa" },
  { id: 150160230, stationName: "Lądek-Zdrój", warningLevel: 80, alarmLevel: 120, voivodeship: "dolnośląskie", riverId: "Biała Lądecka" },
  { id: 150160090, stationName: "Łażany", warningLevel: 200, alarmLevel: 240, voivodeship: "dolnośląskie", riverId: "Strzegomka" },
  { id: 150150090, stationName: "Łomnica", warningLevel: 320, alarmLevel: 380, voivodeship: "dolnośląskie", riverId: "Łomnica" },
  { id: 151160150, stationName: "Malczyce", warningLevel: 600, alarmLevel: 700, voivodeship: "dolnośląskie", riverId: "Odra" },
  { id: 150160190, stationName: "Międzylesie", warningLevel: 180, alarmLevel: 200, voivodeship: "dolnośląskie", riverId: "Nysa Kłodzka" },
  { id: 150150010, stationName: "Mirsk", warningLevel: 420, alarmLevel: 470, voivodeship: "dolnośląskie", riverId: "Kwisa" },
  { id: 151160020, stationName: "Rzymówka", warningLevel: 240, alarmLevel: 300, voivodeship: "dolnośląskie", riverId: "Kaczawa" },
  { id: 150140020, stationName: "Sieniawka", warningLevel: 160, alarmLevel: 200, voivodeship: "dolnośląskie", riverId: "Nysa Łużycka" },
  { id: 150160110, stationName: "Szalejów dolny", warningLevel: 160, alarmLevel: 180, voivodeship: "dolnośląskie", riverId: "Bystrzyca Dusznicka" },
  { id: 150160080, stationName: "Tłumaczów", warningLevel: 180, alarmLevel: 220, voivodeship: "dolnośląskie", riverId: "Ścinawka" },
  { id: 150160210, stationName: "Wilkanów", warningLevel: 140, alarmLevel: 160, voivodeship: "dolnośląskie", riverId: "Wilczka" },
  { id: 150160200, stationName: "Żelazno", warningLevel: 110, alarmLevel: 140, voivodeship: "dolnośląskie", riverId: "Biała Lądecka" },
  { id: 150160400, stationName: "Boboszów", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Nysa Kłodzka" },
  { id: 150160430, stationName: "Domanice", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Bystrzyca" },
  { id: 150160410, stationName: "Gajnik", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Cieszyca" },
  { id: 150160420, stationName: "Goworów", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Goworówka" },
  { id: 150140140, stationName: "Kopaczów", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Lubota" },
  { id: 150160380, stationName: "Krosnowice", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Duna Górna" },
  { id: 150159997, stationName: "Miszkowice", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Złotna" },
  { id: 150150230, stationName: "Opawa", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Bóbr" },
  { id: 150160390, stationName: "Roztoki Bystrzyckie", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Goworówka" },
  { id: 150160340, stationName: "Sarny", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Włodzica" },
  { id: 150169999, stationName: "Sędzisław", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Bóbr" },
  { id: 150160360, stationName: "Starków", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Duna dolna" },
  { id: 150160350, stationName: "Szalejów Górny", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Bystrzyca Dusznicka" },
  { id: 150160330, stationName: "Szczytna", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Kamienny Potok" },
  { id: 150160370, stationName: "Topolice", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Duna Górna" },
  { id: 151160300, stationName: "Wąsosz", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Barycz" },
  { id: 151160290, stationName: "Żmigród", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "dolnośląskie", riverId: "Barycz" },
  { id: 150160160, stationName: "Mietków", warningLevel: 280, alarmLevel: 300, voivodeship: "dolnośląskie", riverId: "Bystrzyca" },

// --- kujawskopomorskie ---
  { id: 153190180, stationName: "Bachotek", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "kujawsko-pomorskie", riverId: "Skarlanka" },
  { id: 153180060, stationName: "Krąplewice", warningLevel: 220, alarmLevel: 280, voivodeship: "kujawsko-pomorskie", riverId: "Wda" },
  { id: 153190020, stationName: "Lisnowo", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "kujawsko-pomorskie", riverId: "Osa" },
  { id: 153180150, stationName: "Rogóźno 2", warningLevel: 230, alarmLevel: 260, voivodeship: "kujawsko-pomorskie", riverId: "Osa" },
  { id: 153190050, stationName: "Brodnica", warningLevel: 230, alarmLevel: 260, voivodeship: "kujawsko-pomorskie", riverId: "Drwęca" },
  { id: 153180140, stationName: "Elgiszewo", warningLevel: 200, alarmLevel: 230, voivodeship: "kujawsko-pomorskie", riverId: "Drwęca" },
  { id: 153180100, stationName: "Grudziądz", warningLevel: 540, alarmLevel: 650, voivodeship: "kujawsko-pomorskie", riverId: "Wisła" },
  { id: 152180080, stationName: "Kruszwica", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "kujawsko-pomorskie", riverId: "Jez. Gopło (Noteć)" },
  { id: 153170110, stationName: "Motyl", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "kujawsko-pomorskie", riverId: "Sępolna" },
  { id: 153190060, stationName: "Rypin", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "kujawsko-pomorskie", riverId: "Rypienica" },
  { id: 153170140, stationName: "Smukała", warningLevel: 230, alarmLevel: 260, voivodeship: "kujawsko-pomorskie", riverId: "Brda" },
  { id: 153190010, stationName: "Świecie", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "kujawsko-pomorskie", riverId: "Lutryna" },
  { id: 153190190, stationName: "Tama Brodzka", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "kujawsko-pomorskie", riverId: "Skarlanka" },
  { id: 153180040, stationName: "Tleń", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "kujawsko-pomorskie", riverId: "Prusina" },
  { id: 153170120, stationName: "Tuchola", warningLevel: 140, alarmLevel: 190, voivodeship: "kujawsko-pomorskie", riverId: "Brda" },
  { id: 152190030, stationName: "Włocławek", warningLevel: 600, alarmLevel: 650, voivodeship: "kujawsko-pomorskie", riverId: "Wisła" },
  { id: 152190020, stationName: "Włocławek-Ruda", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "kujawsko-pomorskie", riverId: "Zgłowiączka" },
  { id: 153180080, stationName: "Chełmno", warningLevel: 510, alarmLevel: 630, voivodeship: "kujawsko-pomorskie", riverId: "Wisła" },
  { id: 153180020, stationName: "Fordon", warningLevel: 530, alarmLevel: 650, voivodeship: "kujawsko-pomorskie", riverId: "Wisła" },
  { id: 152180010, stationName: "Gębice", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "kujawsko-pomorskie", riverId: "Noteć Zachodnia" },
  { id: 152180020, stationName: "Gorzyszewo", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "kujawsko-pomorskie", riverId: "Panna" },
  { id: 152190040, stationName: "Lipno", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "kujawsko-pomorskie", riverId: "Mień" },
  { id: 153170100, stationName: "Nakło-Zachód", warningLevel: 320, alarmLevel: 360, voivodeship: "kujawsko-pomorskie", riverId: "Noteć" },
  { id: 152180130, stationName: "Otłoczynek", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "kujawsko-pomorskie", riverId: "Tążyna" },
  { id: 152180030, stationName: "Pakość", warningLevel: 260, alarmLevel: 280, voivodeship: "kujawsko-pomorskie", riverId: "Noteć" },
  { id: 153180090, stationName: "Toruń", warningLevel: 530, alarmLevel: 650, voivodeship: "kujawsko-pomorskie", riverId: "Wisła" },

// --- lubelskie ---
  { id: 150220110, stationName: "Biłgoraj", warningLevel: 180, alarmLevel: 220, voivodeship: "lubelskie", riverId: "Łada" },
  { id: 151220130, stationName: "Biskupice", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Giełczewka" },
  { id: 151210130, stationName: "Bór", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Wyżnica" },
  { id: 150230070, stationName: "Gozdów", warningLevel: 290, alarmLevel: 350, voivodeship: "lubelskie", riverId: "Huczwa" },
  { id: 150230040, stationName: "Krasnystaw", warningLevel: 420, alarmLevel: 470, voivodeship: "lubelskie", riverId: "Wieprz" },
  { id: 150230030, stationName: "Krzak", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Łabuńka" },
  { id: 152230080, stationName: "Krzyczew", warningLevel: 380, alarmLevel: 480, voivodeship: "lubelskie", riverId: "Bug" },
  { id: 151220070, stationName: "Lublin", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Bystrzyca" },
  { id: 152230070, stationName: "Małowa Góra", warningLevel: 310, alarmLevel: 350, voivodeship: "lubelskie", riverId: "Krzna" },
  { id: 151220050, stationName: "Młyniska", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Minina" },
  { id: 150230050, stationName: "Orłów Drewniany", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Wolica" },
  { id: 151220120, stationName: "Parczew", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Piwonia" },
  { id: 151220140, stationName: "Puchaczów", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Wierzniczka" },
  { id: 151230020, stationName: "Rossosz", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Muława" },
  { id: 151230050, stationName: "Ruda-Opalin", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Uherka" },
  { id: 151220100, stationName: "Sobianowice", warningLevel: 240, alarmLevel: 270, voivodeship: "lubelskie", riverId: "Bystrzyca" },
  { id: 151220040, stationName: "Witowice", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Kurówka" },
  { id: 150210180, stationName: "Annopol", warningLevel: 500, alarmLevel: 550, voivodeship: "lubelskie", riverId: "Wisła" },
  { id: 151210120, stationName: "Dęblin", warningLevel: 400, alarmLevel: 500, voivodeship: "lubelskie", riverId: "Wisła" },
  { id: 151230060, stationName: "Dorohusk", warningLevel: 290, alarmLevel: 430, voivodeship: "lubelskie", riverId: "Bug" },
  { id: 151220010, stationName: "Kośmin", warningLevel: 350, alarmLevel: 400, voivodeship: "lubelskie", riverId: "Wieprz" },
  { id: 150240020, stationName: "Kryłów", warningLevel: 440, alarmLevel: 540, voivodeship: "lubelskie", riverId: "Bug" },
  { id: 151220090, stationName: "Lubartów", warningLevel: 430, alarmLevel: 480, voivodeship: "lubelskie", riverId: "Wieprz" },
  { id: 150230080, stationName: "Michalów", warningLevel: 140, alarmLevel: 190, voivodeship: "lubelskie", riverId: "Wieprz" },
  { id: 150230010, stationName: "Nielisz", warningLevel: 200, alarmLevel: 230, voivodeship: "lubelskie", riverId: "Wieprz" },
  { id: 150220160, stationName: "Osuchy", warningLevel: 320, alarmLevel: 400, voivodeship: "lubelskie", riverId: "Tanew" },
  { id: 152230050, stationName: "Perkowice", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Zielawa" },
  { id: 152230020, stationName: "Porosiuki", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Krzna" },
  { id: 151210190, stationName: "Puławy-Azoty", warningLevel: 450, alarmLevel: 550, voivodeship: "lubelskie", riverId: "Wisła" },
  { id: 151220110, stationName: "Szemień", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Tyśmienica" },
  { id: 150240010, stationName: "Strzyżów", warningLevel: 650, alarmLevel: 800, voivodeship: "lubelskie", riverId: "Bug" },
  { id: 150230060, stationName: "Surhów", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Wojsławka" },
  { id: 151220080, stationName: "Tchórzew", warningLevel: 350, alarmLevel: 400, voivodeship: "lubelskie", riverId: "Tyśmienica" },
  { id: 151230010, stationName: "Trawniki", warningLevel: 450, alarmLevel: 500, voivodeship: "lubelskie", riverId: "Wieprz" },
  { id: 150230020, stationName: "Wirkowice", warningLevel: 290, alarmLevel: 350, voivodeship: "lubelskie", riverId: "Wieprz" },
  { id: 151230040, stationName: "Włodawa", warningLevel: 300, alarmLevel: 390, voivodeship: "lubelskie", riverId: "Bug" },
  { id: 150220120, stationName: "Zakłodzie", warningLevel: 190, alarmLevel: 230, voivodeship: "lubelskie", riverId: "Pór" },
  { id: 151230030, stationName: "Okuninka", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Włodawka" },
  { id: 150230090, stationName: "Zażółkiew", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Żółkiewka" },
  { id: 151220150, stationName: "Zemborzyce", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubelskie", riverId: "Bystrzyca" },

// --- lodzkie---
  { id: 152190050, stationName: "Kwiatkówek", warningLevel: 200, alarmLevel: 250, voivodeship: "łódzkie", riverId: "Bzura" },
  { id: 152190100, stationName: "Bielawy", warningLevel: 310, alarmLevel: 360, voivodeship: "łódzkie", riverId: "Mroga" },
  { id: 151190060, stationName: "Bobry", warningLevel: 130, alarmLevel: 150, voivodeship: "łódzkie", riverId: "Warta" },
  { id: 151190120, stationName: "Dąbrowa", warningLevel: 370, alarmLevel: 400, voivodeship: "łódzkie", riverId: "Czarna" },
  { id: 151180180, stationName: "Grabno", warningLevel: 230, alarmLevel: 280, voivodeship: "łódzkie", riverId: "Grabia" },
  { id: 152200010, stationName: "Kęszyce", warningLevel: 350, alarmLevel: 400, voivodeship: "łódzkie", riverId: "Rawka" },
  { id: 151190080, stationName: "Kłudzice", warningLevel: 350, alarmLevel: 380, voivodeship: "łódzkie", riverId: "Luciąża" },
  { id: 151180030, stationName: "Kuźnica Skakawska", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "łódzkie", riverId: "Niesób" },
  { id: 151190030, stationName: "Łask", warningLevel: 160, alarmLevel: 180, voivodeship: "łódzkie", riverId: "Grabia" },
  { id: 152199992, stationName: "Łowicz", warningLevel: 350, alarmLevel: 400, voivodeship: "łódzkie", riverId: "Bzura" },
  { id: 151180040, stationName: "Mirków", warningLevel: 230, alarmLevel: 270, voivodeship: "łódzkie", riverId: "Prosna" },
  { id: 151180090, stationName: "Niechmirów", warningLevel: 170, alarmLevel: 220, voivodeship: "łódzkie", riverId: "Oleśnica" },
  { id: 151200040, stationName: "Opoczno", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "łódzkie", riverId: "Drzewiczka" },
  { id: 151180150, stationName: "Widawa", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "łódzkie", riverId: "Nieciecz" },
  { id: 151190110, stationName: "Zawada", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "łódzkie", riverId: "Wolbórka" },
  { id: 151180120, stationName: "Burzenin", warningLevel: 280, alarmLevel: 320, voivodeship: "łódzkie", riverId: "Warta" },
  { id: 151180130, stationName: "Działoszyn", warningLevel: 530, alarmLevel: 570, voivodeship: "łódzkie", riverId: "Warta" },
  { id: 151190070, stationName: "Gieczno", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "łódzkie", riverId: "Moszczenica" },
  { id: 151180100, stationName: "Osjaków", warningLevel: 280, alarmLevel: 340, voivodeship: "łódzkie", riverId: "Warta" },
  { id: 151180160, stationName: "Poddębice", warningLevel: 240, alarmLevel: 290, voivodeship: "łódzkie", riverId: "Ner" },
  { id: 151180140, stationName: "Podgórze", warningLevel: 290, alarmLevel: 330, voivodeship: "łódzkie", riverId: "Widawka" },
  { id: 151190090, stationName: "Przedbórz", warningLevel: 360, alarmLevel: 400, voivodeship: "łódzkie", riverId: "Pilica" },
  { id: 151180170, stationName: "Rogóźno", warningLevel: 240, alarmLevel: 290, voivodeship: "łódzkie", riverId: "Widawka" },
  { id: 151180080, stationName: "Sieradz", warningLevel: 390, alarmLevel: 440, voivodeship: "łódzkie", riverId: "Warta" },
  { id: 151200020, stationName: "Spała", warningLevel: 220, alarmLevel: 260, voivodeship: "łódzkie", riverId: "Pilica" },
  { id: 151190100, stationName: "Sulejów-Kopalnia", warningLevel: 230, alarmLevel: 260, voivodeship: "łódzkie", riverId: "Pilica" },
  { id: 151190020, stationName: "Szczerców", warningLevel: 190, alarmLevel: 230, voivodeship: "łódzkie", riverId: "Widawka" },
  { id: 151180110, stationName: "Uniejów", warningLevel: 220, alarmLevel: 270, voivodeship: "łódzkie", riverId: "Warta" },
  { id: 151180220, stationName: "Grabina", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "łódzkie", riverId: "Pichna" },
  { id: 151190130, stationName: "Kazimierz", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "łódzkie", riverId: "Ner" },
  { id: 151180200, stationName: "Kuśnie", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "łódzkie", riverId: "Żeglina" },
  { id: 152199997, stationName: "Kutno", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "łódzkie", riverId: "Ochnia" },
  { id: 151180210, stationName: "Smardzew", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "łódzkie", riverId: "Myja" },

// lubuskie
  { id: 151150050, stationName: "Dobroszów Wielki", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubuskie", riverId: "Bóbr" },
  { id: 152150150, stationName: "Ługi", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubuskie", riverId: "Jez. Żabie (Mierzęcka Struga)" },
  { id: 151160030, stationName: "Radzyń", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubuskie", riverId: "Jez. Sławskie (Czernica)" },
  { id: 152150100, stationName: "Bledzew", warningLevel: 200, alarmLevel: 220, voivodeship: "lubuskie", riverId: "Obra" },
  { id: 152150130, stationName: "Cigacice", warningLevel: 350, alarmLevel: 400, voivodeship: "lubuskie", riverId: "Odra" },
  { id: 152150140, stationName: "Gościmiec", warningLevel: 290, alarmLevel: 380, voivodeship: "lubuskie", riverId: "Noteć" },
  { id: 151140010, stationName: "Gubin", warningLevel: 300, alarmLevel: 400, voivodeship: "lubuskie", riverId: "Nysa Łużycka" },
  { id: 151150030, stationName: "Iłowa", warningLevel: 180, alarmLevel: 200, voivodeship: "lubuskie", riverId: "Czerna Mała" },
  { id: 152140060, stationName: "Kostrzyn n. Odrą", warningLevel: 420, alarmLevel: 470, voivodeship: "lubuskie", riverId: "Odra" },
  { id: 152140070, stationName: "Kostrzyn n. Odrą", warningLevel: 360, alarmLevel: 410, voivodeship: "lubuskie", riverId: "Warta" },
  { id: 151150090, stationName: "Łozy", warningLevel: 280, alarmLevel: 330, voivodeship: "lubuskie", riverId: "Kwisa" },
  { id: 152140080, stationName: "Maczków", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubuskie", riverId: "Ilanka" },
  { id: 152150180, stationName: "Mierzęcin", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubuskie", riverId: "Mierzęcka Struga" },
  { id: 152150050, stationName: "Nietków", warningLevel: 370, alarmLevel: 400, voivodeship: "lubuskie", riverId: "Odra" },
  { id: 151150150, stationName: "Nowa Sól", warningLevel: 400, alarmLevel: 450, voivodeship: "lubuskie", riverId: "Odra" },
  { id: 152150190, stationName: "Nowe Drezdenko", warningLevel: 290, alarmLevel: 340, voivodeship: "lubuskie", riverId: "Noteć" },
  { id: 151150040, stationName: "Nowogród Bobrzański", warningLevel: 250, alarmLevel: 300, voivodeship: "lubuskie", riverId: "Bóbr" },
  { id: 151140030, stationName: "Przewoźniki", warningLevel: 300, alarmLevel: 340, voivodeship: "lubuskie", riverId: "Skroda" },
  { id: 151140040, stationName: "Przewóz", warningLevel: 290, alarmLevel: 350, voivodeship: "lubuskie", riverId: "Nysa Łużycka" },
  { id: 152150080, stationName: "Santok", warningLevel: 420, alarmLevel: 490, voivodeship: "lubuskie", riverId: "Warta" },
  { id: 152150090, stationName: "Santok", warningLevel: 250, alarmLevel: 330, voivodeship: "lubuskie", riverId: "Noteć" },
  { id: 152140050, stationName: "Słubice", warningLevel: 360, alarmLevel: 410, voivodeship: "lubuskie", riverId: "Odra" },
  { id: 152150170, stationName: "Smolno Wielkie", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubuskie", riverId: "Obrzyca" },
  { id: 151150130, stationName: "Szprotawa", warningLevel: 230, alarmLevel: 270, voivodeship: "lubuskie", riverId: "Szprotawa" },
  { id: 151150120, stationName: "Szprotawa", warningLevel: 200, alarmLevel: 250, voivodeship: "lubuskie", riverId: "Bóbr" },
  { id: 152150010, stationName: "Świerkocin", warningLevel: 450, alarmLevel: 500, voivodeship: "lubuskie", riverId: "Warta" },
  { id: 151150080, stationName: "Żagań", warningLevel: 340, alarmLevel: 400, voivodeship: "lubuskie", riverId: "Bóbr" },
  { id: 151150070, stationName: "Żagań", warningLevel: 130, alarmLevel: 150, voivodeship: "lubuskie", riverId: "Czerna Wielka" },
  { id: 152140090, stationName: "Biała Góra", warningLevel: 360, alarmLevel: 470, voivodeship: "lubuskie", riverId: "Odra" },
  { id: 152150040, stationName: "Gorzów Wielkopolski", warningLevel: 390, alarmLevel: 470, voivodeship: "lubuskie", riverId: "Warta" },
  { id: 151150190, stationName: "Lubiatów", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubuskie", riverId: "Obrzyca" },
  { id: 152140130, stationName: "Połęcko", warningLevel: 310, alarmLevel: 350, voivodeship: "lubuskie", riverId: "Odra" },
  { id: 152140110, stationName: "Sądów", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubuskie", riverId: "Pliszka" },
  { id: 152150010, stationName: "Skwierzyna", warningLevel: 380, alarmLevel: 460, voivodeship: "lubuskie", riverId: "Warta" },
  { id: 151150020, stationName: "Stary Raduszec", warningLevel: 450, alarmLevel: 500, voivodeship: "lubuskie", riverId: "Bóbr" },
  { id: 151140190, stationName: "Gubin", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubuskie", riverId: "Lubsza" },
  { id: 151140180, stationName: "Olszyna", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubuskie", riverId: "Nysa Łużycka" },
  { id: 151140200, stationName: "Sanice", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubuskie", riverId: "Nysa Łużycka" },
  { id: 151140170, stationName: "Jaroszowice", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubuskie", riverId: "Nysa Łużycka" },
  { id: 151160280, stationName: "Sława Śląska", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "lubuskie", riverId: "Czernica" },

  // małopolskie

  { id: 150200070, stationName: "Biskupice", warningLevel: 410, alarmLevel: 450, voivodeship: "małopolskie", riverId: "Uszwica" },
  { id: 150210020, stationName: "Borzęcin", warningLevel: 300, alarmLevel: 400, voivodeship: "małopolskie", riverId: "Uszwica" },
  { id: 149190140, stationName: "Gorlice", warningLevel: 390, alarmLevel: 450, voivodeship: "małopolskie", riverId: "Sękówka" },
  { id: 149200310, stationName: "Grybów", warningLevel: 320, alarmLevel: 400, voivodeship: "małopolskie", riverId: "Biała" },
  { id: 149200200, stationName: "Jakubowice", warningLevel: 200, alarmLevel: 350, voivodeship: "małopolskie", riverId: "Łososina" },
  { id: 149190060, stationName: "Jawiszowice", warningLevel: 480, alarmLevel: 630, voivodeship: "małopolskie", riverId: "Wisła" },
  { id: 149200040, stationName: "Kasinka Mała", warningLevel: 350, alarmLevel: 420, voivodeship: "małopolskie", riverId: "Raba" },
  { id: 149190280, stationName: "Koniówka", warningLevel: 250, alarmLevel: 290, voivodeship: "małopolskie", riverId: "Dunajec" },
  { id: 149190300, stationName: "Kościelisko-Kiry", warningLevel: 140, alarmLevel: 180, voivodeship: "małopolskie", riverId: "Kirowa Woda" },
  { id: 150190340, stationName: "Kraków-Bielany", warningLevel: 370, alarmLevel: 520, voivodeship: "małopolskie", riverId: "Wisła" },
  { id: 149210180, stationName: "Kunkowa", warningLevel: 200, alarmLevel: 230, voivodeship: "małopolskie", riverId: "Przysłopianka" },
  { id: 149190390, stationName: "Ludźmierz", warningLevel: 280, alarmLevel: 350, voivodeship: "małopolskie", riverId: "Wielki Rogoźnik" },
  { id: 149200270, stationName: "Łabowa", warningLevel: 180, alarmLevel: 250, voivodeship: "małopolskie", riverId: "Kamienica" },
  { id: 149200060, stationName: "Mszana Dolna", warningLevel: 320, alarmLevel: 380, voivodeship: "małopolskie", riverId: "Raba" },
  { id: 149200120, stationName: "Niedzica", warningLevel: 200, alarmLevel: 260, voivodeship: "małopolskie", riverId: "Niedziczanka" },
  { id: 149200250, stationName: "Nowy Sącz", warningLevel: 200, alarmLevel: 260, voivodeship: "małopolskie", riverId: "Kamienica" },
  { id: 149200260, stationName: "Nowy Sącz", warningLevel: 300, alarmLevel: 380, voivodeship: "małopolskie", riverId: "Łubinka" },
  { id: 149200030, stationName: "Nowy Targ", warningLevel: 260, alarmLevel: 350, voivodeship: "małopolskie", riverId: "Dunajec" },
  { id: 149200010, stationName: "Nowy Targ-Kowaniec", warningLevel: 300, alarmLevel: 380, voivodeship: "małopolskie", riverId: "Dunajec" },
  { id: 149200050, stationName: "Poronin", warningLevel: 220, alarmLevel: 250, voivodeship: "małopolskie", riverId: "Poroniec" },
  { id: 150190170, stationName: "Pustynia", warningLevel: 330, alarmLevel: 480, voivodeship: "małopolskie", riverId: "Wisła" },
  { id: 149190340, stationName: "Rabka 2", warningLevel: 140, alarmLevel: 180, voivodeship: "małopolskie", riverId: "Raba" },
  { id: 149190270, stationName: "Radziszów", warningLevel: 310, alarmLevel: 400, voivodeship: "małopolskie", riverId: "Skawinka" },
  { id: 150190260, stationName: "Smolice", warningLevel: 450, alarmLevel: 630, voivodeship: "małopolskie", riverId: "Wisła" },
  { id: 149200130, stationName: "Stradomka", warningLevel: 280, alarmLevel: 350, voivodeship: "małopolskie", riverId: "Stradomka" },
  { id: 149200020, stationName: "Szaflary", warningLevel: 310, alarmLevel: 380, voivodeship: "małopolskie", riverId: "Biały Dunajec" },
  { id: 149180180, stationName: "Szczawnica", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Grajcarek" },
  { id: 149200110, stationName: "Trybsz 2", warningLevel: 280, alarmLevel: 320, voivodeship: "małopolskie", riverId: "Białka" },
  { id: 149210200, stationName: "Uście Gorlickie-Zdynia", warningLevel: 550, alarmLevel: 600, voivodeship: "małopolskie", riverId: "Zdynia" },
  { id: 149190180, stationName: "Wadowice", warningLevel: 370, alarmLevel: 490, voivodeship: "małopolskie", riverId: "Skawa" },
  { id: 149190320, stationName: "Zakopane-Dol.Strążyska", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Młyniska" },
  { id: 149190380, stationName: "Zakopane-Harenda", warningLevel: 200, alarmLevel: 240, voivodeship: "małopolskie", riverId: "Biały Dunajec" },
  { id: 149190170, stationName: "Zator", warningLevel: 240, alarmLevel: 370, voivodeship: "małopolskie", riverId: "Skawa" },
  { id: 150190310, stationName: "Balice", warningLevel: 340, alarmLevel: 380, voivodeship: "małopolskie", riverId: "Rudawa" },
  { id: 149200330, stationName: "Ciężkowice", warningLevel: 350, alarmLevel: 500, voivodeship: "małopolskie", riverId: "Biała" },
  { id: 149200230, stationName: "Czchów", warningLevel: 310, alarmLevel: 410, voivodeship: "małopolskie", riverId: "Dunajec" },
  { id: 149190230, stationName: "Czernichów-Prom", warningLevel: 580, alarmLevel: 680, voivodeship: "małopolskie", riverId: "Wisła" },
  { id: 149200090, stationName: "Dobczyce", warningLevel: 600, alarmLevel: 840, voivodeship: "małopolskie", riverId: "Raba" },
  { id: 149200190, stationName: "Gołkowice", warningLevel: 320, alarmLevel: 400, voivodeship: "małopolskie", riverId: "Dunajec" },
  { id: 149190250, stationName: "Jordanów", warningLevel: 270, alarmLevel: 350, voivodeship: "małopolskie", riverId: "Skawa" },
  { id: 150200150, stationName: "Karcy", warningLevel: 300, alarmLevel: 390, voivodeship: "małopolskie", riverId: "Ropa" },
  { id: 149210030, stationName: "Klęczany", warningLevel: 280, alarmLevel: 380, voivodeship: "małopolskie", riverId: "Ropa" },
  { id: 149190160, stationName: "Krościenko", warningLevel: 320, alarmLevel: 390, voivodeship: "małopolskie", riverId: "Dunajec" },
  { id: 149200350, stationName: "Krzeczów", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Krzczonówka" },
  { id: 150190360, stationName: "Las", warningLevel: 400, alarmLevel: 550, voivodeship: "małopolskie", riverId: "Wisła" },
  { id: 150190370, stationName: "Lubień", warningLevel: 120, alarmLevel: 140, voivodeship: "małopolskie", riverId: "Lubieńka" },
  { id: 149190360, stationName: "Ludźmierz", warningLevel: 230, alarmLevel: 300, voivodeship: "małopolskie", riverId: "Lepietnica" },
  { id: 149200100, stationName: "Łysa Polana", warningLevel: 220, alarmLevel: 260, voivodeship: "małopolskie", riverId: "Białka" },
  { id: 149200070, stationName: "Mniszek", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Rybi Potok" },
  { id: 149200080, stationName: "Mszana Dolna", warningLevel: 240, alarmLevel: 340, voivodeship: "małopolskie", riverId: "Mszanka" },
  { id: 149200300, stationName: "Muszyna", warningLevel: 210, alarmLevel: 280, voivodeship: "małopolskie", riverId: "Poprad" },
  { id: 149200280, stationName: "Muszyna-Milík", warningLevel: 260, alarmLevel: 350, voivodeship: "małopolskie", riverId: "Poprad" },
  { id: 149200240, stationName: "Nowy Sącz", warningLevel: 250, alarmLevel: 350, voivodeship: "małopolskie", riverId: "Dunajec" },
  { id: 150190330, stationName: "Ojców", warningLevel: 170, alarmLevel: 210, voivodeship: "małopolskie", riverId: "Prądnik" },
  { id: 150190160, stationName: "Oświęcim", warningLevel: 370, alarmLevel: 460, voivodeship: "małopolskie", riverId: "Soła" },
  { id: 150200100, stationName: "Popędzynka", warningLevel: 580, alarmLevel: 750, voivodeship: "małopolskie", riverId: "Wisła" },
  { id: 149210010, stationName: "Ropa", warningLevel: 280, alarmLevel: 370, voivodeship: "małopolskie", riverId: "Ropa" },
  { id: 150190040, stationName: "Rudze", warningLevel: 220, alarmLevel: 320, voivodeship: "małopolskie", riverId: "Wieprzówka" },
  { id: 150200060, stationName: "Słomniki", warningLevel: 590, alarmLevel: 700, voivodeship: "małopolskie", riverId: "Wisła" },
  { id: 149190220, stationName: "Skawica Dolna", warningLevel: 180, alarmLevel: 260, voivodeship: "małopolskie", riverId: "Skawica" },
  { id: 149200140, stationName: "Sromowce Wyżne", warningLevel: 280, alarmLevel: 360, voivodeship: "małopolskie", riverId: "Dunajec" },
  { id: 149200220, stationName: "Stary Sącz", warningLevel: 300, alarmLevel: 400, voivodeship: "małopolskie", riverId: "Poprad" },
  { id: 149190310, stationName: "Stróża", warningLevel: 220, alarmLevel: 290, voivodeship: "małopolskie", riverId: "Raba" },
  { id: 149190210, stationName: "Sucha Beskidzka", warningLevel: 215, alarmLevel: 285, voivodeship: "małopolskie", riverId: "Skawa" },
  { id: 150200020, stationName: "Szczucin", warningLevel: 460, alarmLevel: 660, voivodeship: "małopolskie", riverId: "Wisła" },
  { id: 150210150, stationName: "Tylmanowa", warningLevel: 200, alarmLevel: 250, voivodeship: "małopolskie", riverId: "Ochotnica" },
  { id: 149210140, stationName: "Uście Gorlickie", warningLevel: 230, alarmLevel: 280, voivodeship: "małopolskie", riverId: "Ropa" },
  { id: 149200290, stationName: "Żabno", warningLevel: 530, alarmLevel: 800, voivodeship: "małopolskie", riverId: "Dunajec" },
  { id: 150200170, stationName: "Zgłobice", warningLevel: 330, alarmLevel: 450, voivodeship: "małopolskie", riverId: "Dunajec" },
  { id: 149200320, stationName: "Koszyce Wielkie", warningLevel: 330, alarmLevel: 440, voivodeship: "małopolskie", riverId: "Biała" },
  { id: 149190510, stationName: "Brody", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Cedron" },
  { id: 149200510, stationName: "Brzesko-Miasto (LSOP)", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Uszwica" },
  { id: 149190490, stationName: "Bystra 2", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Bystranka" },
  { id: 149200540, stationName: "Gdów 2", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Raba" },
  { id: 150190270, stationName: "Golczowice", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Biała Przemsza" },
  { id: 150200220, stationName: "Grabie", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Wisła" },
  { id: 150190500, stationName: "Jerzmanowice", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Prądnik" },
  { id: 150190480, stationName: "Kraków-Łagiewniki", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Wilga" },
  { id: 149200360, stationName: "Lipnica Murowana (LSOP)", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Uszwica" },
  { id: 149200480, stationName: "Łapanów-Rynek (LSOP)", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Stradomka" },
  { id: 150200370, stationName: "Okocim (LSOP)", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Uszwica" },
  { id: 149200180, stationName: "Orłów", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Szreniawa" },
  { id: 149209990, stationName: "Piekiełko", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Łososina" },
  { id: 149200520, stationName: "Pierzchów", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Królewski Potok" },
  { id: 149190550, stationName: "Rzyki", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Wieprzówka" },
  { id: 149190440, stationName: "Sułkowice", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Krzywaczka" },
  { id: 149190480, stationName: "Zembrzyce", warningLevel: 'nie określono', alarmLevel: 'nie określono', voivodeship: "małopolskie", riverId: "Paleczka" },
  { id: 149190260, stationName: "Proszowice", warningLevel: 230, alarmLevel: 280, voivodeship: "małopolskie", riverId: "Szreniawa" },
  { id: 149200170, stationName: "Osielec", warningLevel: 500, alarmLevel: 700, voivodeship: "małopolskie", riverId: "Skawa" },
  { id: 149190200, stationName: "Sucha Beskidzka", warningLevel: 220, alarmLevel: 270, voivodeship: "małopolskie", riverId: "Stryszawka" },

// mazowieckie
  { id: 151210110, stationName: "Mika", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Określka" },
  { id: 153210070, stationName: "Białobrzeg Bliztszy", warningLevel: 180, alarmLevel: 220, voivodeship: "mazowieckie", riverId: "Omulew" },
  { id: 151200120, stationName: "Białobrzegi", warningLevel: 200, alarmLevel: 250, voivodeship: "mazowieckie", riverId: "Pilica" },
  { id: 151210070, stationName: "Cyganówka", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Wilga" },
  { id: 152210100, stationName: "Czarnowo", warningLevel: 270, alarmLevel: 320, voivodeship: "mazowieckie", riverId: "Orz" },
  { id: 152220060, stationName: "Hruszew", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Toczna" },
  { id: 152210140, stationName: "Jagodne", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Kostrzyń" },
  { id: 153210020, stationName: "Krasnosielc", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Orzyc" },
  { id: 152200090, stationName: "Krubice", warningLevel: 220, alarmLevel: 280, voivodeship: "mazowieckie", riverId: "Utrata" },
  { id: 153210010, stationName: "Krukowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Omulew" },
  { id: 152200100, stationName: "Luberadz", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Łydynia" },
  { id: 152210030, stationName: "Maków Mazowiecki", warningLevel: 370, alarmLevel: 390, voivodeship: "mazowieckie", riverId: "Orzyc" },
  { id: 152229999, stationName: "Małkinia", warningLevel: 350, alarmLevel: 430, voivodeship: "mazowieckie", riverId: "Bug" },
  { id: 153210040, stationName: "Myszyniec", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Rozoga" },
  { id: 151210100, stationName: "Oziemkówka", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Wilga" },
  { id: 152210020, stationName: "Piaseczno 2", warningLevel: 300, alarmLevel: 350, voivodeship: "mazowieckie", riverId: "Jeziorka" },
  { id: 152210150, stationName: "Popowo", warningLevel: 330, alarmLevel: 370, voivodeship: "mazowieckie", riverId: "Bug" },
  { id: 152200060, stationName: "Sarbiewo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Raciążnica" },
  { id: 153210140, stationName: "Szkwa", warningLevel: 460, alarmLevel: 500, voivodeship: "mazowieckie", riverId: "Szkwa" },
  { id: 152200020, stationName: "Szreńsk", warningLevel: 130, alarmLevel: 180, voivodeship: "mazowieckie", riverId: "Mławka" },
  { id: 152200020, stationName: "Trzciniec", warningLevel: 280, alarmLevel: 330, voivodeship: "mazowieckie", riverId: "Wkra" },
  { id: 153210120, stationName: "Walery", warningLevel: 300, alarmLevel: 340, voivodeship: "mazowieckie", riverId: "Rozoga" },
  { id: 152200070, stationName: "Władysławów", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Lasica" },
  { id: 152230200, stationName: "Zabuże", warningLevel: 450, alarmLevel: 520, voivodeship: "mazowieckie", riverId: "Bug" },
  { id: 152220030, stationName: "Zembrów", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Cetynia" },
  { id: 152200050, stationName: "Żuków", warningLevel: 300, alarmLevel: 350, voivodeship: "mazowieckie", riverId: "Bzura" },
  { id: 152200120, stationName: "Borkowo", warningLevel: 280, alarmLevel: 300, voivodeship: "mazowieckie", riverId: "Wkra" },
  { id: 151210050, stationName: "Gusin", warningLevel: 370, alarmLevel: 420, voivodeship: "mazowieckie", riverId: "Wisła" },
  { id: 151210080, stationName: "Kazanów", warningLevel: 195, alarmLevel: 270, voivodeship: "mazowieckie", riverId: "Iłżanka" },
  { id: 152190120, stationName: "Kępa Polska", warningLevel: 450, alarmLevel: 500, voivodeship: "mazowieckie", riverId: "Wisła" },
  { id: 152210120, stationName: "Łochów", warningLevel: 300, alarmLevel: 350, voivodeship: "mazowieckie", riverId: "Liwiec" },
  { id: 152200110, stationName: "Modlin", warningLevel: 650, alarmLevel: 700, voivodeship: "mazowieckie", riverId: "Wisła" },
  { id: 152210130, stationName: "Nowe Kaczkowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Brok" },
  { id: 151200090, stationName: "Nowe Miasto", warningLevel: 160, alarmLevel: 200, voivodeship: "mazowieckie", riverId: "Pilica" },
  { id: 151200080, stationName: "Odrzywół", warningLevel: 220, alarmLevel: 260, voivodeship: "mazowieckie", riverId: "Drzewiczka" },
  { id: 152200130, stationName: "Orzechowo", warningLevel: 320, alarmLevel: 400, voivodeship: "mazowieckie", riverId: "Narew" },
  { id: 153210090, stationName: "Ostrołęka", warningLevel: 360, alarmLevel: 380, voivodeship: "mazowieckie", riverId: "Narew" },
  { id: 151210060, stationName: "Rogożek", warningLevel: 330, alarmLevel: 380, voivodeship: "mazowieckie", riverId: "Radomka" },
  { id: 152190110, stationName: "Sierpc", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Sierpienica" },
  { id: 151200110, stationName: "Słowików", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Radomka" },
  { id: 152200080, stationName: "Strachowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Płonka" },
  { id: 152210170, stationName: "Warszawa-Bulwary", warningLevel: 600, alarmLevel: 650, voivodeship: "mazowieckie", riverId: "Wisła" },
  { id: 152210040, stationName: "Warszawa-Nadwilanówka", warningLevel: 750, alarmLevel: 800, voivodeship: "mazowieckie", riverId: "Wisła" },
  { id: 152210070, stationName: "Wólka Mlądzka", warningLevel: 210, alarmLevel: 300, voivodeship: "mazowieckie", riverId: "Świder" },
  { id: 152200150, stationName: "Wychódźc", warningLevel: 580, alarmLevel: 630, voivodeship: "mazowieckie", riverId: "Wisła" },
  { id: 152210090, stationName: "Wyszków", warningLevel: 400, alarmLevel: 450, voivodeship: "mazowieckie", riverId: "Bug" },
  { id: 152200030, stationName: "Wyszogród", warningLevel: 500, alarmLevel: 550, voivodeship: "mazowieckie", riverId: "Wisła" },
  { id: 152220010, stationName: "Zaliwie-Piegawki", warningLevel: 220, alarmLevel: 270, voivodeship: "mazowieckie", riverId: "Liwiec" },
  { id: 152210060, stationName: "Zambski Kościelne", warningLevel: 420, alarmLevel: 480, voivodeship: "mazowieckie", riverId: "Narew" },
  { id: 152210160, stationName: "Zawady", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Rządza" },
  { id: 152190160, stationName: "Babiec", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Skrwa" },
  { id: 152209997, stationName: "Duranów", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Pisia Gągolina" },
  { id: 151210220, stationName: "Kolonia Nadwiślańska", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Wisła" },
  { id: 152209994, stationName: "Nowe Miasto", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Sona" },
  { id: 152199995, stationName: "Płock", warningLevel: 210, alarmLevel: 250, voivodeship: "mazowieckie", riverId: "Wisła" },
  { id: 152210180, stationName: "Pułtusk", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Narew" },
  { id: 152219993, stationName: "Różan", warningLevel: 400, alarmLevel: 450, voivodeship: "mazowieckie", riverId: "Narew" },
  { id: 152209996, stationName: "Sochocin", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Wkra" },
  { id: 152210110, stationName: "Zawiszyn", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Osownica" },
  { id: 152219996, stationName: "Zielonka", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "mazowieckie", riverId: "Długa" },

// opolskie
  { id: 150170170, stationName: "Branice", warningLevel: 180, alarmLevel: 240, voivodeship: "opolskie", riverId: "Boczne koryto Opawy" },
  { id: 150170160, stationName: "Branice 1", warningLevel: 180, alarmLevel: 240, voivodeship: "opolskie", riverId: "Opawa" },
  { id: 150170090, stationName: "Brzeg", warningLevel: 460, alarmLevel: 530, voivodeship: "opolskie", riverId: "Odra" },
  { id: 150170220, stationName: "Dobra", warningLevel: 140, alarmLevel: 200, voivodeship: "opolskie", riverId: "Biała" },
  { id: 151180070, stationName: "Gorzów Śląski", warningLevel: 160, alarmLevel: 210, voivodeship: "opolskie", riverId: "Prosna" },
  { id: 150180080, stationName: "Grabówka", warningLevel: 90, alarmLevel: 140, voivodeship: "opolskie", riverId: "Bierawka" },
  { id: 150170080, stationName: "Jarnołtówek", warningLevel: 120, alarmLevel: 170, voivodeship: "opolskie", riverId: "Złoty Potok" },
  { id: 150170150, stationName: "Karłowice", warningLevel: 250, alarmLevel: 300, voivodeship: "opolskie", riverId: "Stobrawa" },
  { id: 150180030, stationName: "Koźle", warningLevel: 400, alarmLevel: 500, voivodeship: "opolskie", riverId: "Odra" },
  { id: 150170240, stationName: "Krapkowice", warningLevel: 340, alarmLevel: 450, voivodeship: "opolskie", riverId: "Odra" },
  { id: 150170210, stationName: "Krzywa Góra", warningLevel: 170, alarmLevel: 240, voivodeship: "opolskie", riverId: "Budkowiczanka" },
  { id: 150180070, stationName: "Lenartowice", warningLevel: 210, alarmLevel: 260, voivodeship: "opolskie", riverId: "Kłodnica" },
  { id: 151170090, stationName: "Namysłów", warningLevel: 210, alarmLevel: 250, voivodeship: "opolskie", riverId: "Widawa" },
  { id: 150170120, stationName: "Niemodlin", warningLevel: 320, alarmLevel: 350, voivodeship: "opolskie", riverId: "Ścinawa Niemodlińska" },
  { id: 150170290, stationName: "Opole-Groszowice", warningLevel: 500, alarmLevel: 600, voivodeship: "opolskie", riverId: "Odra" },
  { id: 150180050, stationName: "Ozimek", warningLevel: 210, alarmLevel: 250, voivodeship: "opolskie", riverId: "Mała Panew" },
  { id: 150170110, stationName: "Prudnik", warningLevel: 180, alarmLevel: 230, voivodeship: "opolskie", riverId: "Prudnik" },
  { id: 150170180, stationName: "Racławice Śląskie", warningLevel: 300, alarmLevel: 350, voivodeship: "opolskie", riverId: "Osobłoga" },
  { id: 150170130, stationName: "Ujście Nysy Kłodzkiej", warningLevel: 400, alarmLevel: 530, voivodeship: "opolskie", riverId: "Odra" },
  { id: 150170200, stationName: "Domaradz", warningLevel: 200, alarmLevel: 250, voivodeship: "opolskie", riverId: "Bogacica" },
  { id: 150180010, stationName: "Kamionka", warningLevel: 180, alarmLevel: 240, voivodeship: "opolskie", riverId: "Stradunia" },
  { id: 150170100, stationName: "Kopice", warningLevel: 300, alarmLevel: 380, voivodeship: "opolskie", riverId: "Nysa Kłodzka" },
  { id: 150170060, stationName: "Nysa", warningLevel: 380, alarmLevel: 450, voivodeship: "opolskie", riverId: "Nysa Kłodzka" },
  { id: 150170140, stationName: "Skorogoszcz", warningLevel: 250, alarmLevel: 280, voivodeship: "opolskie", riverId: "Nysa Kłodzka" },
  { id: 150180100, stationName: "Staniszcze Wielkie", warningLevel: 230, alarmLevel: 300, voivodeship: "opolskie", riverId: "Mała Panew" },
  { id: 150180020, stationName: "Turawa", warningLevel: 210, alarmLevel: 250, voivodeship: "opolskie", riverId: "Mała Panew" },
  { id: 150170050, stationName: "Biała Nyska", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "opolskie", riverId: "Biała Głuchołaska" },
  { id: 150170340, stationName: "Dziewiętlice", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "opolskie", riverId: "Świdna" },
  { id: 150170070, stationName: "Głuchołazy", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "opolskie", riverId: "Biała Głuchołaska" },
  { id: 150170350, stationName: "Kałków", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "opolskie", riverId: "Widna" },
  { id: 150180340, stationName: "Kluczbork", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "opolskie", riverId: "Stobrawa" },
  { id: 150170320, stationName: "Malerzowice Wielkie", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "opolskie", riverId: "Nysa Kłodzka" },
  { id: 150170330, stationName: "Paczków", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "opolskie", riverId: "Nysa Kłodzka" },
  { id: 150170360, stationName: "Steblów", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "opolskie", riverId: "Osobłoga" },

// podkarpackie
  { id: 149220170, stationName: "Krościenko", warningLevel: 160, alarmLevel: 210, voivodeship: "podkarpackie", riverId: "Strwiąż" },
  { id: 149220080, stationName: "Cisna", warningLevel: 190, alarmLevel: 240, voivodeship: "podkarpackie", riverId: "Solinka" },
  { id: 149220150, stationName: "Dwernik", warningLevel: 200, alarmLevel: 260, voivodeship: "podkarpackie", riverId: "San" },
  { id: 149220040, stationName: "Dynów", warningLevel: 300, alarmLevel: 460, voivodeship: "podkarpackie", riverId: "San" },
  { id: 150210110, stationName: "Głowaczowa", warningLevel: 220, alarmLevel: 300, voivodeship: "podkarpackie", riverId: "Grabinka" },
  { id: 150210200, stationName: "Grębów", warningLevel: 320, alarmLevel: 400, voivodeship: "podkarpackie", riverId: "Łęg" },
  { id: 149220070, stationName: "Hoczew", warningLevel: 200, alarmLevel: 260, voivodeship: "podkarpackie", riverId: "Hoczewka" },
  { id: 150220100, stationName: "Jarosław", warningLevel: 440, alarmLevel: 620, voivodeship: "podkarpackie", riverId: "San" },
  { id: 149220110, stationName: "Kalnica", warningLevel: 370, alarmLevel: 420, voivodeship: "podkarpackie", riverId: "Wetlina" },
  { id: 149220060, stationName: "Lesko", warningLevel: 250, alarmLevel: 330, voivodeship: "podkarpackie", riverId: "San" },
  { id: 150220090, stationName: "Leżachów", warningLevel: 460, alarmLevel: 660, voivodeship: "podkarpackie", riverId: "San" },
  { id: 149220010, stationName: "Nowosielce", warningLevel: 210, alarmLevel: 260, voivodeship: "podkarpackie", riverId: "Pielnica" },
  { id: 149220030, stationName: "Olchowce", warningLevel: 280, alarmLevel: 380, voivodeship: "podkarpackie", riverId: "San" },
  { id: 149210210, stationName: "Pastwiska", warningLevel: 200, alarmLevel: 250, voivodeship: "podkarpackie", riverId: "Wisłok" },
  { id: 149220140, stationName: "Polana", warningLevel: 380, alarmLevel: 430, voivodeship: "podkarpackie", riverId: "Czarna" },
  { id: 149220190, stationName: "Przemyśl", warningLevel: 380, alarmLevel: 570, voivodeship: "podkarpackie", riverId: "San" },
  { id: 149210150, stationName: "Puławy", warningLevel: 250, alarmLevel: 300, voivodeship: "podkarpackie", riverId: "Wisłok" },
  { id: 150210130, stationName: "Pustków", warningLevel: 520, alarmLevel: 720, voivodeship: "podkarpackie", riverId: "Wisłoka" },
  { id: 149220160, stationName: "Sieniawa", warningLevel: 220, alarmLevel: 280, voivodeship: "podkarpackie", riverId: "Wisłok" },
  { id: 149220180, stationName: "Stuposiany", warningLevel: 210, alarmLevel: 250, voivodeship: "podkarpackie", riverId: "Wołosaty" },
  { id: 149220020, stationName: "Szczawne", warningLevel: 140, alarmLevel: 190, voivodeship: "podkarpackie", riverId: "Osława" },
  { id: 149220100, stationName: "Terka", warningLevel: 200, alarmLevel: 260, voivodeship: "podkarpackie", riverId: "Solinka" },
  { id: 149220050, stationName: "Zagórz", warningLevel: 180, alarmLevel: 240, voivodeship: "podkarpackie", riverId: "Osława" },
  { id: 149220130, stationName: "Zatwarnica", warningLevel: 250, alarmLevel: 320, voivodeship: "podkarpackie", riverId: "San" },
  { id: 149210100, stationName: "Zboiska", warningLevel: 250, alarmLevel: 320, voivodeship: "podkarpackie", riverId: "Jasiołka" },
  { id: 150210140, stationName: "Brzeźnica", warningLevel: 270, alarmLevel: 450, voivodeship: "podkarpackie", riverId: "Brzeźnica" },
  { id: 150220140, stationName: "Charytany", warningLevel: 330, alarmLevel: 470, voivodeship: "podkarpackie", riverId: "Szkło" },
  { id: 149210120, stationName: "Godowa", warningLevel: 740, alarmLevel: 880, voivodeship: "podkarpackie", riverId: "Stobnica" },
  { id: 150220050, stationName: "Harasiuki", warningLevel: 270, alarmLevel: 330, voivodeship: "podkarpackie", riverId: "Tanev" },
  { id: 149210140, stationName: "Iskrzynia", warningLevel: 350, alarmLevel: 480, voivodeship: "podkarpackie", riverId: "Morwawa" },
  { id: 149210080, stationName: "Jasło", warningLevel: 300, alarmLevel: 420, voivodeship: "podkarpackie", riverId: "Jasiołka" },
  { id: 150210150, stationName: "Koło", warningLevel: 460, alarmLevel: 680, voivodeship: "podkarpackie", riverId: "Wisła" },
  { id: 149210050, stationName: "Krajowice", warningLevel: 330, alarmLevel: 450, voivodeship: "podkarpackie", riverId: "Wisłoka" },
  { id: 149210090, stationName: "Krempna-Kotań", warningLevel: 360, alarmLevel: 410, voivodeship: "podkarpackie", riverId: "Wisłoka" },
  { id: 149210110, stationName: "Krosno", warningLevel: 350, alarmLevel: 480, voivodeship: "podkarpackie", riverId: "Wisłok" },
  { id: 149220200, stationName: "Krówniki", warningLevel: 400, alarmLevel: 650, voivodeship: "podkarpackie", riverId: "Wiar" },
  { id: 149210040, stationName: "Łabuzie", warningLevel: 620, alarmLevel: 810, voivodeship: "podkarpackie", riverId: "Wisłoka" },
  { id: 150210120, stationName: "Mielec 2", warningLevel: 480, alarmLevel: 650, voivodeship: "podkarpackie", riverId: "Wisłoka" },
  { id: 149220210, stationName: "Nienowice", warningLevel: 340, alarmLevel: 460, voivodeship: "podkarpackie", riverId: "Wisznia" },
  { id: 150220030, stationName: "Nisko", warningLevel: 370, alarmLevel: 500, voivodeship: "podkarpackie", riverId: "San" },
  { id: 150210210, stationName: "Radomyśl", warningLevel: 460, alarmLevel: 620, voivodeship: "podkarpackie", riverId: "San" },
  { id: 150220020, stationName: "Ruda Jastkowska", warningLevel: 160, alarmLevel: 240, voivodeship: "podkarpackie", riverId: "Bukowa" },
  { id: 150220010, stationName: "Rzeszów", warningLevel: 300, alarmLevel: 420, voivodeship: "podkarpackie", riverId: "Wisłok" },
  { id: 150220070, stationName: "Rzuchów", warningLevel: 570, alarmLevel: 750, voivodeship: "podkarpackie", riverId: "San" },
  { id: 149210060, stationName: "Topoliny", warningLevel: 220, alarmLevel: 380, voivodeship: "podkarpackie", riverId: "Ropa" },
  { id: 150220080, stationName: "Tryńcza", warningLevel: 540, alarmLevel: 720, voivodeship: "podkarpackie", riverId: "Wisłok" },
  { id: 150210070, stationName: "Wampierzów", warningLevel: 340, alarmLevel: 450, voivodeship: "podkarpackie", riverId: "Breń" },
  { id: 150220130, stationName: "Zapałów", warningLevel: 250, alarmLevel: 350, voivodeship: "podkarpackie", riverId: "Lubaczówka" },
  { id: 149210130, stationName: "Żarnowa", warningLevel: 400, alarmLevel: 490, voivodeship: "podkarpackie", riverId: "Wisłok" },
  { id: 149210070, stationName: "Żółków", warningLevel: 220, alarmLevel: 350, voivodeship: "podkarpackie", riverId: "Wisłoka" },
  { id: 149210480, stationName: "Wisłok Wielki", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podkarpackie", riverId: "Wisłok" },
  { id: 150210410, stationName: "Wola Raniżowska", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podkarpackie", riverId: "Łęg" },

  // podlaskie
  { id: 154220070, stationName: "Wólka", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Jez. Rospuda Filipowska (Netta)" },
  { id: 153220270, stationName: "Babino", warningLevel: 540, alarmLevel: 570, voivodeship: "podlaskie", riverId: "Narew" },
  { id: 153220090, stationName: "Czachy", warningLevel: 320, alarmLevel: 360, voivodeship: "podlaskie", riverId: "Wissa" },
  { id: 153230130, stationName: "Harasimowicze", warningLevel: 590, alarmLevel: 620, voivodeship: "podlaskie", riverId: "Sidra" },
  { id: 153230020, stationName: "Karpowicze", warningLevel: 290, alarmLevel: 330, voivodeship: "podlaskie", riverId: "Brzozówka" },
  { id: 154220100, stationName: "Kleszczówek", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Szeszupa" },
  { id: 153230100, stationName: "Narewka", warningLevel: 260, alarmLevel: 290, voivodeship: "podlaskie", riverId: "Narewka" },
  { id: 153230170, stationName: "Nowosiółki", warningLevel: 200, alarmLevel: 240, voivodeship: "podlaskie", riverId: "Supraśl" },
  { id: 153230080, stationName: "Sochonie", warningLevel: 100, alarmLevel: 120, voivodeship: "podlaskie", riverId: "Czarna" },
  { id: 153230140, stationName: "Sokółda", warningLevel: 250, alarmLevel: 300, voivodeship: "podlaskie", riverId: "Sokółda" },
  { id: 153220290, stationName: "Szczebra", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Blizna" },
  { id: 153230060, stationName: "Trześcianka", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Rudnia" },
  { id: 153210180, stationName: "Zaruzie", warningLevel: 220, alarmLevel: 260, voivodeship: "podlaskie", riverId: "Ruź" },
  { id: 153220280, stationName: "Białobrzegi", warningLevel: 200, alarmLevel: 240, voivodeship: "podlaskie", riverId: "Netta" },
  { id: 153230190, stationName: "Białowieża-Park", warningLevel: 180, alarmLevel: 200, voivodeship: "podlaskie", riverId: "Narewka" },
  { id: 153230010, stationName: "Boćki", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Nurzec" },
  { id: 153230110, stationName: "Bondary", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Narew" },
  { id: 152220070, stationName: "Brańsk", warningLevel: 250, alarmLevel: 300, voivodeship: "podlaskie", riverId: "Nurzec" },
  { id: 154220090, stationName: "Bród Stary", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Czarna Hańcza" },
  { id: 153220100, stationName: "Burzyn", warningLevel: 380, alarmLevel: 400, voivodeship: "podlaskie", riverId: "Biebrza" },
  { id: 153230030, stationName: "Chraboly", warningLevel: 310, alarmLevel: 350, voivodeship: "podlaskie", riverId: "Orlanka" },
  { id: 153200310, stationName: "Czarna Wieś", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Kanał Kuwasy" },
  { id: 154230030, stationName: "Czerwony Folwark", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Czarna Hańcza" },
  { id: 153220260, stationName: "Dębowo", warningLevel: 270, alarmLevel: 300, voivodeship: "podlaskie", riverId: "Biebrza" },
  { id: 153210220, stationName: "Dobrylas", warningLevel: 250, alarmLevel: 290, voivodeship: "podlaskie", riverId: "Pisa" },
  { id: 153230010, stationName: "Fasty", warningLevel: 220, alarmLevel: 250, voivodeship: "podlaskie", riverId: "Supraśl" },
  { id: 152220050, stationName: "Frankopol", warningLevel: 250, alarmLevel: 350, voivodeship: "podlaskie", riverId: "Bug" },
  { id: 153230160, stationName: "Gródek", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Supraśl" },
  { id: 153230120, stationName: "Jałowy Róg", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Czarna Hańcza" },
  { id: 153220230, stationName: "Kulesze-Chobotki", warningLevel: 330, alarmLevel: 360, voivodeship: "podlaskie", riverId: "Nereśl" },
  { id: 153230090, stationName: "Narew", warningLevel: 170, alarmLevel: 200, voivodeship: "podlaskie", riverId: "Narew" },
  { id: 153210210, stationName: "Nowogród", warningLevel: 360, alarmLevel: 400, voivodeship: "podlaskie", riverId: "Narew" },
  { id: 153220160, stationName: "Osowiec", warningLevel: 460, alarmLevel: 490, voivodeship: "podlaskie", riverId: "Ełk" },
  { id: 153220170, stationName: "Osowiec", warningLevel: 400, alarmLevel: 430, voivodeship: "podlaskie", riverId: "Biebrza" },
  { id: 153220010, stationName: "Piątnica-Łomża", warningLevel: 410, alarmLevel: 460, voivodeship: "podlaskie", riverId: "Narew" },
  { id: 153230040, stationName: "Płoski", warningLevel: 330, alarmLevel: 370, voivodeship: "podlaskie", riverId: "Narew" },
  { id: 154230010, stationName: "Poszeszupie", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Szeszupa" },
  { id: 153220140, stationName: "Przechody", warningLevel: 330, alarmLevel: 360, voivodeship: "podlaskie", riverId: "Ełk" },
  { id: 153210170, stationName: "Ptaki", warningLevel: 210, alarmLevel: 240, voivodeship: "podlaskie", riverId: "Pisa" },
  { id: 153220240, stationName: "Raczki", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Netta" },
  { id: 153220200, stationName: "Rajgród", warningLevel: 140, alarmLevel: 160, voivodeship: "podlaskie", riverId: "Lega" },
  { id: 153220190, stationName: "Rajgród", warningLevel: 225, alarmLevel: 240, voivodeship: "podlaskie", riverId: "Jez. Rajgrodzkie (Lega)" },
  { id: 153230120, stationName: "Siemianówka", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Narew" },
  { id: 153230130, stationName: "Strękowa Góra", warningLevel: 420, alarmLevel: 440, voivodeship: "podlaskie", riverId: "Narew" },
  { id: 153210110, stationName: "Supraśl", warningLevel: 220, alarmLevel: 260, voivodeship: "podlaskie", riverId: "Supraśl" },
  { id: 152220080, stationName: "Suraż", warningLevel: 320, alarmLevel: 340, voivodeship: "podlaskie", riverId: "Narew" },
  { id: 153230070, stationName: "Sztabin", warningLevel: 270, alarmLevel: 290, voivodeship: "podlaskie", riverId: "Biebrza" },
  { id: 153220070, stationName: "Wizna", warningLevel: 440, alarmLevel: 470, voivodeship: "podlaskie", riverId: "Narew" },
  { id: 153220220, stationName: "Woźnawieś", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Lega" },
  { id: 153230060, stationName: "Zawady", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Biała" },
  { id: 153220180, stationName: "Zawady", warningLevel: 380, alarmLevel: 400, voivodeship: "podlaskie", riverId: "Ślina" },
  { id: 154230040, stationName: "Żelwa", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Marycha" },
  { id: 153220250, stationName: "Dolistowo Stare", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Biebrza" },
  { id: 152220100, stationName: "Kozarze", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "podlaskie", riverId: "Nurzec" },

// pomorskie
  { id: 154180230, stationName: "Borucino", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Radunia" },
  { id: 153190030, stationName: "Prabuty", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Jez. Dzierzgoń (liwa)" },
  { id: 153190040, stationName: "Bagart", warningLevel: 790, alarmLevel: 800, voivodeship: "pomorskie", riverId: "Elbląg" },
  { id: 154180070, stationName: "Bolszewo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Bolszewka" },
  { id: 154170190, stationName: "Borucino", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Jez. Raduńskie Górne (Radunia)" },
  { id: 154170110, stationName: "Cęcenowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Łeba" },
  { id: 154160140, stationName: "Charnowo", warningLevel: 290, alarmLevel: 340, voivodeship: "pomorskie", riverId: "Słupia" },
  { id: 154160130, stationName: "Ciecholub", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Studnica" },
  { id: 154170070, stationName: "Gałąźnia Mała", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Słupia" },
  { id: 154170050, stationName: "Gardna Wielka", warningLevel: 570, alarmLevel: 610, voivodeship: "pomorskie", riverId: "Jez. Gardno (Łupawa)" },
  { id: 154180140, stationName: "Gdańsk - Port Północny", warningLevel: 550, alarmLevel: 570, voivodeship: "pomorskie", riverId: "Morze Bałtyckie" },
  { id: 154180190, stationName: "Gdańsk - Przegalina", warningLevel: 650, alarmLevel: 700, voivodeship: "pomorskie", riverId: "Wisła" },
  { id: 154180160, stationName: "Gdańsk - Sobieszewo", warningLevel: 550, alarmLevel: 570, voivodeship: "pomorskie", riverId: "Martwa Wisła" },
  { id: 154180200, stationName: "Gdańsk - Świbno", warningLevel: 600, alarmLevel: 680, voivodeship: "pomorskie", riverId: "Wisła" },
  { id: 154180210, stationName: "Gdańsk - Ujście Wisły", warningLevel: 600, alarmLevel: 680, voivodeship: "pomorskie", riverId: "Wisła" },
  { id: 154180220, stationName: "Gdańska Głowa", warningLevel: 730, alarmLevel: 810, voivodeship: "pomorskie", riverId: "Wisła" },
  { id: 154180120, stationName: "Gdynia", warningLevel: 550, alarmLevel: 570, voivodeship: "pomorskie", riverId: "Morze Bałtyckie" },
  { id: 153180120, stationName: "Hel", warningLevel: 550, alarmLevel: 570, voivodeship: "pomorskie", riverId: "Morze Bałtyckie" },
  { id: 154170090, stationName: "Izbica", warningLevel: 560, alarmLevel: 600, voivodeship: "pomorskie", riverId: "Jez. Łebsko (Łeba)" },
  { id: 154190070, stationName: "Krynica Morska", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Zalew Wiślany" },
  { id: 153180130, stationName: "Kwidzyn", warningLevel: 300, alarmLevel: 340, voivodeship: "pomorskie", riverId: "Liwa" },
  { id: 154170040, stationName: "Kwisno", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Wieprza" },
  { id: 154170100, stationName: "Łeba", warningLevel: 570, alarmLevel: 610, voivodeship: "pomorskie", riverId: "Morze Bałtyckie" },
  { id: 154190010, stationName: "Nowy Dwór Gdański", warningLevel: 570, alarmLevel: 590, voivodeship: "pomorskie", riverId: "Tuja" },
  { id: 154190030, stationName: "Osłonka", warningLevel: 570, alarmLevel: 590, voivodeship: "pomorskie", riverId: "Zalew Wiślany" },
  { id: 154180040, stationName: "Ostrzyce", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Jez. Ostrzyckie (Radunia)" },
  { id: 154170130, stationName: "Pogorzelice", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Pogorzelica" },
  { id: 154180270, stationName: "Pruszcz Gdański", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Radunia" },
  { id: 154180090, stationName: "Puck", warningLevel: 550, alarmLevel: 570, voivodeship: "pomorskie", riverId: "Morze Bałtyckie" },
  { id: 154170010, stationName: "Słupsk", warningLevel: 220, alarmLevel: 260, voivodeship: "pomorskie", riverId: "Słupia" },
  { id: 154170060, stationName: "Smoldzino", warningLevel: 170, alarmLevel: 200, voivodeship: "pomorskie", riverId: "Łupawa" },
  { id: 154170120, stationName: "Soszyca", warningLevel: 120, alarmLevel: 140, voivodeship: "pomorskie", riverId: "Słupia" },
  { id: 154180180, stationName: "Suchy Dąb", warningLevel: 600, alarmLevel: 620, voivodeship: "pomorskie", riverId: "Bielawa" },
  { id: 153170070, stationName: "Swornegacie", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Zbrzyca" },
  { id: 154180150, stationName: "Tczew", warningLevel: 700, alarmLevel: 820, voivodeship: "pomorskie", riverId: "Wisła" },
  { id: 154190020, stationName: "Tujsk", warningLevel: 570, alarmLevel: 590, voivodeship: "pomorskie", riverId: "Szkarpawa" },
  { id: 154160110, stationName: "Ustka", warningLevel: 570, alarmLevel: 600, voivodeship: "pomorskie", riverId: "Morze Bałtyckie" },
  { id: 154180050, stationName: "Warszkowski Młyn", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Piaśnica" },
  { id: 154170180, stationName: "Wawrzynowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Wda" },
  { id: 154180080, stationName: "Wejherowo", warningLevel: 130, alarmLevel: 160, voivodeship: "pomorskie", riverId: "Reda" },
  { id: 154180170, stationName: "Wiślina", warningLevel: 560, alarmLevel: 580, voivodeship: "pomorskie", riverId: "Motława" },
  { id: 154180100, stationName: "Władysławowo", warningLevel: 550, alarmLevel: 570, voivodeship: "pomorskie", riverId: "Morze Bałtyckie" },
  { id: 154180110, stationName: "Zapowiednik", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Wierzyca" },
  { id: 154180150, stationName: "Zawiaty", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Łupawa" },
  { id: 153180050, stationName: "Błędno", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Wda" },
  { id: 154170240, stationName: "Borucino", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Borucinka" },
  { id: 153180030, stationName: "Bożepole Szlacheckie", warningLevel: 150, alarmLevel: 180, voivodeship: "pomorskie", riverId: "Wierzyca" },
  { id: 153180110, stationName: "Brody Pomorskie", warningLevel: 320, alarmLevel: 350, voivodeship: "pomorskie", riverId: "Wierzyca" },
  { id: 153179996, stationName: "Chociński Młyn", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Chocina" },
  { id: 153170050, stationName: "Ciecholewy", warningLevel: 210, alarmLevel: 240, voivodeship: "pomorskie", riverId: "Brda" },
  { id: 153180010, stationName: "Czarna Woda", warningLevel: 130, alarmLevel: 150, voivodeship: "pomorskie", riverId: "Wda" },
  { id: 153160260, stationName: "Czarne", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Czernica" },
  { id: 154180060, stationName: "Goręczyno", warningLevel: 210, alarmLevel: 240, voivodeship: "pomorskie", riverId: "Radunia" },
  { id: 154160120, stationName: "Korzybie", warningLevel: 130, alarmLevel: 160, voivodeship: "pomorskie", riverId: "Wieprza" },
  { id: 154170020, stationName: "Krępa", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Głażna" },
  { id: 154170160, stationName: "Łebork 2", warningLevel: 150, alarmLevel: 200, voivodeship: "pomorskie", riverId: "Łeba" },
  { id: 154170080, stationName: "Łupawa", warningLevel: 130, alarmLevel: 160, voivodeship: "pomorskie", riverId: "Łupawa" },
  { id: 154180020, stationName: "Miłoszewo", warningLevel: 250, alarmLevel: 260, voivodeship: "pomorskie", riverId: "Łeba" },
  { id: 154170230, stationName: "Obrowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Łupawa" },
  { id: 154180260, stationName: "Pruszcz Gdański-kanał", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Kanał Raduński" },
  { id: 154180010, stationName: "Sarnowy", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Wierzyca" },
  { id: 154170030, stationName: "Skarszów Dolny", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Skotawa" },
  { id: 154179991, stationName: "Stężyca", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Radunia" },
  { id: 153170060, stationName: "Swornegacie", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Brda" },
  { id: 154180030, stationName: "Zamostne", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Reda" },
  { id: 154179998, stationName: "Damno", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Łupawa" },
  { id: 154180280, stationName: "Dębki", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Morze Bałtyckie" },
  { id: 154190180, stationName: "Nowy Świat - Ujście", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Morze Bałtyckie" },
  { id: 154190200, stationName: "Nowy Świat - Zalew", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Zalew Wiślany" },
  { id: 154180290, stationName: "Reda-Cedron", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Reda" },
  { id: 154180300, stationName: "Skarszewy", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Wietcisa" },
  { id: 154170340, stationName: "Żełkówko", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Słupia" },
  { id: 154170330, stationName: "Łebsko", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "pomorskie", riverId: "Łeba" },

  //śląskie 
  { id: 150190140, stationName: "Bieruń Nowy", warningLevel: 220, alarmLevel: 330, voivodeship: "śląskie", riverId: "Wisła" },
  { id: 150190050, stationName: "Bieruń Stary", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Mleczna" },
  { id: 150190010, stationName: "Brynica", warningLevel: 180, alarmLevel: 220, voivodeship: "śląskie", riverId: "Brynica" },
  { id: 149180020, stationName: "Chałupki", warningLevel: 300, alarmLevel: 420, voivodeship: "śląskie", riverId: "Odra" },
  { id: 149180070, stationName: "Cieszyn", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Młynówka" },
  { id: 149190080, stationName: "Cięcina", warningLevel: 280, alarmLevel: 360, voivodeship: "śląskie", riverId: "Soła" },
  { id: 149190120, stationName: "Czaniec-Kobiernice", warningLevel: 320, alarmLevel: 450, voivodeship: "śląskie", riverId: "Soła" },
  { id: 149190010, stationName: "Czechowice-Bestwina", warningLevel: 190, alarmLevel: 260, voivodeship: "śląskie", riverId: "Biała" },
  { id: 149180240, stationName: "Goczałkowice", warningLevel: 290, alarmLevel: 410, voivodeship: "śląskie", riverId: "Wisła" },
  { id: 149180120, stationName: "Górki Wielkie", warningLevel: 220, alarmLevel: 260, voivodeship: "śląskie", riverId: "Brennica" },
  { id: 149180130, stationName: "Istebna", warningLevel: 190, alarmLevel: 210, voivodeship: "śląskie", riverId: "Olza" },
  { id: 149190020, stationName: "Kamesznica", warningLevel: 210, alarmLevel: 260, voivodeship: "śląskie", riverId: "Bystra" },
  { id: 150180250, stationName: "Kłodnica", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Kłodnica" },
  { id: 150180270, stationName: "Kozłowa Góra", warningLevel: 90, alarmLevel: 120, voivodeship: "śląskie", riverId: "Brynica" },
  { id: 151170010, stationName: "Krzyżanowice", warningLevel: 360, alarmLevel: 500, voivodeship: "śląskie", riverId: "Odra" },
  { id: 150190130, stationName: "Łagisza", warningLevel: 200, alarmLevel: 240, voivodeship: "śląskie", riverId: "Przemsza" },
  { id: 149180030, stationName: "Łaziska", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Olza" },
  { id: 150180090, stationName: "Nędza", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Sumina" },
  { id: 150180210, stationName: "Niwki", warningLevel: 200, alarmLevel: 250, voivodeship: "śląskie", riverId: "Liswarta" },
  { id: 149180300, stationName: "Olza", warningLevel: 500, alarmLevel: 610, voivodeship: "śląskie", riverId: "Odra" },
  { id: 149180230, stationName: "Podkępie", warningLevel: 330, alarmLevel: 410, voivodeship: "śląskie", riverId: "Wapienica" },
  { id: 150190120, stationName: "Przeczyce", warningLevel: 100, alarmLevel: 150, voivodeship: "śląskie", riverId: "Przemsza" },
  { id: 150180160, stationName: "Pszczyna", warningLevel: 290, alarmLevel: 340, voivodeship: "śląskie", riverId: "Pszczynka" },
  { id: 150180220, stationName: "Pyskowice-Dzierżno", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Drama" },
  { id: 150180150, stationName: "Pyskowice-Dzierżno", warningLevel: "250", alarmLevel: "350", voivodeship: "śląskie", riverId: "Kłodnica" },
  { id: 150180060, stationName: "Racibórz-Miedonia", warningLevel: 400, alarmLevel: 600, voivodeship: "śląskie", riverId: "Odra" },
  { id: 150190080, stationName: "Radocha", warningLevel: 90, alarmLevel: 130, voivodeship: "śląskie", riverId: "Przemsza" },
  { id: 150180140, stationName: "Rybnik", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Nacyna" },
  { id: 150180280, stationName: "Rybnik-Gortatowice", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Ruda" },
  { id: 150180130, stationName: "Rybnik-Stodoły", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Ruda" },
  { id: 149180100, stationName: "Skoczów", warningLevel: 210, alarmLevel: 260, voivodeship: "śląskie", riverId: "Wisła" },
  { id: 150180120, stationName: "Tworóg Mały", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Bierawka" },
  { id: 150190280, stationName: "Wąosz", warningLevel: 250, alarmLevel: 300, voivodeship: "śląskie", riverId: "Pilica" },
  { id: 150180230, stationName: "Wesoła", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Stoła" },
  { id: 149180140, stationName: "Wisła", warningLevel: 150, alarmLevel: 180, voivodeship: "śląskie", riverId: "Wisła" },
  { id: 149180180, stationName: "Wisła-Czarne (Biała Wisełka)", warningLevel: 90, alarmLevel: 110, voivodeship: "śląskie", riverId: "Biała Wisełka" },
  { id: 149180050, stationName: "Zebrzydowice", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Piotrówka" },
  { id: 150180040, stationName: "Bojanów", warningLevel: 150, alarmLevel: 210, voivodeship: "śląskie", riverId: "Psina" },
  { id: 149180060, stationName: "Cieszyn-Dziegielzów", warningLevel: 140, alarmLevel: 230, voivodeship: "śląskie", riverId: "Olza" },
  { id: 149180250, stationName: "Czechowice-Dziedzice", warningLevel: 330, alarmLevel: 420, voivodeship: "śląskie", riverId: "Iłownica" },
  { id: 149180080, stationName: "Drogomyśl", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Wisła" },
  { id: 150180220, stationName: "Gliwice", warningLevel: 160, alarmLevel: 220, voivodeship: "śląskie", riverId: "Kłodnica" },
  { id: 149180040, stationName: "Gołkowice", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Szotkówka" },
  { id: 150190180, stationName: "Jeleń", warningLevel: 280, alarmLevel: 330, voivodeship: "śląskie", riverId: "Przemsza" },
  { id: 150190240, stationName: "Kręciwilk", warningLevel: 80, alarmLevel: 130, voivodeship: "śląskie", riverId: "Warta" },
  { id: 150180190, stationName: "Krupski Młyn", warningLevel: 160, alarmLevel: 250, voivodeship: "śląskie", riverId: "Mała Panew" },
  { id: 151190010, stationName: "Kule", warningLevel: 250, alarmLevel: 300, voivodeship: "śląskie", riverId: "Liswarta" },
  { id: 150190210, stationName: "Kuźnica Sulikowska", warningLevel: 210, alarmLevel: 260, voivodeship: "śląskie", riverId: "Mitręga" },
  { id: 149190200, stationName: "Lgota Nadwarcie", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Warta" },
  { id: 149190070, stationName: "Łodygowice", warningLevel: 540, alarmLevel: 580, voivodeship: "śląskie", riverId: "Żylica" },
  { id: 149190030, stationName: "Mikuszowice", warningLevel: 170, alarmLevel: 200, voivodeship: "śląskie", riverId: "Biała" },
  { id: 149190220, stationName: "Mstów", warningLevel: 120, alarmLevel: 170, voivodeship: "śląskie", riverId: "Warta" },
  { id: 149190150, stationName: "Pewel Mała", warningLevel: 150, alarmLevel: 230, voivodeship: "śląskie", riverId: "Koszarawa" },
  { id: 150190190, stationName: "Piów", warningLevel: 270, alarmLevel: 330, voivodeship: "śląskie", riverId: "Przemsza" },
  { id: 150190150, stationName: "Poraj", warningLevel: 220, alarmLevel: 290, voivodeship: "śląskie", riverId: "Warta" },
  { id: 150180170, stationName: "Pyskowice", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Drama" },
  { id: 149190050, stationName: "Rajcza", warningLevel: 290, alarmLevel: 370, voivodeship: "śląskie", riverId: "Soła" },
  { id: 150180110, stationName: "Ruda Kozielska", warningLevel: 250, alarmLevel: 310, voivodeship: "śląskie", riverId: "Ruda" },
  { id: 149190070, stationName: "Szabelnia", warningLevel: 70, alarmLevel: 100, voivodeship: "śląskie", riverId: "Brynica" },
  { id: 149190040, stationName: "Ujsoły", warningLevel: 270, alarmLevel: 320, voivodeship: "śląskie", riverId: "Woda Ujsolska" },
  { id: 149180110, stationName: "Ustroń-Obłaziec", warningLevel: 180, alarmLevel: 230, voivodeship: "śląskie", riverId: "Wisła" },
  { id: 149180160, stationName: "Wisła-Czarne", warningLevel: 100, alarmLevel: 120, voivodeship: "śląskie", riverId: "Wisła" },
  { id: 149190090, stationName: "Żabnica", warningLevel: 160, alarmLevel: 200, voivodeship: "śląskie", riverId: "Żabniczanka" },
  { id: 149190100, stationName: "Żywiec", warningLevel: 280, alarmLevel: 340, voivodeship: "śląskie", riverId: "Soła" },
  { id: 150180310, stationName: "Bobrowniki", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Brynica" },
  { id: 150190390, stationName: "Częstochowa 1", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Stradomka" },
  { id: 150190400, stationName: "Częstochowa 2", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Kucelinka" },
  { id: 150190410, stationName: "Częstochowa 3", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Warta" },
  { id: 150190470, stationName: "Dąbek", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Wiercica" },
  { id: 150190430, stationName: "Kamienica Polska", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Kamieniczka" },
  { id: 149190140, stationName: "Łękawica", warningLevel: 300, alarmLevel: 350, voivodeship: "śląskie", riverId: "Łękawka" },
  { id: 150190460, stationName: "Masłońskie", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Ordonka" },
  { id: 150190100, stationName: "Niwka", warningLevel: 260, alarmLevel: 280, voivodeship: "śląskie", riverId: "Biała Przemsza" },
  { id: 150190450, stationName: "Nowa Kuźnica", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Boży Stok" },
  { id: 150180320, stationName: "Rudziniec", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Kłodnica" },
  { id: 150180330, stationName: "Rybnik-Paruszowiec", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Ruda" },
  { id: 150190250, stationName: "Sławków", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Biała Przemsza" },
  { id: 150190440, stationName: "Słowik", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Warta" },
  { id: 150180300, stationName: "Tychy", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Gostynia" },
  { id: 150190060, stationName: "Bojszowy", warningLevel: 170, alarmLevel: 230, voivodeship: "śląskie", riverId: "Gostynia" },
  { id: 149180200, stationName: "Wisła-Czarne (Czarna Wisełka)", warningLevel: 120, alarmLevel: 170, voivodeship: "śląskie", riverId: "Wisła" },
  { id: 149180210, stationName: "Zabrzeg", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "śląskie", riverId: "Wisła" },

  //swiętokrzyskie
  { id: 150200020, stationName: "Bocheniec", warningLevel: 320, alarmLevel: 370, voivodeship: "świętokrzyskie", riverId: "Wierna Rzeka" },
  { id: 151210040, stationName: "Brody Iłżeckie", warningLevel: 200, alarmLevel: 270, voivodeship: "świętokrzyskie", riverId: "Kamienna" },
  { id: 151200100, stationName: "Bzin", warningLevel: 180, alarmLevel: 230, voivodeship: "świętokrzyskie", riverId: "Kamienna" },
  { id: 151210090, stationName: "Czekarzewice", warningLevel: 160, alarmLevel: 220, voivodeship: "świętokrzyskie", riverId: "Kamienna" },
  { id: 150200160, stationName: "Daleszyce", warningLevel: 200, alarmLevel: 260, voivodeship: "świętokrzyskie", riverId: "Czarna Nida" },
  { id: 150190350, stationName: "Januszewice", warningLevel: 360, alarmLevel: 410, voivodeship: "świętokrzyskie", riverId: "Czarna" },
  { id: 150210160, stationName: "Koprzywnica", warningLevel: 290, alarmLevel: 360, voivodeship: "świętokrzyskie", riverId: "Koprzywianka" },
  { id: 150210090, stationName: "Kunów", warningLevel: 200, alarmLevel: 300, voivodeship: "świętokrzyskie", riverId: "Kamienna" },
  { id: 151210020, stationName: "Michałów", warningLevel: 110, alarmLevel: 170, voivodeship: "świętokrzyskie", riverId: "Kamienna" },
  { id: 150200010, stationName: "Mniszek", warningLevel: 270, alarmLevel: 310, voivodeship: "świętokrzyskie", riverId: "Nida" },
  { id: 150210030, stationName: "Mocha", warningLevel: 370, alarmLevel: 420, voivodeship: "świętokrzyskie", riverId: "Łagowica" },
  { id: 150200090, stationName: "Słowik", warningLevel: 260, alarmLevel: 300, voivodeship: "świętokrzyskie", riverId: "Bobrza" },
  { id: 150210060, stationName: "Staszów", warningLevel: 220, alarmLevel: 260, voivodeship: "świętokrzyskie", riverId: "Czarna" },
  { id: 151200070, stationName: "Wąsosz-Stara Wieś", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "świętokrzyskie", riverId: "Krasna" },
  { id: 150200030, stationName: "Brzegi", warningLevel: 240, alarmLevel: 300, voivodeship: "świętokrzyskie", riverId: "Nida" },
  { id: 150200050, stationName: "Michałów", warningLevel: 160, alarmLevel: 190, voivodeship: "świętokrzyskie", riverId: "Mierzawa" },
  { id: 150200120, stationName: "Morawica", warningLevel: 250, alarmLevel: 340, voivodeship: "świętokrzyskie", riverId: "Czarna Nida" },
  { id: 150210080, stationName: "Nietulisko Duże", warningLevel: 460, alarmLevel: 510, voivodeship: "świętokrzyskie", riverId: "Świślina" },
  { id: 150210100, stationName: "Połaniec", warningLevel: 290, alarmLevel: 350, voivodeship: "świętokrzyskie", riverId: "Czarna" },
  { id: 150210010, stationName: "Raków", warningLevel: 220, alarmLevel: 260, voivodeship: "świętokrzyskie", riverId: "Czarna" },
  { id: 150210040, stationName: "Rzepin", warningLevel: 400, alarmLevel: 420, voivodeship: "świętokrzyskie", riverId: "Świślina" },
  { id: 150210170, stationName: "Sandomierz", warningLevel: 420, alarmLevel: 610, voivodeship: "świętokrzyskie", riverId: "Wisła" },
  { id: 150200040, stationName: "Tokarnia", warningLevel: 240, alarmLevel: 300, voivodeship: "świętokrzyskie", riverId: "Czarna Nida" },
  { id: 151210010, stationName: "Wąchock", warningLevel: 140, alarmLevel: 190, voivodeship: "świętokrzyskie", riverId: "Kamienna" },
  { id: 151200060, stationName: "Wąsosz-Stara Wieś", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "świętokrzyskie", riverId: "Czarna" },
  { id: 150210050, stationName: "Wilkowa", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "świętokrzyskie", riverId: "Wschodnia" },
  { id: 150210220, stationName: "Włochy", warningLevel: 300, alarmLevel: 450, voivodeship: "świętokrzyskie", riverId: "Pokrzywianka" },
  { id: 150210190, stationName: "Zawichost", warningLevel: 480, alarmLevel: 620, voivodeship: "świętokrzyskie", riverId: "Wisła" },
  { id: 150200190, stationName: "Kamyszów", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "świętokrzyskie", riverId: "Nidzica" },
  { id: 150200210, stationName: "Leszczyny", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "świętokrzyskie", riverId: "Lubrzanka" },
  { id: 150200200, stationName: "Wiślica 2", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "świętokrzyskie", riverId: "Nida" },
  { id: 150200080, stationName: "Pińczów", warningLevel: 250, alarmLevel: 300, voivodeship: "świętokrzyskie", riverId: "Nida" },

//warminskomazurskie
  { id: 153190080, stationName: "Iława", warningLevel: 930, alarmLevel: 940, voivodeship: "warmińsko-mazurskie", riverId: "Jez. Jeziorak (Iławka)" },
  { id: 154190080, stationName: "Żukowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Jez.Druzno" },
  { id: 154200010, stationName: "Bornity", warningLevel: 380, alarmLevel: 440, voivodeship: "warmińsko-mazurskie", riverId: "Wałsza" },
  { id: 154190140, stationName: "Braniewo", warningLevel: 720, alarmLevel: 780, voivodeship: "warmińsko-mazurskie", riverId: "Pasłęka" },
  { id: 154210030, stationName: "Bykowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Sajna" },
  { id: 153190100, stationName: "Dziarny", warningLevel: 130, alarmLevel: 140, voivodeship: "warmińsko-mazurskie", riverId: "Iławka" },
  { id: 154190060, stationName: "Elbląg", warningLevel: 590, alarmLevel: 610, voivodeship: "warmińsko-mazurskie", riverId: "Elbląg" },
  { id: 153220050, stationName: "Ełk", warningLevel: 220, alarmLevel: 235, voivodeship: "warmińsko-mazurskie", riverId: "Jez. Ełckie (ełk)" },
  { id: 154220110, stationName: "Gołdap 2", warningLevel: 180, alarmLevel: 210, voivodeship: "warmińsko-mazurskie", riverId: "Gołdapa" },
  { id: 153200010, stationName: "Idzbark", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Drwęca" },
  { id: 154220050, stationName: "Jurkiszki", warningLevel: 180, alarmLevel: 210, voivodeship: "warmińsko-mazurskie", riverId: "Gołdapa" },
  { id: 154200020, stationName: "Krosno", warningLevel: 360, alarmLevel: 400, voivodeship: "warmińsko-mazurskie", riverId: "Drwęca Warmińska" },
  { id: 153190130, stationName: "Kuligi", warningLevel: 150, alarmLevel: 180, voivodeship: "warmińsko-mazurskie", riverId: "Wel" },
  { id: 153190150, stationName: "Lidzbark", warningLevel: 110, alarmLevel: 120, voivodeship: "warmińsko-mazurskie", riverId: "Wel" },
  { id: 154190170, stationName: "Łozy", warningLevel: 350, alarmLevel: 400, voivodeship: "warmińsko-mazurskie", riverId: "Pasłęka" },
  { id: 154190130, stationName: "Nowa Pasłęka", warningLevel: 590, alarmLevel: 630, voivodeship: "warmińsko-mazurskie", riverId: "Zalew Wiślany" },
  { id: 154190050, stationName: "Nowakowo", warningLevel: 590, alarmLevel: 630, voivodeship: "warmińsko-mazurskie", riverId: "Zalew Wiślany" },
  { id: 153190090, stationName: "Nowe Miasto Lubawskie", warningLevel: 330, alarmLevel: 340, voivodeship: "warmińsko-mazurskie", riverId: "Drwęca" },
  { id: 154190110, stationName: "Nowe Sadluki", warningLevel: 300, alarmLevel: 390, voivodeship: "warmińsko-mazurskie", riverId: "Bauda" },
  { id: 153190040, stationName: "Nowotki", warningLevel: 570, alarmLevel: 590, voivodeship: "warmińsko-mazurskie", riverId: "Nogat" },
  { id: 153190170, stationName: "Ostróda", warningLevel: 500, alarmLevel: 510, voivodeship: "warmińsko-mazurskie", riverId: "Jez. Drwęckie (Drwęca)" },
  { id: 154190100, stationName: "Pasłęk", warningLevel: 620, alarmLevel: 630, voivodeship: "warmińsko-mazurskie", riverId: "Wąska" },
  { id: 154200040, stationName: "Piaseczno", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Elma" },
  { id: 154190160, stationName: "Pierchaly", warningLevel: 570, alarmLevel: 630, voivodeship: "warmińsko-mazurskie", riverId: "Pasłęka" },
  { id: 154190150, stationName: "Pierchaly_2", warningLevel: 560, alarmLevel: 600, voivodeship: "warmińsko-mazurskie", riverId: "Pasłęka" },
  { id: 153190120, stationName: "Rodzone", warningLevel: 280, alarmLevel: 320, voivodeship: "warmińsko-mazurskie", riverId: "Drwęca" },
  { id: 153190140, stationName: "Samborowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Drwęca" },
  { id: 153200050, stationName: "Sarnowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Szkotówka" },
  { id: 154210010, stationName: "Sępopol", warningLevel: 420, alarmLevel: 450, voivodeship: "warmińsko-mazurskie", riverId: "Łyna" },
  { id: 154200030, stationName: "Smolajny", warningLevel: 280, alarmLevel: 300, voivodeship: "warmińsko-mazurskie", riverId: "Łyna" },
  { id: 153210050, stationName: "Spychowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Krutynia" },
  { id: 153200090, stationName: "Szypry", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Jez. Wadąg (Wadąg)" },
  { id: 154190090, stationName: "Tolkmicko", warningLevel: 590, alarmLevel: 630, voivodeship: "warmińsko-mazurskie", riverId: "Zalew Wiślany" },
  { id: 154220010, stationName: "Banie Mazurskie", warningLevel: 260, alarmLevel: 290, voivodeship: "warmińsko-mazurskie", riverId: "Gołdapa" },
  { id: 153220110, stationName: "Chełchy", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Lega" },
  { id: 153220060, stationName: "Ełk", warningLevel: 200, alarmLevel: 230, voivodeship: "warmińsko-mazurskie", riverId: "Ełk" },
  { id: 154210090, stationName: "Giżycko", warningLevel: 130, alarmLevel: 150, voivodeship: "warmińsko-mazurskie", riverId: "Pisa" },
  { id: 153210130, stationName: "Głodowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Jez. Śniardwy (Pisa)" },
  { id: 153200030, stationName: "Kalisty", warningLevel: 170, alarmLevel: 190, voivodeship: "warmińsko-mazurskie", riverId: "Pasłęka" },
  { id: 153220150, stationName: "Kucze", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Lega" },
  { id: 153210200, stationName: "Majdanin", warningLevel: 140, alarmLevel: 160, voivodeship: "warmińsko-mazurskie", riverId: "Jez. Roś (Pisa)" },
  { id: 154220030, stationName: "Małe Wronki", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Ełk" },
  { id: 154210100, stationName: "Mieduniszki", warningLevel: 400, alarmLevel: 450, voivodeship: "warmińsko-mazurskie", riverId: "WęgoraPa" },
  { id: 153210110, stationName: "Mikołajki", warningLevel: 110, alarmLevel: 120, voivodeship: "warmińsko-mazurskie", riverId: "Jez. Mikołajskie (Pisa)" },
  { id: 153210230, stationName: "Oryszsa", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Orzysza" },
  { id: 153200070, stationName: "Olsztyn-Kortowo", warningLevel: 140, alarmLevel: 160, voivodeship: "warmińsko-mazurskie", riverId: "Łyna" },
  { id: 153210150, stationName: "Pisz", warningLevel: 270, alarmLevel: 290, voivodeship: "warmińsko-mazurskie", riverId: "Pisa" },
  { id: 154210020, stationName: "Prosna", warningLevel: 300, alarmLevel: 330, voivodeship: "warmińsko-mazurskie", riverId: "Guber" },
  { id: 153220080, stationName: "Prostki", warningLevel: 190, alarmLevel: 220, voivodeship: "warmińsko-mazurskie", riverId: "Ełk" },
  { id: 154210080, stationName: "Prynowo", warningLevel: 250, alarmLevel: 280, voivodeship: "warmińsko-mazurskie", riverId: "WęgoraPa" },
  { id: 154210060, stationName: "Przystań", warningLevel: 160, alarmLevel: 180, voivodeship: "warmińsko-mazurskie", riverId: "Jez. Mamry (WęgoraPa)" },
  { id: 153200040, stationName: "Tomaryny", warningLevel: 280, alarmLevel: 300, voivodeship: "warmińsko-mazurskie", riverId: "Pasłęka" },
  { id: 154210070, stationName: "Węgorzewo", warningLevel: 250, alarmLevel: 280, voivodeship: "warmińsko-mazurskie", riverId: "WęgoraPa" },
  { id: 153200160, stationName: "Wielbark", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Sawica" },
  { id: 154209999, stationName: "Olkowa", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Pasłęka" },
  { id: 154210110, stationName: "Smokowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "warmińsko-mazurskie", riverId: "Dejna" },


//wielkopolskie
 { id: 151180050, stationName: "Dębe", warningLevel: 220, alarmLevel: 250, voivodeship: "wielkopolskie", riverId: "Swędrnia" },
 { id: 151170060, stationName: "Bogdaj", warningLevel: 250, alarmLevel: 300, voivodeship: "wielkopolskie", riverId: "Polska Woda" },
 { id: 151170110, stationName: "Bogusław", warningLevel: 250, alarmLevel: 300, voivodeship: "wielkopolskie", riverId: "Prosna" },
 { id: 152160070, stationName: "Czarnków", warningLevel: 250, alarmLevel: 300, voivodeship: "wielkopolskie", riverId: "Noteć" },
 { id: 152150240, stationName: "Drawiny", warningLevel: 120, alarmLevel: 170, voivodeship: "wielkopolskie", riverId: "Drawa" },
 { id: 152160150, stationName: "Głuszyna", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Kopel" },
 { id: 152160060, stationName: "Konojad", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Mogilnica" },
 { id: 152160090, stationName: "Kościan", warningLevel: 180, alarmLevel: 210, voivodeship: "wielkopolskie", riverId: "Kanał Mosiński" },
 { id: 152160110, stationName: "Kowanówko", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Wełna" },
 { id: 151180060, stationName: "Kraszewice", warningLevel: 240, alarmLevel: 260, voivodeship: "wielkopolskie", riverId: "Łużyca" },
 { id: 152180100, stationName: "Łysek", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Noteć" },
 { id: 152150200, stationName: "Międzychód", warningLevel: 380, alarmLevel: 430, voivodeship: "wielkopolskie", riverId: "Warta" },
 { id: 152160130, stationName: "Mosina", warningLevel: 160, alarmLevel: 250, voivodeship: "wielkopolskie", riverId: "Kanał Mosiński" },
 { id: 152180090, stationName: "Noć Kalina", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Noteć" },
 { id: 151170070, stationName: "Odolanów", warningLevel: 120, alarmLevel: 150, voivodeship: "wielkopolskie", riverId: "Barycz" },
 { id: 153160250, stationName: "Okonek", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Czarna" },
 { id: 153160180, stationName: "Piła", warningLevel: 190, alarmLevel: 220, voivodeship: "wielkopolskie", riverId: "Gwda" },
 { id: 151180020, stationName: "Piwonice", warningLevel: 200, alarmLevel: 230, voivodeship: "wielkopolskie", riverId: "Prosna" },
 { id: 152170040, stationName: "Prusce", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Wełna" },
 { id: 153160210, stationName: "Płusza", warningLevel: 240, alarmLevel: 290, voivodeship: "wielkopolskie", riverId: "Gwda" },
 { id: 152160120, stationName: "Ryczywół", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Flinta" },
 { id: 151160160, stationName: "Rydzyna", warningLevel: 200, alarmLevel: 240, voivodeship: "wielkopolskie", riverId: "Polski Rów" },
 { id: 152170120, stationName: "Samarzewo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Wrześnica" },
 { id: 152160080, stationName: "Szamotuły", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Sama" },
 { id: 152170150, stationName: "Trąbczyn", warningLevel: 180, alarmLevel: 230, voivodeship: "wielkopolskie", riverId: "Czarna Struga" },
 { id: 153160170, stationName: "Ujście", warningLevel: 310, alarmLevel: 330, voivodeship: "wielkopolskie", riverId: "Noteć" },
 { id: 153160190, stationName: "Zabrodzie", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Piława" },
 { id: 152150220, stationName: "Zbąszyń", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Obra" },
 { id: 153170010, stationName: "Białośliwie", warningLevel: 280, alarmLevel: 330, voivodeship: "wielkopolskie", riverId: "Noteć" },
 { id: 152150230, stationName: "Chelst", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Miala" },
 { id: 152180150, stationName: "Dąbie", warningLevel: 250, alarmLevel: 300, voivodeship: "wielkopolskie", riverId: "Ner" },
 { id: 152180140, stationName: "Grzegorzew", warningLevel: 240, alarmLevel: 280, voivodeship: "wielkopolskie", riverId: "Rgilewka" },
 { id: 152180120, stationName: "Koło", warningLevel: 340, alarmLevel: 390, voivodeship: "wielkopolskie", riverId: "Warta" },
 { id: 152180160, stationName: "Konin-Morzysław", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Kanał Ślesiński" },
 { id: 152180110, stationName: "Kościelec", warningLevel: 240, alarmLevel: 270, voivodeship: "wielkopolskie", riverId: "Kiełbaska Duża" },
 { id: 152170130, stationName: "Ląd", warningLevel: 330, alarmLevel: 370, voivodeship: "wielkopolskie", riverId: "Warta" },
 { id: 152170090, stationName: "Nowa Wieś Podgórna", warningLevel: 430, alarmLevel: 480, voivodeship: "wielkopolskie", riverId: "Warta" },
 { id: 152160100, stationName: "Oborniki", warningLevel: 420, alarmLevel: 560, voivodeship: "wielkopolskie", riverId: "Warta" },
 { id: 151170080, stationName: "Odolanów", warningLevel: 160, alarmLevel: 190, voivodeship: "wielkopolskie", riverId: "Kuroch" },
 { id: 151180010, stationName: "Ołobok", warningLevel: 220, alarmLevel: 260, voivodeship: "wielkopolskie", riverId: "Ołobok" },
 { id: 152180060, stationName: "Posoka", warningLevel: 260, alarmLevel: 300, voivodeship: "wielkopolskie", riverId: "Powa" },
 { id: 152160140, stationName: "Poznań-Most Rocha", warningLevel: 400, alarmLevel: 500, voivodeship: "wielkopolskie", riverId: "Warta" },
 { id: 152170080, stationName: "Pydzry", warningLevel: 410, alarmLevel: 450, voivodeship: "wielkopolskie", riverId: "Warta" },
 { id: 152180050, stationName: "Sławsk", warningLevel: 450, alarmLevel: 480, voivodeship: "wielkopolskie", riverId: "Warta" },
 { id: 152170010, stationName: "Śrem", warningLevel: 400, alarmLevel: 460, voivodeship: "wielkopolskie", riverId: "Warta" },
 { id: 152170030, stationName: "Wierzenica", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Główna" },
 { id: 152160050, stationName: "Wronki", warningLevel: 380, alarmLevel: 470, voivodeship: "wielkopolskie", riverId: "Warta" },
 { id: 153170040, stationName: "Wyrzysk", warningLevel: 160, alarmLevel: 200, voivodeship: "wielkopolskie", riverId: "Łobżonka" },
 { id: 151180190, stationName: "Grabów Nad Prosną", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Prosna" },
 { id: 152179994, stationName: "Raszewy", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Lutynia" },
 { id: 152180180, stationName: "Zaborowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Pichna" },
 { id: 153160160, stationName: "Ujście 2", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "wielkopolskie", riverId: "Noteć" },

 //zachodniopomorskie
 { id: 153160030, stationName: "Stare Drawsko", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Drawa" },
 { id: 154150040, stationName: "Bardy", warningLevel: 360, alarmLevel: 400, voivodeship: "zachodniopomorskie", riverId: "Parsęta" },
 { id: 154150050, stationName: "Białogard", warningLevel: 270, alarmLevel: 290, voivodeship: "zachodniopomorskie", riverId: "Parsęta" },
 { id: 154160020, stationName: "Białogórzyno", warningLevel: 190, alarmLevel: 210, voivodeship: "zachodniopomorskie", riverId: "Radew" },
 { id: 152140010, stationName: "Bielinek", warningLevel: 480, alarmLevel: 550, voivodeship: "zachodniopomorskie", riverId: "Odra" },
 { id: 154160150, stationName: "Darłowo", warningLevel: 570, alarmLevel: 610, voivodeship: "zachodniopomorskie", riverId: "Morze Bałtyckie" },
 { id: 152140100, stationName: "Dolsk", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Myśla" },
 { id: 153150100, stationName: "Drawno", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Drawa" },
 { id: 153150120, stationName: "Drawsko Pomorskie", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Drawa" },
 { id: 153140070, stationName: "Dziwnów", warningLevel: 560, alarmLevel: 580, voivodeship: "zachodniopomorskie", riverId: "Morze Bałtyckie" },
 { id: 153160040, stationName: "Gogolewo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Krąpiel" },
 { id: 153140090, stationName: "Goleniów", warningLevel: 270, alarmLevel: 320, voivodeship: "zachodniopomorskie", riverId: "Ina" },
 { id: 152140020, stationName: "Gozdowice", warningLevel: 440, alarmLevel: 500, voivodeship: "zachodniopomorskie", riverId: "Odra" },
 { id: 153140030, stationName: "Gryfino", warningLevel: 570, alarmLevel: 600, voivodeship: "zachodniopomorskie", riverId: "Odra" },
 { id: 153160200, stationName: "Gwda Wielka", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Gwda" },
 { id: 154150030, stationName: "Kołobrzeg", warningLevel: 570, alarmLevel: 610, voivodeship: "zachodniopomorskie", riverId: "Morze Bałtyckie" },
 { id: 153150030, stationName: "Kulice", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Sąpólna" },
 { id: 153150020, stationName: "Morzyca", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Mała Ina" },
 { id: 152140120, stationName: "Myślibórz", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Myśla" },
 { id: 153160070, stationName: "Nadarzyce", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Piława" },
 { id: 153140110, stationName: "Okunica", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Płonia" },
 { id: 154160100, stationName: "Pieszcz", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Moszczeniczanka" },
 { id: 153150050, stationName: "Reśko", warningLevel: 410, alarmLevel: 430, voivodeship: "zachodniopomorskie", riverId: "Rega" },
 { id: 153150010, stationName: "Stargard", warningLevel: 250, alarmLevel: 280, voivodeship: "zachodniopomorskie", riverId: "Ina" },
 { id: 154160070, stationName: "Stary Kraków", warningLevel: 460, alarmLevel: 500, voivodeship: "zachodniopomorskie", riverId: "Wieprza" },
 { id: 153160080, stationName: "Storkowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Parsęta" },
 { id: 153140050, stationName: "Szczecin Most Długi", warningLevel: 570, alarmLevel: 600, voivodeship: "zachodniopomorskie", riverId: "Odra" },
 { id: 153140190, stationName: "Szczecin-Podjuchy", warningLevel: 580, alarmLevel: 610, voivodeship: "zachodniopomorskie", riverId: "Regalica" },
 { id: 153140010, stationName: "Świnoujście", warningLevel: 560, alarmLevel: 580, voivodeship: "zachodniopomorskie", riverId: "Morze Bałtyckie" },
 { id: 153140040, stationName: "Trzebież", warningLevel: 540, alarmLevel: 560, voivodeship: "zachodniopomorskie", riverId: "Zalew Szczeciński" },
 { id: 153160020, stationName: "Tychówko", warningLevel: 320, alarmLevel: 380, voivodeship: "zachodniopomorskie", riverId: "Parsęta" },
 { id: 153140020, stationName: "Widuchowa", warningLevel: 630, alarmLevel: 650, voivodeship: "zachodniopomorskie", riverId: "Odra" },
 { id: 153140080, stationName: "Widzierzńsko", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Gowienica" },
 { id: 153140060, stationName: "Wolin", warningLevel: 560, alarmLevel: 580, voivodeship: "zachodniopomorskie", riverId: "Cieśnina Dziwna" },
 { id: 153140100, stationName: "Żelewo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Płonia" },
 { id: 154160080, stationName: "Cybulino", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Radew" },
 { id: 153150090, stationName: "Gola Dolna", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Rega" },
 { id: 154160060, stationName: "Grabowo", warningLevel: 160, alarmLevel: 170, voivodeship: "zachodniopomorskie", riverId: "Grabowa" },
 { id: 154160030, stationName: "Koszalin", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Dzierżęcinka" },
 { id: 154160090, stationName: "Krąg", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Grabowa" },
 { id: 153150080, stationName: "Łobez", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Rega" },
 { id: 154150010, stationName: "Trzebiatów", warningLevel: 350, alarmLevel: 370, voivodeship: "zachodniopomorskie", riverId: "Rega" },
 { id: 153160110, stationName: "Wiesiołło", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Dobrzyca" },
 { id: 154150070, stationName: "Karlino", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Parsęta" },
 { id: 153150190, stationName: "Morzywo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Mołstowa" },
 { id: 153140200, stationName: "Morzyczyn", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Jez. Miedwie (Płonia)" },
 { id: 154140000, stationName: "Rościęcino", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Parsęta" },
 { id: 154169997, stationName: "Sławno", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Wieprza" },
 { id: 154160160, stationName: "Zielnowo", warningLevel: "nie określono", alarmLevel: "nie określono", voivodeship: "zachodniopomorskie", riverId: "Wieprza" },

];

// Mapowanie nazw stacji na ich ID
export const STATION_NAME_TO_ID = {
  "Kostrzyn n. Odrą": 152140060,
  "Racibórz-Miedonia": 150180060,
  "Opole-Groszowice": 150170290,
  "Krapkowice": 150170240,
  "Szczecin Most Długi": 153140050,
  "Brzeg Dolny": 151160170,
  "Słubice": 152140050,
  "Gozdowice": 152140020,
  "Bielinek": 152140010,
  "Gryfino": 153140030,
  "Biała Góra": 152140090,
  "Głogów": 151160060,
  "Ścinawa": 151160130,
  "Malczyce": 151160150,
  "Brzeg": 150170090,
  "Oława": 150170040,
  "Trestno": 151170030,
  "Borów": 150160280,
  "Ujście Nysy Kłodzkiej": 150170130,
  "Chałupki": 149180020,
  "Istebna": 149180130,
  "Krzyżanowice": 149180010,
  "Nowa Sól": 151150150,
  "Cigacice": 152150130,
  "Nietków": 152150050,
  "Połęcko": 152140130,
  "Koźle": 150180030
  // Dodaj więcej stacji według potrzeb
};

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
 * Funkcja znajdująca dane poziomów dla określonej stacji po jej ID
 * @param {string|number} stationId - ID stacji
 * @returns {Object|null} - Dane poziomów lub null jeśli nie znaleziono
 */
export const findStationLevelsById = (stationId) => {
  if (!stationId) return null;
  
  // Przekształć ID do formatu liczby (jeśli jest stringiem)
  const numericId = typeof stationId === 'string' ? parseInt(stationId, 10) : stationId;
  
  console.log(`Szukanie stacji po ID: ${numericId}`);
  
  // Szukaj dokładnego dopasowania
  const station = HYDRO_LEVELS.find(s => s.id === numericId);
  
  if (station) {
    console.log(`Znaleziono stację ${station.stationName} po ID: ${numericId}`);
    return station;
  }
  
  console.log(`Nie znaleziono stacji o ID: ${numericId}`);
  return null;
};

/**
 * Funkcja znajdująca dane poziomów dla określonej stacji po jej nazwie
 * @param {string} stationName - Nazwa stacji
 * @param {string} [voivodeship] - Opcjonalnie: województwo dla lepszego dopasowania
 * @param {string} [riverName] - Opcjonalnie: nazwa rzeki dla lepszego dopasowania
 * @returns {Object|null} - Dane poziomów lub null jeśli nie znaleziono
 */
export const findStationByName = (stationName, voivodeship = null, riverName = null) => {
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

  // 2. Próba znalezienia dokładnego dopasowania z województwem
  if (normalizedVoivodeship) {
     const matchesWithVoivodeship = HYDRO_LEVELS.filter(
      station =>
        station.stationName.toLowerCase() === normalizedStation &&
        station.voivodeship?.toLowerCase() === normalizedVoivodeship
    );
    if (matchesWithVoivodeship.length === 1) return matchesWithVoivodeship[0];
    if (matchesWithVoivodeship.length > 1 && normalizedRiver) {
        const specificRiverMatch = matchesWithVoivodeship.find(
            station => station.riverId?.toLowerCase() === normalizedRiver
        );
        if (specificRiverMatch) return specificRiverMatch;
        if (matchesWithVoivodeship.length === 1) return matchesWithVoivodeship[0];
        if (matchesWithVoivodeship.length > 0) return matchesWithVoivodeship[0];
    } else if (matchesWithVoivodeship.length > 0) {
         return matchesWithVoivodeship[0];
    }
  }

  // 3. Próba znalezienia dokładnego dopasowania z rzeką
  if (normalizedRiver) {
     const matchesWithRiver = HYDRO_LEVELS.filter(
      station =>
        station.stationName.toLowerCase() === normalizedStation &&
        station.riverId?.toLowerCase() === normalizedRiver
    );
     if (matchesWithRiver.length === 1) return matchesWithRiver[0];
     if (matchesWithRiver.length > 1 && normalizedVoivodeship) {
         const specificVoivodeshipMatch = matchesWithRiver.find(
             station => station.voivodeship?.toLowerCase() === normalizedVoivodeship
         );
         if (specificVoivodeshipMatch) return specificVoivodeshipMatch;
         if (matchesWithRiver.length > 0) return matchesWithRiver[0];
     } else if (matchesWithRiver.length > 0) {
         return matchesWithRiver[0];
     }
  }

  // 4. Próbujemy znaleźć dokładne dopasowanie samej nazwy stacji (pierwsze wystąpienie)
  const exactNameMatches = HYDRO_LEVELS.filter(
    station => station.stationName.toLowerCase() === normalizedStation
  );
  if (exactNameMatches.length === 1) return exactNameMatches[0];
  if (exactNameMatches.length > 1) {
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
 * Główna funkcja do znajdowania poziomów dla stacji, próbuje różnych metod
 * @param {string|number} stationIdentifier - ID lub nazwa stacji
 * @param {string} [voivodeship] - Opcjonalnie: województwo
 * @param {string} [riverName] - Opcjonalnie: nazwa rzeki
 * @returns {Object|null} - Dane poziomów lub null jeśli nie znaleziono
 */
export const findStationLevels = (stationIdentifier, voivodeship = null, riverName = null) => {
  console.log("findStationLevels - szukam:", stationIdentifier);
  
  // 1. Sprawdź, czy nazwa stacji ma mapowane ID
  if (typeof stationIdentifier === 'string' && STATION_NAME_TO_ID[stationIdentifier]) {
    const stationId = STATION_NAME_TO_ID[stationIdentifier];
    const stationById = findStationLevelsById(stationId);
    if (stationById) {
      console.log(`Znaleziono stację ${stationIdentifier} przez mapowane ID: ${stationId}`);
      return stationById;
    }
  }
  
  // 2. Sprawdź, czy to jest ID
  if (!isNaN(stationIdentifier)) {
    // Jeśli to ID (liczba lub string reprezentujący liczbę), znajdź po ID
    const result = findStationLevelsById(stationIdentifier);
    if (result) return result;
  }
  
  // 3. Jeśli to nie ID lub nie znaleziono po ID, traktuj jako nazwę
  let result = findStationByName(stationIdentifier, voivodeship, riverName);
  if (result) return result;
  
  // 4. Sprawdź specjalne przypadki dla problematycznych stacji
  if (stationIdentifier === "Racibórz-Miedonia" || stationIdentifier === "Racibórz Miedonia") {
    const station = HYDRO_LEVELS.find(s => s.id === 150190060);
    if (station) return station;
  }
  
  if (stationIdentifier === "Krapkowice") {
    const station = HYDRO_LEVELS.find(s => s.id === 150170240);
    if (station) return station;
  }
  
  if (stationIdentifier === "Opole-Groszowice" || stationIdentifier === "Opole-Groszowice") {
    const station = HYDRO_LEVELS.find(s => s.id === 150170290);
    if (station) return station;
  }
  
  if (stationIdentifier === "Kostrzyn n. Odrą" || stationIdentifier === "Kostrzyn n. Odrą") {
    const station = HYDRO_LEVELS.find(s => s.id === 152140060);
    if (station) return station;
  }
  
  if (stationIdentifier === "Szczecin Most Długi" || stationIdentifier === "Szczecin Most Długi" || stationIdentifier === "Szczecin") {
    const station = HYDRO_LEVELS.find(s => s.id === 153140051 || s.id === 153140050);
    if (station) return station;
  }
  
  if (stationIdentifier === "Brzeg Dolny") {
    const station = HYDRO_LEVELS.find(s => s.id === 151160170);
    if (station) return station;
  }
  
  // 5. Jeśli nie znaleziono, normalizujemy nazwy i szukamy dokładniej
  if (typeof stationIdentifier === 'string') {
    const normalizedSearchName = stationIdentifier.toLowerCase()
      .replace(/[-\s]/g, '') // Usuń myślniki i spacje
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Usuń znaki diakrytyczne
      .replace(/ł/g, "l"); // Zamień ł na l
    
    // Szukamy po wszystkich stacjach
    for (const station of HYDRO_LEVELS) {
      const normalizedStationName = station.stationName.toLowerCase()
        .replace(/[-\s]/g, '')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/ł/g, "l");
      
      // Porównanie po znormalizowanych nazwach
      if (normalizedStationName === normalizedSearchName) {
        console.log("Znaleziono przez normalizację:", station.stationName);
        return station;
      }
    }
  }
  
  console.log("Nie znaleziono stacji:", stationIdentifier);
  return null;
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
    .replace(/[\s\-()]/g, ''); // Usuń spacje, myślniki i nawiasy
};