import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaTachometerAlt } from 'react-icons/fa';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';
import api from '../utils/api.js';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Fetch all products (request large pageSize to get all products in inventory list)
      const { data } = await api.get('/api/products?pageSize=100');
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching admin products list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await api.delete(`/api/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
        setToast({ show: true, message: 'Product deleted successfully!', type: 'success' });
      } catch (err) {
        setToast({
          show: true,
          message: err.response?.data?.message || 'Failed to delete product.',
          type: 'danger',
        });
      }
    }
  };

  if (loading) return <Loader message="Accessing warehouse databases..." />;

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
            Manage Products
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Admin inventory management dashboard controls
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin" className="btn btn-outline btn-sm" style={{ gap: '8px' }}>
            <FaTachometerAlt size={12} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/products/add" className="btn btn-primary btn-sm" style={{ gap: '8px' }}>
            <FaPlus size={12} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Table section */}
      {products.length === 0 ? (
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
          No products in inventory database. Click &quot;Add Product&quot; to begin.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>PRODUCT NAME</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK COUNT</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  </td>
                  <td style={{ fontWeight: '600' }}>{p.name}</td>
                  <td>{p.category?.name || 'Uncategorized'}</td>
                  <td style={{ fontWeight: '500' }}>${p.price.toFixed(2)}</td>
                  <td>
                    {p.countInStock > 0 ? (
                      <span style={{ color: 'var(--text-main)' }}>{p.countInStock} items</span>
                    ) : (
                      <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Out of Stock</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Link to={`/admin/products/${p._id}/edit`} className="btn btn-outline btn-sm" style={{ padding: '8px' }} title="Edit Product">
                        <FaEdit size={12} color="var(--primary)" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '8px' }}
                        title="Delete Product"
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

export default ManageProducts;
