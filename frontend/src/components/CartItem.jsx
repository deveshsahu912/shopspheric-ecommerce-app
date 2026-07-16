import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;

  if (!product) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 2fr 1fr 1.2fr 80px',
        alignItems: 'center',
        gap: '20px',
        padding: '20px 0',
        borderBottom: '1px solid var(--border-color)',
      }}
      className="cart-item-row"
    >
      {/* Product Thumbnail */}
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: '80px',
          height: '80px',
          objectFit: 'cover',
          borderRadius: 'var(--border-radius-sm)',
          border: '1px solid var(--border-color)',
        }}
      />

      {/* Product Details Link */}
      <div>
        <Link
          to={`/products/${product._id}`}
          style={{
            fontWeight: '600',
            fontSize: '1rem',
            color: 'var(--text-main)',
            display: 'block',
            marginBottom: '4px',
          }}
        >
          {product.name}
        </Link>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          In Stock: {product.countInStock}
        </span>
      </div>

      {/* Price */}
      <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>
        ${product.price.toFixed(2)}
      </div>

      {/* Quantity Controllers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => onUpdateQuantity(product._id, quantity - 1)}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '4px',
            border: '1px solid var(--border-color)',
            background: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-main)',
          }}
          disabled={quantity <= 1}
        >
          <FaMinus size={8} />
        </button>
        <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '600' }}>
          {quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(product._id, quantity + 1)}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '4px',
            border: '1px solid var(--border-color)',
            background: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-main)',
          }}
          disabled={quantity >= product.countInStock}
        >
          <FaPlus size={8} />
        </button>
      </div>

      {/* Delete Action Button */}
      <button
        onClick={() => onRemove(product._id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          justifySelf: 'end',
          padding: '8px',
          borderRadius: '50%',
          transition: 'var(--transition-fast)',
        }}
        className="icon-delete-btn"
        title="Remove item"
      >
        <FaTrash size={14} />
      </button>
    </div>
  );
};

export default CartItem;
