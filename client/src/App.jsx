import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import TrackOrder from './pages/TrackOrder';
import './index.css';

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [cart, setCart] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <Router>
      <div className="app">
        <motion.div style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent)', transformOrigin: '0%', zIndex: 9999 }} />
        <Navbar cartCount={cart.length} isScrolled={isScrolled} />
        <main style={{ paddingTop: '0' }}>
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/shop" element={<Shop addToCart={addToCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} clearCart={() => setCart([])} />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/track" element={<TrackOrder />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
