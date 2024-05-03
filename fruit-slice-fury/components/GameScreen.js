import React, {useMemo, useState} from "react";
import {SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Physics from "../systems/Physics";
import {GameEngine} from "react-native-game-engine";
import entities from "../entities";
import {Audio} from 'expo-av';
import IconButton from "./IconButton";
import {MaterialCommunityIcons} from "@expo/vector-icons";


const GameScreen = () => {
    const [gameEngine, setGameEngine] = useState(null);
    const [running, setRunning] = useState(false);
    const [score, setScore] = useState(0);
    const [welcome, setWelcome] = useState(true);
    const [isMute, setIsMute] = useState(false);
    const [mode, setMode] = useState(0); // Welcome = 0, GameOver = -1, Restart Requested = 1

    const PlayAudio = useMemo(() => async function playSwipeSound() {
        const {sound} = await Audio.Sound.createAsync(require('../assets/sword.mp3'));
        await sound.playAsync();
    }, [isMute]);


    if (welcome) {
        return (<SafeAreaView style={styles.welcome}>
            <Text style={{fontSize: 20}}>
                Welcome to Fruit Slice Fury!
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    setWelcome(false);
                    setRunning(true);
                }}
            >
                <Text style={styles.buttonText}>Start Game</Text>
            </TouchableOpacity>
            <Text style={styles.txtDevelop}>
                Developed By
            </Text>
            <Text style={styles.txtNames}>
                Jay Patel, Jasleen Kaur, Harpreet Kaur
            </Text>
        </SafeAreaView>);
    } else {
        return (<SafeAreaView style={styles.container}>
            {running && (<>
                {/*<ImageBackground*/}
                {/*    source={require("../assets/background.jpeg")}*/}
                {/*    resizeMode="cover"*/}
                {/*    style={styles.imageWrapper}*/}
                {/*/>*/}
                <GameEngine
                    ref={(ref) => {
                        setGameEngine(ref);
                    }}
                    systems={[Physics]}
                    entities={entities()}
                    running={running}
                    style={styles.gameContainer}
                    onEvent={(e) => {
                        if (e.type === 'gameOver') {
                            setRunning(false);
                            gameEngine.stop();
                            setMode(-1)

                        }
                        if (e.type === 'updateScore') {
                            setScore(score + 1);
                            setMode(0)
                            if (!isMute)
                                PlayAudio();
                        }
                    }}
                >
                    <StatusBar style="auto" hidden={true}/>
                </GameEngine>
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                        position: 'absolute',
                        left: 30,
                        top: 30,
                        backgroundColor: 'orange',
                        padding: 8,
                    }}>
                    {score}
                </Text>
                <View style={{
                    textAlign: 'center', fontSize: 20, fontWeight: 'bold', position: 'absolute', right: 10, top: 30, // backgroundColor: 'orange',
                    padding: 10
                }}>

                    <IconButton icon={isMute ? <MaterialCommunityIcons name="volume-mute" size={32} color="black"/> :
                        <MaterialCommunityIcons name="volume-high" size={32} color="black"/>} styles={styles.btnMute}
                                onPress={() => {
                                    setIsMute((old) => !old)
                                }}/>
                    <IconButton icon={<MaterialCommunityIcons name="restart" size={32} color="black"/>}
                                styles={styles.btnRestart} onPress={() => {
                        setRunning(false);
                        setMode(1);
                    }}/>
                </View>
            </>)}

            {!running && (<View style={styles.gameOver}>
                <Text style={{fontSize: 30, marginBottom: 10, color: "red"}}>
                    {mode == 1 ? "" : (mode == -1 ? "Game Over" : "")}
                </Text>
                <Text style={{fontSize: 20}}>Your Score : {score} </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setRunning(true);
                        setScore(0);
                    }}
                >
                    <Text style={styles.buttonText}>{mode == -1 ? "Play Again" : "Restart"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setRunning(false);
                        setScore(0);
                        setMode(0);
                        setWelcome(true);
                    }}
                >
                    <Text style={styles.buttonText}>Exit</Text>
                </TouchableOpacity>
            </View>)}
        </SafeAreaView>);
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    }, imageWrapper: {
        flex: 1, position: "absolute", top: 0, left: 0, bottom: 0, right: 0,
    }, gameContainer: {
        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
    }, welcome: {
        flex: 1, alignItems: "center", justifyContent: "center",
    }, buttonText: {
        fontSize: 20, fontWeight: "bold",
    }, button: {
        backgroundColor: "#f0f0f0",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#000",
        marginTop: 20,
    }, gameOver: {
        flex: 1, alignItems: "center", justifyContent: "center",
    }, btn: {
        backgroundColor: "black", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10,
        marginTop: 20, width: 200, marginBottom: 150,
    }, btnText: {
        fontSize: 20, fontWeight: "bold", textAlign: "center", color: "white",
    }, btnRestart: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        position: 'absolute',
        right: 20,
        top: 0,
        backgroundColor: 'orange',
        padding: 3
    }, btnMute: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        position: 'absolute',
        right: 20,
        top: 55,
        backgroundColor: 'orange',
        padding: 3
    }, txtDevelop: {fontSize: 14, fontStyle: "italic", textAlign: "center", position: "absolute", bottom: 50},
    txtNames: {fontSize: 14, textAlign: "center", position: "absolute", bottom: 30},

});

export default GameScreen;
