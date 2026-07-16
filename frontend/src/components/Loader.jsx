import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{message}</p>
    </div>
  );
};

export default Loader;
