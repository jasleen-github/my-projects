import {Image, View} from "react-native";
import Matter from "matter-js";

const Box = (props) => {
    const width = props.size.width;
    const height = props.size.height;

    const xPos = props.body.position.x - width / 2;
    const yPos = props.body.position.y - height / 2;

    let angle = props.body.angle + "deg";

    return (
        <View
            style={{
                width: width,
                height: height,
                left: xPos,
                top: yPos,
                backgroundColor: props.color,
                //transform: [{ rotate: angle }],
                position: "absolute",
            }}
        >
            <Image source={require("../assets/knife.png")}
                   style={{
                       width: props.size.width,
                       height: props.size.height,
                       resizeMode: 'contain'
                       // left: xPos,
                       // top: yPos,
                       // backgroundColor: props.color,
                       // transform: [{ rotate: angle }],
                       // position: "absolute",
                   }}/>

        </View>
    );
};

export default (world, color, pos, size, extraOptions) => {
    const theBox = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        size.width,
        size.height,
        {
            label: extraOptions.label,
            isStatic: extraOptions.isStatic
        }
    );
    Matter.World.add(world, theBox);
    return {body: theBox, color, pos, size, extraOptions, renderer: <Box/>};
};
