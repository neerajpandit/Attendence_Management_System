import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IoNotifications } from 'react-icons/io5';
import moment from 'moment';

const NotificationButton = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [filterUnread, setFilterUnread] = useState(false);
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const { userRole } = useSelector((state) => state.userDetailsSlice.details);

  const fetchNotificationData = () => {
    // dispatch(fetchNotifications()).then((res) => {
    //   if (res.success) {
    //     setNotifications(res.notifications);
    //     setUnreadNotifications(res.unreadNotifications);
    //   }
    // });
  };

  const handleMarkAsRead = (id) => {
    // dispatch(markAsRead({ id })).then((res) => {
    //   if (res.success) {
    //     fetchNotificationData();
    //   } else {
    //     toast.error(res.message);
    //   }
    // });
  };

  const handleMarkAllAsRead = () => {
    // dispatch(markAllAsRead()).then((res) => {
    //   if (res.success) {
    //     fetchNotificationData();
    //     setIsNotificationsModalOpen(false);
    //     toast.success('All notifications marked as read');
    //   } else {
    //     toast.error(res.message);
    //   }
    // });
  };

  const setNotificationColor = (requestStatus) => {
    if (requestStatus?.toLowerCase().includes('accepted')) {
      return 'bg-green-50'; // Accepted
    } else if (requestStatus?.toLowerCase().includes('rejected')) {
      return 'bg-rose-50'; // Rejected
    } else {
      return 'bg-blue-50'; // Default
    }
  };

  const openNotificationsModal = (e) => {
    const rect = e.target.getBoundingClientRect();
    const left = Math.min(rect.left + window.scrollX, window.innerWidth - 400);
    const top = Math.min(
      rect.bottom + window.scrollY + 10,
      window.innerHeight - 300
    );

    setModalPosition({ top, left });
    setIsNotificationsModalOpen(true);
  };

  useEffect(() => {
    fetchNotificationData();
  }, [dispatch]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsNotificationsModalOpen(false);
      }
    };

    if (isNotificationsModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsModalOpen]);

  return (
    <div>
      <div
        className="text-white hover:text-stone-200 cursor-pointer relative"
        onClick={(e) => {
          openNotificationsModal(e);
          fetchNotificationData();
        }}
      >
        <IoNotifications size={28} />
        {unreadNotifications > 0 && (
          <div
            className={`absolute top-[-3px] right-[-3px] flex items-center justify-center rounded-full bg-red-400 text-white ${
              notifications?.length > 99 ? 'text-[8px]' : 'text-[10px]'
            } font-bold w-4 h-4`}
          >
            {unreadNotifications > 99 ? '99+' : unreadNotifications}
          </div>
        )}
      </div>
      {/* Notification Modal */}
      {isNotificationsModalOpen && (
        <div
          ref={modalRef}
          style={{
            position: 'absolute',
            top: modalPosition.top,
            left: modalPosition.left,
            zIndex: 20,
            maxWidth: '375px',
            minWidth: '300px',
          }}
          className="bg-white shadow-2xl rounded-md p-4 border overflow-hidden"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-600 font-semibold uppercase text-sm flex items-center gap-1">
              NOTIFICATIONS
            </div>
            {unreadNotifications > 0 && (
              <div className="flex items-center gap-2">
                <button
                  className="text-gray-500 hover:text-gray-800 text-sm font-medium"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
          <div className="max-h-48 overflow-y-auto custom-scrollbar pr-2">
            {notifications?.length === 0 ? (
              <div className="text-center py-5 text-xs font-semibold text-gray-500">
                No Notifications
              </div>
            ) : (
              notifications?.map((notification, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-md mb-2 ${
                    notification[
                      `readBy${userRole === '3' ? 'Manager' : 'Admin'}`
                    ] === '0' &&
                    setNotificationColor(notification.requestStatus)
                  }`}
                >
                  {notification[
                    `readBy${userRole === '3' ? 'Manager' : 'Admin'}`
                  ] === '0' ? (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  )}
                  {notification.requestStatus
                    .toLowerCase()
                    .includes('issued') ? (
                    <div className="flex-1 text-xs text-gray-700">
                      New eBg has been issued by NeSL - eBG No.{' '}
                      <Link
                        to={`/e-guarantees/e-guarantee-details?guaranteeId=${notification.guaranteeNumber}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setIsNotificationsModalOpen(false);
                          if (
                            notification[
                              `readBy${userRole === '3' ? 'Manager' : 'Admin'}`
                            ] === '0'
                          ) {
                            handleMarkAsRead(notification._id);
                          }
                        }}
                      >
                        {notification.guaranteeNumber}
                      </Link>
                    </div>
                  ) : (
                    <div className="flex-1 text-xs text-gray-700">
                      {notification.requestStatus} for eBG No.{' '}
                      <Link
                        to={`/e-guarantees/e-guarantee-details?guaranteeId=${notification.guaranteeNumber}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setIsNotificationsModalOpen(false);
                          if (
                            notification[
                              `readBy${userRole === '3' ? 'Manager' : 'Admin'}`
                            ] === '0'
                          ) {
                            handleMarkAsRead(notification._id);
                          }
                        }}
                      >
                        {notification.guaranteeNumber}
                      </Link>{' '}
                      by NeSL
                    </div>
                  )}

                  <div className="text-gray-500 text-[10px]">
                    {moment(notification.date).format('DD MMM YYYY')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
