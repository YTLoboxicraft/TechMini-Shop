// Get product ID from URL parameters
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'), 10);
}

// Cart functions for localStorage persistence
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
    const cart = getCart();
    cart.push(productId);
    saveCart(cart);
    updateCartCount();
    
    // Show confirmation message
    const confirmMsg = document.createElement('div');
    confirmMsg.className = 'cart-confirmation';
    confirmMsg.textContent = 'Product added to cart!';
    document.body.appendChild(confirmMsg);
    
    // Remove message after 2 seconds
    setTimeout(() => {
        confirmMsg.style.opacity = '0';
        setTimeout(() => confirmMsg.remove(), 500);
    }, 2000);
}

function updateCartCount() {
    const cartItems = getCart();
    const countElement = document.getElementById('cartCount');
    if (countElement) {
        countElement.textContent = cartItems.length;
        countElement.style.display = cartItems.length ? 'inline-block' : 'none';
    }
}

// Render product details on the page
function renderProductDetails(product) {
    const container = document.getElementById('productDetails');
    if (!product) {
        container.innerHTML = "<p>Product not found.</p>";
        return;
    }

    // Carrusel HTML
    let carouselHtml = `
        <div class="carousel">
            <button  id="prevImg">⬅️</button>
            <img id="carouselImg" src="${product.images[0]}" alt="${product.name}" class="carousel-img">
            <button  id="nextImg">➡️</button>
        </div>
    `;

    container.innerHTML = `
        <h2>${product.name}</h2>
        ${carouselHtml}
        <p class="price">$${product.price}</p>
        <ul>
            ${product.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <button class="add-cart-btn" data-id="${product.id}">Add to Cart</button>
        <p style="margin-top:2rem;"><a href="index.html">&larr; Back to products</a></p>
    `;

    // Carrusel JS
    let currentImg = 0;
    const imgEl = document.getElementById('carouselImg');
    document.getElementById('prevImg').onclick = function() {
        currentImg = (currentImg - 1 + product.images.length) % product.images.length;
        imgEl.src = product.images[currentImg];
    };
    document.getElementById('nextImg').onclick = function() {
        currentImg = (currentImg + 1) % product.images.length;
        imgEl.src = product.images[currentImg];
    };

    // Add to cart with animation
    container.querySelector('.add-cart-btn').onclick = function() {
        // Create animation effect
        const btn = this;
        btn.classList.add('adding');
        setTimeout(() => btn.classList.remove('adding'), 500);
        
        // Add to persistent cart
        addToCart(product.id);
    };
}

document.addEventListener('DOMContentLoaded', function() {
    const productId = getProductIdFromUrl();
    const product = products.find(p => p.id === productId);
    renderProductDetails(product);
    updateCartCount();
});
