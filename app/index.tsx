import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen'; 
import ProductDetailsScreen from './ProductDetailsScreen';
import CategoryItemsScreen from './CategoryItemsScreen';
import SearchItems from "./SearchItems";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CategoryItems" component={CategoryItemsScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="SearchItems" component={SearchItems}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
