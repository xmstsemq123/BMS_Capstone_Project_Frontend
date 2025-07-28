import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjs from 'dayjs';
dayjs.extend(utc)
dayjs.extend(timezone)
export default function getDifferentTime(dataTime, currentTime){
    const time1 = dayjs.utc(dataTime).tz('Asia/Taipei')
    const time2 = dayjs.utc(currentTime).tz('Asia/Taipei')
    const diffTimeSec = time2.diff(time1, 'second')
    const diffTimeMin = time2.diff(time1, 'minute')
    const diffTimeHour = time2.diff(time1, 'hour')
    const diffTimeDay = time2.diff(time1, 'day')
    const diffTimeMonth = time2.diff(time1, 'month')
    const diffTimeYear = time2.diff(time1, 'year')
    if (diffTimeSec < 0) {
        return `剛剛`
    } else if (diffTimeSec < 60) {
        return `${diffTimeSec}秒前`
    } else if (diffTimeMin < 60) {
        return `${diffTimeMin}分鐘前`
    } else if (diffTimeHour < 24) {
        return `${diffTimeHour}小時前`
    } else if (diffTimeDay < 31) {
        return `${diffTimeDay}天前`
    } else if (diffTimeMonth < 12) {
        return `${diffTimeMonth}個月前`
    } else {
        return `${diffTimeYear}年前`
    }
}