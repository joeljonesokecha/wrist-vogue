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
   CART SYSTEM
========================= */
function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  updateCart();
}

function updateCart() {
  const count = document.getElementById("cart-count");
count.innerText = cart.length;
count.style.transform = "scale(1.3)";
setTimeout(() => {
  count.style.transform = "scale(1)";
}, 200);

  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += item.price;
    cartItems.innerHTML += `<p>${item.name} - $${item.price}</p>`;
  });

  document.getElementById("cart-total").innerText = "Total: $" + total;
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
  } else {
    alert("Thank you for shopping with Wrist Vogue.");
    cart = [];
    updateCart();
    closeCart();
  }
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
  document.getElementById("cart-modal").style.display = "block";
}

function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
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
