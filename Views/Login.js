import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput, Dimensions } from 'react-native';
import { useState} from 'react';
import { useEffect } from 'react';
import * as Styles from "../Styles/ScavengerHuntStyles.js";
import { useDispatch, useSelector } from 'react-redux';
import { postRequest } from '../Fetch.js';
import { addToken } from '../Models/userSlice.js';
export function Login({navigation}){
    const dispatch = useDispatch();
    const [Username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, seterrorMessage] = useState('');
    const Login = async () => {
        //Submit postRequest
        let result = await postRequest({userid: Username, password: password}, "login.php");
        if (result.status === "okay") {
          //AddToken to store and send to ScavengerHunt page.
          dispatch(addToken(result.token));
          seterrorMessage("");
          navigation.reset({
            index: 0,
            routes: [{ name: 'ScavengerHunt' }],
            })
          }
          //Post request failed.
          else{
            seterrorMessage("Error Logging in, please make sure you are using a valid username and password.")
          }
        }
    
    return (
      <View style={Styles.styles.container}>
        <Text style = {{fontWeight: "bold", fontSize: 30, marginBottom: 10}}>Login</Text>
        <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
      onChangeText={text => setUsername(text)}
      placeholder='Username'
      />
      <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
      onChangeText={text => setPassword(text)}
      placeholder='Password'
      secureTextEntry={true} 
      />
      <Button title="Login!" onPress={() => Login()}/>
      <Text>{errorMessage}</Text>
      <Text style = {{fontSize: 10, marginBottom: 10}}>Dont have an account? register here!</Text>
      <Button title="Register" onPress={() => navigation.navigate("Register")}/>
</View>
    )
        };