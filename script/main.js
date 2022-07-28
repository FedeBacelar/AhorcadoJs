
class Jugador{
    constructor(nombre){
        this.nombreDelJugador = nombre;
        this.puntos = 0;
    }
    asignarPuntaje(puntosDePartida, resultadoDePartida){
        this.puntos = puntosDePartida;
        resultadoDePartida? (this.puntos *= 3) : null;
    }
    actualizarPuntaje(PuntosGuardados){
        this.puntos += PuntosGuardados;
    }
}

class Ahorcado{
    constructor(palabraAdivinar){
        this.jugador = new Jugador("Pedro");
        this.palabraAdivinar = palabraAdivinar;
        this.longitudPalabra = palabraAdivinar.length;
        this.palabraOculta = ""; 
        this.vidasPerdidas = 0;
        this.MAX_VIDAS = 8;
        this.puntos = 0;
        this.caracteresUsados = [];
        this.ultimoIngreso = "";
    }
    ocultarPalabra(){
        for(let i = 0;i < this.longitudPalabra; i++){
            this.palabraOculta += '?';
        }
    }
    letraEnPalabra(){
        return this.palabraAdivinar.includes(this.ultimoIngreso);
    }
    perderVida(){
        this.vidasPerdidas += 1;
    }
    guardarLetra(letra){
        this.caracteresUsados.push(letra);
    }
    letraYaIngresada(letra){
        return this.caracteresUsados.includes(letra);
    }
    actualizarPalabra(){
        let palabraOculta = "";
        for(let Posicion = 0; Posicion < this.longitudPalabra; Posicion++){
            this.palabraAdivinar[Posicion] == this.ultimoIngreso ? palabraOculta += this.ultimoIngreso : palabraOculta += this.palabraOculta[Posicion]; //Operdador Ternario
        }
        this.palabraOculta = palabraOculta;
    }
    vidasRestantes(){
        return this.MAX_VIDAS - this.vidasPerdidas;
    }
    palabraSinRevelar(){
        return this.palabraOculta.includes('?');
    }
    partidaTerminada(){
        return !(this.palabraSinRevelar()) || this.vidasPerdidas === this.MAX_VIDAS;
    }
    crearPuntaje(){
        let strPuntos = this.puntos.toString();
        let strRellenoPuntaje = "";
        for(let i = strPuntos.length; i < 3; i++){
            strRellenoPuntaje+= '0';
        }
        return strRellenoPuntaje + strPuntos;
    }
    sumarPunto(){
        this.puntos += 5
    }
    restarPunto(){
        this.puntos >= 2 ? this.puntos -= 2 : null;
    }
    recargarSesionAnterior(PartidaAnterior){
        const {jugador: {puntos, nombreDelJugador}, palabraAdivinar, longitudPalabra, palabraOculta, vidasPerdidas, MAX_VIDAS, puntos:puntosPartida, caracteresUsados, ultimoIngreso} = PartidaAnterior;
        this.jugador.nombreDelJugador = nombreDelJugador;
        this.jugador.puntos = puntos;
        this.palabraAdivinar = palabraAdivinar
        this.longitudPalabra = longitudPalabra;
        this.palabraOculta = palabraOculta;
        this.vidasPerdidas = vidasPerdidas;
        this.MAX_VIDAS = MAX_VIDAS;
        this.puntos = puntosPartida;
        this.caracteresUsados = caracteresUsados;
        this.ultimoIngreso = ultimoIngreso;
        desactivarLetras(this.caracteresUsados);
        actualizarPuntaje(this);  
    }
}

function desactivarLetra(letraHTML){
    letraHTML.className = "Input__Letras__Letra Mid-Disable";
}

