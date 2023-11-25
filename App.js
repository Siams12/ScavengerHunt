//Screens
import { Login } from "./Views/Login.js";
import { Register } from "./Views/Register.js";
import { ScavengerHunt } from "./Views/ScavengerHunt.js";
import { SplashScreen } from "./Views/SplashScreen.js";
import { MaterialIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store.js";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { ActivityIndicator, Button } from "react-native";
import { navButton } from "./Components.js";
import { HuntDetails } from "./Views/HuntDetails.js";
import { HuntLocation } from "./Views/HuntLocation.js";
import { LocationConditions } from "./Views/LocationConditions.js";
import { useNavigation } from "@react-navigation/native";
import { addToken } from "./Models/userSlice.js";
const persistor = persistStore(store);
const Stack = createNativeStackNavigator();
function logoutButton() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = () => {
    dispatch(addToken(0));
    navigation.reset({
      index: 0,
      routes: [{ name: "SplashScreen" }],
    });
  };

  return (
    <MaterialIcons.Button name="logout" onPress={handleLogout}>
      Logout
    </MaterialIcons.Button>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen
              name="ScavengerHunt"
              component={ScavengerHunt}
              options={{
                headerRight: () => logoutButton()
                      }
                    }
                />
            <Stack.Screen name="HuntDetails" component={HuntDetails} />
            <Stack.Screen name="HuntLocation" component={HuntLocation} />
            <Stack.Screen name="LocationConditions" component={LocationConditions} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
