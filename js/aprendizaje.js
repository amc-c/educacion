// =========================
// AUDIO BOTONES
// =========================
let sonidoBoton =
    new Audio("sonidos/avatar.mp3");


// =========================
// INICIAR
// =========================
function iniciarAprendizaje() {

    let nombre =
        localStorage.getItem("nombre");

    let avatar =
        localStorage.getItem("avatar");

    // Validación
    if (!nombre || !avatar) {

        window.location.href =
            "index.html";

        return;
    }

    // Mostrar avatar
    let img =
        document.getElementById("avatar");

    img.src = avatar;

    // Verificar progreso
    let numerosCompletados =
        localStorage.getItem("numerosCompletados");

    if (numerosCompletados === "true") {

        // Desbloquear sumas y restas
        document.querySelectorAll(".bloqueado").forEach(el => {

            el.classList.remove("bloqueado");

            if (el.textContent.includes("Sumas")) {

                el.onclick = abrirSumas;

            } else {

                el.onclick = abrirRestas;
            }

        });

        // Mensaje
        document.getElementById("mensaje")
            .textContent =
            "¡Genial " + nombre +
            "! Ahora puedes aprender sumas y restas ➕➖";

        // Voz
        hablar(
            "Genial " + nombre +
            ". Ahora puedes aprender sumas y restas"
        );

        // Nivel medio
        actualizarNivelAvatar("medio");

    } else {

        // Mensaje
        document.getElementById("mensaje")
            .textContent =
            "Hola " + nombre +
            ", primero aprende los números 🔢";

        // Voz bienvenida
        hablar(
            "Hola " + nombre +
            ", primero aprende los números"
        );

        // Nivel inicial
        actualizarNivelAvatar("basico");
    }
}


// =========================
// VOZ
// =========================
function hablar(texto) {

    speechSynthesis.cancel();

    let voz =
        new SpeechSynthesisUtterance(texto);

    voz.lang = "es-ES";

    voz.rate = 0.95;

    voz.pitch = 1.1;

    speechSynthesis.speak(voz);
}


// =========================
// ABRIR NÚMEROS
// =========================
function abrirNumeros() {

    // SONIDO
    sonidoBoton.currentTime = 0;
    sonidoBoton.play();

    hablar(
        "Vamos a aprender los números"
    );

    setTimeout(() => {

        window.location.href =
            "numeros.html";

    }, 2500);
}


// =========================
// ABRIR SUMAS
// =========================
function abrirSumas() {

    // SONIDO
    sonidoBoton.currentTime = 0;
    sonidoBoton.play();

    hablar(
        "Vamos a aprender las sumas"
    );

    setTimeout(() => {

        window.location.href =
            "suma.html";

    }, 2500);
}


// =========================
// ABRIR RESTAS
// =========================
function abrirRestas() {

    // SONIDO
    sonidoBoton.currentTime = 0;
    sonidoBoton.play();

    hablar(
        "Vamos a aprender las restas"
    );

    setTimeout(() => {

        window.location.href =
            "resta.html";

    }, 2500);
}


// =========================
// BLOQUEADO
// =========================
function bloqueado() {

    hablar(
        "Primero debes aprender los números"
    );
}


// =========================
// NIVEL AVATAR
// =========================
function actualizarNivelAvatar(nivel) {

    let avatar =
        document.getElementById("avatar");

    avatar.classList.remove(
        "nivel-basico",
        "nivel-medio",
        "nivel-avanzado"
    );

    if (nivel === "basico") {

        avatar.classList.add(
            "nivel-basico"
        );

    } else if (nivel === "medio") {

        avatar.classList.add(
            "nivel-medio"
        );

    } else if (nivel === "avanzado") {

        avatar.classList.add(
            "nivel-avanzado"
        );
    }
}


// =========================
// VOLVER
// =========================
function volver() {

    window.location.href =
        "bienvenido.html";
}