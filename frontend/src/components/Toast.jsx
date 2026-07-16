import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: 'var(--success)',
          color: '#ffffff',
          icon: <FaCheckCircle size={16} />,
        };
      case 'danger':
        return {
          backgroundColor: 'var(--danger)',
          color: '#ffffff',
          icon: <FaExclamationCircle size={16} />,
        };
      case 'warning':
        return {
          backgroundColor: 'var(--warning)',
          color: '#ffffff',
          icon: <FaExclamationCircle size={16} />,
        };
      default:
        return {
          backgroundColor: 'var(--dark)',
          color: '#ffffff',
          icon: null,
        };
    }
  };

  const styleConfig = getStyles();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 24px',
        borderRadius: 'var(--border-radius-sm)',
        backgroundColor: styleConfig.backgroundColor,
        color: styleConfig.color,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
        zIndex: 1100,
        animation: 'slideUp 0.3s ease-out',
        minWidth: '280px',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {styleConfig.icon}
        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{message}</span>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.8,
        }}
        title="Close notification"
      >
        <FaTimes size={14} />
      </button>
    </div>
  );
};

export default Toast;
