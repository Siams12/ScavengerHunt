//Page represents a page where the user updates ONE location in a hunt.
import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, Modal, TextInput, TouchableOpacity} from 'react-native';
import { useState} from 'react';
import {FlatList, ImageBackground } from 'react-native';
import * as Styles from "../Styles/ScavengerHuntStyles.js";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postRequest } from '../helpers/Fetch.js';
import { updateLocationPosition } from '../helpers/sharedAPIS.js';
import { huntList } from '../Styles/ScavengerHuntStyles.js';

export function HuntSearch({route, navigation}){
    const Token = useSelector((state) => state.Users.value);
    const [hunts, setHunts] = useState([]);
    const [activeHunts, setActiveHunts] = useState([]);
    const [completedHunts, setCompletedHunts] = useState([]);
    const [search, setSearch] = useState("");
    const findHunts = async () => {
        let result;
        console.log(search);
        if (search !== ""){
            result = await postRequest({token: Token, filter: search}, "findHunts.php");
        }
        else{
        result = await postRequest({token: Token}, "findHunts.php");
        }
        if (result.status === "okay"){
            return result.hunts;
         }
        else{
             setMessage("Error deleting message")
         }
    }

    const displayHunt = (item, index) => {
        //Display 0% or completion percent
        return(
            <View style={huntList.huntDisplay}>
            {item.item.completed == null ? 
            (<TouchableOpacity onPress={() => navigation.navigate("StartHunt", {huntInfo: item.item})}>
            <Text>0%</Text>
            <Text>{item.item.name}</Text>
            </TouchableOpacity>
            )
        : (<TouchableOpacity onPress={() => navigation.navigate("HuntDetailsPlay", {huntInfo: item.item})}>
            <Text>{item.item.completed + "%"}</Text>
            <Text>{item.item.name}</Text>
            </TouchableOpacity>
            )}

            </View>
        )
    }

    const findActiveHunts = async () => {
        result = await postRequest({token: Token}, "findActiveHunts.php");
        if (result.status === "okay"){
            return result.hunts
         }
        else{
             setMessage("Error deleting message")
         }
    }

    const makeHuntLists = async () => {
            let myHunts = await findHunts()
            let myActiveHunts = await findActiveHunts()
            myHunts = myHunts.filter(({huntid}) => !myActiveHunts.some((object) => object.huntid == huntid))
            console.log(myActiveHunts)
            let completedHunts = myActiveHunts.filter(({completed}) => completed == 100);
            myActiveHunts = myActiveHunts.filter(({completed}) => completed != 100);
            console.log(completedHunts);
            setHunts(myHunts)
            setActiveHunts(myActiveHunts);
            setCompletedHunts(completedHunts);
    }

    useEffect(() => {
        (async () => {
           await  makeHuntLists()
        })()}, [])
    return(<View>
        <Text>Hunt Search Screen</Text>
        <Text>All Hunts</Text>
        <FlatList
                style = {{height: 300}}
                data={ hunts }
                renderItem={ (item , index) => displayHunt(item, index) }
                keyExtractor={ (item, index) => index }
            />
        <Text>Your in progress hunts</Text>
        <FlatList
                style = {{height: 200}}
                data={ activeHunts }
                renderItem={ (item , index) => displayHunt(item, index) }
                keyExtractor={ (item, index) => index }
            />
        <TextInput style={{ padding: 8, backgroundColor: '#f5f5f5'}}
            onChangeText={text => setSearch(text)}
            placeholder='Hunt Name'/>
        
        <Button title = "Search" onPress={makeHuntLists}/>
        <Button title = "See Completed Hunts" onPress={() => navigation.navigate("CompletedHunts", {completedHunts: completedHunts})}/> 
    </View>)
}