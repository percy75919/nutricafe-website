// 1. Import the fonts from next/font/google
import { Poppins, Lato } from 'next/font/google';

// Import all global components and styles
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartProvider } from '../context/CartContext';
import Chatbot from '../components/Chatbot';
import ScrollToTopButton from '../components/ScrollToTopButton'; // Import the new button

// 2. Configure the fonts
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins', // This creates a CSS variable
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato', // This creates a CSS variable
});


export const metadata = {
  // --- MODIFIED ---
  title: 'NutriCafe - Fresh & Delicious',
  description: 'Your neighborhood spot for fresh food and great coffee.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${lato.variable}`}>
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Chatbot />
          <ScrollToTopButton /> {/* Add the scroll-to-top button here */}
        </CartProvider>
      </body>
    </html>
  );
}