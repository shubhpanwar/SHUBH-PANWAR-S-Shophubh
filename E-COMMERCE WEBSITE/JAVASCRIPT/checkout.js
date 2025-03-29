/**
 * Enhanced Checkout System
 * Handles multi-step checkout process with validation and payment processing
 */

class CheckoutManager {
    constructor() {
        // Step tracking
        this.currentStep = 1;
        this.totalSteps = 3;
        
        // Form data
        this.shippingData = {};
        this.paymentData = {};
        
        // DOM elements
        this.checkoutSteps = document.querySelectorAll('.checkout-step');
        this.stepContents = document.querySelectorAll('.step-content');
        this.nextButtons = document.querySelectorAll('.next-step');
        this.prevButtons = document.querySelectorAll('.prev-step');
        this.editButtons = document.querySelectorAll('.edit-step');
        this.placeOrderBtn = document.getElementById('place-order-btn');
        
        this.shippingForm = document.getElementById('shipping-form');
        this.paymentForm = document.getElementById('payment-form');
        
        this.orderItemsContainer = document.getElementById('order-items');
        this.subtotalElem = document.getElementById('checkout-subtotal');
        this.shippingElem = document.getElementById('checkout-shipping');
        this.taxElem = document.getElementById('checkout-tax');
        this.totalElem = document.getElementById('checkout-total');
        
        // Cart data
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the checkout system
     */
    init() {
        // Check if cart is empty
        if (this.cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }
        
        // Check if user is logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            // Save current URL to redirect back after login
            localStorage.setItem('redirectAfterLogin', window.location.href);
            
            // Redirect to login page or show login modal
            showToast('Please login to continue checkout');
            openModal('login');
            return;
        }
        
        // Load saved shipping data if available
        const savedShippingData = JSON.parse(localStorage.getItem('shippingInfo'));
        if (savedShippingData) {
            this.populateShippingForm(savedShippingData);
        }
        
        // Render order summary
        this.renderOrderSummary();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    /**
     * Setup event listeners for checkout process
     */
    setupEventListeners() {
        // Next step buttons
        if (this.nextButtons) {
            this.nextButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const nextStep = parseInt(button.getAttribute('data-next'));
                    this.validateAndProceed(nextStep);
                });
            });
        }
        
        // Previous step buttons
        if (this.prevButtons) {
            this.prevButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const prevStep = parseInt(button.getAttribute('data-prev'));
                    this.goToStep(prevStep);
                });
            });
        }
        
        // Edit step buttons
        if (this.editButtons) {
            this.editButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const editStep = parseInt(button.getAttribute('data-step'));
                    this.goToStep(editStep);
                });
            });
        }
        
        // Place order button
        if (this.placeOrderBtn) {
            this.placeOrderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.placeOrder();
            });
        }
        
        // Save shipping info checkbox
        const saveInfoCheckbox = document.getElementById('save-info');
        if (saveInfoCheckbox) {
            saveInfoCheckbox.addEventListener('change', () => {
                localStorage.setItem('saveShippingInfo', saveInfoCheckbox.checked);
            });
            
            // Set initial state
            saveInfoCheckbox.checked = localStorage.getItem('saveShippingInfo') === 'true';
        }
        
        // Payment method selection
        const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
        const creditCardFields = document.getElementById('credit-card-fields');
        
        if (paymentMethods && creditCardFields) {
            paymentMethods.forEach(method => {
                method.addEventListener('change', () => {
                    if (method.value === 'credit-card') {
                        creditCardFields.style.display = 'block';
                    } else {
                        creditCardFields.style.display = 'none';
                    }
                });
            });
        }
    }
    
    /**
     * Validate current step and proceed to next if valid
     * @param {number} nextStep - The next step to proceed to
     */
    validateAndProceed(nextStep) {
        // Validate current step
        if (this.currentStep === 1) {
            if (this.validateShippingInfo()) {
                this.saveShippingInfo();
                this.goToStep(nextStep);
            }
        } else if (this.currentStep === 2) {
            if (this.validatePaymentInfo()) {
                this.savePaymentInfo();
                this.goToStep(nextStep);
                this.updateReviewInfo();
            }
        }
    }
    
    /**
     * Navigate to a specific step
     * @param {number} step - The step to navigate to
     */
    goToStep(step) {
        this.checkoutSteps.forEach(item => {
            const stepNum = parseInt(item.getAttribute('data-step'));
            
            if (stepNum === step) {
                item.classList.add('active');
            } else if (stepNum < step) {
                item.classList.remove('active');
                item.classList.add('completed');
            } else {
                item.classList.remove('active', 'completed');
            }
        });
        
        this.stepContents.forEach(content => {
            content.classList.remove('active');
        });
        
        document.getElementById(`step-${step}`).classList.add('active');
        
        this.currentStep = step;
        
        // Scroll to top of checkout form
        const checkoutForm = document.querySelector('.checkout-form');
        if (checkoutForm) {
            checkoutForm.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    /**
     * Validate shipping information
     * @returns {boolean} - Whether the shipping information is valid
     */
    validateShippingInfo() {
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        const zip = document.getElementById('zip').value.trim();
        const country = document.getElementById('country').value;
        
        // Reset previous error messages
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.remove());
        
        let isValid = true;
        
        // Validate first name
        if (!firstName) {
            this.showError('first-name', 'First name is required');
            isValid = false;
        }
        
        // Validate last name
        if (!lastName) {
            this.showError('last-name', 'Last name is required');
            isValid = false;
        }
        
        // Validate email
        if (!email) {
            this.showError('email', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate phone (optional but must be valid if provided)
        if (phone && !this.isValidPhone(phone)) {
            this.showError('phone', 'Please enter a valid phone number');
            isValid = false;
        }
        
        // Validate address
        if (!address) {
            this.showError('address', 'Address is required');
            isValid = false;
        }
        
        // Validate city
        if (!city) {
            this.showError('city', 'City is required');
            isValid = false;
        }
        
        // Validate state
        if (!state) {
            this.showError('state', 'State/Province is required');
            isValid = false;
        }
        
        // Validate zip
        if (!zip) {
            this.showError('zip', 'Zip/Postal code is required');
            isValid = false;
        }
        
        // Validate country
        if (!country) {
            this.showError('country', 'Country is required');
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Validate payment information
     * @returns {boolean} - Whether the payment information is valid
     */
    validatePaymentInfo() {
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
        
        // Reset previous error messages
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.remove());
        
        let isValid = true;
        
        // Check if payment method is selected
        if (!paymentMethod) {
            showToast('Please select a payment method');
            isValid = false;
            return isValid;
        }
        
        // If credit card is selected, validate card details
        if (paymentMethod.value === 'credit-card') {
            const cardNumber = document.getElementById('card-number').value.trim();
            const cardName = document.getElementById('card-name').value.trim();
            const cardExpiry = document.getElementById('card-expiry').value.trim();
            const cardCvv = document.getElementById('card-cvv').value.trim();
            
            // Validate card number
            if (!cardNumber) {
                this.showError('card-number', 'Card number is required');
                isValid = false;
            } else if (!this.isValidCreditCard(cardNumber)) {
                this.showError('card-number', 'Please enter a valid card number');
                isValid = false;
            }
            
            // Validate card name
            if (!cardName) {
                this.showError('card-name', 'Name on card is required');
                isValid = false;
            }
            
            // Validate card expiry
            if (!cardExpiry) {
                this.showError('card-expiry', 'Expiration date is required');
                isValid = false;
            } else if (!this.isValidExpiry(cardExpiry)) {
                this.showError('card-expiry', 'Please enter a valid expiration date (MM/YY)');
                isValid = false;
            }
            
            // Validate CVV
            if (!cardCvv) {
                this.showError('card-cvv', 'CVV is required');
                isValid = false;
            } else if (!this.isValidCVV(cardCvv)) {
                this.showError('card-cvv', 'Please enter a valid CVV code');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    /**
     * Show error message for a form field
     * @param {string} fieldId - The ID of the field with error
     * @param {string} message - The error message to display
     */
    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerText = message;
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        
        field.classList.add('invalid');
        field.parentNode.appendChild(errorDiv);
    }
    
    /**
     * Save shipping information
     */
    saveShippingInfo() {
        this.shippingData = {
            firstName: document.getElementById('first-name').value.trim(),
            lastName: document.getElementById('last-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value.trim(),
            zip: document.getElementById('zip').value.trim(),
            country: document.getElementById('country').value
        };
        
        // Save to localStorage if checkbox is checked
        if (document.getElementById('save-info') && document.getElementById('save-info').checked) {
            localStorage.setItem('shippingInfo', JSON.stringify(this.shippingData));
        }
    }
    
    /**
     * Save payment information
     */
    savePaymentInfo() {
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        this.paymentData = {
            method: paymentMethod
        };
        
        if (paymentMethod === 'credit-card') {
            this.paymentData.cardNumber = document.getElementById('card-number').value.trim();
            this.paymentData.cardName = document.getElementById('card-name').value.trim();
            this.paymentData.cardExpiry = document.getElementById('card-expiry').value.trim();
            this.paymentData.cardCvv = document.getElementById('card-cvv').value.trim();
        }
    }
    
    /**
     * Populate shipping form with saved data
     * @param {Object} data - The shipping data to populate the form with
     */
    populateShippingForm(data) {
        if (!data) return;
        
        if (data.firstName) document.getElementById('first-name').value = data.firstName;
        if (data.lastName) document.getElementById('last-name').value = data.lastName;
        if (data.email) document.getElementById('email').value = data.email;
        if (data.phone) document.getElementById('phone').value = data.phone;
        if (data.address) document.getElementById('address').value = data.address;
        if (data.city) document.getElementById('city').value = data.city;
        if (data.state) document.getElementById('state').value = data.state;
        if (data.zip) document.getElementById('zip').value = data.zip;
        if (data.country) document.getElementById('country').value = data.country;
    }
    
    /**
     * Update review information on step 3
     */
    updateReviewInfo() {
        // Update shipping info in review
        const shippingInfoElement = document.getElementById('review-shipping-info');
        if (shippingInfoElement) {
            shippingInfoElement.innerHTML = `
                <p><strong>${this.shippingData.firstName} ${this.shippingData.lastName}</strong></p>
                <p>${this.shippingData.address}</p>
                <p>${this.shippingData.city}, ${this.shippingData.state} ${this.shippingData.zip}</p>
                <p>${this.shippingData.country}</p>
                <p>Email: ${this.shippingData.email}</p>
                <p>Phone: ${this.shippingData.phone}</p>
            `;
        }
        
        // Update payment info in review
        const paymentInfoElement = document.getElementById('review-payment-info');
        if (paymentInfoElement) {
            let paymentHtml = '';
            
            if (this.paymentData.method === 'credit-card') {
                const lastFour = this.paymentData.cardNumber.slice(-4);
                paymentHtml = `
                    <p>Credit Card ending in ${lastFour}</p>
                    <p>Name: ${this.paymentData.cardName}</p>
                    <p>Expires: ${this.paymentData.cardExpiry}</p>
                `;
            } else if (this.paymentData.method === 'paypal') {
                paymentHtml = '<p>PayPal</p>';
            } else if (this.paymentData.method === 'apple-pay') {
                paymentHtml = '<p>Apple Pay</p>';
            }
            
            paymentInfoElement.innerHTML = paymentHtml;
        }
    }
    
    /**
     * Render order summary with cart items
     */
    renderOrderSummary() {
        if (!this.orderItemsContainer) return;
        
        let orderItemsHtml = '';
        
        this.cart.forEach(item => {
            orderItemsHtml += `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-item-details">
                        <h4 class="order-item-title">${item.name}</h4>
                        <div class="item-price-qty">₹${item.price.toFixed(2)} x ${item.quantity}</div>
                    </div>
                    <div class="order-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        });
        
        this.orderItemsContainer.innerHTML = orderItemsHtml;
        
        // Update totals
        this.updateOrderTotals();
    }
    
    /**
     * Update order totals in the summary
     */
    updateOrderTotals() {
        const subtotal = this.calculateSubtotal();
        const shipping = this.calculateShipping(subtotal);
        const tax = this.calculateTax(subtotal);
        const total = subtotal + shipping + tax;
        
        if (this.subtotalElem) this.subtotalElem.textContent = `₹${subtotal.toFixed(2)}`;
        if (this.shippingElem) this.shippingElem.textContent = shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`;
        if (this.taxElem) this.taxElem.textContent = `₹${tax.toFixed(2)}`;
        if (this.totalElem) this.totalElem.textContent = `₹${total.toFixed(2)}`;
    }
    
    /**
     * Calculate subtotal from cart items
     * @returns {number} - The subtotal amount
     */
    calculateSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    /**
     * Calculate shipping cost based on order subtotal
     * @param {number} subtotal - The order subtotal
     * @returns {number} - The shipping cost
     */
    calculateShipping(subtotal) {
        // Free shipping for orders over ₹100
        return subtotal > 100 ? 0 : 10;
    }
    
    /**
     * Calculate tax amount based on subtotal
     * @param {number} subtotal - The order subtotal
     * @returns {number} - The tax amount
     */
    calculateTax(subtotal) {
        return subtotal * 0.1; // 10% tax
    }
    
    /**
     * Place the order
     */
    placeOrder() {
        // Show loading state
        this.placeOrderBtn.disabled = true;
        this.placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Simulate processing order (in a real application, this would be an API call)
        setTimeout(() => {
            // Create order object
            const subtotal = this.calculateSubtotal();
            const shipping = this.calculateShipping(subtotal);
            const tax = this.calculateTax(subtotal);
            const total = subtotal + shipping + tax;
            
            const order = {
                id: Date.now(),
                date: new Date().toISOString(),
                items: this.cart,
                shipping: this.shippingData,
                payment: {
                    method: this.paymentData.method,
                    // Don't store full card details in a real application
                    ...(this.paymentData.method === 'credit-card' && {
                        cardLastFour: this.paymentData.cardNumber.slice(-4)
                    })
                },
                subtotal: subtotal,
                shipping: shipping,
                tax: tax,
                total: total,
                status: 'processing'
            };
            
            // Save order to localStorage
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.setItem('currentOrder', JSON.stringify(order));
            
            // Clear cart
            localStorage.setItem('cart', JSON.stringify([]));
            
            // Redirect to order confirmation page
            window.location.href = 'order-confirmation.html';
        }, 2000); // Simulate 2 second processing time
    }
    
    // Utility validation methods
    
    /**
     * Validate email format
     * @param {string} email - The email to validate
     * @returns {boolean} - Whether the email is valid
     */
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    /**
     * Validate phone number format
     * @param {string} phone - The phone number to validate
     * @returns {boolean} - Whether the phone number is valid
     */
    isValidPhone(phone) {
        const regex = /^[\d\s\-\(\)]+$/;
        return regex.test(phone) && phone.replace(/[\s\-\(\)]/g, '').length >= 7;
    }
    
    /**
     * Validate credit card number using Luhn algorithm
     * @param {string} cardNumber - The card number to validate
     * @returns {boolean} - Whether the card number is valid
     */
    isValidCreditCard(cardNumber) {
        // Remove spaces and dashes
        const digits = cardNumber.replace(/[\s-]/g, '');
        
        // Check if contains only digits
        if (!/^\d+$/.test(digits)) return false;
        
        // Check length (most cards are 13-19 digits)
        if (digits.length < 13 || digits.length > 19) return false;
        
        // Luhn algorithm
        let sum = 0;
        let shouldDouble = false;
        
        // Loop from right to left
        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits.charAt(i));
            
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return sum % 10 === 0;
    }
    
    /**
     * Validate card expiration date format (MM/YY)
     * @param {string} expiry - The expiry date to validate
     * @returns {boolean} - Whether the expiry date is valid
     */
    isValidExpiry(expiry) {
        // Check format MM/YY
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
        
        const [month, year] = expiry.split('/').map(part => parseInt(part, 10));
        
        // Check month is 1-12
        if (month < 1 || month > 12) return false;
        
        // Get current date
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
        
        // Check not expired
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate CVV code
     * @param {string} cvv - The CVV code to validate
     * @returns {boolean} - Whether the CVV code is valid
     */
    isValidCVV(cvv) {
        // CVV should be 3-4 digits
        return /^\d{3,4}$/.test(cvv);
    }
}

// Initialize checkout manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on checkout page
    if (document.querySelector('.checkout-container')) {
        window.checkoutManager = new CheckoutManager();
    }
}); 