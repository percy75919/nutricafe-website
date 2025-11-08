'use client';
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import styles from './CheckoutPage.module.css';
import axios from 'axios';
import Link from 'next/link';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  
  // --- NEW: State to manage the checkout flow ---
  const [checkoutStep, setCheckoutStep] = useState('details'); // details, payment, success
  
  // State for the form
  const [name, setName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  
  // State for submitting
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // --- NEW: State to hold the final order data ---
  const [finalOrder, setFinalOrder] = useState(null);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.selectedOption ? item.selectedOption.price : item.price;
      return total + price * item.quantity;
    }, 0);
  };
  
  // This function now just moves to the payment step
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    // We create the order object here and store it
    const orderData = {
      customerName: name,
      tableNumber: tableNumber,
      orderItems: cartItems.map(item => ({
        name: item.name,
        selectedOption: item.selectedOption ? item.selectedOption.name : 'Standard',
        quantity: item.quantity,
        price: item.selectedOption ? item.selectedOption.price : item.price,
      })),
      totalAmount: calculateTotal(),
    };
    setFinalOrder(orderData);
    setCheckoutStep('payment'); // Move to the next step
  };

  // This new function handles the final submission after "payment"
  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      await axios.post(`${API_URL}/api/orders`, finalOrder);
      
      setCheckoutStep('success'); // Move to the final success step
      clearCart();
    } catch (err) {
      console.error('Failed to submit order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER LOGIC BASED ON STEP ---

  // Step 3: Success/Receipt View
  if (checkoutStep === 'success') {
    return (
      <section className="section">
        <div className={`container ${styles.receipt}`}>
          <h2>Order Placed Successfully! ✅</h2>
          <p>Thank you, <strong>{finalOrder.customerName}</strong>.</p>
          <p>Your order for Table <strong>{finalOrder.tableNumber}</strong> has been received.</p>
          <h3>Total Amount: ₹{finalOrder.totalAmount}</h3>
          <Link href="/menu" className={styles.confirmBtn}>Back to Menu</Link>
        </div>
      </section>
    );
  }

  // Step 2: Dummy Payment View
  if (checkoutStep === 'payment') {
    return (
      <section className="section">
        <div className={`container ${styles.paymentScreen}`}>
          <div className="section-title">
            <h2>Scan to <span>Pay</span></h2>
          </div>
          <img 
            src="https://i.imgur.com/g27j2p7.png" 
            alt="Dummy QR Code for payment" 
            className={styles.qrCodeImage}
          />
          <h3>Total: ₹{finalOrder.totalAmount}</h3>
          <p>Please scan the QR code to complete your payment.</p>
          <button onClick={handleConfirmPayment} className={styles.confirmBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Confirming...' : 'I Have Paid'}
          </button>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      </section>
    );
  }

  // Step 1: Details Form View (Default)
  return (
    <section className="section">
      <div className="container">
        <div className="section-title">
          <h2>Confirm Your <span>Order</span></h2>
        </div>
        <form className={styles.checkoutLayout} onSubmit={handleDetailsSubmit}>
          {/* ... Customer Details and Order Summary JSX from before ... */}
          {/* Customer Details */}
          <div className={styles.customerDetails}>
            <h3>Your Details</h3>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="table">Table Number / Student ID</label>
              <input type="text" id="table" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} required />
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <h3>Order Summary</h3>
            {cartItems.map(item => (
              <div key={item.uniqueId} className={styles.summaryItem}>
                <span>{item.quantity} x {item.name} {item.selectedOption ? `(${item.selectedOption.name})` : ''}</span>
                <span>₹{(item.selectedOption ? item.selectedOption.price : item.price) * item.quantity}</span>
              </div>
            ))}
            <div className={styles.summaryTotal}>
              <strong>Total</strong>
              <strong>₹{calculateTotal()}</strong>
            </div>
            <button type="submit" className={styles.confirmBtn}>
              Confirm & Proceed to Pay
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CheckoutPage;