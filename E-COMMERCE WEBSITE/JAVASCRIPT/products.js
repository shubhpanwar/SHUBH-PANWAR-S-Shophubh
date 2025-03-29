// Product data
const products = [
    {
        id: 1,
        name: 'Ultraboost Running Shoes',
        category: 'Shoes',
        price: 129.99,
        oldPrice: 179.99,
        description: 'Premium running shoes with responsive cushioning and breathable mesh upper for maximum comfort.',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
            'https://images.unsplash.com/photo-1621665421578-00680715f80d'
        ],
        brand: 'Adidas',
        rating: 4.8,
        reviewCount: 152,
        inStock: true,
        isNew: false,
        isSale: true,
        featured: true,
        trending: false,
        attributes: {
            color: 'Black',
            size: '9.5',
            material: 'Mesh, Rubber'
        }
    },
    {
        id: 2,
        name: 'Wireless Noise-Cancelling Headphones',
        category: 'Electronics',
        price: 249.99,
        oldPrice: 299.99,
        description: 'Immersive sound with industry-leading noise cancellation. Long battery life and comfortable design for all-day listening.',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
            'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b'
        ],
        brand: 'Sony',
        rating: 4.9,
        reviewCount: 326,
        inStock: true,
        isNew: true,
        isSale: false,
        featured: true,
        trending: true,
        attributes: {
            color: 'Black',
            connectivity: 'Bluetooth 5.0',
            batteryLife: '30 hours'
        }
    },
    {
        id: 3,
        name: 'Premium Leather Jacket',
        category: 'Clothing',
        price: 189.99,
        oldPrice: null,
        description: 'Classic leather jacket made from premium materials. Stylish design that never goes out of fashion.',
        images: [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5',
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
            'https://images.unsplash.com/photo-1520975661595-6453be3f7070'
        ],
        brand: 'Urban Outfitters',
        rating: 4.7,
        reviewCount: 98,
        inStock: true,
        isNew: false,
        isSale: false,
        featured: false,
        trending: true,
        attributes: {
            color: 'Brown',
            size: 'M',
            material: 'Genuine Leather'
        }
    },
    {
        id: 4,
        name: 'Smart Fitness Watch',
        category: 'Electronics',
        price: 99.99,
        oldPrice: 129.99,
        description: 'Track your fitness goals, heart rate, sleep patterns and more. Water-resistant and with a long-lasting battery.',
        images: [
            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1',
            'https://images.unsplash.com/photo-1617043786394-f977fa12eddf',
            'https://images.unsplash.com/photo-1610438235354-a6ae5528385c'
        ],
        brand: 'Fitbit',
        rating: 4.5,
        reviewCount: 215,
        inStock: true,
        isNew: false,
        isSale: true,
        featured: true,
        trending: true,
        attributes: {
            color: 'Black',
            display: 'AMOLED',
            batteryLife: '7 days'
        }
    },
    {
        id: 5,
        name: 'Designer Sunglasses',
        category: 'Accessories',
        price: 159.99,
        oldPrice: 189.99,
        description: 'Stylish designer sunglasses with UV protection. Lightweight frame with durable construction.',
        images: [
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
            'https://images.unsplash.com/photo-1636640095378-21e17c81ee5e',
            'https://images.unsplash.com/photo-1604519848736-fc2acecd0d85'
        ],
        brand: 'Ray-Ban',
        rating: 4.6,
        reviewCount: 78,
        inStock: true,
        isNew: false,
        isSale: true,
        featured: false,
        trending: false,
        attributes: {
            color: 'Black/Gold',
            lensType: 'Polarized',
            material: 'Metal'
        }
    },
    {
        id: 6,
        name: 'Cotton Casual T-Shirt',
        category: 'Clothing',
        price: 29.99,
        oldPrice: null,
        description: 'Comfortable cotton t-shirt with a modern fit. Perfect for everyday wear.',
        images: [
            'https://images.unsplash.com/photo-1581655353564-df123a1eb820',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27'
        ],
        brand: 'H&M',
        rating: 4.3,
        reviewCount: 122,
        inStock: true,
        isNew: true,
        isSale: false,
        featured: true,
        trending: false,
        attributes: {
            color: 'White',
            size: 'L',
            material: '100% Cotton'
        }
    },
    {
        id: 7,
        name: 'Smart Home Speaker',
        category: 'Electronics',
        price: 79.99,
        oldPrice: 99.99,
        description: 'Voice-controlled smart speaker with premium sound quality. Control your smart home and enjoy music, news, and more.',
        images: [
            'https://images.unsplash.com/photo-1589894404892-7d598f418a42',
            'https://images.unsplash.com/photo-1558089687-f282ffcbc096',
            'https://images.unsplash.com/photo-1598447058132-de924a39bfa5'
        ],
        brand: 'Amazon',
        rating: 4.4,
        reviewCount: 245,
        inStock: true,
        isNew: false,
        isSale: true,
        featured: true,
        trending: true,
        attributes: {
            color: 'Charcoal',
            connectivity: 'Wi-Fi, Bluetooth',
            compatibility: 'Alexa'
        }
    },
    {
        id: 8,
        name: 'Canvas Backpack',
        category: 'Accessories',
        price: 49.99,
        oldPrice: 59.99,
        description: 'Durable canvas backpack with multiple compartments. Perfect for school, travel, or everyday use.',
        images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
            'https://images.unsplash.com/photo-1581605405669-fcdf81165afa',
            'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3'
        ],
        brand: 'Herschel',
        rating: 4.2,
        reviewCount: 87,
        inStock: true,
        isNew: false,
        isSale: true,
        featured: false,
        trending: true,
        attributes: {
            color: 'Navy Blue',
            capacity: '25L',
            material: 'Canvas'
        }
    }
];

