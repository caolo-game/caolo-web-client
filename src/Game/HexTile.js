import { Graphics } from "pixi.js";
import { PixiComponent } from "@inlet/react-pixi";

const HexTile = PixiComponent("HexTile", {
    create: (props) => new Graphics(),
    applyProps: (instance, _, props) => {
        const { x, y, color, scale } = props;
        const hexagonRadius = Math.sqrt(3) * (scale || 1) + 0.55;
        const hexWidth = hexagonRadius * Math.sqrt(3);
        const hexHeight = hexagonRadius * 2;

        instance.cacheAsBitmap = true;
        instance.clear();
        instance.beginFill(color, 1.0);
        instance.drawPolygon(
            [
                [0, 0],
                [hexWidth / 2, hexHeight / 4],
                [hexWidth, 0],
                [hexWidth, -hexHeight / 2],
                [hexWidth / 2, (-hexHeight * 3) / 4],
                [0, -hexHeight / 2],
            ].flatMap(([q, r]) => [q, r])
        );
        instance.endFill();
        instance.x = x;
        instance.y = y;
    },
});

export default HexTile;
