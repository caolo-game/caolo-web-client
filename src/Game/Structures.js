import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Graphics } from "pixi.js";
import { PixiComponent, useApp } from "@inlet/react-pixi";
import { caoMath } from "../CaoWasm";

const Structure = PixiComponent("Structure", {
    create: (props) => new Graphics(),
    applyProps: (instance, _, props) => {
        const { x, y, size, selected, mouseDown, mouseEnter, mouseLeave } = props;

        const hexagonRadius = Math.sqrt(3) * size + 0.55;
        instance.clear();
        if (selected) {
            instance.beginFill(0x00ff33);
            instance.drawCircle(x + hexagonRadius - 2, y + hexagonRadius, hexagonRadius + 5);
            instance.endFill();
        }
        instance.beginFill(0x00fff5);
        instance.drawCircle(x + hexagonRadius - 2, y + hexagonRadius, hexagonRadius);
        instance.endFill();
        instance.interactive = true;
        instance.on("mousedown", mouseDown);
        instance.on("mouseover", mouseEnter);
        instance.on("mouseout", mouseLeave);
    },
});

export default function Structures({ room }) {
    const dispatch = useDispatch();
    const selectedId = useSelector((state) => state.game.selectedId);
    const structures = useSelector((state) => state.game.roomObjects[JSON.stringify(state.game.selectedRoom)]?.payload?.structures ?? []);

    const app = useApp();
    const setCursor = useCallback(
        (cursorName) => {
            app.renderer.plugins.interaction.cursorStyles.default = cursorName;
            app.renderer.plugins.interaction.setCursorMode(cursorName);
        },
        [app]
    );

    return (
        <>
            {structures.map((bot) => {
                if (!caoMath) return false;
                const scale = 10.3;
                const v = new caoMath.Vec2f(bot.pos.roomPos[0], bot.pos.roomPos[1]);
                const { x, y } = caoMath.axialToPixelMatrixPointy().rightProd(v);
                const scaledX = x * Math.sqrt(3) * scale;
                const scaledY = y * Math.sqrt(3) * scale;
                return (
                    <Structure
                        key={bot.__id}
                        selected={bot.__id === selectedId}
                        size={10}
                        x={scaledX}
                        y={scaledY}
                        color={0x000000}
                        mouseDown={() => {
                            dispatch({ type: "GAME.SELECT", payload: bot.__id });
                        }}
                        mouseEnter={() => setCursor("pointer")}
                        mouseLeave={() => setCursor("auto")}
                    />
                );
            })}
        </>
    );
}
