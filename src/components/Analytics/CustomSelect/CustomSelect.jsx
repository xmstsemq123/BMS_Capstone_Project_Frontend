import React, { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ options, value, onChange, label = '', width = 'w-[150px]' }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const closeDropdown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  return (
    <div ref={ref} className={`relative text-white text-center ${width}`}>
      {label && <span className="text-sm text-gray-300 block mb-1">{label}</span>}
      <div
        className="bg-black px-4 py-2 rounded-lg cursor-pointer border border-gray-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find(opt => opt.value === value)?.label || '請選擇'}
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 bg-black border border-gray-500 w-full z-10 rounded-md max-h-[200px] overflow-y-auto mt-1">
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                opt.value === value ? 'bg-purple-600' : ''
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
