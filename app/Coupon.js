import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";

const discountList = [
  {
    COUPON_NAME: "Diwali Offer",
    COUPON_CODE: "DIW001XY",
    DISCOUNT_TYPE: "INR",
    DISCOUNT_VALUE: 200,
    MINIMUM_SUBTOTAL: 1000
  },
  {
    COUPON_NAME: "Big Billion Day",
    COUPON_CODE: "SAT0101",
    DISCOUNT_TYPE: "PERCENT",
    DISCOUNT_VALUE: 2,
    MINIMUM_SUBTOTAL: 500
  },
];

const Coupon = ({ route }) => {
  let { totalPrice } = route.params;
  const [content, setContent] = useState("");
  const [applied, setApplied] = useState(false);
  const [total, setTotal] = useState(totalPrice);

  const matchedCoupon = discountList.find(
    (coupon) => coupon.COUPON_CODE.toLowerCase() === content.toLowerCase()
  );

  function applyCoupon() {
    if (matchedCoupon) {
      if (totalPrice > matchedCoupon.MINIMUM_SUBTOTAL) {
        setApplied(true);
        setTotal(totalPrice - matchedCoupon.DISCOUNT_VALUE);
      } else {
        alert("Total price should be more than: ₹" + matchedCoupon.MINIMUM_SUBTOTAL);
      }
    } else {
      alert("Invalid Coupon Code");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.couponInputContainer}>
        <TextInput
          placeholder="Enter your Coupon Code"
          style={styles.input}
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity style={styles.applyButton} onPress={applyCoupon}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Sub-total</Text>
          <Text style={styles.value}>₹{totalPrice}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Coupon Status:</Text>
          <Text style={styles.value}>{applied ? "Applied" : "Not Applied"}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Total after discount:</Text>
          <Text style={styles.value}>₹{total}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  couponInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  applyButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  summaryContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#000",
  },
});

export default Coupon;
