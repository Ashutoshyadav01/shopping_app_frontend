import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from "@react-navigation/native";
const Address = ({navigation}) => {
  const [name, setname] = useState("");
  const [number, setNumber] = useState("");
  const getName=async()=>{
    const localStorage = await AsyncStorage.getItem("UserProfile");
    if(localStorage)
    {
      const parsedData=JSON.parse(localStorage)
      setname(parsedData.CustomerFullName);
      setNumber(parsedData.CustomerMobileNumber);
    }

  }

 const [allAddress,setAllAddress]=useState([]);

 async function RefreshAddressList()
 {
   const profile= await AsyncStorage.getItem("UserProfile")
   const parsed=JSON.parse(profile);
   const loginId=parsed.CustomerMobileNumber;
   const response = await fetch("https://akm0505.bsite.net/api/GetCustomerLoginDetail", {
     method: "POST",
     body: JSON.stringify({
       "CUSTOMER_LOGIN_ID": loginId,
       "CUSTOMER_PASSWORD": "sample string 9",
       "CUSTOMER_ROLE_ID": 0,
       "SHOP_ID": 1,
       "OAUTH_TOKEN": "sample string 5"
     }),
     headers: {
       "Content-type": "application/json; charset=UTF-8",
     },
   });
   
   const json = await response.json();

   if (json.Table[0].RESPONSE_TYPE === "SUCCESS") {
     const addressList= json.Table2;
     console.log("Refreshed Address",addressList);
    setAllAddress(addressList);
     try {
     
       await AsyncStorage.setItem("AddressList",JSON.stringify(addressList));
      
     } catch (error) {
       console.log("Error in fetching address detail", error);
     }

   
   
   } 
 
} 

//alert("testing 456")
useFocusEffect(
  React.useCallback(() => {
   //alert("testing 789");
    const AddressList= async()=>{
      const addresses= await AsyncStorage.getItem("AddressList");
      //alert("testing 123");
     jsonAddress= JSON.parse(addresses);
   console.log("update addresses",  jsonAddress);
   setAllAddress(jsonAddress);

   
  }
  AddressList();
  }, [])
);
useEffect(() => {
  async function defaultAdd() {
    const defaultAddress = allAddress.filter((item) => item.IsDefault);
    console.log("default", defaultAddress);

    // Check if a default address exists
    if (defaultAddress.length > 0) {
      const defaultAddressLine1 = defaultAddress[0].Address;
      const defaultAddressLine2 = defaultAddress[0].City;
      const defaultAddressLine3 = defaultAddress[0].State;

      const addressObject = {
        Address: defaultAddressLine1,
        City: defaultAddressLine2,
        State: defaultAddressLine3
      };

      await AsyncStorage.setItem("defaultAddress", JSON.stringify(addressObject));
      
      const x = await AsyncStorage.getItem("defaultAddress");
      const parsed = JSON.parse(x);


      console.log("parsed item", parsed); 
      console.log("parsed address", parsed.Address); 
    } else {
      console.log("No default address found.");
    }
  }
  defaultAdd();
}, [allAddress]);


 if(allAddress.length!=0)
 {
  return (
    <View style={{flex: 1, backgroundColor:"#fff"}}>
      {console.log("123")}
   
 
      <FlatList
        data={allAddress}
        keyExtractor={(item) => item.AddressId}
        renderItem={({item})=>(
          <View style={styles.flatlist}>
            <Text style={{fontSize:15, fontWeight:"600"}}>{item.CustomerName}</Text>
            <Text style={{fontSize:12, fontWeight:"300",marginTop:10}}>{item.CustomerPhoneNumber}</Text>
            <Text>{item.Address}, {item.City}, {item.State}-{item.PinCode}</Text>
            <Text>{(item.IsDefault==true)?"default address":"not a default address"}</Text>
           <View style={{flexDirection:"row",gap:80,marginTop:10}}>


           <TouchableOpacity onPress={()=>{
            navigation.navigate("AddressForm",{
              id:item.AddressId,
              p_name:item.CustomerName,
              phone_no:item.CustomerPhoneNumber,
              addrs:item.Address,
              p_city:item.City,
              pin:item.PinCode,
              p_state:item.State,
              p_default:item.IsDefault
            })
           }}>
              <View style={styles.editBtn}>
                <Icon name="pencil" size={19} color="#000" style={styles.icon} />
                <Text>Edit</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
             //  main.js
 
// POST request using fetch()
fetch("https://akm0505.bsite.net/api/CustomerAddressDelete", {
    
  // Adding method type
  method: "POST",
  
  // Adding body or contents to send
  body: JSON.stringify({
     "ADDRESS_ID": item.AddressId,
  "ACTION_TYPE": "DELETE",
  "CUSTOMER_NAME":item.CustomerName,
  "CUSTOMER_PHONE": item.CustomerPhoneNumber,
  "CUSTOMER_ID": item.CustomerID,
  "CUSTOMER_ADDRESS": item.Address,
  "CUSTOMER_CITY": item.City,
  "CUSTOMER_STATE": item.State,
  "CUSTOMER_PINCODE": item.PinCode,
  "IS_DEFAULT": true
  }),
  
  // Adding headers to the request
  headers: {
      "Content-type": "application/json; charset=UTF-8"
  }
})

// Converting to JSON
.then(response => response.json())

// Displaying results to console
.then((json) => {
  console.log("DELETED VALUE", json);
  if (json.RESPONSE_TYPE == "SUCCESS") {
    RefreshAddressList();
    // navigation.navigate("Home");
  }
  alert(json.RESPONSE_MESSAGE);
})
.catch((error) => {
  console.log(error);
});
console.log("calling end");
}


            }>
              <View style={styles.editBtn}>
                <Icon name="trash" size={19} color="red" style={styles.icon} />
                <Text>Delete</Text>
              </View>
            </TouchableOpacity>

           </View>
           
          </View>
        )}
       
      />
      <TouchableOpacity onPress={()=>{
      navigation.navigate("AddressForm",{
              id:-1,
              p_name:name,
              phone_no:number,
              addrs:"",
              p_city:"",
              pin:"",
              p_state:"",
              p_default:true
            })
          
      }}>
      <View style={{alignItems: 'center', padding: 10, backgroundColor: "#f6740c", margin:20}}>
        <Text style={{color:"#fff"}}>Add Address</Text>
        
      </View>

      </TouchableOpacity>
      
    </View>
  );
}
    
 else{
  return(
    <View style={styles.container}>
          <Image style={styles.itemImage} source={require("./address.png")} />
        <Text style={{fontWeight:"600",marginTop:10}}>You haven't Added any Address Yet</Text>
        <Text style={{marginTop:10}}>Add address for superior shopping experience</Text>
        <TouchableOpacity onPress={()=>{
           navigation.navigate("AddressForm")
        }}>
            <View style={styles.btn}>
            <Text style={{color:"#fff", fontWeight:'600'}}>Add Address</Text>
            </View>
       
        </TouchableOpacity>
        </View>
      );
  
  
}}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:"center",
    backgroundColor:"#fff"
  },
  itemImage: {
    width: 200,
    height: 200,
    marginRight: 15,
    borderRadius: 10,
    resizeMode: 'contain', 
    marginTop:200
},
btn:{
   backgroundColor:"#f6740c",
   padding:15,
   width:200,
   borderRadius:15,
   marginTop:20,
   justifyContent:"center",
   alignItems:"center",
  
},
editBtn:{
flexDirection:"row",
borderWidth:1,
borderColor: 'grey', // Light gray color for the border
borderRadius: 5, 
alignItems:"center",

margin:10,
padding:10,
width:120,
justifyContent:"space-around"
},
flatlist:{
  borderWidth:1,
  margin:10,
  padding:10,
  borderColor: '#d3d3d3', // Light gray color for the border
    borderRadius: 5, 
},
icon: {
  marginLeft: 10,
  borderRadius:5,
  width:20
}


});
export default Address;
