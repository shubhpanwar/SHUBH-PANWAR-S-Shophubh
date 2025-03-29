class UserProfile {
    constructor() {
       
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
        
       
        this.profileContent = document.getElementById('profile-content');
        this.profileNav = document.querySelectorAll('.profile-nav-item');
        this.profileSections = document.querySelectorAll('.profile-section');
        
        
        this.init();
    }
    
    
    init() {
     
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        
        this.renderUserInfo();
        
        // Render order history
        this.renderOrderHistory();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Show first section by default
        this.showSection('account-info');
    }
    
    setupEventListeners() {
        // Navigation items
        if (this.profileNav) {
            this.profileNav.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = item.getAttribute('data-section');
                    this.showSection(section);
                });
            });
        }
        
        // Profile form submission
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile();
            });
        }
        
        // Password form submission
        const passwordForm = document.getElementById('password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updatePassword();
            });
        }
        
        // Log out button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }
    
   
    showSection(sectionId) {
        // Update active navigation item
        this.profileNav.forEach(item => {
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Show selected section, hide others
        this.profileSections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }
    
    
    renderUserInfo() {
        // Set values in profile form
        const nameInput = document.getElementById('profile-name');
        const emailInput = document.getElementById('profile-email');
        const phoneInput = document.getElementById('profile-phone');
        
        if (nameInput) nameInput.value = this.currentUser.name || '';
        if (emailInput) emailInput.value = this.currentUser.email || '';
        if (phoneInput) phoneInput.value = this.currentUser.phone || '';
        
        // Set shipping address if available
        const savedShippingData = JSON.parse(localStorage.getItem('shippingInfo'));
        if (savedShippingData) {
            const addressInput = document.getElementById('profile-address');
            const cityInput = document.getElementById('profile-city');
            const stateInput = document.getElementById('profile-state');
            const zipInput = document.getElementById('profile-zip');
            const countryInput = document.getElementById('profile-country');
            
            if (addressInput) addressInput.value = savedShippingData.address || '';
            if (cityInput) cityInput.value = savedShippingData.city || '';
            if (stateInput) stateInput.value = savedShippingData.state || '';
            if (zipInput) zipInput.value = savedShippingData.zip || '';
            if (countryInput) countryInput.value = savedShippingData.country || '';
        }
        
        // Update user greeting
        const userGreeting = document.getElementById('user-greeting');
        if (userGreeting) {
            userGreeting.textContent = `Hello, ${this.currentUser.name || 'User'}!`;
        }
    }
    
    renderOrderHistory() {
        const orderHistoryContainer = document.getElementById('order-history-list');
        if (!orderHistoryContainer) return;
        
        // Filter orders for current user
        const userOrders = this.orders.filter(order => 
            order.shipping && 
            order.shipping.email === this.currentUser.email
        );
        
        if (userOrders.length === 0) {
            orderHistoryContainer.innerHTML = `
                <div class="no-orders">
                    <p>You haven't placed any orders yet.</p>
                    <a href="products.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            return;
        }
        
        let orderHistoryHtml = '';
        
        // Sort orders by date (newest first)
        userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        userOrders.forEach(order => {
            const orderDate = this.formatDate(order.date);
            const orderStatus = this.getStatusBadge(order.status);
            
            orderHistoryHtml += `
                <div class="order-history-item">
                    <div class="order-history-header">
                        <div class="order-info">
                            <span class="order-date">${orderDate}</span>
                            <span class="order-number">Order #${order.id}</span>
                            ${orderStatus}
                        </div>
                        <div class="order-total">
                            ₹${order.total.toFixed(2)}
                        </div>
                    </div>
                    <div class="order-history-products">
                        ${this.renderOrderItems(order.items)}
                    </div>
                    <div class="order-history-actions">
                        <button class="btn btn-sm btn-outline view-order-details" data-order-id="${order.id}">
                            View Details
                        </button>
                        <button class="btn btn-sm btn-outline reorder" data-order-id="${order.id}">
                            Reorder
                        </button>
                    </div>
                </div>
            `;
        });
        
        orderHistoryContainer.innerHTML = orderHistoryHtml;
        
        // Add event listeners to order action buttons
        const viewDetailsButtons = document.querySelectorAll('.view-order-details');
        const reorderButtons = document.querySelectorAll('.reorder');
        
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', () => {
                const orderId = button.getAttribute('data-order-id');
                this.viewOrderDetails(orderId);
            });
        });
        
        reorderButtons.forEach(button => {
            button.addEventListener('click', () => {
                const orderId = button.getAttribute('data-order-id');
                this.reorder(orderId);
            });
        });
    }
    
  
    renderOrderItems(items) {
        let html = '';
        
        // Limit to first 3 items
        const displayItems = items.slice(0, 3);
        const remainingCount = items.length - 3;
        
        displayItems.forEach(item => {
            html += `
                <div class="order-history-product">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="product-info">
                        <div class="product-name">${item.name}</div>
                        <div class="product-price-qty">₹${item.price.toFixed(2)} x ${item.quantity}</div>
                    </div>
                </div>
            `;
        });
        
        // If there are more items, show a count
        if (remainingCount > 0) {
            html += `
                <div class="order-history-product more-items">
                    +${remainingCount} more item${remainingCount > 1 ? 's' : ''}
                </div>
            `;
        }
        
        return html;
    }
    
   
    updateProfile() {
        const name = document.getElementById('profile-name').value.trim();
        const email = document.getElementById('profile-email').value.trim();
        const phone = document.getElementById('profile-phone').value.trim();
        const address = document.getElementById('profile-address').value.trim();
        const city = document.getElementById('profile-city').value.trim();
        const state = document.getElementById('profile-state').value.trim();
        const zip = document.getElementById('profile-zip').value.trim();
        const country = document.getElementById('profile-country').value;
        
        // Validate required fields
        if (!name || !email) {
            showToast('Name and email are required');
            return;
        }
        
        // Validate email format
        if (!this.isValidEmail(email)) {
            showToast('Please enter a valid email address');
            return;
        }
        
        // Update user data
        this.currentUser.name = name;
        this.currentUser.email = email;
        this.currentUser.phone = phone;
        
        // Save updated user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Update shipping info if address fields are provided
        if (address && city && state && zip && country) {
            const shippingInfo = {
                firstName: name.split(' ')[0],
                lastName: name.split(' ').slice(1).join(' '),
                email: email,
                phone: phone,
                address: address,
                city: city,
                state: state,
                zip: zip,
                country: country
            };
            
            localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
        }
        
        showToast('Profile updated successfully');
    }
    
    
    updatePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate required fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast('All password fields are required');
            return;
        }
        
        // Validate current password (in a real app, this would be verified with the server)
        if (currentPassword !== this.currentUser.password) {
            showToast('Current password is incorrect');
            return;
        }
        
        // Validate new password
        if (newPassword.length < 6) {
            showToast('New password must be at least 6 characters');
            return;
        }
        
        // Validate password match
        if (newPassword !== confirmPassword) {
            showToast('New passwords do not match');
            return;
        }
        
        // Update password
        this.currentUser.password = newPassword;
        
        // Save updated user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Clear password fields
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        showToast('Password updated successfully');
    }
    
    
    viewOrderDetails(orderId) {
        const order = this.orders.find(order => order.id.toString() === orderId);
        if (!order) return;
        
        // Store the order in localStorage
        localStorage.setItem('currentOrder', JSON.stringify(order));
        
        // Redirect to order details page
        window.location.href = 'order-confirmation.html';
    }
   
    reorder(orderId) {
        const order = this.orders.find(order => order.id.toString() === orderId);
        if (!order) return;
        
        // Add items to cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        order.items.forEach(item => {
            // Check if item already exists in cart
            const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
            
            if (existingItemIndex >= 0) {
                // Update quantity if item exists
                cart[existingItemIndex].quantity += item.quantity;
            } else {
                // Add item to cart if it doesn't exist
                cart.push({...item});
            }
        });
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show success message
        showToast('Items added to cart');
        
        // Update cart count in header
        if (window.updateCartCount) {
            window.updateCartCount();
        }
        
        // Redirect to cart page
        window.location.href = 'cart.html';
    }
 
    logout() {
        // Clear current user
        localStorage.removeItem('currentUser');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
    
    
    getStatusBadge(status) {
        const statusMap = {
            'processing': { label: 'Processing', class: 'status-processing' },
            'shipped': { label: 'Shipped', class: 'status-shipped' },
            'delivered': { label: 'Delivered', class: 'status-delivered' },
            'cancelled': { label: 'Cancelled', class: 'status-cancelled' }
        };
        
        const statusInfo = statusMap[status] || { label: 'Unknown', class: '' };
        
        return `<span class="order-status-badge ${statusInfo.class}">${statusInfo.label}</span>`;
    }
    
   
    formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }
    
    
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}

// Initialize user profile when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on user profile page
    if (document.querySelector('.profile-container')) {
        window.userProfile = new UserProfile();
    }
}); 