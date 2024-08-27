import React from 'react';
import { View, Text, Image,Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';


const ProductDetailsScreen = ({ route }) => {
  const { item } = route.params; 
  const [searchQuery, setSearchQuery] = useState('');
  const [newImg, setNewimg]= useState(item.image);

  const handleSearch = () => {
    navigation.navigate('CategoryItems', { searchQuery });
  };
  function handleimg(x)
  {
    setNewimg(x)
  }

  return (
    <View style={styles.container}>
  
      
     
      <View style={{justifyContent:"center",alignItems:"center"}}>
      <Image source={{ uri: newImg }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      </View>
      <View style={styles.moreimg}>
        <TouchableOpacity onPress={()=>handleimg("https://via.placeholder.com/100")}>
        <Image source={{uri:"https://via.placeholder.com/100"}} style={styles.img1}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>handleimg("https://via.placeholder.com/100")}>
        <Image source={{uri:"https://via.placeholder.com/100"}} style={styles.img1}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>handleimg("https://via.placeholder.com/100")}>
        <Image source={{uri:"https://via.placeholder.com/100"}} style={styles.img1}></Image>
        </TouchableOpacity>
     
     
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

  <View style={styles.container2}>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buttonText}>Buy</Text>
      </TouchableOpacity>
    </View>
     

 </View>
  
     
    </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    
  },
  moreimg:{
  flexDirection:"row",
  gap:10
  },
  container2:{
 flexDirection:"row",
  justifyContent:"space-between",
  gap:70
  },
  img1:{
 width:80,
 height:80
  },
  addButton: {
    padding: 10,
    backgroundColor: 'green',
    width: 100,
    alignItems: 'center',
    marginBottom: 10,
  },
  buyButton: {
    padding: 10,
    backgroundColor: 'green',
    width: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
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
