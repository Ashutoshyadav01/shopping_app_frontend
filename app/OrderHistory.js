import { View, Text,StyleSheet, TouchableOpacity,SafeAreaView} from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from 'react-native-gesture-handler';

const OrderHistory = ({navigation}) => {
  const [orderList,setOrderList]=useState([])
  const [hexCode,setHexCode]=useState([])
  const date= new Date();
useState(()=>{
async function orderHistory()
{
    const x= await AsyncStorage.getItem("OrderHistory")
 
    if(x)
     {
        const parse=JSON.parse(x);
        console.log("parsed value",parse);
         setOrderList(parse)
      const hexcode=await AsyncStorage.getItem("hexCode");
        if(hexcode)
        {
    const parse=JSON.parse(hexcode)
    console.log("parsed hex code", parse)
    setHexCode(parse)
        }
      
     }
}
orderHistory();
},[])


  return (
    <SafeAreaView>
     
      <FlatList
      data={orderList}
      keyExtractor={item=>item.ORDER_NUMBER}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={()=>navigation.navigate("Order Detail",{orderId:item.OrderID,orderNo:item.ORDER_NUMBER,orderStatus:item.OrderStatus,deliveryType:item.DELIVERY_TYPE,mop:item.MODE_OF_PAYMENT,subTotal:item.SUB_TOTAL,tax:item.TAX,totalPayble:item.TOTAL_PAYABLE})}>

<View style={styles.container}>
      <Text style={styles.orderNumber}>Order Number: {item.ORDER_NUMBER}</Text>
      <Text style={styles.address}>
        {item.Address}, {item.ADDRESS_City}, {item.ADDRESS_State} - {item.ADDRESS_PinCode}
      </Text>
      <Text style={styles.payment}>Payment Method: {item.MODE_OF_PAYMENT}</Text>
      <Text style={styles.total}>Total Payable: ₹{item.TOTAL_PAYABLE}</Text>
      <Text style={[styles.status,{ color: hexCode[0] }]}>Status: {item.OrderStatus}</Text>
  
      
    </View>
        </TouchableOpacity>
    
  )}
  
      />
    
    </SafeAreaView>
  )
}
const styles=StyleSheet.create(
  {

  
  container: {
    backgroundColor: '#fff', // White background for each item
    borderRadius: 10, // Rounded corners
    padding: 15, // Padding inside each item
    marginVertical: 10, // Space between items
    marginHorizontal: 20, // Horizontal margin from screen edges
    shadowColor: '#000', // Adding a shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Shadow for Android
    borderColor: '#ccc', // Light border
    borderWidth: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Dark color for readability
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: '#666', // Slightly muted text
    marginBottom: 8,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', // Black for emphasis on total payable
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    fontStyle: 'italic', // Italics for order status
   
  },
}
)

export default OrderHistory