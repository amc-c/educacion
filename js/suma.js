const textosSumas = {

    "1+1": "Uno más uno es igual a dos",

    "1+2": "Uno más dos es igual a tres",

    "2+2": "Dos más dos es igual a cuatro",

    "2+3": "Dos más tres es igual a cinco",

    "3+3": "Tres más tres es igual a seis",

    "3+4": "Tres más cuatro es igual a siete",

    "4+4": "Cuatro más cuatro es igual a ocho",

    "4+5": "Cuatro más cinco es igual a nueve",

    "5+5": "Cinco más cinco es igual a diez"

};

// INICIAR

function iniciarSumas() {

    hablar("Hola. Presiona una suma para ver cómo se hace.");

    // Mostrar botón completar después de 10 segundos
    setTimeout(() => {

        document.getElementById("btnCompletar").style.display = "block";

    }, 10000);
}

// SELECCIONAR SUMA

function seleccionarSuma(a, b) {

    // SONIDO

    document.getElementById("audioLogro").play();

    // OCULTAR SUMAS

    document.getElementById("contenedorSumas").classList.add("oculto");

    // MOSTRAR PANEL

    document.getElementById("panelSuma").classList.remove("oculto");

    // SUMA GRANDE

    const resultado = a + b;

    document.getElementById("sumaGrande").innerHTML = `${a} + ${b} = ${resultado}`;

    // TEXTO

    const clave = `${a}+${b}`;

    document.getElementById("textoSuma").innerHTML = textosSumas[clave];

    // VOZ

    hablar("Seleccionaste la suma " + a + " más " + b + ". " + textosSumas[clave]);

    // VISUAL

    const contenedor = document.getElementById("visualSuma");

    contenedor.innerHTML = "";

    // Grupo A

    for(let i = 0; i < a; i++) {

        setTimeout(() => {

            const img = document.createElement("img");

            img.src = "img/manzana.png";

            img.className = "manzana";

            img.onclick = () => hablar(`${a} manzanas del primer grupo`);

            contenedor.appendChild(img);

        }, i * 200);

    }

    // Más

    setTimeout(() => {

        const span = document.createElement("span");

        span.style.fontSize = "60px";

        span.style.color = "#FF7043";

        span.style.margin = "0 20px";

        span.textContent = "+";

        contenedor.appendChild(span);

    }, a * 200 + 500);

    // Grupo B

    for(let i = 0; i < b; i++) {

        setTimeout(() => {

            const img = document.createElement("img");

            img.src = "img/manzana.png";

            img.className = "manzana";

            img.onclick = () => hablar(`${b} manzanas del segundo grupo`);

            contenedor.appendChild(img);

        }, a * 200 + 1000 + i * 200);

    }

    // Igual

    setTimeout(() => {

        const span = document.createElement("span");

        span.style.fontSize = "60px";

        span.style.color = "#FF7043";

        span.style.margin = "0 20px";

        span.textContent = "=";

        contenedor.appendChild(span);

    }, a * 200 + b * 200 + 1500);

    // Resultado

    for(let i = 0; i < resultado; i++) {

        setTimeout(() => {

            const img = document.createElement("img");

            img.src = "img/manzana.png";

            img.className = "manzana";

            img.onclick = () => hablar(`En total hay ${resultado} manzanas`);

            contenedor.appendChild(img);

        }, a * 200 + b * 200 + 2000 + i * 200);

    }
}

// VOLVER

function volverSumas() {

    hablar("Volviendo a la lista de sumas");

    document.getElementById("contenedorSumas").classList.remove("oculto");

    document.getElementById("panelSuma").classList.add("oculto");
}

// COMPLETAR

function completarSumas() {

    localStorage.setItem("sumasCompletadas", "true");

    hablar("¡Excelente! Has aprendido las sumas.");

    setTimeout(() => {

        window.location.href = "aprendizaje.html";

    }, 3000);
}

// VOZ

function hablar(texto) {

    speechSynthesis.cancel();

    const voz = new SpeechSynthesisUtterance();

    voz.text = texto;

    voz.lang = "es-ES";

    voz.rate = 0.85;

    voz.pitch = 1.1;

    speechSynthesis.speak(voz);
}