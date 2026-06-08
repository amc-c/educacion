function iniciarBienvenida4to() {
    const nombre = localStorage.getItem("nombre");
    const avatar = localStorage.getItem("avatar");

    if (!nombre || !avatar) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("nombreUsuario").textContent = nombre;
    document.getElementById("avatar4to").src = avatar;

    const audio4to = new Audio("sonidos/login4to.mp3");
    audio4to.volume = 0.9;
    audio4to.play().catch(() => {
        // si no se puede autoplay, ignorar
    });

    hablar("Hola " + nombre + " bienvenido");

    const boton = document.getElementById("btnAprender4to");
    if (boton) {
        boton.addEventListener("click", () => {
            hablar("Es hora de jugar");
            boton.classList.add("activo");
            setTimeout(() => {
                boton.classList.remove("activo");
                window.location.href = "lista.html";
            }, 1500);
        });
    }
}

function hablar(texto) {
    speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-ES";
    voz.volume = 1;
    voz.rate = 1;
    voz.pitch = 1;
    speechSynthesis.speak(voz);
}
