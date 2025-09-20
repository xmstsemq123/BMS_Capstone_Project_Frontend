import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAllHomeData, setBalanceCurrent, setBalanceStatus, setRelayStatus, setSystemCurrent } from "../../features/RouteData/HomeData";
import { GET_NEWEST_MEAN_DATA, GET_CELL_ALL_DATA, GET_BALANCE_AND_RELAY } from "../../Public/APIUrl";
import { setIs_Error, setErrMsg } from "../../features/Error/ErrorSlice";
import { setCellData, setWholeCurrentValue } from "../../features/CellAllData/CellAllDataSlice";

export default function HomeDataFetch() {
    const is_MainPage_Rendered = useSelector((state) => state.isRendered.is_MainPage_Rendered)
    const CellDataArray = useSelector((state) => state.cellAllData.CellDataArray)
    const dispatch = useDispatch()
    const setErrorMsg = (data) => {
        dispatch(setIs_Error(true))
        dispatch(setErrMsg(data))
    }
    // fetch home data
    useEffect(() => {
        if (is_MainPage_Rendered) return
        fetch(GET_NEWEST_MEAN_DATA + "?c=voltage&c=temperature&c=SOC&c=SOH")
            .then(res => res.json())
            .then(data => {
                data = JSON.parse(data)
                let status = data["status"]
                if (status != "Success") {
                    setErrorMsg('伺服器連線失敗！')
                    return
                }
                let voltage_mean_value = data["voltage"]
                let temperature_mean_value = data["temperature"]
                let SOC_mean_value = data["SOC"]
                let SOH_mean_value = data["SOH"]
                dispatch(setAllHomeData({
                    voltage: voltage_mean_value,
                    current: 0,
                    temperature: temperature_mean_value,
                    SOC: SOC_mean_value,
                    SOH: SOH_mean_value
                }))
            })
            .catch(err => {
                setErrorMsg("err: 與伺服器連線時發生錯誤")
            })
    }, [])
    // get cell all data
    useEffect(() => {
        if(is_MainPage_Rendered) return
        fetch(GET_CELL_ALL_DATA)
        .then(res => res.json())
        .then(data => {
            data = JSON.parse(data)
            if(data["status"] != "success"){
                setErrorMsg("err: 與資料庫取得所有元件資料時發生錯誤")
            }
            let current = data["current"]
            current = Math.round(current * 10) / 10
            dispatch(setWholeCurrentValue(current))
            let collections = ["voltage", "temperature", "SOC", "SOH"]
            for(let i=0; i<16; i++){
                let cellData = { cellNumber: i }
                let cellName = `cell_${i}`
                collections.forEach((collection_name)=>{
                    let value = data[collection_name][cellName]
                    value = Math.round(value * 10) /10
                    cellData[collection_name] = value
                })
                dispatch(setCellData(cellData))
            }
        })
        .catch(err => {
            setErrorMsg("err: 與伺服器連線時發生錯誤")
        })
    })
    // get relay and balance data
    useEffect(() => {
        if(is_MainPage_Rendered) return
        fetch(GET_BALANCE_AND_RELAY)
        .then(res => res.json())
        .then(data => {
            data = JSON.parse(data)
            dispatch(setRelayStatus(data["relay"]))
            dispatch(setBalanceStatus(data["balance"]))
            dispatch(setBalanceCurrent(data["BalanceCurrent"]))
            dispatch(setSystemCurrent(data["SystemCurrent"]))
        })
    })
}