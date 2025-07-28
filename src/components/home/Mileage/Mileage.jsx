export default function Mileage({ value }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-6xl font-bold text-white mb-1 mt-5">{value}</div>
      <div className="text-2xl text-gray-300 font-bold">KM</div>
    </div>
  );
}
