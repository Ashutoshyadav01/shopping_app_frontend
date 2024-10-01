import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';

const Cart = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [itemCounts, setItemCounts] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const freeAmt = 250;
//  const btn1=1;
//  const btn2=2;
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const cartData = await AsyncStorage.getItem("cart");
        if (cartData) {
          const parsedCartData = JSON.parse(cartData);
          const validItems = parsedCartData.filter(item => item !== null && item !== undefined);
          setCartItems(validItems);
        }

        const storedCounts = await AsyncStorage.getItem("itemCounts");
        if (storedCounts) {
          setItemCounts(JSON.parse(storedCounts));
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
      }
    };

    loadCartItems();
  }, []);

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  const applyCoupon = () => {
    if (couponCode === "DISCOUNT10") {
      setDiscount(10);
      alert("Coupon applied! You got 10% off.");
    } else {
      alert("Invalid coupon code.");
    }
  };
  function calculateTotalPrice() {
    return cartItems.reduce((acc, curr) => {
      return acc + curr.quantity * curr.price;
    }, 0);
  }


  const updateItemCount = async (item, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.productId === item.productId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );
    const updatedCounts = { ...itemCounts, [item.name]: newQuantity };
    setItemCounts(updatedCounts);
    await AsyncStorage.setItem("itemCounts", JSON.stringify(updatedCounts));
  };

  const removeFromCart = async (item) => {
    const updatedCartItems = cartItems.filter((cartItem) => cartItem.productId !== item.productId);
    setCartItems(updatedCartItems);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Cart</Text>
      {cartItems.length === 0 ? (
        <Text>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.productId.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                <View style={styles.cartItemDetails}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>₹{item.price}</Text>
                  <View style={styles.quantityActions}>
                    <TouchableOpacity onPress={() => updateItemCount(item, item.quantity + 1)}>
                      <Icon name="plus-circle" size={24} color="green" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => item.quantity > 1 ? updateItemCount(item, item.quantity - 1) : removeFromCart(item)}
                    >
                      <Icon name="minus-circle" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
          <View style={styles.couponSection}>
            <TextInput
              style={styles.couponInput}
              placeholder="Enter coupon code"
              value={couponCode}
              onChangeText={setCouponCode}
            />
            <TouchableOpacity style={styles.applyCouponButton} onPress={applyCoupon}>
              <Text style={styles.applyCouponText}>Apply Coupon</Text>
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
         <View style={styles.BtnView}>

         <TouchableOpacity onPress={()=>{
          navigation.navigate("ReviewOrder",{btn1})
         }}>
         <Text style={styles.btn}>PICKUP</Text>
            </TouchableOpacity>
          
          
         <TouchableOpacity
         onPress={()=>{
          navigation.navigate("ReviewOrder",{btn2})
         }}
         >
         <Text style={styles.btn}>DELIVER</Text>
            </TouchableOpacity>
         
         </View>
        
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  btn:{
    backgroundColor:"#f6740c",
    color:"#fff",
    padding:10,
    width:120,
    marginTop:10,
    alignItems:"center",
    justifyContent:"center"
  },
  BtnView:{
    flexDirection:"row",
    justifyContent:"space-around"
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    padding: 10,
    
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
  cartItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cartItemPrice: {
    fontSize: 16,
    color: "#555",
  },
  quantityActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  couponSection: {
    flexDirection: "row",
    marginVertical: 16,
  },
  couponInput: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
  },
  applyCouponButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    marginLeft: 8,
    borderRadius: 4,
  },
  applyCouponText: {
    color: "#fff",
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  freeAmount: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
  },
  pickupDeliveryText: {
    fontSize: 18,
    marginTop: 16,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Cart;
