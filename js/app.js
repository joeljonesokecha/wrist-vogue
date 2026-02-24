let cart = [];

/* =========================
   DISPLAY PRODUCTS
========================= */
function displayProducts(filtered = products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  filtered.forEach((product, index) => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${product.image}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });

  activateScrollAnimation();
}

/* =========================
   CATEGORY FILTER
========================= */
function filterCategory(category) {
  if (category === "all") {
    displayProducts(products);
  } else {
    displayProducts(products.filter(p => p.category === category));
  }
}

/* =========================
   SEARCH
========================= */
function searchProducts() {
  const value = document.getElementById("search").value.toLowerCase();
  displayProducts(products.filter(p => 
    p.name.toLowerCase().includes(value)
  ));
}

/* =========================
   CART SYSTEM (UPGRADED)
========================= */
function addToCart(id) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({...product, quantity: 1});
  }

  updateCart();
}

function updateCart() {
  const count = document.getElementById("cart-count");
  count.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <h4>${item.name}</h4>
        <p>$${item.price}</p>

        <div class="cart-item-controls">
          <button onclick="changeQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${item.id}, 1)">+</button>
          <button onclick="removeItem(${item.id})">Remove</button>
        </div>
      </div>
    `;
  });

  document.getElementById("cart-total").innerText = "Total: $" + total;
}

function changeQuantity(id, amount) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  updateCart();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
                                }

/* =========================
   SIDEBAR (FIXED VERSION)
========================= */
function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("active");
}

/* Close sidebar when clicking outside */
document.addEventListener("click", function(e) {
  const sidebar = document.getElementById("sidebar");
  const menuIcon = document.querySelector(".menu-icon");

  const clickedInsideSidebar = sidebar.contains(e.target);
  const clickedMenuIcon = menuIcon.contains(e.target);

  if (!clickedInsideSidebar && !clickedMenuIcon) {
    sidebar.classList.remove("active");
  }
});

/* =========================
   CART MODAL
========================= */
function openCart() {
  document.getElementById("cart-panel").classList.add("active");
  document.getElementById("cart-overlay").classList.add("active");
}

function closeCart() {
  document.getElementById("cart-panel").classList.remove("active");
  document.getElementById("cart-overlay").classList.remove("active");
}

/* =========================
   SCROLL ANIMATION
========================= */
function activateScrollAnimation() {
  const cards = document.querySelectorAll(".product-card");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
      }
    });
  });

  cards.forEach(card => {
    card.style.opacity = 0;
    card.style.transform = "translateY(40px)";
    observer.observe(card);
  });
}

/* =========================
   INIT
========================= */
displayProducts();

document.getElementById("cart-overlay").addEventListener("click", closeCart);
