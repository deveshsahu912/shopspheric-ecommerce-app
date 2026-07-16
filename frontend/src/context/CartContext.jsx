import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext.jsx';
import api from '../utils/api.js';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Load cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  // Fetch cart from API
  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/cart');
      setCartItems(data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      return { success: false, message: 'Please login to add items to cart.' };
    }
    try {
      const { data } = await api.post('/api/cart', { productId, quantity });
      setCartItems(data.items || []);
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add item to cart.',
      };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!user) return { success: false };
    try {
      const { data } = await api.delete(`/api/cart/${productId}`);
      setCartItems(data.items || []);
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove item.',
      };
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (!user) return { success: false };
    if (quantity < 1) return removeFromCart(productId);
    
    try {
      const { data } = await api.put(`/api/cart/${productId}`, { quantity });
      setCartItems(data.items || []);
      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update quantity.',
      };
    }
  };

  // Clear cart contents locally
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate totals
  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : itemsPrice === 0 ? 0 : 15; // Free shipping above $100
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2)); // 8% sales tax
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        itemsCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
