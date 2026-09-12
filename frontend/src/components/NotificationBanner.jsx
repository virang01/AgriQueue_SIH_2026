import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { Volume2, X } from 'lucide-react';

const NotificationBanner = () => {
  const { lastNotification } = useSocket();
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (lastNotification) {
      setNotification(lastNotification);
      setVisible(true);

      // Play audio chime if available
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => {});
      } catch (e) {}

      const timer = setTimeout(() => {
        setVisible(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [lastNotification]);

  if (!visible || !notification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full bg-slate-900 border-2 border-gov-red text-white rounded-xl shadow-2xl p-4 transition-all duration-300 animate-bounce font-body">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="bg-gov-red p-2 rounded-full text-white mt-0.5">
            <Volume2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold font-heading text-sm text-gov-red flex items-center space-x-1">
              <span>LIVE QUEUE ALERT</span>
            </h4>
            <p className="text-xs font-medium text-slate-200 mt-1 leading-snug">
              {notification.message}
            </p>
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
