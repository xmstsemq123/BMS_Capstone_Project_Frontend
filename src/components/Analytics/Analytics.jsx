import React, { useState, useEffect } from 'react';
import CellActivityBlock from './CellActivityBlock/CellActivityBlock'
import DataReChartGraph from './DataReChartGrpah/DataReChartGrpah'
import { useDispatch, useSelector } from 'react-redux';
import {
    setSOCGraphInfo, setTemperatureGraphInfo, setVoltageGraphInfo, setSystemCurrentGraphInfo,
    setSOHGraphInfo,
    setBalanceCurrentGraphData,
    setBalanceCurrentGraphInfo,
    setCapacitorCurrentGraphInfo,
    setCapacitorVoltageGraphInfo
} from '../../features/RouteData/AnalyticsData'
import { FaBatteryFull, FaBatteryQuarter } from 'react-icons/fa';
import CustomSelect from './CustomSelect/CustomSelect';
import BCDataRechart from './BCDataRechart/BCDataRechart';

const Block = ({ title, children, className }) => {
    return (
        <div className={`bg-white border-black border-1 rounded-xl p-6 text-black ${className}
         hover:shadow-[0px_1px_25px_3px_#ffe6c9] transition duration-500
        `}>
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <div>{children}</div>
        </div>
    );
};

const TimeScaleTable = {
    "近3小時": '0',
    "近6小時": '1',
    "近12小時": '2',
    "近1天": '3',
    "近3天": '4',
    "近1星期": '5',
    "近12天": '6',
    "近1個月": '7',
    "近半年": '8',
    "近一年": '9'
}

