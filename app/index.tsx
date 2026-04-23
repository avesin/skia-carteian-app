import { Octicons } from '@expo/vector-icons';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { evaluate } from 'mathjs';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CartesianGraph from './cartesian_graph';


const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const MAP_SIZE = 1000;

export default function Index() {
  const [textSatu, setTextSatu] = useState('Y');
  const [textDua, setTextDua] = useState('');
  const [path, setPath] = useState(Skia.Path.Make());
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const translateYSheet = useSharedValue(WINDOW_HEIGHT + 20);
  const keyboard = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const factor = 0.5;
  const progress = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });


  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      keyboard.value = e.endCoordinates.height - insets.bottom;
      if (translateYSheet.value < WINDOW_HEIGHT) {
        translateYSheet.value = withTiming((WINDOW_HEIGHT * factor) - e.endCoordinates.height);
      }
    });

    const hide = Keyboard.addListener('keyboardDidHide', () => {
      keyboard.value = 0;
      if (translateYSheet.value < WINDOW_HEIGHT) {
        translateYSheet.value = withTiming((WINDOW_HEIGHT * factor));
      }
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const openSheet = () => {
    translateYSheet.value = withTiming((WINDOW_HEIGHT * factor));
  };

  const closeSheet = () => {
    Keyboard.dismiss();
    translateYSheet.value = withTiming(WINDOW_HEIGHT + 20);
  };

  const animatedStyleSheet = useAnimatedStyle(() => ({
    transform: [{ translateY: translateYSheet.value }],
  }));

  const generatePoints = () => {
    const points: { x: number; y: number }[] = [];
    const R = 290;
    const r = 20;
    const d = 30;
    const x = (t: number) =>
      evaluate(
        `(R - r) * cos(t) + d * cos(((R - r) / r) * t)`,
        { R, r, d, t }
      );
    const y = (t: number) =>
      evaluate(
        `(R - r) * sin(t) - d * sin(((R - r) / r) * t)`,
        { R, r, d, t }
      );
    const maxT = Math.PI * 20;
    const step = 0.02;

    for (let t = 0; t < maxT; t += step) {
      points.push({
        x: x(t) + (MAP_SIZE / 2),
        y: y(t) + (MAP_SIZE / 2),
      });
    }
    return points;
  }

  const handleGenerate = useCallback(() => {
    closeSheet();
    setPath(Skia.Path.Make());

    progress.value = 0;
    requestAnimationFrame(() => {
      const pts = generatePoints();
      const newPath = createPath(pts);
      setPath(newPath);
      progress.value = withTiming(1, { duration: pts.length * 4 });
    })
  }, [MAP_SIZE]);

  const createPath = (points: { x: number; y: number }[] = []) => {
    const path = Skia.Path.Make();
    if (points.length === 0) return path;
    path.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      path.lineTo(points[i].x, points[i].y);
    }
    return path;
  };

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      if (value === 1) {
        console.log('Path generation completed');
        path.close();
      }
    }
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <GestureDetector gesture={composed}>
          <Animated.View style={[styles.viewport, animatedStyle]}>
            <CartesianGraph />
            <Canvas style={{ width: MAP_SIZE, height: MAP_SIZE }}>
              <Path
                path={path}
                color="#00fbff"
                style="stroke"
                strokeWidth={5}
                antiAlias
                start={0}
                end={progress}
              />
            </Canvas>
          </Animated.View>
        </GestureDetector>
        <TouchableOpacity style={styles.floatingButton} onPress={openSheet}>
          <Octicons name="diff-added" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.sheet, animatedStyleSheet]}>
        <View style={styles.handle} />
        <TouchableOpacity style={styles.closeButton} onPress={closeSheet}>
          <Octicons name="x" size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.row}>
          <TextInput
            returnKeyType="next"
            numberOfLines={1}
            style={styles.input}
            placeholder="Type something..."
            value={textSatu}
            onChangeText={setTextSatu}
          />
          <Text style={styles.label}>=</Text>
          <TextInput
            returnKeyType="done"
            numberOfLines={1}
            style={styles.input}
            placeholder="Type something..."
            value={textDua}
            onChangeText={setTextDua}
          />
        </View>
        <TouchableOpacity style={{ ...styles.button, marginTop: 64 }} onPress={handleGenerate}>
          <Text style={styles.text}>GENERATED</Text>
        </TouchableOpacity>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: '#121212',
    overflow: 'hidden', // Supaya canvas tidak bocor keluar layar
  },
  viewport: {
    width: MAP_SIZE,
    height: MAP_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    backgroundColor: '#00fbff', // Replace with your primary color
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    right: 30,
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sheet: {
    padding: 20,
    position: 'absolute',
    top: 0,
    height: WINDOW_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    marginBottom: 32,
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 3,
  },
  input: {
    color: 'black',
    width: '100%',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 24
  },
  row: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#121212',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  text: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: -20,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00fbff', // optional
  }
});
