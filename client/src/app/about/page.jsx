import styles from './AboutPage.module.css';

const AboutPage = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="section-title">
          <h2>About <span>Us</span></h2>
          <p>Learn more about NutriCafe, your cozy spot for great food and drinks.</p>
        </div>

        <div className={styles.aboutContent}>
          <div className={styles.aboutImage}>
            {/* --- UPDATED: Image directly from the web (Unsplash) --- */}
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="NutriCafe Interior" 
            />
          </div>
          <div className={styles.aboutText}>
            <h3>A cozy spot for delicious food and great coffee.</h3>
            <p className={styles.introParagraph}>
              Welcome to **NutriCafe**, your new favorite neighborhood spot. We believe in serving fresh, wholesome food in a comfortable and vibrant space where people can connect, relax, and enjoy a great meal.
            </p>
            <ul>
              <li><i className="bi bi-check-circle"></i> Freshly prepared meals and artisan coffee.</li>
              <li><i className="bi bi-check-circle"></i> A wide variety of healthy and tasty options.</li>
              <li><i className="bi bi-check-circle"></i> A comfortable and lively atmosphere for work or relaxation.</li>
            </ul>
            <p>
              At NutriCafe, we're more than just a cafe – we're a community hub. From a quick breakfast to a relaxing lunch, we've got something for everyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;