$(document).ready(function() {


   $('.suggest-title').on('click', function() { 
     $('.suggest-title').prop('disabled', true);
     $('.the-title').val('');
     $('#spinner').css('display', 'inline-block');
     
     var url = $('.the-url').val();
     
     $.get(
       '/getTitle?url=' + url,
       function(title) {
         $('.suggest-title').prop('disabled', false);
         $('#spinner').css('display', 'none');
         console.log(title)
         $('.the-title').val(title);
       }
      );
   });
});