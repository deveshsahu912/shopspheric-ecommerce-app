import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';

const Wishlist = () => {
  const { wishlistItems, loading } = useContext(WishlistContext);
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  if (loading && wishlistItems.length === 0) return <Loader message="Opening your saved vault..." />;

  return (
    <div className="container">
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '30px', color: 'var(--text-main)' }}>
        My Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
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
          <FaHeart size={60} color="var(--border-focus)" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Your Wishlist is Empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
            Browse our catalogue and click the heart icon to save products here!
          </p>
          <Link to="/products" className="btn btn-primary">
            <FaArrowLeft size={12} /> Explore Products
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px',
            marginBottom: '40px',
          }}
        >
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} product={product} onShowToast={showToast} />
          ))}
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

export default Wishlist;
