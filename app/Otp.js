import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Otp({ route, navigation }) {
  const { otp, input, name } = route.params; // Retrieve the OTP from the previous screen
  const [enteredOtp, setEnteredOtp] = useState("");
  const [count, setCount] = useState(1);

  const handleVerifyOtp = async () => {
    if (parseInt(enteredOtp) === otp) {
     
      try {
        await AsyncStorage.setItem("Name", JSON.stringify(name));

        console.log("Stored name");
      } catch (error) {
        console.log("Error storing name:", error);
      }
      // POST request using fetch()
      fetch("https://akm0505.bsite.net/api/CustomerRegisteration", {
        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify({
          CUSTOMER_ID: 1,
          CUSTOMER_ROLE_ID: 2,
          CUSTOMER_ROLE_TYPE: "sample string 3",
          IS_SHOP_OWNER: true,
          SHOP_ID: 1,
          CUSTOMER_NAME: name,
          CUSTOMER_DISPLAY_NAME: "sample string 6",
          CUSTOMER_EMAIL: "sample string 7",
          CUSTOMER_PHONE: input,
          CUSTOMER_PASSWORD: "sample string 9",
          CUSTOMER_PHONE2: "sample string 10",
          CUSTOMER_ADDRESS: "sample string 11",
          CUSTOMER_ADDRESS_1: "sample string 12",
          CUSTOMER_CITY: "sample string 13",
          CUSTOMER_STATE: "sample string 14",
          CUSTOMER_COUNTRY: "sample string 15",
          CUSTOMER_PINCODE: "sample string 16",
          CUSTOMER_PROFILE_PIC: "sample string 17",
        }),

        // Adding headers to the request
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        // Converting to JSON
        .then((response) => response.json())

        // Displaying results to console
        .then((json) =>{
          if(json.RESPONSE_TYPE=="SUCCESS")
          {
            alert(json.RESPONSE_MESSAGE);
            AsyncStorage.setItem()
            navigation.navigate("Signin");

          }
          else{
          alert(json.RESPONSE_MESSAGE);
          }
         
        });

     // navigation.navigate("Home");
    } else {
      alert("Invalid OTP. Please try again.");
      setCount(count + 1);
      if (count > 3) {
        alert("Too many attemps");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your OTP is:{otp}</Text>
      <Text style={styles.text}>
        {name}: CHECK YOUR MOB NO:{input}
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

export default Otp;
