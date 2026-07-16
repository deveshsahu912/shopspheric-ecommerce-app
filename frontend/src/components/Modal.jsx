import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close" onClick={onClose} title="Close Modal">
          <FaTimes size={18} />
        </button>

        {/* Title */}
        {title && (
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              marginBottom: '20px',
              color: 'var(--text-main)',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '12px',
            }}
          >
            {title}
          </h2>
        )}

        {/* Body content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
