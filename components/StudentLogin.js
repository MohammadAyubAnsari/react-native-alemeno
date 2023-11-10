import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const StudentLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate("StudentDashboard");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`Login failed: ${errorCode} - ${errorMessage}`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.linkText}>
        Not registered yet?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("StudentRegistration")}
        >
          Register
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  linkText: {
    textAlign: "center",
  },
  link: {
    color: "red",
    fontSize: 15,
    fontStyle: "italic",
    fontWeight: "bold",
  },
});

export default StudentLoginScreen;
