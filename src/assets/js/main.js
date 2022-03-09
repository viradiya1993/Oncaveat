$(document).ready(function(){
  $(".toggle-bar").click(function(){
    $(".toggle-bar").toggleClass("active");
    $(".menu nav").toggleClass("active");
    $("body").toggleClass("overflow");
    $(".m-over").toggleClass("overlay");
  });
  $(".toggle-bar-2").click(function(){
    $(".toggle-bar-2").toggleClass("active");
    $(".dash-main .menu").toggleClass("active");
    $("body").toggleClass("overflow");
    $(".m-over").toggleClass("overlay");
  });
var owl = $('.lawyers-slider');
      owl.owlCarousel({
        margin: 10,
        loop: true,
        dots: true,
        item:3,
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: 2
          },
          1000: {
            items: 3
          }
        }
})

$(function(){
$('nav li a').filter(function(){return this.href==location.href}).parent().addClass('active').siblings().removeClass('active')
  $('nav li a').click(function(){
      $(this).parent().addClass('active').siblings().removeClass('active')
  })
})

$(function(){
$('.menu ul li a').filter(function(){return this.href==location.href}).parent().addClass('active').siblings().removeClass('active')
  $('.menu ul li a').click(function(){
      $(this).parent().addClass('active').siblings().removeClass('active')
  })
})

$('.a-listing .edit').click(function (e) {
  $(this).parent(".a-main").next(".a-toggle").slideDown();
});

$('.a-toggle .a-close').click(function (e) {
      $(this).parent(".a-toggle").slideUp();
});


    // $(".sign-in").click(function(){
    //   $("#sign-in").hide();
    //   $("#sign-up").show();
    // });
    // $(".f-pass").click(function(){
    //   $("#forgot-password").hide();
    // });
    // $(".sign-up-link").click(function(){
    //   $("#sign-up").hide();
    //   $("#sign-in").show();
    //    $(".s-in.modal.fade").addClass("show");

    // });
    // $(".modal-header .close").click(function(){
    //   $(".modal-backdrop.fade.show").removeClass(".fade.show");
    // });
    // $(".modal-backdrop").click(function(){
    //   $(".modal-backdrop.fade.show").removeClass(".fade.show");
    // });
});
// if ('serviceWorker' in navigator) {
//  // alert('ok')

//   //   navigator.serviceWorker.register('/ngsw-worker.js').then(function(registration) {
//   //     console.log('Service worker registration succeeded:', registration);
//   //   }, /*catch*/ function(error) {
//   //     console.log('Service worker registration failed:', error);
//   //   });
//   // } else {
//   // console.log('Service workers are not supported.');
// }
