let cart = [];

function displayProducts(filtered = products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  filtered.forEach((product, index) => {
    container.innerHTML += `
      <div class="product-card" style="animation-delay:${index * 0.1}s">
        <img src="${product.image}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

function filterCategory(category) {
  if (category === "all") {
    displayProducts();
  } else {
    displayProducts(products.filter(p => p.category === category));
  }
}

function searchProducts() {
  const value = document.getElementById("search").value.toLowerCase();
  displayProducts(products.filter(p => p.name.toLowerCase().includes(value)));
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  updateCart();
}

function updateCart() {
  document.getElementById("cart-count").innerText = cart.length;
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price;
    cartItems.innerHTML += `<p>${item.name} - $${item.price}</p>`;
  });

  document.getElementById("cart-total").innerText = "Total: $" + total;
}

function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.width = sidebar.style.width === "250px" ? "0" : "250px";
}

function openCart() {
  document.getElementById("cart-modal").style.display = "block";
}

function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

function scrollToProducts() {
  document.getElementById("products").scrollIntoView({behavior: "smooth"});
}

displayProducts();
