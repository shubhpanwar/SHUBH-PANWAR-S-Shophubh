class WishlistManager {
    constructor() {
      a
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        

        this.wishlistContainer = document.querySelector('.wishlist-products');
        this.emptyWishlistMessage = document.querySelector('.empty-wishlist-message');
        this.wishlistCount = document.querySelector('.wishlist-count');
        
        
        this.init();
    }
    
    
    init() {

        if (this.wishlistContainer) {
            this.renderWishlist();
            this.setupEventListeners();
        }
        
       
        this.setupGlobalListeners();
        
      
        this.updateWishlistCount();
    }
    
    
    setupEventListeners() {
        if (this.wishlistContainer) {
            this.wishlistContainer.addEventListener('click', (e) => {
                const target = e.target;
                
                if (target.closest('.remove-from-wishlist')) {
                    const productId = target.closest('.product-card').dataset.id;
                    this.removeFromWishlist(productId);
                } else if (target.closest('.add-to-cart-btn')) {
                    const productId = target.closest('.product-card').dataset.id;
                    this.addToCart(productId);
                }
            });
        }
        
        const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');
        if (clearWishlistBtn) {
            clearWishlistBtn.addEventListener('click', () => {
                this.clearWishlist();
            });
        }
    }
   
    setupGlobalListeners() {
       
        document.addEventListener('click', (e) => {
            if (e.target.closest('.wishlist-toggle')) {
                const button = e.target.closest('.wishlist-toggle');
                const productId = button.getAttribute('data-product-id');
                
                if (this.isInWishlist(productId)) {
                    this.removeFromWishlist(productId);
                    button.classList.remove('in-wishlist');
                } else {
                    const productCard = button.closest('.product-card');
                    if (productCard) {
                        const productData = this.getProductDataFromCard(productCard);
                        this.addToWishlist(productData);
                        button.classList.add('in-wishlist');
                    } else if (button.hasAttribute('data-product-data')) {
                       
                        try {
                            const productData = JSON.parse(button.getAttribute('data-product-data'));
                            this.addToWishlist(productData);
                            button.classList.add('in-wishlist');
                        } catch (error) {
                            console.error('Invalid product data', error);
                        }
                    }
                }
            }
        });
    }
    

    renderWishlist() {
        if (this.wishlist.length === 0) {
            this.renderEmptyWishlist();
            return;
        }
        
        if (this.emptyWishlistMessage) {
            this.emptyWishlistMessage.style.display = 'none';
        }
        
        if (this.wishlistContainer) {
            this.wishlistContainer.style.display = 'grid';
            
            let html = '';
            
            this.wishlist.forEach(item => {
                const discount = item.discount ? `<span class="product-label sale">-${item.discount}%</span>` : '';
                
                const originalPrice = item.price;
                const discountedPrice = item.discount ? 
                    originalPrice - (originalPrice * item.discount / 100) : 
                    originalPrice;
                
                const priceHtml = item.discount ?
                    `<div class="product-price">
                        <span class="discounted-price">₹${discountedPrice.toFixed(2)}</span>
                        <span class="original-price">₹${originalPrice.toFixed(2)}</span>
                    </div>` :
                    `<div class="product-price">₹${originalPrice.toFixed(2)}</div>`;
                
                html += `
                    <div class="product-card" data-id="${item.id}">
                        <div class="product-image">
                            <a href="product-detail.html?id=${item.id}">
                                <img src="${item.image}" alt="${item.name}">
                            </a>
                            <div class="product-labels">
                                ${discount}
                            </div>
                            <div class="product-actions">
                                <button class="action-btn quick-view" title="Quick View">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="action-btn remove-from-wishlist" title="Remove from Wishlist">
                                    <i class="fas fa-heart"></i>
                                </button>
                                <button class="action-btn add-to-compare" title="Compare">
                                    <i class="fas fa-exchange-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h3 class="product-title">
                                <a href="product-detail.html?id=${item.id}">${item.name}</a>
                            </h3>
                            <div class="product-rating">
                                ${this.getStarRating(item.rating)}
                            </div>
                            ${priceHtml}
                            <button class="btn btn-primary add-to-cart-btn">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                `;
            });
            
            this.wishlistContainer.innerHTML = html;
        }
    }
    
    renderEmptyWishlist() {
        if (this.wishlistContainer) {
            this.wishlistContainer.style.display = 'none';
        }
        
        if (this.emptyWishlistMessage) {
            this.emptyWishlistMessage.style.display = 'block';
            this.emptyWishlistMessage.innerHTML = `
                <div class="empty-wishlist">
                    <div class="empty-wishlist-icon">
                        <i class="far fa-heart"></i>
                    </div>
                    <h2>Your wishlist is empty</h2>
                    <p>Looks like you haven't added any items to your wishlist yet.</p>
                    <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
        }
    }
    
   
    addToWishlist(product) {
     
        if (this.isInWishlist(product.id)) return;
        
        
        this.wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            rating: product.rating
        });
        
       
        this.saveWishlist();
        
     
        if (this.wishlistContainer) {
            this.renderWishlist();
        }
        
        
        this.updateWishlistCount();
        
        
        this.showToast(`${product.name} added to wishlist`);
    }
    
    
    removeFromWishlist(productId) {
       
        const productIndex = this.wishlist.findIndex(item => item.id.toString() === productId.toString());
        
        if (productIndex === -1) return;
        
       
        const productName = this.wishlist[productIndex].name;
        
       
        this.wishlist.splice(productIndex, 1);
        
       
        this.saveWishlist();
        
 
        if (this.wishlistContainer) {
            this.renderWishlist();
        }
        
        
        this.updateWishlistCount();
        
      
        this.showToast(`${productName} removed from wishlist`);
        
       
        const wishlistButtons = document.querySelectorAll(`.wishlist-toggle[data-product-id="${productId}"]`);
        wishlistButtons.forEach(button => {
            button.classList.remove('in-wishlist');
        });
    }
    
    
    clearWishlist() {
       
        this.wishlist = [];
        
    
        this.saveWishlist();
        
       
        this.renderWishlist();
        
        
        this.updateWishlistCount();
        
        
        this.showToast('Wishlist cleared');
        
      
        const wishlistButtons = document.querySelectorAll('.wishlist-toggle.in-wishlist');
        wishlistButtons.forEach(button => {
            button.classList.remove('in-wishlist');
        });
    }
    
  
    addToCart(productId) {
       
        const product = this.wishlist.find(item => item.id.toString() === productId.toString());
        
        if (!product) return;
        
    
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
     
        const existingItemIndex = cart.findIndex(item => item.id.toString() === productId.toString());
        
        if (existingItemIndex >= 0) {
         
            cart[existingItemIndex].quantity += 1;
        } else {
       
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
     
        localStorage.setItem('cart', JSON.stringify(cart));
        
      
        this.showToast(`${product.name} added to cart`);
        
      
        if (window.updateCartCount) {
            window.updateCartCount();
        }
    }
    
   
    isInWishlist(productId) {
        return this.wishlist.some(item => item.id.toString() === productId.toString());
    }
    
   
    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }
    
    
    updateWishlistCount() {
        const count = this.wishlist.length;
        
        
        if (this.wishlistCount) {
            this.wishlistCount.textContent = count;
            this.wishlistCount.style.display = count > 0 ? 'flex' : 'none';
        }
        
      
        const wishlistCountElements = document.querySelectorAll('.wishlist-count');
        wishlistCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'flex' : 'none';
        });
    }
    
   
    showToast(message) {
      
        if (window.showToast) {
            window.showToast(message);
            return;
        }
        
       
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;
        
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
    
    
    getProductDataFromCard(card) {
        const id = card.getAttribute('data-product-id');
        const name = card.querySelector('.product-title').textContent;
        const priceElement = card.querySelector('.product-price');
        const price = parseFloat(priceElement.textContent.replace('₹', ''));
        const image = card.querySelector('.product-image img').src;
        
      
        let rating = 0;
        const ratingElement = card.querySelector('.product-rating');
        if (ratingElement) {
          
            const fullStars = ratingElement.querySelectorAll('.fas.fa-star').length;
            const halfStars = ratingElement.querySelectorAll('.fas.fa-star-half-alt').length;
            rating = fullStars + (halfStars * 0.5);
        }
        
        return {
            id,
            name,
            price,
            image,
            rating
        };
    }
    
   
    getStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHtml = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        
        if (halfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        return starsHtml;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.wishlistManager = new WishlistManager();
}); 