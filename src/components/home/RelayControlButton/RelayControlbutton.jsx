import { useSelector } from "react-redux"
import { PUT_CHANGE_RELAY_STATUS } from "../../../Public/APIUrl"

function RelayChangeStatusButton(CurrentRelayStatus){
    fetch(PUT_CHANGE_RELAY_STATUS, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "NewRelayStatus": !CurrentRelayStatus
        })
    })
}

export default function RelayControlButton(){
    const RelayStatus = useSelector(state => state.homeData.RelayStatus)
    return <>
        <div 
            onClick={() => RelayChangeStatusButton(RelayStatus)}
            className={` transition cursor-pointer p-10 flex mt-10 justify-center items-center rounded-xl font-bold text-2xl ${!RelayStatus ? "bg-red-400 text-white hover:bg-red-600" : "bg-green-400 hover:bg-green-600"}`}>
            {!RelayStatus ? "啟動電源" : "關閉電源"}
        </div>
    </>
}