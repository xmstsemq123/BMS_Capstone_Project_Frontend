import { createSlice } from "@reduxjs/toolkit";
import dayjs from 'dayjs';

const FilesSlice = createSlice({
    name: 'FilesSlice',
    initialState: {
        is_clickButton: false,
        is_csv: false,
        is_json: false,
        isDownloadError: false,
        DownloadErrorMsg: '',
        downloadStatus: 'no', // 'no'/'downloading'/'done'
        selectedCollection: [],
        isSelectAll: false,
        startTime: dayjs().subtract(1, 'day').toISOString(),
        endTime: dayjs().toISOString()
    },
    reducers: {
        setIS_ClickButton: (state, actions) => {
            if (typeof (actions.payload) != 'boolean')
                throw TypeError("Parameter in setIS_ClickButton must be a boolean value!")
            state.is_clickButton = actions.payload
        },
        setIs_csv: (state, actions) => {
            if (typeof (actions.payload) != 'boolean')
                throw TypeError("Parameter in setIs_csv must be a boolean value!")
            state.is_csv = actions.payload
        },
        setIs_json: (state, actions) => {
            if (typeof (actions.payload) != 'boolean')
                throw TypeError("Parameter in setIs_json must be a boolean value!")
            state.is_json = actions.payload
        },
        setIs_DownloadError: (state, actions) => {
            if (typeof (actions.payload) != 'boolean')
                throw TypeError("Parameter in setIs_DownloadError must be a boolean value!")
            state.isDownloadError = actions.payload
        },
        setDownloadErrorMsg: (state, actions) => {
            if(typeof(actions.payload) != 'string')
                throw TypeError("Parameter in setDownloadErrorMsg must be a string !")
            state.DownloadErrorMsg = actions.payload
        },
        setDownloadStatus: (state, actions) => {
            if(!["no", "downloading", "done"].includes(actions.payload))
                throw TypeError("Parameter in setDownloadStatus must be one of 'no'/'downloading'/'done' !")
            if(actions.payload == "done"){
                state.is_clickButton = false
                state.downloadStatus = "no"
                return
            }
            state.downloadStatus = actions.payload
        },
        setIsSelectAll: (state, actions) => {
            if (typeof (actions.payload) != 'boolean')
                throw TypeError("Parameter in setIsSelectAll must be a boolean value!")
            state.isSelectAll = actions.payload
        },
        setSelectedCollection: (state, actions) => {
            if (Object.prototype.toString.call(actions.payload) != '[object Array]')
                throw TypeError("Parameter in setSelectedCollection must be an array.")
            state.selectedCollection = actions.payload
        },
        setStartTime: (state, actions) => {
            state.startTime = actions.payload
        },
        setEndTime: (state, actions) => {
            state.endTime = actions.payload
        }
    }
})
export const { setIsSelectAll, setSelectedCollection,
    setStartTime, setEndTime, setIs_DownloadError, setDownloadErrorMsg, 
    setIS_ClickButton, setIs_csv, setIs_json, setDownloadStatus
} = FilesSlice.actions
export default FilesSlice.reducer