import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaShoppingCart, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import CartItem from '../components/CartItem.jsx';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';

const Cart = () => {
  const {
    cartItems,
    loading,
    itemsCount,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    updateQuantity,
    removeFromCart,
  } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' });

  const handleUpdateQty = async (id, newQty) => {
    const res = await updateQuantity(id, newQty);
    if (!res.success) {
      setToast({ show: true, message: res.message, type: 'danger' });
    }
  };

  const handleRemove = async (id) => {
    const res = await removeFromCart(id);
    if (res.success) {
      setToast({ show: true, message: 'Item removed from cart', type: 'success' });
    } else {
      setToast({ show: true, message: res.message, type: 'danger' });
    }
  };

  const handleCheckoutRedirect = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (loading && cartItems.length === 0) return <Loader message="Accessing your shopping cart..." />;

  return (
    <div className="container">
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '30px', color: 'var(--text-main)' }}>
        Your Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
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
          <FaShoppingCart size={60} color="var(--border-focus)" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
            It looks like you haven&apos;t added any items to your shopping cart yet.
          </p>
          <Link to="/products" className="btn btn-primary">
            <FaArrowLeft size={12} /> Start Shopping
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.1fr',
            gap: '40px',
            alignItems: 'start',
          }}
          className="cart-layout-grid"
        >
          {/* Left Column: Items list */}
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              padding: '30px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 2fr 1fr 1.2fr 80px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '12px',
                color: 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
              }}
              className="cart-item-header"
            >
              <span>Image</span>
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span style={{ textAlign: 'right' }}>Action</span>
            </div>

            <div>
              {cartItems.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onUpdateQuantity={handleUpdateQty}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <div style={{ marginTop: '30px' }}>
              <Link to="/products" className="btn btn-outline btn-sm">
                <FaArrowLeft size={10} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              padding: '30px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Order Summary
            </h2>

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal ({itemsCount} items)</span>
                <span style={{ fontWeight: '500' }}>${itemsPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Shipping</span>
                <span style={{ fontWeight: '500' }}>
                  {shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Sales Tax (8%)</span>
                <span style={{ fontWeight: '500' }}>${taxPrice.toFixed(2)}</span>
              </div>
              
              <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '700' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--primary)' }}>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Promo hint */}
            {itemsPrice < 100 && (
              <div
                style={{
                  backgroundColor: 'var(--light)',
                  padding: '12px',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                }}
              >
                Add <strong>${(100 - itemsPrice).toFixed(2)}</strong> more to unlock <strong>Free Shipping</strong>!
              </div>
            )}

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckoutRedirect}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', gap: '10px' }}
            >
              <span>Proceed to Checkout</span>
              <FaArrowRight size={14} />
            </button>
          </div>
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

export default Cart;
