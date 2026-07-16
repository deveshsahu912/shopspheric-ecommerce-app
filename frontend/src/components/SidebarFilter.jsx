import React from 'react';

const SidebarFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  onClearFilters,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-md)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Category Filter */}
      <div>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: '700',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-main)',
          }}
        >
          Categories
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => onSelectCategory('')}
            style={{
              textAlign: 'left',
              padding: '8px 12px',
              borderRadius: 'var(--border-radius-sm)',
              border: 'none',
              background: selectedCategory === '' ? 'var(--primary-light)' : 'transparent',
              color: selectedCategory === '' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: selectedCategory === '' ? '600' : '400',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
            }}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onSelectCategory(cat._id)}
              style={{
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: 'var(--border-radius-sm)',
                border: 'none',
                background: selectedCategory === cat._id ? 'var(--primary-light)' : 'transparent',
                color: selectedCategory === cat._id ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: selectedCategory === cat._id ? '600' : '400',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting Control */}
      <div>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: '700',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-main)',
          }}
        >
          Sort By
        </h3>
        <select
          value={selectedSort}
          onChange={(e) => onSelectSort(e.target.value)}
          className="form-control"
          style={{ fontSize: '0.9rem' }}
        >
          <option value="newest">New Arrivals</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Clear Button */}
      <button
        onClick={onClearFilters}
        className="btn btn-outline btn-sm"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default SidebarFilter;
