import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIs_success, setNewPassword, setOldPassword, setPasswordErrorMsg, setPasswordIs_Error, setSubmitStatus } from "../../features/UserPasswordSetting/UserPasswordSettingSlice";
import { PUT_CHANGE_PASSWORD } from "../../Public/APIUrl";
import { setErrMsg, setIs_Error } from "../../features/Error/ErrorSlice";
import { SHA256 } from "crypto-js";

export default function UserPasswordSettingDataFetch() {
    const dispatch = useDispatch()
    const setErrorMes = (data) => {
        dispatch(setIs_Error(true))
        dispatch(setErrMsg(data))
    }
    const { is_submit, submitStatus, is_Error, errorMsg, oldPassword, newPassword } = useSelector(state => state.UserPasswordSetting)

    useEffect(() => {
        if (is_submit == false) return
        let username = localStorage.getItem("username")
        let userID = localStorage.getItem("userID")
        let access_token = localStorage.getItem("access_token")
        dispatch(setSubmitStatus("submitting"))
        fetch(PUT_CHANGE_PASSWORD, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'username': username,
                'userID': userID,
                'access_token': access_token,
                'oldPassword': SHA256(oldPassword).toString(),
                'newPassword': SHA256(newPassword).toString()
            })
        })
            .then(res => res.json())
            .then(data => {
                data = JSON.parse(data)
                if (data["status"] != "success") {
                    let ErrorMessage = data["ErrMsg"]
                    dispatch(setPasswordIs_Error(true))
                    dispatch(setPasswordErrorMsg(ErrorMessage))
                } else {
                    dispatch(setPasswordIs_Error(false))
                    dispatch(setIs_success(true))
                    dispatch(setOldPassword(''))
                    dispatch(setNewPassword(''))
                }
                dispatch(setSubmitStatus("done"))
            })
            .catch(err => {
                console.log(err)
                dispatch(setPasswordIs_Error(true))
                dispatch(setPasswordErrorMsg("在更改密碼時，伺服器出現錯誤！"))
                setErrMsg("在更改密碼時，伺服器出現錯誤！")
                dispatch(setSubmitStatus("done"))
            })
    }, [is_submit])
}