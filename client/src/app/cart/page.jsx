'use client';
import React from 'react';
import { useCart } from '../../context/CartContext';
import styles from './CartPage.module.css';
import Link from 'next/link';

const CartPage = () => {
  // Get the new toggleParcelStatus function
  const { cartItems, removeFromCart, updateQuantity, toggleParcelStatus } = useCart();

  // Updated calculation logic for subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.selectedOption ? item.selectedOption.price : item.price;
      return total + price * item.quantity;
    }, 0);
  };

  // New calculation logic for per-item parcel charges
  const calculateParcelCharges = () => {
    return cartItems.reduce((total, item) => {
      const charge = item.isParcel ? item.quantity * 10 : 0;
      return total + charge;
    }, 0);
  };
  
  const parcelItemCount = cartItems.reduce((sum, item) => item.isParcel ? sum + item.quantity : sum, 0);
  const subtotal = calculateSubtotal();
  const parcelCharge = calculateParcelCharges();
  const total = subtotal + parcelCharge;

  if (cartItems.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Your <span>Order</span></h2>
          </div>
          <div className={styles.emptyCart}>
            <p>Your cart is empty.</p>
            <Link href="/menu" className={styles.continueShoppingBtn}>
              Back to Menu
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-title">
          <h2>Your <span>Order</span></h2>
        </div>

        {/* The global order type selector has been removed */}

        <div className={styles.cartTable}>
          {cartItems.map(item => (
            <div key={item.uniqueId} className={styles.cartItem}>
              <img src={item.imageUrl || 'https://via.placeholder.com/100x100.png?text=MHP'} alt={item.name} />
              <div className={styles.itemDetails}>
                <h4>{item.name}</h4>
                {item.selectedOption && <p className={styles.itemOption}>{item.selectedOption.name}</p>}
                <p className={styles.itemPrice}>₹{item.selectedOption ? item.selectedOption.price : item.price}</p>
                
                {/* New per-item parcel checkbox */}
                <div className={styles.parcelToggle}>
                  <input 
                    type="checkbox" 
                    id={`parcel-${item.uniqueId}`}
                    checked={item.isParcel}
                    onChange={() => toggleParcelStatus(item.uniqueId)}
                  />
                  <label htmlFor={`parcel-${item.uniqueId}`}>Parcel this item (+₹10)</label>
                </div>
              </div>
              <div className={styles.quantityControl}>
                <button onClick={() => updateQuantity(item.uniqueId, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.uniqueId, 1)}>+</button>
              </div>
              <div className={styles.itemTotal}>
                ₹{(item.selectedOption ? item.selectedOption.price : item.price) * item.quantity}
              </div>
              <button className={styles.removeBtn} onClick={() => removeFromCart(item.uniqueId)}>×</button>
            </div>
          ))}
        </div>

        {/* Updated Cart Summary section */}
        <div className={styles.cartSummary}>
          <div className={styles.totalPrice}>
            <div className={styles.summaryLine}>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            {parcelCharge > 0 && (
              <div className={styles.summaryLine}>
                <span>Parcel Charges ({parcelItemCount} items x ₹10)</span>
                <span>₹{parcelCharge}</span>
              </div>
            )}
            <div className={`${styles.summaryLine} ${styles.grandTotal}`}>
              <h3>Total: ₹{total}</h3>
            </div>
          </div>
          <div className={styles.actionButtons}>
            <Link href="/menu" className={styles.continueShoppingBtn}>Continue</Link>
            <Link href="/checkout">
              <button className={styles.checkoutBtn}>Proceed to Checkout</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;