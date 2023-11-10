//Page represents a page where the user updates ONE location in a hunt.
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput, Dimensions, Switch} from 'react-native';
import { useState} from 'react';
import {FlatList, ImageBackground } from 'react-native';
import * as Styles from "../Styles/ScavengerHuntStyles.js";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postRequest } from '../Fetch.js';

export function HuntLocation({route, navigation}){
    const updateLocation = () => {

    }

    const deleteLocation = () => {

    }

    const updateLocationPosition = () => {

    }
    return (<View>
        <Text>Change your hunt location</Text>
    </View>)
}