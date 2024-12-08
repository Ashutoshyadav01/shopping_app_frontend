import { StyleSheet, TextInput, View, Text } from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RadioButton } from "react-native-paper";
import { getBaseApiUrl } from "./CommonFunctions";

export default function AddressForm({ navigation, route }) {
  const { pin, p_name, phone_no, addrs, p_city, p_state, p_default, id } = route.params;
  const [name, setname] = useState(p_name ? p_name : "");
  const [number, setNumber] = useState(phone_no ? phone_no : "");
  const [address, setAddress] = useState(addrs ? addrs : "");
  const [city, setCity] = useState(p_city ? p_city : "");
  const [pinCode, setPinCode] = useState(pin ? pin : "");
  const [cus_ID, setCus_Id] = useState("");
  const [state, setState] = useState(p_state ? p_state : "");
  const [defaultAddress, setDefaultAddress] = useState(p_default ? p_default : false);
  const [error, setError] = useState("");

  async function RefreshAddressList() {
    const profile = await AsyncStorage.getItem("UserProfile");
    const parsed = JSON.parse(profile);
    const loginId = parsed.CustomerMobileNumber;
    const response = fetch(getBaseApiUrl()+"/api/GetCustomerLoginDetail", {
      method: "POST",
      body: JSON.stringify({
        CUSTOMER_LOGIN_ID: loginId,
        CUSTOMER_PASSWORD: "sample string 9",
        ROLE_TYPE: "CUSTOMER",
        SHOP_ID: 1,
        OAUTH_TOKEN: "sample string 5",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.Table[0].RESPONSE_TYPE === "SUCCESS") {
          const addressList = resJson.Table2;
          try {
            AsyncStorage.setItem("AddressList", JSON.stringify(addressList));
            navigation.navigate("Address");
          } catch (error) {
            console.log("Error in fetching address detail", error);
          }
        }
      });
  }

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const localStorage = await AsyncStorage.getItem("UserProfile");
        if (localStorage) {
          const userProfile = JSON.parse(localStorage);
          setCus_Id(userProfile.CustomerID);
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = () => {
    // Validate each field
    if (name.trim() === "") {
      setError("Name is required!");
    } else if (number.trim() === "") {
      setError("Mobile Number is required!");
    } else if (address.trim() === "") {
      setError("Address is required!");
    } else if (city.trim() === "") {
      setError("City is required!");
    } else if (pinCode.trim() === "") {
      setError("Pincode is required!");
    } else if (state.trim() === "") {
      setError("State is required!");
    } else {
      setError(""); // Clear error
      SaveData(); // Proceed with saving data
    }
  };

  function SaveData() {
    fetch(getBaseApiUrl()+"/api/CustomerAddressAdd", {
      method: "POST",
      body: JSON.stringify({
        ADDRESS_ID: id,
        ACTION_TYPE: id == -1 ? "ADD" : "UPDATE",
        CUSTOMER_NAME: name,
        CUSTOMER_PHONE: number,
        CUSTOMER_ID: cus_ID,
        CUSTOMER_ADDRESS: address,
        CUSTOMER_CITY: city,
        CUSTOMER_STATE: state,
        CUSTOMER_PINCODE: pinCode,
        IS_DEFAULT: defaultAddress,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.RESPONSE_TYPE === "SUCCESS") {
          RefreshAddressList();
        }
        alert(json.RESPONSE_MESSAGE);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textbox}
        placeholder="Enter your Name"
        value={name}
        onChangeText={setname}
      />

      <TextInput
        style={styles.textbox}
        placeholder="Enter your Mobile Number"
        keyboardType="phone-pad"
        value={number}
        onChangeText={setNumber}
      />
      
      <TextInput
        style={styles.textbox}
        placeholder="Enter your Address"
        multiline={true}
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.textbox}
        placeholder="Enter your City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.textbox}
        placeholder="Enter your Pincode"
        keyboardType="number-pad"
        value={pinCode}
        onChangeText={setPinCode}
      />
      <TextInput
        style={styles.textbox}
        placeholder="Enter your State"
        value={state}
        onChangeText={setState}
      />
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
        <Text>It is your default address?</Text>
        <RadioButton.Group
          onValueChange={(val) => setDefaultAddress(val)}
          value={defaultAddress}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={true} />
              <Text>Yes</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={false} />
              <Text>No</Text>
            </View>
          </View>
        </RadioButton.Group>
       
      </View>
      <View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
      <TouchableOpacity onPress={handleSubmit}>
        <View style={styles.btn}>
          <Text style={{ color: "#fff" }}>
            {id == -1 ? "Add New Address" : "Update Address"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  textbox: {
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    borderColor: "#ccc",
  },
  btn: {
    backgroundColor: "#f6740c",
    padding: 15,
    width: 370,
    borderRadius: 15,
    marginTop: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});
