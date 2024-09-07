import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params; 
  const [newImg, setNewimg] = useState(item.image);
  const [itemCounts, setItemCounts] = useState({});
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const loadItemCount = async () => {
      try {
        const storedItemCounts = await AsyncStorage.getItem("itemCounts");
        if (storedItemCounts) {
          const parsedCounts = JSON.parse(storedItemCounts);
          setItemCounts(parsedCounts);
          setItemCount(parsedCounts[item.name] || 0);
        }
      } catch (error) {
        console.error("Error loading item counts from storage:", error);
      }
    };
    loadItemCount();
  }, [item.name]);

  const handleimg = (imgUri) => {
    setNewimg(imgUri);
  };

  const updateItemCount = (itemName, increment) => {
    const updatedItemCounts = {
      ...itemCounts,
      [itemName]: itemCounts[itemName] ? itemCounts[itemName] + increment : increment,
    };
    if (updatedItemCounts[itemName] < 0) {
      updatedItemCounts[itemName] = 0;
    }
    setItemCounts(updatedItemCounts);
    setItemCount(updatedItemCounts[itemName]);
    AsyncStorage.setItem("itemCounts", JSON.stringify(updatedItemCounts))
      .catch(error => console.error("Error updating item counts in storage:", error));
  };

  const storeItemInCart = async (productId, quantity) => {
    if (quantity <= 0) {
      console.warn("Cannot add items with zero or negative quantity to the cart.");
      return;
    }
    try {
      const cartItem = {
        productId,
        quantity,
        name: item.name,
        price: item.price,
        discount: item.discount,
        image: item.image,
      };
      const existingCart = await AsyncStorage.getItem("cart");
      let cart = existingCart ? JSON.parse(existingCart) : [];
      const itemIndex = cart.findIndex((cartItem) => cartItem.productId === productId);
      if (itemIndex > -1) {
        // Replace the quantity with the new quantity
        cart[itemIndex].quantity = quantity;
      } else {
        // Add new item to the cart
        cart.push(cartItem);
      }
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      console.log("Cart updated:", cart);
    } catch (error) {
      console.error("Error storing item in cart:", error);
    }
  };

  const handleAddToCart = () => {
    if (itemCount > 0) {
      storeItemInCart(item.productId, itemCount); // Pass productId instead of item.name
      alert("Item added to cart!");
    } else {
      alert("Please select at least one item.");
    }
  };

  const handleBuyNow = () => {
    if (itemCount > 0) {
      storeItemInCart(item.productId, itemCount); // Pass productId instead of item.name
      navigation.navigate("CheckoutScreen"); // Navigate to the checkout screen
    } else {
      alert("Please select at least one item.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: newImg }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => updateItemCount(item.name, -1)}
          >
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{itemCount}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => updateItemCount(item.name, 1)}
          >
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={handleBuyNow}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  infoContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  itemName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 20,
    color: "#333",
    marginVertical: 8,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  counterButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  counterText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addToCartButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 4,
    marginVertical: 8,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buyNowButton: {
    backgroundColor: "#FF5722",
    padding: 12,
    borderRadius: 4,
  },
  buyNowText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProductDetailsScreen;
