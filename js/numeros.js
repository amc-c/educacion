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


// =========================
// INICIAR
// =========================

function iniciarNumeros() {

    hablar("Hola. Presiona un número para aprender.");

    document.getElementById("panelNumero")
        .classList.add("oculto");

    document.getElementById("contenedorNumeros")
        .classList.remove("oculto");

    document.getElementById("manzanas")
        .innerHTML = "";

    document.getElementById("btnCompletar")
        .style.display = "block";
}


// =========================
// SELECCIONAR NUMERO
// =========================

function seleccionarNumero(numero) {

    document.getElementById("audioLogro").play();

    document.getElementById("contenedorNumeros")
        .classList.add("oculto");

    document.getElementById("panelNumero")
        .classList.remove("oculto");

    const numeroGrande =
        document.getElementById("numeroGrande");

    numeroGrande.textContent = numero;

    numeroGrande.onclick = () =>
        hablar(textos[numero]);

    document.getElementById("textoNumero")
        .textContent = textos[numero];

    const contenedor =
        document.getElementById("manzanas");

    contenedor.innerHTML = "";

    let contador = 0;
    let manzanasActivas = [];

    const palabras = [
        "",
        "una",
        "dos",
        "tres",
        "cuatro",
        "cinco",
        "seis",
        "siete",
        "ocho",
        "nueve",
        "diez"
    ];

    for (let i = 0; i < numero; i++) {

        const img =
            document.createElement("img");

        img.src = "img/manzana.png";
        img.className = "manzana";

        img.onclick = () => {

            if (img.classList.contains("activa")) return;

            contador++;

            img.classList.add("activa");
            manzanasActivas.push(img);

            hablar(palabras[contador]);

            if (contador === numero) {

                setTimeout(() => {

                    const utter =
                        new SpeechSynthesisUtterance(
                            "Total: " +
                            palabras[numero] +
                            " manzanas"
                        );

                    utter.lang = "es-ES";

                    utter.onend = () => {

                        manzanasActivas.forEach(m => {
                            m.classList.remove("activa");
                        });

                        contador = 0;
                        manzanasActivas = [];
                    };

                    speechSynthesis.speak(utter);

                }, 600);
            }
        };

        contenedor.appendChild(img);
    }

    hablar(textos[numero]);
}


// =========================
// HABLAR
// =========================

function hablar(texto) {

    speechSynthesis.cancel();

    const voz =
        new SpeechSynthesisUtterance(texto);

    voz.lang = "es-ES";

    voz.rate = 1;

    voz.pitch = 1.05;

    speechSynthesis.speak(voz);
}


// =========================
// VOLVER
// =========================

function volverNumeros() {

    hablar("Volviendo a la lista de números");

    document.getElementById("panelNumero")
        .classList.add("oculto");

    document.getElementById("contenedorNumeros")
        .classList.remove("oculto");

    document.getElementById("manzanas")
        .innerHTML = "";
}


// =========================
// COMPLETAR
// =========================

function completarNumeros() {

    localStorage.setItem("numerosCompletados", "true");

    hablar("¡Excelente!.Regresando a aprendizaje.");

    setTimeout(() => {

        window.location.href = "aprendizaje.html";

    }, 3000);
}


// =========================
// VOLVER A APRENDIZAJE
// =========================

function volverAAprendizaje() {

    localStorage.setItem("numerosCompletados", "true");

    hablar("Regresando a la página de aprendizaje");

    setTimeout(() => {

        window.location.href = "aprendizaje.html";

    }, 3000);
}