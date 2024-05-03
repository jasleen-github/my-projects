import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import HomePage from "./Components/HomePage";
import RegisterScreen from "./Components/RegisterScreen";
import AddWorkoutScreen from "./Components/AddWorkoutScreen";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginWithFirebase = () => {
    if (email.length < 4) {
      Alert.alert("Please enter a valid email address");
      return;
    }
    if (password.length < 4) {
      Alert.alert("Please enter a valid password");
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        fetchUserData();
      })
      .catch((error) => {
        errorCode = error.code;
        errorMessage = error.message;
        if (errorCode === "auth/wrong-password") {
          Alert.alert("Password is wrong.");
        } else {
          Alert.alert(errorMessage);
          console.log(errorMessage);
        }
      });
  };

  [username, setUsername] = useState("");

  const fetchUserData = async () => {
    const userDocRef = doc(firestore, "users/", auth.currentUser.uid);
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log(userData);
        setUsername(userData.name);
        navigation.navigate("HomePage");
      } else {
        Alert.alert("error retreiving your data");
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("./mobile-project-logo.png")}
      />
      <View style={styles.bodyContainer}>
        <Text style={styles.headerText}>Welcome</Text>
        <Text style={styles.headerText}>Back!</Text>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.text}>Login to continue</Text>
        </View>

        <Text style={styles.text}>Email Address</Text>
        <TextInput
          style={styles.textBox}
          placeholder="Email Address"
          onChangeText={(value) => {
            setEmail(value);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
        />
        <Text style={styles.text}>Password</Text>
        <TextInput
          style={styles.textBox}
          placeholder="Password"
          onChangeText={(value) => {
            setPassword(value);
          }}
          secureTextEntry={true}
          keyboardType="visible-password"
          autoCapitalize="none"
          value={password}
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.button} onPress={loginWithFirebase}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={styles.linkText}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? Register
      </Text>
    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="WorkoutScreen"
          component={AddWorkoutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
    justifyContent: "flex-start",
  },

  logo: {
    width: 169,
    height: 172,
    marginLeft: 30,
    marginTop: 36,
    marginBottom: 20,
  },

  headerText: {
    color: "#fff",
    fontSize: 36,
    textAlign: "left",
  },

  text: {
    color: "#fff",
    textAlign: "left",
    fontSize: 17,
    marginBottom: 10,
    marginTop: 10,
  },
  linkText: {
    color: "#818A91",
    marginBottom: 130,
  },
  textBox: {
    backgroundColor: "#fff",
    color: "#818A91",
    textAlign: "left",
    width: 300,
    marginBottom: 10,
    padding: 5,
  },

  button: {
    backgroundColor: "#EE8100",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    margin: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    width: 70,
  },
});