function modificarPalabraHTML(partida){   
    let palabraHTML = document.querySelector(".Output--Palabra__Texto__Palabra")
    palabraHTML.innerHTML = ""; 
    for(let Posicion = 0;Posicion<partida.longitudPalabra; Posicion++){

        const divMayor = document.createElement("div");
        divMayor.className = "Output--Palabra__Texto__Palabra__Caracter";
        if(partida.palabraOculta[Posicion] != '?'){
            divMayor.innerHTML = "<h3 class='Output--Palabra__Texto__Palabra__Caracter__Letra'>" + partida.palabraOculta[Posicion].toUpperCase() + "</h3> <div class='Output--Palabra__Texto__Palabra__Caracter__Linea'></div> ";
        } else{
            divMayor.innerHTML = "<h3 class='Output--Palabra__Texto__Palabra__Caracter__Letra Disable'>" + '' + "</h3> <div class='Output--Palabra__Texto__Palabra__Caracter__Linea'></div> ";
        }
        palabraHTML.append(divMayor);
    }
}

function mostrarMensaje(mensaje, partida){
    const Mensaje = {
        bienvenido : "Bienvenido! inicialmente tienes " + partida.vidasRestantes() + " VIDAS\n" + "------------------------------------------------------------\n" + "Haga click sobre las letras para comenzar el turno" + "\n------------------------------------------------------------",
        seguirPartida : "Bienvenido! tienes " + partida.vidasRestantes() + " VIDAS\n" + "------------------------------------------------------------\n" + "Haga click sobre las letras para seguir con el turno" + "\n------------------------------------------------------------",
        acerto : "ACERTASTE\n------------------------------------------------------------\n" + "La letra '" + partida.ultimoIngreso.toUpperCase() + "' estaba en la palabra: " + partida.palabraOculta + "\n------------------------------------------------------------",
        fallo : "FALLASTE... " + partida.vidasRestantes() + " VIDAS RESTANTES\n" + "------------------------------------------------------------\n" + "La letra '" + partida.ultimoIngreso.toUpperCase() + "' no estaba en la palabra" + "\n------------------------------------------------------------",
        gano : "GANASTE\n------------------------------------------------------------\n" + "La palabra era: '" + partida.palabraAdivinar + "'.\n------------------------------------------------------------",
        perdio : "PERDISTE\n------------------------------------------------------------\n" + "La palabra era: '" + partida.palabraAdivinar + "'. Suerte para la proxima!\n------------------------------------------------------------",
        partidaTerminada : "Bienvenido! Tu partida ya termino \n" + "------------------------------------------------------------\n" + "Haga click sobre RESET para empezar una nueva partida" + "\n------------------------------------------------------------"
    }
    let contenedorDelMensaje = document.querySelector(".Output--Palabra__Texto__Avisos");
    contenedorDelMensaje.innerText = Mensaje[mensaje];
}

function actualizaImagen(vidasRestantes){
    let contenedorImagen = document.querySelector(".Output--Dibujo-articleImg")
    contenedorImagen.innerHTML = "<img src='imgs/Ahorcado" + vidasRestantes + "Vida.png'>";
}

function mostrarEfecto(){ 
    const pantalla = document.querySelector("body");
    pantalla.className = ("Grid perderVida")
    setTimeout(() => {
        pantalla.className = ("Grid");
    }, 300)
}

function evaluarResultado(partida, jugador){
    if(partida.partidaTerminada()){
        if(partida.vidasRestantes() != 0){
            mostrarMensaje("gano", partida)
            jugador.asignarPuntaje(partida.puntos, true)
        } else {
            mostrarMensaje("perdio", partida)
            jugador.asignarPuntaje(partida.puntos, false)
        }     
        guardarDatos(jugador);
    }
}

function asignarPalabra(){
     
    const listaDePalabras = JSON.parse(localStorage.getItem("palabras"));
    console.log(listaDePalabras)
    const indiceElegido = Math.floor(Math.random() * listaDePalabras.length);
    return listaDePalabras[indiceElegido]
}

function actualizarPuntaje(partida){
    const PuntosHTML = document.querySelector(".Header__Marcador__Puntos");
    PuntosHTML.innerText = partida.crearPuntaje();
}

