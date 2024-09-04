import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetailsScreen = ({ route }) => {
  const { item } = route.params; 
  const [newImg, setNewimg] = useState(item.image);
  const [itemCounts, setItemCounts] = useState({});
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const loadItemCount = async () => {
      const storedItemCounts = await AsyncStorage.getItem("itemCounts");
      if (storedItemCounts) {
        const parsedCounts = JSON.parse(storedItemCounts);
        setItemCounts(parsedCounts);
        setItemCount(parsedCounts[item.name] || 0);
      }
    };
    loadItemCount();
  }, [item.name]);

  const handleimg = (imgUri) => {
    setNewimg(imgUri);
  };

  const updateItemCount = (itemName, increment) => {
    const updatedItemCounts = {
      ...itemCounts,
      [itemName]: itemCounts[itemName] ? itemCounts[itemName] + increment : increment,
    };
    if (updatedItemCounts[itemName] < 0) {
      updatedItemCounts[itemName] = 0;
    }
    setItemCounts(updatedItemCounts);
    setItemCount(updatedItemCounts[itemName]);
    AsyncStorage.setItem("itemCounts", JSON.stringify(updatedItemCounts))
      .catch(error => console.error("Error updating item counts in storage:", error));
  };

  const storeItemInCart = async (productId, quantity) => {
    try {
      const cartItem = { productId, quantity };
      const existingCart = await AsyncStorage.getItem("cart");
      let cart = existingCart ? JSON.parse(existingCart) : [];
      const itemIndex = cart.findIndex((item) => item.productId === productId);
      if (itemIndex > -1) {
        cart[itemIndex].quantity += quantity;
      } else {
        cart.push(cartItem);
      }
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      await AsyncStorage.setItem("itemCounts", JSON.stringify(itemCounts));
      console.log("Cart updated:", cart);
    } catch (error) {
      console.error("Error storing item in cart:", error);
    }
  };

  const handleAddToCart = () => {
    if (itemCount > 0) {
      storeItemInCart(item.name, itemCount);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image source={{ uri: newImg }} style={styles.productImage} />
        <Text style={styles.productName}>{item.name}</Text>
      </View>
      <View style={styles.moreimg}>
        <TouchableOpacity onPress={() => handleimg("https://via.placeholder.com/100")}>
          <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.img1} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleimg("https://via.placeholder.com/100")}>
          <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.img1} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleimg("https://via.placeholder.com/100")}>
          <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.img1} />
        </TouchableOpacity>
      </View>
      <View style={styles.detail}>
        <View style={styles.c1}>
          <Text>₹{item.price}</Text>
          <Text style={styles.op}>₹{item.op}</Text>
          <View style={styles.bg}><Text>{item.discount}</Text></View>
        </View>
        <Icon name="share-outline" size={30} color="#000" />
      </View>
      <View style={{ marginTop: 20 }}>
        <Text>You will earn 2 points from this product</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Reviews and Rating</Text>
      </View>
      <View style={styles.starcontainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= 2 ? 'star' : 'star-outline'}
            size={30}
            color="#ffd700" // Gold color for the star
            style={styles.star}
          />
        ))}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingTop: 40 }}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => updateItemCount(item.name, 1)} style={styles.iconWrapper}>
            <Icon name="add" size={16} color="white" style={styles.iconPlusMinus} />
          </TouchableOpacity>
          <Text style={styles.itemCountText}>{itemCount}</Text>
          <TouchableOpacity onPress={() => updateItemCount(item.name, -1)} style={styles.iconWrapper}>
            <Icon name="remove" size={16} color="white" style={styles.iconPlusMinus} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.buttonText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  moreimg: {
    flexDirection: "row",
    gap: 10
  },
  img1: {
    width: 80,
    height: 80
  },
  actionButton: {
    padding: 10,
    backgroundColor: 'green',
    width: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  detail: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10
  },
  starcontainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  star: {
    marginRight: 5,
  },
  c1: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center"
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
  },
  op: {
    textDecorationLine: "line-through"
  },
  bg: {
    backgroundColor: "#ff7222",
    padding: 3
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: "green",
    padding: 6,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  itemCountText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
});

export default ProductDetailsScreen;
