import React from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div className={styles.footerSocial}>
            <h4>Follow Us</h4>
            <p>Stay connected with us on social media for the latest updates and specials.</p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialIcon} title="Twitter">T</a>
              <a href="#" className={styles.socialIcon} title="Facebook">F</a>
              <a href="#" className={styles.socialIcon} title="Instagram">I</a>
              <a href="#" className={styles.socialIcon} title="LinkedIn">L</a>
            </div>
          </div>
        </div>

        <div className={styles.footerCopyright}>
          {/* --- MODIFIED --- */}
          <p>&copy; {new Date().getFullYear()} NutriCafe. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;