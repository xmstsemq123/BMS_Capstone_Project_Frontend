import { createSlice } from "@reduxjs/toolkit";

const navSlice = createSlice({
    name: 'nav',
    initialState: {
        currentNavRouteStatus: '/'
    },
    reducers: {
        setCurrentNavRouteStatus: (state, actions) => {
            state.currentNavRouteStatus = actions.payload
        }
    }
})
export const { setCurrentNavRouteStatus } = navSlice.actions
export default navSlice.reducer