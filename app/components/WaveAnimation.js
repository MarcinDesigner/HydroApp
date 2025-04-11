import { useEffect } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated"
import Svg, { Path } from "react-native-svg"

const { width } = Dimensions.get("window")

const WaveAnimation = ({ waveColor = "rgba(52, 152, 219, 0.7)", secondaryWaveColor = "rgba(41, 128, 185, 0.5)" }) => {
  const animation = useSharedValue(0)

  useEffect(() => {
    animation.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
      -1, // Infinite repetitions
      true, // Reverse
    )
  }, [])

  const firstWaveStyle = useAnimatedStyle(() => {
    const translateX = interpolate(animation.value, [0, 1], [0, -width])

    return {
      transform: [{ translateX }],
    }
  })

  const secondWaveStyle = useAnimatedStyle(() => {
    const translateX = interpolate(animation.value, [0, 1], [0, -width * 0.7])

    return {
      transform: [{ translateX }],
    }
  })

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Animated.View style={[styles.wave, firstWaveStyle]}>
          <Svg height="100%" width={width * 2} viewBox={`0 0 ${width * 2} 100`}>
            <Path
              d={`M0 50 
                 C ${width * 0.2} 20, ${width * 0.35} 0, ${width * 0.5} 20 
                 C ${width * 0.65} 40, ${width * 0.8} 50, ${width} 30
                 C ${width * 1.2} 10, ${width * 1.35} 30, ${width * 1.5} 40
                 C ${width * 1.65} 50, ${width * 1.8} 30, ${width * 2} 50
                 L ${width * 2} 100 L 0 100 Z`}
              fill={waveColor}
            />
          </Svg>
        </Animated.View>

        <Animated.View style={[styles.wave, secondWaveStyle]}>
          <Svg height="100%" width={width * 2} viewBox={`0 0 ${width * 2} 100`}>
            <Path
              d={`M0 60 
                 C ${width * 0.15} 80, ${width * 0.3} 90, ${width * 0.5} 70 
                 C ${width * 0.7} 50, ${width * 0.85} 60, ${width} 80
                 C ${width * 1.15} 100, ${width * 1.3} 80, ${width * 1.5} 70
                 C ${width * 1.7} 60, ${width * 1.85} 80, ${width * 2} 60
                 L ${width * 2} 100 L 0 100 Z`}
              fill={secondaryWaveColor}
            />
          </Svg>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    overflow: "hidden",
  },
  svgContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  wave: {
    position: "absolute",
    height: "100%",
    width: width * 2,
  },
})

export default WaveAnimation
