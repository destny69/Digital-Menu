// Digital Menu - Customer Interface
class DigitalMenu {
    constructor() {
        this.menu = {};
        this.cart = [];
        this.currentCategory = 'all';
        this.init();
    }

    async init() {
        await this.loadMenu();
        this.setupEventListeners();
        this.renderMenu();
        this.updateCartDisplay();
    }

    async loadMenu() {
        try {
            const response = await fetch('/api/menu');
            this.menu = await response.json();
        } catch (error) {
            console.error('Error loading menu:', error);
            this.showError('Failed to load menu. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectCategory(e.target.dataset.category);
            });
        });

        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', () => {
            this.showOrderModal();
        });

        // Order form
        document.getElementById('order-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitOrder();
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModals();
            });
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });
    }

    selectCategory(category) {
        this.currentCategory = category;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.renderMenu();
    }

    renderMenu() {
        const menuContainer = document.getElementById('menu-items');
        menuContainer.innerHTML = '';

        let items = [];
        
        if (this.currentCategory === 'all') {
            Object.values(this.menu).forEach(categoryItems => {
                items = items.concat(categoryItems);
            });
        } else {
            items = this.menu[this.currentCategory] || [];
        }

        items.forEach(item => {
            if (item.available) {
                const itemElement = this.createMenuItemElement(item);
                menuContainer.appendChild(itemElement);
            }
        });
    }

    createMenuItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="menu-item-footer">
                <span class="price">$${item.price.toFixed(2)}</span>
                <button class="btn btn-primary" onclick="digitalMenu.addToCart('${item.id}')">
                    Add to Cart
                </button>
            </div>
        `;
        return itemDiv;
    }

    addToCart(itemId) {
        const item = this.findMenuItem(itemId);
        if (!item) return;

        const existingItem = this.cart.find(cartItem => cartItem.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...item,
                quantity: 1
            });
        }
        
        this.updateCartDisplay();
        this.showAddedToCartFeedback(item.name);
    }

    removeFromCart(itemId) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            this.cart.splice(itemIndex, 1);
            this.updateCartDisplay();
        }
    }

    updateCartQuantity(itemId, change) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(itemId);
        } else {
            this.updateCartDisplay();
        }
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p style="color: #666; font-style: italic;">Your cart is empty</p>';
            cartTotal.textContent = 'Total: $0.00';
            checkoutBtn.disabled = true;
            return;
        }

        cartItems.innerHTML = '';
        let total = 0;

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="digitalMenu.updateCartQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="digitalMenu.updateCartQuantity('${item.id}', 1)">+</button>
                    <span style="margin-left: 10px;">$${itemTotal.toFixed(2)}</span>
                </div>
            `;
            cartItems.appendChild(cartItemDiv);
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        checkoutBtn.disabled = false;
    }

    showOrderModal() {
        const modal = document.getElementById('order-modal');
        const orderSummary = document.getElementById('order-summary');
        
        let total = 0;
        let summaryHTML = '<h3>Order Summary:</h3><div class="order-items">';
        
        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            summaryHTML += `
                <div class="order-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });
        
        summaryHTML += `</div><div class="order-total">Total: $${total.toFixed(2)}</div>`;
        orderSummary.innerHTML = summaryHTML;
        
        modal.style.display = 'block';
    }

    async submitOrder() {
        const customerName = document.getElementById('customer-name').value.trim();
        
        if (!customerName) {
            alert('Please enter your name');
            return;
        }

        const orderData = {
            customerName,
            items: this.cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            totalAmount: this.cart.reduce((total, item) => total + (item.price * item.quantity), 0)
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccessModal(result.order);
                this.clearCart();
                this.closeModals();
            } else {
                alert('Failed to place order: ' + result.error);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    }

    showSuccessModal(order) {
        const modal = document.getElementById('success-modal');
        const successMessage = document.getElementById('success-message');
        
        successMessage.innerHTML = `
            <p><strong>Order #${order.orderNumber}</strong></p>
            <p>Thank you, ${order.customerName}!</p>
            <p>Your order total: $${order.totalAmount.toFixed(2)}</p>
            <p>Status: <span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span></p>
            <p><small>Order ID: ${order.id}</small></p>
        `;
        
        modal.style.display = 'block';
    }

    clearCart() {
        this.cart = [];
        this.updateCartDisplay();
        document.getElementById('customer-name').value = '';
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    findMenuItem(itemId) {
        for (const category in this.menu) {
            const item = this.menu[category].find(item => item.id === itemId);
            if (item) return item;
        }
        return null;
    }

    showAddedToCartFeedback(itemName) {
        // Simple feedback - could be enhanced with toast notifications
        const checkoutBtn = document.getElementById('checkout-btn');
        const originalText = checkoutBtn.textContent;
        checkoutBtn.textContent = `Added ${itemName}!`;
        checkoutBtn.style.background = '#28a745';
        
        setTimeout(() => {
            checkoutBtn.textContent = originalText;
            checkoutBtn.style.background = '';
        }, 1000);
    }

    showError(message) {
        alert(message); // Could be enhanced with better error display
    }
}

// Initialize the digital menu when the page loads
const digitalMenu = new DigitalMenu();