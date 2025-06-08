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
    <>
      <div 
        className={`
          toast-notification
          position-fixed bottom-0 end-0 p-4 rounded shadow-lg
          d-flex align-items-center gap-3
          ${isSuccess ? 'bg-success' : 'bg-danger'} text-white
        `}
        style={{ 
          zIndex: 1050,
          minWidth: '320px',
          maxWidth: '400px',
          margin: '1rem'
        }}
      >
        {isSuccess ? (
          <CheckCircle className="flex-shrink-0" size={24} />
        ) : (
          <XCircle className="flex-shrink-0" size={24} />
        )}
        
        <div className="flex-grow-1">
          <div className="fw-semibold small mb-1">{title}</div>
          <div className="small opacity-75">{message}</div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInRight {
            from { 
              transform: translateX(100%); 
              opacity: 0; 
            }
            to { 
              transform: translateX(0); 
              opacity: 1; 
            }
          }
          
          .toast-notification {
            animation: slideInRight 0.3s ease-out;
          }
        `
      }} />
    </>
  );
};

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showSuccess = (message = '') => {
    setToast({ id: Date.now(), type: 'success', title : "Successo", message });
  };

  const showError = (message = '') => {
    setToast({ id: Date.now(), type: 'error', title : "Errore", message });
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

export default ToastProvider;