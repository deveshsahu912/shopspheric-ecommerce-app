import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext.jsx';
import api from '../utils/api.js';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Load wishlist when user logs in
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/wishlist');
      setWishlistItems(data.products || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!user) {
      return { success: false, message: 'Please login to save items.' };
    }
    try {
      const { data } = await api.post('/api/wishlist', { productId });
      setWishlistItems(data.products || []);
      return { success: true };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to save item.',
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return { success: false };
    try {
      const { data } = await api.delete(`/api/wishlist/${productId}`);
      setWishlistItems(data.products || []);
      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove item.',
      };
    }
  };

  const isProductInWishlist = (productId) => {
    return wishlistItems.some((item) => {
      // Check both nested object or simple string ID
      const itemId = item._id || item;
      return itemId.toString() === productId.toString();
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isProductInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
