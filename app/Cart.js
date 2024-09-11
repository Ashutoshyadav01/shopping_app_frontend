import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [itemCounts, setItemCounts] = useState({});

  useEffect(() => {
    // Function to load cart items from AsyncStorage
    const loadCartItems = async () => {
      try {
        const cartData = await AsyncStorage.getItem("cart");
        if (cartData) {
          const parsedCartData = JSON.parse(cartData);
          const validItems = parsedCartData.filter(item => item !== null && item !== undefined);
          setCartItems(validItems);
          
          // Load item counts separately
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

  const updateItemCount = async (itemName, newCount) => {
    const updatedCounts = { ...itemCounts, [itemName]: newCount };
    setItemCounts(updatedCounts);

    try {
      await AsyncStorage.setItem("itemCounts", JSON.stringify(updatedCounts));
    } catch (error) {
      console.error("Error storing item counts:", error);
    }
  };

  const updateCartItemQuantity = async (productId, increment) => {
    try {
      const updatedItems = cartItems
        .map(item => {
          if (item.productId === productId) {
            const newQuantity = Math.max(item.quantity + increment, 0); 
            updateItemCount(item.productId, newQuantity); 
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
      setCartItems(updatedItems);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedItems));
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };


 
  function calculateTotalPrice(){
   return cartItems.reduce((acc,curr)=>{
  return acc+(curr.quantity*curr.price)
   },0)
  };

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
                <Text style={styles.itemName}>{item.name || "Unknown Item"}</Text>
                <Text style={styles.itemPrice}>Price: ₹{item.price}</Text>
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={styles.counterButton}
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
              </View>
            </View>
          ) : null
        )}
      />

      {/* Total Price */}
      <Text style={styles.totalPrice}>
        Total Price: ₹{calculateTotalPrice()}
      </Text>

      <View style={styles.btn}>
        <TouchableOpacity
          style={styles.PickupButton}
          onPress={() => console.log("I will pickup pressed")}
        >
          <Text style={styles.PickText}>Pickup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={() => console.log("Buy Now pressed")}
        >
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
  },
  btn:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    gap:20,
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
  itemPrice: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderWidth:1,
    width:100,
    flex:1,
    borderRadius:10,
    justifyContent:"space-between"
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
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
    textAlign: "center",
  },
  buyNowButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width:150,
  },
  PickupButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width:150,
    borderWidth:1,
  },
  PickText: {
    color: "green",
    fontSize: 18,
    fontWeight: "bold",
  },
  buyNowText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Cart;
