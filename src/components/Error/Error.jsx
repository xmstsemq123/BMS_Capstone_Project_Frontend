import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import Spinner from "../../Public/Spinner"

export default function Error(){
    const ErrorMsg = useSelector((state) => state.error.ErrMsg)
    const is_Error = useSelector((state) => state.error.is_Error)
    const [dots, setDots] = useState('')
    const isSetDots = useRef(false)
    useEffect(() => {
        if(isSetDots.current) return
        isSetDots.current = true
        window.setInterval(() => {
            setDots(prev => {
                if(prev.length >= 6) return ''
                else return prev + '.'
            })
        }, 250)
    })
    return <>
    {
        (is_Error == 0) ? null : (
            <div className="fixed bg-gray-200 w-svw h-svh z-2486 overflow-hidden
            flex justify-center items-center
            ">
                <div className="text-gray-600 text-shadow-sm text-shadow-black 
                text-6xl
                font-bold">
                    伺服器連線失敗，請重新加載網頁{dots}
                </div>
            </div>
        ) 
    }
    </>
}