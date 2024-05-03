import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";
import axios from "axios";
import Modal from "react-native-modal";

const HomePage = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const fetchWorkoutData = async () => {
    try {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setWorkouts(userData.workouts || []);

        const totalCaloriesBurned = userData.workouts.reduce(
          (total, workout) => {
            const caloriesBurnedPerMinute = 5;
            const workoutDuration = workout.workoutDuration || 0;
            const caloriesBurned = caloriesBurnedPerMinute * workoutDuration;
            return total + caloriesBurned;
          },
          0
        );

        const totalWorkouts = userData.workouts.length;

        setCaloriesBurned(totalCaloriesBurned);
        setTotalWorkouts(totalWorkouts);
      } else {
        console.log("User document does not exist");
      }
    } catch (error) {
      console.error("Error fetching workout data:", error.message);
    }
  };

  const deleteWorkout = async (index) => {
    try {
      const updatedWorkouts = [...workouts];

      updatedWorkouts.splice(index, 1);

      setWorkouts(updatedWorkouts);

      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      await setDoc(userDocRef, { workouts: updatedWorkouts }, { merge: true });

      fetchWorkoutData();
    } catch (error) {
      console.error("Error deleting workout:", error.message);
    }
  };

  const fetchMotivationalQuote = async () => {
    try {
      const response = await axios.get("https://api.quotable.io/random");
      setMotivationalQuote(response.data.content);
      setModalContent(response.data.content);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching motivational quote:", error.message);
    }
  };

  // Fetch workout data again when the 'workouts' state changes
  useEffect(() => {
    fetchWorkoutData();
  }, [workouts]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../mobile-project-logo.png")}
      />
      <Text style={styles.welcomeText}>Hey! {username}</Text>

      <Text style={styles.text}>Your recent workouts</Text>
      <View style={styles.contentContainer}>
        {workouts.length > 0 ? (
          workouts.map((workout, index) => (
            <View
              style={{
                backgroundColor: "#A49D9D",
                marginBottom: 10,
                padding: 10,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              key={index}
            >
              <View>
                <Text>
                  {index + 1}. Workout Type: {workout.workoutType}
                </Text>
                <Text> Duration: {workout.workoutDuration}</Text>

                {workout.capturedImage !== null && (
                  <View>
                    <Image
                      source={{ uri: workout.capturedImage }}
                      style={{
                        width: 50,
                        height: 50,
                        alignSelf: "flex-start",
                        marginLeft: 10,
                      }}
                    />
                  </View>
                )}

                {workout.location !== null && (
                  <View>
                    <Text>{`Latitude: ${workout.location.coords.latitude}, Longitude: ${workout.location.coords.longitude}`}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity onPress={() => deleteWorkout(index)}>
                <Text style={{ fontSize: 15, color: "#000" }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View>
            <Text>You have no saved workouts</Text>
          </View>
        )}
      </View>

      <Text style={styles.text}>Your statistics</Text>
      <View style={styles.statisticsContainer}>
        <Text>Calories Burned: {caloriesBurned}</Text>
        <Text>Total Workouts: {totalWorkouts}</Text>
      </View>

      <View style={styles.iconContainer}>
        <Image style={styles.bottomIcons} source={require("../dumbbell.png")} />
        <Text
          style={styles.bottomText}
          onPress={() => navigation.navigate("WorkoutScreen")}
        >
          ADD NEW WORKOUT HERE
        </Text>
      </View>

      <View style={styles.iconContainer}>
        <Image style={styles.bottomIcons} source={require("../smile.png")} />
        <TouchableOpacity
          style={styles.bottomText}
          onPress={fetchMotivationalQuote}
        >
          <Text style={styles.bottomText}>GET MOTIVATIONAL ALERTS</Text>
        </TouchableOpacity>
      </View>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text>{modalContent}</Text>
          <TouchableOpacity onPress={() => setIsModalVisible(false)}>
            <Text style={{ fontStyle: "italic", marginTop: 15 }}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#000",
  },
  contentContainer: {
    backgroundColor: "#D9D9D9",
    padding: 10,
    marginBottom: 20,
    width: 350,

    alignSelf: "center",
    borderRadius: 10,
  },
  statisticsContainer: {
    backgroundColor: "#D9D9D9",
    padding: 10,
    marginBottom: 20,
    width: 350,
    alignSelf: "center",
    borderRadius: 10,
    height: 80,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center", // Align items vertically in the center
    marginBottom: 10, //
    gap: 40,
    marginLeft: 30,
  },
  welcomeText: {
    marginBottom: 8,
    fontSize: 25,
    color: "#fff",
    alignSelf: "center",
  },

  logo: {
    width: 50,
    height: 50,
    marginLeft: 320,
    marginTop: 30,
  },

  bottomIcons: {
    width: 50,
    height: 50,
  },

  text: {
    color: "#fff",
    marginLeft: 20,
    marginBottom: 15,
  },
  bottomText: {
    color: "#fff",
    fontSize: 18,
    fontStyle: "italic",
  },
  modalContent: {
    backgroundColor: "#D9D9D9",
    padding: 20,
    borderRadius: 10,
  },
});

export default HomePage;
