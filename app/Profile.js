import AsyncStorage from '@react-native-async-storage/async-storage';
import { collectManifestSchemes } from 'expo-linking';
import React, { useEffect, useState } from 'react'
import{View,Text,StyleSheet,} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/Ionicons"

const Profile = ({navigation}) => {
     const [name,setName]=useState("");
     const [number,setNumber]=useState("")

    useEffect(()=>{
   const FetchDetail=async()=>{
    try{
        const profile= await AsyncStorage.getItem("UserProfile")
        const parsed=JSON.parse(profile);
        setName(parsed.CustomerFullName)
        setNumber(parsed.CustomerMobileNumber)


    }
    catch(error){
        console.log("Some error occured",error)

    }
   }
   FetchDetail();
    },[])
  
    const handleSignOut = async () => {
        try {
            await AsyncStorage.removeItem("UserProfile");
            console.log("Profile cleared from AsyncStorage");
            navigation.navigate("Home")
        } catch (error) {
            console.error("Error clearing the profile:", error);
        }
    };
    

  return (
   <View style={styles.container}>
   <View style={styles.details}>
   <View>
    <Icon name="person-outline" size={60} color="black"  />
    </View>
    <View>
       <Text style={{fontSize:18}}>
       Hi, {name}
        </Text> 
        <Text style={{fontSize:16}}>
       {number}
      
        </Text> 
    </View>
    
   </View>
   <TouchableOpacity onPress={()=>{
    navigation.navigate("Address")
   }}>
   <View style={styles.options}>
        <Text>Manage Address</Text>
    </View>

   </TouchableOpacity>
   
    <View style={styles.options}>
        <Text>My Wallet</Text>
    </View>
    <View style={styles.options}>
        <Text>Reviews and Ratings</Text>
    </View>
    <View style={styles.options}>
        <Text>Share Store with Friends</Text>
    </View>
    



    <TouchableOpacity onPress={()=>{
        handleSignOut();
    }}>
    <View style={styles.signOut}>
        <Text style={{color:"#fff"}}>Sign Out</Text>
    </View>
    </TouchableOpacity>
   </View>

   
  )
}
const styles= StyleSheet.create({
container:{
    flex:1
},
details:{
    flexDirection:"row",
    gap:20,
    margin:30,
    alignItems:"center"
    
},


signOut:{
backgroundColor:"#f6740c",
justifyContent:"center",
alignItems:"center",
width:400,
padding:15,
marginLeft:6,
marginTop:370
},
options: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFF",
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
},


})

export default Profile
