// =========================
// INICIAR FELICITACIONES
// =========================

function iniciarFelicitaciones() {

    // Obtener datos del localStorage
    let nombre = localStorage.getItem("nombre");
    let avatar = localStorage.getItem("avatar");
    let puntos = parseInt(localStorage.getItem("puntosJuego")) || 0;

    // Validar datos
    if (!nombre || !avatar) {
        window.location.href = "index.html";
        return;
    }

    // Mostrar avatar
    document.getElementById("avatar-img").src = avatar;

    // Mostrar puntos
    document.getElementById("puntos-numero").textContent = puntos;

    // Personalizar mensaje
    document.getElementById("mensaje").textContent = `¡Felicidades ${nombre}!`;

    // Reproducir sonido de logro
    reproducirSonidoFelicitaciones();

    // Crear confeti
    crearConfetiFelicitaciones();

    // Hacer la voz de felicitaciones
    hacerVozFelicitaciones(nombre, puntos);
}


// =========================
// REPRODUCIR SONIDO FELICITACIONES
// =========================

function reproducirSonidoFelicitaciones() {

    const audio = document.getElementById("audioFelicitaciones");

    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(err => console.log("Error al reproducir sonido:", err));
    }
}


// =========================
// CREAR CONFETI ANIMADO
// =========================

function crearConfetiFelicitaciones() {

    const container = document.getElementById("confetti-container");
    const emojis = ["🎉", "🎊", "⭐", "🎈", "🎆", "🎇"];
    const cantidad = 60;

    for (let i = 0; i < cantidad; i++) {

        const confetti = document.createElement("span");
        confetti.className = "confetti";
        
        // Emoji aleatorio
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.textContent = emoji;

        // Posición aleatoria horizontal
        confetti.style.left = Math.random() * 100 + "%";
        
        // Posición inicial en la parte superior
        confetti.style.top = "-30px";

        // Opacidad inicial
        confetti.style.opacity = "1";

        // Velocidad aleatoria
        const duracion = 3 + Math.random() * 2;
        confetti.style.animationDuration = duracion + "s";

        // Desvío horizontal
        const desvio = (Math.random() - 0.5) * 200;
        confetti.style.setProperty("--desvio", desvio + "px");

        // Agregar al contenedor
        container.appendChild(confetti);

        // Remover después de la animación
        setTimeout(() => {
            confetti.remove();
        }, duracion * 1000);
    }
}


// =========================
// VOZ DE FELICITACIONES
// =========================

function hacerVozFelicitaciones(nombre, puntos) {

    // Esperar un poco antes de hablar para que se aprecie la carga
    setTimeout(() => {

        const texto = `¡Felicidades ${nombre}! ¡Lo hiciste excelente! Obtuviste ${puntos} puntos. ¡Estamos muy orgullosos de ti!`;

        // Crear utterance para voz
        let voz = new SpeechSynthesisUtterance(texto);

        voz.lang = "es-ES";
        voz.volume = 1;
        voz.rate = 0.95;
        voz.pitch = 1.1;

        // Reproducir voz
        speechSynthesis.cancel();
        speechSynthesis.speak(voz);

    }, 800);
}


// =========================
// VOLVER AL LOGIN
// =========================

function volverAlLogin() {

    // Limpiar localStorage de sesión de juego
    localStorage.removeItem("puntosJuego");

    // Ir al login
    window.location.href = "index.html";
}
