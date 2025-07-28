import { createSlice } from "@reduxjs/toolkit";
const HomeData = createSlice({
    name: 'HomeData',
    initialState: {
        voltage: 3.3,
        current: 0,
        temperature: 30,
        SOC: 95,
        SOH: 95
    },
    reducers: {
        setAllHomeData: (state, actions) => {
            let payload = actions.payload
            state.voltage = Math.round( payload.voltage*10) / 10
            state.current = Math.round( payload.current*10) / 10
            state.temperature = Math.round( payload.temperature*10) / 10
            state.SOC = Math.round( payload.SOC*10) / 10
            state.SOH = Math.round( payload.SOH*10) / 10
        },
        setVoltage: (state, actions) => {
            state.voltage = Math.round( actions.payload*10) / 10
        },
        setCurrent: (state, actions) => {
           state.current =  Math.round( actions.payload*10) / 10
        },
        setTemperature: (state, actions) => {
            state.temperature = Math.round( actions.payload*10) / 10
        },
        setSOC: (state, actions) => {
            state.SOC = Math.round( actions.payload*10) / 10
        },
        setSOH: (state, actions) => {
            state.SOH = Math.round( actions.payload*10) / 10
        }
    }
})
export const { setAllHomeData, setVoltage, setCurrent, setTemperature, setSOC, setSOH } = HomeData.actions
export default HomeData.reducer