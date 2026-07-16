import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaStar, FaRegStar, FaHeart, FaShoppingCart, FaPlus, FaMinus, FaChevronLeft } from 'react-icons/fa';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';
import ProductCard from '../components/ProductCard.jsx';
import api from '../utils/api.js';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useContext(WishlistContext);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const isSaved = product ? isProductInWishlist(product._id) : false;

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);

        // Manage Recently Viewed Products (Bonus Feature)
        trackRecentlyViewed(data.product);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Track recently viewed products in LocalStorage
  const trackRecentlyViewed = (currentProduct) => {
    let list = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    // Remove if already exists to move it to the front
    list = list.filter((item) => item._id !== currentProduct._id);
    list.unshift({
      _id: currentProduct._id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.image,
      rating: currentProduct.rating,
      numReviews: currentProduct.numReviews,
    });
    // Keep max 4 items
    list = list.slice(0, 4);
    localStorage.setItem('recentlyViewed', JSON.stringify(list));
    // Set to display list (filter out current product)
    setRecentlyViewed(list.filter((item) => item._id !== currentProduct._id));
  };

  const handleWishlistToggle = async () => {
    if (isSaved) {
      const res = await removeFromWishlist(product._id);
      if (res.success) {
        setToast({ show: true, message: 'Removed from wishlist!', type: 'success' });
      } else {
        setToast({ show: true, message: res.message, type: 'danger' });
      }
    } else {
      const res = await addToWishlist(product._id);
      if (res.success) {
        setToast({ show: true, message: 'Added to wishlist!', type: 'success' });
      } else {
        setToast({ show: true, message: res.message, type: 'danger' });
      }
    }
  };

  const handleAddToCart = async () => {
    const res = await addToCart(product._id, qty);
    if (res.success) {
      setToast({ show: true, message: `${qty} × ${product.name} added to cart!`, type: 'success' });
    } else {
      setToast({ show: true, message: res.message, type: 'danger' });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setToast({ show: true, message: 'Please write a comment', type: 'warning' });
      return;
    }

    setReviewLoading(true);
    try {
      await api.post(`/api/products/${id}/reviews`, { rating, comment });
      
      // Reload product details to show new review
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data.product);
      setComment('');
      setRating(5);
      setToast({ show: true, message: 'Review posted successfully!', type: 'success' });
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || 'Failed to submit review.',
        type: 'danger',
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} color="#f59e0b" size={16} />);
      } else {
        stars.push(<FaRegStar key={i} color="#cbd5e1" size={16} />);
      }
    }
    return stars;
  };

  if (loading) return <Loader message="Fetching product specifications..." />;
  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <h2>Product Not Found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Back button */}
      <Link
        to="/products"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '30px',
          color: 'var(--text-muted)',
          fontWeight: 500,
        }}
      >
        <FaChevronLeft size={10} /> Back to Catalog
      </Link>

      {/* Main product specs section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: '50px',
          marginBottom: '60px',
          alignItems: 'start',
        }}
        className="product-details-grid"
      >
        {/* Left Side: Product Image with Zoom Styling */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            aspectRatio: '1',
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              cursor: 'zoom-in',
              transition: 'transform 0.5s ease',
            }}
            className="product-zoom-img"
          />
        </div>

        {/* Right Side: Product Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              {product.category?.name}
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', lineHeight: '1.2', color: 'var(--text-main)' }}>
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex' }}>{renderStars(product.rating)}</div>
            <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{product.rating.toFixed(1)}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              ({product.numReviews} Reviews)
            </span>
          </div>

          {/* Price */}
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>
            ${product.price.toFixed(2)}
          </div>

          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />

          {/* Description */}
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '8px', fontSize: '0.95rem' }}>
              Description
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
              {product.description}
            </p>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />

          {/* Stock & Quantity Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block' }}>
                Availability
              </span>
              {product.countInStock > 0 ? (
                <span style={{ color: 'var(--success)', fontWeight: '600', fontSize: '0.95rem' }}>
                  In Stock ({product.countInStock} items)
                </span>
              ) : (
                <span style={{ color: 'var(--danger)', fontWeight: '600', fontSize: '0.95rem' }}>
                  Out of Stock
                </span>
              )}
            </div>

            {product.countInStock > 0 && (
              <div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Quantity
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--white)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    disabled={qty <= 1}
                  >
                    <FaMinus size={10} />
                  </button>
                  <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: '700' }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--white)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    disabled={qty >= product.countInStock}
                  >
                    <FaPlus size={10} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-lg"
              disabled={product.countInStock === 0}
              style={{ flexGrow: 1, gap: '12px' }}
            >
              <FaShoppingCart size={18} />
              <span>Add to Shopping Cart</span>
            </button>
            <button
              onClick={handleWishlistToggle}
              className="btn btn-outline btn-lg"
              style={{ padding: '14px' }}
              title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <FaHeart color={isSaved ? 'var(--danger)' : 'var(--text-muted)'} size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews & Form Section */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px', color: 'var(--text-main)' }}>
          Customer Reviews
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '50px',
            alignItems: 'start',
          }}
          className="product-details-grid"
        >
          {/* Reviews list */}
          <div>
            {product.reviews.length === 0 ? (
              <div
                style={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '30px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                No reviews yet. Be the first to express your thoughts about this product!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {product.reviews.map((rev) => (
                  <div
                    key={rev._id}
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-md)',
                      padding: '20px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <strong style={{ fontSize: '0.95rem' }}>{rev.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', marginBottom: '10px' }}>
                      {renderStars(rev.rating)}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Review Panel */}
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              padding: '30px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '20px' }}>
              Write a Product Review
            </h3>

            {user ? (
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label">Product Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="form-control"
                  >
                    <option value="5">5 ★ Excellent</option>
                    <option value="4">4 ★ Very Good</option>
                    <option value="3">3 ★ Average</option>
                    <option value="2">2 ★ Poor</option>
                    <option value="1">1 ★ Terrible</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="comment" className="form-label">
                    Review Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe your experience with this item..."
                    className="form-control"
                    required
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>

                <Button type="submit" variant="primary" loading={reviewLoading} style={{ width: '100%' }}>
                  Submit Review
                </Button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Please{' '}
                <Link to={`/login?redirect=/products/${id}`} style={{ color: 'var(--primary)', fontWeight: '600' }}>
                  sign in
                </Link>{' '}
                to leave a review.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px', color: 'var(--text-main)' }}>
            Related Products
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {relatedProducts.map((p) => (
              <div key={p._id} style={{ transform: 'scale(0.96)' }}>
                <ProductCard product={p} onShowToast={(msg, type) => setToast({ show: true, message: msg, type })} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products (Bonus feature) */}
      {recentlyViewed.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px', color: 'var(--text-main)' }}>
            Recently Viewed
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {recentlyViewed.map((p) => (
              <div key={p._id} style={{ transform: 'scale(0.96)' }}>
                <ProductCard product={p} onShowToast={(msg, type) => setToast({ show: true, message: msg, type })} />
              </div>
            ))}
          </div>
        </section>
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

export default ProductDetails;
