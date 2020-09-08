import React, { useState, useEffect, useCallback } from "react";
import { Graphics } from "pixi.js";
import { PixiComponent } from "@inlet/react-pixi";
import { caoMath } from "../CaoWasm";
import { apiBaseUrl } from "../Config";
import axios from "axios";

const Bot = PixiComponent("Bot", {
    create: (props) => new Graphics(),
    applyProps: (instance, _, props) => {
        const { x, y, size, mouseOver } = props;

        const hexagonRadius = Math.sqrt(3) * size + 0.55;
        instance.clear();
        instance.beginFill(0xff3300);
        instance.drawCircle(x + hexagonRadius - 2, y + hexagonRadius, hexagonRadius / 1.5);
        instance.endFill();
        instance.interactive = true;
        instance.on("mouseover", mouseOver);
    },
});

function Bots({ room }) {
    const [bots, setBotData] = useState([]);

    const fetchBotData = useCallback(async () => {
        const response = await axios.get(apiBaseUrl + "/bots", { params: room });
        setBotData(response.data);
    }, [room]);

    useEffect(() => {
        setBotData([]);
        fetchBotData();
        const interval = setInterval(() => {
            fetchBotData();
        }, 2000);
        return () => clearInterval(interval);
    }, [fetchBotData]);

    return (
        <>
            {bots.map((bot) => {
                const scale = 10.3;
                const v = new caoMath.Vec2f(bot.position.roomPos.q, bot.position.roomPos.r);
                const { x, y } = caoMath.axialToPixelMatrixPointy().rightProd(v);
                const scaledX = x * Math.sqrt(3) * scale;
                const scaledY = y * Math.sqrt(3) * scale;
                return <Bot key={bot.id} size={10} x={scaledX} y={scaledY} color={0x000000} mouseOver={() => console.log(bot)} />;
            })}
        </>
    );
}

export default Bots;
