import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

function OtpSignin({ route, navigation }) {
  const { otp, input, name } = route.params; 
  const [enteredOtp, setEnteredOtp] = useState("");
  const [count, setCount] = useState(1);

  const handleVerifyOtp = async () => {
    if (parseInt(enteredOtp) === otp) {
      try {
        const response = await fetch("https://akm0505.bsite.net/api/GetCustomerLoginDetail", {
          method: "POST",
          body: JSON.stringify({
            "CUSTOMER_LOGIN_ID": input,
            "CUSTOMER_PASSWORD": "sample string 9",
            "CUSTOMER_ROLE_ID": 0,
            "SHOP_ID": 1,
            "OAUTH_TOKEN": "sample string 5"
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        
        const json = await response.json();

        if (json.Table[0].RESPONSE_TYPE === "SUCCESS") {
          const userJson = json.Table1[0];
          const addressList= json.Table2;
          console.log("Address",addressList);
          console.log("user details",userJson);

          try {
            await AsyncStorage.setItem("UserProfile", JSON.stringify(userJson)); 
            await AsyncStorage.setItem("AddressList",JSON.stringify(addressList));
            console.log("Stored user details");
          } catch (error) {
            console.log("Error storing name:", error);
          }

          alert(json.Table[0].RESPONSE_MESSAGE);
          navigation.navigate("Home");
        } else {
          alert(json.Table[0].RESPONSE_MESSAGE);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    } else {
      alert("Invalid OTP. Please try again.");
      setCount(count + 1);
      if (count > 3) {
        alert("Too many attempts");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your OTP is: {otp}</Text>
      <Text style={styles.text}>
        {name}: CHECK YOUR MOB NO: {input}
      </Text>
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
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%",
    marginBottom: 20,
    textAlign: "center", // Center the text in the input field
    fontSize: 24,
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default OtpSignin;
