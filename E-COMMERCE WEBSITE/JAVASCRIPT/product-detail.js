class ProductDetail {
    constructor() {
        this.productId = this.getProductIdFromUrl();
        this.product = null;
        this.currentImageIndex = 0;
        this.selectedSize = null;
        this.selectedColor = null;
        this.quantity = 1;
        
        this.productContainer = document.getElementById('product-detail-container');
        this.productImageGallery = document.getElementById('product-image-gallery');
        this.productThumbnails = document.getElementById('product-thumbnails');
        this.relatedProductsContainer = document.getElementById('related-products');
        
        this.init();
    }
    
    async init() {
        if (!this.productId) {
            window.location.href = '../HTML/products.html';
            return;
        }
        
        await this.loadProduct();
        
        if (!this.product) {
            window.location.href = '../HTML/products.html';
            return;
        }
        
        this.renderProduct();
        this.setupEventListeners();
        this.loadRelatedProducts();
        
        if (this.product.attributes.sizes?.length > 0) {
            this.selectedSize = this.product.attributes.sizes[0];
        }
        
        if (this.product.attributes.colors?.length > 0) {
            this.selectedColor = this.product.attributes.colors[0];
        }
        
        const descriptionTab = document.getElementById('description-tab');
        if (descriptionTab) descriptionTab.click();
    }
    
    getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }
    
    async loadProduct() {
        try {
            this.product = getProductById(this.productId);
        } catch (error) {
            console.error('Error loading product:', error);
            showToast('Error loading product details', 'error');
        }
    }
    
    renderProduct() {
        if (!this.productContainer) return;
        
        document.title = `${this.product.name} - ShopEasy`;
        
        this.updateBreadcrumb();
        
        this.renderProductImages();
        
        const productInfo = document.createElement('div');
        productInfo.className = 'product-info';
        
        const discount = this.product.discount ? `<span class="product-discount">-${this.product.discount}%</span>` : '';
        const inStockClass = this.product.inStock ? 'in-stock' : 'out-of-stock';
        const inStockText = this.product.inStock ? 'In Stock' : 'Out of Stock';
        
        const originalPrice = this.product.price;
        const discountedPrice = this.product.discount ? 
            originalPrice - (originalPrice * this.product.discount / 100) : 
            originalPrice;
        
        const priceHtml = this.product.discount ?
            `<div class="product-price">
                <span class="discounted-price">₹${discountedPrice.toFixed(2)}</span>
                <span class="original-price">₹${originalPrice.toFixed(2)}</span>
                ${discount}
            </div>` :
            `<div class="product-price">₹${originalPrice.toFixed(2)}</div>`;
        
        productInfo.innerHTML = `
            <h1 class="product-title">${this.product.name}</h1>
            <div class="product-meta">
                <div class="product-rating">${this.getStarRating(this.product.rating)}</div>
                <div class="product-reviews">${this.product.reviews?.length || 0} Reviews</div>
                <div class="product-id">SKU: ${this.product.id}</div>
            </div>
            ${priceHtml}
            <div class="product-status ${inStockClass}">${inStockText}</div>
            <div class="product-short-description">${this.product.description}</div>
        `;
        
        if (this.product.attributes.sizes && this.product.attributes.sizes.length > 0) {
            const sizeSelector = document.createElement('div');
            sizeSelector.className = 'product-sizes';
            
            let sizesHtml = '<div class="attribute-label">Size:</div><div class="size-options">';
            this.product.attributes.sizes.forEach(size => {
                sizesHtml += `<button class="size-option" data-size="${size}">${size}</button>`;
            });
            sizesHtml += '</div>';
            
            sizeSelector.innerHTML = sizesHtml;
            productInfo.appendChild(sizeSelector);
        }
        
        if (this.product.attributes.colors && this.product.attributes.colors.length > 0) {
            const colorSelector = document.createElement('div');
            colorSelector.className = 'product-colors';
            
            let colorsHtml = '<div class="attribute-label">Color:</div><div class="color-options">';
            this.product.attributes.colors.forEach(color => {
                colorsHtml += `<button class="color-option" data-color="${color}" style="background-color: ${color}"></button>`;
            });
            colorsHtml += '</div>';
            
            colorSelector.innerHTML = colorsHtml;
            productInfo.appendChild(colorSelector);
        }
        
        const quantitySelector = document.createElement('div');
        quantitySelector.className = 'quantity-selector';
        quantitySelector.innerHTML = `
            <div class="attribute-label">Quantity:</div>
            <div class="quantity-control">
                <button class="quantity-btn decrease">-</button>
                <input type="number" class="quantity-input" value="1" min="1" max="99">
                <button class="quantity-btn increase">+</button>
            </div>
        `;
        productInfo.appendChild(quantitySelector);
        
        const productActions = document.createElement('div');
        productActions.className = 'product-actions';
        
        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'btn btn-primary add-to-cart';
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        addToCartBtn.disabled = !this.product.inStock;
        productActions.appendChild(addToCartBtn);
        
        const wishlistBtn = document.createElement('button');
        wishlistBtn.className = 'btn btn-outline wishlist-btn';
        wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
        wishlistBtn.title = 'Add to Wishlist';
        productActions.appendChild(wishlistBtn);
        
        const compareBtn = document.createElement('button');
        compareBtn.className = 'btn btn-outline compare-btn';
        compareBtn.innerHTML = '<i class="fas fa-exchange-alt"></i>';
        compareBtn.title = 'Compare';
        productActions.appendChild(compareBtn);
        
        productInfo.appendChild(productActions);
        
        const productShare = document.createElement('div');
        productShare.className = 'product-share';
        productShare.innerHTML = `
            <span>Share:</span>
            <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-pinterest-p"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
        `;
        productInfo.appendChild(productShare);
        
        this.productContainer.innerHTML = '';
        
        const productLeft = document.createElement('div');
        productLeft.className = 'product-left';
        productLeft.appendChild(this.productImageGallery);
        productLeft.appendChild(this.productThumbnails);
        
        this.productContainer.appendChild(productLeft);
        this.productContainer.appendChild(productInfo);
        
        this.setupTabs();
    }
    
    renderProductImages() {
        if (!this.productImageGallery || !this.productThumbnails) return;
        
        this.productImageGallery.innerHTML = '';
        this.productThumbnails.innerHTML = '';
        
        this.product.images.forEach((image, index) => {
            const mainImageDiv = document.createElement('div');
            mainImageDiv.className = `image-main ${index === 0 ? 'active' : ''}`;
            mainImageDiv.innerHTML = `<img src="${image}" alt="${this.product.name}">`;
            this.productImageGallery.appendChild(mainImageDiv);
            
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.className = `image-thumb ${index === 0 ? 'active' : ''}`;
            thumbnailDiv.innerHTML = `<img src="${image}" alt="${this.product.name}">`;
            thumbnailDiv.dataset.index = index;
            this.productThumbnails.appendChild(thumbnailDiv);
        });
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'image-nav prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'image-nav next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        this.productImageGallery.appendChild(prevBtn);
        this.productImageGallery.appendChild(nextBtn);
    }
    
    setupEventListeners() {
        const quantityInput = document.querySelector('.quantity-input');
        const decreaseBtn = document.querySelector('.quantity-btn.decrease');
        const increaseBtn = document.querySelector('.quantity-btn.increase');
        const addToCartBtn = document.querySelector('.add-to-cart');
        const wishlistBtn = document.querySelector('.wishlist-btn');
        const compareBtn = document.querySelector('.compare-btn');
        const prevBtn = document.querySelector('.image-nav.prev');
        const nextBtn = document.querySelector('.image-nav.next');
        const thumbnails = document.querySelectorAll('.image-thumb');
        const sizeOptions = document.querySelectorAll('.size-option');
        const colorOptions = document.querySelectorAll('.color-option');
        
        if (quantityInput) {
            quantityInput.addEventListener('change', (e) => {
                this.quantity = parseInt(e.target.value);
                if (isNaN(this.quantity) || this.quantity < 1) {
                    this.quantity = 1;
                    quantityInput.value = 1;
                }
            });
        }
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                if (this.quantity > 1) {
                    this.quantity--;
                    quantityInput.value = this.quantity;
                }
            });
        }
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                this.quantity++;
                quantityInput.value = this.quantity;
            });
        }
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                if (!this.product.inStock) return;
                
                const itemToAdd = {
                    id: this.product.id,
                    name: this.product.name,
                    price: this.product.discount ? 
                        this.product.price - (this.product.price * this.product.discount / 100) : 
                        this.product.price,
                    quantity: this.quantity,
                    image: this.product.images[0],
                    size: this.selectedSize,
                    color: this.selectedColor
                };
                
                addToCart(itemToAdd);
                showToast(`${this.product.name} added to cart!`);
            });
        }
        
        if (wishlistBtn) {
            const isInWishlist = this.isInWishlist(this.product.id);
            if (isInWishlist) {
                wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
                wishlistBtn.classList.add('active');
            }
            
            wishlistBtn.addEventListener('click', () => {
                this.toggleWishlist();
                
                const inWishlist = this.isInWishlist(this.product.id);
                if (inWishlist) {
                    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
                    wishlistBtn.classList.add('active');
                    showToast(`${this.product.name} added to wishlist!`);
                } else {
                    wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
                    wishlistBtn.classList.remove('active');
                    showToast(`${this.product.name} removed from wishlist!`);
                }
            });
        }
        
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                showToast('Compare feature coming soon!');
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.showPreviousImage();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.showNextImage();
            });
        }
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.dataset.index);
                this.showImage(index);
            });
        });
        
        sizeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const size = e.target.dataset.size;
                this.selectedSize = size;
                
                sizeOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
        
        colorOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                this.selectedColor = color;
                
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
        
        if (sizeOptions.length > 0) {
            sizeOptions[0].classList.add('selected');
        }
        
        if (colorOptions.length > 0) {
            colorOptions[0].classList.add('selected');
        }
        
        this.setupSocialSharing();
    }
    
    setupTabs() {
        const tabsContainer = document.querySelector('.product-tabs');
        if (!tabsContainer) return;
        
        const tabContents = document.querySelector('.product-tab-contents');
        if (!tabContents) return;
        
        tabsContainer.innerHTML = `
            <button id="description-tab" class="tab-button" data-tab="description">Description</button>
            <button id="specifications-tab" class="tab-button" data-tab="specifications">Specifications</button>
            <button id="reviews-tab" class="tab-button" data-tab="reviews">Reviews (${this.product.reviews?.length || 0})</button>
        `;
        
        tabContents.innerHTML = `
            <div id="description-content" class="tab-content">
                <div class="tab-pane">${this.product.description}</div>
            </div>
            <div id="specifications-content" class="tab-content">
                <div class="tab-pane">
                    <div class="specifications-list">
                        ${this.renderSpecifications()}
                    </div>
                </div>
            </div>
            <div id="reviews-content" class="tab-content">
                <div class="tab-pane">
                    ${this.renderReviews()}
                </div>
            </div>
        `;
        
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents2 = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents2.forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                document.getElementById(`${tabId}-content`).classList.add('active');
            });
        });
    }
    
    renderSpecifications() {
        if (!this.product.specifications) return '<p>No specifications available for this product.</p>';
        
        let specsHtml = '<table class="specs-table">';
        
        Object.entries(this.product.specifications).forEach(([key, value]) => {
            specsHtml += `
                <tr>
                    <th>${this.formatSpecName(key)}</th>
                    <td>${value}</td>
                </tr>
            `;
        });
        
        specsHtml += '</table>';
        return specsHtml;
    }
    
    formatSpecName(name) {
        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }
    
    renderReviews() {
        if (!this.product.reviews || this.product.reviews.length === 0) {
            return `
                <div class="no-reviews">
                    <p>There are no reviews yet for this product.</p>
                    <button class="btn btn-primary write-review-btn">Write a Review</button>
                </div>
            `;
        }
        
        let reviewsHtml = `
            <div class="reviews-summary">
                <div class="average-rating">
                    <div class="big-rating">${this.product.rating.toFixed(1)}</div>
                    <div class="rating-stars">${this.getStarRating(this.product.rating)}</div>
                    <div class="review-count">Based on ${this.product.reviews.length} reviews</div>
                </div>
                <button class="btn btn-primary write-review-btn">Write a Review</button>
            </div>
            <div class="reviews-list">
        `;
        
        this.product.reviews.forEach(review => {
            reviewsHtml += `
                <div class="review">
                    <div class="review-header">
                        <div class="reviewer-name">${review.name}</div>
                        <div class="review-date">${this.formatDate(review.date)}</div>
                    </div>
                    <div class="review-rating">${this.getStarRating(review.rating)}</div>
                    <div class="review-title">${review.title}</div>
                    <div class="review-text">${review.text}</div>
                </div>
            `;
        });
        
        reviewsHtml += '</div>';
        return reviewsHtml;
    }
    
    updateBreadcrumb() {
        const breadcrumb = document.querySelector('.breadcrumb');
        if (!breadcrumb) return;
        
        breadcrumb.innerHTML = `
            <li><a href="../HTML/index.html">Home</a></li>
            <li><a href="../HTML/products.html">Products</a></li>
            <li><a href="../HTML/products.html?category=${encodeURIComponent(this.product.category)}">${this.product.category}</a></li>
            <li>${this.product.name}</li>
        `;
    }
    
    showImage(index) {
        if (index < 0 || index >= this.product.images.length) return;
        
        const mainImages = document.querySelectorAll('.image-main');
        const thumbs = document.querySelectorAll('.image-thumb');
        
        mainImages.forEach(img => img.classList.remove('active'));
        thumbs.forEach(thumb => thumb.classList.remove('active'));
        
        mainImages[index].classList.add('active');
        thumbs[index].classList.add('active');
        
        this.currentImageIndex = index;
    }
    
    showNextImage() {
        const nextIndex = (this.currentImageIndex + 1) % this.product.images.length;
        this.showImage(nextIndex);
    }
    
    showPreviousImage() {
        const prevIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
        this.showImage(prevIndex);
    }
    
    loadRelatedProducts() {
        if (!this.relatedProductsContainer) return;
        
        let relatedProducts = [];
        
        if (this.product.relatedProducts && this.product.relatedProducts.length > 0) {
            relatedProducts = this.product.relatedProducts.map(id => getProductById(id)).filter(Boolean);
        } else {
            relatedProducts = getProductsByCategory(this.product.category).filter(p => p.id !== this.product.id).slice(0, 4);
        }
        
        if (relatedProducts.length === 0) {
            this.relatedProductsContainer.closest('.related-products-section')?.classList.add('hidden');
            return;
        }
        
        let relatedHtml = '';
        
        relatedProducts.slice(0, 4).forEach(product => {
            const discount = product.discount ? `<span class="product-label sale">-${product.discount}%</span>` : '';
            const newLabel = product.new ? '<span class="product-label new">New</span>' : '';
            
            const originalPrice = product.price;
            const discountedPrice = product.discount ? 
                originalPrice - (originalPrice * product.discount / 100) : 
                originalPrice;
            
            const priceHtml = product.discount ?
                `<div class="product-price">
                    <span class="discounted-price">₹${discountedPrice.toFixed(2)}</span>
                    <span class="original-price">₹${originalPrice.toFixed(2)}</span>
                </div>` :
                `<div class="product-price">₹${originalPrice.toFixed(2)}</div>`;
            
            relatedHtml += `
                <div class="product-card">
                    <div class="product-image">
                        <a href="../HTML/product-detail.html?id=${product.id}">
                            <img src="${product.images[0]}" alt="${product.name}">
                        </a>
                        <div class="product-labels">
                            ${discount}
                            ${newLabel}
                        </div>
                        <div class="product-actions">
                            <button class="action-btn quick-view" data-id="${product.id}" title="Quick View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn add-to-wishlist" data-id="${product.id}" title="Add to Wishlist">
                                <i class="far fa-heart"></i>
                            </button>
                            <button class="action-btn add-to-compare" data-id="${product.id}" title="Compare">
                                <i class="fas fa-exchange-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">
                            <a href="../HTML/product-detail.html?id=${product.id}">${product.name}</a>
                        </h3>
                        <div class="product-rating">
                            ${this.getStarRating(product.rating)}
                            <span class="rating-count">(${product.reviews?.length || 0})</span>
                        </div>
                        ${priceHtml}
                        <button class="btn btn-sm btn-primary add-to-cart-btn" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
        });
        
        this.relatedProductsContainer.innerHTML = relatedHtml;
        
        const quickViewBtns = document.querySelectorAll('.related-products .quick-view');
        const wishlistBtns = document.querySelectorAll('.related-products .add-to-wishlist');
        const compareBtns = document.querySelectorAll('.related-products .add-to-compare');
        const addToCartBtns = document.querySelectorAll('.related-products .add-to-cart-btn');
        
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.id;
                showToast('Quick view feature coming soon!');
            });
        });
        
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.id;
                const product = getProductById(productId);
                if (!product) return;
                
                const isInWishlist = this.isInWishlist(productId);
                if (isInWishlist) {
                    showToast(`${product.name} removed from wishlist!`);
                    btn.querySelector('i').className = 'far fa-heart';
                } else {
                    showToast(`${product.name} added to wishlist!`);
                    btn.querySelector('i').className = 'fas fa-heart';
                }
                
                this.toggleWishlistItem(productId);
            });
        });
        
        compareBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                showToast('Compare feature coming soon!');
            });
        });
        
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.id;
                const product = getProductById(productId);
                if (!product) return;
                
                const itemToAdd = {
                    id: product.id,
                    name: product.name,
                    price: product.discount ? 
                        product.price - (product.price * product.discount / 100) : 
                        product.price,
                    quantity: 1,
                    image: product.images[0]
                };
                
                addToCart(itemToAdd);
                showToast(`${product.name} added to cart!`);
            });
        });
    }
    
    isInWishlist(productId) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        return wishlist.some(item => item.id === productId);
    }
    
    toggleWishlist() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const index = wishlist.findIndex(item => item.id === this.product.id);
        
        if (index !== -1) {
            wishlist.splice(index, 1);
        } else {
            wishlist.push({
                id: this.product.id,
                name: this.product.name,
                price: this.product.price,
                discount: this.product.discount,
                image: this.product.images[0],
                rating: this.product.rating
            });
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
    }
    
    toggleWishlistItem(productId) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const index = wishlist.findIndex(item => item.id === productId);
        
        if (index !== -1) {
            wishlist.splice(index, 1);
        } else {
            const product = getProductById(productId);
            if (!product) return;
            
            wishlist.push({
                id: product.id,
                name: product.name,
                price: product.price,
                discount: product.discount,
                image: product.images[0],
                rating: product.rating
            });
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
    }
    
    setupSocialSharing() {
        const shareLinks = document.querySelectorAll('.product-share .social-icon');
        
        shareLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showToast('Sharing feature coming soon!');
            });
        });
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
    
    formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-detail-container')) {
        window.productDetail = new ProductDetail();
    }
}); 