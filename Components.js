import { StyleSheet, Text, View, Image, Button, TextInput, Dimensions } from 'react-native';
import { Foundation } from '@expo/vector-icons'; 
import {useNavigation} from '@react-navigation/native'
export const navButton = (Page) => {
    const navigation = useNavigation()
    return(
    <Foundation.Button name="page" onPress={() => navigation.navigate(Page)}>
        {Page}
        </Foundation.Button>
    )
}


