import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const ThresholdSlice = createSlice({
    name: 'Threashold',
    initialState: {
        is_store: false,
        storeStatus: 'no', // 'no'/'storing'/'done'
        is_refresh: false,
        refreshStatus: 'no', // 'no'/'refreshing'/'done'
        successPromptWindow: false,
        serverBounds: {
            voltage: { normal: [3.0, 3.65], warn: [2.5, 3.0], danger: [-9999, 2.5] },
            current: { normal: [0, 150], warn: [150, 280], danger: [280, 9999] },
            temperature: { normal: [0, 45], warn: [-10, 60], danger: [-9999, 9999] }
        },
        Bounds: {
            voltage: { normal: [3.0, 3.65], warn: [2.5, 3.0], danger: [-9999, 2.5] },
            current: { normal: [0, 150], warn: [150, 280], danger: [280, 9999] },
            temperature: { normal: [0, 45], warn: [-10, 60], danger: [-9999, 9999] }
        }
    },
    reducers: {
        setdefaultValue: (state, actions) => {
            state.serverBounds.voltage = actions.payload.voltage
            state.serverBounds.current = actions.payload.current
            state.serverBounds.temperature = actions.payload.temperature
            state.Bounds.voltage = actions.payload.voltage
            state.Bounds.current = actions.payload.current
            state.Bounds.temperature = actions.payload.temperature
        },
        setServerBounds: (state, actions) => {
            state.serverBounds.voltage = actions.payload.voltage
            state.serverBounds.current = actions.payload.current
            state.serverBounds.temperature = actions.payload.temperature
        },
        setBounds: (state, actions) => {
            state.Bounds.voltage = actions.payload.voltage
            state.Bounds.current = actions.payload.current
            state.Bounds.temperature = actions.payload.temperature
        },
        // actions.payload = {
        //     type: 'voltage'/'current'/'temperature',
        //     level: 'normal'/'warn'/'danger',
        //     index: 0/1,
        //     value: float()
        // }
        setInputValue: (state, actions) => {
            let payload = actions.payload
            if (!["voltage", "current", "temperature"].includes(payload.type)
                || !['normal', "warn", "danger"].includes(payload.level)
                || ![0, 1].includes(payload.index)
            )
                throw TypeError("Please follow the correct Bounds format!")
            state.Bounds[payload.type][payload.level][payload.index] = payload.value
        },
        setServerDetailBounds: (state, actions) => {
            let payload = actions.payload
            if (!["voltage", "current", "temperature"].includes(payload.type)
                || !['normal', "warn", "danger"].includes(payload.level)
                || ![0, 1].includes(payload.index)
            )
                throw TypeError("Please follow the correct Bounds format!")
            state.serverBounds[payload.type][payload.level][payload.index] = payload.value
        },
        setRefresh: (state, actions) => {
            if (typeof (actions.payload) != 'boolean')
                throw TypeError("Parameter in setRefresh must be a boolean value!")
            state.is_refresh = actions.payload
        },
        setStore: (state, actions) => {
            if (typeof (actions.payload) != 'boolean')
                throw TypeError("Parameter in setStore must be a boolean value!")
            state.is_store = actions.payload
        },
        setStoreStatus: (state, actions) => {
            if (!["no", "storing", "done"].includes(actions.payload))
                throw TypeError("Parameter in setStoreStatus must be one of 'no'/'storing'/'done' !")
            if (actions.payload == "done") {
                state.successPromptWindow = true
                state.is_store = false
                state.storeStatus = "no"
                return
            }
            state.storeStatus = actions.payload
        },
        setRefreshStatus: (state, actions) => {
            if (!["no", "refreshing", "done"].includes(actions.payload))
                throw TypeError("Parameter in setRefreshStatus must be one of 'no'/'refreshing'/'done' !")
            if (actions.payload == "done") {
                state.refreshStatus = "no"
                state.is_refresh = false
                return
            }
            state.refreshStatus = actions.payload
        },
        closeSuccessPromptWindow: (state) => {
            state.successPromptWindow = false
        }
    }
})

export const { setdefaultValue, setInputValue,
    setServerBounds, setBounds,
    setRefresh, setStore, setServerDetailBounds,
    setStoreStatus, setRefreshStatus,
    closeSuccessPromptWindow
} = ThresholdSlice.actions
export default ThresholdSlice.reducer