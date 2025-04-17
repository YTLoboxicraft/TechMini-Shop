// --- Carrito persistente con localStorage ---

/**
 * Obtiene el carrito actual desde localStorage
 * @returns {Array} Array de objetos con id y qty
 */
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

/**
 * Guarda el carrito en localStorage
 * @param {Array} cart - Array de objetos con id y qty
 */
function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Añade un producto al carrito o incrementa su cantidad
 * @param {string|number} productId - ID del producto a añadir
 */
function addToCart(productId) {
    let cart = getCart();
    const idx = cart.findIndex(item => item.id == productId);
    if (idx > -1) {
        cart[idx].qty += 1;
    } else {
        cart.push({ id: productId, qty: 1 });
    }
    setCart(cart);
    updateCartCount();
}

/**
 * Elimina un producto del carrito
 * @param {string|number} productId - ID del producto a eliminar
 */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id != productId);
    setCart(cart);
    updateCartCount();
}

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {string|number} productId - ID del producto
 * @param {number} quantity - Nueva cantidad
 */
function updateCartItemQuantity(productId, quantity) {
    let cart = getCart();
    const idx = cart.findIndex(item => item.id == productId);
    
    if (idx > -1) {
        if (quantity <= 0) {
            // Si la cantidad es 0 o menos, eliminar el producto
            cart = cart.filter(item => item.id != productId);
        } else {
            cart[idx].qty = quantity;
        }
        setCart(cart);
        updateCartCount();
    }
}

/**
 * Actualiza el contador del carrito en la interfaz
 */
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = count;
}

/**
 * Vacía completamente el carrito
 */
function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
}

/**
 * Calcula el total de productos en el carrito
 * @returns {number} Número total de items
 */
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

/**
 * Verifica si un producto está en el carrito
 * @param {string|number} productId - ID del producto
 * @returns {boolean} true si el producto está en el carrito
 */
function isInCart(productId) {
    const cart = getCart();
    return cart.some(item => item.id == productId);
}

// Inicializar contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});
