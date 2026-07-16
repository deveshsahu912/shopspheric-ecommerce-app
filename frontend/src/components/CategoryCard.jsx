import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  // Map category names to modern emojis for nice visuals
  const getCategoryEmoji = (name) => {
    switch (name.toLowerCase()) {
      case 'electronics':
        return '💻';
      case 'fashion':
        return '👕';
      case 'books':
        return '📚';
      case 'home & kitchen':
        return '🍳';
      case 'beauty & personal care':
        return '🧴';
      default:
        return '🏷️';
    }
  };

  return (
    <Link
      to={`/products?category=${category._id}`}
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-md)',
        padding: '30px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)',
        transition: 'var(--transition-normal)',
      }}
      className="category-card-hover"
    >
      <div
        style={{
          fontSize: '3.5rem',
          marginBottom: '16px',
          width: '80px',
          height: '80px',
          backgroundColor: 'var(--light)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        {getCategoryEmoji(category.name)}
      </div>

      <h3
        style={{
          fontSize: '1.2rem',
          fontWeight: '700',
          marginBottom: '8px',
          color: 'var(--text-main)',
        }}
      >
        {category.name}
      </h3>
      
      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          lineHeight: '1.5',
        }}
      >
        {category.description || 'Explore products in this category'}
      </p>
    </Link>
  );
};

export default CategoryCard;
