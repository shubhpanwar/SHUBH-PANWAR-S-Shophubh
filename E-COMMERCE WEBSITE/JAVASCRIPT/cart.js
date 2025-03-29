
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.cartContainer = document.querySelector('.cart-items');
        this.cartSummary = document.querySelector('.cart-summary');
        this.emptyCartMessage = document.querySelector('.empty-cart-message');
        this.cartItemCount = document.querySelector('.cart-count');
        this.subtotalElement = document.querySelector('.subtotal-amount');
        this.taxElement = document.querySelector('.tax-amount');
        this.shippingElement = document.querySelector('.shipping-amount');
        this.totalElement = document.querySelector('.total-amount');
        this.cartActions = document.querySelector('.cart-actions');
        this.itemCount = this.getItemCount();
        
        this.init();
    }
    
    init() {
        this.renderCart();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        if (this.cartContainer) {
            this.cartContainer.addEventListener('click', (e) => {
                const target = e.target;
                
                if (target.classList.contains('remove-item')) {
                    const itemId = target.closest('.cart-item').dataset.id;
                    this.removeItem(itemId);
                } else if (target.classList.contains('quantity-decrease')) {
                    const itemId = target.closest('.cart-item').dataset.id;
                    this.decreaseQuantity(itemId);
                } else if (target.classList.contains('quantity-increase')) {
                    const itemId = target.closest('.cart-item').dataset.id;
                    this.increaseQuantity(itemId);
                }
            });
        }
        
        const clearCartBtn = document.querySelector('.clear-cart-btn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                this.clearCart();
            });
        }
        
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }
        
        const promoForm = document.querySelector('.promo-form');
        if (promoForm) {
            promoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.applyPromoCode();
            });
        }
    }
    
    getItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    renderCart() {
        if (this.cart.length === 0) {
            this.renderEmptyCart();
            return;
        }
        
        if (this.emptyCartMessage) {
            this.emptyCartMessage.style.display = 'none';
        }
        
        if (this.cartContainer) {
            this.cartContainer.style.display = 'block';
        }
        
        if (this.cartSummary) {
            this.cartSummary.style.display = 'block';
        }
        
        if (this.cartActions) {
            this.cartActions.style.display = 'flex';
        }
        
        this.renderCartItems();
        this.updateCartSummary();
    }
    
    renderEmptyCart() {
        if (this.cartContainer) {
            this.cartContainer.style.display = 'none';
        }
        
        if (this.cartSummary) {
            this.cartSummary.style.display = 'none';
        }
        
        if (this.cartActions) {
            this.cartActions.style.display = 'none';
        }
        
        if (this.emptyCartMessage) {
            this.emptyCartMessage.style.display = 'block';
            this.emptyCartMessage.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
        }
    }
    
    renderCartItems() {
        if (!this.cartContainer) return;
        
        let html = '';
        
        this.cart.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            const sizeInfo = item.size ? `<div class="item-size">Size: ${item.size}</div>` : '';
            const colorInfo = item.color ? `<div class="item-color">Color: <span class="color-dot" style="background-color: ${item.color}"></span> ${item.color}</div>` : '';
            
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        ${sizeInfo}
                        ${colorInfo}
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                        <div class="item-actions">
                            <button class="remove-item">
                                <i class="fas fa-trash-alt"></i> Remove
                            </button>
                            <div class="save-for-later">
                                <i class="far fa-heart"></i> Save for later
                            </div>
                        </div>
                    </div>
                    <div class="item-quantity">
                        <div class="quantity-control">
                            <button class="quantity-decrease">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99">
                            <button class="quantity-increase">+</button>
                        </div>
                    </div>
                    <div class="item-subtotal">
                        $${itemSubtotal.toFixed(2)}
                    </div>
                </div>
            `;
        });
        
        this.cartContainer.innerHTML = html;
        
        this.setupQuantityInputs();
    }
    
    setupQuantityInputs() {
        const quantityInputs = document.querySelectorAll('.quantity-input');
        
        quantityInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const itemId = e.target.closest('.cart-item').dataset.id;
                let quantity = parseInt(e.target.value);
                
                if (isNaN(quantity) || quantity < 1) {
                    quantity = 1;
                    e.target.value = 1;
                }
                
                this.updateItemQuantity(itemId, quantity);
            });
        });
    }
    
    updateCartSummary() {
        const subtotal = this.calculateSubtotal();
        const shipping = this.calculateShipping(subtotal);
        const tax = this.calculateTax(subtotal);
        const total = subtotal + shipping + tax;
        
        if (this.subtotalElement) {
            this.subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        }
        
        if (this.shippingElement) {
            this.shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        }
        
        if (this.taxElement) {
            this.taxElement.textContent = `$${tax.toFixed(2)}`;
        }
        
        if (this.totalElement) {
            this.totalElement.textContent = `$${total.toFixed(2)}`;
        }
        
        if (this.cartItemCount) {
            const itemCount = this.getItemCount();
            this.cartItemCount.textContent = itemCount.toString();
            this.cartItemCount.style.display = itemCount > 0 ? 'flex' : 'none';
        }
    }
    
    calculateSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    calculateShipping(subtotal) {
        return subtotal >= 100 ? 0 : 15;
    }
    
    calculateTax(subtotal) {
        return subtotal * 0.1;
    }
    
    addItem(item) {
        const existingItemIndex = this.cart.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingItemIndex !== -1) {
            this.cart[existingItemIndex].quantity += item.quantity;
        } else {
            this.cart.push(item);
        }
        
        this.saveCart();
        this.renderCart();
        this.showToast(`${item.name} added to cart.`);
    }
    
    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.renderCart();
        this.showToast('Item removed from cart.');
    }
    
    increaseQuantity(itemId) {
        const item = this.cart.find(item => item.id === itemId);
        if (!item) return;
        
        item.quantity += 1;
        this.saveCart();
        this.renderCart();
    }
    
    decreaseQuantity(itemId) {
        const item = this.cart.find(item => item.id === itemId);
        if (!item) return;
        
        if (item.quantity > 1) {
            item.quantity -= 1;
            this.saveCart();
            this.renderCart();
        } else {
            this.removeItem(itemId);
        }
    }
    
    updateItemQuantity(itemId, quantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (!item) return;
        
        item.quantity = quantity;
        this.saveCart();
        this.renderCart();
    }
    
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.renderCart();
        this.showToast('Cart has been cleared.');
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        document.dispatchEvent(new CustomEvent('cartUpdated'));
    }
    
    applyPromoCode() {
        const promoInput = document.querySelector('.promo-input');
        
        if (!promoInput || !promoInput.value) {
            this.showToast('Please enter a promo code.', 'error');
            return;
        }
        
        const promoCode = promoInput.value.toUpperCase();
        
        if (promoCode === 'DISCOUNT10') {
            this.applyDiscount(10);
            this.showToast('Promo code applied! 10% off your order.');
        } else if (promoCode === 'FREESHIP') {
            this.applyFreeShipping();
            this.showToast('Promo code applied! Free shipping on your order.');
        } else {
            this.showToast('Invalid promo code.', 'error');
        }
    }
    
    applyDiscount(percentage) {
        if (!this.discountApplied) {
            this.discountPercentage = percentage;
            this.discountApplied = true;
            this.updateCartSummary();
        }
    }
    
    applyFreeShipping() {
        if (!this.freeShippingApplied) {
            this.freeShippingApplied = true;
            this.updateCartSummary();
        }
    }
    
    checkout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty.', 'error');
            return;
        }
        
        const checkoutData = {
            items: this.cart,
            subtotal: this.calculateSubtotal(),
            shipping: this.calculateShipping(this.calculateSubtotal()),
            tax: this.calculateTax(this.calculateSubtotal()),
            total: this.calculateSubtotal() + this.calculateShipping(this.calculateSubtotal()) + this.calculateTax(this.calculateSubtotal())
        };
        
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        window.location.href = 'checkout.html';
    }
    
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.cart-container') || document.querySelector('.mini-cart')) {
        window.shoppingCart = new ShoppingCart();
    }
}); 