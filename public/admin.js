// Digital Menu - Admin Interface
class AdminPanel {
    constructor() {
        this.orders = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadOrders();
        this.setupEventListeners();
        this.renderOrders();
        this.updateStatistics();
    }

    async loadOrders() {
        try {
            const response = await fetch('/api/orders');
            this.orders = await response.json();
        } catch (error) {
            console.error('Error loading orders:', error);
            this.showError('Failed to load orders. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refresh-orders').addEventListener('click', () => {
            this.refreshOrders();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.status);
            });
        });

        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.refreshOrders();
        }, 30000);
    }

    async refreshOrders() {
        await this.loadOrders();
        this.renderOrders();
        this.updateStatistics();
        this.showRefreshFeedback();
    }

    setFilter(status) {
        this.currentFilter = status;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-status="${status}"]`).classList.add('active');
        
        this.renderOrders();
    }

    renderOrders() {
        const ordersContainer = document.getElementById('orders-list');
        ordersContainer.innerHTML = '';

        let filteredOrders = this.orders;
        
        if (this.currentFilter !== 'all') {
            filteredOrders = this.orders.filter(order => order.status === this.currentFilter);
        }

        // Sort by timestamp (newest first)
        filteredOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (filteredOrders.length === 0) {
            ordersContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <h3>No orders found</h3>
                    <p>No orders match the current filter.</p>
                </div>
            `;
            return;
        }

        filteredOrders.forEach(order => {
            const orderElement = this.createOrderElement(order);
            ordersContainer.appendChild(orderElement);
        });
    }

    createOrderElement(order) {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-card';
        orderDiv.innerHTML = `
            <div class="order-header">
                <div class="order-info">
                    <h4>Order #${order.orderNumber} - ${order.customerName}</h4>
                    <p>${this.formatDate(order.timestamp)}</p>
                </div>
                <span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span>
            </div>
            
            <div class="order-items">
                <h5>Items:</h5>
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-total">Total: $${order.totalAmount.toFixed(2)}</div>
            
            <div class="order-actions">
                ${this.generateActionButtons(order)}
                <button class="btn btn-danger" onclick="adminPanel.deleteOrder('${order.id}')">
                    Delete
                </button>
            </div>
        `;
        return orderDiv;
    }

    generateActionButtons(order) {
        const statusButtons = [];
        
        switch (order.status) {
            case 'pending':
                statusButtons.push(`
                    <button class="btn btn-warning" onclick="adminPanel.updateOrderStatus('${order.id}', 'preparing')">
                        Start Preparing
                    </button>
                `);
                break;
            case 'preparing':
                statusButtons.push(`
                    <button class="btn btn-success" onclick="adminPanel.updateOrderStatus('${order.id}', 'ready')">
                        Mark Ready
                    </button>
                `);
                break;
            case 'ready':
                statusButtons.push(`
                    <button class="btn btn-primary" onclick="adminPanel.updateOrderStatus('${order.id}', 'completed')">
                        Mark Completed
                    </button>
                `);
                break;
            case 'completed':
                // No action buttons for completed orders
                break;
        }
        
        return statusButtons.join('');
    }

    async updateOrderStatus(orderId, newStatus) {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            const result = await response.json();
            
            if (result.success) {
                await this.refreshOrders();
                this.showSuccess(`Order status updated to ${newStatus}`);
            } else {
                this.showError('Failed to update order status: ' + result.error);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            this.showError('Failed to update order status. Please try again.');
        }
    }

    async deleteOrder(orderId) {
        if (!confirm('Are you sure you want to delete this order?')) {
            return;
        }

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            
            if (result.success) {
                await this.refreshOrders();
                this.showSuccess('Order deleted successfully');
            } else {
                this.showError('Failed to delete order: ' + result.error);
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            this.showError('Failed to delete order. Please try again.');
        }
    }

    updateStatistics() {
        const totalOrders = this.orders.length;
        const pendingOrders = this.orders.filter(order => order.status === 'pending').length;
        
        // Calculate today's revenue
        const today = new Date().toDateString();
        const todayRevenue = this.orders
            .filter(order => new Date(order.timestamp).toDateString() === today)
            .reduce((total, order) => total + order.totalAmount, 0);

        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('pending-orders').textContent = pendingOrders;
        document.getElementById('today-revenue').textContent = `$${todayRevenue.toFixed(2)}`;
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) {
            return 'Just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        } else if (diffInMinutes < 1440) { // Less than 24 hours
            const hours = Math.floor(diffInMinutes / 60);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleString();
        }
    }

    showRefreshFeedback() {
        const refreshBtn = document.getElementById('refresh-orders');
        const originalText = refreshBtn.textContent;
        refreshBtn.textContent = 'Refreshed!';
        refreshBtn.style.background = '#28a745';
        
        setTimeout(() => {
            refreshBtn.textContent = originalText;
            refreshBtn.style.background = '';
        }, 1000);
    }

    showSuccess(message) {
        // Simple success feedback - could be enhanced with toast notifications
        alert(message);
    }

    showError(message) {
        alert(message);
    }
}

// Initialize the admin panel when the page loads
const adminPanel = new AdminPanel();