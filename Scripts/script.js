document.querySelector('.cart').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default link behavior
  const cartWindow = document.querySelector('.cart-window');
  cartWindow.style.display = cartWindow.style.display === 'block' ? 'none' : 'block';
});

const cart_el = document.querySelector('.cart-items');

