# Digital Menu

A complete digital menu system with order creation and management features. Perfect for restaurants, cafes, and food service establishments.

## Features

### Customer Interface
- 🍽️ **Digital Menu Display** - Browse menu items organized by category
- 🛒 **Shopping Cart** - Add items, adjust quantities, and view order total
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🎯 **Category Filtering** - Filter menu by appetizers, mains, desserts, and beverages
- ✅ **Order Placement** - Simple order submission with customer details

### Admin Panel
- 📊 **Order Management** - View and manage all incoming orders
- 🔄 **Status Updates** - Track orders from pending to completed
- 📈 **Statistics Dashboard** - View total orders, pending orders, and daily revenue
- 🗂️ **Order Filtering** - Filter orders by status (pending, preparing, ready, completed)
- 🔄 **Auto Refresh** - Automatically updates every 30 seconds
- 🗑️ **Order Management** - Delete orders when needed

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/destny69/Digital-Menu.git
   cd Digital-Menu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Customer Interface: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## Usage

### For Customers
1. Browse the digital menu by category or view all items
2. Click "Add to Cart" for desired items
3. Adjust quantities using the +/- buttons in the cart
4. Click "Place Order" when ready
5. Enter your name and confirm the order
6. Receive order confirmation with order number

### For Staff/Admins
1. Access the admin panel at `/admin`
2. View incoming orders in real-time
3. Update order status as you prepare items:
   - **Pending** → **Preparing** → **Ready** → **Completed**
4. Monitor daily statistics and revenue
5. Filter orders by status for better organization
6. Delete completed or cancelled orders

## Technical Architecture

### Frontend
- **HTML5** - Semantic markup for accessibility
- **CSS3** - Responsive design with flexbox and grid
- **Vanilla JavaScript** - No frameworks, lightweight and fast
- **Modern ES6+** - Classes, async/await, and modern JS features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JSON File Storage** - Simple data persistence (easily upgradeable to database)
- **RESTful API** - Clean API design for all operations

### API Endpoints

#### Menu
- `GET /api/menu` - Retrieve all menu items

#### Orders
- `GET /api/orders` - Get all orders (admin)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

## Customization

### Adding Menu Items
Edit `/data/menu.json` to add, remove, or modify menu items:

```json
{
  "category": [
    {
      "id": "unique_id",
      "name": "Item Name",
      "description": "Item description",
      "price": 12.99,
      "category": "category_name",
      "available": true
    }
  ]
}
```

### Styling
Modify `/public/style.css` to customize:
- Colors and branding
- Layout and spacing
- Responsive breakpoints
- Component styling

## Development

### Project Structure
```
Digital-Menu/
├── server.js              # Express server
├── package.json           # Dependencies and scripts
├── data/
│   ├── menu.json         # Menu items data
│   └── orders.json       # Orders storage
├── public/
│   ├── index.html        # Customer interface
│   ├── admin.html        # Admin panel
│   ├── style.css         # Styling
│   ├── script.js         # Customer interface logic
│   └── admin.js          # Admin panel logic
└── README.md
```

### Future Enhancements
- Database integration (PostgreSQL, MongoDB)
- User authentication and roles
- Payment processing integration
- Email/SMS notifications
- Inventory management
- Multi-language support
- Print receipts functionality

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
MIT License - feel free to use this project for personal or commercial purposes.
