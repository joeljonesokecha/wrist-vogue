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
