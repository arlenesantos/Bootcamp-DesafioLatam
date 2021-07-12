$(document).ready(function(){

    $('form').submit(function(event){
        event.preventDefault();
        //Capturar la información ingresada por el usuario
        let valorInput = Number($('#heroInput').val());

        //Validar la información ingresada por el usuario, la cual, solo debe ser un número         
        if ((isNaN(valorInput)) || (valorInput < 1) || (valorInput > 731)){
            alert("Por favor ingrese solo números entre 1 y 731");
            return;
        };        
        
        //Consultar la API mediante AJAX con la sintaxis de jQuery        
        $.ajax({
            type:"GET",
            url:"https://superheroapi.com/api.php/1913977368761121/" + valorInput,
            dataType:"json",
            success: function(data) {
                let nombre = data['name'];
                let conexiones = data['connections']['group-affiliation'];
                let publicado = data['biography']['publisher'];
                let ocupacion = data['work']['occupation'];
                let aparicion = data['biography']['first-appearance'];
                let altura = data['appearance']['height'];
                let peso = data['appearance']['weight'];
                let alianzas = data['biography']['aliases'];
                let imagen = data['image']['url'];
                
                
                //Renderizar la información recibida por la API con cards de Bootstrap
                $('#heroInfo').html(`
                    <h2 class="text-center">SuperHero Encontrado</h2>
                    <div class="container card mb-3 p-0">
                        <div class="row no-gutters">
                            <div class="col-md-4">
                                <img src="${imagen}" class="card-img" alt="Imagen del héroe buscado">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title"><span>Nombre: </span>${nombre}</h5>
                                    <p class="card-text"><span>Conexiones: </span>${conexiones}</p>
                                    <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><span class="font-italic">Publicado por: </span>${publicado}</li>
                                    <li class="list-group-item"><span class="font-italic">Ocupación: </span>${ocupacion}</li>
                                    <li class="list-group-item"><span class="font-italic">Primera Aparición: </span>${aparicion}</li>
                                    <li class="list-group-item"><span class="font-italic">Altura: </span>${altura.join(' - ')}</li>
                                    <li class="list-group-item"><span class="font-italic">Peso: </span>${peso.join(' - ')}</li>
                                    <li class="list-group-item"><span class="font-italic">Alianzas: </span>${alianzas}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>             
                `);

                //Utilizar ciclos y métodos que permitan recorrer, ordenar y mostrar la información
                let estadisticas = [];
                Object.entries(data.powerstats).forEach(function(power){
                    estadisticas.push({
                        label: power[0],
                        y: power[1],                
                        });            
                });

                //Emplear la librería de gráficos CanvasJS                
                var chart = new CanvasJS.Chart("chartContainer", {
                    theme: "light1",
                    animationEnabled: true,
                    title: {
                        text: `Estadísticas de Poder para ${nombre}`                        
                    },
                    data: [{
                        type: "pie",                   
                        showInLegend: "true",                        
                        legendText: "{label}",
                        indexLabelFontSize: 14,
                        indexLabel: "{label} ({y})",
                        dataPoints: estadisticas,
                    }]
                });
                chart.render();
            },

            error: function(e) {
                //Generar alertas cuando existan errores en la búsqueda
                alert("Intente nuevamente, algo no salió bien.");
            },
                      
        });        
    });
});