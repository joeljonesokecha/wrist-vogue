let cart = [];

function displayProducts(filtered = products) {
    const container = document.getElementById("products");
    container.innerHTML = "";

    filtered.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${product.image}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    });
}

function filterCategory(category) {
    displayProducts(products.filter(p => p.category === category));
}

function searchProducts() {
    const value = document.getElementById("search").value.toLowerCase();
    displayProducts(products.filter(p => p.name.toLowerCase().includes(value)));
}

function addToCart(id) {
    cart.push(products.find(p => p.id === id));
    document.getElementById("cart-count").innerText = cart.length;
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

displayProducts();
