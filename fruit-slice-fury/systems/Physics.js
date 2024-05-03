import Matter, {Sleeping} from "matter-js";
import Constants from "../utils/Constants";
import {RandomImageSource} from "../components/GetRandomImageSrc";


const getRandomImage = () => {
    return RandomImageSource();
}

const Physics = (entities, {touches, dispatch, events, time}) => {
    let engine = entities.physics.engine;
    let x = entities.Knife.body.position.x;
    let y = entities.Knife.body.position.y;

    touches.filter((t) => t.type === "move").forEach((t) => {
        x += t.delta.pageX;
        y += t.delta.pageY;
        Matter.Body.setPosition(entities.Knife.body, {
            x: x,
            y: y,
        });
    });

    Sleeping.set(entities.Knife.body, false);
    Matter.Events.on(engine, "collisionStart", (event) => {
        const pairs = event.pairs;
        const objA = pairs[0].bodyA;
        const objB = pairs[0].bodyB;
        const objALabel = pairs[0].bodyA.label;
        const objBLabel = pairs[0].bodyB.label;
        // console.log("objALabel = ", objALabel, " && objBLabel = ", objBLabel)

        // Update Score and Fruit Relocate
        if ((objALabel === "Knife" && objBLabel === "Fruit") || (objALabel === "Fruit" && objBLabel === "Knife")) {
            if (!objA.isSleeping) {
                dispatch({type: "updateScore"});
            }
            entities.Fruit.extraOptions.image = getRandomImage();
            let obj = objALabel === "Fruit" ? objA : objB;
            Matter.Body.setPosition(obj, {
                x: Math.floor(Math.random() * (Constants.SCREEN_WIDTH - 0 + 1)),
                y: 80
            });

            Sleeping.set(entities.Knife.body, true);
        }

        // Game Over
        if ((objALabel === "Fruit" && objBLabel === "Ground") || (objBLabel === "Fruit" && objALabel === "Ground")) {
            dispatch({type: "gameOver"});
        }

        // Bomb Collision with Knife
        if ((objALabel === "Knife" && objBLabel === "Bomb") || (objALabel === "Bomb" && objBLabel === "Knife")) {
            entities.Bomb.extraOptions.image = require("../assets/boom.png");
            dispatch({type: "gameOver"});
        }

        if ((objALabel === "Ground" && objBLabel === "Bomb") || (objALabel === "Bomb" && objBLabel === "Ground")) {
            let obj = objALabel === "Bomb" ? objA : objB;
            Matter.Body.setPosition(obj, {
                x: Math.floor(Math.random() * (Constants.SCREEN_WIDTH - 0 + 1)),
                y: 80
            });
        }

    });

    Matter.Engine.update(engine, time.delta);

    return entities;
};

export default Physics;
