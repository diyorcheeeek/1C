// Choco Aura - Logic

// 1. Data
const products = [
    {
        id: 1,
        name: "Пирожное 'Картошка'",
        desc: "Классический вкус в премиальном исполнении",
        price: 25000,
        image: "images/kartoshka.png"
    },
    {
        id: 2,
        name: "Медовик",
        desc: "Тонкие медовые коржи и нежный крем",
        price: 25000,
        image: "images/medovik.png"
    },
    {
        id: 3,
        name: "Баунти",
        desc: "Нежная кокосовая начинка и молочный шоколад",
        price: 25000,
        image: "images/bounty.png"
    },
    {
        id: 4,
        name: "Фисташковый Трюфель",
        desc: "Изысканные трюфели с натуральной фисташкой",
        price: 25000,
        image: "images/truffles.png"
    },
    {
        id: 5,
        name: "Банановое наслаждение",
        desc: "Экзотический вкус спелого банана",
        price: 25000,
        image: "images/kartoshka.png"
    },
    {
        id: 6,
        name: "Ramadan Box",
        desc: "Специальный набор для ифтара",
        price: 25000,
        image: "https://images.unsplash.com/photo-1586715697380-008066580556?q=80&w=800&auto=format&fit=crop",
        badge: "Ramadan Edition"
    }
];

let cart = [];

// 2. Elements
const productGrid = document.getElementById('product-grid');
const cartDrawer = document.getElementById('cart-drawer');
const cartToggle = document.getElementById('cart-toggle');
const cartClose = document.getElementById('cart-close');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotalLabel = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

// 3. Functions

// Render Products
function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card reveal">
            <div class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name font-luxury">${product.name}</h3>
                <p style="font-size: 0.85rem; color: #777; margin-bottom: 0.5rem;">${product.desc}</p>
                <p class="product-price">${product.price.toLocaleString()} UZS</p>
                <button class="btn-add" onclick="addToCart(${product.id})">В корзину</button>
            </div>
        </div>
    `).join('');

    // Re-initialize reveal animations
    initReveal();
}

// Cart Logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    toggleCart(true);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    // Items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align: center; margin-top: 2rem; opacity: 0.5;">Корзина пуста</p>`;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${item.price.toLocaleString()} UZS x ${item.quantity}</p>
                    <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color: #999; cursor:pointer; font-size: 0.8rem; margin-top: 5px;">Удалить</button>
                </div>
            </div>
        `).join('');
    }

    // Badge
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQty;

    // Total
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalLabel.textContent = `${totalAmount.toLocaleString()} UZS`;
}

function toggleCart(show) {
    if (show) {
        cartDrawer.classList.add('active');
        overlay.classList.add('active');
    } else {
        cartDrawer.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Checkout Flow
function checkout() {
    if (cart.length === 0) return;

    let message = "Добрый день! Хочу заказать в Choco Aura:\n\n";
    cart.forEach(item => {
        message += `• ${item.name} (x${item.quantity}) - ${item.price * item.quantity} UZS\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nИтого: ${total.toLocaleString()} UZS`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/998000000000?text=${encodedMessage}`; // Replace with actual phone
    const telegramUrl = `https://t.me/your_bot_user?text=${encodedMessage}`; // Replace with actual bot/user

    window.open(whatsappUrl, '_blank');
}

// 4. Initialization & Event Listeners

function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => observer.observe(reveal));
}

cartToggle.addEventListener('click', () => toggleCart(true));
cartClose.addEventListener('click', () => toggleCart(false));
overlay.addEventListener('click', () => toggleCart(false));
checkoutBtn.addEventListener('click', checkout);

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initReveal();
});
