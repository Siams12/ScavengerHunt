import { configureStore } from '@reduxjs/toolkit'
import userReducer from './Models/userSlice.js'
import {combineReducers} from "redux";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, }
from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
const reducers = combineReducers({
Users: userReducer
})

const persistConfig = {
key: 'root',
storage: AsyncStorage,
}
const persistedReducer = persistReducer(persistConfig, reducers)
export const store = configureStore({
reducer: persistedReducer,
devTools: true,
middleware: (getDefaultMiddleware) => getDefaultMiddleware({
serializableCheck: {
ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
},
}),
})