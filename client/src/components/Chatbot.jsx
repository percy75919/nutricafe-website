'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';
import axios from 'axios';
import Link from 'next/link';
// 1. Import the useCart hook
import { useCart } from '../context/CartContext';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isAwaitingFeedback, setIsAwaitingFeedback] = useState(false);
  const chatBodyRef = useRef(null);

  // 2. Get the addToCart function from our cart context
  const { addToCart } = useCart();
  
  // 3. State to hold your full menu list
  const [allMenuItems, setAllMenuItems] = useState([]);

  // Initial greeting message
  useEffect(() => {
    setMessages([{ sender: 'bot', text: 'Hello! I am the Nutricafe Assistant. How can I help you?' }]);
  }, []);

  // 4. Fetch all menu items once when the bot is opened
  useEffect(() => {
    if (isOpen && allMenuItems.length === 0) {
      const fetchAllItems = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
          const res = await axios.get(`${API_URL}/api/menu`);
          setAllMenuItems(res.data);
        } catch (err) {
          console.error("Failed to fetch menu for chatbot:", err);
        }
      };
      fetchAllItems();
    }
  }, [isOpen, allMenuItems.length]);
  
  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const userInput = e.target.elements.message.value.trim();
    if (!userInput) return;

    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    generateBotResponse(userInput, newMessages);
    e.target.reset();
  };
  
  const generateBotResponse = async (input, currentMessages) => {
    const lowerInput = input.toLowerCase();
    
    // Feedback logic (remains the same)
    if (isAwaitingFeedback) {
      let botResponse;
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        await axios.post(`${API_URL}/api/feedback`, { feedbackText: input });
        botResponse = 'Thank you for your valuable feedback!';
      } catch (err) {
        botResponse = "Sorry, there was an error submitting your feedback.";
      }
      setIsAwaitingFeedback(false);
      setMessages([...currentMessages, { sender: 'bot', text: botResponse }]);
      return;
    }

    if (lowerInput.includes('feedback') || lowerInput.includes('ఫీడ్‌బ్యాక్')) {
      setIsAwaitingFeedback(true);
      setMessages([...currentMessages, { sender: 'bot', text: 'Great! Please type your feedback below.' }]);
      return;
    }

    // Send message to the AI backend and parse the response
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const res = await axios.post(`${API_URL}/api/chatbot/ask`, { message: input });
      
      const aiResponse = res.data.response;

      // 5. Parse the AI response to find suggestions
      const foundSuggestions = [];
      if (allMenuItems.length > 0) {
        allMenuItems.forEach(item => {
          // If the AI's text mentions an item name, add it to our suggestion list
          if (aiResponse.toLowerCase().includes(item.name.toLowerCase())) {
            foundSuggestions.push(item);
          }
        });
      }
      
      // Add the AI's text and the interactive suggestions to the chat
      setMessages([...currentMessages, { 
        sender: 'bot', 
        text: aiResponse, 
        suggestions: foundSuggestions // Pass the suggestions to the message object
      }]);

    } catch (error) {
      console.error("Chatbot API error:", error);
      const errorMessage = 'Sorry, I am having trouble connecting. Please try again in a moment.';
      setMessages([...currentMessages, { sender: 'bot', text: errorMessage }]);
    }
  };

  return (
    <>
      <button className={styles.chatToggleButton} onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <span>Nutricafe Assistant</span>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className={styles.chatBody} ref={chatBodyRef}>
            {messages.map((msg, index) => (
              // 6. Use a wrapper for the message and buttons
              <div key={index} className={`${styles.messageWrapper}`}>
                <div className={`${styles.message} ${styles[msg.sender]}`}>
                  {msg.text}
                </div>
                
                {/* 7. Render suggestion buttons if they exist */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className={styles.suggestions}>
                    {msg.suggestions.map(item => (
                      <div key={item._id}>
                        {typeof item.price === 'object' ? (
                          // Render buttons for multi-price items
                          Object.entries(item.price).map(([type, price]) => (
                            <button 
                              key={type} 
                              className={styles.suggestBtn} 
                              onClick={() => addToCart(item, { name: type, price })}
                            >
                              Add {item.name} ({type})
                            </button>
                          ))
                        ) : (
                          // Render one button for single-price items
                          <button 
                            className={styles.suggestBtn} 
                            onClick={() => addToCart(item)}
                          >
                            Add {item.name}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form className={styles.chatFooter} onSubmit={handleSendMessage}>
            <input type="text" name="message" placeholder="Ask me anything..." autoComplete="off" />
            <button type="submit">→</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;