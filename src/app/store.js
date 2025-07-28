import { configureStore } from "@reduxjs/toolkit"
import userReducer from '../features/user/userSlice'
import navReducer from '../features/Nav/navSlice'
import HomeDataReducer from '../features/RouteData/HomeData'
import AnalyticsDataReducer from '../features/RouteData/AnalyticsData'
import ErrorSliceReducer from '../features/Error/ErrorSlice'
import isRenderedSlice from '../features/IsRendered/isRenderedSlice'
import AnnomalyDataSlice from '../features/RouteData/AnnomalyData'
import AnnomalySlice from '../features/Annomaly/AnnomalySlice'
import CellAllDataSlice from '../features/CellAllData/CellAllDataSlice'
import ThresholdSlice from '../features/Threshold/ThresholdSlice'
import UserPasswordSlice from '../features/UserPasswordSetting/UserPasswordSettingSlice'
import FilesSlice from '../features/Files/FilesSlice'
import NowTimeSlice from '../features/NowTime/NowTimeSlice'
import NotificationSlice from '../features/Notification/NotificationSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        nav: navReducer,
        annomaly: AnnomalySlice,
        threshold: ThresholdSlice,
        UserPasswordSetting: UserPasswordSlice,
        files: FilesSlice,
        homeData: HomeDataReducer,
        cellAllData: CellAllDataSlice,
        analyticsData: AnalyticsDataReducer,
        annomalyData: AnnomalyDataSlice,
        error: ErrorSliceReducer,
        isRendered: isRenderedSlice,
        nowtime: NowTimeSlice,
        notification: NotificationSlice
    },
})