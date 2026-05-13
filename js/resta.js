const textosRestas = {

    "2-1": "Dos menos uno es igual a uno",

    "3-1": "Tres menos uno es igual a dos",

    "3-2": "Tres menos dos es igual a uno",

    "4-1": "Cuatro menos uno es igual a tres",

    "4-2": "Cuatro menos dos es igual a dos",

    "5-1": "Cinco menos uno es igual a cuatro",

    "5-2": "Cinco menos dos es igual a tres",

    "5-3": "Cinco menos tres es igual a dos",

    "6-1": "Seis menos uno es igual a cinco"

};

// INICIAR

function iniciarRestas() {

    hablar("Hola. Presiona una resta para ver cómo se hace.");

    // Mostrar botón completar después de 10 segundos
    setTimeout(() => {

        document.getElementById("btnCompletar").style.display = "block";

    }, 10000);
}

// SELECCIONAR RESTA

function seleccionarResta(a, b) {

    // SONIDO

    document.getElementById("audioLogro").play();

    // OCULTAR RESTAS

    document.getElementById("contenedorRestas").classList.add("oculto");

    // MOSTRAR PANEL

    document.getElementById("panelResta").classList.remove("oculto");

    // RESTA GRANDE

    const resultado = a - b;

    document.getElementById("restaGrande").innerHTML = `${a} - ${b} = ${resultado}`;

    // TEXTO

    const clave = `${a}-${b}`;

    document.getElementById("textoResta").innerHTML = textosRestas[clave];

    // VOZ

    hablar("Seleccionaste la resta " + a + " menos " + b + ". " + textosRestas[clave]);

    // VISUAL

    const contenedor = document.getElementById("visualResta");

    contenedor.innerHTML = "";

    // Grupo original

    for(let i = 0; i < a; i++) {

        setTimeout(() => {

            const img = document.createElement("img");

            img.src = "img/manzana.png";

            img.className = "manzana";

            img.onclick = () => hablar(`${a} manzanas al inicio`);

            contenedor.appendChild(img);

        }, i * 200);

    }

    // Menos

    setTimeout(() => {

        const span = document.createElement("span");

        span.style.fontSize = "60px";

        span.style.color = "#FF7043";

        span.style.margin = "0 20px";

        span.textContent = "-";

        contenedor.appendChild(span);

    }, a * 200 + 500);

    // Grupo a quitar (tachado o gris)

    for(let i = 0; i < b; i++) {

        setTimeout(() => {

            const img = document.createElement("img");

            img.src = "img/manzana.png";

            img.className = "manzana gris";

            img.onclick = () => hablar(`Quitamos ${b} manzanas`);

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

            img.onclick = () => hablar(`Quedan ${resultado} manzanas`);

            contenedor.appendChild(img);

        }, a * 200 + b * 200 + 2000 + i * 200);

    }
}

// VOLVER

function volverRestas() {

    hablar("Volviendo a la lista de restas");

    document.getElementById("contenedorRestas").classList.remove("oculto");

    document.getElementById("panelResta").classList.add("oculto");
}

// COMPLETAR

function completarRestas() {

    localStorage.setItem("restasCompletadas", "true");

    hablar("¡Excelente! Has aprendido las restas.");

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