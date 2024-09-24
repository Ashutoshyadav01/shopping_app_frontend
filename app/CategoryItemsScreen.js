import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_PRODUCT_LIST = "https://akm0505.bsite.net/api/GetProductList/";

const CategoryItemsScreen = ({ route, navigation }) => {
  const { searchQuery, category } = route.params;
  const [filteredItems, setFilteredItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [itemCounts, setItemCounts] = useState({});
  const [Count, setCount] = useState(0);
  const [sub_cat, setSub_cat] = useState([]);

  // Initializing items and AsyncStorage data on component mount
  useEffect(() => {
    if (category) {
      fetch(API_PRODUCT_LIST + category.CategoryId)
        .then((item) => item.json())
        .then((res) => {
          console.log("Full API response:", res);
          console.log("Product list", res.Table);
          console.log("Category details", res.Table1);
          setFilteredItems(res.Table);
          setAllItems(res.Table);
          setCount(res.Table.length);
          if (res.Table1) {
            console.log("Category details found:", res.Table1);
            setSub_cat(res.Table1);
          } else {
            console.log("No category details found.");
          }
        });
    }

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
  }, [category]);

  // Handling filter by subcategory name
  function handleFilter(id) {
    const filtered = allItems.filter((item)=>item.SubCategoryId===id);
    setFilteredItems(filtered);
    setCount(filtered.length);
  }

  function showAllItems() {
    setFilteredItems(allItems);
    setCount(allItems.length);
  }

  // Storing items in cart
  const storeItemInCart = async (productId, quantity, itemDetails) => {
    if (quantity <= 0) {
      console.warn("Cannot add items with zero quantity to the cart.");
      return;
    }
    try {
      const cartItem = { productId, quantity, ...itemDetails };
      const existingCart = await AsyncStorage.getItem("cart");
      let cart = existingCart ? JSON.parse(existingCart) : [];

      const itemIndex = cart.findIndex((item) => item.productId === productId);
      if (itemIndex > -1) {
        cart[itemIndex] = { ...cart[itemIndex], quantity, ...itemDetails };
      } else {
        cart.push(cartItem);
      }

      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      console.log("Cart updated:", cart);
    } catch (error) {
      console.error("Error storing item in cart:", error);
    }
  };

  // Function to update item count and store it in AsyncStorage
  const updateItemCount = async (itemName, newCount) => {
    const updatedCounts = { ...itemCounts, [itemName]: newCount };
    setItemCounts(updatedCounts);

    try {
      await AsyncStorage.setItem("itemCounts", JSON.stringify(updatedCounts));
    } catch (error) {
      console.error("Error storing item counts:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category.name}</Text>

      <FlatList
  data={[{ id: "0", name: "All" }, ...sub_cat]}
  horizontal={true}
  style={styles.buttons}
  contentContainerStyle={{ paddingHorizontal: 10 }} // Add padding if needed
  showsHorizontalScrollIndicator={false} // To hide the scrollbar for better UI
  keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.subcategoryButton}
      onPress={() =>
        item.id === "0" ? showAllItems() : handleFilter(item.SubCategoryId)
      }
    >
      <Text style={styles.subcategoryButtonText}>
        {item.name || item.CategoryName}
      </Text>
    </TouchableOpacity>
  )}
/>

      <Text style={{marginLeft:15,fontWeight:"bold"}}>
        {Count} {Count > 1 ? "Items in the list" : "Item in the list "}
      </Text>

      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => index.toString()} // Fixed toString issue
        contentContainerStyle={styles.itemList}
        renderItem={({ item }) => {
          const itemCount = itemCounts[item.ProductName] || 0;

          return (
            <TouchableOpacity
              onPress={() => navigation.navigate("ProductDetail", { item })}
            >
              <View style={styles.itemContainer}>
                <Image
                  source={{ uri: item.ProductThumbnail }}
                  style={styles.itemImage}
                />
                <View style={styles.text}>
                  <Text style={styles.itemText1}>{item.ProductName}</Text>
                  <Text style={styles.itemText2}>
                    Price: ₹{item.ProductSellingPrice}
                  </Text>
                  <Text style={styles.itemText3}>{item.discount}</Text>
                </View>
                <View style={styles.item3}>
                  <TouchableOpacity
                    onPress={() => {
                      const newCount = itemCount + 1;
                      updateItemCount(item.ProductName, newCount);
                    }}
                  >
                    <Icon
                      name="plus"
                      size={20}
                      color="white"
                      style={styles.iconPlusMinus}
                    />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20 }}>{itemCount}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const newCount = itemCount > 0 ? itemCount - 1 : 0;
                      updateItemCount(item.ProductName, newCount);
                    }}
                  >
                    <Icon
                      name="minus"
                      size={20}
                      color="white"
                      style={styles.iconPlusMinus}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (item.productId) {
                        storeItemInCart(item.productId, itemCount, {
                          name: item.ProductName,
                          price: item.ProductSellingPrice,
                          discount: item.discount,
                          image: item.ProductThumbnail,
                        });
                      } else {
                        console.warn("Invalid productId, cannot add to cart.");
                      }
                    }}
                  >
                    <Icon
                      name="shopping-cart"
                      size={24}
                      color="green"
                      style={styles.iconCart}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

// Style definitions
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttons: {
    marginBottom: 10,
    display: "flex",
    height:40
  },
  itemList: {
    paddingTop: 0,
    marginTop:10
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  text: {
    justifyContent: "center",
    flex: 1,
  },
  itemText1: {
    fontWeight: "bold",
  },
  itemText2: {
    flexShrink: 1,
  },
  itemText3: {
    color: "green",
  },
  item3: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconPlusMinus: {
    backgroundColor: "green",
    padding: 7,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  iconCart: {
    marginLeft: 10,
    marginRight:20
  },
  subcategoryButton: {
    flex:1,
    paddingTop:0,
    marginRight: 10,           // Separate buttons horizontally
  paddingVertical: 2,        // Adjust padding to give space for text height
  paddingHorizontal: 12,     // Horizontal padding for more space for text
  borderRadius: 8,
  backgroundColor: 'grey',
  minWidth: 20,              // Ensures the button has a minimum width
  justifyContent: 'center',  // Centers the text vertically
  alignItems: 'center',  
  height:30,    
  marginBottom:12
  },

  
  subcategoryButtonText: {
    color: 'white',
  fontSize: 16,
  textAlign: 'center', 
  },
});

export default CategoryItemsScreen;
