import AsyncStorage from "@react-native-async-storage/async-storage";

export const getBaseApiUrl=()=>
{
    return "https://akm0505.bsite.net";
}
export async function SaveOrderHistory(orderHistory,orderDetail)
{
 await AsyncStorage.setItem("OrderHistory",orderHistory)
await AsyncStorage.setItem("OrderDetail",orderDetail)
}

export const enviornment="PROD";

export const isDevelopmentMode=()=>
    {
       if(enviornment=="DEV")
       {
        return true;
       }
       else{
        return false;
       }
    } 