import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";

function SignIn({navigation}) {
  const screen = Dimensions.get("window").width;
  const [input,setInput]= useState("")
 function randomNum()
 {
  const min=1000;
  const max=9999;
const x= Math.floor(Math.random()*(max-min+1))+min;
return x;
 }

 const isButtonDisabled=input.length!==10
  return (
    <View style={styles.container}>
      <View style={[styles.form, { width: screen }]}>
        <TextInput
          style={styles.input}  
          placeholder="Enter Your 10 Digit Mobile Number"
          keyboardType="numeric"
          maxLength={10}
          value={input}
          onChangeText={setInput}
        />
      
        <TouchableOpacity 
       
        style={[styles.button,isButtonDisabled && styles.disablebtn] }
        disabled={isButtonDisabled}
        onPress={()=>{
          const otp=randomNum();
          navigation.navigate("Otp",{otp,input})
        }}
        >
          <Text style={styles.buttonText}>Request OTP</Text>
        </TouchableOpacity>
        <Text>{input}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  disablebtn:{
 backgroundColor:"grey"
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
   
  },
  form: {
    backgroundColor: "white",
    height: 400,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 50, 
    paddingHorizontal: 10, 
    borderColor: 'gray',
    borderWidth: 1,
    width: '90%',  
    marginBottom: 20,  
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignIn;
