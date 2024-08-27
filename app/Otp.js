import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";

function Otp({ route, navigation }) {
  const { otp,input } = route.params; // Retrieve the OTP from the previous screen
  const [enteredOtp, setEnteredOtp] = useState("");
  let count=0;

  const handleVerifyOtp = () => {
    if (
       parseInt( enteredOtp) === otp) {
        alert("user Verified")
      navigation.navigate("Home");
      
    } else {
      alert("Invalid OTP. Please try again.");
      count++;
      if(count>3)
      {
     alert("Too many attemps");
      }
    }
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your OTP is: {otp}</Text>
      <Text style={styles.text}>CHECK YOUR MOB NO:{input}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 4-Digit OTP"
        keyboardType="numeric"
        maxLength={4} 
        value={enteredOtp}
        onChangeText={setEnteredOtp}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    textAlign: 'center', // Center the text in the input field
    fontSize: 24,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Otp;
