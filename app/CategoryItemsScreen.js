import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
} from "react-native";

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
    { name: "Coffee", image: "https://via.placeholder.com/100" },
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
  { id: "7", parent_category_id: 3, name: "Pulse", image: "image URL" },
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
  const [count, setCount] = useState(0);
  const [subfilter, setSubfilter] = useState([]);

  function handleFilter(name) {
    const x = setFilteredItems(
      filteredItems.filter((item) =>
        item.name.toLowerCase().includes(name.toLowerCase())
      )
    );
  }

  useEffect(() => {
    if (category) {
      const categoryItems = items[category.id] || [];
      setFilteredItems(items[category.id]);
      setCount(categoryItems.length);
    }
  }, [category]);
  const sub_cat = subcategory.filter(
    (item) => item.parent_category_id == category.id
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {searchQuery ? `Search Results for "${searchQuery}"` : category.name}
      </Text>
      <Text>
        {count} {count > 1 ? "items found" : "item found"}
      </Text>

      <FlatList
        data={sub_cat}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Button title={item.name} onPress={() => handleFilter(item.name)} />
          </View>
        )}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("ProductDetails", { item })}
          >
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  itemImage: {
    width: 100, // Ensure width is set
    height: 100, // Ensure height is set
    marginRight: 10,
    borderRadius: 8, // Optional: to make images rounded
    marginTop: 10,
  },
  itemText: {
    margin: "auto",
    marginLeft: 0,
  },

  itemContainer: {
    flexDirection: "row",
  },
});

export default CategoryItemsScreen;
