import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, setUser } from "../../features/user/userSlice";
import { useNavigate } from 'react-router-dom';

export default function CheckUser(){
    const userSlice = useSelector((state) => state.user)
    const navSlice = useSelector((state) => state.nav)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        const username = localStorage.getItem('username')
        const userID = localStorage.getItem('userID')
        const access_token = localStorage.getItem('access_token')
        fetch("http://127.0.0.1:8000/protected", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            data = JSON.parse(data)
            let ResponseEvent = data["event"]
            let new_access_token = data["new_access_token"]
            switch(ResponseEvent){
                case "valid": {
                    dispatch(setUser({
                        loginState: true,
                        userInfo: {
                            username: username,
                            userID: userID
                        },
                        access_token: access_token
                    }))
                    break
                }
                case "new_token": {
                    dispatch(setUser({
                        loginState: true,
                        userInfo: {
                            username: username,
                            userID: userID
                        },
                        access_token: new_access_token
                    }))
                    break
                }
                case "failed": {
                    dispatch(logout())
                    localStorage.clear()
                    navigate("/Login")
                    break
                }
            }
        })
    }, [navSlice.currentNavRouteStatus])
}