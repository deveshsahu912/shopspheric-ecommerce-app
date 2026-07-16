import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import Toast from '../components/Toast.jsx';
import Loader from '../components/Loader.jsx';
import api from '../utils/api.js';

const Checkout = () => {
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Shipping Address Form
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod] = useState('Cash on Delivery');
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Redirect if cart is empty or user not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [user, cartItems, navigate]);

  const validate = () => {
    const tempErrors = {};
    if (!address.trim()) tempErrors.address = 'Street address is required';
    if (!city.trim()) tempErrors.city = 'City is required';
    if (!postalCode.trim()) tempErrors.postalCode = 'Postal code is required';
    if (!country.trim()) tempErrors.country = 'Country is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setToast({ show: true, message: 'Please fill out all shipping fields.', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          image: item.product.image,
          price: item.product.price,
          product: item.product._id,
        })),
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const { data } = await api.post('/api/orders', orderPayload);
      clearCart(); // Wipe client cart
      setLoading(false);
      navigate(`/order-success?id=${data._id}`);
    } catch (err) {
      setLoading(false);
      setToast({
        show: true,
        message: err.response?.data?.message || 'Failed to place order. Try again.',
        type: 'danger',
      });
    }
  };

  if (cartItems.length === 0) return <Loader message="Verifying cart items..." />;

  return (
    <div className="container">
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '30px', color: 'var(--text-main)' }}>
        Checkout
      </h1>

      <form
        onSubmit={handlePlaceOrder}
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '40px',
          alignItems: 'start',
        }}
        className="checkout-layout-grid"
      >
        {/* Left Column: Shipping form */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
            padding: '30px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '10px' }}>
            Shipping Address
          </h2>

          <InputField
            label="Street Address"
            id="address"
            placeholder="e.g. Apartment, Suite, Street name"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            error={errors.address}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row-grid">
            <InputField
              label="City"
              id="city"
              placeholder="e.g. New York"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              error={errors.city}
            />

            <InputField
              label="Postal Code"
              id="postalCode"
              placeholder="e.g. 10001"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
              error={errors.postalCode}
            />
          </div>

          <InputField
            label="Country"
            id="country"
            placeholder="e.g. United States"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            error={errors.country}
          />

          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '10px', marginTop: '20px' }}>
            Payment Method
          </h2>
          <div
            style={{
              padding: '16px',
              border: '1px solid var(--primary)',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontWeight: '600',
              fontSize: '0.95rem',
            }}
          >
            Cash on Delivery (COD)
          </div>
        </div>

        {/* Right Column: Order Review */}
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
            Review Items
          </h2>

          {/* Cart items list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '240px', overflowY: 'auto' }}>
            {cartItems.map((item) => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{
                    width: '50px',
                    height: '50px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                  }}
                />
                <div style={{ flexGrow: 1 }}>
                  <span style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-main)', display: 'block', maxHeight: '36px', overflow: 'hidden' }}>
                    {item.product.name}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />

          {/* Cost Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping Fee</span>
              <span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sales Tax</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '700' }}>
              <span>Total Price</span>
              <span style={{ color: 'var(--primary)' }}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order Button */}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            style={{ width: '100%', height: '48px', justifyContent: 'center' }}
          >
            Place Order (COD)
          </Button>
        </div>
      </form>

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

export default Checkout;
