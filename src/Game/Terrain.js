import React, { useState, useEffect, useRef } from "react";
import { Graphics } from "pixi.js";
import { useApp, Sprite } from "@inlet/react-pixi";
import { caoMath } from "../CaoWasm";
import { apiBaseUrl } from "../Config";
import axios from "axios";

function drawHex(instance, q, r, color) {
    const scale = 10;
    const hexagonRadius = Math.sqrt(3) * (scale || 1) + 0.55;
    const hexWidth = hexagonRadius * Math.sqrt(3);
    const hexHeight = hexagonRadius * 2;

    const scale2 = 10.3;
    const v = new caoMath.Vec2f(q, r);
    const { x, y } = caoMath.axialToPixelMatrixPointy().rightProd(v);
    const scaledX = x * Math.sqrt(3) * scale2;
    const scaledY = y * Math.sqrt(3) * scale2;

    instance.beginFill(color, 1.0);
    instance.drawPolygon(
        [
            [0, 0],
            [hexWidth / 2, hexHeight / 4],
            [hexWidth, 0],
            [hexWidth, -hexHeight / 2],
            [hexWidth / 2, (-hexHeight * 3) / 4],
            [0, -hexHeight / 2],
        ].flatMap(([q, r]) => [q + scaledX, r + scaledY])
    );
    instance.endFill();
}

const TERRAIN_COLOR = Object.freeze({
    plain: 0xd4ab6a,
    wall: 0xffddaa,
    bridge: 0xd4db6a,
});

function GenerateRoomTexture(renderer, terrain) {
    let instance = new Graphics();
    instance.clear();
    instance.cacheAsBitmap = true;
    terrain.filter(([_, ty]) => ty !== "empty").forEach(([pos, ty]) => drawHex(instance, pos.q, pos.r, TERRAIN_COLOR[ty]));
    drawHex(instance, 0, 0, 0x00ffff);
    return renderer.generateTexture(instance);
}

function usePrevious(value) {
    const valueRef = useRef(value);
    useEffect(() => {
        valueRef.current = value;
    }, [value]);
    return valueRef.current;
}

const RoomSprite = ({ room }) => {
    const app = useApp();

    const [texture, setTexture] = useState();
    const previousRoom = usePrevious(room);
    useEffect(() => {
        if (room !== previousRoom) {
            const fetchRoomData = async () => {
                const response = await axios.get(apiBaseUrl + "/world/terrain", { params: room });
                if (texture) texture.destroy();
                setTexture(GenerateRoomTexture(app.renderer, response.data));
            };
            fetchRoomData();
        }
    }, [room, app.renderer, texture, previousRoom]);

    return <>{texture && <Sprite texture={texture} x={0} y={0}></Sprite>}</>;
};
export default RoomSprite;
