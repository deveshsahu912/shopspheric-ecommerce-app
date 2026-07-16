import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaUserShield, FaTachometerAlt } from 'react-icons/fa';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';
import api from '../utils/api.js';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/users');
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users directory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        await api.delete(`/api/users/${id}`);
        setUsers(users.filter((u) => u._id !== id));
        setToast({ show: true, message: 'User deleted successfully!', type: 'success' });
      } catch (err) {
        setToast({
          show: true,
          message: err.response?.data?.message || 'Failed to delete user.',
          type: 'danger',
        });
      }
    }
  };

  const handleRoleToggle = async (userObj) => {
    const targetRole = userObj.role === 'admin' ? 'user' : 'admin';
    if (
      window.confirm(
        `Are you sure you want to change role of "${userObj.name}" to "${targetRole.toUpperCase()}"?`
      )
    ) {
      try {
        const { data } = await api.put(`/api/users/${userObj._id}/role`, { role: targetRole });
        setUsers(users.map((u) => (u._id === userObj._id ? { ...u, role: data.role } : u)));
        setToast({ show: true, message: 'User role updated successfully!', type: 'success' });
      } catch (err) {
        setToast({
          show: true,
          message: err.response?.data?.message || 'Failed to change user role.',
          type: 'danger',
        });
      }
    }
  };

  if (loading) return <Loader message="Accessing customer records..." />;

  return (
    <div className="container">
      {/* Header section */}
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
            Manage Users
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage registered accounts, contact details, and administration levels
          </p>
        </div>

        <div>
          <Link to="/admin" className="btn btn-outline btn-sm" style={{ gap: '8px' }}>
            <FaTachometerAlt size={12} />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
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
          No registered users found.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>USER ID</th>
                <th>FULL NAME</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>ADDRESS</th>
                <th>ROLE</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>#{u._id}</td>
                  <td style={{ fontWeight: '600' }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || 'N/A'}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.address || 'No address configured'}
                  </td>
                  <td>
                    {u.role === 'admin' ? (
                      <span style={{ color: 'var(--primary)', fontWeight: '700' }}>ADMIN</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>CUSTOMER</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleRoleToggle(u)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '8px' }}
                        title="Toggle Admin Privilege"
                      >
                        <FaUserShield size={12} color="var(--primary)" />
                      </button>
                      <button
                        onClick={() => handleDelete(u._id, u.name)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '8px' }}
                        title="Delete Account"
                        disabled={u.role === 'admin'}
                      >
                        <FaTrash size={12} color="var(--danger)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

export default ManageUsers;
