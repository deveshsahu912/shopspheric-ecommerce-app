import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '80px 24px' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          padding: '50px 40px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <FaExclamationTriangle size={72} color="var(--warning)" style={{ marginBottom: '24px' }} />
        
        <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--text-main)', marginBottom: '8px' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>
          Page Not Found
        </h2>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '35px', lineHeight: '1.6' }}>
          Oops! The page you are looking for doesn&apos;t exist or has been moved to another location.
        </p>

        <Link to="/" className="btn btn-primary" style={{ gap: '8px', display: 'inline-flex', margin: '0 auto' }}>
          <FaArrowLeft size={12} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
