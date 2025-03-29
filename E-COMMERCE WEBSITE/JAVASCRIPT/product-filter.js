/**
 * Advanced Product Filter and Search System
 * This module handles all product filtering, sorting, and pagination operations
 */

class ProductFilter {
    constructor() {
        this.activeFilters = {
            category: null,
            minPrice: null,
            maxPrice: null,
            brands: [],
            rating: null,
            attributes: {},
            onSale: false,
            inStock: true
        };
        
        this.sortOption = 'default';
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.searchQuery = '';
        
        // DOM Elements
        this.productsContainer = document.getElementById('products-container');
        this.filterForm = document.getElementById('filter-form');
        this.sortSelect = document.getElementById('sort-by');
        this.paginationContainer = document.getElementById('pagination');
        this.productCount = document.getElementById('product-count');
        this.priceRangeMin = document.getElementById('price-min');
        this.priceRangeMax = document.getElementById('price-max');
        this.categoryFilters = document.querySelectorAll('.category-filter');
        this.brandFilters = document.querySelectorAll('.brand-filter');
        this.ratingFilters = document.querySelectorAll('.rating-filter');
        this.attributeFilters = document.querySelectorAll('.attribute-filter');
        this.saleFilter = document.getElementById('sale-filter');
        this.stockFilter = document.getElementById('stock-filter');
        this.searchInput = document.getElementById('search-input');
        this.resetFilters = document.getElementById('reset-filters');
        
        this.init();
    }
    
    /**
     * Initialize the filter system
     */
    init() {
        // Parse URL parameters and set initial filters
        this.parseURLParams();
        
        // Set up price range filters with actual min/max values
        this.setupPriceFilters();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial product loading
        this.applyFilters();
    }
    
