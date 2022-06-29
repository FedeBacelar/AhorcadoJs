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

function noEsLetra(caracter){
    const CARACTERES_PERMITIDOS = "qwertyuiopasdfghjklzxcvbnm";
    return !(CARACTERES_PERMITIDOS.includes(caracter) && caracter.length === 1 && caracter != "");
}

function ingreso(jugador){
    let caracter;
    do{
        caracter = prompt("Ingrese una letra: " + jugador.palabraOculta).toLocaleLowerCase(); 
        if(noEsLetra(caracter)){
            alert("INGRESO INVALIDO\n------------------------------------------------------------\nSolo se permite letras\n------------------------------------------------------------");
        }else if(jugador.letraYaIngresada(caracter)){
            alert("LETRA YA INGRESADA\n------------------------------------------------------------\nLa letra: '" + caracter.toLocaleUpperCase() + "' ya se encuentra dentro de las letras ingresadas\n" + jugador.caracteresUsados.join("-") +"\n------------------------------------------------------------");
        }
    } while(noEsLetra(caracter) || jugador.letraYaIngresada(caracter))
    jugador.guardarLetra(caracter);
    return caracter;
}

function main(){
    const jugador = new Jugador("programar");
    jugador.ocultarPalabra();
    let caracterIngresado;
    const MAX_VIDAS = 8;

    while(jugador.vidasRestantes(MAX_VIDAS) != 0 && jugador.palabraSinRevelar()){
    
        caracterIngresado = ingreso(jugador);
        
        if(jugador.letraEnPalabra(caracterIngresado)){ 
            jugador.actualizarPalabra(caracterIngresado);
            alert("ACERTASTE\n------------------------------------------------------------\n" + "La letra '" + caracterIngresado.toLocaleUpperCase() + "' estaba en la palabra: " + jugador.palabraOculta + "\n------------------------------------------------------------");
        } else{
            jugador.perderVida();
            alert("FALLASTE... " + jugador.vidasRestantes(MAX_VIDAS) + " VIDAS RESTANTES\n" + "------------------------------------------------------------\n" + "La letra '" + caracterIngresado.toLocaleUpperCase() + "' no estaba en la palabra" + "\n------------------------------------------------------------");
        }
    }
}

main();