// Categories data
const categories = [
    {
        id: 1,
        name: 'Shoes',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        count: 120
    },
    {
        id: 2,
        name: 'Electronics',
        image: 'https://images.unsplash.com/photo-1588117305388-c2631a279f82',
        count: 85
    },
    {
        id: 3,
        name: 'Clothing',
        image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9',
        count: 210
    },
    {
        id: 4,
        name: 'Accessories',
        image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111',
        count: 75
    }
];

// Helper function to filter products
function filterProducts(criteria) {
    return products.filter(product => {
        let match = true;
        
        if (criteria.category && criteria.category !== 'all') {
            match = match && product.category === criteria.category;
        }
        
        if (criteria.minPrice !== undefined) {
            match = match && product.price >= criteria.minPrice;
        }
        
        if (criteria.maxPrice !== undefined) {
            match = match && product.price <= criteria.maxPrice;
        }
        
        if (criteria.featured !== undefined) {
            match = match && product.featured === criteria.featured;
        }
        
        if (criteria.trending !== undefined) {
            match = match && product.trending === criteria.trending;
        }
        
        if (criteria.search) {
            const searchLower = criteria.search.toLowerCase();
            match = match && (
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower) ||
                product.category.toLowerCase().includes(searchLower) ||
                product.brand.toLowerCase().includes(searchLower)
            );
        }
        
        return match;
    });
}

