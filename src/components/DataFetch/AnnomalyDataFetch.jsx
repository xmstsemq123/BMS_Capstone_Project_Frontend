import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { insertBackOneHistoryAnnomalyData, setHistoryAnnomalyData } from "../../features/RouteData/AnnomalyData";
import { POST_ANNOMALY_DATA, POST_LOAD_MORE_ANNOMALY_DATA } from "../../Public/APIUrl";
import { setErrMsg, setIs_Error } from "../../features/Error/ErrorSlice";
import { current } from "@reduxjs/toolkit";
import { setStatusOfLoadMoreAnnomalyData } from "../../features/Annomaly/AnnomalySlice";
export default function AnnomalyDataFetch() {
    const dispatch = useDispatch()
    const setErrorMsg = (data) => {
        dispatch(setIs_Error(true))
        dispatch(setErrMsg(data))
    }
    const is_MainPage_Rendered = useSelector((state) => state.isRendered.is_MainPage_Rendered)
    // fetch annomaly data when page rendered
    useEffect(() => {
        if (is_MainPage_Rendered) return
        return async () => {
            fetch(POST_ANNOMALY_DATA, {
                method: 'POST'
            })
                .then(res => res.json())
                .then(data => {
                    data = JSON.parse(data)
                    if (data["class_code"] != '2'
                        || data["content_type"] != "annomaly_data"
                        || Object.prototype.toString.call(data["data"]) != "[object Array]") {
                        setErrorMsg("向伺服器讀取警報資料格式不正確！")
                        return
                    }
                    let annomalyData = data["data"]
                    if (annomalyData.length == 0) return
                    dispatch(setHistoryAnnomalyData(annomalyData))
                })
                .catch(() => {
                    setErrorMsg("向伺服器讀取警報資料失敗！")
                })
        }
    })
    // check if it needs load more annomaly data
    const { loadMoreAnnomalyData, statusOfLoadMoreAnnomalyData } = useSelector((state) => state.annomaly)
    const { historyData } = useSelector((state) => state.annomalyData)
    useEffect(() => {
        if (loadMoreAnnomalyData != true || statusOfLoadMoreAnnomalyData != "no") return
        dispatch(setStatusOfLoadMoreAnnomalyData("loading"))
        const theOldestHistoryData = historyData[historyData.length - 1]
        const theOldestDataTimestamp = theOldestHistoryData["timestamp"]
        fetch(POST_LOAD_MORE_ANNOMALY_DATA, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                timestamp: theOldestDataTimestamp
            })
        })
        .then(res => res.json())
        .then(data => {
            data = JSON.parse(data)
            if(data["status"] != "success")
                setErrorMsg("獲取更多警報資料時發生錯誤！")
            let dataArray = []
            data["data"].forEach((item) => {
                dataArray.push({
                    dataType: item["dataType"],
                    timestamp: item["timestamp"]["$date"],
                    message: item["message"]
                })
            })
            dispatch(insertBackOneHistoryAnnomalyData(dataArray))
            dispatch(setStatusOfLoadMoreAnnomalyData("done"))
        })
    }, [loadMoreAnnomalyData])
}