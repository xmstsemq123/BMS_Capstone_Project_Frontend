import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setDownloadErrorMsg, setEndTime, setIS_ClickButton, setIs_csv, setIs_DownloadError, setIs_json, setIsSelectAll, setSelectedCollection, setStartTime } from '../../features/Files/FilesSlice';
import Spinner from '../../Public/Spinner';

const collectionList = [
    "voltage", "temperature", "relay", "BalanceCurrent", "SystemCurrent", "balance", "annomaly", "SOH", "SOC"
];

const collectionChinesePrompt = {
    "all": "全部數據",
    "voltage": "電壓",
    "temperature": "溫度",
    "relay": "繼電器狀態",
    "BalanceCurrent": "平衡電流",
    "SystemCurrent": "系統電流",
    "balance": "平衡狀態",
    "annomaly": "警報通知",
    "SOH": "電池健康度",
    "SOC": "電池電量"
}

export default function Files() {
    const dispatch = useDispatch()
    const { is_clickButton, is_csv, is_json,
        isDownloadError, DownloadErrorMsg,
        downloadStatus, selectedCollection, isSelectAll,
        startTime, endTime } = useSelector(state => state.files)
    const [isDownloading, setIsDownloading] = useState(false)
    const toggleSelect = (col) => {
        if (col == "all") {
            if (isSelectAll) dispatch(setSelectedCollection([]))
            else dispatch(setSelectedCollection(collectionList))
            dispatch(setIsSelectAll(!isSelectAll))
        } else {
            const newCollection = selectedCollection.includes(col)
                ? selectedCollection.filter(c => c !== col)
                : [...selectedCollection, col];
            dispatch(setSelectedCollection(newCollection))
        }
    };
    useEffect(() => {
        let is_allin = true
        collectionList.forEach((item) => {
            if (!selectedCollection.includes(item)) {
                is_allin = false
                return
            }
        })
        if (is_allin) dispatch(setIsSelectAll(true))
        else dispatch(setIsSelectAll(false))
    }, [selectedCollection])
    const handleDownload = () => {
        if (is_csv == false && is_json == false) {
            dispatch(setIs_DownloadError(true))
            dispatch(setDownloadErrorMsg("請選取下載檔案類型！"))
            return
        }
        if (selectedCollection.length == 0) {
            dispatch(setIs_DownloadError(true))
            dispatch(setDownloadErrorMsg("請選取至少一個檔案內容！"))
            return
        }
        dispatch(setIs_DownloadError(false))
        dispatch(setDownloadErrorMsg(""))
        dispatch(setIS_ClickButton(true))
    };
    useEffect(() => {
        if (downloadStatus == "downloading") setIsDownloading(true)
        else setIsDownloading(false)
    }, [downloadStatus])
    return (
        <div className="p-6 max-w-4xl mx-auto text-white space-y-8">

            {/* 數據下載標題 */}
            <h2 className="text-3xl font-bold flex items-center gap-2">
                📁 數據下載
            </h2>

            {/* 檔案類型選擇 */}
            <section>
                <h3 className="text-xl font-semibold mb-2">📦 檔案類型</h3>
                <div className="flex gap-4 flex-wrap">
                    <button
                        onClick={() => dispatch(setIs_csv(!is_csv))}
                        className={`rounded-lg px-4 py-2 font-semibold transition duration-200 ${is_csv ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                    >
                        CSV
                    </button>
                    <button
                        onClick={() => dispatch(setIs_json(!is_json))}
                        className={`rounded-lg px-4 py-2 font-semibold transition duration-200 ${is_json ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                    >
                        JSON
                    </button>
                </div>
            </section>

            {/* 數據類型選擇 */}
            <section>
                <h3 className="text-xl font-semibold mb-2">📊 數據類型</h3>

                {/* 全選按鈕 */}
                <div className="mb-3">
                    <button
                        onClick={() => toggleSelect('all')}
                        className={`w-full rounded-lg px-4 py-2 font-semibold transition ${isSelectAll ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                    >
                        {collectionChinesePrompt['all']}
                    </button>
                </div>

                {/* 各個數據類型 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {collectionList.map((col) => (
                        <button
                            key={col}
                            onClick={() => toggleSelect(col)}
                            className={`rounded-lg px-4 py-2 font-semibold transition ${selectedCollection.includes(col)
                                    ? 'bg-purple-600 hover:bg-purple-700'
                                    : 'bg-gray-600 hover:bg-gray-700'
                                }`}
                        >
                            {collectionChinesePrompt[col]}
                        </button>
                    ))}
                </div>
            </section>

            {/* 時間選擇區塊 */}
            <section>
                <h3 className="text-xl font-semibold mb-2">⏰ 時間區間</h3>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className="flex flex-col sm:flex-row gap-4 bg-white p-6 rounded-xl">
                        <DateTimePicker
                            label="起始時間"
                            value={dayjs(startTime)}
                            onChange={(data) => dispatch(setStartTime(data.toISOString()))}
                            slotProps={{
                                textField: {
                                    variant: 'outlined',
                                    size: 'small',
                                    sx: { bgcolor: 'white', borderRadius: 1, width: '100%' },
                                },
                            }}
                        />
                        <DateTimePicker
                            label="結束時間"
                            value={dayjs(endTime)}
                            onChange={(data) => dispatch(setEndTime(data.toISOString()))}
                            slotProps={{
                                textField: {
                                    variant: 'outlined',
                                    size: 'small',
                                    sx: { bgcolor: 'white', borderRadius: 1, width: '100%' },
                                },
                            }}
                        />
                    </div>
                </LocalizationProvider>
            </section>

            {/* 錯誤提示或下載中狀態 */}
            {isDownloadError && (
                <div className="bg-red-700 text-white p-4 rounded-xl text-center">
                    <p className="font-bold text-lg">{DownloadErrorMsg}</p>
                </div>
            )}
            {isDownloading && (
                <div className="bg-[#2e2b4a] rounded-xl w-full p-5 flex flex-col items-center">
                    <p className="font-bold text-lg mb-3">與伺服器交互中...</p>
                    <Spinner color="fill-blue-100" />
                </div>
            )}

            {/* 下載按鈕 */}
            <div className="text-center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownload}
                    disabled={is_clickButton}
                    sx={{ px: 4, py: 1.5, bgcolor: 'green' }}
                >
                    {is_clickButton ? <CircularProgress size={24} color="inherit" /> : '下載檔案'}
                </Button>
            </div>
        </div>

    );
}
