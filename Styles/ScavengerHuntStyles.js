import { StyleSheet, Text, View, Image, Button, TextInput, Dimensions } from 'react-native';


export const styles = StyleSheet.create({
    container: {
      padding: 1,
      backgroundColor: '#fff',
      justifyContent: 'space-between',
      flex: 1
    },
    image: {
      flex: 1,
    }
  });

export const huntList = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
   },
   centerBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center"
  },
  huntDisplay: {
    width: 400,
    height: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'gray',
  },
})

