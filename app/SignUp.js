import React from "react";
import { View ,Text,Image,StyleSheet,Dimensions} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
function SignUp({navigation})
{
    const screen= Dimensions.get("window").width;

    return(
<View style={styles.container}>
    <Image style={styles.Img} width={screen} source={{uri:"https://img.freepik.com/free-vector/modern-online-registration-compositio_23-2147993862.jpg?t=st=1724400579~exp=1724404179~hmac=ec540d74b244c83481e9bba0b5ca910cfeb269ecbafeb66893a76d9a1a2471b2&w=740"}} />
   <TouchableOpacity onPress={()=>{
    {navigation.navigate("Signin")}
   }}>
   <Text style={styles.buttonText}>SIGN IN/SIGN UP</Text>
    </TouchableOpacity>   
   
</View>
    )
}
const styles=StyleSheet.create({
    Img:{
       
        height:500,
       
    },
    container:{
  flex:1,
  justifyContent:"center",
  alignItems:"center",
  backgroundColor:"white",
  gap:20
  
    },
    buttonText:{
        backgroundColor:"green",
        width:150,
        color:"white",
        padding:20
   
    }
})
export default SignUp;