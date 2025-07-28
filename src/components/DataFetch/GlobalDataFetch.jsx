import { useSelector, useDispatch } from "react-redux";
import { setIs_MainPage_Rendered } from "../../features/IsRendered/isRenderedSlice";
import { useEffect, useRef } from "react";
import { GET_THRESHOLD, WS_SUBSCRIBE_CHANGE } from "../../Public/APIUrl";
import { setIs_Error, setErrMsg } from "../../features/Error/ErrorSlice";
import ProcessSubscribeChangeData from "./DataProcess/ProcessSubscribeChangeData";
import { setDefaultOptions } from "date-fns";
import { setdefaultValue } from "../../features/Threshold/ThresholdSlice";
import { updateCurrentTime } from "../../features/NowTime/NowTimeSlice";

export default function GlobalDataFetch(){
    const dispatch = useDispatch()
    const DesktopNotificationPermission = useSelector(state => state.desktopNotification.permission)
    //------ setting error info function ------//
    const setErrorMsg = (data) => {
        dispatch(setIs_Error(true))
        dispatch(setErrMsg(data))
    }
    //------ check if page is first rendered ------//
    const is_MainPage_Rendered = useSelector((state) => state.isRendered.is_MainPage_Rendered)
    useEffect(() => {
        if(is_MainPage_Rendered == false){
            dispatch(setIs_MainPage_Rendered(true))
        } else return
        //--- First time to fetch cell data bound ---//
        fetch(GET_THRESHOLD)
        .then(res => res.json())
        .then(data => {
            data = JSON.parse(data)
            if(data["status"] != "success"){
                setErrorMsg("向伺服器初次獲取警報閥值失敗!")
                return
            }
            let CellDataBound = data["data"]
            dispatch(setdefaultValue(CellDataBound))
        })
        .catch(err => {
            setErrorMsg("向伺服器初次獲取警報閥值失敗!")
        })
    })
    //------ websokcet: subscribe to changing data event in MongoDB ------//
    const ws = useRef(new WebSocket(WS_SUBSCRIBE_CHANGE))
    useEffect(() => {
        ws.current.onopen = () => {
            let client_id = localStorage.getItem('userID')
            let access_token = localStorage.getItem('access_token')
            ws.current.send(JSON.stringify({
                'client_id': client_id,
                'access_token': access_token
            }))
        }
        ws.current.onmessage = (event) =>  {
            let data = JSON.parse(event.data)
            ProcessSubscribeChangeData(data, dispatch, DesktopNotificationPermission)
        }
        ws.current.onerror = (err) => {
            setErrorMsg("最新資料傳遞時發生錯誤，請檢察伺服器！")
        }
        return () => {
            if(ws.current.readyState === WebSocket.OPEN){
                ws.current.close()
            }
        }
    })
    //------ update reference time ------//
    useEffect(() => {
        const updateTime = () => {
            dispatch(updateCurrentTime())
        }
        const interval = setInterval(updateTime, 60 * 1000)
        return () => clearInterval(interval)
    }, [])
}

