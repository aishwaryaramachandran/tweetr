//solely responsible for the chanracter counter
$(document).ready(function(){
  const limit = 140;
  const errorClass = 'counter-color';

  $('#tweet-composer').on('input', function(){
    var typed = ($(this).val().length);
    var counter = $(this).parent().find('.counter');
    var remainingChars = limit - typed;
    if (remainingChars < 0) {
      counter.addClass(errorClass);
    } else {
      counter.removeClass(errorClass);
    }
    counter.text(remainingChars);
  });
});





