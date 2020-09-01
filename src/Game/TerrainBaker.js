import { caoMath } from "../CaoWasm";

const TERRAIN_COLOR = Object.freeze({
    plain: "#d4ab6a",
    wall: "#ffddaa",
    bridge: "#d4db6a",
});
function drawHexagon(tile) {
    const scale = 4.6;
    const hexagonRadius = Math.sqrt(3) * scale + 0.55;
    const hexWidth = hexagonRadius * Math.sqrt(3);
    const hexHeight = hexagonRadius * 2;

    let instance = document.createElementNS(svgNS, "polyline");
    instance.setAttribute("fill", TERRAIN_COLOR[tile.ty]);

    const points = [
        [0, 0],
        [hexWidth / 2, hexHeight / 4],
        [hexWidth, 0],
        [hexWidth, -hexHeight / 2],
        [hexWidth / 2, (-hexHeight * 3) / 4],
        [0, -hexHeight / 2],
    ];

    //instance.setAttribute("points", " 87,0 174,50 174,150 87,200 0,150 0,50 87,0");
    const v = new caoMath.Vec2f(tile.position.roomPos.q, tile.position.roomPos.r);
    const { x, y } = caoMath.axialToPixelMatrixPointy().rightProd(v);
    const scaledX = x * Math.sqrt(3) * scale - 100;
    const scaledY = y * Math.sqrt(3) * scale;
    instance.setAttribute(
        "points",
        points.reduce((acc, curr) => acc + ` ${curr[0] + scaledX},${curr[1] + scaledY}`, "")
    );

    return instance;
}

const svgNS = "http://www.w3.org/2000/svg";
function createSVG(roomData) {
    let svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", 700);
    svg.setAttribute("height", 700);

    roomData.forEach((tile) => {
        svg.appendChild(drawHexagon(tile));
    });
    return new XMLSerializer().serializeToString(svg);
}

async function bakeRoom(roomKey, roomData) {
    if (sessionStorage.getItem(roomKey) === null) {
        const svg = createSVG(roomData);
        console.log(svg);
        const blob = new Blob([svg], { type: "image/svg+xml" });
        console.log(blob);
        //const blob = await fetch(svg).then((r) => r.blob());
        const objectURL = URL.createObjectURL(blob);
        sessionStorage.setItem(roomKey, objectURL);
    }
}

export default bakeRoom;
