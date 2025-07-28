import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIs_submit, setIs_success, setNewPassword, setOldPassword, setPasswordErrorMsg, setPasswordIs_Error } from '../../../features/UserPasswordSetting/UserPasswordSettingSlice';
import Spinner from '../../../Public/Spinner';

export default function UserPasswordSetting() {
    const dispatch = useDispatch()
    const { is_submit, submitStatus, is_Error, errorMsg, oldPassword, newPassword, is_success } = useSelector(state => state.UserPasswordSetting)
    const [confirmPwd, setConfirmPwd] = useState('');
    const handleSubmit = () => {
        if (is_submit == true || submitStatus != "no") return
        dispatch(setIs_success(false))
        if (confirmPwd != newPassword) {
            dispatch(setPasswordIs_Error(true))
            dispatch(setPasswordErrorMsg("新密碼與確認密碼不一致！"))
            return;
        }
        dispatch(setIs_submit(true))
    };
    useEffect(() => {
        if (is_success == false) return
        setConfirmPwd('')
        const timer = setTimeout(() => {
            dispatch(setIs_submit(false))
        }, 10000);
        return () => clearTimeout(timer); // 清除計時器（避免重複觸發）
    }, [is_success])
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">👤 重新設定密碼</h2>
            <div className="space-y-4 max-w-md">
                <div>
                    <label className="block mb-1">舊密碼：</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 rounded bg-[#1e1c3a] text-white"
                        value={oldPassword}
                        onChange={(e) => dispatch(setOldPassword(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block mb-1">新密碼：</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 rounded bg-[#1e1c3a] text-white"
                        value={newPassword}
                        onChange={(e) => dispatch(setNewPassword(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block mb-1">確認新密碼：</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 rounded bg-[#1e1c3a] text-white"
                        value={confirmPwd}
                        onChange={(e) => setConfirmPwd(e.target.value)}
                    />
                </div>
            </div>
            {
                submitStatus == "submitting" && (
                    <div className='bg-[#2e2b4a] rounded-xl w-full p-5 flex flex-col items-center space-y-5'>
                        <p className='font-bold text-[22px]'>
                            與伺服器交互中...
                        </p>
                        <div className='w-[30px]'>
                            <Spinner color='fill-blue-100' />
                        </div>
                    </div>
                )
            }
            {
                is_success && (
                    <div className='bg-[#3c7544] rounded-xl w-full p-3 flex flex-col items-center space-y-5'>
                        <p className='font-bold text-[22px]'>
                            成功更新使用者密碼。
                        </p>
                    </div>
                )
            }

            {
                is_Error && (
                    <div className='bg-[#804b3d] rounded-xl w-full p-3 flex flex-col items-center space-y-5'>
                        <p className='font-bold text-[22px]'>
                            {errorMsg}
                        </p>
                    </div>
                )
            }
            <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white"
            >
                更新密碼
            </button>
        </div>
    );
}
