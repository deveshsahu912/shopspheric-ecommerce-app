import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        color: '#ffffff',
        borderRadius: 'var(--border-radius-lg)',
        padding: '80px 60px',
        marginBottom: '50px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Decorative Circles */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '650px', position: 'relative', zIndex: 1 }}>
        <span
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'inline-block',
            marginBottom: '20px',
          }}
        >
          Special Launch Season
        </span>
        <h1
          style={{
            fontSize: '3.2rem',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: '20px',
            letterSpacing: '-1px',
          }}
        >
          Elevate Your Daily Tech & Lifestyle
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            marginBottom: '35px',
            lineHeight: '1.6',
          }}
        >
          Explore our handpicked collection of noise-canceling headphones, mechanical keyboards, classic fashion garments, and organic skincare essentials.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn" style={{ backgroundColor: '#ffffff', color: '#4f46e5' }}>
            Shop Collection
          </Link>
          <Link
            to="/categories"
            className="btn btn-outline"
            style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.4)' }}
          >
            Browse Categories
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
