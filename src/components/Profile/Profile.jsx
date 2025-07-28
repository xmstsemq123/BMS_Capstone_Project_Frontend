import React from "react"
import { FaUserCircle } from 'react-icons/fa';
import { useSelector } from "react-redux";
export default function Profile(){
    const { username } = useSelector(state => state.user.userInfo)
    return <>
        <div className="flex justify-center items-center mt-[100px] select-none">
            <div className="h-[600px] w-[400px] bg-fuchsia-100 rounded-2xl p-5
            hover:shadow-[0px_0px_5px_5px_#fae6f0] transition duration-400
            ">
                <div className="flex justify-center items-center h-[300px]">
                    <FaUserCircle className="text-[150px] text-gray-700
                    "/>
                </div>
                <div 
                className="text-black text-[50px] flex flex-col justify-center items-center mt-[40px]" 
                style={{"fontFamily": "Noto Sans TC"}}>
                    <p>{username}</p>
                </div>
            </div>
        </div>
    </>
}