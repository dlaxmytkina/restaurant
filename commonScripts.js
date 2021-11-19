$(function(){
$('.menu_icon ').click(function () {
    $('.dark').toggle();
    $('.menu_icon').toggleClass('menu_open_icon');
    $('.header_adaptive').toggleClass('menu_open');
})

})