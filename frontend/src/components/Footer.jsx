import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col">
            <div className="footer-logo">
              🛒 Shop<span>Spheric</span>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
              Your premium destination for tech accessories, stylish garments, self-improvement books, and clean skincare products.
            </p>
            <p style={{ fontSize: '0.85rem' }}>© 2026 ShopSpheric. All rights reserved.</p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Shop Products</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-col">
            <h3>Support</h3>
            <ul className="footer-links">
              <li><Link to="/contact">Contact Support</Link></li>
              <li><Link to="/profile">My Account</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><Link to="/wishlist">Saved Items</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h3>Newsletter</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
              Subscribe to get notified about special deals and product arrivals!
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Your email address"
                className="form-control"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
              <button className="btn btn-primary btn-sm">Join</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Built with ❤️ using the MERN stack for modern web developers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
