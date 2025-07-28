import React, { useState } from 'react';
import dayjs from 'dayjs';

// 用來顯示警報卡片
export default function AlertCard({ item }) {
  const colorMap = {
    voltage: 'from-rose-400 via-red-500 to-pink-500',
    temperature: 'from-yellow-400 via-orange-500 to-red-500',
    current: 'from-green-400 via-teal-500 to-cyan-500',
    default: 'from-gray-400 via-gray-500 to-gray-600',
  };
  const gradient = colorMap[item.dataType] || colorMap.default;

  return (
    <div className={`p-4 rounded-xl shadow-md bg-gradient-to-r ${gradient} text-white`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-lg">
          {item.dataType === 'voltage' && '🔋 電壓警報'}
          {item.dataType === 'temperature' && '🌡️ 溫度警報'}
          {item.dataType === 'current' && '⚡ 電流警報'}
          {!['voltage', 'temperature', 'current'].includes(item.dataType) && '📢 警報'}
        </span>
        <span className="text-sm font-mono bg-white text-black px-2 py-0.5 rounded">
          {dayjs(item.timestamp).format('MM/DD HH:mm')}
        </span>
      </div>
      <p className="text-sm">{item.message}</p>
    </div>
  );
}
