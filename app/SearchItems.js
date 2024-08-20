import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity
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
        name: "Toothpaste",
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


function SearchItems({ navigation, route }) {
  const { searchQuery } = route.params;
  const [filteredItems, setFilteredItems] = useState([]);
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

  return (
    <View style={{ padding: 16 }}>
     {count}{count>1?" items found ":"item found"} {count > 0 ? (
        <FlatList
          data={filteredItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>{
                navigation.navigate("ProductDetails",{item})
            }}>
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>Price: ₹{item.price}</Text>
                <Text style={styles.itemDiscount}>Discount: {item.discount}</Text>
              </View>
            </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>No items found for "{searchQuery}"</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  itemImage: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 14,
  },
  itemDiscount: {
    fontSize: 12,
    color: "green",
  },
});

export default SearchItems;
