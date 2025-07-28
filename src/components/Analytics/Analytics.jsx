import React, { useState, useEffect } from 'react';
import CellActivityBlock from './CellActivityBlock/CellActivityBlock'
import DataReChartGraph from './DataReChartGrpah/DataReChartGrpah'
import { useDispatch, useSelector } from 'react-redux';
import {
    setSOCGraphInfo, setTemperatureGraphInfo, setVoltageGraphInfo, setCurrentGraphInfo,
    setSOHGraphInfo
} from '../../features/RouteData/AnalyticsData'
import { FaBatteryFull, FaBatteryQuarter } from 'react-icons/fa';
import CustomSelect from './CustomSelect/CustomSelect';

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
    //--- time scale ---//
    const SOCTimeScale = graphInfo.SOC.TimeScale
    const SOHTimeScale = graphInfo.SOH.TimeScale
    const TempTimeScale = graphInfo.Temperature.TimeScale
    const VolTimeScale = graphInfo.Voltage.TimeScale
    const CurrentTimeScale = graphInfo.Current.TimeScale
    //------ graph info functions ------//
    //--- graph scale ---//
    const setSelectedCellSOC = (data) => dispatch(setSOCGraphInfo({ GraphScale: data, TimeScale: SOCTimeScale }))
    const setSelectedCellSOH = (data) => dispatch(setSOHGraphInfo({ GraphScale: data, TimeScale: SOHTimeScale }))
    const setSelectedTempCell = (data) => dispatch(setTemperatureGraphInfo({ GraphScale: data, TimeScale: TempTimeScale }))
    const setSelectedVolCell = (data) => dispatch(setVoltageGraphInfo({ GraphScale: data, TimeScale: VolTimeScale }))
    //--- time scale ---//
    const setSOCTimeScale = (data) => dispatch(setSOCGraphInfo({ GraphScale: selectedCellSOC, TimeScale: data }))
    const setSOHTimeScale = (data) => dispatch(setSOHGraphInfo({ GraphScale: selectedCellSOH, TimeScale: data }))
    const setTempTimeScale = (data) => dispatch(setTemperatureGraphInfo({ GraphScale: selectedTempCell, TimeScale: data }))
    const setVolTimeScale = (data) => dispatch(setVoltageGraphInfo({ GraphScale: selectedVolCell, TimeScale: data }))
    const setCurrentTimeScale = (data) => dispatch(setCurrentGraphInfo({ TimeScale: data }))
    //------ graph data ------//
    const SOCData = graphData.SOC
    const SOHData = graphData.SOH
    const TempData = graphData.Temperature
    const VolData = graphData.Voltage
    const CurrentData = graphData.Current
    //------ Array for quick layout ------//
    const chargeCompnents = [
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
        }, {
            is_cell: true,
            title: '歷史電壓紀錄',
            selectedCellValue: selectedVolCell,
            selectedCellFunction: setSelectedVolCell,
            timeScaleValue: VolTimeScale,
            timeScaleFunction: setVolTimeScale,
            data: VolData
        }, {
            is_cell: false,
            title: '歷史電流紀錄',
            timeScaleValue: CurrentTimeScale,
            timeScaleFunction: setCurrentTimeScale,
            data: CurrentData
        },
    ]
    return (
        <div className="flex flex-col gap-5 px-5 select-none">
            <div className='w-full space-y-5'>
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