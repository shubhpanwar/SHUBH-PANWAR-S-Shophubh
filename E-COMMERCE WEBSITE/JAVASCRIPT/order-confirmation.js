class OrderConfirmation {
    constructor() {
        this.order = JSON.parse(localStorage.getItem('currentOrder'));
        
        this.orderNumberElem = document.getElementById('order-number');
        this.orderDateElem = document.getElementById('order-date');
        this.orderStatusElem = document.getElementById('order-status');
        this.orderItemsContainer = document.getElementById('order-items');
        this.shippingInfoElem = document.getElementById('shipping-info');
        this.paymentInfoElem = document.getElementById('payment-info');
        this.subtotalElem = document.getElementById('order-subtotal');
        this.shippingElem = document.getElementById('order-shipping');
        this.taxElem = document.getElementById('order-tax');
        this.totalElem = document.getElementById('order-total');
        this.trackOrderBtn = document.getElementById('track-order-btn');
        
        this.init();
    }
    
    init() {
        if (!this.order) {
            window.location.href = 'index.html';
            return;
        }
        
        this.renderOrderDetails();
        
        this.setupEventListeners();
        
        this.updateDeliveryEstimate();
    }
    
    setupEventListeners() {
        if (this.trackOrderBtn) {
            this.trackOrderBtn.addEventListener('click', () => {
                showToast('Order tracking feature coming soon!');
            });
        }
        
        const continueShoppingBtn = document.getElementById('continue-shopping-btn');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', () => {
                window.location.href = 'products.html';
            });
        }
    }
    
    renderOrderDetails() {
        if (this.orderNumberElem) this.orderNumberElem.textContent = `#${this.order.id}`;
        if (this.orderDateElem) this.orderDateElem.textContent = this.formatDate(this.order.date);
        if (this.orderStatusElem) {
            this.orderStatusElem.textContent = this.capitalizeFirstLetter(this.order.status);
            this.orderStatusElem.className = `order-status status-${this.order.status}`;
        }
        
        this.renderOrderItems();
        
        if (this.shippingInfoElem) {
            const shipping = this.order.shipping;
            this.shippingInfoElem.innerHTML = `
                <p><strong>${shipping.firstName} ${shipping.lastName}</strong></p>
                <p>${shipping.address}</p>
                <p>${shipping.city}, ${shipping.state} ${shipping.zip}</p>
                <p>${shipping.country}</p>
                <p>Email: ${shipping.email}</p>
                ${shipping.phone ? `<p>Phone: ${shipping.phone}</p>` : ''}
            `;
        }
        
        if (this.paymentInfoElem) {
            const payment = this.order.payment;
            
            let paymentMethod = '';
            if (payment.method === 'credit-card') {
                paymentMethod = `Credit Card ending in ${payment.cardLastFour}`;
            } else if (payment.method === 'paypal') {
                paymentMethod = 'PayPal';
            } else if (payment.method === 'apple-pay') {
                paymentMethod = 'Apple Pay';
            }
            
            this.paymentInfoElem.innerHTML = `<p>${paymentMethod}</p>`;
        }
        
        if (this.subtotalElem) this.subtotalElem.textContent = `$${this.order.subtotal.toFixed(2)}`;
        if (this.shippingElem) this.shippingElem.textContent = this.order.shipping === 0 ? 'Free' : `$${this.order.shipping.toFixed(2)}`;
        if (this.taxElem) this.taxElem.textContent = `$${this.order.tax.toFixed(2)}`;
        if (this.totalElem) this.totalElem.textContent = `$${this.order.total.toFixed(2)}`;
    }
    
    renderOrderItems() {
        if (!this.orderItemsContainer) return;
        
        let orderItemsHtml = '';
        
        this.order.items.forEach(item => {
            orderItemsHtml += `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-item-details">
                        <h4 class="order-item-title">${item.name}</h4>
                        <div class="item-price-qty">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    </div>
                    <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        });
        
        this.orderItemsContainer.innerHTML = orderItemsHtml;
    }
    
    updateDeliveryEstimate() {
        const deliveryDateElem = document.getElementById('delivery-date');
        if (!deliveryDateElem) return;
        
        const orderDate = new Date(this.order.date);
        const minDeliveryDate = this.addBusinessDays(orderDate, 5);
        const maxDeliveryDate = this.addBusinessDays(orderDate, 7);
        
        deliveryDateElem.textContent = `${this.formatDate(minDeliveryDate)} - ${this.formatDate(maxDeliveryDate)}`;
    }
    
    addBusinessDays(date, days) {
        const result = new Date(date);
        let businessDaysAdded = 0;
        
        while (businessDaysAdded < days) {
            result.setDate(result.getDate() + 1);
            
            const dayOfWeek = result.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                businessDaysAdded++;
            }
        }
        
        return result;
    }
    
    formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }
    
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.order-confirmation-container')) {
        window.orderConfirmation = new OrderConfirmation();
    }
}); 