$('.carousel').carousel({
    interval: 5000, //5 sec
    ride: 'carousel',
});

$('.carousel').carousel('cycle');

$('#carouselExampleIndicators').on('slide.bs.carousel', function (event) {
    console.log('Slide event triggered from index:', event.from, 'to index:', event.to);
});