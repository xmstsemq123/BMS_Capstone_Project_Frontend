import { createSlice } from "@reduxjs/toolkit";

const UserPasswordSettingSlice = createSlice({
    name: 'UserPasswordSetting',
    initialState: {
        is_submit: false,
        submitStatus: 'no', //'no'/'submitting'/'done'
        is_success: false,
        is_Error: false,
        errorMsg: '',
        oldPassword: '',
        newPassword: ''
    },
    reducers: {
        setOldPassword: (state, actions) => {
            let payload = actions.payload
            if (typeof (payload) != 'string'
            ) throw TypeError("Parameter in setOldPassword must be a dictionary that contains string!")
            state.oldPassword = payload
        },
        setNewPassword: (state, actions) => {
            let payload = actions.payload
            if (typeof (payload) != 'string'
            ) throw TypeError("Parameter in setNewPassword must be a dictionary that contains string!")
            state.newPassword = payload
        },
        setIs_submit: (state, actions) => {
            let payload = actions.payload
            if (typeof (payload) != 'boolean'
            ) throw TypeError("Parameter in setIs_submit must be a boolean value!")
            state.is_submit = payload
        },
        setSubmitStatus: (state, actions) => {
            let payload = actions.payload
            if(!["no", "submitting", "done"].includes(payload))
                throw TypeError("Parameter in setSubmitStatus must be one of 'no'/'submitting'/'done'!")
            if(payload == "done"){
                state.is_submit = false
                state.submitStatus = "no"
                return
            }
            state.submitStatus = payload
        },
        setPasswordIs_Error: (state, actions) => {
            let payload = actions.payload
            if (typeof (payload) != 'boolean'
            ) throw TypeError("Parameter in setIs_Error must be a boolean value!")
            if(payload == false)
                state.errorMsg = ""
            state.is_Error = payload
        },
        setPasswordErrorMsg: (state, actions) => {
            let payload = actions.payload
            if (typeof (payload) != 'string'
            ) throw TypeError("Parameter in setErrorMsg must be a string!")
            state.errorMsg = payload
        },
        setIs_success: (state, actions) => {
            state.is_success = actions.payload
        }
    }
})
export const { setOldPassword, setNewPassword,
    setIs_submit, setPasswordIs_Error, setIs_success,
    setSubmitStatus, setPasswordErrorMsg
 } = UserPasswordSettingSlice.actions
export default UserPasswordSettingSlice.reducer