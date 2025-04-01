package com.myhydro.widget

import android.content.Context
import android.content.Intent
import android.text.format.DateFormat
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.LocalContext
import androidx.glance.action.ActionParameters
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.action.ActionCallback
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.appwidget.appWidgetBackground
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.appwidget.state.updateAppWidgetState
import androidx.glance.background
import androidx.glance.currentState
import androidx.glance.layout.*
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.json.JSONObject
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class StationWidget : GlanceAppWidget() {

    private val scope = MainScope()

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        // Przywracamy stan widgetu z SharedPreferences
        val stationData = getStationData(context)
        
        // Dostarczamy zawartość widgetu
        provideContent {
            StationWidgetContent(stationData, actionRunCallback<RefreshWidgetCallback>())
        }
    }

    // Metoda do pobierania danych stacji z SharedPreferences
    private fun getStationData(context: Context): StationData {
        val sharedPrefs = context.getSharedPreferences("hydroapp_widget_data", Context.MODE_PRIVATE)
        val stationJson = sharedPrefs.getString("favorite_station", null)
        
        return if (stationJson != null) {
            try {
                Json.decodeFromString(stationJson)
            } catch (e: Exception) {
                // W przypadku błędu zwracamy domyślne dane
                StationData(
                    name = "Wybierz stację",
                    level = 0,
                    trend = "stable",
                    status = "normal",
                    river = "---",
                    updateTime = getCurrentTime()
                )
            }
        } else {
            // Domyślne dane, gdy nie ma zapisanych danych
            StationData(
                name = "Wybierz stację",
                level = 0,
                trend = "stable",
                status = "normal",
                river = "---",
                updateTime = getCurrentTime()
            )
        }
    }

    private fun getCurrentTime(): String {
        val sdf = SimpleDateFormat("HH:mm", Locale.getDefault())
        return sdf.format(Date())
    }
}

// Klasa danych reprezentująca informacje o stacji
@Serializable
data class StationData(
    val name: String,
    val level: Int,
    val trend: String,  // "up", "down", "stable"
    val status: String, // "alarm", "warning", "normal"
    val river: String,
    val updateTime: String
)

// Komponent Composable do wyświetlania widgetu stacji
@Composable
fun StationWidgetContent(station: StationData, onRefreshClick: () -> Unit) {
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
            .appWidgetBackground()
            .cornerRadius(16.dp)
            .padding(16.dp)
            .clickable(onRefreshClick)
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
                text = trendIcon,
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

// Callback do odświeżania widgetu
class RefreshWidgetCallback : ActionCallback {
    override suspend fun onAction(
        context: Context,
        glanceId: GlanceId,
        parameters: ActionParameters
    ) {
        // Wywołaj aplikację, aby odświeżyć dane
        val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
        launchIntent?.let {
            it.putExtra("refresh_widget", true)
            context.startActivity(it)
        }
    }
}

// Receiver dla widgetu
class StationWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = StationWidget()
}

// Funkcja do aktualizacji widgetu - wywołaj ją z kodu JavaScript w React Native
fun updateWidgetData(context: Context, stationData: StationData) {
    val sharedPrefs = context.getSharedPreferences("hydroapp_widget_data", Context.MODE_PRIVATE)
    val editor = sharedPrefs.edit()
    
    val stationJson = Json.encodeToString(stationData)
    editor.putString("favorite_station", stationJson)
    editor.apply()
}