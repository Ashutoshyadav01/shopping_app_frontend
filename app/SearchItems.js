import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const items = {
  1:[
   {
     product_id:1,
     name: "Kaju Katli",
     image:
       "https://img.cdnx.in/358917/sweets-1717750278332.jpeg?width=384&format=webp",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "Rasgulla",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "Gulab Jamun",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
 ],
 2: [
   {
     name: "Shampoo",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "Soap",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "Pepsodent Toothpaste",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "Sensodyne Toothpaste",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "Colgate Toothbrush",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
 ],
 3: [
   {
     name: "Basmati Rice",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "Brown Rice",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "Chana Dal",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "Wheat Flour",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "Atta",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
 ],
 4: [
   {
     name: "Coca-Cola",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "Maaza",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   { name: "Coffee", 
     image: "https://via.placeholder.com/100" ,
     price: "300",
     op: "400",
     discount: "20%",
   }
 ],
 5: [
   {
     name: "Lays",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "KurKure",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "Pringles",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
 ],
 6: [
   {
     name: "Apples",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "Bananas",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
   {
     name: "Tomatoes",
     image: "https://via.placeholder.com/100",
     price: "300",
     op: "400",
     discount: "20%",
   },
 ],
};

function SearchItems({ navigation, route }) {
  const { searchQuery, existingItemCounts } = route.params;
  const [filteredItems, setFilteredItems] = useState([]);
  const [itemCounts, setItemCounts] = useState(existingItemCounts || {});
  const [count, setCount] = useState(0);

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
      setCount(results.length);
    }
  }, [searchQuery]);

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
      console.log("Cart updated:", cart);
    } catch (error) {
      console.error("Error storing item in cart:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resultText}>
        {count} {count > 1 ? "items found" : "item found"}
      </Text>
      {count > 0 ? (
        <FlatList
          data={filteredItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const itemCount = itemCounts[item.name] || 0;
            return (
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.text}>
                  <Text style={styles.itemText1}>{item.name}</Text>
                  <Text style={styles.itemText2}>Price: ₹{item.price}</Text>
                  <Text style={styles.itemText3}>{item.discount}</Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      const updatedItemCounts = {
                        ...itemCounts,
                        [item.name]: itemCount + 1,
                      };
                      setItemCounts(updatedItemCounts);
                    }}
                    style={styles.iconWrapper}
                  >
                    <Icon
                      name="plus"
                      size={16}
                      color="white"
                      style={styles.iconPlusMinus}
                    />
                  </TouchableOpacity>
                  <Text style={styles.itemCountText}>{itemCount}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const updatedItemCounts = {
                        ...itemCounts,
                        [item.name]: itemCount > 0 ? itemCount - 1 : 0,
                      };
                      setItemCounts(updatedItemCounts);
                    }}
                    style={styles.iconWrapper}
                  >
                    <Icon
                      name="minus"
                      size={16}
                      color="white"
                      style={styles.iconPlusMinus}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (itemCount > 0) {
                        storeItemInCart(item.name, itemCount);
                      }
                    }}
                   
                  >
                    <Icon
                      name="shopping-cart"
                      size={20}
                      color="green"  // Changed to black for better visibility
                      style={styles.iconCart}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      ) : (
        <Text style={styles.noResultsText}>No items found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  text: {
    flex: 1,
    marginLeft: 15,
  },
  itemText1: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemText2: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  itemText3: {
    fontSize: 14,
    color: "green",
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
  iconPlusMinus: {
    padding: 6,
    borderRadius: 5,
  },
  iconCart: {
    marginLeft: 10,
    backgroundColor:"white"
  },
  itemCountText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  noResultsText: {
    marginTop: 20,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});

export default SearchItems;