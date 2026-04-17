import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, MapPin, User, Phone, Plus, Trash2, Edit3, Check, X, Star } from 'lucide-react';

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginForm, setLoginForm] = useState({ id: '', password: '' });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [view, setView] = useState('orders'); // 'orders', 'products', 'stats', 'reviews'
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Ethnic', img: '/saree.png' });

  // Statistics Calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('http://localhost:5000/api/login', loginForm);
        if (res.data.success) {
            setIsAdmin(true);
            fetchData();
        }
    } catch (e) {
        alert('Invalid ID or Password');
    }
  };

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [orderRes, productRes, reviewRes] = await Promise.all([
        axios.get('http://localhost:5000/api/orders'),
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/reviews/admin')
      ]);
      setOrders(orderRes.data);
      setProducts(productRes.data);
      setAllReviews(reviewRes.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const approveReview = async (id) => {
      try {
          await axios.put(`http://localhost:5000/api/reviews/${id}/approve`);
          fetchData();
      } catch (e) { alert('Error approving review'); }
  };

  const deleteReview = async (id) => {
      if (window.confirm('Delete this review?')) {
        try {
            await axios.delete(`http://localhost:5000/api/reviews/${id}`);
            fetchData();
        } catch (e) { alert('Error deleting review'); }
      }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
        await axios.post('http://localhost:5000/api/products', newProduct);
        setNewProduct({ name: '', price: '', category: 'Ethnic', img: '/saree.png' });
        fetchData();
    } catch (e) { alert('Error adding product'); }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            fetchData();
        } catch (e) { alert('Error deleting product'); }
    }
  };

  const toggleStock = async (product) => {
    try {
        await axios.put(`http://localhost:5000/api/products/${product.id}`, { stock: !product.stock });
        fetchData();
    } catch (e) { alert('Error updating stock'); }
  };

  const changePrice = async (id, newPrice) => {
      try {
          await axios.put(`http://localhost:5000/api/products/${id}`, { price: Number(newPrice) });
          fetchData();
      } catch (e) { alert('Error updating price'); }
  };

  const updateOrderStatus = async (id, status) => {
      try {
          await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status });
          fetchData();
      } catch (e) { alert('Error updating status'); }
  };

  if (!isAdmin) {
      return (
          <div className="container" style={{ paddingTop: '150px', display: 'flex', justifyContent: 'center' }}>
              <div className="glass" style={{ width: '400px', padding: '40px', borderRadius: '20px', textAlign: 'center' }}>
                  <User size={50} color="var(--accent)" style={{ marginBottom: '20px' }} />
                  <h2>Admin Login</h2>
                  <form onSubmit={handleLogin} style={{ marginTop: '30px', display: 'grid', gap: '20px' }}>
                      <input 
                          type="text" placeholder="Admin ID" required style={inputStyle}
                          value={loginForm.id} onChange={(e) => setLoginForm({...loginForm, id: e.target.value})}
                      />
                      <input 
                          type="password" placeholder="Password" required style={inputStyle}
                          value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      />
                      <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
                  </form>
              </div>
          </div>
      );
  }

  return (
    <div className="container" style={{ paddingTop: '120px' }}>
      <div className="section-title">
        <h2>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => setView('orders')} className={view === 'orders' ? 'btn-primary' : 'glass'} style={{ padding: '10px 25px' }}>Orders</button>
            <button onClick={() => setView('products')} className={view === 'products' ? 'btn-primary' : 'glass'} style={{ padding: '10px 25px' }}>Inventory</button>
            <button onClick={() => setView('reviews')} className={view === 'reviews' ? 'btn-primary' : 'glass'} style={{ padding: '10px 25px' }}>Reviews</button>
            <button onClick={() => setView('stats')} className={view === 'stats' ? 'btn-primary' : 'glass'} style={{ padding: '10px 25px' }}>Sales Stats</button>
        </div>
      </div>

      {view === 'stats' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', marginBottom: '40px' }}>
              <div className="glass" style={{ padding: '30px', textAlign: 'center', borderRadius: '20px' }}>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Total Revenue</p>
                  <h2 style={{ color: 'var(--accent)', marginTop: '10px' }}>₹{totalRevenue}</h2>
              </div>
              <div className="glass" style={{ padding: '30px', textAlign: 'center', borderRadius: '20px' }}>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Total Orders</p>
                  <h2 style={{ color: 'var(--accent)', marginTop: '10px' }}>{totalOrders}</h2>
              </div>
              <div className="glass" style={{ padding: '30px', textAlign: 'center', borderRadius: '20px' }}>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Available Items</p>
                  <h2 style={{ color: 'var(--accent)', marginTop: '10px' }}>{products.length}</h2>
              </div>
          </div>
      )}

      {view === 'orders' ? (
        <div style={{ display: 'grid', gap: '20px' }}>
            {orders.map(order => (
            <div key={order.id} className="glass" style={{ padding: '25px', borderRadius: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', alignItems: 'center' }}>
                <div>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)' }}><User size={16}/> Customer</p>
                    <p style={{ fontWeight: '600' }}>{order.customerName}</p>
                </div>
                <div>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)' }}><Package size={16}/> Amount</p>
                    <p style={{ fontWeight: '800', color: 'var(--accent)' }}>₹{order.total}</p>
                </div>
                <div>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Status</p>
                    <select 
                        defaultValue={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        style={{ ...inputStyle, padding: '5px', fontSize: '0.8rem' }}
                    >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
                <div style={{textAlign: 'right'}}>
                    <p style={{fontSize: '0.7rem', color: 'var(--text-light)'}}>{order.id}</p>
                </div>
            </div>
            ))}
        </div>
      ) : view === 'products' ? (
        <div style={{ display: 'grid', gap: '40px' }}>
            {/* Add Product Form */}
            <div className="glass" style={{ padding: '30px', borderRadius: '20px' }}>
                <h3>Add New Collection Item</h3>
                <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    <input 
                        type="text" placeholder="Item Name" required style={inputStyle}
                        value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    />
                    <input 
                        type="number" placeholder="Price" required style={inputStyle}
                        value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    />
                    <select style={inputStyle} value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                        <option value="Ethnic">Ethnic</option>
                        <option value="Western">Western</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                    <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Plus size={18}/> Add to Store
                    </button>
                </form>
            </div>

            {/* Product List */}
            <div style={{ display: 'grid', gap: '15px' }}>
                {products.map(product => (
                    <div key={product.id} className="glass" style={{ padding: '20px', borderRadius: '15px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <img src={product.img} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                            <div>
                                <p style={{ fontWeight: '600' }}>{product.name}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{product.category}</p>
                            </div>
                        </div>
                        <div>
                            <input 
                                type="number" 
                                defaultValue={product.price}
                                onBlur={(e) => changePrice(product.id, e.target.value)}
                                style={{ ...inputStyle, width: '100px', padding: '5px' }}
                            />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button 
                                onClick={() => toggleStock(product)}
                                style={{ padding: '5px 15px', borderRadius: '20px', background: product.stock ? 'var(--accent-light)' : '#fee2e2', color: product.stock ? 'var(--accent)' : '#ef4444', fontSize: '0.8rem', fontWeight: 'bold' }}
                            >
                                {product.stock ? 'In Stock' : 'Out of Stock'}
                            </button>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleDeleteProduct(product.id)} style={{ color: '#ef4444' }}><Trash2 size={18}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
              {allReviews.map(rev => (
                  <div key={rev.id} className="glass" style={{ padding: '25px', borderRadius: '15px', display: 'grid', gridTemplateColumns: '1fr 3fr 1fr 1fr', gap: '20px', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                          {rev.image ? <img src={rev.image} style={{ width: '50px', height: '50px', borderRadius: '50%' }} /> : <User size={30} />}
                          <p style={{ fontWeight: '600', fontSize: '0.8rem', marginTop: '5px' }}>{rev.name}</p>
                      </div>
                      <div>
                          <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>"{rev.review}"</p>
                          <div style={{ display: 'flex', gap: '2px', marginTop: '5px' }}>
                              {[...Array(rev.rating)].map((_, i) => <Star key={i} size={12} fill="var(--gold)" color="var(--gold)" />)}
                          </div>
                      </div>
                      <div>
                          <span style={{ padding: '5px 12px', borderRadius: '20px', background: rev.approved ? '#dcfce7' : '#fee2e2', color: rev.approved ? '#166534' : '#991b1b', fontSize: '0.7rem', fontWeight: 'bold' }}>
                              {rev.approved ? 'Approved' : 'Pending'}
                          </span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                          {!rev.approved && <button onClick={() => approveReview(rev.id)} style={{ color: '#166534' }}><Check size={20}/></button>}
                          <button onClick={() => deleteReview(rev.id)} style={{ color: '#ef4444' }}><Trash2 size={20}/></button>
                      </div>
                  </div>
              ))}
          </div>
      )}
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

export default Admin;
