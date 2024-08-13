import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';


const items = {
  'Sweets': [
    { name: 'Kaju Katli', image: 'https://img.cdnx.in/358917/sweets-1717750278332.jpeg?width=384&format=webp' },
    { name: 'Rasgulla', image: 'https://via.placeholder.com/100' },
    { name: 'Gulab Jamun', image: 'https://via.placeholder.com/100' }
  ],
  'Personal Care': [
    { name: 'Shampoo', image: 'https://via.placeholder.com/100' },
    { name: 'Soap', image: 'https://via.placeholder.com/100' },
    { name: 'Toothpaste', image: 'https://via.placeholder.com/100' }
  ],
  'Atta, Dal & Rice': [
    { name: 'Basmati Rice', image: 'https://via.placeholder.com/100' },
    { name: 'Chana Dal', image: 'https://via.placeholder.com/100' },
    { name: 'Wheat Flour', image: 'https://via.placeholder.com/100' }
  ],
  'Hot & Cold Drinks': [
    { name: 'Coca-Cola', image: 'https://via.placeholder.com/100' },
    { name: 'Maaza', image: 'https://via.placeholder.com/100' },
    { name: 'Coffee', image: 'https://via.placeholder.com/100' }
  ],
  'Chips & Munchies': [
    { name: 'Lays', image: 'https://via.placeholder.com/100' },
    { name: 'KurKure', image: 'https://via.placeholder.com/100' },
    { name: 'Pringles', image: 'https://via.placeholder.com/100' }
  ],
  'Fruits & Vegetables': [
    { name: 'Apples', image: 'https://via.placeholder.com/100' },
    { name: 'Bananas', image: 'https://via.placeholder.com/100' },
    { name: 'Tomatoes', image: 'https://via.placeholder.com/100' }
  ],
};

const CategoryItemsScreen = ({ route, navigation }) => {
  const { category } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category.name}</Text>
      
      <FlatList
        data={items[category.name]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('ProductDetails', { item })}
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 18,
  },
});

export default CategoryItemsScreen;
