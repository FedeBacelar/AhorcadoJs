
class Palabras{
    constructor(arrayPalabras){
        this.Aleatorio = arrayPalabras.map(ObjPlabra => ObjPlabra.palabra)
        this.Facil = arrayPalabras.filter(ObjPalabra => ObjPalabra.dificultad === 1).map(ObjPlabra => ObjPlabra.palabra);
        this.Normal = arrayPalabras.filter(ObjPalabra => ObjPalabra.dificultad === 2).map(ObjPlabra => ObjPlabra.palabra);
        this.Dificil = arrayPalabras.filter(ObjPalabra => ObjPalabra.dificultad === 3).map(ObjPlabra => ObjPlabra.palabra);
    }
}

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
        acerto : "ACERTASTE\n------------------------------------------------------------\n" + "La letra '" + partida.ultimoIngreso.toUpperCase() + "' estaba en la palabra" + "\n------------------------------------------------------------",
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
    const pantalla = document.querySelector(".ContenedorOutput");
    pantalla.className = ("ContenedorOutput perderVida")
    setTimeout(() => {
        pantalla.className = ("ContenedorOutput");
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
    consultarAPI(); //Consultamos la disponibilidad de palabras para el juego
    let partida = Constructor(asignarPalabra(), true);

    //Evento de interaccion con el jugador
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
                    //Mensajes de finalizacion de la partida 
                    if(partida.partidaTerminada()){ //Si la partida termina de forma natural
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

    //Evento de reseteo
    const btnReset = document.querySelector(".Header__Reset");
    btnReset.addEventListener('click', () => {
        partida = reset(partida);
    })

    //Evento de cambio de dificultad
    const Dificultades = [...document.querySelectorAll(".Header__Dificultad__Seleccion li")];
    const DificultadElegida = document.querySelector(".Header__Dificultad__Seleccionado")
    Dificultades.forEach(dificultad => {
        dificultad.addEventListener('click', ()=>{
            if(DificultadElegida.innerHTML != dificultad.innerHTML){
                Swal.fire({
                    title: "Desea cambiar la dificultad a " + dificultad.innerHTML + "?",
                    text: "Esta accion borrara la partida en curso",
                    icon: 'info',
                    showDenyButton: true
                }).then((result) =>{
                    if(result.isConfirmed){
                        DificultadElegida.innerHTML = dificultad.innerHTML;
                        formatearDificultad(dificultad.innerText, partida).then((partidaReseteada) => partida = partidaReseteada) 
                    }
                })
            }
        })
    })
}

function reset(partida){
    let letrasHTML = [...document.getElementsByClassName("Input__Letras__Letra")];
    partida = Constructor(asignarPalabra());
    reactivarLetras(letrasHTML);
    actualizarPuntaje(partida);
    sessionStorage.clear();
    return partida;
}

function consultarAPI(dificultad = "Aleatorio"){
    return new Promise((resolve, reject) =>{
        fetch('./JSON/API.json')
        .then(response => response.json())
        .then(response => {
            const PalabrasOrdenadas = new Palabras(response);
            //Llenamos el localStorage segun la dificultad deseada
            console.log("Simulando peticion a una API")
            setTimeout(() =>{
                if(dificultad === "Facil"){
                    localStorage.setItem("palabras", JSON.stringify(PalabrasOrdenadas.Facil)); //SE ELIGE LA DIFICULTAD
                } else if(dificultad === "Normal"){
                    localStorage.setItem("palabras", JSON.stringify(PalabrasOrdenadas.Normal)); //SE ELIGE LA DIFICULTAD
                }else if(dificultad === "Dificil"){
                    localStorage.setItem("palabras", JSON.stringify(PalabrasOrdenadas.Dificil)); //SE ELIGE LA DIFICULTAD
                } else{
                    localStorage.setItem("palabras", JSON.stringify(PalabrasOrdenadas.Aleatorio));
                }
                resolve("Datos cargados con extio")
            }, 500) //Los segundos estan para "simular" la tardanza en la respuesta de la API 
        })
    })
}

async function formatearDificultad(dificultad, partida){
    promesaResuelta = await consultarAPI(dificultad);
    console.log(promesaResuelta)
    partida = reset(partida);
    return partida
}

main();


//RETORNAR UNA PROMESA QUE CUANDO SE CUMPLA: SURGA EL RESETEO...
//La funcion ConsultarApi retorna una promesa