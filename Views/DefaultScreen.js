import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, Modal, TextInput} from 'react-native';
import { useState} from 'react';
import {FlatList, ImageBackground } from 'react-native';
import * as Styles from "../Styles/ScavengerHuntStyles.js";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postRequest } from '../helpers/Fetch.js';
import { updateLocationPosition } from '../helpers/sharedAPIS.js';

export function DefaultScreen({navigation}){
    const Token = useSelector((state) => state.Users.value);
    return(<View>
        <Button title = "Make Hunts" onPress={() => navigation.navigate("MakeHunt")}/>
        <Button title = "Play Hunts" onPress={() => navigation.navigate("HuntSearch")}/>
    </View>)
}