import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';
import api from '../utils/api.js';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch categories and featured products
        const catRes = await api.get('/api/categories');
        setCategories(catRes.data);

        // Fetch products, limit to 4, sort by rating for featured
        const prodRes = await api.get('/api/products?pageSize=4&sort=rating');
        setFeaturedProducts(prodRes.data.products);
      } catch (error) {
        console.error('Error fetching landing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  if (loading) {
    return <Loader message="Setting up your shopping experience..." />;
  }

  return (
    <div className="container">
      <Hero />

      {/* Categories Section */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Shop by Category
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Find exactly what you are looking for in our organized collections
          </p>
        </div>
        
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
          }}
        >
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section style={{ marginBottom: '40px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '36px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Top Rated Products
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Explore some of our customers favorite choices
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '30px',
          }}
        >
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} onShowToast={showToast} />
          ))}
        </div>
      </section>

      {/* Toast Alert */}
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

export default Home;
