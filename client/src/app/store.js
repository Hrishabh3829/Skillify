import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'

export const appStore = configureStore({
    reducer:{
        auth:authReducer
    }
});
