import { setVoltage, setCurrent, setTemperature, setSOC, setSOH } from "../../../features/RouteData/HomeData";
import { setIs_Error, setErrMsg } from "../../../features/Error/ErrorSlice";
import { setCellChargeInfo } from "../../../features/RouteData/AnalyticsData";
import { insertFrontOneHistoryAnnomalyData, setIs_newAnnomalyData, setNewAnnomalyData } from "../../../features/RouteData/AnnomalyData";
import { setCollectionCellsData } from "../../../features/CellAllData/CellAllDataSlice";
import { setServerDetailBounds } from "../../../features/Threshold/ThresholdSlice";
import { useSelector } from "react-redux";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { insertFrontUnreadMsg } from "../../../features/Notification/NotificationSlice";

dayjs.extend(utc)
dayjs.extend(timezone)
export default function ProcessSubscribeChangeData(rawData, dispatch) {
    const setErrorMsg = (data) => {
        dispatch(setIs_Error(true))
        dispatch(setErrMsg(data))
    }
    let DataClassCode = rawData["class_code"]
    let DataContentType = rawData["content_type"]
    if (typeof (DataClassCode) != "string" || typeof (DataContentType) != "string") {
        setErrorMsg("伺服器回傳資料格式不正確！")
        return
    }
    switch (DataClassCode) {
        case '0': {
            ClassCode0_HomePage_Data_Process(rawData)
            let collection_name = rawData["collection_name"]
            let rawCellsData = rawData["rawData"]
            let supportedCollection = ["voltage", "current", "temperature", "SOC", "SOH"]
            if(!supportedCollection.includes(collection_name)) return
            dispatch(setCollectionCellsData({
                'collection_name': collection_name,
                'data': rawCellsData
            }))
            break
        }
        case '1': {
            ClassCode1_Analytics_Data_Process(rawData)
            break
        }
        case '2': {
            ClassCode2_Annomaly_Data_Process(rawData)
            break
        }
        case '3': {
            ClassCode3_Threshold_Data_Process(rawData)
            break
        }
        case '4': {
            ClassCode4_Notification_Data_Process(rawData)
            break
        }
    }

    function ClassCode0_HomePage_Data_Process(data) {
        let collection_name = data["collection_name"]
        let new_value = data["data"]
        switch (collection_name) {
            case 'voltage': {
                dispatch(setVoltage(new_value))
                break
            }
            case 'current': {
                dispatch(setCurrent(new_value))
                break
            }
            case 'temperature': {
                dispatch(setTemperature(new_value))
                break
            }
            case 'SOC': {
                dispatch(setSOC(new_value))
                break
            }
            case 'SOH': {
                dispatch(setSOH(new_value))
                break
            }
        }
    }

    function ClassCode1_Analytics_Data_Process(data) {
        let chargingIndex = data["data"]["chargingIndex"]
        let dischargingIndex = data["data"]["dischargingIndex"]
        dispatch(setCellChargeInfo({
            'chargingIndex': chargingIndex,
            'dischargingIndex': dischargingIndex
        }))
    }

    function ClassCode2_Annomaly_Data_Process(rowdata) {
        let { class_code, content_type, data, dataType, timestamp } = rowdata
        if (class_code != '2'
            || content_type != "change_data"
            || Object.prototype.toString.call(data) != "[object Array]"
            || typeof (timestamp.$date) != "string"
            || !["voltage", "current", "temperature"].includes(dataType)
        ) {
            setErrorMsg("伺服器回傳資料格式不正確！")
            return
        }
        timestamp = timestamp.$date
        let dataArray = []
        data.forEach((item) => {
            dataArray.push({
                'dataType': dataType,
                'timestamp': dayjs.utc(timestamp).tz('Asia/Taipei').toISOString(),
                'message': item
            })
        })
        dispatch(insertFrontOneHistoryAnnomalyData(dataArray))
    }

    function ClassCode3_Threshold_Data_Process(rawdata){
        for(let typeName in rawdata["data"]){
            for(let level in rawdata[typeName]){
                let bound = rawdata[typeName][level]
                console.log(rawdata)
                console.log(bound)
                bound.forEach((value, index) => {
                    if(value >= 9999) setServerDetailBounds({
                        'type': typeName,
                        'level': level,
                        'index': index,
                        'value': Infinity
                    })
                    else if(value <= -9999) setServerDetailBounds({
                        'type': typeName,
                        'level': level,
                        'index': index,
                        'value': -Infinity
                    })
                    else setServerDetailBounds({
                        'type': typeName,
                        'level': level,
                        'index': index,
                        'value': value
                    })
                })
            }
        }
    }

    function ClassCode4_Notification_Data_Process(rawdata){
        let data = rawdata["data"]
        dispatch(insertFrontUnreadMsg(data))
    }
}