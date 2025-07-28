import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setSOCGraphData, setTemperatureGraphData, setVoltageGraphData, setCurrentGraphData,
    setCellChargeInfo,
    setSOHGraphData
} from '../../features/RouteData/AnalyticsData'
import { setIs_Error, setErrMsg } from "../../features/Error/ErrorSlice";
import { POST_GRATH_DATA, GET_ANALYTICS_DATA } from "../../Public/APIUrl";

export default function AnalyticsDataFetch() {
    const dispatch = useDispatch()
    //------ isRendered ------//
    const is_MainPage_Rendered = useSelector((state) => state.isRendered.is_MainPage_Rendered)
    //------ datas from slice ------//
    const graphInfo = useSelector((state) => state.analyticsData.graphInfo)
    //------ graph scale ------//
    const selectedCellSOC = graphInfo.SOC.GraphScale
    const selectedCellSOH = graphInfo.SOH.GraphScale
    const selectedTempCell = graphInfo.Temperature.GraphScale
    const selectedVolCell = graphInfo.Voltage.GraphScale
    //------ time scale ------//
    const SOCTimeScale = graphInfo.SOC.TimeScale
    const SOHTimeScale = graphInfo.SOH.TimeScale
    const TempTimeScale = graphInfo.Temperature.TimeScale
    const VolTimeScale = graphInfo.Voltage.TimeScale
    const CurrentTimeScale = graphInfo.Current.TimeScale
    //------ setting graph data functions ------//
    const setSOCData = (data) => dispatch(setSOCGraphData(data))
    const setSOHData = (data) => dispatch(setSOHGraphData(data))
    const setTempData = (data) => dispatch(setTemperatureGraphData(data))
    const setVolData = (data) => dispatch(setVoltageGraphData(data))
    const setCurrentData = (data) => dispatch(setCurrentGraphData(data))
    //------ srting cell charge info functions ------//
    const setChargingIndexInfo = (data) => dispatch(setCellChargeInfo(data))
    //------ Graph data fetch ------//
    useEffect(() => {
        const payload = {
            Graph_Scale: {
                SOC: selectedCellSOC,
                SOH: selectedCellSOH,
                temperature: selectedTempCell,
                voltage: selectedVolCell,
                current: "OneValue"
            },
            Time_Scale: {
                SOC: SOCTimeScale,
                SOH: SOHTimeScale,
                temperature: TempTimeScale,
                voltage: VolTimeScale,
                current: CurrentTimeScale
            }
        }
        fetch(POST_GRATH_DATA, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                data = JSON.parse(data)
                if (data['status'] != 'Success') {
                    dispatch(setIs_Error(true))
                    dispatch(setErrMsg('抓取Graph資料時發生錯誤！'))
                    return
                }
                setSOCData(data["SOC"])
                setTempData(data["temperature"])
                setVolData(data["voltage"])
                setCurrentData(data["current"])
                setSOHData(data["SOH"])
            })
            .catch(err => {
                dispatch(setIs_Error(true))
                dispatch(setErrMsg("err: 與伺服器連線時發生錯誤"))
            })
    }, [graphInfo])
    //------ Other blocks data fetch ------//
    useEffect(() => {
        if (is_MainPage_Rendered) return
        fetch(GET_ANALYTICS_DATA + "?Charge=true&DischargeRecord=true")
            .then(res => res.json())
            .then(data => {
                data = JSON.parse(data)
                if (data['status'] != "Success") {
                    dispatch(setIs_Error(true))
                    dispatch(setErrMsg('抓取Other blocks資料時發生錯誤！'))
                    return
                }
                let ChargingData = data["Charge"]
                setChargingIndexInfo({
                    chargingIndex: ChargingData["chargingIndex"],
                    dischargingIndex: ChargingData["dischargingIndex"]
                })
            })
            .catch(err => {
                dispatch(setIs_Error(true))
                dispatch(setErrMsg("err: 與伺服器連線時發生錯誤"))
            })
    })
}