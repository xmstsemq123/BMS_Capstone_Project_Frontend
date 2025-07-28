import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearNewAnnomalyData
} from '../../features/RouteData/AnnomalyData';
import Modal from './Modal/Modal'
import { setLoadMoreAnnomalyData, setSelectedFilter } from '../../features/Annomaly/AnnomalySlice';
import { formatTimestamp } from './components/formatTimestamp';
import { FaCarBattery } from "react-icons/fa";
import { MdElectricBolt } from 'react-icons/md'; // 更具「電流感」的雷電
import { TbTemperatureCelsius } from "react-icons/tb";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjs from 'dayjs';
import getDifferentTime from './components/getDifferentTime';
dayjs.extend(utc)
dayjs.extend(timezone)
const categories = [
    { key: 'voltage', label: '電壓警報' },
    { key: 'current', label: '電流警報' },
    { key: 'temperature', label: '溫度警報' }
];
const categoriesColor = {
    'voltage': 'text-orange-600',
    'current': 'text-emerald-500',
    'temperature': 'text-amber-200'
}
const categoriesIcons = {
    'voltage':

        <FaCarBattery className="text-3xl" />
    ,
    'current':
        <MdElectricBolt className="text-3xl" />
    ,
    'temperature':
        <TbTemperatureCelsius className="text-3xl" />
}
const categoriesPrompt = {
    'voltage': '電壓警報',
    'current': '電流警報',
    'temperature': '溫度警報'
}
const Block = ({ title, children, className }) => (
    <div className={`bg-[#2e2b4a] rounded-xl shadow-md p-6 text-white ${className}`}>
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {children}
    </div>
);
const CheckIsNewData = (dataTime, currentTime) => {
    const time1 = dayjs.utc(dataTime).tz('Asia/Taipei')
    const time2 = dayjs.utc(currentTime).tz('Asia/Taipei')
    const diffTimeMin = time2.diff(time1, 'minute')
    if (diffTimeMin <= 30) return true
    else return false
}

export default function Annomaly() {
    const dispatch = useDispatch();
    const { is_newData, newData, historyData } = useSelector(state => state.annomalyData);
    const { currentTime } = useSelector(state => state.nowtime)
    const [modalCategory, setModalCategory] = useState(null);
    const selectedFilter = useSelector((state) => state.annomaly.selectedFilter)
    return (<>
        <div className="flex lg:flex-row flex-col gap-5 lg:m-5 select-none w-full">
            {/* 警報類型、時間等過濾 */}
            <div className='bg-[#d1d1d1] lg:rounded-2xl w-full lg:w-auto lg:min-w-[300px] p-2 lg:p-5 h-auto max-h-[250px] lg:max-h-[420px]'>
                <p className='text-center text-gray-900 font-bold text-2xl lg:h-[30px] lg:mb-[10px] lg:mt-[5px] mt-[8px]'>
                        警報類型
                </p>
                <div className="lg:flex lg:flex-col grid grid-cols-2 gap-1 lg:gap-4 h-full rounded-2xl p-2">
                    <div
                        onClick={() => dispatch(setSelectedFilter('all'))}
                        className={` ${selectedFilter == 'all' ? 'bg-black' : 'bg-gray-700'}
                            cursor-pointer text-center rounded-xl lg:p-5 p-2 
                            hover:bg-black font-bold text-[18px] transition min-h-[25px]`}
                    >
                        全部警報
                    </div>
                    {categories.map(({ key, label }) => (
                        <div
                            key={key}
                            onClick={() => dispatch(setSelectedFilter(key))}
                            className={` ${selectedFilter == key ? 'bg-black' : 'bg-gray-700'}
                            cursor-pointer text-center rounded-xl lg:p-5 p-2 
                            hover:bg-black font-bold text-[18px] transition min-h-[25px]`}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </div>
            {/* 警報資料 */}
            <div className='w-full lg:mr-[40px]'>
                <div className="overflow-y-auto space-y-5">
                    {historyData.map((item, index) => {
                        if (selectedFilter === 'all' || item['dataType'] == selectedFilter) {
                            return (
                                <div key={index} className="bg-[#63563e] pt-5 pb-5 lg:pl-6 lg:pr-6 pl-3 pr-3 lg:rounded-lg
                                    hover:bg-[#726244] transition
                                ">
                                    <div className="lg:flex lg:justify-between">
                                        <div className={`
                                                ${categoriesColor[item.dataType]}
                                                font-bold flex items-center gap-3 text-xl
                                            `}>
                                            {CheckIsNewData(item.timestamp, currentTime) ? (
                                                    <span className='bg-red-700 text-white text-[16px] min-w-[65px] px-2 rounded-[5px] h-full flex items-center justify-center'>
                                                        New
                                                    </span>
                                                ) : null
                                            }
                                            <span className='bg-white text-black text-[16px] min-w-[65px] px-2 rounded-[5px] h-full flex items-center justify-center'>
                                                {getDifferentTime(item.timestamp, currentTime)}
                                            </span>
                                            {categoriesIcons[item.dataType]}
                                            {categoriesPrompt[item.dataType]}
                                        </div>
                                        <div className="flex-shrink-0 font-semibold text-xl mt-[3px] lg:mt-0">
                                            {formatTimestamp(item.timestamp)}
                                        </div>
                                    </div>
                                    <div className='h-[3px] bg-[#b19258] rounded-[5px] lg:mt-2 mb-4'></div>
                                    <div className="text-xl font-semibold text-gray-100 text-justify whitespace-pre-wrap">
                                        {item.message}
                                    </div>
                                </div>
                            )
                        } else return null
                    })}
                </div>
                <div className="mt-8 flex justify-center w-full">
                    <button
                        onClick={() => {
                            dispatch(setLoadMoreAnnomalyData(true))
                        }}
                        className="bg-[#9e8350] hover:bg-[#77674c] text-white font-semibold text-xl pt-4 pb-4 px-4 py-1 rounded w-full cursor-pointer"
                    >
                        載入更多
                    </button>
                </div>
            </div>
        </div>
    </>);
}