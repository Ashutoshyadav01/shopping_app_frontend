import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';
import { RadioButton } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';


const Cart = ({ navigation ,route}) => {
  const [selectedValue, setSelectedValue] = useState(null);


  const [cartItems, setCartItems] = useState([]);
  const [itemCounts, setItemCounts] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const[shopAdd,setShopAdd]= useState("");
  const freeAmt = 250;
  const [checked, setChecked] = useState('first');
  const items=cartItems.length;
  const [allAddress,setAllAddress]=useState([]);
  const [defaultAddress,setDefaultAddress]=useState("");
  const {deliveryType,addressId}= route.params;
  const options = [
    { label: 'Cash On delivery', value: 'COD' },
    { label: 'UPI', value: 'UPI' },
  ];
  useFocusEffect(
    React.useCallback(() => {
      const fetchAddresses = async () => {
        const x = await AsyncStorage.getItem("AddressList");
        if (x) {
          const parsed = JSON.parse(x);
          setAllAddress(parsed);
  
          // Filter for the address using addressId
          const setAdd = parsed.filter((item) => item.AddressId === addressId);
          if (setAdd.length > 0) {
            const newDefaultAddress = `${setAdd[0].Address || ''}, ${setAdd[0].City || ''}, ${setAdd[0].State || ''}`;
            // Only update if the address has changed
            if (newDefaultAddress !== defaultAddress) {
              setDefaultAddress(newDefaultAddress);
            }
          } else {
            console.log("No address found for the given addressId");
          }
        }
      };
  
      const fetchDefaultAddress = async () => {
        const x = await AsyncStorage.getItem("defaultAddress");
        if (x) {
          const parsed = JSON.parse(x);
          const newDefaultAddress = `${parsed.Address || ''}, ${parsed.City || ''}, ${parsed.State || ''}`;
          // Only update if the address has changed
          if (newDefaultAddress !== defaultAddress) {
            setDefaultAddress(newDefaultAddress);
          }
        }
      };
  
      fetchAddresses();
      fetchDefaultAddress();
    }, [addressId]) // Added defaultAddress as a dependency
  );
  




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
    async function getInitialSetup()
    {
     
      const initial= await AsyncStorage.getItem("initialSetup");
      const parsed=JSON.parse(initial);
     // console.log(parsed);
      const AddressLine1=parsed.Table[0].ShopAddressLine1;
      const AddressLine2= parsed.Table[0].ShopAddressLine2; 
      setShopAdd(`${AddressLine1}, ${AddressLine2}`)
    }

    
  getInitialSetup();
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
      <Text>{addressId}</Text>
      <Text style={styles.heading}>Review Order</Text>
      {cartItems.length === 0 ? (
        <Text>Your cart is empty</Text>
      ) : (
        <>
        <View style={{flexDirection:"row", gap:150}}>
        <Text style={{marginLeft:10, marginBottom:5 , color:"#f6740c"}}>{(deliveryType==1)?"SHOP ADDRESS":"Delivery Address"}</Text>
       <TouchableOpacity
       onPress={()=>{
        navigation.navigate("ChangeAdd")
       }}
       >
       <Text style={{color:"red"}}> {(deliveryType!=1)?"Change Address":null}</Text>
        </TouchableOpacity>
        </View>
        
         <View style={styles.Addrs}>
         <Text style={{flex:1, fontWeight:"500", margin:10}}>{(deliveryType==1)?shopAdd:defaultAddress}</Text>
         </View>
         
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
        
          <View style={styles.bill}>

          <Text>Total Payable Amount ({items}  {(items>1)? "items" :"item" }) :</Text>
          <Text style={{ fontWeight: "500" }}>{calculateTotalPrice() + 19}</Text>
       
      </View>
      <View style={{flexDirection:"row", alignItems:"center",marginTop:10, }}>
        {
        deliveryType==1 &&
        <View style={{flexDirection:"row", alignItems:"center"}}>
        <RadioButton
          value="first"
          status={checked === 'first' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('first')}
        />
        <Text>Cash on Delivery</Text>
        </View>
        }
        {
          deliveryType==2 &&
          
            <View style={styles.container}>
      <Text style={styles.label}>Select an Option:</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedValue(value)}
        items={options}
        style={pickerSelectStyles}
        placeholder={{ label: 'Select an option...', value: null }}
        value={selectedValue}
      />
      <Text style={styles.selectedText}>Selected: {selectedValue}</Text>
    </View>
         
        }
       
      </View>
      <View style={{alignItems: 'center', padding: 10, backgroundColor: "#f6740c", margin:20}}>
        <Text style={{color:"#fff"}}>BUY NOW</Text>
        
      </View>
        
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Addrs:{
  borderWidth:1,
  height:50,
  borderColor:"grey",
  borderRadius:20,
  marginBottom:10
  },
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
    flexDirection:"row",
    gap:20
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
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    margin:10
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    marginBottom: 20,
  },
});
export default Cart;