// Get products by criteria
function getProducts(criteria = {}) {
    const filteredProducts = filterProducts(criteria);
    
    // Sort products
    if (criteria.sort) {
        switch (criteria.sort) {
            case 'price-low-high':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-a-z':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-z-a':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Default is featured
                filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
    }
    
    return filteredProducts;
}

// Get products by ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

// Get featured products
function getFeaturedProducts() {
    return products.filter(product => product.featured);
}

// Get trending products
function getTrendingProducts() {
    return products.filter(product => product.trending);
}

// Get all categories
function getCategories() {
    return categories;
}

// Get a category by ID
function getCategoryById(id) {
    return categories.find(category => category.id === parseInt(id));
}

// Get all products
function getAllProducts() {
    return products;
}

// Get products by category
function getProductsByCategory(categoryName) {
    return products.filter(product => product.category.toLowerCase() === categoryName.toLowerCase());
}

// Get new products
function getNewProducts() {
    return products.filter(product => product.new);
}

// Get products on sale
function getProductsOnSale() {
    return products.filter(product => product.discount > 0);
}

// Get related products
function getRelatedProducts(productId) {
    const product = getProductById(productId);
    if (!product) return [];
    
    return product.relatedProducts.map(id => getProductById(id));
}

// Advanced search functionality
function searchProducts(query, filters = {}) {
    if (!query && Object.keys(filters).length === 0) {
        return products;
    }
    
    let filteredProducts = [...products];
    
    // Apply text search if query exists
    if (query) {
        const searchTerms = query.toLowerCase().split(' ');
        filteredProducts = filteredProducts.filter(product => {
            const searchableText = `${product.name} ${product.description} ${product.brand} ${product.category}`.toLowerCase();
            return searchTerms.every(term => searchableText.includes(term));
        });
    }
    
    // Apply category filter
    if (filters.category) {
        filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase() === filters.category.toLowerCase()
        );
    }
    
    // Apply price range filter
    if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
            product.price >= filters.minPrice
        );
    }
    
    if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
            product.price <= filters.maxPrice
        );
    }
    
    // Apply brand filter
    if (filters.brand) {
        const brands = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
        filteredProducts = filteredProducts.filter(product => 
            brands.includes(product.brand)
        );
    }
    
    // Apply rating filter
    if (filters.minRating !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
            product.rating >= filters.minRating
        );
    }
    
    // Apply availability filter
    if (filters.inStock !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
            product.inStock === filters.inStock
        );
    }
    
    // Apply discount filter
    if (filters.onSale !== undefined && filters.onSale) {
        filteredProducts = filteredProducts.filter(product => 
            product.discount > 0
        );
    }
    
    // Apply attribute filters (color, size, etc.)
    if (filters.attributes) {
        Object.entries(filters.attributes).forEach(([key, value]) => {
            filteredProducts = filteredProducts.filter(product => {
                if (!product.attributes || !product.attributes[key]) {
                    return false;
                }
                
                if (Array.isArray(product.attributes[key])) {
                    if (Array.isArray(value)) {
                        return value.some(v => product.attributes[key].includes(v));
                    } else {
                        return product.attributes[key].includes(value);
                    }
                } else {
                    return product.attributes[key] === value;
                }
            });
        });
    }
    
    return filteredProducts;
}

// Sort products
function sortProducts(products, sortBy = 'default') {
    const sortedProducts = [...products];
    
    switch(sortBy) {
        case 'name-asc':
            return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        case 'price-asc':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'rating-desc':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        case 'discount-desc':
            return sortedProducts.sort((a, b) => b.discount - a.discount);
        case 'newest':
            return sortedProducts.sort((a, b) => b.new - a.new);
        default:
            return sortedProducts;
    }
}

// Get unique brands from all products
function getAllBrands() {
    const brands = new Set(products.map(product => product.brand));
    return Array.from(brands);
}

// Get price range
function getPriceRange() {
    let minPrice = Infinity;
    let maxPrice = 0;
    
    products.forEach(product => {
        minPrice = Math.min(minPrice, product.price);
        maxPrice = Math.max(maxPrice, product.price);
    });
    
    return { minPrice, maxPrice };
}

// Get all attributes and their possible values
function getAllAttributes() {
    const attributes = {};
    
    products.forEach(product => {
        if (product.attributes) {
            Object.entries(product.attributes).forEach(([key, value]) => {
                if (!attributes[key]) {
                    attributes[key] = new Set();
                }
                
                if (Array.isArray(value)) {
                    value.forEach(v => attributes[key].add(v));
                } else {
                    attributes[key].add(value);
                }
            });
        }
    });
    
    // Convert Sets to Arrays
    Object.keys(attributes).forEach(key => {
        attributes[key] = Array.from(attributes[key]);
    });
    
    return attributes;
}

// Calculate discount price
function getDiscountedPrice(product) {
    if (!product.discount) return product.price;
    return product.price * (1 - product.discount / 100);
}

// Pagination helper
function paginateProducts(products, page = 1, perPage = 10) {
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    
    return {
        total: products.length,
        totalPages: Math.ceil(products.length / perPage),
        currentPage: page,
        products: products.slice(startIndex, endIndex)
    };
}

// Helper to get random products
function getRandomProducts(count = 4) {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAllProducts,
        getProductById,
        getProductsByCategory,
        getFeaturedProducts,
        getNewProducts,
        getProductsOnSale,
        getRelatedProducts,
        getCategories,
        getCategoryById,
        searchProducts,
        sortProducts,
        getAllBrands,
        getPriceRange,
        getAllAttributes,
        getDiscountedPrice,
        paginateProducts,
        getRandomProducts
    };
} 