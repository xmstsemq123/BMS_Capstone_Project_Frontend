import { createSlice } from "@reduxjs/toolkit";

const AnnomalySlice = createSlice({
    name: 'annomaly',
    initialState: {
        selectedFilter: 'all',
        loadMoreAnnomalyData: false,
        statusOfLoadMoreAnnomalyData: 'no' // 'no'/'loading'/'done'
    },
    reducers: {
        setSelectedFilter: (state, actions) => {
            if(typeof(actions.payload) != 'string'
                || !["all", "voltage", "current", "temperature"].includes(actions.payload)
            ) throw TypeError("Parameter in setSelectedFilter must be 'all'/'voltage'/'ccurent'/'temperature' !")
            state.selectedFilter = actions.payload
        },
        setLoadMoreAnnomalyData: (state, actions) => {
            if(typeof(actions.payload) != "boolean")
                throw TypeError("Paramter of setLoadMoreAnnomalyData must be a boolean value!")
            state.loadMoreAnnomalyData = actions.payload
        },
        setStatusOfLoadMoreAnnomalyData: (state, actions) => {
            if(typeof(actions.payload) != 'string'
                || !["no", "loading", "done"].includes(actions.payload)
            ) throw TypeError("Parameter in setStatusOfLoadMoreAnnomalyData must be 'no'/'loading'/'done' !")
            state.statusOfLoadMoreAnnomalyData = actions.payload
            if(actions.payload == "done"){
                state.statusOfLoadMoreAnnomalyData = "no"
                state.loadMoreAnnomalyData = false
            }
        }
    }
})

export const { setSelectedFilter, 
    setLoadMoreAnnomalyData, setStatusOfLoadMoreAnnomalyData
} = AnnomalySlice.actions
export default AnnomalySlice.reducer