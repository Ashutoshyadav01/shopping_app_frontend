import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OrderDetail({ route }) {
  const { orderId, orderNo, orderStatus, deliveryType, mop, orderDate,subTotal, tax, totalPayble } = route.params;
  const [products, setProducts] = useState([]);
  const [allItem, setAllItem] = useState([]);

  useEffect(() => {
    async function ProductList() {
      const x = await AsyncStorage.getItem("OrderDetail");
      if (x) {
        const parsed = JSON.parse(x);
        console.log("ALL Products", parsed);
        setAllItem(parsed);
      }
    }
    ProductList();
  }, []);

  useEffect(() => {
    const allItems = allItem.filter((item) => orderId === item.OrderID);
    console.log("Filtered Items:", allItems);
    setProducts(allItems);
  }, [allItem]);

  const renderProductItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image
        source={{ uri: item.ProductThumbnail }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.ProductName}</Text>
        <Text style={styles.productQuantity}>Quantity: {item.Quantity}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
    
      <View style={styles.orderDetailSection}>
       
<View>
<View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Order ID:</Text>
          <Text style={styles.detailValue}>{orderId}</Text>
        </View>

        {/* Order No Section */}
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Order No:</Text>
          <Text style={styles.detailValue}>{orderNo}</Text>
        </View>

        {/* Order Status Section */}
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={styles.detailValue}>{orderStatus}</Text>
        </View>
</View>
        
       
<View>
<View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Delivery Type:</Text>
          <Text style={styles.detailValue}>{deliveryType === 1 ? "Pickup" : "Delivery"}</Text>
        </View>

        {/* Mode of Payment Section */}
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Mode of Payment:</Text>
          <Text style={styles.detailValue}>{mop}</Text>
        </View>
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Order Date:</Text>
          <Text style={styles.detailValue}>{orderDate}</Text>
        </View>



</View>
      
  
        {/* Payment Summary */}
     
      </View>
      <View style={styles.paymentSummary}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <Text style={styles.summaryText}>Subtotal: <Text style={styles.amount}>₹{subTotal}</Text></Text>
          <Text style={styles.summaryText}>Tax: <Text style={styles.amount}>₹{tax}</Text></Text>
          <Text style={styles.totalText}>Total Payable: <Text style={styles.amount}>₹{totalPayble}</Text></Text>
        </View>
      {/* Products List */}
      <FlatList
        data={products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderProductItem}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false} // Hide scroll indicator for better UI
        nestedScrollEnabled // Enable nested scrolling
        style={styles.flatList} // Apply specific styles to FlatList
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  orderDetailSection: {
    marginBottom: 10, 
  gap:100,
    flexDirection:"row"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailSection: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  detailValue: {
    fontSize: 16,
    marginBottom: 5,
    color: '#777',
  },
  paymentSummary: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f7f7f7',
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 16,
    color: '#555',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  amount: {
    fontWeight: 'bold',
    color: '#333',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  productQuantity: {
    fontSize: 16,
    color: '#555',
  },
  flatListContainer: {
    paddingBottom: 20, // Add space at the bottom of the list
    flexGrow: 1, // Allow list to grow
  },
  flatList: {
    flex: 1, // Take up remaining space
  },
});
