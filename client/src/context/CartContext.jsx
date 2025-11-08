'use client';
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // The global 'orderType' state has been removed.

  const addToCart = (item, selectedOption = null) => {
    setCartItems(prevItems => {
      const uniqueId = item._id + (selectedOption ? selectedOption.name : '');
      const existingItem = prevItems.find(cartItem => cartItem.uniqueId === uniqueId);

      if (existingItem) {
        // If item already exists, just increase its quantity
        return prevItems.map(cartItem =>
          cartItem.uniqueId === uniqueId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // When adding a new item, it defaults to not being a parcel
        return [...prevItems, { ...item, quantity: 1, selectedOption, uniqueId, isParcel: false }];
      }
    });
  };

  const removeFromCart = (uniqueId) => {
    setCartItems(prevItems => prevItems.filter(item => item.uniqueId !== uniqueId));
  };

  const updateQuantity = (uniqueId, amount) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.uniqueId === uniqueId) {
          const newQuantity = item.quantity + amount;
          // Ensure quantity doesn't go below 1, then filter out zero-quantity items
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean) // This removes any null items from the array
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };
  
  // New function to toggle the parcel status for a single item
  const toggleParcelStatus = (uniqueId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.uniqueId === uniqueId ? { ...item, isParcel: !item.isParcel } : item
      )
    );
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleParcelStatus, // Export the new function
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};