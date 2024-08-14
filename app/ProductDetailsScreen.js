import React from 'react';
import { View, Text, Image,Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-screens';

const ProductDetailsScreen = ({ route }) => {
  const { item } = route.params; 
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    navigation.navigate('CategoryItems', { searchQuery });
  };


  return (
    <View style={styles.container}>
  
      
     
      <View style={{justifyContent:"center",margin:"auto"}}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
     

      </View>
      <View style={styles.detail}> 
        <View style={styles.c1}>
        <Text >₹{item.price}</Text>
        <Text style={styles.op}>₹{item.op}</Text>
         <View style={styles.bg}><Text>{item.discount}</Text></View>
        </View>
        <View>

        <Icon name="share-outline" size={30} color="#000" />
        </View>
      
      
      
      </View>
      <View style={{marginTop:20}}>
        <Text>You will earn 2 points from this product</Text>
      </View>
      <View  style={{marginTop:20}}>
        <Text style={{fontSize:20,fontWeight:"bold"}}>Reviews and Rating</Text>
      </View>
      <View style={styles.starcontainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name={star <= 2? 'star' : 'star-outline'}
          size={30}
          color="#ffd700" // Gold color for the star
          style={styles.star}
        />
      ))}
    </View >
 <View style={{flexDirection:"row",justifyContent:"space-evenly", paddingTop:40}}>
 <Button title='Add' color="green"></Button>
    <Button title='Buy' color="green"></Button>
     

 </View>
  
     
    </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    
  },
  detail:{
    flexDirection:"row",
    justifyContent:"space-between",
    paddingTop:10

  },
  starcontainer: {
    flexDirection: 'row',
    marginTop:10
  },
  star: {
    marginRight: 5,
  },
  c1:{
  flexDirection:"row",
  gap:7,
  alignItems:"center"
  },
  productImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
   
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    margin:"auto"
   
  },
  op:{
 textDecorationLine:"line-through"
  },
  bg:{
  backgroundColor:"#ff7222",
  padding:3
  },
  productDetails: {
    fontSize: 16,
    color: '#555',
    justifyContent:"center"
  },
   
});

export default ProductDetailsScreen;
