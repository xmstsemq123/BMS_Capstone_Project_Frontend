import { useEffect } from "react"
import { useSelector } from "react-redux"

export default function Error(){
    const ProxyErrorMsg = useSelector((state) => state.error.ErrMsg)
    const is_Error = useSelector((state) => state.error.is_Error)
    let ErrorMsg = [...ProxyErrorMsg]
    return <>
    {
        (is_Error != 0) ? (        
            ErrorMsg.map((data) => (
                <h1>
                    {data}
                </h1>
            ))
        ) : null
    }
    </>
}