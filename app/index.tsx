import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen'; 
import ProductDetailsScreen from './ProductDetailsScreen';
import CategoryItemsScreen from './CategoryItemsScreen';
import SearchItems from "./SearchItems";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Otp from "./Otp";
import SignUpPage from './SignupPage';
import Cart from './Cart';
import Coupon from "./Coupon";
import OtpSignin from './OtpSignin';
import Profile from './Profile';
import Address from './Address';
import AddressForm from './AddressForm';
import ReviewOrder from './ReviewOrder'
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CategoryItems" component={CategoryItemsScreen} />

  <Stack.Screen name="ProductDetail" component={ProductDetailsScreen} />
        <Stack.Screen name="SearchItems" component={SearchItems}/>
        <Stack.Screen name="Signup" component={SignUp}/>
        <Stack.Screen name="Signin" component={SignIn}/>
        <Stack.Screen name="Otp" component={Otp}/>
        <Stack.Screen name="SignUp" component={SignUpPage}/>
        <Stack.Screen name="Cart" component={Cart}/>
        <Stack.Screen name="Coupon" component={Coupon}/>
        <Stack.Screen name="OtpSignin" component={OtpSignin}/>
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name="Address" component={Address}/>
        <Stack.Screen name="AddressForm" component={AddressForm}/>
        <Stack.Screen name='ReviewOrder' component={ReviewOrder}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
