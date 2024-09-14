import React, { useState, useEffect} from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';

const Cart = ({navigation}) => {
  const [cartItems, setCartItems] = useState([]);
  const [itemCounts, setItemCounts] = useState({});
  const freeAmt = 250;
  const deliveryCharge = calculateTotalPrice() < freeAmt ? 19 : 0;
  const totalPrice= calculateTotalPrice();

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const cartData = await AsyncStorage.getItem("cart");
        if (cartData) {
          const parsedCartData = JSON.parse(cartData);
          const validItems = parsedCartData.filter(item => item !== null && item !== undefined);
          setCartItems(validItems);

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

  const removeCartItem = async (productId) => {
    try {
      const updatedItems = cartItems.filter(item => item.productId !== productId);
      setCartItems(updatedItems);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedItems));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  function calculateTotalPrice() {
    return cartItems.reduce((acc, curr) => {
      return acc + curr.quantity * curr.price;
    }, 0);
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
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
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          item ? (
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
                  <Icon name="trash" size={30} color="#900" style={{color:"grey",marginRight:5}} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        }
      />
      {/* Total Price */}
      <View style={styles.totalPrice}>
        <Text>Apply coupon</Text>
        <TouchableOpacity onPress={()=>{navigation.navigate("Coupon",{totalPrice})}}>
        <Text style={{color:"orange",zIndex:1,position:"relative"}}>Select</Text>
        </TouchableOpacity>
       
      </View>
      <View style={styles.bill}>
        <Text style={{fontWeight:"600"}}>Bill Details</Text>
        <View style={styles.total}>
          <Text>Sub Total</Text>
          <Text style={{ fontWeight: "500" }}>₹{calculateTotalPrice()}</Text>
        </View>
        <View style={styles.total}>
          <Text>Tax</Text>
          <Text style={{ fontWeight: "500" }}>{calculateTotalPrice() ? "₹19" : "Free delivery"}</Text>
        </View>
        <View style={styles.total}>
          <Text>Delivery Charge</Text>
          <Text style={{ fontWeight: "500" }}>{calculateTotalPrice() < freeAmt ? "₹19" : "Free delivery"}</Text>
        </View>
        <View style={styles.total}>
          <Text>Payable</Text>
          <Text style={{ fontWeight: "500" }}>{calculateTotalPrice() + 19}</Text>
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
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor:"green",
    color:"green",
    borderRadius: 10,
    justifyContent: "space-between",
    width: 100,

  },
  counterButtonminus: {
    borderRightWidth: 1,
    padding: 10,
       color:"green",
    borderRadius: 4,
  },
  counterButton: {
    borderLeftWidth: 1,
    padding: 10,
    borderRadius: 4,
       color:"green"
  },
  counterText: {
    fontSize: 20,
    fontWeight: "bold",
    color:"green"
  },
  trashIconContainer: {
    marginLeft: 11,
    justifyContent: "center",
    alignItems: "center",
    
  },
  totalPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderWidth:1,
    borderRadius:10
  },
  buyNowButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width: 150,
  },
  PickupButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width: 150,
    borderWidth: 1,
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
  bill: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
});

export default Cart;
