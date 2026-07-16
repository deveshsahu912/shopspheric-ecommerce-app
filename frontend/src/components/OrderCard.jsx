import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaDollarSign, FaInfoCircle } from 'react-icons/fa';

const OrderCard = ({ order }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'badge-pending';
      case 'Processing':
        return 'badge-processing';
      case 'Shipped':
        return 'badge-shipped';
      case 'Delivered':
        return 'badge-delivered';
      case 'Cancelled':
        return 'badge-cancelled';
      default:
        return '';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-md)',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '16px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
            ORDER ID
          </span>
          <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
            #{order._id}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
              PLACED ON
            </span>
            <span
              style={{
                fontWeight: '500',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FaCalendarAlt size={12} color="var(--text-muted)" />
              {formatDate(order.createdAt)}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
              TOTAL PRICE
            </span>
            <span
              style={{
                fontWeight: '700',
                fontSize: '0.95rem',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              ${order.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span>
      </div>

      {/* Items List Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {order.orderItems.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
              }}
            />
            <div style={{ flexGrow: 1 }}>
              <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {item.name}
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginTop: '2px',
                }}
              >
                Qty: {item.quantity} × ${item.price.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Actions footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
        <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">
          <FaInfoCircle size={14} />
          <span>View Details</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
