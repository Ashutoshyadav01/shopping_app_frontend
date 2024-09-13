import React, { useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, Image,TextInput, TouchableOpacity } from "react-native";
import { useState } from 'react';
discountList = [
  {
    COUPON_NAME: "Diwali Offer",
    COUPON_CODE: "DIW001XY",
    DISCOUNT_TYPE: "INR",
    DISCOUNT_VALUE: 200,
    MINIMUM_SUBTOTAL: 1000
  },
  {
    COUPON_NAME: " Big Billion Day",
    COUPON_CODE: "SAT0101",
    DISCOUNT_TYPE: "PERCENT",
    DISCOUNT_VALUE: 2,
    MINIMUM_SUBTOTAL: 500
  },
 
  ]
  
  
const Coupon = ({route}) => {
  let {totalPrice}=route.params;
  const [Content,setContent]=useState("");
  const [applied,setApplied]=useState(false)
  const [tot,setTot]=useState(totalPrice)
  const matchedCoupon = discountList.find(
    (coupon) => coupon.COUPON_CODE.toLowerCase() === Content.toLowerCase()
  );
function applycoupon()
{
  if(totalPrice>matchedCoupon.MINIMUM_SUBTOTAL)
  {
if(matchedCoupon)
{
  setApplied(true);
 
  setTot(totalPrice-matchedCoupon.DISCOUNT_VALUE);
}
  }
  else{
    alert("Total Price should be more than: "+matchedCoupon.MINIMUM_SUBTOTAL)
  }

}
  return (
   <View>
    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
      <TextInput
      placeholder="Enter your Coupon Code"
      style={{borderWidth:1,padding:10,width:300}}
      value={Content}
      onChangeText={setContent}
      
      />
      <TouchableOpacity style={{backgroundColor:"green",flex:1, justifyContent:"center",alignItems:"center" }}
      onPress={applycoupon}
      >
      <Text style={{color:"white",fontWeight:"600"}}>
        Apply
      </Text>

      </TouchableOpacity>
   
    </View>
    <View style={{borderWidth:1,margin:20}}>
    <View style={{flexDirection:"row",justifyContent:"space-around",margin:20,borderBottomWidth:1}}>
      <Text>Sub-total</Text>
      <Text>Price: ₹{totalPrice}</Text>
   </View>
   <View style={{flexDirection:"row",justifyContent:"space-around",width:300,alignItems:"center",margin:20,borderBottomWidth:1}}>
    <Text>
    Coupon Code Status:
      </Text>
<Text>{applied?"Applied":"not Applied"}</Text>
   </View>
   <View style={{flexDirection:"row",justifyContent:"space-around",width:300,alignItems:"center",margin:20,borderBottomWidth:1}} >
    <Text>On discount:</Text>
    <Text> ₹{tot}</Text>
   </View>

      
    </View>

   </View>
  )
}

export default Coupon

