import { useEffect } from 'react';
import { FaMotorcycle, FaRegClock } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { LuPowerOff } from "react-icons/lu";
import { PiPlugChargingFill } from "react-icons/pi";
import { FaPauseCircle } from "react-icons/fa";

function StatusChangeToContent(RelayStatus, SystemCurrent) {
  if (RelayStatus == false) {
    return (<>
      <LuPowerOff className="text-6xl text-red-500 mb-2" />
      <span className=" font-bold text-2xl">尚未發動</span>
    </>)
  }
  if (SystemCurrent > 0.1) {
    return (<>
      <FaMotorcycle className="text-6xl  mb-2" />
      <span className=" font-bold text-2xl">騎行中</span>
    </>)
  } else if (SystemCurrent < -0.1) {
    return (<>
      <PiPlugChargingFill className="text-6xl text-green-500 mb-2" />
      <span className=" font-bold text-2xl">充電中</span>
    </>)
  } else {
    return (<>
      <FaPauseCircle className="text-6xl text-gray-300 mb-2" />
      <span className=" font-bold text-2xl">靜置中</span>
    </>)
  }
}

export default function RideStatus() {
  const RelayStaus = useSelector(state => state.homeData.RelayStatus)
  const SystemCurrent = useSelector(state => state.homeData.SystemCurrent)
  return (
    <div className="flex flex-col items-center justify-center p-8">
      {StatusChangeToContent(RelayStaus, SystemCurrent)}
    </div>
  );
}
