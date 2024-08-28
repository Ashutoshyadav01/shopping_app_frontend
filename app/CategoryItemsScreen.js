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
const items = {
  1: [
    {
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

const subcategory = [
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
];


const CategoryItemsScreen = ({ route, navigation }) => {
  const { searchQuery, category } = route.params;
  const [filteredItems, setFilteredItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [itemCounts, setItemCounts] = useState({}); // Initialize an empty object to hold item counts

  useEffect(() => {
    if (category) {
      const categoryItems = items[category.id] || [];
      setFilteredItems(categoryItems);
      setAllItems(categoryItems);
    }
  }, [category]);

  const sub_cat = subcategory.filter(
    (item) => item.parent_category_id == category.id
  );

  function handleFilter(name) {
    const x = allItems.filter((item) =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );
    setFilteredItems(x);
  }

  function showAllItems() {
    setFilteredItems(allItems);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {searchQuery ? `Search Results for "${searchQuery}"` : category.name}
      </Text>

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

      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.itemList}
        renderItem={({ item, index }) => {
          const itemCount = itemCounts[item.name] || 0; // Get the count for the current item
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate("ProductDetails", { item })}
            >
              <View style={styles.itemContainer}>
                <View>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                </View>
                <View style={styles.text}>
                  <Text style={styles.itemText1}>{item.name}</Text>
                  <Text style={styles.itemText2}>Price: ₹{item.price}</Text>
                  <Text style={styles.itemText3}>{item.discount}</Text>
                </View>
                <View style={styles.item3}>
                  <TouchableOpacity
                    onPress={() => {
                      setItemCounts({
                        ...itemCounts,
                        [item.name]: itemCount + 1, // Update the count for this specific item
                      });
                    }}
                  >
                    <Icon name="plus" size={20} color="white" style={styles.iconPlusMinus} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20 }}>{itemCount}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setItemCounts({
                        ...itemCounts,
                        [item.name]: itemCount > 0 ? itemCount - 1 : 0, // Ensure count doesn't go below 0
                      });
                    }}
                  >
                    <Icon name="minus" size={20} color="white" style={styles.iconPlusMinus} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      // Handle adding item to cart
                    }}
                  >
                    <Icon name="shopping-cart" size={24} color="green" style={styles.iconCart} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  text: {
    justifyContent: "center",
    flex: 1, 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttons: {
    marginBottom: 10,
  },
  item3: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  itemText1: {
    fontWeight: "bold",
    flexShrink: 1,
  },
  itemText2: {
    flexShrink: 1,
  },
  itemText3: {
    color: "green",
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
    alignSelf: "flex-start",
    marginRight: 10,
    marginBottom: 10,
  },
});

export default CategoryItemsScreen;
