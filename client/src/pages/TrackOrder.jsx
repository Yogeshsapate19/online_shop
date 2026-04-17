import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Truck, Package, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`https://balaji-collection.onrender.com/api/orders/${orderId}`);
            setOrderData(res.data);
            setLoading(false);
        } catch (e) {
            setError('Order ID not found. Please check and try again.');
            setLoading(false);
        }
    };

    const getStatusStep = (status) => {
        const steps = ['Processing', 'Shipped', 'Delivered'];
        return steps.indexOf(status);
    };

    return (
        <div className="container" style={{ paddingTop: '150px', minHeight: '80vh' }}>
            <div className="section-title">
                <h2>Track Your Order</h2>
                <p>Enter your Tracking ID to see the status</p>
            </div>

            <div className="glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px', borderRadius: '20px' }}>
                <form onSubmit={handleTrack} style={{ display: 'flex', gap: '15px' }}>
                    <input 
                        type="text" placeholder="e.g. BALAJI-171..." 
                        style={inputStyle} value={orderId} onChange={(e) => setOrderId(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '0 30px' }}>
                        {loading ? '...' : <Search size={20}/>}
                    </button>
                </form>

                {error && <p style={{ color: '#ef4444', marginTop: '20px', textAlign: 'center' }}>{error}</p>}

                {orderData && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '50px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h3 style={{ color: 'var(--accent)' }}>Status: {orderData.status}</h3>
                            <p style={{ color: 'var(--text-light)' }}>Order ID: {orderData.id}</p>
                        </div>

                        {/* Tracking Timeline */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '15px', left: '0', width: '100%', height: '2px', background: '#eee', zIndex: 0 }}></div>
                            <div style={{ position: 'absolute', top: '15px', left: '0', width: `${(getStatusStep(orderData.status) / 2) * 100}%`, height: '2px', background: 'var(--accent)', zIndex: 1, transition: 'width 1s ease' }}></div>
                            
                            {['Processing', 'Shipped', 'Delivered'].map((step, i) => {
                                const isActive = getStatusStep(orderData.status) >= i;
                                return (
                                    <div key={step} style={{ position: 'relative', zIndex: 2, textAlign: 'center', background: 'white', padding: '0 10px' }}>
                                        <div style={{ 
                                            width: '32px', height: '32px', borderRadius: '50%', background: isActive ? 'var(--accent)' : '#eee', 
                                            color: isActive ? 'white' : '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px'
                                        }}>
                                            {i === 0 && <Clock size={16}/>}
                                            {i === 1 && <Truck size={16}/>}
                                            {i === 2 && <CheckCircle size={16}/>}
                                        </div>
                                        <p style={{ fontSize: '0.8rem', fontWeight: isActive ? 'bold' : 'normal' }}>{step}</p>
                                    </div>
                                )
                            })}
                        </div>

                        <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <h4>Order Details</h4>
                            {orderData.items.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                    <p>{item.name}</p>
                                    <p>₹{item.price}</p>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontWeight: 'bold', color: 'var(--accent)' }}>
                                <p>Total Paid</p>
                                <p>₹{orderData.total}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const inputStyle = {
    flexGrow: 1,
    padding: '15px 20px',
    borderRadius: '12px',
    border: '1px solid #eee',
    fontFamily: 'inherit',
    fontSize: '1rem'
};

export default TrackOrder;
