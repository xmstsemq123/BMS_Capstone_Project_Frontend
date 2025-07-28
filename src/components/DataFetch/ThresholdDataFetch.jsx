import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setErrMsg, setIs_Error } from "../../features/Error/ErrorSlice";
import { setBounds, setdefaultValue, setRefreshStatus, setServerBounds, setStoreStatus } from "../../features/Threshold/ThresholdSlice";
import { GET_THRESHOLD, PUT_THRESHOLD_DATA } from "../../Public/APIUrl";

export default function ThresholdDataFetch() {
    const dispatch = useDispatch()
    const setErrorMsg = (data) => {
        dispatch(setIs_Error(true))
        dispatch(setErrMsg(data))
    }
    const { is_store, storeStatus, is_refresh, refreshStatus, serverBounds, Bounds } = useSelector(state => state.threshold)
    //------ Update threshold ------//
    useEffect(() => {
        if (is_store != true || storeStatus != "no") return
        dispatch(setStoreStatus("storing"))
        fetch(PUT_THRESHOLD_DATA, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Bounds)
        })
            .then(res => res.json())
            .then(data => {
                data = JSON.parse(data)
                if (data["status"] != "success") {
                    setErrorMsg("更新警報閥值時出現錯誤！")
                    return
                }
                dispatch(setServerBounds(Bounds))
                dispatch(setStoreStatus("done"))
            })
            .catch(err => {
                setErrorMsg("更新警報閥值時出現錯誤！")
            })
    }, [is_store])
    //------ refresh to last threshold ------//
    useEffect(() => {
        if (is_refresh != true || refreshStatus != "no") return
        dispatch(setRefreshStatus("refreshing"))
        fetch(GET_THRESHOLD)
            .then(res => res.json())
            .then(data => {
                data = JSON.parse(data)
                if (data["status"] != "success") {
                    setErrorMsg("更新警報閥值時出現錯誤！")
                    return
                }
                dispatch(setBounds(data["data"]))
                dispatch(setRefreshStatus("done"))
            })
            .catch(err => {
                setErrorMsg("更新警報閥值時出現錯誤！")
            })
    }, [is_refresh])
}