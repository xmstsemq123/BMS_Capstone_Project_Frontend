import { createSlice } from "@reduxjs/toolkit";

const AnnmalyDataSlice = createSlice({
    name: 'annomalyData',
    initialState: {
        is_newData: false,
        newData: [],
        historyData: []
    },
    reducers: {
        //------ History annomaly data ------//
        //--- Set all data ---//
        setHistoryAnnomalyData: (state, actions) => {
            let payload = actions.payload
            if (Object.prototype.toString.call(payload) != "[object Array]" ) 
                throw TypeError("Each of HistoryAnnomalyData must be an Array!")
            state.historyData = payload
        },
        //--- Insert each data ---//
        // actions.payload = [
        //     {
        //         dataType: 'voltage'/'current'/'temperature',
        //         timestamp: str(),
        //         message: str()
        //     }, ...
        // ]
        insertBackOneHistoryAnnomalyData: (state, actions) => {
            let dataArray = actions.payload
            if (Object.prototype.toString.call(dataArray) != "[object Array]") 
                throw TypeError(`Annomaly data in insertBackOneHistoryAnnomalyData() must be an Array!`)
            state.historyData.push(...dataArray)
        },
        insertFrontOneHistoryAnnomalyData: (state, actions) => {
            let dataArray = actions.payload
            if (Object.prototype.toString.call(dataArray) != "[object Array]") 
                throw TypeError(`Annomaly data in insertFrontOneHistoryAnnomalyData() must be an Array!`)
            state.historyData.unshift(...dataArray)
        },
        //------ New annomaly data ------//
        //--- Set each data ---//
        // actions.payload = [
        //     {
        //         dataType: 'voltage'/'current'/'temperature',
        //         timestamp: str(),
        //         message: str()
        //     }, ...
        // ]
        setNewAnnomalyData: (state, actions) => {
            let dataArray = actions.payload
            if (Object.prototype.toString.call(dataArray) != "[object Array]") 
                throw TypeError(`Prarmeter in setOneNewAnnomalyData must be an Array!`)
            let is_dataArrayLength_largerThan0 = dataArray.length > 0
            if (is_dataArrayLength_largerThan0) state.is_newData = true
            if(state.is_newData){
                state.historyData.unshift(...state.newData)
                state.newData = []
            }
            state.newData = dataArray
            state.is_newData = true
        },
        //--- Clear each data ---//
        clearNewAnnomalyData: (state) => {
            state.historyData.unshift(...state.newData)
            state.newData = []
            state.is_newData = false
        },
        setIs_newAnnomalyData: (state, actions) => {
            state.is_newData = actions.payload
        }
    }
})

export const { setHistoryAnnomalyData, 
    insertBackOneHistoryAnnomalyData, insertFrontOneHistoryAnnomalyData,
    setNewAnnomalyData, clearNewAnnomalyData, setIs_newAnnomalyData
} = AnnmalyDataSlice.actions
export default AnnmalyDataSlice.reducer