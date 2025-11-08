import styles from './ContactPage.module.css';

const ContactPage = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="section-title">
          <h2><span>Contact</span> Us</h2>
          <p>Get in touch with us for any queries or feedback.</p>
        </div>

        <div className={styles.contactContainer}>
          <div className={styles.contactInfo}>
            <h3>Get in touch</h3>
            <p>We'd love to hear from you. Fill out the form or use our contact details below.</p>            <div className={styles.infoItem}>
              <strong>Location:</strong>
              <p>123 College Road, Guntur, AP 522001, India</p>
            </div>
            <div className={styles.infoItem}>
              <strong>Email:</strong>
              <p>info@nutricafe.com</p>
            </div>
            <div className={styles.infoItem}>
              <strong>Call:</strong>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <form className={styles.contactForm}>
            <div className={styles.formRow}>
              <input type="text" name="name" placeholder="Your Name" required />
              <input type="email" name="email" placeholder="Your Email" required />
            </div>
            <div className={styles.formGroup}>
              <input type="text" name="subject" placeholder="Subject" required />
            </div>
            <div className={styles.formGroup}>
              <textarea name="message" rows="5" placeholder="Message" required></textarea>
            </div>
            <div className={styles.formButton}>
              <button type="submit">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;