import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const SplashScreen = ({navigation}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Game'); // Navigate to the Game screen after 2 seconds
        }, 4000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Fruit Slice Fury</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 40,
        fontWeight: 'bold',
    },
});

export default SplashScreen;
