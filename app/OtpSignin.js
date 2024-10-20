import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import{getBaseApiUrl,SaveOrderHistory ,isDevelopmentMode} from './CommonFunctions'
function OtpSignin({ route, navigation }) {
  const { otp, input, name } = route.params; 
  const [enteredOtp, setEnteredOtp] = useState("");
  const [count, setCount] = useState(1);


  const handleVerifyOtp = async () => {

    if (parseInt(enteredOtp) === otp) {
      try {
        const response = await fetch(getBaseApiUrl()+"/api/GetCustomerLoginDetail", {
          method: "POST",
          body: JSON.stringify({
            "CUSTOMER_LOGIN_ID": input,
            "CUSTOMER_PASSWORD": "sample string 9",
            "ROLE_TYPE": "CUSTOMER",
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
           console.log("orderhistory",json.Table3);
           console.log("orderDetail",json.Table4)
           const hexCodes=json.Table3.map((item)=>item.COLOR_HEX_CODE);
           console.log("hexcode",hexCodes);
          AsyncStorage.setItem("hexCode",JSON.stringify(hexCodes));
         
          SaveOrderHistory(JSON.stringify(json.Table3),JSON.stringify(json.Table4));
          console.log("All details",json);
          console.log("Address",addressList);
          console.log("user details",userJson);

          try {
           
            await AsyncStorage.setItem("UserProfile", JSON.stringify(userJson)); 
            await AsyncStorage.setItem("AddressList",JSON.stringify(addressList));
            
            console.log("Stored user details");
          } catch (error) {
            console.log("Error storing name:", error);
          }

          alert("User Successfully logged in");
          navigation.navigate("Home");
        } else {
         
          alert(json.Table[0].RESPONSE_MESSAGE);
        }
      } catch (error) {
        alert("Please Register this Mobile Number");
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
      
      <Text style={styles.text}>
        {isDevelopmentMode()?otp:""}
       Please check your mobile number({input}) for OTP
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
