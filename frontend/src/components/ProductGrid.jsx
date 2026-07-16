import React from 'react';

const ProductGrid = ({ children }) => {
  return (
    <div className="product-grid" style={{ marginTop: '20px', marginBottom: '40px' }}>
      {children}
    </div>
  );
};

export default ProductGrid;
