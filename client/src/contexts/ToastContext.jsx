import React, { useState, createContext, useContext, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve essere usato dentro ToastProvider');
  }
  return context;
};

const Toast = ({ id, type, title, message, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const isSuccess = type === 'success';
  
  return (
    <div 
      className={`
        fixed bottom-6 right-6 p-4 rounded-lg shadow-lg 
        flex items-center gap-3 min-w-80 max-w-96
        transform transition-all duration-300 ease-out
        ${isSuccess ? 'bg-green-500' : 'bg-red-500'} text-white
      `}
      style={{ 
        zIndex: 1000,
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      {isSuccess ? (
        <CheckCircle className="w-6 h-6 flex-shrink-0" />
      ) : (
        <XCircle className="w-6 h-6 flex-shrink-0" />
      )}
      
      <div className="flex-grow">
        <div className="font-semibold text-sm mb-1">{title}</div>
        <div className="text-sm opacity-90">{message}</div>
      </div>
      
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showSuccess = (message) => {
    setToast({ id: Date.now(), type: 'success', title: 'Successo', message });
  };

  const showError = (message) => {
    setToast({ id: Date.now(), type: 'error', title: 'Errore', message });
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      {toast && (
        <Toast {...toast} onRemove={() => setToast(null)} />
      )}
    </ToastContext.Provider>
  );
};