import { createSlice } from "@reduxjs/toolkit";
const HomeData = createSlice({
    name: 'HomeData',
    initialState: {
        voltage: 3.3,
        current: 0,
        temperature: 30,
        SOC: 95,
        SOH: 95,
        CapacitorVoltage: 0.0,
        CapacitorCurrent: 0.0,
        RelayStatus: false,
        SystemCurrent: 0.0,
        BalanceStatus: {},
        BalanceCurrent: {}
    },
    reducers: {
        setAllHomeData: (state, actions) => {
            let payload = actions.payload
            state.voltage = Math.round( payload.voltage*10) / 10
            state.current = Math.round( payload.current*10) / 10
            state.temperature = Math.round( payload.temperature*10) / 10
            state.SOC = Math.round( payload.SOC*10) / 10
            state.SOH = Math.round( payload.SOH*10) / 10
            state.CapacitorCurrent = Math.round( payload.CapacitorCurrent*10) / 10
            state.CapacitorVoltage = Math.round( payload.CapacitorVoltage*10) / 10
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
        },
        setRelayStatus: (state, actions) => {
            state.RelayStatus = actions.payload
        },
        setBalanceStatus: (state, actions) => {
            state.BalanceStatus = actions.payload
        },
        setBalanceCurrent: (state, actions) => {
            state.BalanceCurrent = actions.payload
        },
        setSystemCurrent: (state, actions) => {
            state.SystemCurrent = actions.payload
        },
        setCapacitorVoltage: (state, actions) => {
            state.CapacitorVoltage = actions.payload
        },
        setCapacitorCurrent: (state, actions) => {
            state.CapacitorCurrent = actions.payload
        }
    }
})
export const { setAllHomeData, setVoltage, setCurrent, 
    setTemperature, setSOC, setSOH, setRelayStatus, setBalanceStatus, setBalanceCurrent, setSystemCurrent,
    setCapacitorCurrent, setCapacitorVoltage
} = HomeData.actions
export default HomeData.reducer