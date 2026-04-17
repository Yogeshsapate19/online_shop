const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

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

let orders = [
    { id: '1', customerName: 'Rahul Deshmukh', phone: '9876543210', address: 'Sangli, MH', total: 4500, status: 'Processing', items: [], email: 'rahul@example.com' },
    { id: '2', customerName: 'Priya Patil', phone: '9988776655', address: 'Islampur, MH', total: 2200, status: 'Shipped', items: [], email: 'priya@example.com' }
];

app.post('/api/orders', async (req, res) => {
  const orderData = req.body;
  const orderId = `BALAJI-${Date.now()}`;
  
  try {
    const newOrder = {
        ...orderData,
        id: orderId,
        status: 'Processing',
        createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
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

let reviews = [
  { id: 1, name: 'Abhijeet', review: 'Fantastic quality! The sherwani fits perfectly.', rating: 5, approved: true },
  { id: 2, name: 'Rohan', review: 'Great collection of western wear. Customer service is excellent.', rating: 5, approved: true },
  { id: 3, name: 'Yogesh Sapate', review: 'Amazing quality and fast delivery. The ethnic collection is top-notch!', rating: 5, approved: true },
  { id: 4, name: 'Aditya Jagtap', review: 'Best place in Islampur for premium western wear. Highly recommended!', rating: 5, approved: true },
  { id: 5, name: 'Shubham Shewalkar', review: 'The fabric quality is exceptional. Balaji Collection never disappoints.', rating: 5, approved: true }
];

app.get('/api/reviews', (req, res) => {
    res.json(reviews.filter(r => r.approved));
});

app.get('/api/reviews/admin', (req, res) => {
    res.json(allReviews || reviews); 
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

app.get('/', (req, res) => {
  res.send('Balaji Collection Server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
