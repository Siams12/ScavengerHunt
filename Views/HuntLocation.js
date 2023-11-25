//Page represents a page where the user updates ONE location in a hunt.
import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, Modal, TextInput} from 'react-native';
import { useState} from 'react';
import {FlatList, ImageBackground } from 'react-native';
import * as Styles from "../Styles/ScavengerHuntStyles.js";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postRequest } from '../helpers/Fetch.js';
import { updateLocationPosition } from '../helpers/sharedAPIS.js'; 

export function HuntLocation({route, navigation}){
    const huntID = route.params.huntID;
    const locationData = route.params.location;
    const Token = useSelector((state) => state.Users.value);
    const [clue, setClue] = useState(locationData.clue);
    const [description, setDescription] = useState(locationData.description);
    const [title, setTitle] = useState(locationData.name);
    const [longitude, setLongitude] = useState(locationData.longitude);
    const [latitude, setLatitude] = useState(locationData.latitude);
    const [message, setMessage] = useState("");
    const updateLocation = async() => {
        let result = await postRequest({
            locationid: locationData.locationid, 
            token: Token, 
            name: title,
            description: description,
            clue: clue }, "updateHuntLocation.php")
            if (result.status === "okay"){
                setMessage("Location Update Success!")
            }
            else{
                setMessage("Error updating hunt")
            }
    }

    const deleteLocation = async () => {
        let locationData = route.params.location;
        let result = await postRequest({locationid: locationData.locationid,token: Token}, "deleteHuntLocation.php");
        if (result.status === "okay"){
            navigation.goBack();
         }
        else{
             setMessage("Error deleting message")
         }
    }


    return (<View>
        <Text>Change your hunt location</Text>
        <Text>{message}</Text>

        <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
            onChangeText={text => setClue(text)}
            placeholder='Clue'/>
        <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
            onChangeText={text => setDescription(text)}
            placeholder='Description'/>
        <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
            onChangeText={text => setTitle(text)}
            placeholder='Location Name'/>
        <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
            onChangeText={text => setLatitude(Number(text))}
            placeholder='Latitude'/>
        <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
            onChangeText={text => setLongitude(Number(text))}
            placeholder='Longitude'/>

        <Button title = "SetNewLocation" onPress={async () => {
            await updateLocationPosition(locationData.locationid, Token, latitude, longitude)}}/>

        <Button title = "UpdateLocationDetails" onPress={updateLocation}/>

        <Button title = "Delete Location" onPress={deleteLocation}/>

        <Button title = "Update Conditions" onPress={() => navigation.navigate("LocationConditions", {locationData: locationData, huntID: huntID})}/>

    </View>)
}