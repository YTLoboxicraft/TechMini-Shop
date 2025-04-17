/**
 * main.js
 * Adapted: robust cart logic, price handling, and responsive class for mobile/desktop.
 * 
 * SUGERENCIA CSS:
 * Usa en tu CSS:
 * body.mobile .product { width: 100%; font-size: 1.1em; }
 * body.desktop .product { width: 30%; min-width: 250px; }
 * body.mobile .product-img { width: 100%; height: auto; }
 * body.desktop .product-img { width: 100%; height: 200px; object-fit: cover; }
 */

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Render products
function renderProducts() {
    const productList = document.getElementById('productList');
    if (!productList || typeof products === 'undefined') return;
    
    productList.innerHTML = '';
    products.forEach(product => {
        const price = parseFloat(product.price);
        const displayPrice = isNaN(price) ? 0 : price;
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${product.images && product.images[0] ? product.images[0] : ''}" alt="${product.name}" class="product-img">
            <h3>${product.name}</h3>
            <p class="price">$${displayPrice}</p>
            <p>${product.short || ''}</p>
            <a class="details-btn" href="product.html?id=${product.id}">View Details</a>
            <button class="add-cart-btn" data-id="${product.id}">Add to Cart</button>
        `;
        productList.appendChild(div);
    });
}

// Modal for product details
function showProductModal(productId) {
    const productModal = document.getElementById('productModal');
    const modalDetails = document.getElementById('modalDetails');
    if (!productModal || !modalDetails || typeof products === 'undefined') return;
    
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) {
        modalDetails.innerHTML = `<p>Product not found.</p>`;
        productModal.style.display = 'block';
        return;
    }
    
    const price = parseFloat(product.price);
    const displayPrice = isNaN(price) ? 0 : price;
    
    modalDetails.innerHTML = `
        <h2>${product.name}</h2>
        <img src="${product.images && product.images[0] ? product.images[0] : ''}" alt="${product.name}" class="modal-img">
        <p class="price">$${displayPrice}</p>
        <ul>
            ${product.features ? product.features.map(f => `<li>${f}</li>`).join('') : ''}
        </ul>
        <button class="add-cart-btn" data-id="${product.id}">Add to Cart</button>
    `;
    productModal.style.display = 'block';
}

// Modal for cart - works on any page
function showCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    if (!cartItems || !cartTotal || typeof products === 'undefined') return;
    
    const cart = getCart();
    
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.innerHTML = '';
        return;
    }
    
    let total = 0;
    cart.forEach(item => {
        const product = products.find(p => String(p.id) === String(item.id));
        if (!product) {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>Unknown product (ID: ${item.id}) x${item.qty}</span>
                <span>$0</span>
                <button class="remove-cart-btn" data-id="${item.id}">Remove</button>
            `;
            cartItems.appendChild(div);
            return;
        }
        
        const price = parseFloat(product.price);
        const itemTotal = (isNaN(price) ? 0 : price) * item.qty;
        total += itemTotal;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${product.name} x${item.qty}</span>
            <span>$${itemTotal}</span>
            <button class="remove-cart-btn" data-id="${item.id}">Remove</button>
        `;
        cartItems.appendChild(div);
    });
    cartTotal.innerHTML = `<strong>Total: $${total}</strong>`;
}

// Add to cart
function addToCart(productId) {
    const id = String(productId);
    let cart = getCart();

    const idx = cart.findIndex(item => String(item.id) === id);
    if (idx > -1) {
        cart[idx].qty += 1;
    } else {
        cart.push({ id: id, qty: 1 });
    }

    saveCart(cart);
    updateCartCount();
}

// Remove from cart
function removeFromCart(productId) {
    const id = String(productId);
    let cart = getCart();

    cart = cart.filter(item => String(item.id) !== id);

    saveCart(cart);
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;
    
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = count;
}

// Responsive logic: adds .mobile or .desktop to <body>
function setResponsiveClass() {
    const width = window.innerWidth;
    if (width <= 768) {
        document.body.classList.add('mobile');
        document.body.classList.remove('desktop');
    } else {
        document.body.classList.add('desktop');
        document.body.classList.remove('mobile');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Responsive
    setResponsiveClass();
    window.addEventListener('resize', setResponsiveClass);
    
    // Get DOM elements
    const productList = document.getElementById('productList');
    const productModal = document.getElementById('productModal');
    const modalDetails = document.getElementById('modalDetails');
    const closeModal = document.getElementById('closeModal');
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    
    // Product list event listener (index page)
    if (productList) {
        productList.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-cart-btn')) {
                addToCart(e.target.dataset.id);
            }
        });
    }
    
    // Product modal event listeners
    if (modalDetails) {
        modalDetails.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-cart-btn')) {
                addToCart(e.target.dataset.id);
            }
        });
    }
    
    if (closeModal && productModal) {
        closeModal.onclick = () => productModal.style.display = 'none';
    }
    
    // Cart modal event listeners (all pages)
    if (cartIcon && cartModal) {
        cartIcon.onclick = function() {
            showCartModal();
            cartModal.style.display = 'block';
        };
    }
    
    if (closeCart && cartModal) {
        closeCart.onclick = () => cartModal.style.display = 'none';
    }
    
    if (cartItems) {
        cartItems.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-cart-btn')) {
                removeFromCart(e.target.dataset.id);
                showCartModal();
            }
        });
    }
    
    // Window click event for modals
    window.onclick = function(event) {
        if (productModal && event.target == productModal) {
            productModal.style.display = 'none';
        }
        if (cartModal && event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    };
    
    // Initialize
    renderProducts();
    updateCartCount();
});
