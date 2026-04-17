import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Search, Store } from 'lucide-react';

const Navbar = ({ cartCount, isScrolled }) => {
  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo">
        BALAJI <span style={{ color: 'var(--accent)' }}>COLLECTION</span>
      </Link>
      
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/shop">Collections</Link>
        <Link to="/track">Track Order</Link>
        <Link to="/admin">Admin</Link>
      </div>

      <div className="nav-actions">
        <Search size={22} className="cursor-pointer" />
        <User size={22} className="cursor-pointer" />
        <Link to="/checkout" className="btn-cart">
          <ShoppingBag size={22} />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
