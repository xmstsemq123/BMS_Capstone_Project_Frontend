import { FaMotorcycle, FaRegClock } from 'react-icons/fa';

export default function RideStatus({ riding }) {
  const isRiding = riding === true;

  return (
    <div className="flex flex-col items-center justify-center">
      {isRiding ? (
        <>
          <FaMotorcycle className="text-6xl text-amber-500 mb-2" />
          <span className="text-white font-bold text-2xl">騎乘中</span>
        </>
      ) : (
        <>
          <FaRegClock className="text-6xl text-gray-400 mb-4" />
          <span className="text-white font-bold text-2xl">閒置中</span>
        </>
      )}
    </div>
  );
}
