import React from 'react'
import { View, Text, FlatList, StyleSheet, Image,TextInput, TouchableOpacity } from "react-native";

const Coupon = () => {
  return (
   <View>
    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
      <TextInput
      placeholder="Enter you Code"
      style={{borderWidth:1,padding:10,width:300}}
      
      />
      <TouchableOpacity style={{backgroundColor:"green",flex:1, justifyContent:"center",alignItems:"center", }}>
      <Text style={{color:"white",fontWeight:"600"}}>
        Apply
      </Text>

      </TouchableOpacity>
     
    </View>
   </View>
  )
}

export default Coupon