function Constructor(palabra, retomarDatos = false){
    const partida = new Ahorcado(palabra);
    let mensaje = "bienvenido";           
    let sesionGuardada = sessionStorage.getItem("SesionGuardada");
    if(sesionGuardada && retomarDatos){
        partida.recargarSesionAnterior(JSON.parse(sesionGuardada))       
        mensaje = (!partida.partidaTerminada())? "seguirPartida" : "partidaTerminada"; //Operador Ternario
    } else{
        partida.ocultarPalabra();
    }

    mostrarMensaje(mensaje, partida);
    modificarPalabraHTML(partida);
    actualizaImagen(partida.vidasRestantes()); 
    
    return partida;
}

function reactivarLetras(Letras){
    Letras.forEach(Letra => {
        Letra.className ="Input__Letras__Letra";
    })
}

function CrearBackup(partida){
    const {jugador: {puntos, nombreDelJugador}, palabraAdivinar, longitudPalabra, palabraOculta, vidasPerdidas, MAX_VIDAS, puntos:puntosPartida, caracteresUsados, ultimoIngreso} = partida;
    
    let DatosGuardados = new Ahorcado(palabraAdivinar);
    DatosGuardados.jugador.puntos = puntos;
    DatosGuardados.jugador.nombreDelJugador = nombreDelJugador;
    DatosGuardados.palabraAdivinar = palabraAdivinar;
    DatosGuardados.longitudPalabra = longitudPalabra;
    DatosGuardados.palabraOculta = palabraOculta;
    DatosGuardados.vidasPerdidas = vidasPerdidas;
    DatosGuardados.MAX_VIDAS = MAX_VIDAS;
    DatosGuardados.puntos = puntosPartida;
    DatosGuardados.caracteresUsados = caracteresUsados;
    DatosGuardados.ultimoIngreso = ultimoIngreso;
    sessionStorage.setItem("SesionGuardada",JSON.stringify(DatosGuardados));
}

function desactivarLetras(arrayLetras){
    let letrasHTML = [...document.getElementsByClassName("Input__Letras__Letra")];  
    letrasHTML.forEach((letraHTML) =>{
        for(const letra of arrayLetras){
            if(letraHTML.innerText === letra){
                letraHTML.className = "Input__Letras__Letra Mid-Disable";
            }
        }
    })
}

function guardarDatos(jugador){ 
    if(localStorage.getItem(jugador.nombreDelJugador)){
        const datosViejosJugador = JSON.parse(localStorage.getItem(jugador.nombreDelJugador));
        jugador.actualizarPuntaje(datosViejosJugador.puntos);
        console.log("Actualizar datos")
     }
     const JsonString = JSON.stringify(jugador);
     localStorage.setItem(jugador.nombreDelJugador, JsonString);
}

function main(){ 
    //Si NO existe en el storage un array de palabras, lo creamos (esto para evitar errores por el uso del storage.clear())
    if(!localStorage.getItem("palabras")){
        let ArrayPalabras = ["hola", "chau", "correr", "manteca", "teclado", "saltar", "correcaminos"];
        localStorage.setItem("palabras", JSON.stringify(ArrayPalabras));
    }
    TomarPalabra();


    let partida = Constructor(asignarPalabra(), true);
    let letrasHTML = [...document.getElementsByClassName("Input__Letras__Letra")];
    letrasHTML.forEach(letraHTML => {
        letraHTML.addEventListener('click', () =>{
            partida.ultimoIngreso = letraHTML.innerHTML.toLowerCase();
            const letraNoIngresada = !(letraHTML.className.includes("Mid-Disable"));
            
                if(letraNoIngresada && !(partida.partidaTerminada())){
            
                    if(partida.letraEnPalabra()){ 
                        partida.actualizarPalabra();
                        modificarPalabraHTML(partida);
                        mostrarMensaje("acerto", partida);   
                        partida.sumarPunto();
                          
                    } else{
                        partida.perderVida();
                        mostrarEfecto();
                        mostrarMensaje("fallo", partida);
                        partida.restarPunto();
                    }
                    actualizarPuntaje(partida);
                    partida.guardarLetra(letraHTML.innerText)
                    desactivarLetra(letraHTML);
                    actualizaImagen(partida.vidasRestantes());
                    evaluarResultado(partida,partida.jugador);
                    CrearBackup(partida);

                    if(partida.partidaTerminada()){
                        if(partida.vidasRestantes() != 0){
                            //Sweet Alert para ganar
                            Swal.fire({
                                title: 'Ganaste!',
                                text: 'La palabra era ' + partida.palabraAdivinar,
                                icon: 'success',
                                confirmButtonText: 'Volver a jugar'
                            }).then(() => {
                                partida = reset(partida);
                            })
                        } else{
                            //Sweet Alert para perder
                            Swal.fire({
                                title: 'Perdiste!',
                                text: 'La palabra era ' + partida.palabraAdivinar,
                                icon: 'error',
                                confirmButtonText: 'Volver a jugar'
                            }).then(() => {
                                partida = reset(partida);
                            })    
                        }
                    }

                } else if (!letraNoIngresada && !(partida.partidaTerminada())){
                    console.log("Letra ya ingresada");
                } else {
                    console.log("La partida ya termino")
                }        
        })
    })
    const btnReset = document.querySelector(".Header__Reset");
    btnReset.addEventListener('click', () => {
        partida = reset(partida);
    })
}

