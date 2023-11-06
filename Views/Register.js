import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput, Dimensions } from 'react-native';
import { useState} from 'react';
import { useEffect } from 'react';
import * as Styles from "../Styles/ScavengerHuntStyles.js";
import { useDispatch, useSelector } from 'react-redux';
import { addToken } from '../Models/userSlice.js';
import { postRequest } from '../Fetch.js';
export function Register({navigation}){
    const dispatch = useDispatch();
    const [Username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, seterrorMessage] = useState('');
    //Register
    const registerAction = async () => {
          //Check passwords match
          if (password != confirmPassword){
            seterrorMessage("Passwords do not match please retry");
            return;
          }
            //Submit postRequest
            newResult = await postRequest({userid: Username, password: password}, "register.php");
            if (newResult.status === "okay") {
              //AddToken to store and send to ScavengerHunt page.
              dispatch(addToken(newResult.token));
              seterrorMessage("");
              navigation.reset({
                index: 0,
                routes: [{ name: 'ScavengerHunt' }],
                })
              }
              //Post request failed.
              else{
                seterrorMessage("Error signing up. Make sure your password is 12 characters or you aren't using a current user")
              }
            
          
        }
    
    return (
      <View style={Styles.styles.container}>
        <Text style = {{fontWeight: "bold", fontSize: 30, marginBottom: 10}}>Register</Text>
        <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
      onChangeText={text => setUsername(text)}
      placeholder='Username'
      />
      <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
      onChangeText={text => setPassword(text)}
      secureTextEntry={true} 
      placeholder='Password'
      />
         <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
      onChangeText={text => setConfirmPassword(text)}
      secureTextEntry={true} 
      placeholder='Retype Password'
      />
      <Text>{errorMessage}</Text>
      <Button title="Register!" onPress={registerAction}
      />
</View>
    )
        };