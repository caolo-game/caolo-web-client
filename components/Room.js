import React, { useMemo } from "react";
import HexTile from "./HexTile";
import { Bot, Structure, Resource } from "./Entities";
import ForEachHex from "./ForEachHex";

const SQRT_3 = Math.sqrt(3);
function maxpos(layout) {
    let [maxQ, maxR] = layout[0];
    for (let [q, r] of layout.slice(1)) {
        if (q > maxQ) maxQ = q;
        if (r > maxR) maxR = r;
    }
    return [maxQ, maxR];
}

export default function Room({
    roomLayout,
    terrain,
    entities: { bots, structures, resources },
}) {
    const scale = 15;
    const [maxQ, maxR] = useMemo(() => maxpos(roomLayout));
    // notice that bounds were flipped, because the tiles are "pointy top", the room will be a "flat top" hexagon
    const [bR, bQ] = [maxQ * SQRT_3 * scale, maxR * scale * 4];

    return (
        <>
            <div
                style={{
                    width: "80vw",
                    height: "80vh",
                }}
            >
                <svg viewBox={`200 0 ${bQ - 400} ${bR}`}>
                    <ForEachHex pos={roomLayout} data={terrain} scale={scale}>
                        <HexTile />
                    </ForEachHex>
                    {!structures ? null : (
                        <ForEachHex
                            pos={structures.map(({ pos }) => [
                                pos.pos.q,
                                pos.pos.r,
                            ])}
                            scale={scale}
                            data={structures}
                        >
                            <Structure />
                        </ForEachHex>
                    )}
                    {!bots ? null : (
                        <ForEachHex
                            pos={bots.map(({ pos }) => [pos.pos.q, pos.pos.r])}
                            scale={scale}
                            data={bots}
                        >
                            <Bot />
                        </ForEachHex>
                    )}
                    {!resources ? null : (
                        <ForEachHex
                            pos={resources.map(({ pos }) => [
                                pos.pos.q,
                                pos.pos.r,
                            ])}
                            scale={scale}
                            data={resources}
                        >
                            <Resource />
                        </ForEachHex>
                    )}
                </svg>
            </div>
        </>
    );
}
