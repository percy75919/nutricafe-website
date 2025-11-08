import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Welcome to NutriCafe</h1>
        <p>Your neighborhood spot for fresh food and great coffee.</p>
        <Link href="/menu" className={styles.heroButton}>View Our Menu</Link>
      </div>
    </div>
  );
}