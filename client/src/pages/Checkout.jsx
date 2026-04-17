import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import confetti from 'canvas-confetti';

const Checkout = ({ cart, clearCart }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });
  const [orderStatus, setOrderStatus] = useState('idle'); // idle, processing, success
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'BALAJI10') {
        setDiscount(subtotal * 0.1);
        alert('Coupon Applied! 10% discount added.');
    } else {
        alert('Invalid Coupon Code');
    }
  };

  const upiLink = `upi://pay?pa=yogeshsapate2528-2@okicici&pn=Balaji Collection&am=${total}&tn=Order Payment`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderStatus('processing');

    try {
      // Send data to backend
      const response = await axios.post('https://balaji-collection.onrender.com/api/orders', {
        ...formData,
        items: cart,
        total: total,
        discount: discount
      });

      if (response.data.success) {
        setOrderStatus(response.data.orderId); // Store actual Order ID
        clearCart();
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0f172a', '#10b981', '#f59e0b']
        });
      }
    } catch (error) {
       console.error('Error placing order:', error);
       alert('There was an error placing your order. Please try again.');
       setOrderStatus('idle');
    }
  };

  if (orderStatus !== 'idle' && orderStatus !== 'processing') {
    return (
      <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <CheckCircle2 size={100} color="var(--accent)" style={{ margin: '0 auto 30px' }} />
        </motion.div>
        <h2>Order Placed Successfully!</h2>
        <p style={{ marginTop: '20px' }}>Your order ID is: <strong style={{color: 'var(--accent)'}}>{orderStatus}</strong></p>
        <p>A detailed bill has been sent to your email.</p>
        
        <div className="glass" style={{ maxWidth: '450px', margin: '40px auto', padding: '30px', borderRadius: '20px' }}>
            <h4 style={{ marginBottom: '15px' }}>Scan & Pay with any UPI App</h4>
            <img 
                src={qrCodeUrl} 
                alt="UPI QR Code" 
                style={{ width: '200px', height: '200px', margin: '10px auto', display: 'block', borderRadius: '10px' }} 
            />
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent)', margin: '15px 0' }}>yogeshsapate2528-2@okicici</p>
            <p style={{ fontSize: '0.9rem' }}>Total Amount Paid: ₹{total}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Discount applied: ₹{discount}</p>
            <a 
              href={upiLink} 
              className="btn-primary" 
              style={{ display: 'block', marginTop: '20px' }}
            >
              Pay via Phone App
            </a>
        </div>
        <p style={{ color: 'var(--text-light)' }}>You can track your order using the ID above in the "Track Order" section.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '120px' }}>
      <div className="section-title">
        <h2>Checkout</h2>
        <p>Complete your order and make payment</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
        <form onSubmit={handleSubmit}>
          <div className="glass" style={{ padding: '30px', borderRadius: '20px' }}>
            <h3>Shipping Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <input 
                type="text" placeholder="Full Name" required 
                style={inputStyle} onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="email" placeholder="Email" required 
                style={inputStyle} onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <input 
                type="text" placeholder="Phone Number" required 
                style={inputStyle} onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <input 
                type="text" placeholder="Address" required 
                style={inputStyle} onChange={e => setFormData({...formData, address: e.target.value})}
              />
              <input 
                type="text" placeholder="City" required 
                style={inputStyle} onChange={e => setFormData({...formData, city: e.target.value})}
              />
              <input 
                type="text" placeholder="ZIP Code" required 
                style={inputStyle} onChange={e => setFormData({...formData, zip: e.target.value})}
              />
            </div>
            
            <div style={{ marginTop: '40px' }}>
              <h3>Payment Method</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: '1px solid var(--accent)', borderRadius: '12px', marginTop: '15px', background: 'var(--accent-light)' }}>
                <CreditCard color="var(--accent)" />
                <div>
                  <p style={{ fontWeight: '600' }}>UPI Payment</p>
                  <p style={{ fontSize: '0.8rem' }}>Express checkout via UPI</p>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={cart.length === 0 || orderStatus === 'processing'}
              className="btn-primary" 
              style={{ width: '100%', marginTop: '40px', padding: '20px' }}
            >
              {orderStatus === 'processing' ? 'Processing...' : `Pay & Place Order ₹${total}`}
            </button>
          </div>
        </form>

        <div className="glass" style={{ height: 'fit-content', padding: '30px', borderRadius: '20px' }}>
          <h3>Order Summary</h3>
          <div style={{ marginTop: '20px' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <p>{item.name}</p>
                <p style={{ fontWeight: '600' }}>₹{item.price}</p>
              </div>
            ))}
            {/* Coupon Box */}
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                <p style={{ fontSize: '0.8rem', marginBottom: '10px' }}>Have a Promo Code?</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" placeholder="e.g. BALAJI10" 
                        style={{ ...inputStyle, flexGrow: 1, padding: '8px 12px' }}
                        value={coupon} onChange={e => setCoupon(e.target.value)}
                    />
                    <button type="button" onClick={applyCoupon} className="glass" style={{ padding: '0 15px', fontSize: '0.8rem' }}>Apply</button>
                </div>
            </div>

            {/* Price Detail */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', opacity: 0.7 }}>
                  <p>Subtotal</p>
                  <p>₹{subtotal}</p>
                </div>
                {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#10b981' }}>
                  <p>Discount (10%)</p>
                  <p>−₹{discount}</p>
                </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                  <h4>Total</h4>
                  <h4 style={{ color: 'var(--accent)' }}>₹{total}</h4>
                </div>
            </div>
          </div>
        </div>
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

export default Checkout;
