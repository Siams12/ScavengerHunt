import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput, Dimensions } from 'react-native';
import { useState} from 'react';
import { useEffect } from 'react';
import * as Styles from "../Styles/ScavengerHuntStyles.js";
import { useDispatch, useSelector } from 'react-redux';
import { addToken } from '../Models/userSlice.js';
import { postRequest } from '../helpers/Fetch.js';

export function SplashScreen({navigation}){
    const Token = useSelector((state) => state.Users.value);
    const dispatch = useDispatch();
    const verifyToken = async () => {
        let result = await postRequest({token: Token}, "verifyToken.php")
        if (result.status === "okay"){
          console.log("Token found going to scavengerhunt");
          navigation.reset({
            index: 0,
            routes: [{ name: 'DefaultScreen' }],
            })
        }
        else{
            console.log("No token found. Please login or register");
            navigation.reset({
                index: 0,
                routes: [{ name: "Login"}]
            })
        }

}
    useEffect(() => {
    verifyToken()
    }, [])

  
    return (
      <View style={Styles.styles.container}>
        <Text style = {{fontWeight: "bold", fontSize: 30, marginBottom: 10}}>Scavenger Hunt</Text>
        <Image
        style = {{ width: 500,
            height: 500}}
        source={{
          uri: 'https://teambuildinghub.com/wp-content/uploads/2022/03/virtual-scavenger-hunt-featured-image-1.webp',
        }}
        />
</View>
    )
        };