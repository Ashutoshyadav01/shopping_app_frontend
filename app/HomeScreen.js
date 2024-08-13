import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';


const categories = [
  { id: '1', name: 'Sweets', image: 'https://via.placeholder.com/100' },
  { id: '2', name: 'Personal Care', image: 'https://via.placeholder.com/100' },
  { id: '3', name: 'Atta, Dal & Rice', image: 'https://img.cdnx.in/358917/AttaDalRice-1714078634647.jpeg?width=384&format=webp' },
  { id: '4', name: 'Hot & Cold Drinks', image: 'https://img.cdnx.in/358917/juices-1714080547337.jpeg?width=384&format=webp' },
  { id: '5', name: 'Chips & Munchies', image: 'https://via.placeholder.com/100' },
  { id: '6', name: 'Fruits & Vegetables', image: 'https://via.placeholder.com/100' },
];

const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth / 2) - 30; 
const API_URL="http://akm0505.bsite.net/api/GetCategoryList?shopId=1";
const fetchData = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  
fetchData();

  const handleSearch = () => {
    const filteredData = categories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filteredData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>BINIE</Text>
        <Text style={styles.subHeaderText}>SHOP SMILE REPEAT</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a product"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title='Search' color='green' onPress={handleSearch} />
      </View>

      <Text style={styles.sectionTitle}>Browse Categories</Text>
      <FlatList
        data={filteredCategories}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('CategoryItems', { category: item })}>
            <View style={styles.categoryItem}>
              <Image source={{ uri: item.image }} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.flatListContent}
      />

      <View style={styles.navBar}>
        <Icon name="home-outline" size={30} color="#4CAF50" />
        <Icon name="clipboard-outline" size={30} color="#4CAF50" />
        <Icon name="cart-outline" size={30} color="#4CAF50" />
        <Icon name="person-outline" size={30} color="#4CAF50" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    margin: 20,
    paddingLeft: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    height: 40,
    flex: 1,
    fontSize: 16,
  },
  header: {
    backgroundColor: 'green',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeaderText: {
    color: '#fff',
    fontSize: 16,
  },
  sectionTitle: {
    marginLeft: 120,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    width: itemWidth,
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
  },
  categoryImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    textAlign: 'center',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
