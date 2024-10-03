import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangeAdd({ navigation }) {
  const [allAddress, setAllAddress] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null); // To track the current default address

  useEffect(() => {
    async function getAllAdd() {
      const x = await AsyncStorage.getItem("AddressList");
      if (x) {
        const parsed = JSON.parse(x);
        setAllAddress(parsed);
        console.log(parsed);
        // Set default address if any
        const defaultAddress = parsed.find(address => address.IsDefault);
        if (defaultAddress) {
          setDefaultAddressId(defaultAddress.AddressId);
        }
      }
    }
    getAllAdd();
  }, []);

  const handleAddressPress = (addressId) => {
    setDefaultAddressId(addressId); // Set the pressed address as the default
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={allAddress}
        keyExtractor={(item) => item.AddressId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.flatlist, item.AddressId === defaultAddressId ? styles.default : null]}
            onPress={() => handleAddressPress(item.AddressId)} // Handle address click
          >
            <Text style={styles.name}>{item.CustomerName}</Text>
            <Text style={styles.phone}>{item.CustomerPhoneNumber}</Text>
            <Text style={styles.address}>
              {item.Address}, {item.City}, {item.State} - {item.PinCode}
            </Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={() => {
        navigation.navigate("ReviewOrder", { deliveryType: 2, addressId: defaultAddressId });
        alert(defaultAddressId);
      }}>
        <Text style={styles.buttonText}>Change</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Light background color for the screen
  },
  flatlist: {
    backgroundColor: '#fff', // White background for each item
    padding: 20,             // More padding for breathing space
    marginVertical: 10,      // Vertical margin between items
    marginHorizontal: 15,    // Horizontal margin
    borderRadius: 10,        // Rounded corners for the item box
    shadowColor: '#000',     // Shadow for depth effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,          // Elevation for Android shadow
  },
  default: {
    borderColor: "red",      // Red border for the default address
    borderWidth: 2,          // Set border width for visibility
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,         // Spacing below the name
    color: '#333',           // Dark color for text
  },
  phone: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',           // Medium gray for less important info
    marginBottom: 10,        // Spacing below phone number
  },
  address: {
    fontSize: 14,
    color: '#444',           // Darker gray for address
    marginBottom: 5,         // Spacing below the address
  },
  button: {
    backgroundColor: '#28a745',  // Green button background
    padding: 15,                 // Padding for the button
    margin: 20,                  // Margin from the edges
    borderRadius: 10,            // Rounded corners for the button
    alignItems: 'center',        // Center the button text
  },
  buttonText: {
    color: '#fff',               // White text color
    fontSize: 18,                // Font size for button text
    fontWeight: '600',           // Bold text
  }
});
