import React, { useState, useEffect } from "react";
import { Graphics } from "pixi.js";
import { useApp, Sprite } from "@inlet/react-pixi";
import { caoMath } from "../CaoWasm";
import { apiBaseUrl } from "../Config";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

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

const RoomSprite = ({ room }) => {
    const app = useApp();

    const [texture, setTexture] = useState(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const terrain = useSelector((state) => state?.game?.terrain);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const response = await axios.get(apiBaseUrl + "/world/terrain", { params: room });
            const data = response.data;
            dispatch({
                type: "GAME.SET_ROOM_TERRAIN",
                payload: data,
            });
            setLoading(false);
        })();
    }, [room, dispatch, setLoading]);

    useEffect(() => {
        if (room !== texture?.room && terrain && !loading) {
            if (texture?.texture) texture.texture.destroy();
            setTexture({
                room,
                texture: GenerateRoomTexture(app.renderer, terrain),
            });
        }
    }, [loading, terrain, room, texture, setTexture, app.renderer]);

    return <>{!loading && texture?.texture && <Sprite texture={texture.texture} x={0} y={0}></Sprite>}</>;
};
export default RoomSprite;
