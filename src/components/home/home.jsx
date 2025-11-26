import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import 'react-circular-progressbar/dist/styles.css';
import TemperatureStatus from './TemperatureStatus/TemperatureStatus';
import BatteryHealthStatus from './BatteryHealthStatus/BatteryHealthStatus'
import BatteryLevel from './BatteryLevel/BatteryLevel';
import BatteryAbnormalState from './BatteryAbnormalState/BatteryAbnormalState';
import CellActivityBlock from './CellActivityBlock/CellActivityBlock';
import BalanceStatus from './BalanceStatus/BalanceStatus';
import RideStatus from './RideStatus/RideStatus';

const Block = ({ title, children, className }) => {
  return (
    <div className={`bg-[#7a7a7a] rounded-xl shadow-md p-6 text-black ${className}`}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default function Home() {
  const [isCharging, setIsCharging] = useState(true)
  const batteryPercentage = useSelector((state) => state.homeData.SOC)
  const batteryHealth = useSelector((state) => state.homeData.SOH)
  const batteryTemperature = useSelector((state) => state.homeData.temperature)
  const batteryVoltage = useSelector((state) => state.homeData.voltage)
  return (<>
    <div className="p-6 bg-[#7a7a7a] select-none">
      <h1 className="text-2xl font-bold text-black mb-6">電池模組狀態總覽</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Block title="電車狀態">
          <RideStatus />
        </Block>
        <Block title="電量">
          <BatteryLevel percentage={batteryPercentage} />
        </Block>
        <Block title="整體情況">
          <BatteryAbnormalState />
        </Block>
        <Block title="溫度狀態">
          <TemperatureStatus temp={batteryTemperature} />
        </Block>
        <Block title="健康狀態">
          <BatteryHealthStatus health={batteryHealth} />
        </Block>
        <Block title="平衡狀態">
          <BalanceStatus />
        </Block>
      </div>
    </div>
    <div className="p-6 bg-[#1f1b2e] mt-6 select-none">
      <h1 className="text-2xl font-bold text-white mb-6">單一元件狀態總覽</h1>
      <CellActivityBlock />
    </div>
  </>);
}
