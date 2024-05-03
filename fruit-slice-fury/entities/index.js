import Matter from "matter-js";
import Knife from "../components/Knife";
import Ground from "../components/Ground";
import Constants from "../utils/Constants";
import Fruit from "../components/Fruit";
import Boundary from "../components/Boundary";
import Bomb from "../components/Bomb";

export default (gameWorld) => {
    let engine = Matter.Engine.create({enableSleeping: false});
    let world = engine.world;
    engine.gravity.y = 0.125;

    return {
        physics: {engine, world},
        Knife: Knife(
            world,
            "transparent",
            {x: Constants.SCREEN_WIDTH / 2, y: Constants.SCREEN_HEIGHT / 2},
            {width: 70, height: 70},
            {isStatic: true, label: "Knife"}
        ),
        Fruit: Fruit(
            world,
            "transparent",
            {x: 120, y: 120},
            {width: 70, height: 70},
            {isStatic: false, label: "Fruit", image: require("../assets/fruit-10.png")}
        ),
        Bomb: Bomb(world, "transparent", {
                x: Math.floor(Math.random() * (Constants.SCREEN_WIDTH - 0 + 1)),
                y: 20
            }, 70,
            {isStatic: false, label: "Bomb"}
        ),
        RightBoundary: Boundary(
            world,
            "brown",
            {x: Constants.SCREEN_WIDTH, y: Constants.SCREEN_HEIGHT / 2},
            {height: Constants.SCREEN_HEIGHT, width: 20}, {
                isStatic: true,
                label: "RightBoundary",
            }
        ),

        BottomBoundary: Boundary(
            world,
            "brown",
            {x: Constants.SCREEN_WIDTH / 2, y: Constants.SCREEN_HEIGHT},
            {height: 20, width: Constants.SCREEN_WIDTH}, {
                isStatic: true,
                label: "BottomBoundary",
            }
        ),
        LeftBoundary: Boundary(
            world,
            "brown",
            {x: 0, y: Constants.SCREEN_HEIGHT / 2},
            {height: Constants.SCREEN_HEIGHT, width: 20}, {
                isStatic: true,
                label: "LeftBoundary",
            }
        ),
        Ground: Ground(world, 'transparent', {x: Constants.SCREEN_WIDTH / 2, y: Constants.SCREEN_HEIGHT}, {
                height: 0.25 * Constants.SCREEN_HEIGHT,
                width: Constants.SCREEN_WIDTH
            },
            {isStatic: true, label: "Ground"}
        ),
        // TopBoundary: Boundary(
        //     world,
        //     "brown",
        //     {x: Constants.SCREEN_WIDTH / 2, y: 0},
        //     {height: 55, width: Constants.SCREEN_WIDTH}, {
        //         isStatic: true,
        //         label: "TopBoundary",
        //     }
        // ),
    };
};
