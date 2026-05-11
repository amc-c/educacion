
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

    hablar(
        "Vamos a aprender los números"
    );

    setTimeout(() => {

        window.location.href =
            "numeros/numeros.html";

    }, 2500);
}

// =========================
// BLOQUEADO
// =========================
function bloqueado() {

    hablar(
        "Primero complete la elección números"
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