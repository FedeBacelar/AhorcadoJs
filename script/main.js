class Jugador{
    constructor(palabraAdivinar){
        this.palabraAdivinar = palabraAdivinar;
        this.longitudPalabra = palabraAdivinar.length;
        this.vidasPerdidas = 0;
        this.palabraOculta = ""; 
        this.caracteresUsados = [];
    }
    ocultarPalabra(){
        for(let i = 0;i < this.longitudPalabra; i++){
            this.palabraOculta += '?';
        }

    }
    letraEnPalabra(letra){
        return this.palabraAdivinar.includes(letra);
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
    actualizarPalabra(letra){
        let palabraOculta = "";
        for(let Posicion = 0; Posicion < this.longitudPalabra; Posicion++){
            if(this.palabraAdivinar[Posicion] == letra){
                palabraOculta += letra;
            } else {
                palabraOculta += this.palabraOculta[Posicion];
            }
        }
        this.palabraOculta = palabraOculta;
    }
    vidasRestantes(MAX_VIDAS){
        return MAX_VIDAS - this.vidasPerdidas;
    }
    palabraSinRevelar(){
        return this.palabraOculta.includes('?');
    }
}

function desactivarLetra(jugador){
    let inputLetras = document.getElementsByClassName("Input__Letras__Letra")
    for(const letraHTML of inputLetras){
        let letra = letraHTML.innerHTML
        if(jugador.caracteresUsados.includes(letra.toLowerCase())){
            letraHTML.className = "Input__Letras__Letra Mid-Disable";
        }
    }

}

function modificarPalabraHTML(jugador){
   
    let palabraHTML = document.querySelector(".Output--Palabra__Texto__Palabra")
    palabraHTML.innerHTML = ""; //Limpiamos la palabra para reconstruirla
    for(let Posicion = 0;Posicion<jugador.longitudPalabra; Posicion++){

        const divMayor = document.createElement("div");
        divMayor.className = "Output--Palabra__Texto__Palabra__Caracter";
        if(jugador.palabraOculta[Posicion] != '?'){ //Si la letra != '?': Debemos mostrar la letra (eliminamos la clase 'Disable' e indicamos la letra)
            
            divMayor.innerHTML = "<h3 class='Output--Palabra__Texto__Palabra__Caracter__Letra'>" + jugador.palabraOculta[Posicion].toUpperCase() + "</h3> <div class='Output--Palabra__Texto__Palabra__Caracter__Linea'></div> ";
        } else{
            divMayor.innerHTML = "<h3 class='Output--Palabra__Texto__Palabra__Caracter__Letra Disable'>" + '' + "</h3> <div class='Output--Palabra__Texto__Palabra__Caracter__Linea'></div> ";
        }

        palabraHTML.append(divMayor);

    }

}

function mostrarMensaje(Mensaje){
    //Output--Palabra__Texto__Avisos
    //TIPOS DE MENSAJES: Finales e intermedios
    //Acertaste
    //No acertaste
    //GANASTE
    //PERDISTE
    let contenedorDelMensaje = document.querySelector(".Output--Palabra__Texto__Avisos");
    contenedorDelMensaje.innerText = Mensaje;
}

function noEsLetra(caracter){
    const CARACTERES_PERMITIDOS = "qwertyuiopasdfghjklzxcvbnm";
    return !(CARACTERES_PERMITIDOS.includes(caracter) && caracter.length === 1 && caracter != "");
}

function ingreso(jugador){
    let caracter;
    do{
        caracter = prompt("Ingrese una letra: " + jugador.palabraOculta).toLowerCase(); 
        if(noEsLetra(caracter)){
            alert("INGRESO INVALIDO\n------------------------------------------------------------\nSolo se permite letras\n------------------------------------------------------------");
        }else if(jugador.letraYaIngresada(caracter)){
            alert("LETRA YA INGRESADA\n------------------------------------------------------------\nLa letra: '" + caracter.toUpperCase() + "' ya se encuentra dentro de las letras ingresadas\n" + jugador.caracteresUsados.join("-") +"\n------------------------------------------------------------");
        }
    } while(noEsLetra(caracter) || jugador.letraYaIngresada(caracter))
    jugador.guardarLetra(caracter);
    desactivarLetra(jugador);
    return caracter;
}

function main(){
    const jugador = new Jugador("casa");
    jugador.ocultarPalabra();
    let caracterIngresado;
    const MAX_VIDAS = 8;
    modificarPalabraHTML(jugador); //Construyo la base de la palabra: _ _ _ _ _
    while(jugador.vidasRestantes(MAX_VIDAS) != 0 && jugador.palabraSinRevelar()){
    
        caracterIngresado = ingreso(jugador);
        
        if(jugador.letraEnPalabra(caracterIngresado)){ 
            jugador.actualizarPalabra(caracterIngresado);
            modificarPalabraHTML(jugador); //Crea la palabra HTML segun corresponda: pr?gra?ar   Donde hay '?' no mostramos contenido 
            mostrarMensaje("ACERTASTE\n------------------------------------------------------------\n" + "La letra '" + caracterIngresado.toUpperCase() + "' estaba en la palabra: " + jugador.palabraOculta + "\n------------------------------------------------------------");
            //BORRAR ALERT
            alert("ACERTASTE\n------------------------------------------------------------\n" + "La letra '" + caracterIngresado.toUpperCase() + "' estaba en la palabra: " + jugador.palabraOculta + "\n------------------------------------------------------------");
        } else{
            jugador.perderVida();
            mostrarMensaje("FALLASTE... " + jugador.vidasRestantes(MAX_VIDAS) + " VIDAS RESTANTES\n" + "------------------------------------------------------------\n" + "La letra '" + caracterIngresado.toUpperCase() + "' no estaba en la palabra" + "\n------------------------------------------------------------");
            //BORRAR ALERT
            alert("FALLASTE... " + jugador.vidasRestantes(MAX_VIDAS) + " VIDAS RESTANTES\n" + "------------------------------------------------------------\n" + "La letra '" + caracterIngresado.toUpperCase() + "' no estaba en la palabra" + "\n------------------------------------------------------------");
        }
    }
    if(jugador.palabraSinRevelar()){
        mostrarMensaje("Perdiste :(\n------------------------------------------------------------\n La palabra era: " + jugador.palabraAdivinar + "\n------------------------------------------------------------\n");
    }else{
        mostrarMensaje("GANASTE! :)\n------------------------------------------------------------\n La palabra era: " + jugador.palabraAdivinar + "\n------------------------------------------------------------\n");
    }

}

main();