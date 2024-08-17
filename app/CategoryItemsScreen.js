import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const items = {
  1: [
    { name: 'Kaju Katli', image: 'https://img.cdnx.in/358917/sweets-1717750278332.jpeg?width=384&format=webp',price:"300", op:"400",discount:"20%"},
    { name: 'Rasgulla', image: 'https://via.placeholder.com/100',price:"300", op:"400",discount:"20%" },
    { name: 'Gulab Jamun', image: 'https://via.placeholder.com/100' ,price:"300", op:"400",discount:"20%"}
  ],
  2: [
    { name: 'Shampoo', image: 'https://via.placeholder.com/100' ,price:"300", op:"400",discount:"20%"},
    { name: 'Soap', image: 'https://via.placeholder.com/100',price:"300", op:"400",discount:"20%" },
    { name: 'Toothpaste', image: 'https://via.placeholder.com/100',price:"300", op:"400",discount:"20%" }
  ],
  3: [
    { name: 'Basmati Rice', image: 'https://via.placeholder.com/100',price:"300", op:"400",discount:"20%" },
    { name: 'Chana Dal', image: 'https://via.placeholder.com/100',price:"300", op:"400",discount:"20%" },
    { name: 'Wheat Flour', image: 'https://via.placeholder.com/100',price:"300", op:"400",discount:"20%" }
  ],
  4: [
    { name: 'Coca-Cola', image: 'https://via.placeholder.com/100',price:"300", op:"400",discount:"20%" },
    { name: 'Maaza', image: 'https://via.placeholder.com/100',price:"300", op:"400",discount:"20%" },
    { name: 'Coffee', image: 'https://via.placeholder.com/100' }
  ],
  5: [
    { name: 'Lays', image: 'https://via.placeholder.com/100' ,price:"300", op:"400",discount:"20%"},
    { name: 'KurKure', image: 'https://via.placeholder.com/100' ,price:"300", op:"400",discount:"20%"},
    { name: 'Pringles', image: 'https://via.placeholder.com/100',price:"300", op:"400",discount:"20%" }
  ],
  6: [
    { name: 'Apples', image: 'https://via.placeholder.com/100' ,price:"300", op:"400",discount:"20%"},
    { name: 'Bananas', image: 'https://via.placeholder.com/100' ,price:"300", op:"400",discount:"20%"},
    { name: 'Tomatoes', image: 'https://via.placeholder.com/100',price:"300", op:"400",discount:"20%" }
  ],
};

const subcategory=
[
{
  id:"7", p_category:"1",name:"rasgulla", image:"'https://via.placeholder.com/100"
},
{
  id:"8", p_category:"3",name:"Pulses", image:"'https://via.placeholder.com/100"
},
{
  id:"9", p_category:"3",name:"Rice", image:"'https://via.placeholder.com/100"
},
{
  id:"10", p_category:"3",name:"atta", image:"'https://via.placeholder.com/100"
}
]

const CategoryItemsScreen = ({ route, navigation }) => {
  const { searchQuery, category } = route.params;
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      const results = [];
      Object.keys(items).forEach(categoryName => {
        const matchingItems = items[categoryName].filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (matchingItems.length > 0) {
          results.push(...matchingItems);
        }
      });
      setFilteredItems(results);
    } else if (category) {
      setFilteredItems(items[category.id]);
    }
  }, [searchQuery, category]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {searchQuery ? `Search Results for "${searchQuery}"` : category.name}
      </Text>
      
      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { item })}>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemImage: {
    width: 100,  // Ensure width is set
    height: 100, // Ensure height is set
    marginRight: 10,
    borderRadius: 8,  // Optional: to make images rounded
    marginTop:10
  },
  itemText:{
    margin:"auto",
    marginLeft:0
  },

  itemContainer: {
    flexDirection: 'row',
  }
}
)

export default CategoryItemsScreen;