import { FaUserCircle } from 'react-icons/fa';

export default function UserDropdown() {
  return (
    <div className="relative group">
      <FaUserCircle className="text-3xl cursor-pointer" />
      <div className="absolute top-10 right-0 bg-white text-black text-sm rounded shadow-md p-3 w-48 hidden group-hover:block z-10">
        👤 使用者：Ageng<br />
        <button className="mt-2 text-blue-500 underline">登出</button>
      </div>
    </div>
  );
}