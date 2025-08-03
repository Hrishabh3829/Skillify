import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: null,
    isAuthenticated: false
}
const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.user = action.payload.user
            state.isAuthenticated = true
        },
        useLoggedOut: (state) => {
            state.user = null;
            state.isAuthenticated = false
        }
    }
})

export const { userLoggedIn, useLoggedOut } = authSlice.actions
export default authSlice.reducer