export default function Analytics() {
    const dispatch = useDispatch()
    //------ datas from slice ------//
    const graphInfo = useSelector((state) => state.analyticsData.graphInfo)
    const graphData = useSelector((state) => state.analyticsData.graphData)
    //------ graph info variables ------//
    //--- graph scale ---//
    const selectedCellSOC = graphInfo.SOC.GraphScale
    const selectedCellSOH = graphInfo.SOH.GraphScale
    const selectedTempCell = graphInfo.Temperature.GraphScale
    const selectedVolCell = graphInfo.Voltage.GraphScale
    const selectedBCCell = graphInfo.BalanceCurrent.GraphScale
    //--- time scale ---//
    const SOCTimeScale = graphInfo.SOC.TimeScale
    const SOHTimeScale = graphInfo.SOH.TimeScale
    const TempTimeScale = graphInfo.Temperature.TimeScale
    const VolTimeScale = graphInfo.Voltage.TimeScale
    const SystemCurrentTimeScale = graphInfo.SystemCurrent.TimeScale
    const BCTimeScale = graphInfo.BalanceCurrent.TimeScale
    const CCTimeScale = graphInfo.CapacitorCurrent.TimeScale
    const CVTimeScale = graphInfo.CapacitorVoltage.TimeScale
    //------ graph info functions ------//
    //--- graph scale ---//
    const setSelectedCellSOC = (data) => dispatch(setSOCGraphInfo({ GraphScale: data, TimeScale: SOCTimeScale }))
    const setSelectedCellSOH = (data) => dispatch(setSOHGraphInfo({ GraphScale: data, TimeScale: SOHTimeScale }))
    const setSelectedTempCell = (data) => dispatch(setTemperatureGraphInfo({ GraphScale: data, TimeScale: TempTimeScale }))
    const setSelectedVolCell = (data) => dispatch(setVoltageGraphInfo({ GraphScale: data, TimeScale: VolTimeScale }))
    const setSelectedBCCell = (data) => dispatch(setBalanceCurrentGraphInfo({ GraphScale: data, TimeScale: BCTimeScale }))
    //--- time scale ---//
    const setSOCTimeScale = (data) => dispatch(setSOCGraphInfo({ GraphScale: selectedCellSOC, TimeScale: data }))
    const setSOHTimeScale = (data) => dispatch(setSOHGraphInfo({ GraphScale: selectedCellSOH, TimeScale: data }))
    const setTempTimeScale = (data) => dispatch(setTemperatureGraphInfo({ GraphScale: selectedTempCell, TimeScale: data }))
    const setVolTimeScale = (data) => dispatch(setVoltageGraphInfo({ GraphScale: selectedVolCell, TimeScale: data }))
    const setSystemCurrentTimeScale = (data) => dispatch(setSystemCurrentGraphInfo({ TimeScale: data }))
    const setBCTimeScale = (data) => dispatch(setBalanceCurrentGraphInfo({ GraphScale: selectedBCCell, TimeScale: data }))
    const setCapacitorCurrentTimeScale = (data) => dispatch(setCapacitorCurrentGraphInfo({ TimeScale: data }))
    const setCapacitorVoltageTimeScale = (data) => dispatch(setCapacitorVoltageGraphInfo({ TimeScale: data }))
    //------ graph data ------//
    const SOCData = graphData.SOC
    const SOHData = graphData.SOH
    const TempData = graphData.Temperature
    const VolData = graphData.Voltage
    const SystemCurrentData = graphData.SystemCurrent
    const BalanceCurrentData = graphData.BalanceCurrent
    const CapacitorCurrentData = graphData.CapacitorCurrent
    const CapacitorVoltageData = graphData.CapacitorVoltage
    //------ Array for quick layout ------//
    const chargeCompnents = [
        {
            is_cell: false,
            title: '負載端超級電容電壓紀錄',
            timeScaleValue: CCTimeScale,
            timeScaleFunction: setCapacitorCurrentTimeScale,
            data: CapacitorCurrentData
        },
        {
            is_cell: false,
            title: '負載端超級電容電流紀錄',
            timeScaleValue: CVTimeScale,
            timeScaleFunction: setCapacitorVoltageTimeScale,
            data: CapacitorVoltageData
        },
        {
            is_cell: true,
            title: '歷史電壓紀錄',
            selectedCellValue: selectedVolCell,
            selectedCellFunction: setSelectedVolCell,
            timeScaleValue: VolTimeScale,
            timeScaleFunction: setVolTimeScale,
            data: VolData
        }, {
            is_cell: false,
            title: '歷史系統電流紀錄',
            timeScaleValue: SystemCurrentTimeScale,
            timeScaleFunction: setSystemCurrentTimeScale,
            data: SystemCurrentData
        },
        {
            is_cell: true,
            title: '歷史電量紀錄',
            selectedCellValue: selectedCellSOC,
            selectedCellFunction: setSelectedCellSOC,
            timeScaleValue: SOCTimeScale,
            timeScaleFunction: setSOCTimeScale,
            data: SOCData
        }, {
            is_cell: true,
            title: '歷史健康度紀錄',
            selectedCellValue: selectedCellSOH,
            selectedCellFunction: setSelectedCellSOH,
            timeScaleValue: SOHTimeScale,
            timeScaleFunction: setSOHTimeScale,
            data: SOHData
        }, {
            is_cell: true,
            title: '歷史溫度紀錄',
            selectedCellValue: selectedTempCell,
            selectedCellFunction: setSelectedTempCell,
            timeScaleValue: TempTimeScale,
            timeScaleFunction: setTempTimeScale,
            data: TempData
        },
    ]
    //--- filter BC data ---//
    function filterBySelectedCell(data, selectedBCCell) {
        if (!Array.isArray(data)) return [];

        // "overall" 直接回傳原資料
        if (selectedBCCell === 'overall' || selectedBCCell === undefined || selectedBCCell === null) {
            return data;
        }

        const nStr = String(selectedBCCell).trim();
        if (nStr === '') return data;

        // 可能出現的 key 變體（輸入端兼容）
        const candidateKeys = [`cell${nStr}`, `cell_${nStr}`, `cell ${nStr}`];
        const outputKey = `cell${nStr}`; // 輸出統一命名

        const toMs = (row) => {
            if (typeof row.time === 'number') return row.time;
            if (row?.timestamp?.$date) {
                const ms = Date.parse(row.timestamp.$date);
                return Number.isNaN(ms) ? undefined : ms;
            }
            if (row?.timestamp) {
                const ms = Date.parse(row.timestamp);
                return Number.isNaN(ms) ? undefined : ms;
            }
            return undefined;
        };

        const out = [];
        for (const row of data) {
            const timeMs = toMs(row);
            if (!Number.isFinite(timeMs)) continue;

            const foundKey = candidateKeys.find((k) => k in row);
            if (!foundKey) continue; // 沒有該 cell 值就跳過

            out.push({
                time: timeMs,
                [outputKey]: row[foundKey],
            });
        }
        return out;
    }
    return (
        <div className="flex flex-col gap-5 px-5 select-none">
            <div className='w-full space-y-5'>
                {/* Balance Current */}
                <Block
                    key="123456"
                    title={
                        <div className="flex items-center justify-between flex-col lg:flex-row gap-4 w-full">
                            <span className='text-[32px] lg:text-[26px] w-full text-center lg:text-left'>平衡電流狀態</span>
                            <div className='flex gap-4 flex-row w-full justify-center lg:justify-end'>
                                {
                                    <CustomSelect
                                        value={selectedBCCell}
                                        onChange={setSelectedBCCell}
                                        options={[
                                            { label: '整體', value: 'overall' },
                                            ...Array.from({ length: 16 }, (_, i) => ({
                                                label: `Cell ${i + 1}`,
                                                value: `${i + 1}`,
                                            })),
                                        ]}
                                        width="lg:w-[140px] w-full"
                                    />
                                }
                                <CustomSelect
                                    value={BCTimeScale}
                                    onChange={setBCTimeScale}
                                    options={Object.entries(TimeScaleTable).map(([label, value]) => ({
                                        label,
                                        value,
                                    }))}
                                    width="lg:w-[140px] w-full"
                                />
                            </div>
                        </div>
                    }
                >
                    <div className='overflow-scroll lg:overflow-auto'>
                        <BCDataRechart data={filterBySelectedCell(BalanceCurrentData, selectedBCCell)} />
                    </div>
                </Block>
                {/* other graph */}
                {
                    chargeCompnents.map((item, index) => (
                        <Block
                            key={index}
                            title={
                                <div className="flex items-center justify-between flex-col lg:flex-row gap-4 w-full">
                                    <span className='text-[32px] lg:text-[26px] w-full text-center lg:text-left'>{item.title}</span>
                                    <div className='flex gap-4 flex-row w-full justify-center lg:justify-end'>
                                        {
                                            item.is_cell && (
                                                <CustomSelect
                                                    value={item.selectedCellValue}
                                                    onChange={item.selectedCellFunction}
                                                    options={[
                                                        { label: '整體', value: 'overall' },
                                                        ...Array.from({ length: 16 }, (_, i) => ({
                                                            label: `Cell ${i + 1}`,
                                                            value: `${i}`,
                                                        })),
                                                    ]}
                                                    width="lg:w-[140px] w-full"
                                                />
                                            )
                                        }
                                        <CustomSelect
                                            value={item.timeScaleValue}
                                            onChange={item.timeScaleFunction}
                                            options={Object.entries(TimeScaleTable).map(([label, value]) => ({
                                                label,
                                                value,
                                            }))}
                                            width="lg:w-[140px] w-full"
                                        />
                                    </div>
                                </div>
                            }
                        >
                            <div className='overflow-scroll lg:overflow-auto'>
                                <DataReChartGraph data={item.data} />
                            </div>
                        </Block>
                    ))
                }
            </div>
        </div>
    );
}