let avatarSeleccionado = null;

// 🔊 reproducir sonidos
function reproducirAudio(id) {

    const audio = document.getElementById(id);

    if (!audio) return;

    audio.currentTime = 0;

    audio.play().catch(() => {});
}

// 🗣️ hablar
function hablar(texto) {

    speechSynthesis.cancel();

    const voz = new SpeechSynthesisUtterance(texto);

    voz.lang = "es-ES";
    voz.rate = 0.95;
    voz.pitch = 1.05;
    voz.volume = 1;

    speechSynthesis.speak(voz);
}

// 🎯 seleccionar avatar
function seleccionarAvatar(img) {

    const avatares =
        document.querySelectorAll(".avatares img");

    avatares.forEach(a => {
        a.style.border =
            "2px solid transparent";
    });

    img.style.border =
        "3px solid blue";

    avatarSeleccionado = img.src;

    reproducirAudio("audioAvatar");
}

// 🎊 confeti
function lanzarConfeti() {

    const emojis =
        ["🎉", "🎊", "✨", "🌟", "🥳"];

    for (let i = 0; i < 40; i++) {

        const confeti =
            document.createElement("div");

        confeti.innerText =
            emojis[Math.floor(
                Math.random() * emojis.length
            )];

        confeti.style.position = "fixed";
        confeti.style.left =
            Math.random() * 100 + "vw";

        confeti.style.top = "-20px";

        confeti.style.fontSize = "24px";

        confeti.style.zIndex = "9999";

        confeti.style.pointerEvents = "none";

        confeti.style.animation =
            "caer 3s linear forwards";

        document.body.appendChild(confeti);

        setTimeout(() => {
            confeti.remove();
        }, 3000);
    }
}

// 🎬 animación
const style =
    document.createElement("style");

style.innerHTML = `
@keyframes caer {
    to {
        transform:
            translateY(100vh)
            rotate(360deg);

        opacity: 0;
    }
}
`;

document.head.appendChild(style);

// 🚪 ingresar
function ingresar() {

    const nombre =
        document.getElementById("nombre")
        .value
        .trim();

    // ❌ falta todo
    if (
        nombre === "" &&
        avatarSeleccionado === null
    ) {

        reproducirAudio("audioError");

        setTimeout(() => {

            hablar(
                "Debes ingresar tu nombre y elegir un avatar"
            );

        }, 500);

        return;
    }

    // ❌ falta nombre
    if (
        nombre === "" &&
        avatarSeleccionado !== null
    ) {

        reproducirAudio("audioError");

        setTimeout(() => {

            hablar(
                "Por favor escribe tu nombre"
            );

        }, 500);

        return;
    }

    // ❌ falta avatar
    if (
        nombre !== "" &&
        avatarSeleccionado === null
    ) {

        reproducirAudio("audioError");

        setTimeout(() => {

            hablar(
                "Por favor elige un avatar"
            );

        }, 500);

        return;
    }

    // ✅ correcto
    reproducirAudio("audioCorrecto");

    // guardar datos
    localStorage.setItem(
        "nombre",
        nombre
    );

    localStorage.setItem(
        "avatar",
        avatarSeleccionado
    );

    // confeti
    lanzarConfeti();

    // voz
        hablar(
                "Bienvenido " + nombre
);

    // 🚀 redireccionar
    setTimeout(() => {

        window.location.href =
            "bienvenido.html";

    }, 4000);
}