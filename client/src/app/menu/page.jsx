'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './MenuPage.module.css';
import { useCart } from '../../context/CartContext';

const categoryOrder = [
  'VEG BREAKFAST', 'NON-VEG BREAKFAST', 'SHAKES', 'MOCKTAILS', 'JUICES', 'VEG BURGERS', 'NON-VEG BURGERS',
  'VEG PIZZA', 'NON-VEG PIZZA', 'SANDWICH & WRAPS', 'VEG-CURRIES', 'NON-VEG CURRIES', 'BREADS',
  'VEG BIRYANI', 'NON-VEG BIRYANI', 'PULAOS', 'RICE BOWLS', 'MEALS', 'FRIED RICE', 'NOODLES',
  'VEG STARTERS', 'SEA FOOD STARTERS', 'NON-VEG STARTERS'
];

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { cartItems, addToCart, updateQuantity } = useCart();
  const scrollRefs = useRef({});
  const [isScrollable, setIsScrollable] = useState({});

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        const res = await axios.get(`${API_URL}/api/menu`);
        setMenuItems(res.data);
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const checkScrollable = () => {
      const newIsScrollable = {};
      for (const category in scrollRefs.current) {
        const element = scrollRefs.current[category];
        if (element) {
          newIsScrollable[category] = element.scrollWidth > element.clientWidth;
        }
      }
      setIsScrollable(newIsScrollable);
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [menuItems, searchTerm]);

  const generalItems = menuItems.filter(item => !item.isSpecial);

  const filteredItems = generalItems.filter(item => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    if (!lowerCaseSearchTerm) return true;
    const inName = item.name.toLowerCase().includes(lowerCaseSearchTerm);
    const inCategory = item.category.toLowerCase().includes(lowerCaseSearchTerm);
    const inTags = item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm));
    return inName || inCategory || inTags;
  });

  const menuByCategory = filteredItems.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  const formatPrice = (price) => {
    if (typeof price === 'object' && price !== null) {
      return Object.entries(price).map(([key, value]) => `${key}: ₹${value}`).join(' / ');
    }
    return `₹${price}`;
  };

  const handleScroll = (category, direction) => {
    const element = scrollRefs.current[category];
    if (element) {
      const scrollAmount = 300; 
      element.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) return <div className={styles.loader}>Loading Menu...</div>;

  return (
    <section>
      <div className="container">
        <div className="section-title">
          <h2>NutriCafe's Tasty <span>Menu</span></h2>
        </div>
        <div className={styles.filterControls}>
          <input type="text" placeholder="Search the general menu..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {filteredItems.length > 0 ? (
          categoryOrder.map(category => (
            menuByCategory[category] && (
              <div key={category} className={styles.menuCategory}>
                <h3>{category.replace(/&/g, '&amp;').replace(/_/g, ' ')}</h3>
                <div className={styles.scrollContainer}>
                  <div 
                    className={styles.menuGrid} 
                    ref={el => scrollRefs.current[category] = el}
                  >
                    {menuByCategory[category].map(item => {
                      const renderOrderControls = (currentItem, option = null) => {
                        const uniqueId = currentItem._id + (option ? option.name : '');
                        const itemInCart = cartItems.find(cartItem => cartItem.uniqueId === uniqueId);

                        if (itemInCart) {
                          return (
                            <div className={styles.quantityControl}>
                              <button onClick={() => updateQuantity(uniqueId, -1)}>−</button>
                              <span>{itemInCart.quantity}</span>
                              <button onClick={() => updateQuantity(uniqueId, 1)}>+</button>
                            </div>
                          );
                        } else {
                          return (
                            <button
                              className={styles.addToOrderBtn}
                              onClick={() => addToCart(currentItem, option)}
                            >
                              {option ? `Add ${option.name} (₹${option.price})` : 'Add to Order'}
                            </button>
                          );
                        }
                      };

                      return (
                        <div key={item._id} className={styles.menuCard}>
                          <img src={item.imageUrl || 'https://via.placeholder.com/300x200.png?text=MHP'} alt={item.name} className={styles.menuCardImg} />
                          <div className={styles.menuCardBody}>
                            <div className={styles.menuCardHeader}>
                              <h4>{item.name}</h4>
                              <p className={styles.menuCardPrice}>
                                {typeof item.price === 'object' ? 'See options below' : `₹${item.price}`}
                              </p>
                            </div>
                            <p className={styles.menuCardDescription}>{item.description}</p>
                            <div className={styles.addToOrderContainer}>
                              {typeof item.price === 'object' ? (
                                Object.entries(item.price).map(([type, price]) => (
                                  <div key={type} className={styles.optionRow}>
                                    <span>{type}: ₹{price}</span>
                                    {renderOrderControls(item, { name: type, price })}
                                  </div>
                                ))
                              ) : (
                                renderOrderControls(item)
                              )}
                            </div>
                            {item.nutrition && (
                              <div className={styles.nutritionInfo}>
                                <p><b>Calories:</b> {item.nutrition.calories} kcal</p>
                                <p><b>Protein:</b> {item.nutrition.protein}</p>
                                <p><b>Carbs:</b> {item.nutrition.carbs}</p>
                                <p><b>Fat:</b> {item.nutrition.fat}</p>
                              </div>
                            )}
                            {item.tags && item.tags.length > 0 && (
                              <div className={styles.menuCardTags}>
                                {item.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {isScrollable[category] && (
                    <div className={styles.scrollArrows}>
                      <button className={styles.scrollBtn} onClick={() => handleScroll(category, 'left')}>‹</button>
                      <button className={styles.scrollBtn} onClick={() => handleScroll(category, 'right')}>›</button>
                    </div>
                  )}
                </div>
              </div>
            )
          ))
        ) : (
          <p style={{ textAlign: 'center', marginTop: '40px' }}>No menu items match your search.</p>
        )}
      </div>
    </section>
  );
};

export default MenuPage;