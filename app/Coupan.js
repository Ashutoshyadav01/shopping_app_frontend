import React from 'react'
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
    COUPON_NAME: "Saturday Dhamaka",
    COUPON_CODE: "SAT0101",
    DISCOUNT_TYPE: "PERCENT",
    DISCOUNT_VALUE: 2,
    MINIMUM_SUBTOTAL: 500
  },
 
  ]
  
  
const Coupon = () => {
  const [Content,setContent]=useState("");
  const matchedCoupon = discountList.find(
    (coupon) => coupon.COUPON_CODE.toLowerCase() === Content.toLowerCase()
  );
  
  return (
   <View>
    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
      <TextInput
      placeholder="Enter your Coupon Code"
      style={{borderWidth:1,padding:10,width:300}}
      value={Content}
      onChangeText={setContent}
      
      />
      <TouchableOpacity style={{backgroundColor:"green",flex:1, justifyContent:"center",alignItems:"center", }}>
      <Text style={{color:"white",fontWeight:"600"}}>
        Apply
      </Text>

      </TouchableOpacity>
   
    </View>
    
    <View><Text> {(matchedCoupon)?`Discount name: ${matchedCoupon.COUPON_NAME},Discount type: ${matchedCoupon.DISCOUNT_TYPE},Discount value: ${matchedCoupon.DISCOUNT_VALUE}` :"Enter right Coupan"}</Text></View>
     <FlatList
     data={discountList}
     keyExtractor={(item)=>item.COUPON_CODE}
     renderItem={({item})=>(
      <Text>{item.COUPON_NAME}</Text>
  )}
    
     />
   </View>
  )
}

export default Coupon

