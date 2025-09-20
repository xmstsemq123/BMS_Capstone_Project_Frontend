import React from 'react';

export default function BatteryLevel({ percentage }) {
  const levelColor = percentage >= 60 ? 'bg-green-500' :
                     percentage >= 30 ? 'bg-yellow-400' :
                     'bg-red-500';

  return (
    <div className="flex flex-col items-center p-8">
        <div className="relative w-32 h-13 bg-gray-700 rounded-md overflow-hidden mt-3">
            <div className="absolute -right-2 top-3 w-2 h-9 bg-gray-500 rounded-sm"></div>
            <div
            className={`${levelColor} h-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
            />
        </div>
        <div className="text-xl font-bold mt-5">{percentage}%</div>
    </div>
  );
}
