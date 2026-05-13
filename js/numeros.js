const textos = [

    "",
    "UNO",
    "DOS",
    "TRES",
    "CUATRO",
    "CINCO",
    "SEIS",
    "SIETE",
    "OCHO",
    "NUEVE",
    "DIEZ"

];

// INICIAR

function iniciarNumeros() {

    hablar("Hola. Presiona un número para aprender.");

    document.getElementById("panelNumero").classList.add("oculto");
    document.getElementById("contenedorNumeros").classList.remove("oculto");
    document.getElementById("manzanas").innerHTML = "";
    document.getElementById("btnCompletar").style.display = "block";
}

// SELECCIONAR NUMERO

function seleccionarNumero(numero) {

    document.getElementById("audioLogro").play();

    document.getElementById("contenedorNumeros").classList.add("oculto");
    document.getElementById("panelNumero").classList.remove("oculto");

    document.getElementById("numeroGrande").textContent = numero;
    document.getElementById("textoNumero").textContent = textos[numero];

    const contenedor = document.getElementById("manzanas");
    contenedor.innerHTML = "";

    const textoManzana = numero === 1 ? "una manzana" : `${numero} manzanas`;

    for (let i = 0; i < numero; i++) {

        const img = document.createElement("img");
        img.src = "img/manzana.png";
        img.alt = textoManzana;
        img.className = "manzana";
        img.onclick = () => hablar(textoManzana);
        contenedor.appendChild(img);
    }

    hablar("Seleccionaste el número " + numero + ". " + textos[numero] + ". Aquí están " + textoManzana + " debajo del número.");
}

function hablar(texto) {

    speechSynthesis.cancel();

    const voz = new SpeechSynthesisUtterance(texto);

    voz.lang = "es-ES";
    voz.rate = 1;
    voz.pitch = 1.05;

    speechSynthesis.speak(voz);
}

// VOLVER

function volverNumeros() {

    hablar("Volviendo a la lista de números");

    document.getElementById("panelNumero").classList.add("oculto");
    document.getElementById("contenedorNumeros").classList.remove("oculto");
    document.getElementById("manzanas").innerHTML = "";
}

// COMPLETAR

function completarNumeros() {

    localStorage.setItem("numerosCompletados", "true");

    hablar("¡Excelente! Has aprendido los números. Regresando a aprendizaje.");

    setTimeout(() => {

        window.location.href = "aprendizaje.html";

    }, 3000);
}

// VOLVER A APRENDIZAJE

function volverAAprendizaje() {

    localStorage.setItem("numerosCompletados", "true");

    hablar("Regresando a la página de aprendizaje. Ahora puedes aprender sumas y restas.");

    setTimeout(() => {

        window.location.href = "aprendizaje.html";

    }, 3000);
}