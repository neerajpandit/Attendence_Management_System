import React, { useState, useEffect, useRef } from 'react';
import { IoMdSettings, IoMdArrowDropdown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import CONSTANTS from '../constants.json';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { setUserRole } from '../utils/setUserRole';
import { persistor } from '../redux/store'

const HeaderDropdown = ({ setModalOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { userRole, name } = useSelector(
    (state) => state.userDetailsSlice.details
  );

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div className="inline-flex items-center justify-center w-full rounded-md px-4 py-2 bg-white text-sm font-medium  shadow-md">
        <div className="flex gap-3 items-center text-gray-600">
          <span className="text-md font-semibold text-primary">
            {name || 'N/A'}
          </span>
          -
          <span className="text-md font-semibold text-gray-700">
            {setUserRole(userRole)}
          </span>
          <div className="border border-gray-300 h-4"></div>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none"
            onClick={toggleDropdown}
          >
            <IoMdArrowDropdown size={24} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition duration-200 ease-in-out transform">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div
              className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-150"
              role="menuitem"
              onClick={() => setModalOpen(true)}
            >
              {CONSTANTS.BUTTON.CHANGE_PASSWORD}
            </div>
            <div
              className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-150"
              role="menuitem"
              onClick={() => {
                Cookies.remove('accessToken');
                localStorage.clear();
                persistor.purge();
                navigate('/');
              }}
            >
              {CONSTANTS.BUTTON.LOGOUT}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderDropdown;
