//se implementa el patrón módulo mediante IIFE:
const modulo = (() => {
    //se crea las variables privadas
    let urlPriv, idPriv, mostrarVideosPriv;
    
    //se crea una función privada que recibe la url del video y el id de la categoria
    mostrarVideosPriv = (url, id) => {
        urlPriv = url;
        idPriv = id;

        //switch para identificar cada id
        switch (idPriv){
            case "musica":
                document.getElementById("musica").setAttribute("src", `${urlPriv}`);
                break;
            case "peliculas":
                document.getElementById("peliculas").setAttribute("src", `${urlPriv}`);
                break;
            case "series":
                document.getElementById("series").setAttribute("src", `${urlPriv}`);
                break;
        }

    }
    //Se retorna una función pública que reciba los parámetros (url, id)   
    return {
            mostrarVideos: (url, id) => {  
                //se llama a la función interna (privada) para insertar los elementos recibidos.              
                mostrarVideosPriv(url, id);
            }
        }
})();

//clase padre denominada "Multimedia"
class Multimedia {
    constructor (url){
        //la variable "_url" se torna privada con el uso de "let"
        let _url = url;
        //closure implementado para proteger el atributo url
        this.getUrl = () => _url;
    }
    get url(){
        //el getter "url" retorna el closure que por su vez permite acceder a la variable privada
        return this.getUrl();
    }
    setInicio(){
        return `Este método es para realizar un cambio en la URL del video`;

    }
}

//clase "Reproductor" hija de la clase padre "Multimedia"
class Reprodutor extends Multimedia {
    constructor (url, id){
        super(url);
        this.id = id;
    }
    playMultimedia(){
        return modulo.mostrarVideos(this.url, this.id);

    }
    //un método que reciba y agregue un tiempo de inicio a la URL de la etiqueta iframe
    setInicio(tiempo){ 
       modulo.mostrarVideos(`${this.getUrl()}?start=${tiempo}`, this.id);
      
    }
}

//se instancia la clase hija

var musica1 = new Reprodutor("https://www.youtube.com/embed/YKdXVnaHfo8", "musica");
// se invoca al método “playMultimedia” para cada instancia creada
musica1.playMultimedia();
//se utiliza del método "setInicio" para modificar el tiempo de inicio
musica1.setInicio(100);


var pelicula1 = new Reprodutor("https://www.youtube.com/embed/5PSNL1qE6VY", "peliculas");
// se invoca al método “playMultimedia” para cada instancia creada
pelicula1.playMultimedia();


var serie1 = new Reprodutor("https://www.youtube.com/embed/jVF5qYvfjIs", "series");
// se invoca al método “playMultimedia” para cada instancia creada
serie1.playMultimedia();


