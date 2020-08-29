import { Graphics } from "pixi.js";
import { PixiComponent } from "@inlet/react-pixi";

const Structure = PixiComponent("Structure", {
    create: (props) => new Graphics(),
    applyProps: (instance, _, props) => {
        const { x, y, payload } = props;
        let fillColor = null;

        if (payload && payload.spawn) {
            fillColor = 0x00fff5;
        }

        if (fillColor === null) {
            console.error("structure not rendered");
            return;
        }

        instance.clear();
        instance.beginFill(fillColor);
        instance.drawCircle(0, 0, 4);
        instance.endFill();
        instance.x = x;
        instance.y = y;
    },
});

export default Structure;
