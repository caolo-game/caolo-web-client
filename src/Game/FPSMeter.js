import React from "react";
import { Ticker } from "pixi.js";
import { Text } from "@inlet/react-pixi";

export default function FPSMeter(props) {
    return <Text text={parseInt(Ticker.shared.FPS)}></Text>;
}