function reset(partida){
    TomarPalabra(); //Agregamos una palabra a la lista de juego (cada vez que se oprima 'reset')
    let letrasHTML = [...document.getElementsByClassName("Input__Letras__Letra")];
    partida = Constructor(asignarPalabra());
    reactivarLetras(letrasHTML);
    actualizarPuntaje(partida);
    sessionStorage.clear();
    return partida;
}

main();

async function Traducir(palabra){
    const configBody = new URLSearchParams();
    configBody.append("q", palabra); //Palabra sin traducir
    configBody.append("source", "pt"); //Idioma de la palabra
    configBody.append("target", "es"); //Idioma a traducir
    
    const options = {
    method: 'POST',
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/gzip',
        'X-RapidAPI-Key': '456c96cf8fmshce44099be401994p1ad321jsnf0d4c6ba3ace',
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
    },
    body: configBody
    };
    
    const palabraTraducida = await fetch('https://google-translate1.p.rapidapi.com/language/translate/v2', options)
    .then(response => response.json())
    .then(response => {
        
        const Palabras = JSON.parse(localStorage.getItem("palabras")) //Listado de palabras para jugar
        const PalabraAPI = response.data.translations[0].translatedText; //Palabra retornada (y traducida) de las APIs
        console.log(PalabraAPI)

        //Si lo obtenido es una palabra lo agregamos a la lista (una traduccion de una palabra puede estar dada mediante frases o con caracteres no esperados)
        if(evaluarSiEsPalabra(PalabraAPI) && PalabraAPI.length <= 10){
            console.log("Palabra aceptada")
            localStorage.setItem("palabras", JSON.stringify([...Palabras,(PalabraAPI.toLowerCase())]));
        }
    })
    .catch(err => console.error("Ocurrio un error en la traduccion: " + err));
}

async function TomarPalabra(){
    /*
    Guarda una nueva palabra en el localStorge (recibida desde una API de palabras en Portugues) para luego ser traducida (mediante
    una API de google traductor) y asi poder expandir una lista de palabras (que seran las elegidas para jugar)  
    */
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '456c96cf8fmshce44099be401994p1ad321jsnf0d4c6ba3ace',
            'X-RapidAPI-Host': 'palavras-aleatorias.p.rapidapi.com'
        }
    };
    
    const ObtenerPalabra = await fetch('https://palavras-aleatorias.p.rapidapi.com/words/5/1', options)
        .then(response => response.json())
        .then(response => Traducir(response[0].word))
        .catch(err => console.error("Ocurrio un error al obtener la palabra: " + err));
}

function evaluarSiEsPalabra(palabra){
    let esPalabra = true;
    const CaracteresNoPermitidas = [" ", "ü", "é", "á", "í", "ó", "ú", "ñ", "Ñ"];
    CaracteresNoPermitidas.forEach((caracterNoPermitida) => {
        if(palabra.includes(caracterNoPermitida)){
            esPalabra = false;
        }
    })
    return esPalabra;
}