import React, { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard.jsx';
import Loader from '../components/Loader.jsx';
import api from '../utils/api.js';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <Loader message="Arranging product shelves..." />;

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
          Product Categories
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse our collections to find targeted premium merchandise
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '50px',
        }}
      >
        {categories.map((cat) => (
          <CategoryCard key={cat._id} category={cat} />
        ))}
      </div>
    </div>
  );
};

export default Categories;
