
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

$('.carousel').carousel({
    interval: 5000, //5 sec
    ride: 'carousel',
});

$('.carousel').carousel('cycle');

$('#carouselExampleIndicators').on('slide.bs.carousel', function (event) {
    console.log('Slide event triggered from index:', event.from, 'to index:', event.to);
});