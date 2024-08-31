const { Template } = require("ejs");



$('.carousel').carousel({
    interval: 3000, //5 sec
    ride: 'carousel',
});

$('.carousel').carousel('cycle');

$('#carouselExampleIndicators').on('slide.bs.carousel', function (event) {
    console.log('Slide event triggered from index:', event.from, 'to index:', event.to);
});


const shoes = document.querySelector('.shoes-container');
const shoe = document.querySelector('.shoe');
const shoesArr = document.querySelectorAll('.shoe');
