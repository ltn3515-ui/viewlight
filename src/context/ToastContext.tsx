import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ToastItem {
  id: number;
  message: string;
  type: 'info' | 'error';
}

interface ToastContextType {
  showToast: (message: string, type?: 'info' | 'error') => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: 'info' | 'error' = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
  }, []);

  // Override window.alert to use custom center toast!
  useEffect(() => {
    window.alert = (msg: string) => {
      showToast(msg);
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="global-toast-container">
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              background: t.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(15, 23, 42, 0.95)',
              color: '#FFFFFF',
              padding: '16px 22px',
              borderRadius: '16px',
              fontSize: '0.92rem',
              fontWeight: 600,
              lineHeight: 1.5,
              textAlign: 'center',
              whiteSpace: 'pre-line',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 10px 20px -5px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(12px)',
              border: t.type === 'error' ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(255, 171, 64, 0.3)',
              animation: 'fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
