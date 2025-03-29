// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// DOM elements
const featuredProductsContainer = document.getElementById('featured-products');
const trendingProductsContainer = document.getElementById('trending-products');
const cartCount = document.querySelector('.cart-count');
const loginBtn = document.querySelector('.login-btn');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');
const searchBar = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-bar button');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const closeModalBtns = document.querySelectorAll('.close-modal');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');

// Load initial products
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadFeaturedProducts();
    loadTrendingProducts();
    updateLoginState();
    setupEventListeners();
});

// Load featured products
function loadFeaturedProducts() {
    if (featuredProductsContainer) {
        const featuredProducts = getFeaturedProducts();
        renderProducts(featuredProductsContainer, featuredProducts);
    }
}

// Load trending products
function loadTrendingProducts() {
    if (trendingProductsContainer) {
        const trendingProducts = getTrendingProducts();
        renderProducts(trendingProductsContainer, trendingProducts);
    }
}

// Render products to container
function renderProducts(container, products) {
    let html = '';
    
    products.forEach(product => {
        html += `
            <div class="product-card">
                <div class="product-img">
                    <img src="${product.images[0]}" alt="${product.name}">
                    <div class="product-labels">
                        ${product.isNew ? '<span class="product-label new">New</span>' : ''}
                        ${product.isSale ? '<span class="product-label sale">Sale</span>' : ''}
                    </div>
                    <div class="product-actions">
                        <a href="#" class="action-btn add-to-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                        </a>
                        <a href="#" class="action-btn add-to-wishlist" data-id="${product.id}">
                            <i class="fas fa-heart"></i>
                        </a>
                        <a href="../HTML/product-detail.html?id=${product.id}" class="action-btn view-product">
                            <i class="fas fa-eye"></i>
                        </a>
                    </div>
                </div>
                <div class="product-info">
                    <h3><a href="../HTML/product-detail.html?id=${product.id}">${product.name}</a></h3>
                    <div class="product-category">${product.category}</div>
                    <div class="product-price">
                        <span class="current-price">₹${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">₹${product.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        <div class="stars">
                            ${getStarRating(product.rating)}
                        </div>
                        <div class="rating-count">(${product.reviewCount})</div>
                    </div>
                    <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Add event listeners to the add to cart buttons
    const addToCartBtns = container.querySelectorAll('.add-to-cart, .add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Generate star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHtml = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// Add to cart function
function addToCart(productId) {
    const product = getProductById(productId);
    
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1
        });
    }
    
    // Save cart to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showToast(`${product.name} added to cart!`);
}

// Update cart count
function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Show toast notification
function showToast(message) {
    // Check if toast container exists, if not create it
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Update login state
function updateLoginState() {
    if (loginBtn) {
        if (currentUser) {
            loginBtn.textContent = 'My Account';
            loginBtn.href = 'account.html';
        } else {
            loginBtn.textContent = 'Login';
            loginBtn.href = '#';
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Menu toggle for mobile
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Search button
    if (searchBtn && searchBar) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (searchBar.value.trim()) {
                window.location.href = `products.html?search=${encodeURIComponent(searchBar.value.trim())}`;
            }
        });
        
        // Search on Enter key
        searchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && searchBar.value.trim()) {
                window.location.href = `products.html?search=${encodeURIComponent(searchBar.value.trim())}`;
            }
        });
    }
    
    // Login button
    if (loginBtn && !currentUser) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('login');
        });
    }
    
    // Close modal buttons
    if (closeModalBtns) {
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                closeAllModals();
            });
        });
    }
    
    // Show register modal
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('register');
        });
    }
    
    // Show login modal
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('login');
        });
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real app, you would validate and send to server
            // Here we'll just simulate a successful login
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simulate login
            const user = {
                id: 1,
                name: 'User',
                email: email
            };
            
            // Save user to localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Update UI
            updateLoginState();
            
            // Close modal
            closeAllModals();
            
            // Show success message
            showToast('Login successful!');
        });
    }
    
    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real app, you would validate and send to server
            // Here we'll just simulate a successful registration
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Basic validation
            if (password !== confirmPassword) {
                showToast('Passwords do not match!');
                return;
            }
            
            // Simulate registration
            const user = {
                id: 1,
                name: fullname,
                email: email
            };
            
            // Save user to localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Update UI
            updateLoginState();
            
            // Close modal
            closeAllModals();
            
            // Show success message
            showToast('Registration successful!');
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal || e.target === registerModal) {
            closeAllModals();
        }
    });
}

// Open modal
function openModal(type) {
    closeAllModals();
    
    if (type === 'login' && loginModal) {
        loginModal.classList.add('active');
    } else if (type === 'register' && registerModal) {
        registerModal.classList.add('active');
    }
}

// Close all modals
function closeAllModals() {
    if (loginModal) loginModal.classList.remove('active');
    if (registerModal) registerModal.classList.remove('active');
}

// Add styles for toast
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    .toast-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1200;
    }
    
    .toast {
        background-color: var(--primary);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        margin-top: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .toast.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    @media (max-width: 768px) {
        nav ul.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: white;
            padding: 20px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            z-index: 1000;
        }
        
        nav ul.active li {
            margin: 10px 0;
        }
    }
`;
document.head.appendChild(toastStyle); 