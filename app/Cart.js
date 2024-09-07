import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <Text style={styles.itemCount}>Total items in cart: {cartItems.length}</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          item ? (
            <View style={styles.cartItem}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.itemImage} />
              ) : null}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.productId && item.name}</Text>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                <Text style={styles.itemPrice}>Price: ₹{item.price}</Text>
              </View>
            </View>
          ) : null
        )}
      />
      <TouchableOpacity
        style={styles.buyNowButton}
        onPress={() => console.log("Buy Now pressed")}
      >
        <Text style={styles.buyNowText}>Buy Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  itemCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemQuantity: {
    fontSize: 16,
    color: "#666",
  },
  itemPrice: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  buyNowButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  buyNowText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Cart;
