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

const subcategory = [
  // Your existing subcategory data
  { id: "7", parent_category_id: 3, name: "Dal", image: "image URL" },
  { id: "8", parent_category_id: 3, name: "Rice", image: "image URL" },
  { id: "9", parent_category_id: 3, name: "Atta", image: "image URL" },
  { id: "10", parent_category_id: 1, name: "Rasgulla", image: "image URL" },
  {
    id: "11",
    parent_category_id: 2,
    name: "Bath Soap & Shower Gel",
    image: "image URL",
  },
  { id: "12", parent_category_id: 2, name: "Toothpaste", image: "image URL" },
  { id: "13", parent_category_id: 4, name: "Soft Drink", image: "image URL" },
]
const CategoryItemsScreen = ({ route, navigation }) => {
  const { searchQuery, category } = route.params;
  const [filteredItems, setFilteredItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [itemCounts, setItemCounts] = useState({});
  const [Count, setCount] = useState(0);

  // Initializing items and AsyncStorage data on component mount
  useEffect(() => {
    if (category) {
      const categoryItems = items[category.id] || [];
      setFilteredItems(categoryItems);
      setAllItems(categoryItems);
      setCount(categoryItems.length);
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

  // Filtering based on subcategory
  const sub_cat = subcategory.filter(
    (item) => item.parent_category_id == category.id
  );

  // Handling filter by subcategory name
  function handleFilter(name) {
    const filtered = allItems.filter((item) =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );
    setFilteredItems(filtered);
    setCount(filtered.length);
  }

  // Showing all items when the "All" button is pressed
  function showAllItems() {
    setFilteredItems(allItems);
    setCount(allItems.length);
  }

  const storeItemInCart = async (productId, quantity) => {
    if (quantity <= 0) {
      console.warn("Cannot add items with zero quantity to the cart.");
      return; // Avoid adding items with zero or negative quantity
    }
    try {
      const cartItem = { productId, quantity };
      const existingCart = await AsyncStorage.getItem("cart");
      let cart = existingCart ? JSON.parse(existingCart) : [];
  
      // Check if the item is already in the cart
      const itemIndex = cart.findIndex((item) => item.productId === productId);
      if (itemIndex > -1) {
        // Update the quantity if the item already exists
        cart[itemIndex].quantity = quantity;
      } else {
        // Add new item to the cart
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              item.id === "0" ? showAllItems() : handleFilter(item.name)
            }
          >
            <Text style={styles.subcategoryButtonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Text>
        {Count} {Count > 1 ? "Items in the list" : "Item in the list "}
      </Text>

      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.itemList}
        renderItem={({ item }) => {
          const itemCount = itemCounts[item.name] || 0;

          return (
            <TouchableOpacity
              onPress={() => navigation.navigate("ProductDetails", { item })}
            >
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.text}>
                  <Text style={styles.itemText1}>{item.name}</Text>
                  <Text style={styles.itemText2}>Price: ₹{item.price}</Text>
                  <Text style={styles.itemText3}>{item.discount}</Text>
                </View>
                <View style={styles.item3}>
                  <TouchableOpacity
                    onPress={() => {
                      const newCount = itemCount + 1;
                      updateItemCount(item.name, newCount);
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
                      updateItemCount(item.name, newCount);
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
                        storeItemInCart(item.productId, itemCount); // Ensure productId is valid
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
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttons: {
    marginBottom: 10,
  },
  itemList: {
    paddingTop: 0,
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
  },
  subcategoryButtonText: {
    backgroundColor: "grey",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    color: "white",
  },
});

export default CategoryItemsScreen;
