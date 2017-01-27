$(document).ready(function() {
    $('.wavvy__button').on('click', function() {
         if ($(this).hasClass('open')) {
             $('.hello, .skills').fadeIn();
             $('.readings').hide();  
             $(this).removeClass('open');
         } else {
             $('.hello, .skills').hide();
             $('.readings').fadeIn();  
             $(this).addClass('open');
         }
    });
});
