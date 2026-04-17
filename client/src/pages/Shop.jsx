import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import axios from 'axios';

const Shop = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'low', 'high'
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://balaji-collection.onrender.com/api/products');
      setProducts(res.data.filter(p => p.stock)); 
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
        if (sortOrder === 'low') return a.price - b.price;
        if (sortOrder === 'high') return b.price - a.price;
        return 0;
    });

  return (
    <div className="container" style={{ paddingTop: '120px' }}>
      <div className="section-title">
        <h2>Our Shop</h2>
        <p>Explore our exclusive collection of premium apparel</p>
      </div>

      {/* Filters & Search */}
      <div className="glass" style={{ padding: '20px', borderRadius: '15px', marginBottom: '40px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
            {['All', 'Ethnic', 'Western', 'Accessories'].map(cat => (
                <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{ padding: '8px 20px', borderRadius: '10px', background: selectedCategory === cat ? 'var(--primary)' : 'transparent', color: selectedCategory === cat ? 'white' : 'var(--text)', border: '1px solid #eee' }}
                >
                    {cat}
                </button>
            ))}
        </div>
        
        <div style={{ display: 'flex', gap: '15px', flexGrow: 1, maxWidth: '500px' }}>
            <input 
                type="text" placeholder="Search clothes..." 
                style={{ ...inputStyle, flexGrow: 1 }}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <select 
                style={{ ...inputStyle, width: '150px' }}
                onChange={e => setSortOrder(e.target.value)}
            >
                <option value="newest">Sort by</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
            </select>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product, index) => (
          <motion.div 
            key={product.id} 
            className="product-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
          >
            <div style={{ position: 'relative', overflow: 'hidden', height: '350px' }}>
              <img 
                src={product.img} 
                alt={product.name} 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    cursor: 'zoom-in'
                }} 
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <button className="glass" style={{ position: 'absolute', top: '15px', right: '15px', padding: '10px', borderRadius: '50%' }}>
                <Heart size={20} color="var(--primary)" />
              </button>
            </div>
            <div className="product-info">
              <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '600' }}>{product.category}</span>
              <h3 style={{ fontSize: '1.1rem', margin: '5px 0' }}>{product.name}</h3>
              
              {/* Size Selector */}
              <div style={{ display: 'flex', gap: '8px', margin: '15px 0' }}>
                {['S', 'M', 'L', 'XL'].map(size => (
                    <button 
                        key={size}
                        style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #eee', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#eee'}
                    >
                        {size}
                    </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <span className="product-price">₹{product.price}</span>
                <button 
                  onClick={() => addToCart(product)}
                  style={{ background: 'var(--primary)', color: 'white', padding: '8px 15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <ShoppingCart size={18} /> Add
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
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

export default Shop;
