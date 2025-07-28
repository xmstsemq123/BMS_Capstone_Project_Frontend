import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPermission } from "../../features/DesktopNotification/DesktopNotification";

function sendNotification() {
    new Notification('🔔 你有一則新通知', {
        body: '這是來自 React 的桌面通知內容！',
        icon: ''  // 可換成你自己的圖片
    });
}

export default function DesktopNotification() {
    const { is_MainPage_Rendered } = useSelector(state => state.isRendered)
    const is_firstSend = useRef(false)
    const dispatch = useDispatch()
    //------ check permission when use enter website ------//
    useEffect(() => {
        if (is_MainPage_Rendered || is_firstSend.current) return
        is_firstSend.current = true
        if (!('Notification' in window)) return
        if (Notification.permission != 'default'){
            dispatch(setPermission(Notification.permission))
            return
        }
        Notification.requestPermission().then(permission => {
            dispatch(setPermission(permission))
        });
    }, [is_MainPage_Rendered])
}