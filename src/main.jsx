import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store.js'

import Nav from './components/Nav/Nav.jsx'
import Home from './components/home/home.jsx'
import Analytics from './components/Analytics/Analytics.jsx'
import LoginPage from './components/LoginPage/LoginPage.jsx'
import CheckUser from './components/CheckUser/CheckUser.jsx'
import Error from './components/Error/Error.jsx'
import HomeDataFetch from './components/DataFetch/HomeDataFetch.jsx'
import GlobalDataFetch from './components/DataFetch/GlobalDataFetch.jsx'
import AnalyticsDataFetch from './components/DataFetch/AnalyticsDataFetch.jsx'
import Annomaly from './components/Annomaly/Annomaly.jsx'
import AnnomalyDataFetch from './components/DataFetch/AnnomalyDataFetch.jsx'
import SettingPage from './components/Setting/SettingPage.jsx'
import ThresholdDataFetch from './components/DataFetch/ThresholdDataFetch.jsx'
import UserPasswordSettingDataFetch from './components/DataFetch/UserPasswordSettingDataFetch.jsx'
import Files from './components/Files/Files.jsx'
import FilesDataFetch from './components/DataFetch/FilesDataFetch.jsx'
import NotificationDataFetch from './components/DataFetch/NotificationDataFetch.jsx'
import Profile from './components/Profile/Profile.jsx'
import Logout from './components/Logout/Logout.jsx'
import './Public/scrollbar.css'
import DesktopNotification from './components/DesktopNotification/DesktopNotification.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <DesktopNotification />
      <GlobalDataFetch />
      <HomeDataFetch />
      <AnalyticsDataFetch />
      <AnnomalyDataFetch />
      <ThresholdDataFetch />
      <UserPasswordSettingDataFetch />
      <NotificationDataFetch />
      <FilesDataFetch />
      {/* Nav Bar */}
      <Router>
        <CheckUser />
        <div className="min-h-screen bg-[#161325] text-white font-sans">
          <Nav />
          <Error className="h-full w-full" />
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/Login" element={<LoginPage />} />
              <Route path='/annomaly' element={<Annomaly />} />
              <Route path='/settings' element={<SettingPage />} />
              <Route path='files' element={<Files />} />
              <Route path='profile' element={<Profile />} />
              <Route path='logout' element={<Logout />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  </StrictMode>
)
