const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Helper functions to read/write data
const readMenuData = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'menu.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading menu data:', error);
    return {};
  }
};

const readOrdersData = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'orders.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders data:', error);
    return [];
  }
};

const writeOrdersData = (orders) => {
  try {
    fs.writeFileSync(path.join(__dirname, 'data', 'orders.json'), JSON.stringify(orders, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing orders data:', error);
    return false;
  }
};

// API Routes

// Get menu items
app.get('/api/menu', (req, res) => {
  const menu = readMenuData();
  res.json(menu);
});

// Get all orders (for admin)
app.get('/api/orders', (req, res) => {
  const orders = readOrdersData();
  res.json(orders);
});

// Create new order
app.post('/api/orders', (req, res) => {
  const { customerName, items, totalAmount } = req.body;
  
  if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  const orders = readOrdersData();
  const newOrder = {
    id: 'order_' + Date.now(),
    customerName,
    items,
    totalAmount: parseFloat(totalAmount) || 0,
    status: 'pending',
    timestamp: new Date().toISOString(),
    orderNumber: orders.length + 1
  };

  orders.push(newOrder);
  
  if (writeOrdersData(orders)) {
    res.status(201).json({ 
      success: true, 
      order: newOrder,
      message: 'Order created successfully' 
    });
  } else {
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// Update order status
app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status || !['pending', 'preparing', 'ready', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const orders = readOrdersData();
  const orderIndex = orders.findIndex(order => order.id === id);
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders[orderIndex].status = status;
  orders[orderIndex].updatedAt = new Date().toISOString();
  
  if (writeOrdersData(orders)) {
    res.json({ 
      success: true, 
      order: orders[orderIndex],
      message: 'Order status updated successfully' 
    });
  } else {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete order
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const orders = readOrdersData();
  const filteredOrders = orders.filter(order => order.id !== id);
  
  if (orders.length === filteredOrders.length) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  if (writeOrdersData(filteredOrders)) {
    res.json({ success: true, message: 'Order deleted successfully' });
  } else {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Serve admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Digital Menu server running on port ${PORT}`);
  console.log(`Customer interface: http://localhost:${PORT}`);
  console.log(`Admin interface: http://localhost:${PORT}/admin`);
});