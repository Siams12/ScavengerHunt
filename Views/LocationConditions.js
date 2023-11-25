import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput, Dimensions, Switch, Alert} from 'react-native';
import { useState} from 'react';
import {FlatList, ImageBackground } from 'react-native';
import * as Styles from "../Styles/ScavengerHuntStyles.js";
import { getLocations } from '../helpers/sharedAPIS.js';
import { postRequest } from '../helpers/Fetch.js';
import { useDispatch, useSelector } from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import { useEffect } from 'react';
export function LocationConditions({route, navigation}){
    const locationData = route.params.locationData;
    const Token = useSelector((state) => state.Users.value);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showStartClock, setShowStartClock] = useState(false);
    const [showEndClock, setShowEndClock] = useState(false);
    const [message, setMessage] = useState("");
    const [currentConditions, setCurrentConditions] = useState([]);
    const [locations, setLocations] = useState([]);
    const [locationCondition, setLocationCondition] = useState(null);
    const [locationMessage, setLocationMessage] = useState(null);
    const onChangeStart = (event, selected) => {
        if (selected) {
          setStartTime(selected);
        }
        console.log("Start set");
        setShowStartClock(false);
      };
    const onChangeEnd = (event, selected) => {
        if (selected) {
          setEndTime(selected);
        }
        setShowEndClock(false);
      };
    const getAllLocations = async (huntID) => {
        let locations = await getLocations(Token, huntID);
        if(locations){
            console.log(locations);
            setLocations(locations);
        }else{
            setLocationMessage("Error grabbing locations"); 
        }
    }
    const getConditions = async () => {
        let result = await postRequest({locationid: locationData.locationid, token: Token}, "getConditions.php");
        if (result.status ==="okay"){
            result.conditions.map((condition) => {
                //Convert each time back from UTC to local time.
                if (condition.starttime){
                let start = condition.starttime.split(":");
                let end = condition.endtime.split(":")
                let now = new Date();

                const startUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDay(),
                Number(start[0]), Number(start[1]), 0);
                const endUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDay(),
                Number(end[0]), Number(end[1]), 0);
                start = new Date(startUTC);
                end = new Date(endUTC);
                condition.starttime = start.getHours()   + ":" + start.getMinutes() + ":" + "00";
                condition.endtime = end.getHours()  + ":" + end.getMinutes() + ":" + "00"
                return condition;
                }
            }
            )
            setCurrentConditions(result.conditions);
        }
        else{
            setLocationMessage("Error grabbing conditions");
        }
    }
    //Display either location id or times.
    const displayConditions = (item, Index) => {
        return (<View>
            {item.item.starttime ? 
            (<View><Text>{"starttime: " + item.item.starttime + " endtime: " + item.item.endtime} </Text>
            <Button title = "Update Time" onPress={() => {updateConditionTime(item.item.conditionid)}}/>
            </View>)
            : 
            (<View><Text>{item.item.requiredlocationid}</Text>
            <Button title = "Update Location" onPress={() => {updateConditionLocation(item.item.conditionid)}}/></View>
            )}
            <Button title = "Delete" onPress={() => {deleteCondition(item.item.conditionid)}}/>
            <View style={{width: '100%',
                height: 1,
                backgroundColor: 'black', // Change the color as needed
                marginVertical: 10, // Adjust the margin as needed
            }}/>
            </View>)
    }

    const addConditionLocation = async () => {
       
        if (locationCondition){
            let result = await postRequest({locationid: locationData.locationid, token: Token, requiredlocationid: locationCondition, starttime: null, endtime: null}, "addCondition.php");
            if (result.status === "okay"){
                setMessage("Condition added!")
            }
            else{
                console.log(result);
                setMessage("Condition not added please double check.");
            }
        }
        else{
            setMessage("Condition not added please double check.");
        }
    }

    const addConditionTime = async () => {
        if (startTime < endTime){
            const utcStartTime = startTime.getUTCHours() + ":" + startTime.getUTCMinutes() + ":" + "00"
            const utcEndTime = endTime.getUTCHours() + ":" + endTime.getUTCMinutes() + ":" + "00"
            console.log("start" + utcStartTime)
            console.log("end" + utcEndTime);
            let result = await postRequest({locationid: locationData.locationid, token: Token, starttime: utcStartTime, endtime: utcEndTime, requiredlocationid: null},  "addCondition.php");
            if (result.status === "okay"){
                setMessage("Condition added!")
            }
            else{
                setMessage("Condition not added please double check.");
            }
        }
    }



    const updateConditionLocation = async (conditionid) => {
        let result = await postRequest({token: Token, conditionid: conditionid, requiredlocationid: locationCondition, starttime: null, endtime: null}, "updateCondition.php")
        if (result.status === "okay"){
            setMessage("Condition updated");
        }
        else{
            setMessage("Condition failed to update.")
        }
    }

    const updateConditionTime = async (conditionid) => {
        const utcStartTime = startTime.getUTCHours() + ":" + startTime.getUTCMinutes() + ":" + "00"
        const utcEndTime = endTime.getUTCHours() + ":" + endTime.getUTCMinutes() + ":" + "00"
        console.log(utcStartTime);
        let result = await postRequest({token: Token, conditionid: conditionid, starttime: utcStartTime, endtime: utcEndTime, requiredlocationid: null}, "updateCondition.php")
        if (result.status === "okay"){
            setMessage("Condition updated");
        }
        else{
            setMessage("Condition failed to update.")
        }
    }

    const deleteCondition = async (conditionid) => {
        let result = await postRequest({conditionid: conditionid, token: Token}, "deleteCondition.php");
        if (result.status === "okay"){
            setMessage("Location deleted");
        }
        else{
            setMessage("Location delete failed");
        }
    }
    
    useEffect(() => {
        (async () => {
            await getAllLocations(route.params.huntID);
            await getConditions();
        })()}, [message])

    return (<View>
        <Text style = {{    
        fontSize: 24, // Adjust the font size as needed
        fontWeight: 'bold',
        }}>Current conditions</Text>
        
        <FlatList
                data={ currentConditions }
                renderItem={ (item , index) => displayConditions(item, index) }
                keyExtractor={ (item, index) => index }
            />
       
        <Button onPress={() => setShowStartClock(true)} title="Set start time" />
        {showStartClock && ( <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selected) => onChangeStart(event, selected)}
        />)}

        <Button onPress={() => setShowEndClock(true)} title="Set end time" />
        {showEndClock && ( <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selected) => onChangeEnd(event, selected)}
        />
        )}

        <Picker
        selectedValue={locationCondition}
        onValueChange={(itemValue, itemIndex) => {
            setLocationCondition(itemValue)
        }
        }>
        {locations.map(function (location, index) {
            if (location.locationid != locationData.locationid) {
                    console.log(location.name);
                   return (
                    <Picker.Item key={index} label={location.name} value={location.locationid} />
                   )
            }
        })}
        </Picker>
        <Button onPress={addConditionLocation} title="Add Location"/>
        <Button onPress={addConditionTime} title = "Add Time"/>
        <Text>{message}</Text>
        </View>)
}