/* js/app.js */
import products from '../products/products.js';

// --- State Management ---
let cart = [];
let currentCategory = 'all';
let currentSearch = '';

// --- DOM Elements ---
const grid = document.getElementById('product-grid');
const loader = document.getElementById('loader');
const searchInput = document.getElementById('search-input');
const nav = document.querySelector('.navbar');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const cartItemsContainer = document.querySelector('.cart-items');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Simulate Loading
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 800);
    }, 1500);

    renderProducts();
    setupEventListeners();
    setupScrollReveal();
});

// --- Core Functions ---

function renderProducts() {
    grid.innerHTML = '';
    
    // Filter Logic
    const filtered = products.filter(p => {
        const matchesCat = currentCategory === 'all' || p.category === currentCategory;
        const matchesSearch = p.name.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color:white; text-align:center; grid-column:1/-1;">No timepieces found.</p>';
        return;
    }

    // Generate Cards
    filtered.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.transitionDelay = `${index * 100}ms`; // Staggered animation
        card.innerHTML = `
            <div class="img-wrapper">
                <img src="${product.images[0]}" alt="${product.name}">
            </div>
            <div class="product-info">
                <span class="cat">${product.category}</span>
                <h3>${product.name}</h3>
                <p class="price">UGX ${product.price.toLocaleString()}</p>
            </div>
        `;
        
        // Open Modal Event
        card.addEventListener('click', () => openModal(product));
        grid.appendChild(card);
    });

    // Re-trigger scroll observer for new elements
    setupScrollReveal();
}

// --- Cart System ---

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    openCartSidebar();
}

function updateCartUI() {
    // Update Badge
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCount.innerText = totalQty;

    // Update List
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your collection is empty.</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.qty;
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <img src="${item.images[0]}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>UGX ${item.price.toLocaleString()}</p>
                    <div class="cart-controls">
                        <button onclick="changeQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="remove-item" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></div>
            `;
            cartItemsContainer.appendChild(el);
        });
    }

    cartTotal.innerText = `UGX ${total.toLocaleString()}`;
    
    // Attach event listeners to dynamically created buttons
    // Note: In vanilla JS without event delegation, inline onclicks (above) need global scope
    // or we attach listeners manually. For simplicity here, we expose helpers to window.
}

window.changeQty = (id, change) => {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) removeItem(id);
        else updateCartUI();
    }
};

window.removeItem = (id) => {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
};

// --- Modal System ---
let currentModalImageIndex = 0;
let currentModalProduct = null;

function openModal(product) {
    currentModalProduct = product;
    currentModalImageIndex = 0;
    
    const modal = document.getElementById('product-modal');
    document.getElementById('modal-title').innerText = product.name;
    document.getElementById('modal-cat').innerText = product.category;
    document.getElementById('modal-desc').innerText = product.description;
    document.getElementById('modal-price').innerText = `UGX ${product.price.toLocaleString()}`;
    updateModalImage();
    
    // Add to cart button logic
    const btn = document.getElementById('modal-add-btn');
    btn.onclick = () => {
        addToCart(product);
        modal.classList.remove('active');
    };

    modal.classList.add('active');
}

function updateModalImage() {
    const img = document.getElementById('modal-img');
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = currentModalProduct.images[currentModalImageIndex];
        img.style.opacity = '1';
    }, 200);
}

// --- Event Listeners ---
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderProducts();
    });

    // Category Filter (Sidebar)
    document.querySelectorAll('.sidebar-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active class
            document.querySelectorAll('.sidebar-links a').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            
            currentCategory = e.target.dataset.filter;
            document.querySelector('.sidebar').classList.remove('active');
            document.querySelector('.sidebar-overlay').classList.remove('active');
            
            // Scroll to shop
            document.getElementById('shop').scrollIntoView({behavior: 'smooth'});
            renderProducts();
        });
    });

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });

    // Sidebars (Nav & Cart)
    const toggleSidebar = (sel, show) => {
        const el = document.querySelector(sel);
        const overlay = document.querySelector(sel + '-overlay');
        if (show) { el.classList.add('active'); overlay.classList.add('active'); }
        else { el.classList.remove('active'); overlay.classList.remove('active'); }
    };

    document.querySelector('.hamburger').onclick = () => toggleSidebar('.sidebar', true);
    document.querySelector('.close-sidebar').onclick = () => toggleSidebar('.sidebar', false);
    document.querySelector('.sidebar-overlay').onclick = () => toggleSidebar('.sidebar', false);

    document.querySelector('.cart-icon').onclick = () => toggleSidebar('.cart-sidebar', true);
    document.querySelector('.close-cart').onclick = () => toggleSidebar('.cart-sidebar', false);
    document.querySelector('.cart-overlay').onclick = () => toggleSidebar('.cart-sidebar', false);

    // Modal Controls
    document.querySelector('.close-modal').onclick = () => document.getElementById('product-modal').classList.remove('active');
    document.querySelector('.modal-overlay').onclick = (e) => {
        if(e.target.classList.contains('modal-overlay')) document.getElementById('product-modal').classList.remove('active');
    };
    
    document.getElementById('next-img').onclick = () => {
        if(currentModalProduct) {
            currentModalImageIndex = (currentModalImageIndex + 1) % currentModalProduct.images.length;
            updateModalImage();
        }
    };
    document.getElementById('prev-img').onclick = () => {
        if(currentModalProduct) {
            currentModalImageIndex = (currentModalImageIndex - 1 + currentModalProduct.images.length) % currentModalProduct.images.length;
            updateModalImage();
        }
    };
}

function openCartSidebar() {
    document.querySelector('.cart-sidebar').classList.add('active');
    document.querySelector('.cart-overlay').classList.add('active');
}

// --- Scroll Reveal Animation ---
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card').forEach(el => observer.observe(el));
  }
                          
