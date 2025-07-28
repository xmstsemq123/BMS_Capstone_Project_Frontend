import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const NowTimeSlice = createSlice({
    name: 'nowTime',
    initialState: {
        currentTime: dayjs().tz('Asia/Taipei').toISOString()
    },
    reducers: {
        updateCurrentTime: (state) => {
            state.currentTime = dayjs().tz('Asia/Taipei').toISOString()
        }
    }
})
export const { updateCurrentTime } = NowTimeSlice.actions
export default NowTimeSlice.reducer