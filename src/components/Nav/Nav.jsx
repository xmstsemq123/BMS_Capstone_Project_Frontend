// src/components/Nav.jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaBell, FaUserCircle, FaGlobe, FaChartLine, FaUsers, FaFileAlt, FaCog, FaBars, FaExclamationTriangle } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setCurrentNavRouteStatus } from '../../features/Nav/navSlice';
import { formatTimestamp } from '../Annomaly/components/formatTimestamp';
import getDifferentTime from '../Annomaly/components/getDifferentTime';
import { POST_LOAD_MORE_NOTIFICATION_DATA, PUT_TURN_READ } from '../../Public/APIUrl';
import { setErrMsg, setIs_Error } from '../../features/Error/ErrorSlice';
import { insertBackReadMsg, insertBackUnreadMsg, TransAllUnreadToRead } from '../../features/Notification/NotificationSlice';
import Spinner from '../../Public/Spinner';

export default function Nav() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false)
  const dispatch = useDispatch()
  const setErrorMsg = (data) => {
    dispatch(setIs_Error(true))
    dispatch(setErrMsg(data))
  }
  let is_userLogin = useSelector((state) => state.user.loginState)
  const { unreadMsg, readMsg } = useSelector(state => state.notification)
  const { currentTime } = useSelector(state => state.nowtime)
  const navItems = [
    { icon: <FaGlobe className="text-2xl" />, label: 'Home', path: '/' },
    { icon: <FaChartLine className="text-2xl" />, label: 'Analytics', path: '/analytics' },
    { icon: <FaFileAlt className="text-2xl" />, label: 'Files', path: '/files' },
    { icon: <FaExclamationTriangle className="text-2xl" />, label: 'Annomaly', path: '/annomaly' },
  ];
  // { icon: <FaCog className="text-2xl" />, label: 'Settings', path: '/settings' },
  function setRouteStatus(path) {
    dispatch(setCurrentNavRouteStatus(path))
  }
  const notiMsgBlock = (item) => {
    const timePrompt = getDifferentTime(item.timestamp.$date, currentTime)
    const timeFormatDate = formatTimestamp(item.timestamp.$date)
    return (
      <div key={item._id.$oid} id={item._id.$oid}
        className='flex flex-col w-full h-[90px] justify-center gap-3 
        hover:bg-gray-500 rounded px-4
        '
      >
        <div className='flex flex-row justify-between items-center 
        font-bold'>
          <div className='flex flex-row items-center gap-2'>
            {
              item.is_read ? null : (
                <p className='bg-red-800 text-white rounded px-1 py-0.5'>未讀</p>
              )
            }
            <p className='bg-white text-black rounded px-1 py-0.5'>{timePrompt}</p>
          </div>
          <p>{timeFormatDate}</p>
        </div>
        <p className='text-[16px]'>{item.message}</p>
      </div>
    )
  }
  function TurnUnreadToRead() {
    if (unreadMsg.length == 0) return
    let idArray = []
    unreadMsg.forEach((item) => {
      idArray.push(item._id.$oid)
    })
    fetch(PUT_TURN_READ, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itemsIDArray: idArray
      })
    })
      .then(res => res.json())
      .then(data => {
        data = JSON.parse(data)
        if (data["status"] != "success") {
          setErrorMsg("將未讀訊息轉為已讀時發生錯誤！")
          return
        }
        dispatch(TransAllUnreadToRead())
      })
      .catch(err => {
        setErrorMsg("將未讀訊息轉為已讀時發生錯誤！")
      })
  }
  //------ notification scroll listening ------//
  const notificationRef = useRef(null);
  // 是否正在加載避免重複觸發
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const handleScroll = useCallback(() => {
    if (noMoreData) return
    const div = notificationRef.current;
    if (!div || isLoadingMore) return;
    const scrollTop = div.scrollTop;
    const scrollHeight = div.scrollHeight;
    const clientHeight = div.clientHeight;
    // 若滾到距離底部 < 20px，觸發加載
    if (scrollTop + clientHeight >= scrollHeight - 60) {
      setIsLoadingMore(true)
    }
  }, [isLoadingMore]);
  // 加載完成後重設狀態
  useEffect(() => {
    if (isLoadingMore == false || noMoreData == true) return
    let lastTime = ''
    let lastOid = ''
    if (readMsg.length == 0 && unreadMsg.length == 0) {
      console.log(readMsg)
      console.log(unreadMsg)
      setIsLoadingMore(false)
      return
    }
    if (unreadMsg.length == 0) {
      lastTime = readMsg[readMsg.length - 1]["timestamp"]["$date"]
      lastOid = readMsg[readMsg.length - 1]["_id"]["$oid"]
    }
    else if (readMsg.length == 0) {
      lastTime = unreadMsg[unreadMsg.length - 1]["timestamp"]["$date"]
      lastOid = unreadMsg[unreadMsg.length - 1]["_id"]["$oid"]
    }
    else {
      let readMsgLastTime = readMsg[readMsg.length - 1]["timestamp"]["$date"]
      let unreadMsgLastTime = unreadMsg[unreadMsg.length - 1]["timestamp"]["$date"]
      if (new Date(readMsgLastTime) < new Date(unreadMsgLastTime)) {
        lastTime = readMsgLastTime
        lastOid = readMsg[readMsg.length - 1]["_id"]["$oid"]
      } else {
        lastTime = unreadMsgLastTime
        lastOid = unreadMsg[unreadMsg.length - 1]["_id"]["$oid"]
      }
    }
    fetch(POST_LOAD_MORE_NOTIFICATION_DATA, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lastItemID: lastOid,
        lastItemTimestamp: lastTime
      })
    })
      .then(res => res.json())
      .then(data => {
        data = JSON.parse(data)
        if (data.status === 'success') {
          const newData = data.data;
          if (newData.length == 0) setNoMoreData(true)
          else newData.forEach((item) => {
            if (item.is_read == true)
              dispatch(insertBackReadMsg(item))
            else
              dispatch(insertBackUnreadMsg(item))
          });
        } else {
          setErrorMsg("加載更多通知失敗！")
        }
        setIsLoadingMore(false);
      })
      .catch(err => {
        setErrorMsg("加載更多通知失敗！")
      })
  }, [isLoadingMore])
  return <>{
    is_userLogin ? (
      <nav className="relative px-4 py-3 bg-[#1f1b2e] text-white shadow-md select-none">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-400">BMS Monitor</span>

          {/* Desktop nav icons */}
          <div className='flex items-center'>
            <div className="hidden lg:flex items-center gap-2 text-gray-300">
              {navItems.map((item, index) => (
                <Link to={item.path} key={index} title={item.label} onClick={() => setRouteStatus(item.path)}>
                  <div className="w-14 h-14 flex items-center justify-center rounded-md hover:bg-white/10 transition duration-200">
                    {item.icon}
                  </div>
                </Link>
              ))}

              {/* Divider */}
              <div className="w-px h-6 bg-gray-600 mx-4" />
            </div>
            <div className='flex'>
              {/* Notifications */}
              <div
                className="relative w-14 h-14 flex items-center justify-center 
                rounded-md hover:bg-white/10 transition duration-200"
                title="Notifications"
                onMouseEnter={() => setShowNotifications(true)}
                onMouseLeave={() => {
                  setShowNotifications(false)
                  TurnUnreadToRead()
                }}
              >
                <FaBell className="text-2xl cursor-pointer" />
                {
                  unreadMsg.length == 0 ? null : (
                    <div className='absolute w-[13px] h-[13px] 
                rounded-[6.5px] right-[8px] top-[10px]
                bg-red-500'></div>
                  )
                }
                {
                  showNotifications && (
                    <div
                      ref={notificationRef}
                      onScroll={handleScroll}
                      className={`absolute top-14 sm:right-0 right-[-100px] bg-[#2e2b4a] 
                    text-white text-sm rounded-xl shadow-[0px_6px_10px_8px_rgba(0,_0,_0,_0.5)] w-90 z-10
                    max-h-[500px] overflow-y-scroll`}
                    >
                      {/* Unread Messages */}
                      <div>{unreadMsg.map((item) => notiMsgBlock(item))}</div>
                      {/* Read Messages */}
                      <div>{readMsg.map((item) => notiMsgBlock(item))}</div>
                      {/* loading spinner */}
                      {isLoadingMore && (
                        <div className="text-center py-4 text-gray-400 text-sm flex justify-center items-center">
                          <div className='w-[30px] h-[30px]'>
                            <Spinner />
                          </div>
                        </div>
                      )}
                      {/* if no more data */}
                      {noMoreData && (
                        <div
                          className='flex flex-col w-full h-[60px] justify-center
                          hover:bg-gray-500 rounded items-center text-xl text-bold
                        '
                        >
                          沒有更多通知了{'><'}
                        </div>
                      )}
                    </div>
                  )
                }
              </div>

              {/* User Profile */}
              <div
                className="relative w-14 h-14 flex items-center justify-center rounded-md hover:bg-white/10 transition duration-200"
                title="User Profile"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <FaUserCircle className="text-3xl cursor-pointer" />
                {showUserMenu && (
                  <div className="absolute top-14 right-0 bg-[#2e2b4a] text-white text-sm rounded shadow-md w-56 z-10 divide-y divide-gray-700">
                    <Link to="/profile" className="block py-3 text-center hover:bg-white/10 transition duration-200">個人資料</Link>
                    <Link to="/settings" className="block py-3 text-center hover:bg-white/10 transition duration-200">個人化設定</Link>
                    <Link to="/logout" className="block py-3 text-center hover:bg-white/10 transition duration-200">登出</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu toggle */}
            <div className="lg:hidden relative w-14 h-14 flex items-center justify-center rounded-md cursor-pointer hover:bg-white/10 transition duration-200">
              <button onClick={() => setMenuOpen(!menuOpen)} className='block py-3 text-center cursor-pointer'>
                <FaBars className="text-3xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="lg:hidden mt-4 bg-[#2e2b4a] rounded-md p-4 flex flex-col gap-3 text-white shadow-md">
            {navItems.map((item, index) => (
              <Link
                to={item.path}
                key={index}
                className="flex items-center gap-3 hover:bg-white/10 rounded px-3 py-2 transition"
                onClick={() => { setMenuOpen(false); setRouteStatus(item.path) }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>
    ) : null}</>
}