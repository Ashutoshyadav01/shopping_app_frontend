import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";

function SignIn({ navigation }) {
  const screen = Dimensions.get("window").width;
  const [input, setInput] = useState("");
  
  function randomNum() {
    const min = 1000;
    const max = 9999;
    const x = Math.floor(Math.random() * (max - min + 1)) + min;
    return x;
  }

  const isButtonDisabled = input.length !== 10;

  return (
    <View style={styles.container}>
      <View style={[styles.form, { width: screen }]}>
        <Text style={styles.heading}>Welcome Back!</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your 10 Digit Mobile Number"
          keyboardType="numeric"
          maxLength={10}
          value={input}
          onChangeText={setInput}
          placeholderTextColor="#888"
        />
      
        <TouchableOpacity
          style={[styles.button, isButtonDisabled && styles.disablebtn]}
          disabled={isButtonDisabled}
          onPress={() => {
            const otp = randomNum();
            navigation.navigate("OtpSignin", { otp, input });
          }}
        >
          <Text style={styles.buttonText}>Request OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    backgroundColor: "white",
    height: 400,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#006400", // Dark green
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    width: '90%',
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  button: {
    backgroundColor: '#006400', // Dark green
    padding: 15,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  disablebtn: {
    backgroundColor: "grey",
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: "600",
  },
});

export default SignIn;
