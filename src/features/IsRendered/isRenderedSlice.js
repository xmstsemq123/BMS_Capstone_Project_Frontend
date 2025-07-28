import { createSlice } from "@reduxjs/toolkit";

const isRenderedSlice = createSlice({
    name: 'isRendered',
    initialState: {
        is_MainPage_Rendered: false
    },
    reducers: {
        setIs_MainPage_Rendered: (state, actions) => {
            if(typeof(actions.payload) != "boolean") {
                throw TypeError("is_MainPage_Rendered must be boolean type!")
            }
            state.is_MainPage_Rendered = actions.payload
        }
    }
})

export const { setIs_MainPage_Rendered } = isRenderedSlice.actions
export default isRenderedSlice.reducer