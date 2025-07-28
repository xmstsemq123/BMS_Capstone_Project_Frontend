import { createSlice } from "@reduxjs/toolkit";
const AnalyticsData = createSlice({
    name: 'AnalyticsData',
    initialState: {
        graphInfo: {
            SOC: {
                GraphScale: 'overall',
                TimeScale: '0'
            },
            SOH: {
                GraphScale: 'overall',
                TimeScale: '0'
            },
            Temperature: {
                GraphScale: 'overall',
                TimeScale: '0'
            },
            Voltage: {
                GraphScale: 'overall',
                TimeScale: '0'
            },
            Current: {
                TimeScale: '0'
            }
        },
        graphData: {
            SOC: [],
            Temperature: [],
            Voltage: [],
            Current: [],
            SOH: []
        },
        cellChargeInfo: {
            chargingIndex: 0,
            dischargingIndex: 1
        }
    },
    reducers: {
        // setting graph info
        setSOCGraphInfo: (state, actions) => {
            state.graphInfo.SOC.GraphScale = actions.payload.GraphScale
            state.graphInfo.SOC.TimeScale = actions.payload.TimeScale
        },
        setTemperatureGraphInfo: (state, actions) => {
            state.graphInfo.Temperature.GraphScale = actions.payload.GraphScale
            state.graphInfo.Temperature.TimeScale = actions.payload.TimeScale
        },
        setVoltageGraphInfo: (state, actions) => {
            state.graphInfo.Voltage.GraphScale = actions.payload.GraphScale
            state.graphInfo.Voltage.TimeScale = actions.payload.TimeScale
        },
        setCurrentGraphInfo: (state, actions) => {
            state.graphInfo.Current.TimeScale = actions.payload.TimeScale
        },
        setSOHGraphInfo: (state, actions) => {
            state.graphInfo.SOH.TimeScale = actions.payload.TimeScale
        },
        // setting graph data
        setSOCGraphData: (state, actions) => {
            state.graphData.SOC = actions.payload
        },
        setSOHGraphData: (state, actions) => {
            state.graphData.SOH = actions.payload
        },
        setTemperatureGraphData: (state, actions) => {
            state.graphData.Temperature = actions.payload
        },
        setVoltageGraphData: (state, actions) => {
            state.graphData.Voltage = actions.payload
        },
        setCurrentGraphData: (state, actions) => {
            state.graphData.Current = actions.payload
        },
        // setting cell charge info
        setCellChargeInfo: (state, actions) => {
            state.cellChargeInfo.chargingIndex = actions.payload.chargingIndex
            state.cellChargeInfo.dischargingIndex = actions.payload.dischargingIndex
        }
    }
})

export const { setSOCGraphInfo, setTemperatureGraphInfo, setVoltageGraphInfo, setCurrentGraphInfo,
    setSOCGraphData, setTemperatureGraphData, setVoltageGraphData, setCurrentGraphData, 
    setSOHGraphInfo, setSOHGraphData,
    setCellChargeInfo
 } = AnalyticsData.actions
export default AnalyticsData.reducer