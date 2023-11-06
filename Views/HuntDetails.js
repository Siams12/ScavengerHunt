import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput, Dimensions} from 'react-native';
import { useState} from 'react';
import {FlatList, ImageBackground } from 'react-native';
import * as Styles from "../Styles/ScavengerHuntStyles.js";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postRequest } from '../Fetch.js';

export function HuntDetails({route, navigation}){
    const Token = useSelector((state) => state.Users.value);
    const [currentHuntName, setcurrentHuntName] = useState(route.params.huntInfo.name);
    const [huntName, sethuntName] = useState('');
    const [message,setmessage] = useState('')
    const [hunts, setHunts] = useState([]);
    //Deletes a hunt from database
    
    const deleteAction = async () => {
        let result = await postRequest({token: Token, huntid: route.params.huntInfo.huntid}, "deleteHunt.php");
        if (result.status === "okay") {
            navigation.reset({
                index: 0,
                routes: [{ name: "ScavengerHunt"}]
            })
        }
        else{
            setmessage("Delete failed")
        }
    }
    //Updates hunt with new name
    const updateHunt = async () => {
        let result = await postRequest({token: Token, huntid: route.params.huntInfo.huntid, name: huntName}, "updateHunt.php");
        if (result.status === "okay"){
            setcurrentHuntName(huntName);
            setmessage("Hunt updated successfully");
            sethuntName("");
        }
        else{
            setmessage("Hunt not updated")
        }
    }
    //Confirms whether use wants to delete a hunt
    const showConfirmDialog = async () => {
        if (Platform.OS !== "web"){
        return Alert.alert(
          "Are your sure?",
          "This will delete your hunt.",
          [
            {
              text: "Yes",
              onPress: () => {
                deleteAction()
              },
            },
            {
              text: "No",
            },
          ]
        );
        }
        else {
            let test = confirm("Are you sure you want to delete this hunt?")
            if (test){
                deleteAction()
            }
            return;
        }
      };
    return(
        <View>
            
            <Text>{currentHuntName}</Text>

            <Button title = "Delete Hunt" onPress={showConfirmDialog}></Button>

            <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
            onChangeText={text => sethuntName(text)}
            placeholder='Hunt Name'/>

            <Button title = "Update Hunt Name" onPress={updateHunt}
            ></Button>

        </View>
    )
}