import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaChevronLeft, FaPrint, FaTruck, FaMapMarkerAlt, FaFileInvoice } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';
import api from '../utils/api.js';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  
  const [status, setStatus] = useState('Pending');
  const [statusLoading, setStatusLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/orders/${id}`);
      setOrder(data);
      setStatus(data.status);
    } catch (err) {
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    const nextStatus = e.target.value;
    setStatusLoading(true);
    try {
      const { data } = await api.put(`/api/orders/${id}/status`, { status: nextStatus });
      setOrder(data);
      setStatus(data.status);
      setToast({ show: true, message: `Order status updated to ${nextStatus}`, type: 'success' });
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || 'Failed to update order status.',
        type: 'danger',
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const handlePrint = () => {
    window.print(); // Easy client-side print for invoices! (Bonus Feature)
  };

  if (loading) return <Loader message="Fetching invoice records..." />;
  if (!order) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <h2>Order Not Found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const getStatusClass = (orderStatus) => {
    switch (orderStatus) {
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

  return (
    <div className="container printable-order-page" style={{ maxWidth: '900px' }}>
      {/* Back button */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <Link
          to={user?.role === 'admin' ? '/admin' : '/my-orders'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}
        >
          <FaChevronLeft size={10} /> Back to dashboard
        </Link>

        <button onClick={handlePrint} className="btn btn-outline btn-sm" style={{ gap: '8px' }}>
          <FaPrint size={14} /> Print Invoice
        </button>
      </div>

      {/* Invoice Card Grid */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          padding: '40px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
        }}
      >
        {/* Invoice Title Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.25rem', display: 'block', marginBottom: '8px' }}>
              🛒 ShopSpheric
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Invoice # {order._id}
            </h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Placed on {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className={`badge ${getStatusClass(order.status)}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
              {order.status}
            </span>
          </div>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />

        {/* Customer Address Details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
          }}
          className="order-details-grid"
        >
          {/* Shipping Column */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaMapMarkerAlt color="var(--primary)" size={14} />
              <span>Shipping Information</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
              <strong>Name:</strong> {order.user?.name} <br />
              <strong>Email:</strong> {order.user?.email} <br />
              <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
          </div>

          {/* Delivery & Payment status */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaTruck color="var(--primary)" size={14} />
              <span>Order Configuration</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>Payment Method:</strong> {order.paymentMethod} <br />
              <strong>Payment Status:</strong>{' '}
              {order.isPaid ? (
                <span style={{ color: 'var(--success)', fontWeight: '600' }}>
                  Paid on {new Date(order.paidAt).toLocaleDateString()}
                </span>
              ) : (
                <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Pending Payment (COD)</span>
              )}
            </p>
            
            {order.isDelivered ? (
              <div
                style={{
                  backgroundColor: 'var(--success-light)',
                  color: 'var(--success)',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  display: 'inline-block',
                }}
              >
                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: 'var(--warning-light)',
                  color: 'var(--warning)',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  display: 'inline-block',
                }}
              >
                In Transit / Processing
              </div>
            )}
          </div>
        </div>

        {/* Invoice Item list */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaFileInvoice color="var(--primary)" size={14} />
            <span>Items Invoice List</span>
          </h3>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th style={{ textAlign: 'center' }}>QTY</th>
                  <th style={{ textAlign: 'right' }}>UNIT PRICE</th>
                  <th style={{ textAlign: 'right' }}>SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                        }}
                        className="no-print"
                      />
                      <span style={{ fontWeight: '600' }}>{item.name}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontWeight: '500' }}>
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost calculation values */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal:</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping Fee:</span>
              <span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sales Tax:</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
            <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '700' }}>
              <span>Grand Total:</span>
              <span style={{ color: 'var(--primary)' }}>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Admin panel status change selector */}
        {user?.role === 'admin' && (
          <div
            className="no-print"
            style={{
              marginTop: '20px',
              backgroundColor: 'var(--light)',
              padding: '24px',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h4 style={{ fontWeight: '700', marginBottom: '12px' }}>Administrative Order controls</h4>
            <div className="form-group" style={{ maxWidth: '300px', margin: 0 }}>
              <label htmlFor="order-status-select" className="form-label">
                Modify Shipping Status
              </label>
              <select
                id="order-status-select"
                value={status}
                onChange={handleStatusChange}
                className="form-control"
                disabled={statusLoading || order.status === 'Cancelled'}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default OrderDetails;
