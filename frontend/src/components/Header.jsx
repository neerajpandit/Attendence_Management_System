import React, { useState } from 'react';
import CONSTANTS from '../constants.json';
import HeaderDropdown from './HeaderDropdown';
import ChangePassword from './ChangePassword';
import AlertButton from './AlertButton.jsx';
import { useSelector } from 'react-redux';
import NotificationButton from './NotificationButton.jsx';

const Header = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { userRole } = useSelector((state) => state.userDetailsSlice.details);
  return (
    <div className="flex justify-between items-center gap-5 px-8 py-3 bg-primary4">
      <div
        className=""
        style={{
          backgroundImage: `url('/')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div>
          <img src="/download.png" alt="logo" width="48" />
        </div>
        {/* <div className="text-slate-700 font-semibold text-md max-w-[350px] flex justify-center items-center text-center">
          {CONSTANTS.PROJECT_NAME}
        </div> */}
      </div>
      {/* Alert - Notification Icon and Dropdown */}
      <div className="flex gap-5 items-center">
        {/* {(userRole === '0' || userRole === '3') && <AlertButton />} */}
        {(userRole === '0' || userRole === '3') }
        <HeaderDropdown setModalOpen={setModalOpen} />
      </div>
      {/* Change Password Modal */}
      {isModalOpen && <ChangePassword closeModal={() => setModalOpen(false)} />}
    </div>
  );
};

export default Header;
