import { Graphics } from "pixi.js";
import { PixiComponent } from "@inlet/react-pixi";

const Bot = PixiComponent("Bot", {
    create: (props) => new Graphics(),
    applyProps: (instance, _, props) => {
        const { x, y, size, mouseOver } = props;

        const hexagonRadius = Math.sqrt(3) * size + 0.55;
        instance.clear();
        instance.beginFill(0xff3300);
        instance.drawCircle(0, 0, hexagonRadius / 2);
        instance.endFill();
        instance.x = x + hexagonRadius - 1;
        instance.y = y - hexagonRadius / 2;
        instance.interactive = true;
        instance.on("mouseover", mouseOver);
    },
});

export default Bot;
