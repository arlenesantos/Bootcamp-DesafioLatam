$(document).ready(function(){

  // smooth scroll
  $("a.scroll").click(function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var gato = this.hash;
      $('html, body').animate({
        scrollTop: $(gato).offset().top -40
      }, 800);
    }
  });

  // tooltip en la sección de destacados
  $('[data-toggle="tooltip"]').tooltip();  

})
