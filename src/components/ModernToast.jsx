import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ModernToast = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Show animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto hide
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300);
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
          borderColor: 'border-green-400',
          iconColor: 'text-white',
          textColor: 'text-white',
          shadowColor: 'shadow-green-500/25'
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-gradient-to-r from-red-500 to-rose-500',
          borderColor: 'border-red-400',
          iconColor: 'text-white',
          textColor: 'text-white',
          shadowColor: 'shadow-red-500/25'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-gradient-to-r from-orange-500 to-amber-500',
          borderColor: 'border-orange-400',
          iconColor: 'text-white',
          textColor: 'text-white',
          shadowColor: 'shadow-orange-500/25'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-500',
          borderColor: 'border-blue-400',
          iconColor: 'text-white',
          textColor: 'text-white',
          shadowColor: 'shadow-blue-500/25'
        };
    }
  };

  const config = getToastConfig();
  const Icon = config.icon;

  if (!isVisible && !isLeaving) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] transform transition-all duration-500 ease-out ${
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div
        className={`
          ${config.bgColor} ${config.borderColor} ${config.shadowColor}
          border-l-4 rounded-2xl shadow-2xl backdrop-blur-sm
          min-w-[350px] max-w-md p-5
          transform transition-all duration-300
          hover:scale-105 hover:shadow-3xl
          relative overflow-hidden
        `}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
        </div>
        
        <div className="relative flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${config.textColor} leading-relaxed`}>
              {message}
            </p>
          </div>
          
          <button
            onClick={handleClose}
            className={`
              flex-shrink-0 p-2 rounded-xl transition-all duration-200
              ${config.textColor} hover:bg-white hover:bg-opacity-20
              hover:scale-110 active:scale-95
            `}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 w-full bg-white bg-opacity-20 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all ease-linear shadow-sm"
            style={{
              width: isLeaving ? '0%' : '100%',
              transition: `width ${duration}ms linear`
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Toast Container Component
const ModernToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Global toast function
    window.showToast = (message, type = 'info', duration = 4000) => {
      const id = Date.now() + Math.random();
      const newToast = { id, message, type, duration };
      
      setToasts(prev => [...prev, newToast]);
    };

    return () => {
      window.showToast = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-0 right-0 z-[9999] p-4 space-y-3 pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 9999 - index
          }}
        >
          <ModernToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ModernToastContainer;
