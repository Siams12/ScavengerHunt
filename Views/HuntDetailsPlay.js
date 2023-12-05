//Page represents the details for a hunt someone is playing

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput, Dimensions, Switch, Alert, ScrollView} from 'react-native';
import { useState} from 'react';
import {FlatList, ImageBackground } from 'react-native';
import * as Styles from "../Styles/ScavengerHuntStyles.js";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postRequest } from '../helpers/Fetch.js';
import * as Location from "expo-location";
import ConfettiCannon from 'react-native-confetti-cannon';

export function HuntDetailsPlay({route, navigation}){
    let huntInfo = route.params.huntInfo;
    const Token = useSelector((state) => state.Users.value);
    const [message, setMessage] = useState("");
    const [locations, setLocations] = useState([]);


    const abandonHunt = async () => {
        let result = await postRequest({huntid: huntInfo.huntid, token: Token}, "abandonHunt.php");
        console.log("abandon");
        if (result.status === "okay"){
            navigation.goBack();
            setMessage("Hunt abandoned");
        }
        else{
            setMessage("Something went wrong when abandoning your hunt.");
        }
    }

    const getAvailableLocations = async () => {
        let result = await postRequest({huntid: huntInfo.huntid, token: Token}, "getAvailableLocations.php")
        if (result.status === "okay"){
            result.locations = result.locations.filter(({completed}) => (!completed));
            if (result.locations.length == 0){
                navigation.navigate("HuntSearch")
            }
            else{
            setLocations(result.locations);
            }
        }
        else{
            setMessage("Something went wrong");
        }
    }

    const completeLocation = async (locationID) => {
        let myLocation = await Location.getCurrentPositionAsync({enableHighAccuracy: true,
        accuracy: Location.Accuracy.Highest});
        console.log(myLocation);
        let result = await postRequest({locationid: locationID, latitude: myLocation.coords.latitude, longitude: myLocation.coords.longitude, token: Token}, "completeLocation.php")
        if (result.status === "toofar"){
            setMessage("You are too far away from this location to complete");
        }
        else if (result.status === "Okay"){
            setMessage("Location completed!")
        }
        else{
            setMessage("error");
        }
    }

    const displayLocations = (item , index) => {
        return (<ScrollView vertical>
                <View>
                <Text>{item.item.name}</Text>
                <Text style = {{ flex: 1, flexWrap: 'wrap'}}>{"Description: " + item.item.description + "\n clue: " +  item.item.clue}</Text>
                <Button title="Complete Location"onPress={() => {completeLocation(item.item.locationid)}}/>
                <Text></Text>
                </View>
                </ScrollView>
        )
    }

    useEffect(() => {
        (async () => {
        let fg = await Location.requestForegroundPermissionsAsync();
        if (fg.status !== 'granted') {
            return;
        }
        await getAvailableLocations()
        })()}, [message])

    return(<View>
            <FlatList
            data={ locations }
            renderItem={ (item , index) => displayLocations(item, index) }
            keyExtractor={ (item, index) => index }
        />
        <Button title="Abandon This Hunt" onPress={abandonHunt}/>
        <Text>{message}</Text>
    </View>);

};