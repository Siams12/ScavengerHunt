//Page represents the details for ONE HUNT

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput, Dimensions, Switch} from 'react-native';
import { useState} from 'react';
import {FlatList, ImageBackground } from 'react-native';
import * as Styles from "../Styles/ScavengerHuntStyles.js";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postRequest } from '../Fetch.js';
import MapView,{Marker} from "react-native-maps";
import * as Location from "expo-location";

export function HuntDetails({route, navigation}){
    const Token = useSelector((state) => state.Users.value);
    const [currentHuntName, setcurrentHuntName] = useState(route.params.huntInfo.name);
    const [huntName, sethuntName] = useState('');
    const [locationName, setLocationName] = useState('');
    const [message,setMessage] = useState('')
    const [locations, setLocations] = useState([]);
    const [activeSliderValue, setActiveSliderValue] = useState(0);
    const [location, setLocation] = useState(
        {
        latitude: 39.9937,
        longitude: -81.734,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    
    const zoomChanges = (newRegion) => {
        setLocation(newRegion);
      };

    //swap value of slider.
    const changeSliderValue = () => {
        if (!activeSliderValue){
            setActiveSliderValue(1);
        }
        else{
            setActiveSliderValue(0);
        }
    }
    //getHunts locations
    const getHuntLocations = async () => {
        let result = await postRequest({token: Token, huntid: route.params.huntInfo.huntid}, "getHuntLocations.php");
        if (result.status === "okay"){
            setLocations(result.locations);
        }
        else{
            setMessage("Error getting hunts.")
        }
    }

    useEffect(() => {
        (async () => {
            await getHuntLocations();

            let fg = await Location.requestForegroundPermissionsAsync();
            if (fg.status !== 'granted') {
                setMessage('Permission to access foreground location was denied. Please refresh and give permission');
                return;
            }
            let myLocation = await Location.getCurrentPositionAsync({enableHighAccuracy: true,
                accuracy: Location.Accuracy.Highest});
                    setLocation(myLocation);
            
                setMessage("Location collected. Ready for encrypting")
        })()})

    //Add a location to this hunt
    const addHuntLocation = async () => {
        let result = await postRequest({token: Token, huntid: route.params.huntInfo.huntid, name: locationName}, "addHuntLocation.php");
        if (result.status === "okay"){
            setMessage("Location added successfully")
        }
        else{
            setMessage("Error adding hunt. Use a name not in use and less than 255 chars.");
        }
    }
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
            setMessage("Delete failed")
        }
    }
    //Updates hunt with new name
    const updateHunt = async () => {
        let result = await postRequest({token: Token, huntid: route.params.huntInfo.huntid, name: huntName, active: activeSliderValue}, "updateHunt.php");
        if (result.status === "okay"){
            setcurrentHuntName(huntName);
            setMessage("Hunt updated successfully");
            sethuntName("");
        }
        else{
            setMessage("Hunt not updated")
        }
    }
    //Confirms whether use wants to delete a hunt
    const showConfirmDialog = async () => {
        if (Platform.OS !== "web"){
        return Alert.alert(
          "Are your sure?",
          "This will delete your hunt.",
          [{
              text: "Yes",
              onPress: () => {
                deleteAction()
              },
            },
            {
              text: "No",
            },
          ]);
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
            <MapView
            style={{ width: "100%", height: "50%" }}
            initialRegion={location}
            region={location}
            onRegionChangeComplete={zoomChanges}
            >
      
            {locations.map(location => {
                if (location.latitude && location.longitude){
                return(
                <Marker
                    key = {location.id}
                    id = {location.id}
                    coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                    title={location.name}
                    description= {location.description + location.clue}
                    onCalloutPress={() => {navigation.navigate("huntLocation")}}
                />
                )
                }
            })}
            </MapView>
            <Text>{currentHuntName}</Text>

            <Text>{message}</Text>
            <Button title = "Delete Hunt" onPress={showConfirmDialog}/>

            <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
            onChangeText={text => sethuntName(text)}
            placeholder='Hunt Name'/>

            <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
            onChangeText={text => setLocationName(text)}
            placeholder='Location Name'/>

            <Text>Make hunt viewable by others? </Text>

            <Switch
            value={activeSliderValue}
            onValueChange={changeSliderValue}
            />
            <Button title = "Add Your current Location" onPress={addHuntLocation}/>

            <Button title = "Update Hunt" onPress={updateHunt}/>

        </View>
    )
}