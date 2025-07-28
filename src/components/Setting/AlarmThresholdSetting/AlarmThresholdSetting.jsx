import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeSuccessPromptWindow, setdefaultValue, setInputValue, setRefresh, setStore } from '../../../features/Threshold/ThresholdSlice';
import Spinner from '../../../Public/Spinner';

export default function AlarmThresholdSetting() {
    const dispatch = useDispatch()
    const { is_store, storeStatus, is_refresh, refreshStatus, successPromptWindow, Bounds } = useSelector(state => state.threshold)
    const handleChange = (type, level, index, value) => {
        let parsedValue = 0.0
        if (Number.isNaN(value)) {
            parsedValue = 9999
        }
        parsedValue = parseFloat(value)
        dispatch(setInputValue({
            'type': type,
            'level': level,
            'index': index,
            'value': parsedValue
        }))
    }
    const handleSave = () => {
        if (is_store || storeStatus != "no") return
        let is_save = confirm("確定要更新警報閥值設定？")
        if (!is_save) return
        dispatch(setStore(true))
    }
    const handleRefresh = () => {
        if (is_refresh || refreshStatus != "no") return
        let is_confirmrefresh = confirm("確定要返回目前設定？")
        if (!is_confirmrefresh) return
        dispatch(setRefresh(true))
    }
    const handleBackToRecommend = () => {
        const defaultThreshold = {
            voltage: { normal: [3.0, 3.65], warn: [2.5, 3.0], danger: [-9999, 2.5] },
            current: { normal: [0, 150], warn: [150, 280], danger: [280, 9999] },
            temperature: { normal: [0, 45], warn: [-10, 60], danger: [-9999, 9999] }
        }
        dispatch(setdefaultValue(defaultThreshold))
    }
    useEffect(() => {
        if (successPromptWindow) {
            const timer = setTimeout(() => {
                dispatch(closeSuccessPromptWindow())
            }, 10000);
            return () => clearTimeout(timer); // 清除計時器（避免重複觸發）
        }
    }, [successPromptWindow]); // ⚠️ 監聽 storeStatus 變化
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">⚙️ 警報閥值設定</h2>
            <p className='font-bold bg-amber-800 sm:w-[500px] p-3 rounded-xs select-none'>
                數值9999以上皆視為正無窮大；-9999以下皆視為負無窮大。
            </p>
            <div className="overflow-x-auto space-y-6">
                {['voltage', 'current', 'temperature'].map((type) => (
                    <div key={type} className="bg-[#2e2b4a] p-4 rounded-xl shadow w-full">
                        <h3 className="text-lg font-semibold mb-3 capitalize">{type}</h3>

                        {/* Row 區塊 */}
                        <div className="flex flex-wrap gap-4 justify-center">
                            {['normal', 'warn', 'danger'].map((level) => (
                                <div key={level} className="flex flex-col items-center text-center">
                                    <p className="font-medium mb-1">{level}</p>
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            className="max-w-[100px] w-full px-2 py-1 rounded bg-[#1e1c3a] text-white text-center"
                                            value={Bounds[type][level][0]}
                                            onChange={(e) => handleChange(type, level, 0, e.target.value)}
                                        />
                                        <span className="text-white">~</span>
                                        <input
                                            type="number"
                                            className="max-w-[100px] w-full px-2 py-1 rounded bg-[#1e1c3a] text-white text-center"
                                            value={Bounds[type][level][1]}
                                            onChange={(e) => handleChange(type, level, 1, e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {
                is_refresh || is_store ? (
                    <div className='bg-[#2e2b4a] rounded-xl w-full p-5 flex flex-col items-center space-y-5'>
                        <p className='font-bold text-[26px]'>
                            與伺服器交互中...
                        </p>
                        <div className='w-[50px]'>
                            <Spinner color='fill-blue-100' />
                        </div>
                    </div>
                ) : null
            }
            {
                successPromptWindow ? (
                    <div className='bg-[#3c7544] rounded-xl w-full p-5 flex flex-col items-center space-y-5'>
                        <p className='font-bold text-[26px]'>
                            成功更新警報閥值。
                        </p>
                    </div>
                ) : null
            }
            <div className='flex lg:flex-row flex-col lg:space-x-5 font-bold'>
                <button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white"
                    onClick={handleSave}
                >
                    儲存設定
                </button>
                <button
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded text-white"
                    onClick={handleRefresh}
                >
                    填入上次設定數據
                </button>
                <button
                    className="mt-4 bg-orange-600 hover:bg-orange-700 px-6 py-2 rounded text-white"
                    onClick={handleBackToRecommend}
                >
                    恢復推薦數據
                </button>
            </div>

        </div>
    );
}
