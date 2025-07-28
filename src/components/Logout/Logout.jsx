import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WEBSITE_URL } from "../../Public/APIUrl";

export default function Logout(){
    const navigate = useNavigate()
    useEffect(() => {
        localStorage.clear()
        location.href = WEBSITE_URL
    })
}