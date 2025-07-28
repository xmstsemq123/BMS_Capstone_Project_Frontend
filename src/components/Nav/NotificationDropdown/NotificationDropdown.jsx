import { FaBell } from 'react-icons/fa';

export default function NotificationDropdown() {
  return (
    <div className="relative group">
      <FaBell className="text-pink-400 text-xl cursor-pointer" />
      <div className="absolute top-8 right-0 bg-white text-black text-sm rounded shadow-md p-3 w-48 hidden group-hover:block z-10">
        🔔 無新通知
      </div>
    </div>
  );
}
