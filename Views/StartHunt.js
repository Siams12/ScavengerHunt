import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput, Dimensions, Switch, Alert} from 'react-native';
import { useState} from 'react';
import {FlatList, ImageBackground } from 'react-native';
import * as Styles from "../Styles/ScavengerHuntStyles.js";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateLocationPosition, getLocations } from '../helpers/sharedAPIS.js';
import { postRequest } from '../helpers/Fetch.js';
import MapView,{Marker} from "react-native-maps";
import * as Location from "expo-location";

export function StartHunt({route, navigation}){
    const huntInfo = route.params.huntInfo;
    const Token = useSelector((state) => state.Users.value);
    const startHunt = async () => {
        let result = await postRequest({huntid: huntInfo.huntid, token: Token}, "startHunt.php");
        if (result.status === "okay"){
            navigation.navigate("HuntDetailsPlay", {huntInfo: huntInfo})
        }
    }
    return(
    <View>
    <Button title="startThisHunt" onPress={startHunt} />
    </View>
    )

}