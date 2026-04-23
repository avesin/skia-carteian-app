import { Canvas, Line, Text, useFont } from "@shopify/react-native-skia";
import React from "react";
import { View } from "react-native";


const CHART_HEIGHT = 1000 - 40;
const CHART_WIDTH = 1000 - 40;
const PADDING = 40;

const DATA = [
    { x: 0, y: 0 }, { x: 2, y: 5 }, { x: 4, y: 2 },
    { x: 6, y: 8 }, { x: 8, y: 4 }, { x: 10, y: 10 }
];

const X_MAX = 15;
const Y_MAX = 15;

export default function CartesianGraph() {
    const font = useFont(require("../assets/fonts/Inter.ttf"));

    if (!font) return null;

    const getX = (v: number) => PADDING + (v / X_MAX) * (CHART_WIDTH - PADDING * 2);
    const getY = (v: number) => CHART_HEIGHT - PADDING - (v / Y_MAX) * (CHART_HEIGHT - PADDING * 2);

    
    return (
        <View style={{ flex: 1, inset: 0, position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
            <Canvas style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((val) => (
                    <React.Fragment key={val}>
                        <Text x={getX(val) - 5} y={CHART_HEIGHT - 15} text={`${val}`} font={font} color="gray" />
                        <Text x={5} y={getY(val) + 5} text={`${val}`} font={font} color="gray" />
                        <Line p1={{ x: getX(val), y: PADDING }} p2={{ x: getX(val), y: CHART_HEIGHT - PADDING }} color="#eee" strokeWidth={1} />
                        <Line p1={{ x: PADDING, y: getY(val) }} p2={{ x: CHART_WIDTH - PADDING, y: getY(val) }} color="#eee" strokeWidth={1} />
                    </React.Fragment>
                ))}
            </Canvas>
        </View>
    );
}        