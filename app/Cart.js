import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';

const Cart = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [itemCounts, setItemCounts] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0); // Added for coupon discount
  const freeAmt = 250;

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const cartData = await AsyncStorage.getItem("cart");
        console.log("Loaded cart data:", cartData); // Debugging
        if (cartData) {
          const parsedCartData = JSON.parse(cartData);
          const validItems = parsedCartData.filter(item => item !== null && item !== undefined);
          setCartItems(validItems);
          console.log("Parsed cart items:", validItems); // Debugging

          const itemCountsData = await AsyncStorage.getItem("itemCounts");
          if (itemCountsData) {
            setItemCounts(JSON.parse(itemCountsData));
          }
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
      }
    };

    loadCartItems();
  }, []);

  const updateItemCount = async (productId, newCount) => {
    const updatedCounts = { ...itemCounts, [productId]: newCount };
    setItemCounts(updatedCounts);

    try {
      await AsyncStorage.setItem("itemCounts", JSON.stringify(updatedCounts));
    } catch (error) {
      console.error("Error updating item counts:", error);
    }
  };

  const updateCartItemQuantity = async (productId, increment) => {
    const updatedItems = cartItems.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(item.quantity + increment, 0);
        updateItemCount(productId, newQuantity);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);

    setCartItems(updatedItems);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const removeCartItem = async (productId) => {
    const updatedItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedItems);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((acc, curr) => acc + curr.quantity * curr.price, 0);
  };

  const handleApplyCoupon = () => {
    if (couponCode === "DISCOUNT10") {
      setDiscount(10);
    } else {
      setDiscount(0); 
    }
  };

  const calculateDiscountedPrice = () => {
    const total = calculateTotalPrice();
    return total - (total * discount) / 100;
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Image width={400} source={require("./EmptyCart.png")} />
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <Text style={styles.itemCount}>Total items in cart: {cartItems.length}</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId.toString()} // Convert productId to string
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            {item.image ? <Image source={{ uri: item.image }} style={styles.itemImage} /> : null}
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name || "Unknown Item"}</Text>
              <Text style={styles.itemPrice}>Price: ₹{item.price}</Text>
            </View>
            <View style={styles.controlsContainer}>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButtonminus}
                  onPress={() => updateCartItemQuantity(item.productId, -1)}
                >
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => updateCartItemQuantity(item.productId, 1)}
                >
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => removeCartItem(item.productId)} style={styles.trashIconContainer}>
                <Icon name="trash" size={30} color="#900" style={{ color: "grey", marginRight: 5 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      
      {/* Apply Coupon Section */}
      <View style={styles.couponContainer}>
        <TextInput
          style={styles.couponInput}
          placeholder="Enter Coupon Code"
          value={couponCode}
          onChangeText={setCouponCode}
        />
        <TouchableOpacity style={styles.applyCouponButton} onPress={handleApplyCoupon}>
          <Text style={styles.applyCouponText}>Apply Coupon</Text>
        </TouchableOpacity>
      </View>

      {/* Bill and Total Price */}
      <View style={styles.bill}>
        <Text style={{ fontWeight: "600" }}>Bill Details</Text>
        <View style={styles.total}>
          <Text>Sub Total</Text>
          <Text style={{ fontWeight: "500" }}>₹{calculateTotalPrice()}</Text>
        </View>
        <View style={styles.total}>
          <Text>Discount</Text>
          <Text style={{ fontWeight: "500" }}>₹{(calculateTotalPrice() * discount) / 100}</Text>
        </View>
        <View style={styles.total}>
          <Text>Tax</Text>
          <Text style={{ fontWeight: "500" }}>{calculateTotalPrice() ? "₹19" : "Free delivery"}</Text>
        </View>
        <View style={styles.total}>
          <Text>Delivery Charge</Text>
          <Text style={{ fontWeight: "500" }}>{calculateDiscountedPrice() < freeAmt ? "₹19" : "Free delivery"}</Text>
        </View>
        <View style={styles.total}>
          <Text>Payable</Text>
          <Text style={{ fontWeight: "500" }}>{calculateDiscountedPrice() + (calculateDiscountedPrice() < freeAmt ? 19 : 0)}</Text>
        </View>
      </View>
      
      <View style={styles.btn}>
        <TouchableOpacity style={styles.PickupButton} onPress={() => console.log("I will pickup pressed")}>
          <Text style={styles.PickText}>Pickup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton} onPress={() => console.log("Buy Now pressed")}>
          <Text style={styles.buyNowText}>Deliver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: 'center'
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  itemCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 10,
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    padding: 10,
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
    marginRight: 15,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
    flexDirection: "column",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButton: {
    backgroundColor: "#ddd",
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 10,
  },
  counterButtonminus: {
    backgroundColor: "#ddd",
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 10,
  },
  counterText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  trashIconContainer: {
    paddingHorizontal: 10,
  },
  couponContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  couponInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
  },
  applyCouponButton: {
    backgroundColor: "#FF6600",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  applyCouponText: {
    color: "#fff",
    fontWeight: "bold",
  },
  bill: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
  buyNowButton: {
    backgroundColor: "#FF6600",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buyNowText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  PickupButton: {
    backgroundColor: "#FF6600",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  PickText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Cart;
