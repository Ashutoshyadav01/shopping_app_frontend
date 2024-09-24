import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchItems = ({ navigation, route }) => {
  const { searchQuery } = route.params;
  const [filteredItems, setFilteredItems] = useState([]);
  const [itemCounts, setItemCounts] = useState({});
  const Search_URL = "https://akm0505.bsite.net/api/GetProductSearch/aas";
  const [item, setItem] = useState([]);

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

    fetch(Search_URL)
      .then((res) => res.json())
      .then((resjson) => {
        const r = resjson.Table;
        setItem(r);
      })
      .catch(error => { console.log("error caught", error) });

    loadItemCounts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const results = item.filter((item) =>
        item.ProductDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(results);
    } else {
      setFilteredItems([]);
    }
  }, [searchQuery, item]);

  const storeItemInCart = async (item, quantity) => {
    try {
      const cartItem = {
        productId: item.ProductId,
        quantity,
        name: item.ProductName,
        price: item.ProductSellingPrice,
        discount: item.discount,
        image: item.ProductThumbnail,
      };

      const existingCart = await AsyncStorage.getItem("cart");
      let cart = existingCart ? JSON.parse(existingCart) : [];

      const itemIndex = cart.findIndex(cartItem => cartItem.productId === item.ProductId);
      
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
    const quantity = itemCounts[item.ProductName] || 0;
    if (quantity > 0) {
      storeItemInCart(item, quantity);
      setItemCounts((prevCounts) => ({ ...prevCounts, [item.ProductName]: 0 }));
      alert("Item added to cart!");
    } else {
      alert("Please select at least one item.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", height: 40 }}>
        {filteredItems.length} {filteredItems.length > 1 ? "items found" : "item found"}
      </Text>

      {filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.ProductId}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { item })}>
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.ProductThumbnail }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.ProductName}</Text>
                  <Text style={styles.itemPrice}>₹{item.ProductSellingPrice}</Text>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => increaseCount(item.ProductName)}
                    >
                      <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                    <Text style={styles.itemCount}>
                      {itemCounts[item.ProductName] || 0}
                    </Text>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => decreaseCount(item.ProductName)}
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
};

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
