// src/components/Toast.tsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div className={`flex items-center p-4 rounded-lg border shadow-lg ${getBgColor()} animate-slide-in-right`}>
      <div className="flex items-center space-x-3">
        {getIcon()}
        <p className={`text-sm font-medium ${getTextColor()}`}>{message}</p>
      </div>
      <button
        onClick={onClose}
        className={`ml-4 ${getTextColor()} hover:opacity-70 transition-opacity cursor-pointer`}
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast container component with Portal support
interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Create a dedicated toast container at the body level if it doesn't exist
    let toastRoot = document.getElementById('toast-root');
    if (!toastRoot) {
      toastRoot = document.createElement('div');
      toastRoot.id = 'toast-root';
      toastRoot.style.position = 'fixed';
      toastRoot.style.top = '0';
      toastRoot.style.left = '0';
      toastRoot.style.right = '0';
      toastRoot.style.pointerEvents = 'none';
      toastRoot.style.zIndex = '999999';
      toastRoot.style.display = 'flex';
      toastRoot.style.flexDirection = 'column';
      toastRoot.style.alignItems = 'flex-end';
      toastRoot.style.padding = '1rem';
      document.body.appendChild(toastRoot);
    }
    
    return () => {
      // Clean up if no toasts left and container exists
      if (toastRoot && toasts.length === 0 && toastRoot.children.length === 0) {
        toastRoot.remove();
      }
    };
  }, [toasts.length]);

  // Don't render on server side
  if (!mounted) return null;

  // Get or create the toast container element
  const getToastRoot = () => {
    let toastRoot = document.getElementById('toast-root');
    if (!toastRoot) {
      toastRoot = document.createElement('div');
      toastRoot.id = 'toast-root';
      toastRoot.style.position = 'fixed';
      toastRoot.style.top = '0';
      toastRoot.style.left = '0';
      toastRoot.style.right = '0';
      toastRoot.style.pointerEvents = 'none';
      toastRoot.style.zIndex = '999999';
      toastRoot.style.display = 'flex';
      toastRoot.style.flexDirection = 'column';
      toastRoot.style.alignItems = 'flex-end';
      toastRoot.style.padding = '1rem';
      document.body.appendChild(toastRoot);
    }
    return toastRoot;
  };

  // Use createPortal to render toasts at the body level
  return createPortal(
    <div className="flex flex-col gap-3" style={{ pointerEvents: 'none' }}>
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>,
    getToastRoot()
  );
};

export default Toast;