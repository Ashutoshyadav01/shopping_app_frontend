import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';
import { RadioButton } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import{getBaseApiUrl,SaveOrderHistory,isDevelopmentMode} from './CommonFunctions';



const Cart = ({ navigation ,route}) => {
  const {deliveryType,addressId}= route.params;


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
  const [paymentModes, setPaymentModes] = useState([]); // State to store payment modes
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(1); // State to store the selected payment mode
  const [userProfile,setUserProfile]=useState({});
  const [DeliveryAddressId, setDeliveryAddressId]=useState("");
  const [deliveryCharge,setDeliveryCharge]=useState("")
  const [error, setError] = useState('');

  useEffect(() => {
    // Function to fetch the payment modes from the API
    const fetchPaymentModes = async () => {
     
     try {
      const x=await AsyncStorage.getItem("initialSetup");
      if(x)
      {
        const parsed= JSON.parse(x);
        
       setDeliveryCharge(parsed.Table[0].DelieveryCharge);
      }
        const response = await fetch(getBaseApiUrl()+"/api/GetInitialSetup/1");
        const data = await response.json();

        // Assuming that Table1 contains payment modes
        let modes = data.Table1.map(item => ({
          label: item.MODE_OF_PAYMENT,
          value: item.MODE_OF_PAYMENT_ID
        }));
        
      
        // if (deliveryType == 1) {
        //   // Reassign modes to a single object in the same structure
        //   modes = {
        //     label: data.Table1[0].MODE_OF_PAYMENT,
            
        //     value: data.Table1[0].MODE_OF_PAYMENT_ID
        //   };
        // }
   
    

        setPaymentModes(modes); // Update state with payment modes
      } catch (error) {
        console.error("Error fetching payment modes:", error);
      }
    };
    async function getCustomerId()
    {
      const x= await AsyncStorage.getItem("UserProfile");
      if(x)
      {
        const parsed= JSON.parse(x)
        {
         setUserProfile(parsed)
     
        }
      }
    }
 getCustomerId();
    fetchPaymentModes(); // Call the function to fetch payment modes
  }, []);
  
  useFocusEffect(
    React.useCallback(() => {
    
      const fetchAddresses = async () => {
        const x = await AsyncStorage.getItem("AddressList");
        if (x) {
          const parsed = JSON.parse(x);
          setAllAddress(parsed);
         
        
          console.log(addressId)

          if(addressId)
            {
             setDeliveryAddressId(addressId);
            }
            else{
              setDeliveryAddressId(parsed[0].AddressId)
            }
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

          console.log("default address",parsed)
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
  
useEffect(()=>{

},[])



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
    console.log(userProfile.CustomerFullName)

  // setDeliveryAddressId(addId[0].AddressId)
  getInitialSetup();
    loadCartItems();
  }, []);

  useEffect(()=>{
    console.log("here are the payment modes",paymentModes)
  },[paymentModes])


  

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
function BuyNow()
{
  const sub_total=calculateTotalPrice();
  const total_payble=calculateTotalPrice()+19;
  console.log("total payble",total_payble)
  console.log(sub_total);
console.log(cartItems.length)
const arrProducts=[]
cartItems.map((item)=>{
  console.log(item)
var product={
    "PRODUCT_ID": item.productId,
    "QUANTITY_UNIT_ID": item.quantityUnitId,
    "QUANTITY": item.quantity 
}
arrProducts.push(product)
})
console.log(arrProducts)
//  main.js
 
// POST request using fetch()
fetch(getBaseApiUrl()+"/api/SaveOrder", {
    
  // Adding method type
  method: "POST",
  
  // Adding body or contents to send
  body: JSON.stringify({
    "CUSTOMER_ID": userProfile.CustomerID,
    "ProductDetails":arrProducts,
    "ADDRESS_ID":(deliveryType==1)?-1:DeliveryAddressId,
    "APPLY_COUPON_CODE": "sample string 2",
    "SUB_TOTAL": sub_total,
    "TAX": 4.0,
    "DELIVERY_CHARGE": deliveryCharge,
    "TOTAL_PAYABLE": total_payble,
    "EARNED_POINT": 0,
    "DELIVERY_TYPE": (deliveryType==1)?1:2,
    "MODE_OF_PAYMENT": selectedPaymentMode,
    "DELIVERY_DATE_TIME": "2024-10-03T14:23:04.854399-04:00"
  }),
  
  // Adding headers to the request
  headers: {
      "Content-type": "application/json; charset=UTF-8"
  }
})

// Converting to JSON
.then(response =>response.json())

.then((response) => { 
  console.log("here is the whole response",response)
  if (response.Table[0].RESPONSE_TYPE == "SUCCESS") {
    SaveOrderHistory(JSON.stringify(response.Table1),JSON.stringify(response.Table2));
    alert(response.Table[0].RESPONSE_MESSAGE);
    AsyncStorage.removeItem("cart")
    AsyncStorage.removeItem("itemCounts")
    navigation.navigate("OrderHistory")
  }
  
})
.catch((error) => {
  console.log(error);
});

}

  


  const validate = () => {
    if (!selectedPaymentMode) {
      setError('Please select a payment mode');
    } else {
      setError('');
      BuyNow();
    }
  };


  return (
    <View style={styles.container}>
    
      
     
    
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
                 
                    <Text style={styles.quantityText}>quantity: {item.quantity}</Text>
                
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
     
          
          <View style={styles.container}>
      <Text style={styles.label}>Select Payment Mode:</Text>
      <FlatList
   data={paymentModes}
   keyExtractor={(item) => item.value}
   numColumns={2} 
   renderItem={({item}) => (

    <TouchableOpacity onPress={() => setSelectedPaymentMode(item.value)}>
    <View style={{ flex: 1, flexDirection: "row", width: "100%" }}>
      <Text
        style={{
          width: 150,
          marginLeft: 5,
          marginBottom: 20,
          padding: 6,
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: selectedPaymentMode === item.value ? "green" : "white", // Set background color conditionally
          color:selectedPaymentMode==item.value?"white":"black",
          borderRadius:10
        }}
      >
        {item.label}
      </Text>
    </View>
  </TouchableOpacity>
  
    
   )}
/>

      {/* <RNPickerSelect
        onValueChange={(value) => setSelectedPaymentMode(value)}
        items={paymentModes}
        style={pickerSelectStyles}
        placeholder={{ label: 'Select a payment mode...', value: null }}
        value={selectedPaymentMode}
      /> */}
      
      {selectedPaymentMode && isDevelopmentMode() && <Text>Selected Payment Mode ID: {selectedPaymentMode}</Text>}
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
    </View>
         
        
       
      </View>
        
<TouchableOpacity onPress={()=>validate()}>
      <View style={{alignItems: 'center', padding: 10, backgroundColor: "#f6740c", margin:20}}>
        <Text style={{color:"#fff"}}>BUY NOW</Text>
      </View>
</TouchableOpacity>
      
        
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
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
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
    fontWeight:"600"
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