    /**
     * Set up event listeners for all filter controls
     */
    setupEventListeners() {
        // Sort change
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => {
                this.sortOption = this.sortSelect.value;
                this.currentPage = 1; // Reset to first page when sorting changes
                this.applyFilters();
            });
        }
        
        // Category filters
        if (this.categoryFilters) {
            this.categoryFilters.forEach(filter => {
                filter.addEventListener('change', () => {
                    if (filter.checked) {
                        this.activeFilters.category = filter.value;
                    } else if (this.activeFilters.category === filter.value) {
                        this.activeFilters.category = null;
                    }
                    this.currentPage = 1; // Reset to first page when filters change
                    this.applyFilters();
                });
            });
        }
        
        // Price range filters
        if (this.priceRangeMin && this.priceRangeMax) {
            this.priceRangeMin.addEventListener('change', () => {
                this.activeFilters.minPrice = this.priceRangeMin.value ? parseFloat(this.priceRangeMin.value) : null;
                this.currentPage = 1;
                this.applyFilters();
            });
            
            this.priceRangeMax.addEventListener('change', () => {
                this.activeFilters.maxPrice = this.priceRangeMax.value ? parseFloat(this.priceRangeMax.value) : null;
                this.currentPage = 1;
                this.applyFilters();
            });
        }
        
        // Brand filters
        if (this.brandFilters) {
            this.brandFilters.forEach(filter => {
                filter.addEventListener('change', () => {
                    if (filter.checked) {
                        this.activeFilters.brands.push(filter.value);
                    } else {
                        this.activeFilters.brands = this.activeFilters.brands.filter(brand => brand !== filter.value);
                    }
                    this.currentPage = 1;
                    this.applyFilters();
                });
            });
        }
        
        // Rating filters
        if (this.ratingFilters) {
            this.ratingFilters.forEach(filter => {
                filter.addEventListener('change', () => {
                    if (filter.checked) {
                        this.activeFilters.rating = parseFloat(filter.value);
                    } else if (this.activeFilters.rating === parseFloat(filter.value)) {
                        this.activeFilters.rating = null;
                    }
                    this.currentPage = 1;
                    this.applyFilters();
                });
            });
        }
        
        // Attribute filters
        if (this.attributeFilters) {
            this.attributeFilters.forEach(filter => {
                filter.addEventListener('change', () => {
                    const attributeType = filter.getAttribute('data-attribute-type');
                    const attributeValue = filter.value;
                    
                    if (!this.activeFilters.attributes[attributeType]) {
                        this.activeFilters.attributes[attributeType] = [];
                    }
                    
                    if (filter.checked) {
                        this.activeFilters.attributes[attributeType].push(attributeValue);
                    } else {
                        this.activeFilters.attributes[attributeType] = this.activeFilters.attributes[attributeType]
                            .filter(value => value !== attributeValue);
                        
                        if (this.activeFilters.attributes[attributeType].length === 0) {
                            delete this.activeFilters.attributes[attributeType];
                        }
                    }
                    
                    this.currentPage = 1;
                    this.applyFilters();
                });
            });
        }
        
        // Sale filter
        if (this.saleFilter) {
            this.saleFilter.addEventListener('change', () => {
                this.activeFilters.onSale = this.saleFilter.checked;
                this.currentPage = 1;
                this.applyFilters();
            });
        }
        
        // Stock filter
        if (this.stockFilter) {
            this.stockFilter.addEventListener('change', () => {
                this.activeFilters.inStock = this.stockFilter.checked;
                this.currentPage = 1;
                this.applyFilters();
            });
        }
        
        // Search input
        if (this.searchInput) {
            // Debounce search for better performance
            let searchTimeout;
            this.searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchQuery = this.searchInput.value.trim();
                    this.currentPage = 1;
                    this.applyFilters();
                }, 300);
            });
            
            // Handle Enter key press
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.searchQuery = this.searchInput.value.trim();
                    this.currentPage = 1;
                    this.applyFilters();
                }
            });
        }
        
        // Reset filters
        if (this.resetFilters) {
            this.resetFilters.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetAllFilters();
            });
        }
        
        // Pagination event delegation
        if (this.paginationContainer) {
            this.paginationContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('page-link')) {
                    e.preventDefault();
                    
                    if (e.target.getAttribute('data-page') === 'prev') {
                        if (this.currentPage > 1) {
                            this.currentPage--;
                        }
                    } else if (e.target.getAttribute('data-page') === 'next') {
                        const totalPages = parseInt(this.paginationContainer.getAttribute('data-total-pages'));
                        if (this.currentPage < totalPages) {
                            this.currentPage++;
                        }
                    } else {
                        this.currentPage = parseInt(e.target.getAttribute('data-page'));
                    }
                    
                    this.applyFilters();
                    
                    // Scroll to top of products container
                    this.productsContainer.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }
    
    /**
     * Parse URL parameters to set initial filters
     */
    parseURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Category
        if (urlParams.has('category')) {
            this.activeFilters.category = urlParams.get('category');
            
            // Check the corresponding category filter
            if (this.categoryFilters) {
                this.categoryFilters.forEach(filter => {
                    if (filter.value === this.activeFilters.category) {
                        filter.checked = true;
                    }
                });
            }
        }
        
        // Price range
        if (urlParams.has('minPrice')) {
            this.activeFilters.minPrice = parseFloat(urlParams.get('minPrice'));
            if (this.priceRangeMin) this.priceRangeMin.value = this.activeFilters.minPrice;
        }
        
        if (urlParams.has('maxPrice')) {
            this.activeFilters.maxPrice = parseFloat(urlParams.get('maxPrice'));
            if (this.priceRangeMax) this.priceRangeMax.value = this.activeFilters.maxPrice;
        }
        
        // Brands
        if (urlParams.has('brands')) {
            this.activeFilters.brands = urlParams.get('brands').split(',');
            
            // Check the corresponding brand filters
            if (this.brandFilters) {
                this.brandFilters.forEach(filter => {
                    if (this.activeFilters.brands.includes(filter.value)) {
                        filter.checked = true;
                    }
                });
            }
        }
        
        // Rating
        if (urlParams.has('rating')) {
            this.activeFilters.rating = parseFloat(urlParams.get('rating'));
            
            // Check the corresponding rating filter
            if (this.ratingFilters) {
                this.ratingFilters.forEach(filter => {
                    if (parseFloat(filter.value) === this.activeFilters.rating) {
                        filter.checked = true;
                    }
                });
            }
        }
        
        // On Sale
        if (urlParams.has('onSale')) {
            this.activeFilters.onSale = urlParams.get('onSale') === 'true';
            if (this.saleFilter) this.saleFilter.checked = this.activeFilters.onSale;
        }
        
        // In Stock
        if (urlParams.has('inStock')) {
            this.activeFilters.inStock = urlParams.get('inStock') === 'true';
            if (this.stockFilter) this.stockFilter.checked = this.activeFilters.inStock;
        }
        
        // Search query
        if (urlParams.has('search')) {
            this.searchQuery = urlParams.get('search');
            if (this.searchInput) this.searchInput.value = this.searchQuery;
        }
        
        // Sort option
        if (urlParams.has('sort')) {
            this.sortOption = urlParams.get('sort');
            if (this.sortSelect) this.sortSelect.value = this.sortOption;
        }
        
        // Page number
        if (urlParams.has('page')) {
            this.currentPage = parseInt(urlParams.get('page'));
        }
    }
    
    /**
     * Set up price range filters with actual min/max values
     */
    setupPriceFilters() {
        try {
            // Get min and max prices from all products
            const priceRange = getPriceRange();
            
            if (this.priceRangeMin && this.priceRangeMax) {
                // Set min and max attributes
                this.priceRangeMin.setAttribute('min', priceRange.minPrice.toFixed(2));
                this.priceRangeMin.setAttribute('max', priceRange.maxPrice.toFixed(2));
                this.priceRangeMax.setAttribute('min', priceRange.minPrice.toFixed(2));
                this.priceRangeMax.setAttribute('max', priceRange.maxPrice.toFixed(2));
                
                // Set placeholder texts
                this.priceRangeMin.setAttribute('placeholder', `Min (₹${priceRange.minPrice.toFixed(2)})`);
                this.priceRangeMax.setAttribute('placeholder', `Max (₹${priceRange.maxPrice.toFixed(2)})`);
                
                // Set initial values if not already set from URL
                if (this.activeFilters.minPrice === null) {
                    this.priceRangeMin.value = '';
                }
                
                if (this.activeFilters.maxPrice === null) {
                    this.priceRangeMax.value = '';
                }
            }
        } catch (error) {
            console.error("Error setting up price filters:", error);
        }
    }
    
    /**
     * Reset all filters to their default values
     */
    resetAllFilters() {
        // Reset active filters
        this.activeFilters = {
            category: null,
            minPrice: null,
            maxPrice: null,
            brands: [],
            rating: null,
            attributes: {},
            onSale: false,
            inStock: true
        };
        
        // Reset sort option
        this.sortOption = 'default';
        
        // Reset search query
        this.searchQuery = '';
        
        // Reset current page
        this.currentPage = 1;
        
        // Reset UI elements
        if (this.sortSelect) this.sortSelect.value = 'default';
        if (this.searchInput) this.searchInput.value = '';
        
        if (this.categoryFilters) {
            this.categoryFilters.forEach(filter => {
                filter.checked = false;
            });
        }
        
        if (this.priceRangeMin) this.priceRangeMin.value = '';
        if (this.priceRangeMax) this.priceRangeMax.value = '';
        
        if (this.brandFilters) {
            this.brandFilters.forEach(filter => {
                filter.checked = false;
            });
        }
        
        if (this.ratingFilters) {
            this.ratingFilters.forEach(filter => {
                filter.checked = false;
            });
        }
        
        if (this.attributeFilters) {
            this.attributeFilters.forEach(filter => {
                filter.checked = false;
            });
        }
        
        if (this.saleFilter) this.saleFilter.checked = false;
        if (this.stockFilter) this.stockFilter.checked = true;
        
        // Re-apply filters (which now resets to defaults)
        this.applyFilters();
    }
    
    /**
     * Apply all current filters and update the product display
     */
    applyFilters() {
        // Create the filters object for searchProducts function
        const filters = {
            category: this.activeFilters.category,
            minPrice: this.activeFilters.minPrice,
            maxPrice: this.activeFilters.maxPrice,
            brand: this.activeFilters.brands.length > 0 ? this.activeFilters.brands : undefined,
            minRating: this.activeFilters.rating,
            inStock: this.activeFilters.inStock,
            onSale: this.activeFilters.onSale,
            attributes: Object.keys(this.activeFilters.attributes).length > 0 ? this.activeFilters.attributes : undefined
        };
        
        // Get filtered products
        let filteredProducts = searchProducts(this.searchQuery, filters);
        
        // Sort products
        filteredProducts = sortProducts(filteredProducts, this.sortOption);
        
        // Paginate products
        const paginatedResult = paginateProducts(filteredProducts, this.currentPage, this.itemsPerPage);
        
        // Update product count
        if (this.productCount) {
            this.productCount.textContent = filteredProducts.length;
        }
        
        // Update pagination
        this.updatePagination(paginatedResult.totalPages);
        
        // Render products
        this.renderProducts(paginatedResult.products);
        
        // Update URL with current filters
        this.updateURL();
    }
    
    /**
     * Render products to the product container
     * @param {Array} products - The products to render
     */
    renderProducts(products) {
        if (!this.productsContainer) return;
        
        if (products.length === 0) {
            this.productsContainer.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                    <button class="btn" id="clear-filters">Clear Filters</button>
                </div>
            `;
            
            // Add event listener to the clear filters button
            const clearFiltersBtn = document.getElementById('clear-filters');
            if (clearFiltersBtn) {
                clearFiltersBtn.addEventListener('click', () => {
                    this.resetAllFilters();
                });
            }
            
            return;
        }
        
        let html = '';
        
        products.forEach(product => {
            const discountedPrice = product.discount ? 
                product.price * (1 - product.discount / 100) : 
                product.oldPrice ? product.price : null;
            
            html += `
                <div class="product-card">
                    <div class="product-img">
                        <img src="${product.images[0]}" alt="${product.name}">
                        <div class="product-labels">
                            ${product.isNew ? '<span class="product-label new">New</span>' : ''}
                            ${product.isSale || product.discount ? '<span class="product-label sale">Sale</span>' : ''}
                        </div>
                        <div class="product-actions">
                            <a href="#" class="action-btn add-to-cart" data-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i>
                            </a>
                            <a href="#" class="action-btn add-to-wishlist" data-id="${product.id}">
                                <i class="fas fa-heart"></i>
                            </a>
                            <a href="product-detail.html?id=${product.id}" class="action-btn view-product">
                                <i class="fas fa-eye"></i>
                            </a>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
                        <div class="product-category">${product.category}</div>
                        <div class="product-price">
                            <span class="current-price">₹${discountedPrice ? discountedPrice.toFixed(2) : product.price.toFixed(2)}</span>
                            ${discountedPrice ? `<span class="old-price">₹${(product.oldPrice || product.price).toFixed(2)}</span>` : ''}
                        </div>
                        <div class="product-rating">
                            <div class="stars">
                                ${this.getStarRating(product.rating)}
                            </div>
                            <div class="rating-count">(${product.reviewCount || 0})</div>
                        </div>
                        <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;
        });
        
        this.productsContainer.innerHTML = html;
        
        // Add event listeners to the add to cart buttons
        const addToCartBtns = this.productsContainer.querySelectorAll('.add-to-cart, .add-to-cart-btn');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(btn.getAttribute('data-id'));
                addToCart(productId);
            });
        });
        
        // Add event listeners to the wishlist buttons
        const wishlistBtns = this.productsContainer.querySelectorAll('.add-to-wishlist');
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(btn.getAttribute('data-id'));
                this.addToWishlist(productId);
            });
        });
    }
    
    /**
     * Generate star rating HTML
     * @param {number} rating - The rating value (0-5)
     * @returns {string} - HTML string for the star rating
     */
    getStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHtml = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (halfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        return starsHtml;
    }
    
    /**
     * Update pagination controls
     * @param {number} totalPages - Total number of pages
     */
    updatePagination(totalPages) {
        if (!this.paginationContainer) return;
        
        // Store total pages for use in event listener
        this.paginationContainer.setAttribute('data-total-pages', totalPages);
        
        if (totalPages <= 1) {
            this.paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHtml = '<ul class="pagination">';
        
        // Previous button
        paginationHtml += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="prev" ${this.currentPage === 1 ? 'tabindex="-1"' : ''}>
                    <i class="fas fa-chevron-left"></i> Previous
                </a>
            </li>
        `;
        
        // Page numbers
        const maxPageLinks = 5; // Maximum number of page links to show
        const pageStart = Math.max(1, this.currentPage - Math.floor(maxPageLinks / 2));
        const pageEnd = Math.min(totalPages, pageStart + maxPageLinks - 1);
        
        // First page
        if (pageStart > 1) {
            paginationHtml += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">1</a>
                </li>
            `;
            
            if (pageStart > 2) {
                paginationHtml += `
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `;
            }
        }
        
        // Page numbers
        for (let i = pageStart; i <= pageEnd; i++) {
            paginationHtml += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // Last page
        if (pageEnd < totalPages) {
            if (pageEnd < totalPages - 1) {
                paginationHtml += `
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `;
            }
            
            paginationHtml += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
                </li>
            `;
        }
        
        // Next button
        paginationHtml += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="next" ${this.currentPage === totalPages ? 'tabindex="-1"' : ''}>
                    Next <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;
        
        paginationHtml += '</ul>';
        
        this.paginationContainer.innerHTML = paginationHtml;
    }
    
    /**
     * Update the URL with current filter parameters
     */
    updateURL() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams();
        
        // Add category
        if (this.activeFilters.category) {
            params.set('category', this.activeFilters.category);
        }
        
        // Add price range
        if (this.activeFilters.minPrice !== null) {
            params.set('minPrice', this.activeFilters.minPrice);
        }
        
        if (this.activeFilters.maxPrice !== null) {
            params.set('maxPrice', this.activeFilters.maxPrice);
        }
        
        // Add brands
        if (this.activeFilters.brands.length > 0) {
            params.set('brands', this.activeFilters.brands.join(','));
        }
        
        // Add rating
        if (this.activeFilters.rating !== null) {
            params.set('rating', this.activeFilters.rating);
        }
        
        // Add sale and stock filters
        if (this.activeFilters.onSale) {
            params.set('onSale', 'true');
        }
        
        if (!this.activeFilters.inStock) {
            params.set('inStock', 'false');
        }
        
        // Add search query
        if (this.searchQuery) {
            params.set('search', this.searchQuery);
        }
        
        // Add sort option
        if (this.sortOption !== 'default') {
            params.set('sort', this.sortOption);
        }
        
        // Add page number (only if not page 1)
        if (this.currentPage > 1) {
            params.set('page', this.currentPage);
        }
        
        // Update URL without reloading the page
        const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.replaceState({}, '', newUrl);
    }
    
    /**
     * Add a product to the user's wishlist
     * @param {number} productId - The ID of the product to add
     */
    addToWishlist(productId) {
        // Get current wishlist from localStorage
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // Check if product is already in wishlist
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            
            // Save updated wishlist to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Show success message
            showToast('Product added to wishlist!');
        } else {
            // Remove from wishlist if already there
            wishlist = wishlist.filter(id => id !== productId);
            
            // Save updated wishlist to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Show message
            showToast('Product removed from wishlist!');
        }
    }
}

// Initialize filter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on the products page
    if (document.getElementById('products-container')) {
        window.productFilter = new ProductFilter();
    }
}); 