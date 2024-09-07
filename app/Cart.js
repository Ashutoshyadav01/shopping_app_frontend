import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Function to load cart items from AsyncStorage
    const loadCartItems = async () => {
      try {
        const cartData = await AsyncStorage.getItem("cart");
        if (cartData) {
          const parsedCartData = JSON.parse(cartData);
          // Filter out any null or invalid items
          const validItems = parsedCartData.filter(item => item !== null && item !== undefined);
          setCartItems(validItems);
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
      }
    };

    loadCartItems();
  }, []);

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  // If cart has items
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Your Cart</Text>
        <Text style={styles.itemfound}>
          Total items in cart: {cartItems.length}
        </Text>
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            // Check if item exists before rendering its properties
            item ? (
              <View style={styles.cartItem}>
                <Text style={styles.itemName}>{item.productId}</Text>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
              </View>
            ) : null
          )}
        />
      </View>
      <View>
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={() => console.log("Buy Now pressed")}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  itemfound: {
    fontSize: 20,
    fontWeight: "bold",
    color: "grey",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  cartItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemQuantity: {
    fontSize: 16,
    color: "gray",
  },
  buyNowButton: {
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    marginBottom: 10,
  },
  buyNowText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default Cart;
