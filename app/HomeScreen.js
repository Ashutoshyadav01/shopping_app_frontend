import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import {
  View,
  Animated,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const screenWidth = Dimensions.get("window").width;
const { width } = Dimensions.get('window');
const itemWidth = screenWidth / 2 - 30;
const API_URL = "https://akm0505.bsite.net/api/GetInitialSetup/1";

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [ShopNM, setShopNM] = useState("");
  const [CategoryList, setCategoryList] = useState([]);
  const [storedName, setStoredName] = useState("");
  const [Logo, setLogo] = useState(
    "https://akm0505.bsite.net/mahakal_logo.jpeg"
  );
  const [isLoading, setIsLoading] = useState(true);

  const API_URL_CATAGORYLIST =
    "https://akm0505.bsite.net/api/GetCategoryList/1";
    
  const translateX = useRef(new Animated.Value(width)).current; // Start off-screen

  useEffect(() => {
    const startMarquee = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: -width, // Move completely off the left side of the screen
            duration: 10000, // Adjust speed here (8000ms = 8 seconds)
            useNativeDriver: true, // Use native driver for better performance
          }),
          Animated.timing(translateX, {
            toValue: width, // Reset to the right side of the screen instantly
            duration: 0, // No delay between loop iterations
            useNativeDriver: true,
          }),
        ])
      ).start(); // Start looping the animation
    };

    startMarquee(); // Trigger the marquee effect on mount
  }, [translateX]);

  // Fetch the shop name and category list once when the component mounts
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.Table && resJson.Table.length > 0) {
          setShopNM(resJson.Table[0].SHOP_NAME);
          setLogo(resJson.Table[0].LOGO_IMAGE_URL);
        }
        setIsLoading(false); // Set loading to false after fetching data
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false); // Set loading to false in case of error
      });

    fetch(API_URL_CATAGORYLIST)
      .then((res) => res.json())
      .then((resJson) => {
        setCategoryList(resJson.Table);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // Use useFocusEffect to update storedName whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchStoredName = async () => {
        try {
          const name = await AsyncStorage.getItem("UserProfile");
          if (name !== null) {
            const parsedProfile = JSON.parse(name);
            setStoredName(parsedProfile.CustomerFullName); // Set the stored name immediately
          }
        } catch (error) {
          console.log("Error fetching stored name:", error);
        }
      };

      fetchStoredName();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleSearch = () => {
    navigation.navigate("SearchItems", { searchQuery });
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", backgroundColor: "green" }}>
        <Text style={{ fontSize: 20, color: "white" }}>
          Welcome Back {storedName}
        </Text>
      </View>

      <View style={styles.marqueeWrapper}>
        <Animated.View style={{ transform: [{ translateX }] }}>
          <Text style={styles.marqueeText}>
            20% Discount on Kitchen products
          </Text>
        </Animated.View>
      </View>
      
      <View style={styles.header}>
        <Image source={{ uri: Logo }} style={styles.categoryImage} />
        <Text style={styles.headerText}>{ShopNM}</Text>
        <Text style={styles.subHeaderText}>BUY SMILE REPEAT</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a product"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="always"
        />
        <Button title="Search" color="green" onPress={handleSearch} />
      </View>

      <Text style={styles.sectionTitle}>Browse Categories</Text>
      <FlatList
        data={CategoryList}
        numColumns={2}
        keyExtractor={(item) => item.CategoryId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CategoryItems", { category: item })
            }
          >
            <View style={styles.categoryItem}>
              <Image
                source={{ uri: item.CategoryImageUrl }}
                style={styles.categoryImage}
              />
              <Text style={styles.categoryText}>{item.CategoryName}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.flatListContent}
      />

      <View style={styles.navBar}>
        <Icon name="home-outline" size={30} color="#4CAF50" />
        <Icon name="clipboard-outline" size={30} color="#4CAF50" />
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <Icon name="cart-outline" size={30} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            try {
              const profile = await AsyncStorage.getItem("UserProfile");
              if (profile === null) {
                navigation.navigate("Signup");
              } else {
                navigation.navigate("Profile");
              }
            } catch (error) {
              console.error("Error checking profile:", error);
            }
          }}
        >
          <Icon name="person-outline" size={30} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
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
  marqueeWrapper: {
    width: 1000,
    overflow: "hidden",
    marginVertical: 5,
  },
  header: {
    backgroundColor: "green",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeaderText: {
    color: "#fff",
    fontSize: 16,
  },
  sectionTitle: {
    marginLeft: 120,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  marqueeText: {
    fontSize: 24,
    color: "black",
    paddingRight: 50,
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    width: itemWidth,
    margin: 10,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
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
    textAlign: "center",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
  },
});

export default HomeScreen;
