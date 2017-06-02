$(document).ready(function() {
  
  $('.accordion-header').click(function() {
    if($(this).hasClass('active')) {
      $(this).next().slideUp();
      $(this).removeClass('active');
    } else {
      $('.accordion-header').next().slideUp();
      $('.accordion-header').removeClass('active');
      $(this).next().slideDown();
      $(this).addClass('active');
    }
   });
  
});