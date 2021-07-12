
//Obtener datos del usuario 
var nombre = prompt("Ingrese su nombre", "Juan");
var apellido = prompt("Ingrese su apellido", "Perez");
var carrera = prompt("Ingrese sua carrera", "Desarrollo Web");

// Obtener del usuário el ramo 1 y sus respectivas notas
var ramo1 = prompt("Ingrese el ramo 1", "HTML");

var ramo1_nota1 = prompt("Ingrese la nota 1 [" + ramo1 + "]: ", "4");
ramo1_nota1 = parseInt(ramo1_nota1);

var ramo1_nota2 = prompt("Ingrese la nota 2 [" + ramo1 + "]: ", "5");
ramo1_nota2 = parseInt(ramo1_nota2);

var ramo1_nota3 = prompt("Ingrese la nota 3 [" + ramo1 + "]: ", "4");
ramo1_nota3 = parseInt(ramo1_nota3);

//Cálculo del promedio ramo 1
var ramo1_promedio = (ramo1_nota1 + ramo1_nota2 + ramo1_nota3) / 3;


// Obtener del usuário el ramo 2 y sus respectivas notas
var ramo2 = prompt("Ingrese el ramo 2", "CSS");

var ramo2_nota1 = prompt("Ingrese la nota 1 [" + ramo2 + "]: ", "3");
ramo2_nota1 = parseInt(ramo2_nota1);

var ramo2_nota2 = prompt("Ingrese la nota 2 [" + ramo2 + "]: ", "4");
ramo2_nota2 = parseInt(ramo2_nota2);

var ramo2_nota3 = prompt("Ingrese la nota 3 [" + ramo2 + "]: ", "5");
ramo2_nota3 = parseInt(ramo2_nota3);

//Cálculo del promedio ramo 2
var ramo2_promedio = (ramo2_nota1 + ramo2_nota2 + ramo2_nota3) / 3;


// Obtener del usuário el ramo 3 y sus respectivas notas
var ramo3 = prompt("Ingrese el ramo 3", "JavaScript");

var ramo3_nota1 = prompt("Ingrese la nota 1 [" + ramo3 + "]: ", "2");
ramo3_nota1 = parseInt(ramo3_nota1);

var ramo3_nota2 = prompt("Ingrese la nota 2 [" + ramo3 + "]: ", "6");
ramo3_nota2 = parseInt(ramo3_nota2);

// Como no tenemos la nota 3 del ramo 3 no es necesario incluirla, queda pendiente

// Obtener del usuario la nota de aprobación para el ramo 3
var nota_aprobacion = prompt("Ingrese la nota de aprobación para el ramo " + ramo3 , "4");

//Cálculo de la nota mínima para tener el promedio, de acuerdo a la nota de aprobación
var qtd_notas = 3;
var nota_minima = (nota_aprobacion * qtd_notas) - (ramo3_nota1 + ramo3_nota2);


//contenido que aparece en la página:
// criar una div contenedor
document.write("<div class='container mt-5'>");
// inserir logo
document.write("<div class='float-right'><img src='./assets/img/logo.PNG' alt='logo' class='logo'></div>");

//contenido de la página - arriba de la tabla
document.write("<h1>Notas finales</h1>");
document.write("<p class='font-weight-bold'>Nombre: " + "<span class='font-weight-normal text-secondary espacioNombre'>" + nombre + " " + apellido + "</span></p>");
document.write("<p class='font-weight-bold'>Carrera: " + "<span class='font-weight-normal text-secondary espacioCarrera'>" + carrera + "</span></p>");

//tabla con Bootstrap
document.write("<table class='table'>");
//definir el encabezado de la tabla con 5 columnas
document.write("<thead class='bg-dark text-white'>");
document.write("<tr>");
document.write("<th scope='col'>Ramo</th>");
document.write("<th scope='col'>Nota 1</th>");
document.write("<th scope='col'>Nota 2</th>");
document.write("<th scope='col'>Nota 3</th>");
document.write("<th scope='col'>Promedio</th>");
document.write("</tr");
document.write("</thead>");
//definir el cuerpo de la tabla con los datos de cada columna
document.write("<tbody>");
//linea de datos para el ramo 1
document.write("<tr>");
document.write("<th scope='row'>" + ramo1 + "</th>");
document.write("<td class='font-weight-bold'>" + ramo1_nota1 + "</td>");
document.write("<td class='font-weight-bold'>" + ramo1_nota2 + "</td>");
document.write("<td class='font-weight-bold'>" + ramo1_nota3 + "</td>");
document.write("<td class='font-weight-bold'>" + ramo1_promedio.toFixed(2) + "</td>");
document.write("</tr>");
//linea de datos para el ramo 2
document.write("<tr>");
document.write("<th scope='row'>" + ramo2 + "</th>");
document.write("<td class='font-weight-bold'>" + ramo2_nota1 + "</td>");
document.write("<td class='font-weight-bold'>" + ramo2_nota2 + "</td>");
document.write("<td class='font-weight-bold'>" + ramo2_nota3 + "</td>");
document.write("<td class='font-weight-bold'>" + ramo2_promedio.toFixed(2) + "</td>");
document.write("</tr>");
//linea de datos para el ramo 3
document.write("<tr>");
document.write("<th scope='row'>" + ramo3 + "</th>");
document.write("<td class='font-weight-bold'>" +ramo3_nota1 + "</td>");
document.write("<td class='font-weight-bold'>" + ramo3_nota2 + "</td>");
document.write("<td class='font-weight-bold'>" + "-" + "</td>");
document.write("<td class='font-weight-bold'>" + "-" + "</td>"); 
document.write("</tr>");
//cerrar el cuerpo de la tabla y la tabla
document.write("</tbody>");
document.write("</table>");

//mensaje final acerca de la nota de aprobación
document.write("<p class='text-secondary'>Para aprobar el ramo " + ramo3 + " con nota 4, necesitas obtener un " + nota_minima + " en la nota 3.</p>")

//cerrar el contenedor
document.write("</div>");

