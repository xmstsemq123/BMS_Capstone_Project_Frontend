import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loginState: false,
        userInfo: {
            username: null,
            userID: null
        },
        access_token: null
    },
    reducers: {
        setUser: (state, actions) => {
            let payload = actions.payload
            let username = payload.userInfo.username
            let userID = payload.userInfo.userID
            let access_token = payload.access_token
            state.loginState = payload.loginState
            state.userInfo = {
                username: username,
                userID: userID
            }
            state.access_token = access_token
            localStorage.setItem('username', username)
            localStorage.setItem('userID', userID)
            localStorage.setItem('access_token', access_token)
        },
        logout: (state) => {
            state.loginState = false,
            state.userInfo = {
                username: null,
                userID: null
            },
            state.access_token = null
        }
    }
})

export const { setUser, logout } = userSlice.actions
export default userSlice.reducer