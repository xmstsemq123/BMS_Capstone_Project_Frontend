import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setErrMsg, setIs_Error } from "../../features/Error/ErrorSlice"
import { GET_NOTIFICATION_DATA } from "../../Public/APIUrl"
import { insertBackReadMsg, insertBackUnreadMsg } from "../../features/Notification/NotificationSlice"

export default function NotificationDataFetch() {
    const dispatch = useDispatch()
    const setErrorMsg = (data) => {
        dispatch(setIs_Error(true))
        dispatch(setErrMsg(data))
    }
    const { is_MainPage_Rendered } = useSelector((state) => state.isRendered)
    const hasFetchedRef = useRef(false)
    useEffect(() => {
        if (hasFetchedRef.current || is_MainPage_Rendered) return;
        hasFetchedRef.current = true;
        fetch(GET_NOTIFICATION_DATA)
            .then(res => res.json())
            .then(data => {
                data = JSON.parse(data)
                if (data["status"] != "success") {
                    setErrorMsg("獲取通知訊息時出現問題！")
                    return
                }
                if (Object.prototype.toString.call(data["data"]) != "[object Array]") return
                data["data"].forEach((item) => {
                    if (item["is_read"] == true)
                        dispatch(insertBackReadMsg(item))
                    else
                        dispatch(insertBackUnreadMsg(item))
                })
            })
            .catch(err => {
                setErrorMsg("獲取通知訊息時出現問題！")
            })
    }, [is_MainPage_Rendered])
}