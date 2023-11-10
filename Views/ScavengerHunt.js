//Show scavengerunts available.


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput, Dimensions, TouchableOpacity} from 'react-native';
import { useState} from 'react';
import {FlatList, ImageBackground } from 'react-native';
import {styles, huntList} from "../Styles/ScavengerHuntStyles.js";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postRequest } from '../Fetch.js';



export function ScavengerHunt({navigation}){
    const Token = useSelector((state) => state.Users.value);
    const [huntName, sethuntName] = useState('');
    const [message,setmessage] = useState('')
    const [hunts, setHunts] = useState([])
    const dispatch = useDispatch();
    const image = "https://img.freepik.com/free-vector/vibrant-fluid-gradient-background-with-curvy-shapes_1017-32108.jpg";
    //Call getHunts and set our list to it.
    useEffect(()=> {
        const initialLoadHunts = async () => {
            setHunts(await getHunts())
        }
        initialLoadHunts();
    }, [message])
    //Display a single hunt
    const displayHunt = (item, Index) => {
        return(
            <TouchableOpacity onPress={() => navigation.navigate("HuntDetails", {huntInfo: item.item})}>
                <View style = {huntList.huntDisplay}>
                    <Text>{item.item.name}</Text>
                    <Text>{item.item.active}</Text>
                </View>
            </TouchableOpacity>
        )
    }
   //Make post request to get list of hunts
    const getHunts = async () => {
        console.log("function called");
        let result = await postRequest({token: Token}, "getMyHunts.php");
        if (result.status === "okay") {
            return result.hunts;
        }
    }
    //Add a hunt to the database
    const addHunt = async () => {
        console.log("function called")
        let result = await postRequest({token: Token, name: huntName}, "addHunt.php");
        if (result.status === "okay") {
            setmessage("Hunt added!")
        }
        else {
            setmessage("Add hunt failed. Must be less than 255 characters and not already taken.")
        }
    }
    
    return (
      <View style={styles.container}>

        <Text style = {{fontWeight: "bold", fontSize: 30, marginBottom: 10}}>Scavenger Hunts!</Text>
        <View style= {huntList.centerBox}>
            <FlatList
                data={ hunts }
                renderItem={ (item , index) => displayHunt(item, index) }
                keyExtractor={ (item, index) => index }
            />
        </View>
        <Text style = {{fontWeight: "bold", fontSize: 20}}>Add a new hunt!</Text>
        <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
            onChangeText={text => sethuntName(text)}
            placeholder='Hunt Name'/>
        <Button title="Add" onPress={addHunt}></Button>
        <Text>{message}</Text>
      </View>
    )
        };