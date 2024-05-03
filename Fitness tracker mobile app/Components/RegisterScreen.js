import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const registerWithFirebase = () => {
    if (email.length < 4) {
      Alert.alert("Please enter a valid email address");
      return;
    }
    if (password.length < 4) {
      Alert.alert("Please enter a valid password");
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(async () => {
        Alert.alert("User Registered");

        //setting the user Id
        var userID = auth.currentUser.uid;
        const userDocRef = doc(firestore, "users/" + userID);

        //(first name, last name, email)
        const userData = {
          name: username,
          email: email,
        };

        try {
          await setDoc(userDocRef, userData);
          Alert.alert("User data stored successfully in Firestore");
        } catch (error) {
          console.error("Error storing user data in Firestore:", error);
          // Handle the error appropriately
        }
      })
      .catch((error) => {
        errorCode = error.code;
        errorMessage = error.message;
        if (errorCode === "auth/weak-password") {
          Alert.alert("Password is too weak.");
        } else {
          Alert.alert(errorMessage);
          console.log("hey", errorMessage);
        }
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Let's Get Started!</Text>
          <Text style={styles.text}>Register to continue</Text>
        </View>
        <Image
          style={styles.logo}
          source={require("../mobile-project-logo.png")}
        />
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.text}>Name</Text>
        <TextInput
          style={styles.textBox}
          placeholder="Name"
          onChangeText={(value) => {
            setUsername(value);
          }}
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
        />
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
        <TouchableOpacity style={styles.button} onPress={registerWithFirebase}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("Login")}
        >
          Already have an account? Login!
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 10,
    // Adjust the margin value as needed
  },
  headerTextContainer: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 200,
  },
  logo: {
    width: 148,
    height: 151,
    marginLeft: 30,
    marginTop: 36,
    marginBottom: 40,
  },
  text: {
    color: "#fff",
    textAlign: "left",
    fontSize: 17,
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 36,
    textAlign: "left",
    marginBottom: 15,
  },
  linkText: {
    color: "#818A91",
    marginBottom: 100,
    marginLeft: 50,
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
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    width: 70,
  },
});

export default RegisterScreen;
