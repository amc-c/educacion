function iniciarBienvenida4to() {
    const nombre = localStorage.getItem("nombre");
    const avatar = localStorage.getItem("avatar");

    if (!nombre || !avatar) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("nombreUsuario").textContent = nombre;
    document.getElementById("avatar4to").src = avatar;

    hablar("Hola " + nombre + " bienvenido");

    const boton = document.getElementById("btnAprender4to");
    if (boton) {
        boton.addEventListener("click", () => {
            hablar("¡Muy bien " + nombre + ". Pronto empezaremos a aprender 4to básico.");
            boton.classList.add("activo");
            setTimeout(() => boton.classList.remove("activo"), 220);
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
