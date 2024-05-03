import Matter from "matter-js";
import React from "react";
import {Image} from "react-native";

// Image source for the bomb
const bombImage = require("../assets/bomb.png");

const Bomb = (props) => {
    const size = props.size;
    const xPos = props.body.position.x - size / 2;
    const yPos = props.body.position.y - size / 2;

    return (
        <Image
            source={bombImage}
            style={{
                position: "absolute",
                left: xPos,
                top: yPos,
                width: size,
                height: size,
                backgroundColor: props.color
            }}
        />
    );
};

export default (world, color, pos, size, extraOptions) => {
    const theBomb = Matter.Bodies.circle(
        pos.x,
        pos.y,
        size,
        {
            label: extraOptions.label,
            // frictionAir: 0,
            // angularVelocity: 0,
            // friction: 0,
            // frictionStatic: 0,
            isStatic: extraOptions.isStatic,
        }
    );
    Matter.World.add(world, theBomb);
    return {body: theBomb, color, pos, size, extraOptions, renderer: <Bomb/>};
};

