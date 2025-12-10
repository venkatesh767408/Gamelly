import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideNotification } from '../../redux/slices/uiSlice';

const Toast = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[notification.type] || 'bg-gray-500';

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-80`}>
        <div className="flex-1">
          <p className="font-medium">{notification.message}</p>
        </div>
        <button
          onClick={() => dispatch(hideNotification())}
          className="text-white hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;