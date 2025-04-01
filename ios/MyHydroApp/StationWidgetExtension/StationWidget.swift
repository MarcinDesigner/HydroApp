import WidgetKit
import SwiftUI

// Struktura danych dla stacji
struct StationData: Codable {
    let name: String
    let river: String
    let level: Int
    let trend: String // "up", "down", "stable"
    let status: String // "alarm", "warning", "normal"
    let updateTime: String
}

// Entry struktury dla widgetu
struct StationEntry: TimelineEntry {
    let date: Date
    let station: StationData
}

// Provider danych dla widgetu
struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> StationEntry {
        // Placeholder widgetu podczas ładowania
        StationEntry(
            date: Date(),
            station: StationData(
                name: "Ładowanie...",
                river: "---",
                level: 0,
                trend: "stable",
                status: "normal",
                updateTime: "00:00"
            )
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (StationEntry) -> ()) {
        // Szybki snapshot dla galerii widgetów
        let entry = loadEntry()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<StationEntry>) -> ()) {
        let entry = loadEntry()
        
        // Ustawienie czasu odświeżenia za 30 minut
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        completion(timeline)
    }
    
    // Ładowanie danych z App Group
    private func loadEntry() -> StationEntry {
        // Domyślne dane
        var stationData = StationData(
            name: "Wybierz stację",
            river: "---",
            level: 0,
            trend: "stable",
            status: "normal",
            updateTime: DateFormatter.localizedString(from: Date(), dateStyle: .none, timeStyle: .short)
        )
        
        // Próba pobrania danych z UserDefaults w App Group
        if let sharedDefaults = UserDefaults(suiteName: "group.com.yourcompany.hydroapp") {
            if let savedData = sharedDefaults.data(forKey: "favorite_station") {
                do {
                    let decoder = JSONDecoder()
                    stationData = try decoder.decode(StationData.self, from: savedData)
                } catch {
                    print("Error decoding widget data: \(error)")
                }
            }
        }
        
        return StationEntry(date: Date(), station: stationData)
    }
}

// Widok dla widgetu
struct StationWidgetEntryView : View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family
    @Environment(\.colorScheme) var colorScheme
    
    var statusColor: Color {
        switch entry.station.status {
        case "alarm":
            return .red
        case "warning":
            return .orange
        default:
            return .green
        }
    }
    
    var trendIcon: String {
        switch entry.station.trend {
        case "up":
            return "arrow.up"
        case "down":
            return "arrow.down"
        default:
            return "arrow.right"
        }
    }
    
    var trendColor: Color {
        switch entry.station.trend {
        case "up":
            return .red
        case "down":
            return .green
        default:
            return .gray
        }
    }
    
    var body: some View {
        ZStack {
            Color(colorScheme == .dark ? .black : .white)
                .opacity(1.0)
            
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(entry.station.name)
                        .font(.headline)
                        .fontWeight(.bold)
                    
                    Spacer()
                    
                    Circle()
                        .fill(statusColor)
                        .frame(width: 10, height: 10)
                }
                
                Text(entry.station.river)
                    .font(.subheadline)
                    .foregroundColor(.gray)
                
                HStack {
                    HStack(alignment: .lastTextBaseline, spacing: 4) {
                        Text("\(entry.station.level)")
                            .font(.system(size: 32))
                            .fontWeight(.bold)
                        
                        Text("cm")
                            .font(.subheadline)
                            .padding(.bottom, 4)
                    }
                    
                    Spacer()
                    
                    Image(systemName: trendIcon)
                        .foregroundColor(trendColor)
                }
                .padding(.vertical, 8)
                
                Spacer()
                
                Text("Aktualizacja: \(entry.station.updateTime)")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            .padding(16)
        }
    }
}

// Konfiguracja widgetu
struct StationWidget: Widget {
    let kind: String = "StationWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            StationWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Stan wody")
        .description("Pokazuje aktualny stan wody w wybranej stacji.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// Podgląd widgetu dla środowiska deweloperskiego
struct StationWidget_Previews: PreviewProvider {
    static var previews: some View {
        StationWidgetEntryView(
            entry: StationEntry(
                date: Date(),
                station: StationData(
                    name: "Warszawa",
                    river: "Wisła",
                    level: 342,
                    trend: "up",
                    status: "alarm",
                    updateTime: "14:30"
                )
            )
        )
        .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}

// Punkt wejścia do widgetu
@main
struct HydroWidgets: WidgetBundle {
    @WidgetBundleBuilder
    var body: some Widget {
        StationWidget()
    }
}