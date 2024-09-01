import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';

function SignUpPage({ navigation }) {
    const [input, setInput] = useState("");

    function randomNum() {
        const min = 1000;
        const max = 9999;
        const x = Math.floor(Math.random() * (max - min + 1)) + min;
        return x;
    }

    const isButtonDisabled = input.length !== 10;

    const handleSignup = async () => {
        const otp = randomNum();
    
        try {
           
          
            const existingNumbers = await AsyncStorage.getItem('phoneNumbers');
            let phoneNumbers = existingNumbers ? JSON.parse(existingNumbers) : [];
    
            phoneNumbers.push(input);
           
            await AsyncStorage.setItem('phoneNumbers', JSON.stringify(phoneNumbers));
            console.log('Phone numbers saved to AsyncStorage', phoneNumbers);
    
        } catch (error) {
            console.error('Failed to save the data to the storage', error);
        }
    
        navigation.navigate("Otp", { otp, input });
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Your Full Name"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your Phone number"
                    value={input}
                    maxLength={10}
                    keyboardType="numeric"
                    onChangeText={setInput}
                />
                <TouchableOpacity onPress={handleSignup} disabled={isButtonDisabled}>
                    <Text style={[styles.btn, isButtonDisabled && styles.disablebtn]}>
                        REQUEST OTP
                    </Text>
                </TouchableOpacity>
                <Text>Already have an account?</Text>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("Signin", { input });
                }}>
                    <Text style={styles.si}> Sign In </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    input: {
        height: 50,
        paddingHorizontal: 10,
        borderColor: 'gray',
        borderWidth: 1,
        width: '90%',
        marginBottom: 20,
    },
    disablebtn: {
        backgroundColor: "grey"
    },
    btn: {
        backgroundColor: "blue",
        color: "white",
        padding: 20
    },
    si: {
        color: "blue"
    },
    form: {
        justifyContent: "center",
        alignItems: "center"
    }
});

export default SignUpPage;
