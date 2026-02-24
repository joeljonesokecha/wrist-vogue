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
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    }
  });
});

document.querySelectorAll(".product-card").forEach(card => {
  card.style.opacity = 0;
  card.style.transform = "translateY(40px)";
  observer.observe(card);
});
