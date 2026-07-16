import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaTachometerAlt,
  FaHistory,
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useContext(AuthContext);
  const { itemsCount } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container header-inner">
        {/* Logo */}
        <Link to="/" className="logo" onClick={() => setMobileOpen(false)}>
          🛒 Shop<span>Spheric</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className={`nav-links ${mobileOpen ? 'show' : ''}`}>
          <NavLink to="/" className="nav-link" onClick={() => setMobileOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" className="nav-link" onClick={() => setMobileOpen(false)}>
            Shop
          </NavLink>
          <NavLink to="/categories" className="nav-link" onClick={() => setMobileOpen(false)}>
            Categories
          </NavLink>
          <NavLink to="/about" className="nav-link" onClick={() => setMobileOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" className="nav-link" onClick={() => setMobileOpen(false)}>
            Contact
          </NavLink>
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          {/* Dark Mode Toggle */}
          <button className="icon-btn" onClick={toggleDarkMode} title="Toggle Theme">
            {darkMode ? <FaSun size={18} color="#eab308" /> : <FaMoon size={18} />}
          </button>

          {/* Wishlist Link */}
          <Link to="/wishlist" className="icon-btn" title="Wishlist">
            <FaHeart size={18} />
            {wishlistItems.length > 0 && (
              <span className="badge-count">{wishlistItems.length}</span>
            )}
          </Link>

          {/* Cart Link */}
          <Link to="/cart" className="icon-btn" title="Shopping Cart">
            <FaShoppingCart size={18} />
            {itemsCount > 0 && <span className="badge-count">{itemsCount}</span>}
          </Link>

          {/* User Section */}
          {user ? (
            <div className="nav-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <FaUser size={16} />
              <span>{user.name.split(' ')[0]}</span>
              <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <FaUser size={14} /> Profile
                </Link>
                <Link to="/my-orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <FaHistory size={14} /> My Orders
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <FaTachometerAlt size={14} /> Admin Panel
                  </Link>
                )}
                <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
                <button onClick={handleLogout} className="dropdown-item" style={{ color: 'var(--danger)' }}>
                  <FaSignOutAlt size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-nav-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            title="Menu"
          >
            {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
