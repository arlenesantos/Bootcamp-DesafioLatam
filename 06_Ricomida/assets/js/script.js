
$(function () {

  //tooltips
  $('[data-toggle="tooltip"]').tooltip();

  //botón correo
  $("#enviarCorreo").on("click", function(){
    alert("El correo fue enviado correctamente");
  });

  // Selectores de etiqueta
  $("h6").on("dblclick", function(){
    $(this).css("color", "red");
  });

  // Selectores de clase
  $(".card-title").on("click", function(){
    $(".card-text").toggle();
  });

})