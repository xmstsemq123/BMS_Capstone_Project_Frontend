import { FaThermometerHalf } from 'react-icons/fa';

export default function TemperatureStatus({ temp }) {
  let color = 'text-green-400';
  let status = '正常';

  if (temp >= 45) {
    color = 'text-red-500';
    status = '過熱';
  } else if (temp >= 35) {
    color = 'text-orange-400';
    status = '偏熱';
  } else if (temp <= 9) {
    color = 'text-purple-400';
    status = '過冰';
  } else if (temp <= 19) {
    color = 'text-blue-400';
    status = '偏冷';
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <FaThermometerHalf className={`text-6xl mb-2 ${color}`} />
      <div className=" font-bold">{temp}°C</div>
      <div className="text-sm  opacity-80 font-bold">{status}</div>
    </div>
  );
}
