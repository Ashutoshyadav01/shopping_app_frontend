import {View,StyleSheet,Text, TouchableOpacity} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";
function SignUpPage({navigation})
{ const [input,setinput]= useState("")
    function randomNum()
    {
     const min=1000;
     const max=9999;
   const x= Math.floor(Math.random()*(max-min+1))+min;
   return x;
    }
    const isButtonDisabled=input.length!==10

    return(
        <View style={styles.container}>
       
        <View style={styles.form}>
            <TextInput
            style={styles.input}
            placeholder="Enter Your Full Name"
            />
              <TextInput
            style={styles.input}
            placeholder="Enter your Phone number"
            value={input}
            maxLength={10}
            keyboardType="numeric"
            onChangeText={setinput}
            />
            <TouchableOpacity onPress={()=>{
                const otp=randomNum();
                navigation.navigate("Otp", {otp,input})
               
            }}
            
            disabled={isButtonDisabled}
            >
                <Text style={[styles.btn,isButtonDisabled && styles.disablebtn]}
               
                >
                    
                    REQUEST OTP
                    </Text>
                </TouchableOpacity>
            <Text>Already have an account?</Text><TouchableOpacity onPress={()=>{
                navigation.navigate("Signin",{input})
            }}><Text style={styles.si}> Sign In </Text></TouchableOpacity>
        </View>
        </View>
   
    )
}
const styles= StyleSheet.create({
container:{
    flex:1,
    justifyContent:"center"
  
},
input:{
    height: 50, 
    paddingHorizontal: 10, 
    borderColor: 'gray',
    borderWidth: 1,
    width: '90%',  
    marginBottom: 20,  
},
disablebtn:{
backgroundColor:"grey"
},
btn:{
backgroundColor:"blue",
color:"white",
padding:20
},
si:{
    color:"blue"
}
,
form:{
    justifyContent:"center",
    alignItems:"center"
}
})
export default SignUpPage;