import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaArrowRight } from 'react-icons/fa';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id') || '';

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '60px 24px' }}>
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
        <FaCheckCircle size={72} color="var(--success)" style={{ marginBottom: '24px' }} />
        
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)' }}>
          Order Placed Successfully!
        </h1>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.6' }}>
          Thank you for shopping with us! Your order has been registered and is currently being processed.
        </p>

        {orderId && (
          <div
            style={{
              backgroundColor: 'var(--light)',
              padding: '16px',
              borderRadius: 'var(--border-radius-sm)',
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              color: 'var(--text-main)',
              border: '1px dashed var(--border-color)',
              marginBottom: '35px',
            }}
          >
            ORDER ID: <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>#{orderId}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/my-orders" className="btn btn-outline" style={{ gap: '8px' }}>
            <FaShoppingBag size={14} />
            <span>My Orders</span>
          </Link>
          <Link to="/products" className="btn btn-primary" style={{ gap: '8px' }}>
            <span>Continue Shopping</span>
            <FaArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
