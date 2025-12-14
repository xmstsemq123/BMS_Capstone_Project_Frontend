import { useSelector } from "react-redux";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function CapacitorStatus() {
    const CapacitorCurrent = useSelector(state => state.homeData.CapacitorCurrent)
    const CapacitorVoltage = useSelector(state => state.homeData.CapacitorVoltage)
    const ItemCard = ({ label, index, type }) => {
        const isCharging = type;
        const color = isCharging ? 'emerald' : 'rose';
        const Icon = isCharging ? FaArrowUp : FaArrowDown;
        const bg = `bg-${color}-500/10`;
        const iconColor = `text-${color}-500`;
        const textColor = `text-${color}-400`;

        return (
            <div className={`flex flex-col items-center justify-center w-full p-3`}>
                <div className={`mb-2 text-sm text-gray-400`}>{label}</div>
                <div className={`relative rounded-xl w-[70px] h-[70px] flex items-center justify-center ${bg}`}>
                    <span className={`text-3xl font-bold ${textColor}`}>{index + 1}</span>
                    <Icon className={`absolute bottom-1 right-1 text-[14px] ${iconColor}`} />
                </div>
                <div className={`mt-2 text-[15px] font-semibold ${textColor}`}>
                    {isCharging ? '正在充電' : '正在放電'}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            <div className="h-[4px] w-full bg-gray-600 rounded-full mb-5" />
            <div className="flex flex-row gap-4">
                <div className={`flex flex-col items-center justify-center w-full p-3`}>
                    <div className={`mb-2 text-sm text-gray-400`}>電壓數值</div>
                    <div className={`relative rounded-xl w-[70px] h-[70px] flex items-center justify-center `}>
                        <span className={`text-3xl font-bold`}>{CapacitorVoltage}</span>
                    </div>
                    <div className={`mt-2 text-[15px] font-semibold`}>
                        伏特
                    </div>
                </div>
                <div className={`flex flex-col items-center justify-center w-full p-3`}>
                    <div className={`mb-2 text-sm text-gray-400`}>電流數值</div>
                    <div className={`relative rounded-xl w-[70px] h-[70px] flex items-center justify-center `}>
                        <span className={`text-3xl font-bold`}>{CapacitorCurrent}</span>
                    </div>
                    <div className={`mt-2 text-[15px] font-semibold`}>
                        安培
                    </div>
                </div>
            </div>
        </div>
    );
}
