import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaDollarSign,
  FaShoppingBag,
  FaBoxes,
  FaUsers,
  FaPlus,
  FaEye,
  FaClipboardList,
} from 'react-icons/fa';
import Loader from '../components/Loader.jsx';
import api from '../utils/api.js';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch all orders
        const ordersRes = await api.get('/api/orders');
        setOrders(ordersRes.data);

        // Fetch products count
        const prodRes = await api.get('/api/products?pageSize=1');
        setProductsCount(prodRes.data.totalProducts || 0);

        // Fetch users count
        const usersRes = await api.get('/api/users');
        setUsersCount(usersRes.data.length || 0);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Compute total sales revenue
  const totalSales = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

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

  if (loading) return <Loader message="Compiling administration metrics..." />;

  return (
    <div className="container">
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Overview of store operations, sales metrics, and inventories
          </p>
        </div>

        {/* Action controls */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/admin/products/add" className="btn btn-primary btn-sm" style={{ gap: '8px' }}>
            <FaPlus size={12} /> Add Product
          </Link>
          <Link to="/admin/products" className="btn btn-outline btn-sm" style={{ gap: '8px' }}>
            <FaBoxes size={12} /> Manage Products
          </Link>
          <Link to="/admin/users" className="btn btn-outline btn-sm" style={{ gap: '8px' }}>
            <FaUsers size={12} /> Manage Users
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          marginBottom: '50px',
        }}
      >
        {/* Card 1: Total Sales */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaDollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
              TOTAL REVENUE
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>
              ${totalSales.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaShoppingBag size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
              TOTAL ORDERS
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{orders.length}</span>
          </div>
        </div>

        {/* Card 3: Products */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaBoxes size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
              INVENTORY ITEMS
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{productsCount}</span>
          </div>
        </div>

        {/* Card 4: Registered Users */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              backgroundColor: 'var(--warning-light)',
              color: 'var(--warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaUsers size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
              TOTAL CUSTOMERS
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{usersCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders log */}
      <div style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '1.4rem',
            fontWeight: '800',
            marginBottom: '20px',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <FaClipboardList size={18} color="var(--primary)" />
          <span>Recent Purchase Orders</span>
        </h2>

        {orders.length === 0 ? (
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              padding: '40px',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            No orders placed yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontWeight: '600', fontSize: '0.85rem' }}>#{order._id}</td>
                    <td>{order.user?.name || 'Guest User'}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: '500' }}>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      {order.isPaid ? (
                        <span style={{ color: 'var(--success)', fontWeight: '600' }}>Paid</span>
                      ) : (
                        <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Pending</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
                        <FaEye size={12} />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
