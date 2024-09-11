import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure you have this installed
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const items = {
  1: [
    {
      productId: "1", // Unique product ID
      name: "Kaju Katli",
      image:
        "https://img.cdnx.in/358917/sweets-1717750278332.jpeg?width=384&format=webp",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "2", // Unique product ID
      name: "Rasgulla",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "3", // Unique product ID
      name: "Gulab Jamun",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
  ],
  2: [
    {
      productId: "4", // Unique product ID
      name: "Shampoo",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "5", // Unique product ID
      name: "Soap",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "6", // Unique product ID
      name: "Pepsodent Toothpaste",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "7", // Unique product ID
      name: "Sensodyne Toothpaste",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "8", // Unique product ID
      name: "Colgate Toothbrush",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
  ],
  3: [
    {
      productId: "9", // Unique product ID
      name: "Basmati Rice",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "10", // Unique product ID
      name: "Brown Rice",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "11", // Unique product ID
      name: "Chana Dal",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "12", // Unique product ID
      name: "Wheat Flour",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "13", // Unique product ID
      name: "Atta",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
  ],
  4: [
    {
      productId: "14", // Unique product ID
      name: "Coca-Cola",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "15", // Unique product ID
      name: "Maaza",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "16", // Unique product ID
      name: "Coffee",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
  ],
  5: [
    {
      productId: "17", // Unique product ID
      name: "Lays",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "18", // Unique product ID
      name: "KurKure",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "19", // Unique product ID
      name: "Pringles",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
  ],
  6: [
    {
      productId: "20", // Unique product ID
      name: "Apples",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "21", // Unique product ID
      name: "Bananas",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
    {
      productId: "22", // Unique product ID
      name: "Tomatoes",
      image: "https://via.placeholder.com/100",
      price: "300",
      op: "400",
      discount: "20%",
    },
  ],
};



function SearchItems({ navigation, route }) {
  const { searchQuery } = route.params;
  const [filteredItems, setFilteredItems] = useState([]);
  const [itemCounts, setItemCounts] = useState({});

  useEffect(() => {
    if (searchQuery) {
      const results = [];
      Object.keys(items).forEach((categoryName) => {
        const matchingItems = items[categoryName].filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (matchingItems.length > 0) {
          results.push(...matchingItems);
        }
      });
      setFilteredItems(results);
    } else {
      setFilteredItems([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const loadItemCounts = async () => {
      try {
        const storedCounts = await AsyncStorage.getItem("itemCounts");
        if (storedCounts) {
          setItemCounts(JSON.parse(storedCounts));
        }
      } catch (error) {
        console.error("Error loading item counts:", error);
      }
    };

    loadItemCounts();
  }, []);

  const storeItemInCart = async (productId, quantity) => {
    try {
      const cartItem = { productId, quantity };
      const existingCart = await AsyncStorage.getItem("cart");
      let cart = existingCart ? JSON.parse(existingCart) : [];
      const itemIndex = cart.findIndex((item) => item.productId === productId);
      if (itemIndex > -1) {
        cart[itemIndex].quantity = quantity;
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

  const increaseCount = (itemName) => {
    setItemCounts((prevCounts) => ({
      ...prevCounts,
      [itemName]: (prevCounts[itemName] || 0) + 1,
    }));
  };

  const decreaseCount = (itemName) => {
    setItemCounts((prevCounts) => ({
      ...prevCounts,
      [itemName]: Math.max((prevCounts[itemName] || 0) - 1, 0),
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = itemCounts[item.name] || 0;
    if (quantity > 0) {
      storeItemInCart(item.productId, quantity);
      setItemCounts((prevCounts) => ({ ...prevCounts, [item.name]: 0 }));
      alert("Item added to cart!");
    } else {
      alert("Please select at least one item.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{fontWeight:"bold", height:40}}>{filteredItems.length} {filteredItems.length > 1 ? "items found" : "item found"}</Text>
      {filteredItems.length > 0 ? (
        
 <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.productId}
          renderItem={({ item }) => (
            <TouchableOpacity
            onPress={() => navigation.navigate('ProductDetail', {item})}>
  <Text>{item.name}</Text>
            
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => increaseCount(item.name)}
                  >
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                  <Text style={styles.itemCount}>{itemCounts[item.name] || 0}</Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => decreaseCount(item.name)}
                  >
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(item)}
                  >
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            </TouchableOpacity>
          )}
        />

    
       
      ) : (
        <Text>No items found.</Text>
      )}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate("Cart")}
      >
        <Icon name="cart" size={30} color="orange" />
        <Text style={styles.cartText}>Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ddd",
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemCount: {
    fontSize: 18,
    marginHorizontal: 8,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 16,
  },
  cartText: {
    fontSize: 18,
    marginLeft: 8,
    color: "#333",
  },
});

export default SearchItems;
