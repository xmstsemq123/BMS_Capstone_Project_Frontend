import { createSlice } from "@reduxjs/toolkit";

const CellAllDataSlice = createSlice({
    name: 'CellAllData',
    initialState: {
        WholeCurrent: 0.0,
        CellDataArray: [
            { name: 'Cell 1', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 2', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 3', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 4', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 5', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 6', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 7', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 8', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 9', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 10', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 11', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 12', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 13', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 14', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 15', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 },
            { name: 'Cell 16', voltage: 0.0, temperature: 0.0, SOC: 100, SOH: 100 }
        ]
    },
    reducers: {
        // actions.payload = {
        //     cellNumber: 0~15,
        //     voltage: float(),
        //     temperature: float(),
        //     SOC: float(),
        //     SOH: float()
        // }
        setCellData: (state, actions) => {
            let payload = actions.payload
            const { cellNumber, voltage, temperature, SOC, SOH } = payload
            state.CellDataArray[cellNumber].name = `Cell ${cellNumber + 1}`
            state.CellDataArray[cellNumber].voltage = voltage
            state.CellDataArray[cellNumber].temperature = temperature
            state.CellDataArray[cellNumber].SOC = SOC
            state.CellDataArray[cellNumber].SOH = SOH
        },
        // actions.payload = {
        //     collection_name: 'voltage'/'temperature'/'current'/'SOC'/'SOH',
        //     data: {
        //         cell_0: 0.0, ...
        //     }
        // }
        setCollectionCellsData: (state, actions) => {
            let collection_name = actions.payload["collection_name"]
            if(!["voltage", "temperature", "SOC", "SOH", "current"].includes(collection_name))
                throw TypeError("collection_name in parameter in setCollectionCellsData() must be one of 'voltage'/'temperature'/'current'/'SOC'/'SOH' !")
            let data = actions.payload["data"]
            if(collection_name == "current"){
                state.WholeCurrent = data
                return
            }
            for(let i=0; i<state.CellDataArray.length; i++){
                let cellNameKey = `cell_${i}`
                state.CellDataArray[i][collection_name] = data[cellNameKey]
            }
        },
        setWholeCurrentValue: (state, actions) => {
            state.WholeCurrent = actions.payload
        }
    }
})

export const { setCellData, setWholeCurrentValue, setCollectionCellsData } = CellAllDataSlice.actions
export default CellAllDataSlice.reducer