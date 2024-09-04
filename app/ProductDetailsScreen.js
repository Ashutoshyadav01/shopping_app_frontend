import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductDetailsScreen = ({ route, navigation }) => { // Added navigation to props
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
    try {
      const cartItem = { productId, quantity };
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
      await AsyncStorage.setItem("itemCounts", JSON.stringify(itemCounts));
      console.log("Cart updated:", cart);
    } catch (error) {
      console.error("Error storing item in cart:", error);
    }
  };

  const handleAddToCart = () => {
    if (itemCount > 0) {
      storeItemInCart(item.name, itemCount);
      alert("Item added to cart!");
    } else {
      alert("Please select at least one item.");
    }
  };

  const handleBuyNow = () => {
    if (itemCount > 0) {
      storeItemInCart(item.name, itemCount);
      navigation.navigate("CheckoutScreen"); // Navigate to the checkout screen
    } else {
      alert("Please select at least one item.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Product Image and Name */}
      <View style={styles.productContainer}>
        <Image source={{ uri: newImg }} style={styles.productImage} />
        <Text style={styles.productName}>{item.name}</Text>
      </View>

      {/* More Images */}
      <View style={styles.moreimg}>
        <TouchableOpacity onPress={() => handleimg("https://via.placeholder.com/100")}>
          <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.img1} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleimg("https://via.placeholder.com/100")}>
          <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.img1} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleimg("https://via.placeholder.com/100")}>
          <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.img1} />
        </TouchableOpacity>
      </View>

      {/* Price Details and Share Icon */}
      <View style={styles.detail}>
        <View style={styles.c1}>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.op}>₹{item.op}</Text>
          <View style={styles.bg}><Text style={styles.discount}>{item.discount}</Text></View>
        </View>
        <TouchableOpacity onPress={() => { /* Implement share functionality */ }}>
          <Icon name="share-outline" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Points Earned */}
      <View style={styles.pointsContainer}>
        <Text>You will earn 2 points from this product</Text>
      </View>

      {/* Reviews and Rating */}
      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsText}>Reviews and Rating</Text>
        <View style={styles.starcontainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Icon
              key={star}
              name={star <= 3 ? "star" : "star-outline"}
              size={24}
              color="#ffd700"
            />
          ))}
        </View>
      </View>

      {/* Counter */}
      <View style={styles.counterContainer}>
        <TouchableOpacity onPress={() => updateItemCount(item.name, -1)}>
          <Icon name="remove-circle-outline" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.itemCountText}>{itemCount}</Text>
        <TouchableOpacity onPress={() => updateItemCount(item.name, 1)}>
          <Icon name="add-circle-outline" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Add to Cart and Buy Now Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  productContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  moreimg: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  img1: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  detail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  c1: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  op: {
    textDecorationLine: "line-through",
    marginLeft: 10,
    color: "grey",
    fontSize: 16,
  },
  bg: {
    backgroundColor: "green",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    marginLeft: 10,
  },
  discount: {
    color: "#fff",
    fontSize: 14,
  },
  pointsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  reviewsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  reviewsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  starcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  itemCountText: {
    marginHorizontal: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  addToCartButton: {
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buyNowButton: {
    backgroundColor: "orange",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buyNowText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProductDetailsScreen;
