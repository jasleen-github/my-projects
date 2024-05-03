import Matter from 'matter-js'
import React from 'react'
import {Image, View} from 'react-native'
import Constants from "../utils/Constants";

const Ground = props => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y

    const xBody = props.body.position.x - widthBody / 2
    const yBody = props.body.position.y - heightBody / 2

    const color = props.color;

    return (
        <View style={{
            backgroundColor: color,
            position: 'absolute',
            left: xBody,
            top: yBody,
            width: widthBody,
            height: heightBody
        }}>
            <Image
                style={{
                    resizeMode: "cover",
                    height: 110,
                    width: Constants.SCREEN_WIDTH
                }}
                source={require('../assets/ground-3.png')}
            />
        </View>
    )
}

export default (world, color, pos, size, extraOptions) => {
    const initialGround = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        size.width,
        size.height,
        {
            label: extraOptions.label,
            isStatic: extraOptions.isStatic,
        }
    )

    Matter.World.add(world, initialGround)

    return {
        body: initialGround,
        color,
        pos,
        renderer: <Ground/>
    }
}