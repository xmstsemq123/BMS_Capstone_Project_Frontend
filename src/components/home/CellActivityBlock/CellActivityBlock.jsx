import React, { useEffect, useState } from 'react';
import { FaBatteryFull } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

export default function CellActivityBlock() {
  const cellAllData = useSelector(state => state.cellAllData)
  const CellDataBound = useSelector(state => state.threshold.serverBounds)
  const [selectedCell, setSelectedCell] = useState(null);
  const [annomalyStatus, setAnnomalyStatus] = useState(() => {
    let array = []
    for (let i = 0; i < cellAllData.CellDataArray.length; i++) {
      array.push({
        voltageStatus: 0, currentStatus: 0, temperatureStatus: 0
      })
    }
    return array
  })
  useEffect(() => {
    let annomalyArray = []
    annomalyStatus.forEach((_, index) => {
      let itemDict = cellAllData.CellDataArray[index]
      const { voltageStatus, currentStatus, temperatureStatus } = getDataStatus(itemDict['voltage'], cellAllData.WholeCurrent, itemDict['temperature'])
      annomalyArray.push({
        'voltageStatus': voltageStatus,
        'currentStatus': currentStatus,
        'temperatureStatus': temperatureStatus
      })
    })
    setAnnomalyStatus(annomalyArray)
  }, [cellAllData])
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
      const normalBound = CellDataBound[boundName]['normal']
      const warnBound = CellDataBound[boundName]['warn']
      const dangerBound = CellDataBound[boundName]['danger']
      let dataStatus = 2
      if (value >= normalBound[0] && value <= normalBound[1]) dataStatus = 0
      else if (value >= warnBound[0] && value <= warnBound[1]) dataStatus = 1
      else if (value >= dangerBound[0] && value <= dangerBound[1]) dataStatus = 2
      dataValueStatus[`${boundName}Status`] = dataStatus
    }
    return dataValueStatus
  }
  const getSeverityColor = (severity) => {
    if (severity === 0) return 'bg-green-500';   // normal
    if (severity === 1) return 'bg-lime-600';
    if (severity === 2) return 'bg-lime-700';
    if (severity === 3) return 'bg-yellow-600';
    if (severity === 4) return 'bg-yellow-700';
    if (severity === 5) return 'bg-amber-700';
    return 'bg-red-800';                          // danger
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
  const calculateCellHealth = (voltageStatus, currentStatus, temperatureStatus) => {
    const totalSeverity = voltageStatus + currentStatus + temperatureStatus;
    return totalSeverity;
  };
  useEffect(() => {
    if (selectedCell !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCell]);


  return (
    <div className="grid grid-cols-2 sm:grid-cols-8 gap-4 justify-items-center">
      {Array.from({ length: cellAllData.CellDataArray.length }, (_, i) => {
        const cellColor = getSeverityColor(calculateCellHealth(annomalyStatus[i].voltageStatus, annomalyStatus[i].currentStatus, annomalyStatus[i].temperatureStatus));
        return (
          <div
            key={i}
            className={`flex flex-col items-center text-sm w-full hover:opacity-55 transition duration-400 text-white ${cellColor} p-3 rounded-lg cursor-pointer`}
            onClick={() => setSelectedCell(i)}
          >
            <FaBatteryFull className="text-5xl" />
            <span className='text-[20px] font-semibold'>Cell {i + 1}</span>
            <p className="text-[18px] font-bold">
              {healthLevelPrompt[calculateCellHealth(annomalyStatus[i].voltageStatus, annomalyStatus[i].currentStatus, annomalyStatus[i].temperatureStatus)]}
            </p>
          </div>
        );
      })}
      {/* 彈出視窗 */}
      {selectedCell !== null && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-scroll"
          style={{
            WebkitOverflowScrolling: 'touch',
          }} >
          <div className="min-h-[100vh] flex justify-center items-start py-8 px-4">
            <div className="bg-[#1f1b3a] text-white p-6 rounded-xl w-full max-w-5xl shadow-lg flex flex-col justify-center">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Cell {selectedCell + 1} 詳情
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 電量 */}
                <div className="bg-[#2e2b4a] p-4 rounded-lg shadow flex flex-col items-center">
                  <span className="text-sm mb-2">電量</span>
                  <div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${cellAllData.CellDataArray[selectedCell].SOC}%` }}
                    />
                  </div>
                  <p className="text-lg font-semibold">
                    {cellAllData.CellDataArray[selectedCell].SOC.toFixed(1)}%
                  </p>
                </div>

                {/* 整體狀況 */}
                <div className="bg-[#2e2b4a] p-4 rounded-lg shadow flex flex-col items-center">
                  <span className="text-sm mb-2">整體情況</span>
                  <div className="text-4xl mb-2">
                    {calculateCellHealth(
                      annomalyStatus[selectedCell].voltageStatus,
                      annomalyStatus[selectedCell].currentStatus,
                      annomalyStatus[selectedCell].temperatureStatus
                    ) >= 4 ? '⚠️' : '✅'}
                  </div>
                  <p className="text-lg font-semibold">
                    {
                      healthLevelPrompt[
                      calculateCellHealth(
                        annomalyStatus[selectedCell].voltageStatus,
                        annomalyStatus[selectedCell].currentStatus,
                        annomalyStatus[selectedCell].temperatureStatus
                      )
                      ]
                    }
                  </p>
                </div>

                {/* 溫度狀態 */}
                <div className="bg-[#2e2b4a] p-4 rounded-lg shadow flex flex-col items-center">
                  <span className="text-sm mb-2">溫度狀態</span>
                  <div className="text-4xl mb-2">🌡️</div>
                  <p className="text-lg font-semibold">
                    {cellAllData.CellDataArray[selectedCell].temperature.toFixed(1)}°C
                  </p>
                  <p className="text-sm mt-1">
                    {annomalyStatus[selectedCell].temperatureStatus >= 2
                      ? '過熱/過冷'
                      : annomalyStatus[selectedCell].temperatureStatus === 1
                        ? '輕微異常'
                        : '正常'}
                  </p>
                </div>

                {/* 健康狀態 */}
                <div className="bg-[#2e2b4a] p-4 rounded-lg shadow flex flex-col items-center">
                  <span className="text-sm mb-2">健康狀態</span>
                  <div className="text-4xl mb-2">❤️</div>
                  <p className="text-lg font-semibold">
                    {cellAllData.CellDataArray[selectedCell].SOH.toFixed(1)}%
                  </p>
                  <p className="text-sm mt-1">
                    {cellAllData.CellDataArray[selectedCell].SOH < 60 ? '嚴重衰退' : '良好'}
                  </p>
                </div>
                {/* 電壓狀態 */}
                <div className="bg-[#2e2b4a] p-4 rounded-lg shadow flex flex-col items-center">
                  <span className="text-sm mb-2">電壓狀態</span>
                  <div className="text-4xl mb-2">🔌</div>
                  <p className="text-lg font-semibold">
                    {cellAllData.CellDataArray[selectedCell].voltage.toFixed(2)} V
                  </p>
                  <p className="text-sm mt-1">
                    {annomalyStatus[selectedCell].voltageStatus >= 2
                      ? '嚴重異常'
                      : annomalyStatus[selectedCell].voltageStatus === 1
                        ? '輕微異常'
                        : '正常'}
                  </p>
                </div>
                {/* 電流狀態 */}
                <div className="bg-[#2e2b4a] p-4 rounded-lg shadow flex flex-col items-center">
                  <span className="text-sm mb-2">電流狀態</span>
                  <div className="text-4xl mb-2">⚡</div>
                  <p className="text-lg font-semibold">
                    {cellAllData.WholeCurrent.toFixed(2)} A
                  </p>
                  <p className="text-sm mt-1">
                    {annomalyStatus[selectedCell].currentStatus >= 2
                      ? '嚴重異常'
                      : annomalyStatus[selectedCell].currentStatus === 1
                        ? '輕微異常'
                        : '正常'}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setSelectedCell(null)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
