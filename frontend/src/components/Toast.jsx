import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Toast = ({ 
  type = 'info', // 'success', 'error', 'warning', 'info'
  title, 
  message, 
  onClose,
  autoClose = true,
  duration = 4000 
}) => {
  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          icon: CheckCircle,
          iconColor: 'text-green-400',
          titleColor: 'text-green-400',
          messageColor: 'text-green-300'
        };
      case 'error':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          icon: AlertCircle,
          iconColor: 'text-red-400',
          titleColor: 'text-red-400',
          messageColor: 'text-red-300'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          icon: AlertCircle,
          iconColor: 'text-yellow-400',
          titleColor: 'text-yellow-400',
          messageColor: 'text-yellow-300'
        };
      default:
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          icon: Info,
          iconColor: 'text-blue-400',
          titleColor: 'text-blue-400',
          messageColor: 'text-blue-300'
        };
    }
  };

  const styles = getStyles();
  const IconComponent = styles.icon;

  return (
    <div 
      className={`${styles.bg} border ${styles.border} rounded-lg p-4 flex gap-3 items-start animate-slideDown`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <IconComponent className={`w-5 h-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        {title && <p className={`font-semibold text-sm ${styles.titleColor}`}>{title}</p>}
        <p className={`text-sm ${styles.messageColor} ${title ? 'mt-1' : ''}`}>{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-300 flex-shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
