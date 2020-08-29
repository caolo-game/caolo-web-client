import { Graphics } from "pixi.js";
import { PixiComponent } from "@inlet/react-pixi";

const Resource = PixiComponent("Resource", {
    create: (props) => new Graphics(),
    applyProps: (instance, _, props) => {
        const { x, y, mouseOver } = props;

        instance.clear();
        instance.beginFill(0x33ff33);
        instance.drawCircle(0, 0, 3);
        instance.endFill();
        instance.x = x;
        instance.y = y;
        instance.interactive = true;
        instance.on("mouseover", mouseOver);
    },
});

export default Resource;
