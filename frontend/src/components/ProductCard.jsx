import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { FaStar, FaRegStar, FaHeart, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product, onShowToast }) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useContext(WishlistContext);

  const isSaved = isProductInWishlist(product._id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      const res = await removeFromWishlist(product._id);
      if (res.success) {
        if (onShowToast) onShowToast('Removed from wishlist!', 'success');
      } else {
        if (onShowToast) onShowToast(res.message || 'Operation failed', 'danger');
      }
    } else {
      const res = await addToWishlist(product._id);
      if (res.success) {
        if (onShowToast) onShowToast('Added to wishlist!', 'success');
      } else {
        if (onShowToast) onShowToast(res.message || 'Operation failed', 'danger');
      }
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await addToCart(product._id, 1);
    if (res.success) {
      if (onShowToast) onShowToast(`${product.name} added to cart!`, 'success');
    } else {
      if (onShowToast) onShowToast(res.message || 'Could not add to cart.', 'danger');
    }
  };

  // Render review stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} color="#f59e0b" size={14} />);
      } else {
        stars.push(<FaRegStar key={i} color="#cbd5e1" size={14} />);
      }
    }
    return stars;
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-md)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        transition: 'var(--transition-normal)',
      }}
      className="product-card-hover"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifycontent: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2,
          boxShadow: 'var(--shadow-sm)',
          transition: 'var(--transition-fast)',
        }}
        title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <FaHeart color={isSaved ? 'var(--danger)' : '#94a3b8'} size={16} />
      </button>

      {/* Product Image Link */}
      <Link to={`/products/${product._id}`} style={{ display: 'block', overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            aspectRatio: '1.1',
            objectFit: 'cover',
            transition: 'var(--transition-slow)',
          }}
          className="product-card-img"
        />
      </Link>

      {/* Info Container */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: '600',
            color: 'var(--primary)',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          {product.category?.name || 'Item'}
        </span>
        
        <Link to={`/products/${product._id}`} style={{ display: 'block', marginBottom: '8px' }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: '600',
              lineHeight: '1.4',
              color: 'var(--text-main)',
              height: '44px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <div style={{ display: 'flex' }}>{renderStars(product.rating)}</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ({product.numReviews})
          </span>
        </div>

        {/* Price & Action Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
            ${product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-sm"
            disabled={product.countInStock === 0}
            style={{ padding: '8px 12px' }}
            title={product.countInStock === 0 ? 'Out of stock' : 'Add to Cart'}
          >
            <FaShoppingCart size={14} />
            <span>{product.countInStock === 0 ? 'Out of Stock' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
