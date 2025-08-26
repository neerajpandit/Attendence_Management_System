import { useSelector } from 'react-redux';
import CONSTANTS from '../constants.json';
import { NavLink } from 'react-router-dom';
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaRegCreditCard,
  FaUmbrellaBeach,
} from 'react-icons/fa6';
import { FaChartSimple } from 'react-icons/fa6';
import { AiFillProduct } from 'react-icons/ai';
import { VscGroupByRefType } from 'react-icons/vsc';
import { MdBusiness, MdPeopleAlt, MdAssignmentTurnedIn } from 'react-icons/md';

import { TbBrandUnity, TbMoneybag } from 'react-icons/tb';
import { RiMoneyRupeeCircleLine } from 'react-icons/ri';
import { PiBuildings } from 'react-icons/pi';
import { FaUser } from 'react-icons/fa';
import { FaRupeeSign } from 'react-icons/fa';

const Sidebar = ({ toggleSidebar, setToggleSidebar }) => {
  const { userRole } = useSelector((state) => state.userDetailsSlice.details);
  // Define query parameters
  const guaranteesQueryParams = new URLSearchParams({
    bgType: '1',
    bgPage: '1',
    bgSortBy: userRole === '0' || userRole === '3' ? 'expiringIn' : 'createdAt',
    bgSortOrder: userRole === '0' || userRole === '3' ? '1' : '-1',
  });
  return (
    <div className="m-0 py-4 px-3 flex flex-col h-full justify-between ">
      <div className="flex flex-col gap-3 justify-center">
        {/* DASHBOARD */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) => {
            const activeClass = isActive
              ? 'bg-primary text-white'
              : 'hover:bg-gray-100';

            return `block rounded-md py-2 ${activeClass} ${
              toggleSidebar ? 'px-1' : 'px-4'
            }`;
          }}
        >
          {({ isActive }) => (
            <div
              className={`flex items-center gap-2 ${
                toggleSidebar && 'justify-center'
              }`}
            >
              <AiFillProduct
                className={`text-lg ${
                  isActive ? 'text-white' : 'text-primary'
                }`}
              />
              <div
                className={`${
                  toggleSidebar
                    ? 'hidden transition-all duration-300'
                    : 'block transition-all duration-300'
                }`}
              >
                {CONSTANTS.SIDEBAR.DASHBOARD}
              </div>
            </div>
          )}
        </NavLink>
        {/*Organization Master */}
        {userRole === '0' && (
          <NavLink
            to="/organization-master"
            className={({ isActive }) => {
              const activeClass = isActive
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100';

              return `block rounded-md py-2 ${activeClass} ${
                toggleSidebar ? 'px-1' : 'px-4'
              }`;
            }}
          >
            {({ isActive }) => (
              <div
                className={`flex items-center gap-2 ${
                  toggleSidebar && 'justify-center'
                }`}
              >
                <MdBusiness
                  className={`text-lg ${
                    isActive ? 'text-white' : 'text-primary'
                  }`}
                />
                <div
                  className={`${
                    toggleSidebar
                      ? 'hidden transition-all duration-300'
                      : 'block transition-all duration-300'
                  }`}
                >
                  {CONSTANTS.SIDEBAR.ORGANIZATION_MASTER}
                </div>
              </div>
            )}
          </NavLink>
        )}
        {/* Staff Master */}
        {userRole === '0' && (
          <NavLink
            to="/staff-master"
            className={({ isActive }) => {
              const activeClass = isActive
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100';

              return `block rounded-md py-2 ${activeClass} ${
                toggleSidebar ? 'px-1' : 'px-4'
              }`;
            }}
          >
            {({ isActive }) => (
              <div
                className={`flex items-center gap-2 ${
                  toggleSidebar && 'justify-center'
                }`}
              >
                <MdPeopleAlt
                  className={`text-lg ${
                    isActive ? 'text-white' : 'text-primary'
                  }`}
                />
                <div
                  className={`${
                    toggleSidebar
                      ? 'hidden transition-all duration-300'
                      : 'block transition-all duration-300'
                  }`}
                >
                  {CONSTANTS.SIDEBAR.STAFF_MASTER}
                </div>
              </div>
            )}
          </NavLink>
        )}
        {userRole === '0' && (
          <NavLink
            to="/plan-master"
            className={({ isActive }) => {
              const activeClass = isActive
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100';

              return `block rounded-md py-2 ${activeClass} ${
                toggleSidebar ? 'px-1' : 'px-4'
              }`;
            }}
          >
            {({ isActive }) => (
              <div
                className={`flex items-center gap-2 ${
                  toggleSidebar && 'justify-center'
                }`}
              >
                <FaRegCreditCard
                  className={`text-lg ${
                    isActive ? 'text-white' : 'text-primary'
                  }`}
                />
                <div
                  className={`${
                    toggleSidebar
                      ? 'hidden transition-all duration-300'
                      : 'block transition-all duration-300'
                  }`}
                >
                  {CONSTANTS.SIDEBAR.PLAN_MASTER}
                </div>
              </div>
            )}
          </NavLink>
        )}
        {userRole === '0' && (
          <NavLink
            to="/subscription-master"
            className={({ isActive }) => {
              const activeClass = isActive
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100';

              return `block rounded-md py-2 ${activeClass} ${
                toggleSidebar ? 'px-1' : 'px-4'
              }`;
            }}
          >
            {({ isActive }) => (
              <div
                className={`flex items-center gap-2 ${
                  toggleSidebar && 'justify-center'
                }`}
              >
                <FaRegCreditCard
                  className={`text-lg ${
                    isActive ? 'text-white' : 'text-primary'
                  }`}
                />
                <div
                  className={`${
                    toggleSidebar
                      ? 'hidden transition-all duration-300'
                      : 'block transition-all duration-300'
                  }`}
                >
                  {CONSTANTS.SIDEBAR.SUBSCRIPTION_MASTER}
                </div>
              </div>
            )}
          </NavLink>
        )}
        {userRole === '0' && (
          <NavLink
            to="/attendance-master"
            className={({ isActive }) => {
              const activeClass = isActive
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100';

              return `block rounded-md py-2 ${activeClass} ${
                toggleSidebar ? 'px-1' : 'px-4'
              }`;
            }}
          >
            {({ isActive }) => (
              <div
                className={`flex items-center gap-2 ${
                  toggleSidebar && 'justify-center'
                }`}
              >
                <MdAssignmentTurnedIn
                  className={`text-lg ${
                    isActive ? 'text-white' : 'text-primary'
                  }`}
                />
                <div
                  className={`${
                    toggleSidebar
                      ? 'hidden transition-all duration-300'
                      : 'block transition-all duration-300'
                  }`}
                >
                  {CONSTANTS.SIDEBAR.ATTENDANCE_MASTER}
                </div>
              </div>
            )}
          </NavLink>
        )}
        {userRole === '0' && (
          <NavLink
            to="/leave-master"
            className={({ isActive }) => {
              const activeClass = isActive
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100';

              return `block rounded-md py-2 ${activeClass} ${
                toggleSidebar ? 'px-1' : 'px-4'
              }`;
            }}
          >
            {({ isActive }) => (
              <div
                className={`flex items-center gap-2 ${
                  toggleSidebar && 'justify-center'
                }`}
              >
                <FaUmbrellaBeach
                  className={`text-lg ${
                    isActive ? 'text-white' : 'text-primary'
                  }`}
                />
                <div
                  className={`${
                    toggleSidebar
                      ? 'hidden transition-all duration-300'
                      : 'block transition-all duration-300'
                  }`}
                >
                  {CONSTANTS.SIDEBAR.LEAVE_MASTER}
                </div>
              </div>
            )}
          </NavLink>
        )}

        {/* Role 1 Master From Here  */}
        {userRole === '1' && (
          <NavLink
            to="/staff-master"
            className={({ isActive }) => {
              const activeClass = isActive
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100';

              return `block rounded-md py-2 ${activeClass} ${
                toggleSidebar ? 'px-1' : 'px-4'
              }`;
            }}
          >
            {({ isActive }) => (
              <div
                className={`flex items-center gap-2 ${
                  toggleSidebar && 'justify-center'
                }`}
              >
                <MdPeopleAlt
                  className={`text-lg ${
                    isActive ? 'text-white' : 'text-primary'
                  }`}
                />
                <div
                  className={`${
                    toggleSidebar
                      ? 'hidden transition-all duration-300'
                      : 'block transition-all duration-300'
                  }`}
                >
                  {CONSTANTS.SIDEBAR.STAFF_MASTER}
                </div>
              </div>
            )}
          </NavLink>
        )}
        {userRole === '2' && (
          <NavLink
            to="/apply-leave"
            className={({ isActive }) => {
              const activeClass = isActive
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100';

              return `block rounded-md py-2 ${activeClass} ${
                toggleSidebar ? 'px-1' : 'px-4'
              }`;
            }}
          >
            {({ isActive }) => (
              <div
                className={`flex items-center gap-2 ${
                  toggleSidebar && 'justify-center'
                }`}
              >
                <MdAssignmentTurnedIn
                  className={`text-lg ${
                    isActive ? 'text-white' : 'text-primary'
                  }`}
                />
                <div
                  className={`${
                    toggleSidebar
                      ? 'hidden transition-all duration-300'
                      : 'block transition-all duration-300'
                  }`}
                >
                  {CONSTANTS.SIDEBAR.LEAVE_MASTER}
                </div>
              </div>
            )}
          </NavLink>
        )}
        {userRole === '2' && (
          <NavLink
            to="/apply-leave"
            className={({ isActive }) => {
              const activeClass = isActive
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100';

              return `block rounded-md py-2 ${activeClass} ${
                toggleSidebar ? 'px-1' : 'px-4'
              }`;
            }}
          >
            {({ isActive }) => (
              <div
                className={`flex items-center gap-2 ${
                  toggleSidebar && 'justify-center'
                }`}
              >
                <FaUmbrellaBeach
                  className={`text-lg ${
                    isActive ? 'text-white' : 'text-primary'
                  }`}
                />
                <div
                  className={`${
                    toggleSidebar
                      ? 'hidden transition-all duration-300'
                      : 'block transition-all duration-300'
                  }`}
                >
                  {CONSTANTS.SIDEBAR.ATTENDANCE_MASTER}
                </div>
              </div>
            )}
          </NavLink>
        )}
      </div>
      <div className={`flex justify-end w-full`}>
        <button
          className="flex items-center justify-center py-2 px-3 rounded-md text-gray-500 hover:bg-gray-100"
          onClick={() => {
            setToggleSidebar(!toggleSidebar);
          }}
        >
          {toggleSidebar ? <FaAnglesRight /> : <FaAnglesLeft />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
