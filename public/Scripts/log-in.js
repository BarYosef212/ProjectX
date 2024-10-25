function openDialog() {
    const dialog = document.getElementById('dialog');
    if (dialog) {
        dialog.style.display = 'block'; 
        dialog.classList.add('jump'); 
    }
}

function closeDialog() {
    const dialog = document.getElementById('dialog');
    if (dialog) {
        dialog.style.display = 'none'; 
        dialog.classList.remove('jump'); 
    }
}

const cartIcon = document.querySelector('.cart');
const cartWindow = document.querySelector('.cart-window');

// Toggle on click
cartIcon.addEventListener('click', function(event) {
    event.preventDefault();
    cartWindow.classList.toggle('show');
});

// Show on hover
cartIcon.addEventListener('mouseenter', function() {
    cartWindow.classList.add('show');
});

// Hide when the mouse leaves the cart window
cartWindow.addEventListener('mouseleave', function() {
    cartWindow.classList.remove('show');
});


