import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sha256 from 'crypto-js/sha256'
import { setUser } from '../../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentNavRouteStatus } from '../../features/Nav/navSlice';
import { POST_LOGIN } from '../../Public/APIUrl';

export default function LoginPage() {
  const [userAccount, setUserAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userDispatch = useDispatch()
  const { loginState } = useSelector(state => state.user)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    let crypto_password = sha256(password).toString()
    try {
      await fetch(POST_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          'userAccount': userAccount,
          'password': crypto_password
        }),
        credentials: "include"
      })
      .then(res => res.json())
      .then(data => {
        data = JSON.parse(data)
        if(data.success == true){
          userDispatch(
            setUser({
              loginState: true,
              userInfo: {
                  username: data.username,
                  userID: data.userID
              },
              access_token: data.access_token
            })
          )
          userDispatch(setCurrentNavRouteStatus('/'))
          navigate('/')
        }else{
          setError(data.message)
        }
      })
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    if(loginState) navigate("/")
  })
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1b2e] text-white">
      <div className="bg-[#2a2543] p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">使用者登入</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">帳號</label>
            <input
              type='text'
              value={userAccount}
              onChange={(e) => setUserAccount(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-[#1e1b2e] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-[#1e1b2e] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl mt-2 transition"
          >
            登入
          </button>
        </form>
      </div>
    </div>
  );
}
