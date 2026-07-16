import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderCard from '../components/OrderCard.jsx';
import Loader from '../components/Loader.jsx';
import { FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import api from '../utils/api.js';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/api/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Loader message="Fetching order history..." />;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '30px', color: 'var(--text-main)' }}>
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <FaShoppingBag size={60} color="var(--border-focus)" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No Orders Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
            You haven&apos;t placed any orders yet. Start shopping to fill your history!
          </p>
          <Link to="/products" className="btn btn-primary">
            <FaArrowLeft size={12} /> Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
