import React from 'react';
import { formatTimestamp } from '../components/formatTimestamp';

export default function Modal({ title, data, onClose, onClear }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-[#2e2b4a] text-white rounded-xl shadow-lg w-[90%] sm:w-[80%] md:w-3/5 max-w-screen-md p-4 md:p-6 max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-4">
          <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div key={index} className="bg-gradient-to-r from-[#3d3a60] to-[#504d76] p-3 md:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col gap-2 md:gap-3">
                  <div className="text-blue-300 font-semibold text-base md:text-lg">
                    {formatTimestamp(item.timestamp)}
                  </div>
                  <div className="ml-1 md:ml-4 text-base md:text-lg font-medium text-gray-100 whitespace-pre-wrap">
                    {item.message}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm md:text-base">目前沒有資料。</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
          <button
            onClick={onClear}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1 rounded w-full sm:w-auto"
          >
            我已知曉
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-4 py-1 rounded w-full sm:w-auto"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
