import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', review: '', rating: 5, image: '' });

  const categories = [
    { id: 1, name: 'Ethnic Collection', img: '/ethnic.png', count: '45+ Items' },
    { id: 2, name: 'Western Wear', img: '/western_cat.png', count: '30+ Items' },
    { id: 3, name: 'Accessories', img: '/access.png', count: '12+ Items' },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
          const res = await axios.get('http://localhost:5000/api/reviews');
          setReviews(res.data);
      } catch (e) { console.error(e); }
    };
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e) => {
      e.preventDefault();
      try {
          await axios.post('http://localhost:5000/api/reviews', newReview);
          alert('Review submitted! It will appear after admin approval.');
          setNewReview({ name: '', review: '', rating: 5, image: '' });
      } catch (e) { alert('Error submitting review'); }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <img src="/hero.png" alt="Hero" className="hero-img" />
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            Redefining <br/>Premium <span style={{ color: 'var(--accent)' }}>Fashion</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover the latest trends in high-end ethnic and western wear at Balaji Collection. Crafted for elegance, designed for you.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/shop" className="btn-primary">
              Shop Collection <ArrowRight size={18} style={{ marginLeft: '10px' }} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container" style={{ marginTop: '-50px', position: 'relative', zIndex: 10 }}>
        <div className="glass" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', padding: '40px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center' }}>
            <Truck size={32} color="var(--accent)" style={{ marginBottom: '15px' }} />
            <h4>Free Shipping</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>On orders over ₹999</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <ShieldCheck size={32} color="var(--accent)" style={{ marginBottom: '15px' }} />
            <h4>Secure Payment</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>100% Secure Transaction</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Clock size={32} color="var(--accent)" style={{ marginBottom: '15px' }} />
            <h4>24/7 Support</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Dedicated Support Team</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container">
        <div className="section-title">
          <h2>Our Collections</h2>
        </div>
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <Link to="/shop" key={cat.id}>
              <motion.div 
                className="category-card"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <img src={cat.img} alt={cat.name} />
                <div className="category-overlay">
                  <h3>{cat.name}</h3>
                  <p>{cat.count}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container" style={{ marginTop: '100px' }}>
        <div style={{ background: 'var(--primary)', color: 'white', padding: '60px', borderRadius: '30px', textAlign: 'center' }}>
            <h2>Join the Balaji Fashion Club</h2>
            <p style={{ opacity: 0.8, marginTop: '10px' }}>Subscribe to get early access to new collections and exclusive offers.</p>
            <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <input 
                    type="email" placeholder="Your email address" 
                    style={{ padding: '15px 25px', borderRadius: '50px', border: 'none', width: '300px' }}
                />
                <button className="btn-primary" style={{ boxShadow: 'none' }}>Subscribe</button>
            </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container" style={{ marginTop: '100px' }}>
        <div className="section-title">
          <h2>What Our Customers Say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {reviews.map((rev, i) => (
            <motion.div 
              key={rev.id || i} 
              className="glass" 
              style={{ padding: '30px', borderRadius: '20px', textAlign: 'center' }}
              whileHover={{ y: -10 }}
            >
              {rev.image && (
                  <img src={rev.image} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 20px', border: '3px solid var(--accent)' }} alt={rev.name} />
              )}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '15px' }}>
                {[...Array(5)].map((_, j) => <Star key={j} size={16} fill={j < rev.rating ? "var(--gold)" : "none"} color="var(--gold)" />)}
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>"{rev.review}"</p>
              <h4 style={{ color: 'var(--accent)' }}>- {rev.name}</h4>
            </motion.div>
          ))}
        </div>

        {/* Submit Review Form */}
        <div className="glass" style={{ marginTop: '60px', padding: '40px', borderRadius: '30px', maxWidth: '700px', margin: '0 auto' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Share Your Experience</h3>
            <form onSubmit={handleReviewSubmit} style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <input 
                        type="text" placeholder="Your Name" required style={inputStyle}
                        value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})}
                    />
                    <input 
                        type="text" placeholder="Photo Path (e.g. /abhijeet.png)" style={inputStyle}
                        value={newReview.image} onChange={e => setNewReview({...newReview, image: e.target.value})}
                    />
                </div>
                <textarea 
                    placeholder="Your Review" required rows="4" style={inputStyle}
                    value={newReview.review} onChange={e => setNewReview({...newReview, review: e.target.value})}
                ></textarea>
                <button type="submit" className="btn-primary">Submit for Approval</button>
            </form>
        </div>
      </section>

      {/* Owner Info & Map */}
      <section className="container" style={{ margin: '100px auto' }}>
        <div className="section-title">
          <h2>Visit Our Store</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'center' }}>
          <div>
            <h3>Balaji Collection</h3>
            <p style={{ color: 'var(--text-light)', marginTop: '10px' }}>Burud Galli, Islampur, Sangli, Maharashtra</p>
            <div style={{ marginTop: '30px' }}>
              <h4 style={{ color: 'var(--accent)' }}>Proprietor</h4>
              <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>Mahesh Kshirsagar</p>
              <p style={{ color: 'var(--text-light)' }}>Mob: +91 9764949524</p>
            </div>
          </div>
          <div style={{ height: '400px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15264.444265432!2d74.4754!3d17.0454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc141b7149a4e75%3A0x6a0f44358a9cc37d!2sIslampur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1713360000000!5m2!1sen!2sin" 
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen="" 
               loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    fontFamily: 'inherit',
    fontSize: '0.95rem'
};

export default Home;
