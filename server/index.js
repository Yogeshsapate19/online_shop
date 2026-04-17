const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/login', (req, res) => {
    const { id, password } = req.body;
    if (id === 'balajicollectionadmin' && password === 'yogeshsapate') {
        res.json({ success: true, token: 'mock-admin-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Initialize Firebase Admin (Assuming serviceAccount.json is provided or using env)
// For now, I'll use a placeholder structure. The user will need to add their firebase config.
/*
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
*/

// Safe Firestore initialization
let db;
try {
    if (admin.apps.length > 0) {
        db = admin.firestore();
    } else {
        throw new Error('Firebase not initialized');
    }
} catch (e) {
    console.log('Using Mock Database (Firebase not configured)');
    db = {
        collection: () => ({
            add: async (data) => { console.log('Mock Firestore Save:', data); return { id: 'mock_id' }; },
            get: async () => ({ docs: [] })
        })
    };
}

// Email Transporter (Using Gmail for demo - User might need App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yogeshsapate2528@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password' 
  }
});

let orders = [
    { id: '1', customerName: 'Rahul Deshmukh', phone: '9876543210', address: 'Sangli, MH', total: 4500, status: 'Processing', items: [], email: 'rahul@example.com' },
    { id: '2', customerName: 'Priya Patil', phone: '9988776655', address: 'Islampur, MH', total: 2200, status: 'Shipped', items: [], email: 'priya@example.com' }
];

app.post('/api/orders', async (req, res) => {
  const orderData = req.body;
  const orderId = `BALAJI-${Date.now()}`;
  
  try {
    // 1. Save to global orders (including status)
    const newOrder = {
        ...orderData,
        id: orderId,
        status: 'Processing',
        createdAt: new Date().toISOString()
    };
    orders.push(newOrder);

    // 2. Send Bill to Customer
    const customerMailOptions = {
        from: 'yogeshsapate2528@gmail.com',
        to: orderData.email,
        subject: `Order Receipt - Balaji Collection #${orderId}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="text-align: center; color: #0f172a;">BALAJI COLLECTION</h2>
                <hr/>
                <p>Hello <strong>${orderData.customerName}</strong>,</p>
                <p>Thank you for shopping with us! Here is your order receipt.</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background: #f8fafc;">
                        <th style="padding: 10px; border: 1px solid #eee;">Item</th>
                        <th style="padding: 10px; border: 1px solid #eee;">Price</th>
                    </tr>
                    ${orderData.items.map(item => `
                        <tr>
                            <td style="padding: 10px; border: 1px solid #eee;">${item.name}</td>
                            <td style="padding: 10px; border: 1px solid #eee;">₹${item.price}</td>
                        </tr>
                    `).join('')}
                    <tr style="font-weight: bold;">
                        <td style="padding: 10px; border: 1px solid #eee;">Total</td>
                        <td style="padding: 10px; border: 1px solid #eee; color: #10b981;">₹${orderData.total}</td>
                    </tr>
                </table>
                <p><strong>Tracking ID:</strong> ${orderId}</p>
                <p>You can track your order at our website using this ID.</p>
                <hr/>
                <p style="text-align: center; font-size: 0.8rem; color: #64748b;">Burud Galli, Islampur, Sangli | +91 9764949524</p>
            </div>
        `
    };

    // 3. Send Notification to Admin
    const adminMailOptions = {
      from: 'yogeshsapate2528@gmail.com',
      to: 'yogeshsapate2528@gmail.com',
      subject: `New Order Received #${orderId}`,
      html: `<h2>New Order Details</h2><p><strong>Tracking ID:</strong> ${orderId}</p><p>Check Admin panel for full details.</p>`
    };

    await Promise.all([
        transporter.sendMail(customerMailOptions),
        transporter.sendMail(adminMailOptions)
    ]);

    res.status(200).json({ success: true, orderId: orderId });
  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (order) res.json(order);
    else res.status(404).json({ success: false, message: 'Order not found' });
});

app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        res.json({ success: true, status: status });
    } else {
        res.status(404).json({ success: false });
    }
});

app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// Mock Database for Reviews
let reviews = [
  { id: 1, name: 'Abhijeet', review: 'Fantastic quality! The sherwani fits perfectly.', image: '/abhijeet1.jpeg', rating: 5, approved: true },
  { id: 2, name: 'Rohan', review: 'Great collection of western wear. Customer service is excellent.', image: '/rohan1.jpeg', rating: 5, approved: true },
  { id: 3, name: 'Yogesh Sapate', review: 'Amazing quality and fast delivery. The ethnic collection is top-notch!', rating: 5, approved: true },
  { id: 4, name: 'Aditya Jagtap', review: 'Best place in Islampur for premium western wear. Highly recommended!', rating: 5, approved: true },
  { id: 5, name: 'Shubham Shewalkar', review: 'The fabric quality is exceptional. Balaji Collection never disappoints.', rating: 5, approved: true }
];

app.get('/api/reviews', (req, res) => {
    res.json(reviews.filter(r => r.approved));
});

app.get('/api/reviews/admin', (req, res) => {
    res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
    const newReview = { ...req.body, id: Date.now(), approved: false };
    reviews.push(newReview);
    res.status(201).json({ success: true });
});

app.put('/api/reviews/:id/approve', (req, res) => {
    const { id } = req.params;
    const index = reviews.findIndex(r => r.id == id);
    if (index !== -1) {
        reviews[index].approved = true;
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false });
    }
});

app.delete('/api/reviews/:id', (req, res) => {
    reviews = reviews.filter(r => r.id != req.params.id);
    res.json({ success: true });
});

// Mock Database for Products
let products = [
  { id: 1, name: 'Premium Silk Saree', price: 4500, img: '/saree.png', category: 'Ethnic', stock: true },
  { id: 2, name: 'Designer Sherwani', price: 8500, img: '/sherwani.png', category: 'Ethnic', stock: true },
  { id: 3, name: 'Slim Fit Shirt', price: 1500, img: '/shirt.png', category: 'Western', stock: true },
  { id: 4, name: 'Cotton Kurta Set', price: 2200, img: '/kurta.png', category: 'Ethnic', stock: true },
  { id: 5, name: 'Denim Jacket', price: 3200, img: '/denim.png', category: 'Western', stock: true },
  { id: 6, name: 'Casual Trousers', price: 1800, img: '/trousers.png', category: 'Western', stock: true },
];

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.post('/api/products', (req, res) => {
    const newProduct = { ...req.body, id: Date.now(), stock: true };
    products.push(newProduct);
    res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id == id);
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body };
        res.json({ success: true, product: products[index] });
    } else {
        res.status(404).json({ success: false, message: 'Product not found' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    products = products.filter(p => p.id != id);
    res.json({ success: true });
});

app.get('/api/orders', async (req, res) => {
    try {
        // const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        // const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json([]); // Returning empty for now
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
  res.send('Balaji Collection Server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
