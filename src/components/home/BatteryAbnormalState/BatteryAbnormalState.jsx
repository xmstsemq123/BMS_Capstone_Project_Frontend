import { useEffect, useState } from 'react';
import { FaChargingStation, FaCheckCircle, FaExclamationTriangle, FaPlug } from 'react-icons/fa';
import { useSelector } from 'react-redux';
let batteryAbnormalState = 'Normal'
export default function BatteryAbnormalState() {
    const { serverBounds } = useSelector(state => state.threshold)
    const { voltage, current, temperature } = useSelector(state => state.homeData)
    const [is_normal, setIs_normal] = useState(true)
    const [iconColor, setIconColor] = useState('text-green-500')
    const [healthPrompt, setHealthPrompt] = useState("正常")
    function getDataStatus(voltage, current, temperature) {
        const dataValue = {
            'voltage': voltage,
            'current': current,
            'temperature': temperature
        }
        let dataValueStatus = {
            'voltageStatus': 0,
            'currentStatus': 0,
            'temperatureStatus': 0
        }
        for (const boundName in dataValue) {
            let value = dataValue[boundName]
            const normalBound = serverBounds[boundName]['normal']
            const warnBound = serverBounds[boundName]['warn']
            const dangerBound = serverBounds[boundName]['danger']
            let dataStatus = 2
            if (value >= normalBound[0] && value <= normalBound[1]) dataStatus = 0
            else if (value >= warnBound[0] && value <= warnBound[1]) dataStatus = 1
            else if (value >= dangerBound[0] && value <= dangerBound[1]) dataStatus = 2
            dataValueStatus[`${boundName}Status`] = dataStatus
        }
        return dataValueStatus
    }
    const getSeverityColor = (severity) => {
        if (severity === 0) return 'text-green-500';   // normal
        if (severity === 1) return 'text-lime-600';
        if (severity === 2) return 'text-lime-700';
        if (severity === 3) return 'text-yellow-600';
        if (severity === 4) return 'text-yellow-700';
        if (severity === 5) return 'text-amber-700';
        return 'text-red-800';                          // danger
    };
    const healthLevelPrompt = {
        0: "正常",
        1: "輕微異常",
        2: "輕微異常",
        3: "中度異常",
        4: "嚴重異常",
        5: "嚴重異常",
        6: "嚴重異常",
    }
    useEffect(() => {
        let dataStatus = getDataStatus(voltage, current, temperature)
        let dataStatusValue = dataStatus["voltageStatus"] + dataStatus["currentStatus"] + dataStatus["temperatureStatus"]
        if(dataStatusValue === 0) {
            setIs_normal(true)
            return
        }
        else setIs_normal(false)
        setIconColor(getSeverityColor(dataStatusValue))
        setHealthPrompt(healthLevelPrompt[dataStatusValue])
    }, [voltage, current, temperature, serverBounds])
    return (<>
        {
            is_normal === true ? (
                <div className="flex flex-col items-center text-green-400">
                    <FaCheckCircle className="text-5xl mt-2 mb-5" />
                    <span className="text-2xl text-white font-bold">電池狀態正常</span>
                </div>
            ) : (
                <div className={`flex flex-col items-center ${iconColor}`}>
                    <FaExclamationTriangle className="text-6xl mt-1 mb-4 animate-pulse" />
                    <span className="text-2xl text-white font-bold">電池{healthPrompt}</span>
                </div>
            )
        }
    </>)
}