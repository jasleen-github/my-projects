import {Image, View} from "react-native";
import Matter from "matter-js";


const Fruit = (props) => {
    const width = props.size.width;
    const height = props.size.height;
    const xPos = props.body.position.x - width / 2;
    const yPos = props.body.position.y - height / 2;

    return (
        <View
            style={{
                width: width,
                height: height,
                left: xPos,
                top: yPos,
                backgroundColor: props.color,
                position: "absolute",
            }}
        >
            <Image source={props.extraOptions.image}
                   style={{
                       width: props.size.width,
                       height: props.size.height,
                       resizeMode: 'contain'
                   }}/>
        </View>
    );
};

export default (world, color, pos, size, extraOptions) => {
    const theFruit = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        size.width,
        size.height,
        {
            label: extraOptions.label,
            isStatic: extraOptions.isStatic,
            // frictionAir: 0,
            // angularVelocity: 0,
            // restitution: 1,
            // mass: 1,
            // friction: 0,
            // frictionStatic: 0,
        }
    );
    Matter.World.add(world, theFruit);
    return {body: theFruit, color, pos, size, extraOptions, renderer: <Fruit/>};
};
