import { createSlice } from "@reduxjs/toolkit";

const ErrorSlice = createSlice({
    name: 'error',
    initialState: {
        is_Error: 0,
        ErrMsg: []
    },
    reducers: {
        setIs_Error: (state, actions) => {
            if(typeof(actions.payload) != "boolean") throw TypeError("is_Error must be boolean type")
            if(actions.payload){
                state.is_Error += 1
            }
        },
        setErrMsg: (state, actions) => {
            state.ErrMsg.push(actions.payload)
        }
    }
})

export const { setIs_Error, setErrMsg } = ErrorSlice.actions
export default ErrorSlice.reducer