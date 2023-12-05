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
import ConfettiCannon from 'react-native-confetti-cannon';
import { huntList } from '../Styles/ScavengerHuntStyles.js';

export function CompletedHunts({navigation, route}){
    const [completedHunts, setCompletedHunts] = useState(route.params.completedHunts);
    const Token = useSelector((state) => state.Users.value);

    const displayHunts = (item, index) => {
        //Display 0% or completion percent
        return(
            <View style={huntList.huntDisplay}>
             <Text>{item.item.completed + "%"}</Text>
            <Text>{item.item.name + "\n"}</Text>
            <Text>GOOD JOB!</Text>
            </View>
        )
    }
    return(<View>

         <FlatList
            data={ completedHunts }
            renderItem={ (item , index) => displayHunts(item, index) }
            keyExtractor={ (item, index) => index }
        />
        <ConfettiCannon count={200} origin={{x: 150, y: -900}} />
    </View>)
}