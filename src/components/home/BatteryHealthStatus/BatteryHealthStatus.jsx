// src/components/BatteryHealthStatus.jsx
import React from 'react';
import { FaHeartbeat } from 'react-icons/fa';

export default function BatteryHealthStatus({ health }) {
  let color = 'text-green-400';
  let status = '健康';

  if (health < 70) {
    color = 'text-red-500';
    status = '嚴重衰退';
  } else if (health < 90) {
    color = 'text-yellow-400';
    status = '輕微衰退';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <FaHeartbeat className={`text-4xl mb-2 ${color}`} />
      <div className="text-white font-medium">{health}%</div>
      <div className="text-sm text-white opacity-80">{status}</div>
    </div>
  );
}