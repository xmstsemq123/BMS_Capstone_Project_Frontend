// src/components/CellActivityBlock.jsx
import React from 'react';
import { FaBatteryFull } from 'react-icons/fa';

export default function CellActivityBlock({ chargingIndex = null, dischargingIndex = null }) {
  const totalCells = 16;

  const getColor = (index) => {
    if (index === chargingIndex) return 'bg-green-400';       // 正在充電
    if (index === dischargingIndex) return 'bg-red-400';      // 正在放電
    return 'text-gray-500';                                     // 靜止狀態
  };

  return (<>
      {Array.from({ length: totalCells }, (_, i) => (
        <div key={i} className={`flex flex-col items-center text-sm ${getColor(i)}`}>
          <FaBatteryFull className={`text-5xl`} />
          <span className='font-bold text-[16px]'>Cell {i + 1} 
          {
            i == chargingIndex ? " (充電)" : null  
          }
          {
            i == dischargingIndex ? " (放電)" : null  
          }
          </span>
        </div>
      ))}
  </>);
}