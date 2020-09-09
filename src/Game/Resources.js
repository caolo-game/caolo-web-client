import React, { useState, useEffect, useCallback } from "react";
import { Graphics } from "pixi.js";
import { PixiComponent, useApp } from "@inlet/react-pixi";
import { caoMath } from "../CaoWasm";
import { apiBaseUrl } from "../Config";
import axios from "axios";

const Resource = PixiComponent("Resource", {
    create: (props) => new Graphics(),
    applyProps: (instance, _, props) => {
        const { x, y, size, selected, mouseDown, mouseEnter, mouseLeave } = props;

        const hexagonRadius = Math.sqrt(3) * size + 0.55;
        instance.clear();
        if (selected) {
            instance.beginFill(0x00ff33);
            instance.drawCircle(x + hexagonRadius - 2, y + hexagonRadius, hexagonRadius / 1.5 + 5);
            instance.endFill();
        }
        instance.beginFill(0xf3ff03);
        instance.drawCircle(x + hexagonRadius - 2, y + hexagonRadius, hexagonRadius / 1.5);
        instance.endFill();
        instance.interactive = true;
        instance.on("mousedown", mouseDown);
        instance.on("mouseover", mouseEnter);
        instance.on("mouseout", mouseLeave);
    },
});

export default function Resources({ room, setSelectedBot }) {
    const [bots, setBotData] = useState([]);
    const app = useApp();
    const setCursor = useCallback(
        (cursorName) => {
            app.renderer.plugins.interaction.cursorStyles.default = cursorName;
            app.renderer.plugins.interaction.setCursorMode(cursorName);
        },
        [app]
    );

    const fetchBotData = useCallback(async () => {
        const response = await axios.get(apiBaseUrl + "/room-objects", { params: room });
        setBotData(response.data.resources);
    }, [room]);

    useEffect(() => {
        setBotData([]);
        fetchBotData();
        const interval = setInterval(() => {
            fetchBotData();
        }, 2000);
        return () => clearInterval(interval);
    }, [fetchBotData]);

    const [selectedId, setSelectedId] = useState();

    return (
        <>
            {bots.map((bot) => {
                const scale = 10.3;
                const v = new caoMath.Vec2f(bot.position.roomPos.q, bot.position.roomPos.r);
                const { x, y } = caoMath.axialToPixelMatrixPointy().rightProd(v);
                const scaledX = x * Math.sqrt(3) * scale;
                const scaledY = y * Math.sqrt(3) * scale;
                return (
                    <Resource
                        key={bot.id}
                        selected={bot.id === selectedId}
                        size={10}
                        x={scaledX}
                        y={scaledY}
                        color={0x000000}
                        mouseDown={() => {
                            setSelectedId(bot.id);
                            setSelectedBot(bot);
                        }}
                        mouseEnter={() => setCursor("pointer")}
                        mouseLeave={() => setCursor("auto")}
                    />
                );
            })}
        </>
    );
}
