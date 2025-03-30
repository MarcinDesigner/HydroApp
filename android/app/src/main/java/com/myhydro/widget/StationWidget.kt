// Plik: android/app/src/main/java/com/myhydro/widget/StationWidget.kt
// (rozbudowany)
package com.myhydro.widget

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.cornerRadius
import androidx.glance.background
import androidx.glance.layout.*
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider

class StationWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        // W prawdziwej aplikacji dane byłyby pobierane z API lub bazy danych
        val stationData = StationData(
            name = "Płock",
            level = 342,
            trend = "up",
            status = "alarm",
            river = "Wisła",
            updateTime = "14:30"
        )
        
        provideContent {
            StationWidgetContent(stationData)
        }
    }
}

data class StationData(
    val name: String,
    val level: Int,
    val trend: String,
    val status: String,
    val river: String,
    val updateTime: String
)

@Composable
fun StationWidgetContent(station: StationData) {
    val statusColor = when (station.status) {
        "alarm" -> Color.Red
        "warning" -> Color(0xFFFFC107) // amber
        else -> Color(0xFF4CAF50) // green
    }
    
    val trendIcon = when (station.trend) {
        "up" -> "↑"
        "down" -> "↓"
        else -> "→"
    }
    
    val trendColor = when (station.trend) {
        "up" -> Color.Red
        "down" -> Color(0xFF4CAF50) // green
        else -> Color.Gray
    }
    
    Column(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(Color.White)
            .cornerRadius(16.dp)
            .padding(16.dp)
    ) {
        Row(
            modifier = GlanceModifier.fillMaxWidth(),
            horizontalAlignment = Alignment.SpaceBetween
        ) {
            Text(
                text = station.name,
                style = TextStyle(
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    color = ColorProvider(Color.Black)
                )
            )
            
            Box(
                modifier = GlanceModifier
                    .size(12.dp)
                    .background(statusColor)
                    .cornerRadius(6.dp)
            )
        }
        
        Text(
            text = station.river,
            style = TextStyle(
                fontSize = 14.sp,
                color = ColorProvider(Color.Gray)
            ),
            modifier = GlanceModifier.padding(top = 4.dp)
        )
        
        Row(
            modifier = GlanceModifier
                .fillMaxWidth()
                .padding(vertical = 12.dp),
            horizontalAlignment = Alignment.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.Bottom
            ) {
                Text(
                    text = "${station.level}",
                    style = TextStyle(
                        fontWeight = FontWeight.Bold,
                        fontSize = 24.sp,
                        color = ColorProvider(Color.Black)
                    )
                )
                
                Text(
                    text = "cm",
                    style = TextStyle(
                        fontSize = 14.sp,
                        color = ColorProvider(Color.Black)
                    ),
                    modifier = GlanceModifier.padding(start = 4.dp, bottom = 4.dp)
                )
            }
            
            Text(
                text = "$trendIcon",
                style = TextStyle(
                    fontSize = 16.sp,
                    color = ColorProvider(trendColor)
                )
            )
        }
        
        Text(
            text = "Aktualizacja: ${station.updateTime}",
            style = TextStyle(
                fontSize = 12.sp,
                color = ColorProvider(Color.Gray)
            )
        )
    }
}

class StationWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = StationWidget()
}

// Plik: ios/MyHydroApp/StationWidgetExtension/StationWidget.swift
// (rozbudowany)
import WidgetKit
import SwiftUI

struct StationEntry: TimelineEntry {
    let date: Date
    let station: String
    let river: String
    let level: Int
    let trend: String
    let status: String
    let updateTime: String
    let opacity: Double
}

struct StationWidgetEntryView : View {
    var entry: StationEntry
    @Environment(\.colorScheme) var colorScheme
    
    var statusColor: Color {
        switch entry.status {
        case "alarm":
            return .red
        case "warning":
            return .orange
        default:
            return .green
        }
    }
    
    var trendIcon: String {
        switch entry.trend {
        case "up":
            return "arrow.up"
        case "down":
            return "arrow.down"
        default:
            return "arrow.right"
        }
    }
    
    var trendColor: Color {
        switch entry.trend {
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
                .opacity(entry.opacity)
            
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(entry.station)
                        .font(.headline)
                        .fontWeight(.bold)
                    
                    Spacer()
                    
                    Circle()
                        .fill(statusColor)
                        .frame(width: 10, height: 10)
                }
                
                Text(entry.river)
                    .font(.subheadline)
                    .foregroundColor(.gray)
                
                HStack {
                    HStack(alignment: .lastTextBaseline, spacing: 4) {
                        Text("\(entry.level)")
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
                
                Text("Aktualizacja: \(entry.updateTime)")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            .padding(16)
        }
    }
}

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

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> StationEntry {
        StationEntry(
            date: Date(),
            station: "Płock",
            river: "Wisła",
            level: 342,
            trend: "up",
            status: "alarm",
            updateTime: "14:30",
            opacity: 1.0
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (StationEntry) -> ()) {
        let entry = StationEntry(
            date: Date(),
            station: "Płock",
            river: "Wisła",
            level: 342,
            trend: "up",
            status: "alarm",
            updateTime: "14:30",
            opacity: 1.0
        )
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<StationEntry>) -> ()) {
        // W prawdziwej aplikacji dane byłyby pobierane z API lub Shared Containera
        let entry = StationEntry(
            date: Date(),
            station: "Płock",
            river: "Wisła",
            level: 342,
            trend: "up",
            status: "alarm",
            updateTime: "14:30",
            opacity: 1.0
        )
        
        // Odświeżaj widget co 15 minut
        let refreshDate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(refreshDate))
        completion(timeline)
    }
}
      case 'warning': return 'alert-circle';
      case 'info': return 'information-circle';
      default: return 'ellipse';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'alarm': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.text;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          Powiadomienia
        </Text>
        {station.alerts.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{station.alerts.length}</Text>
          </View>
        )}
      </View>
      
      {station.alerts.map(alert => (
        <View
          key={alert.id}
          style={[
            styles.alertItem,
            { borderBottomColor: theme.dark ? '#333' : '#EEE' }
          ]}
        >
          <Ionicons 
            name={getAlertIcon(alert.type)} 
            size={24} 
            color={getAlertColor(alert.type)} 
            style={styles.alertIcon}
          />
          <View style={styles.alertContent}>
            <Text style={[styles.alertMessage, { color: theme.colors.text }]}>
              {alert.message}
            </Text>
            <Text style={[styles.alertTime, { color: theme.dark ? '#AAA' : '#666' }]}>
              {alert.time}
            </Text>
          </View>
        </View>
      ))}
      
      {station.alerts.length > 0 && (
        <TouchableOpacity style={styles.showAllButton}>
          <Text style={[styles.showAllText, { color: theme.colors.primary }]}>
            Pokaż wszystkie powiadomienia
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  countBadge: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
  },
  alertItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  alertIcon: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
  },
  showAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    padding: 8,
  },
  showAllText: {
    fontSize: 14,
    marginRight: 4,
  },
});