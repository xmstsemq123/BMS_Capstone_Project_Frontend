// pages/SettingPage.jsx
import React, { useState } from 'react';
import AlarmThresholdSetting from './AlarmThresholdSetting/AlarmThresholdSetting';
import UserPasswordSetting from './UserPasswordSetting/UserPasswordSetting';

export default function SettingPage() {
    const [tab, setTab] = useState('threshold');

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#1a1733] text-white">
            {/* Sidebar：手機在上、桌機在左 */}
            <div className="flex lg:flex-col justify-center lg:h-[200px] w-full lg:w-52 bg-[#2e2b4a] p-3 lg:p-6 gap-2 lg:gap-4 rounded-xl">
                <div className='w-full'>
                    <button
                        className={`flex-1 w-full px-3 py-2 rounded text-center lg:mb-3 h-[60px] ${tab === 'threshold' ? 'bg-purple-700 font-bold' : 'hover:bg-purple-800'
                            }`}
                        onClick={() => setTab('threshold')}
                    >
                        警報閥值設定
                    </button>
                </div>
                <div className='w-full'>
                    <button
                        className={`flex-1 w-full px-3 py-2 rounded text-center h-[60px] ${tab === 'user' ? 'bg-purple-700 font-bold' : 'hover:bg-purple-800'
                            }`}
                        onClick={() => setTab('user')}
                    >
                        重新設定密碼
                    </button>
                </div>

            </div>

            {/* 主內容區塊 */}
            <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
                {tab === 'threshold' && <AlarmThresholdSetting />}
                {tab === 'user' && <UserPasswordSetting />}
            </div>
        </div>
    );
}
