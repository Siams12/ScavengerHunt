import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
const userSlice = createSlice({
name: 'users',
initialState: {
value: 0
},
reducers: 
{
    addToken: (state, action) => {
        state.value = action.payload;
        }
    
    }
    })
    export const { addToken} = userSlice.actions
    export default userSlice.reducer