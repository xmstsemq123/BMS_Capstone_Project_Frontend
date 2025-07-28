import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

function formatTimestamp(isoString) {
  const d = dayjs.utc(isoString).tz('Asia/Taipei')

  const y = d.year()
  const m = d.month() + 1  // month 是 0-indexed
  const date = d.date()
  const hour = d.hour()
  const isPM = hour >= 12
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  const min = d.minute().toString().padStart(2, '0')
  const sec = d.second().toString().padStart(2, '0')

  return `${y}/${m.toString().padStart(2, '0')}/${date.toString().padStart(2, '0')} ${isPM ? '下午' : '上午'}${hour12.toString().padStart(2, '0')}:${min}:${sec}`
}

export { formatTimestamp }
