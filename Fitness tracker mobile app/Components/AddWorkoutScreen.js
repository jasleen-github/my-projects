import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig.js";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

const AddWorkoutScreen = ({ navigation }) => {
  const [workoutType, setWorkoutType] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const captureMoment = async () => {
    const verifyPermissions = async () => {
      const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
      const libraryResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (
        cameraResult.status !== "granted" &&
        libraryResult.status !== "granted"
      ) {
        Alert.alert("Grant Permissions first to use the app", [{ text: "OK" }]);
        return false;
      } else {
        return true;
      }
    };

    const handleImagePress = async () => {
      const hasPermissions = await verifyPermissions();
      if (!hasPermissions) {
        console.log("We do not have permissions");
        return;
      }

      const image = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
      });

      if (!image.cancelled) {
        setCapturedImage(image.uri);
      }
    };

    handleImagePress();
  };

  const trackLocation = async () => {
    const hasLocationPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Location Permission Status:", status);
      if (status !== "granted") {
        Alert.alert("Location services are not enabled!");
        return false;
      }
      return true;
    };

    const getCurrentLocation = async () => {
      setIsFetching(true);

      const hasPermissions = await hasLocationPermissions(); // Call the function
      if (!hasPermissions) {
        setIsFetching(false);
        console.log("We do not have permissions");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setCurrentLocation(location);

      setIsFetching(false);
    };

    await getCurrentLocation(); // Call the function with await

    // The rest of your code...
  };

  const saveWorkoutDataWithFirebase = async () => {
    try {
      if (!workoutType || !workoutDuration) {
        Alert.alert("Please fill in all required fields");
        return;
      }

      const workoutData = {
        workoutType,
        workoutDuration,
        capturedImage, //  URL of the captured image
        location: currentLocation,
      };

      const userDocRef = doc(firestore, "users/", auth.currentUser.uid);

      // Get the existing user document
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const existingUserData = userDocSnap.data();
        const existingWorkouts = existingUserData.workouts || [];

        const updatedWorkouts = [...existingWorkouts, workoutData];

        // Update the 'workouts' array in the user document
        await updateDoc(userDocRef, {
          workouts: updatedWorkouts,
        });
      } else {
        await setDoc(userDocRef, {
          workouts: [workoutData],
        });
      }

      Alert.alert("Workout data saved successfully!");
    } catch (error) {
      console.error("Error saving workout data:", error.message);
      Alert.alert("Failed to save workout data. Please try again.");
    }
  };

  // ...
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../mobile-project-logo.png")}
      />
      <View style={styles.bodyContainer}>
        <Text style={styles.headerText}>ADD YOUR WORKOUT!</Text>
        <Text style={styles.text}>Workout Type</Text>
        <TextInput
          style={styles.textBox}
          placeholder="Workout Type"
          onChangeText={(value) => setWorkoutType(value)}
          value={workoutType}
        />
        <Text style={styles.text}>Workout Duration</Text>
        <TextInput
          style={styles.textBox}
          placeholder="Workout Duration"
          onChangeText={(value) => {
            const numericValue = value.replace(/[^0-9]/g, "");
            setWorkoutDuration(numericValue);
          }}
          value={workoutDuration}
          keyboardType="numeric"
        />

        <View style={styles.midContainer}>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={captureMoment}>
              <Image style={styles.icons} source={require("../camera.png")} />
            </TouchableOpacity>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={trackLocation}>
              <Image style={styles.icons} source={require("../map-pin.png")} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rowContainer}>
          {capturedImage && (
            <Image
              source={{ uri: capturedImage }}
              style={{ width: 100, height: 100 }}
            />
          )}
          {currentLocation && (
            <Text style={styles.text}>
              {`Latitude: ${currentLocation.coords.latitude}, Longitude: ${currentLocation.coords.longitude}`}
            </Text>
          )}
        </View>

        <View style={{ marginBottom: 80, marginLeft: 40 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={saveWorkoutDataWithFirebase}
          >
            <Text style={styles.buttonText}>SAVE MY WORKOUT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("HomePage")}
          >
            <Text style={styles.buttonText}>GO BACK TO HOMEPAGE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  iconContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginLeft: 20,
  },
  logo: {
    width: 149,
    height: 152,
    marginLeft: 30,
    marginTop: 36,
    marginBottom: 20,
  },

  icons: {
    width: 45,
    height: 45,
  },
  headerText: {
    color: "#fff",
    fontSize: 34,
    textAlign: "left",
    marginBottom: 5,
    alignSelf: "center",
    marginBottom: 20,
  },

  midContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 5,
    marginLeft: 75,
    marginRight: 50,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginLeft: 50,
    marginRight: 50,
  },
  text: {
    color: "#fff",
    textAlign: "left",
    fontSize: 17,
    marginBottom: 10,
    marginLeft: 50,
  },

  midText: {
    fontSize: 10,
    color: "#fff",
    margin: 15,
  },

  textBox: {
    backgroundColor: "#fff",
    color: "#818A91",
    textAlign: "left",
    width: 300,
    marginBottom: 10,
    padding: 10, // Increased padding for better appearance
    alignSelf: "center", // Center the text input horizontally
  },

  button: {
    backgroundColor: "#EE8100",
    padding: 10, // Increased padding for better appearance
    alignItems: "center",
    borderRadius: 5,
    margin: 10,
    width: 300,
    alignSelf: "center",
    // Center the button horizontally
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
  },
});
export default AddWorkoutScreen;
