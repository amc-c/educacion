// =========================
// INICIAR BIENVENIDA
// =========================
function iniciarBienvenida() {

    // Obtener datos guardados
    let nombre =
        localStorage.getItem("nombre");

    let avatar =
        localStorage.getItem("avatar");

    // Validar datos
    if (!nombre || !avatar) {

        window.location.href =
            "index.html";

        return;
    }

    // Elementos HTML
    let saludo =
        document.getElementById("saludo");

    let avatarImg =
        document.getElementById("avatar");

    let boton =
        document.getElementById("btnAprender");

    // Mostrar datos
    saludo.textContent =
        "¡Hola " + nombre + "! 🎉";

    avatarImg.src = avatar;

    // Voz bienvenida
    hablar(
        "Hola " + nombre +
        ", bienvenido"
    );

    // Evento botón principal
    if (boton) {
        boton.addEventListener(
            "click",
            irAAprendizaje
        );
    }

    // Evento botón 4to básico
    let boton4to = document.getElementById("btnAprender4to");

    if (boton4to) {
        boton4to.addEventListener(
            "click",
            irABienvenida4to
        );
    }
}

// =========================
// FUNCIÓN VOZ
// =========================
function hablar(texto) {

    // Detener voz anterior
    speechSynthesis.cancel();

    // Crear voz
    let voz =
        new SpeechSynthesisUtterance(texto);

    voz.lang = "es-ES";
    voz.volume = 1;
    voz.rate = 1;
    voz.pitch = 1;

    // Reproducir
    speechSynthesis.speak(voz);
}

// =========================
// IR A APRENDIZAJE
// =========================
function irAAprendizaje() {

    // Voz antes de entrar
    let texto = "Vamos, es hora de aprender";
    let voz = new SpeechSynthesisUtterance(texto);

    voz.lang = "es-ES";
    voz.volume = 1;
    voz.rate = 1.05;
    voz.pitch = 1.1;

    voz.onend = () => {
        window.location.href = "aprendizaje.html";
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(voz);
}

// =========================
// IR A BIENVENIDA 4TO
// =========================
function irABienvenida4to() {

    let texto = "Vamos a aprender";
    let voz = new SpeechSynthesisUtterance(texto);

    voz.lang = "es-ES";
    voz.volume = 1;
    voz.rate = 1.05;
    voz.pitch = 1.1;

    voz.onend = () => {
        window.location.href = "bienvenida4to.html";
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(voz);
}