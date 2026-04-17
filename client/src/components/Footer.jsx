import React from 'react';
import { MessageCircle, Camera, Globe, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3>BALAJI COLLECTION</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
              Your destination for premium fashion in Islampur. We bring you the best of ethnic and western wear.
            </p>
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <MessageCircle size={20} className="cursor-pointer" />
              <Camera size={20} className="cursor-pointer" />
              <Globe size={20} className="cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h3>Quick Links</h3>
            <div style={{ display: 'grid', gap: '10px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              <Link to="/">Home</Link>
              <Link to="/shop">Shop Collection</Link>
              <Link to="/admin">Admin Panel</Link>
              <Link to="/">Contact Us</Link>
            </div>
          </div>

          <div>
            <h3>Contact Us</h3>
            <div style={{ display: 'grid', gap: '15px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="var(--accent)" /> Burud Galli, Islampur, Sangli
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="var(--accent)" /> +91 9764949524 (Mahesh K.)
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="var(--accent)" /> yogeshsapate2528@gmail.com
              </p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Balaji Collection. All rights reserved. Designed with ❤️ for Mahesh Kshirsagar.</p>
        </div>
      </div>
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919764949524?text=Hello Balaji Collection, I have an inquiry about..." 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            background: '#25D366',
            color: 'white',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(37, 211, 102, 0.3)',
            zIndex: 9999,
            transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.3 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
      </a>
    </footer>
  );
};

export default Footer;
