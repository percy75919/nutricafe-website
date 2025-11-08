'use client'; 
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className={styles.navbar}>
      <div className="container">
        <div className={styles.innerNav}>
          {/* --- MODIFIED --- */}
          <Link href="/" className={styles.logo}>NutriCafe</Link>
          
          <nav className={styles.navLinks}>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/menu">Menu</Link>
            <Link href="/specials">Specials</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          
          <div className={styles.navActions}>
            <Link href="/cart" className={styles.ctaButton}>
              Place Order ({totalItems})
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;