// =========================
// VARIABLES GLOBALES
// =========================

let puntos = 0;

let operacionesActuales = [];

let aciertosCanasta = {

    canasta1: 0,

    canasta2: 0,

    canasta3: 0
};

let manzanaIdCounter = 0;


// =========================
// SONIDOS
// =========================

let sonidoBoton = new Audio("sonidos/avatar.mp3");

let sonidoAcierto = new Audio("sonidos/correcto.mp3");

let sonidoError = new Audio("sonidos/error.mp3");


// =========================
// INICIAR JUEGO
// =========================

function iniciarJuego() {

    let nombre = localStorage.getItem("nombre");

    let avatar = localStorage.getItem("avatar");

    // Validación
    if (!nombre || !avatar) {

        window.location.href = "index.html";

        return;
    }

    // Generar operaciones aleatorias para las canastas
    generarOperaciones();

    // Mostrar operaciones en las canastas
    mostrarOperaciones();

    // Comenzar a crear manzanas
    crearManzanasAleatorias();

    // Voz de bienvenida
    hablar("Bienvenido al juego. Arrastra las manzanas a la canasta correcta");
}


// =========================
// GENERAR OPERACIONES ALEATORIAS
// =========================

function generarOperaciones() {

    const operacionesPosibles = [

        { 
            canasta: "canasta1", 
            operacion: "1 + 2", 
            resultado: 3, 
            texto: "1 + 2" 
        },

        { 
            canasta: "canasta2", 
            operacion: "2 + 3", 
            resultado: 5, 
            texto: "2 + 3" 
        },

        { 
            canasta: "canasta3", 
            operacion: "3 - 1", 
            resultado: 2, 
            texto: "3 - 1" 
        }
    ];

    operacionesActuales = operacionesPosibles;

    aciertosCanasta = {

        canasta1: 0,

        canasta2: 0,

        canasta3: 0
    };
}


// =========================
// MOSTRAR OPERACIONES EN CANASTAS
// =========================

function mostrarOperaciones() {

    operacionesActuales.forEach((op, index) => {

        const castastaId = "canasta" + (index + 1);

        const opElement = document.getElementById("op" + (index + 1));

        opElement.textContent = op.texto;

        opElement.dataset.resultado = op.resultado;

        const castastaElement = document.getElementById(castastaId);

        castastaElement.dataset.resultado = op.resultado;
    });
}


// =========================
// CREAR MANZANAS ALEATORIAS
// =========================

function crearManzanasAleatorias() {

    const resultados = [2, 2, 2, 3, 3, 3, 5, 5, 5];

    shuffle(resultados).forEach(resultado => {

        crearManzana(resultado);

    });
}


function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

    return array;
}


// =========================
// CREAR MANZANA
// =========================

function crearManzana(resultado) {

    const areaJuego = document.getElementById("areaJuego");

    // Contenedor de la manzana
    const contenedor = document.createElement("div");

    contenedor.className = "contenedor-manzana";

    // Crear imagen de manzana
    const manzana = document.createElement("img");

    manzana.src = "img/manzana.png";

    manzana.className = "manzana";

    manzana.draggable = true;

    // Resultado asignado
    const valor = resultado || [2, 3, 5][Math.floor(Math.random() * 3)];

    manzana.dataset.resultado = valor;
    contenedor.dataset.resultado = valor;

    // Crear número sobre la manzana
    const numero = document.createElement("div");

    numero.className = "numero-manzana";

    numero.textContent = valor;

    // Posición aleatoria
    const randomX = Math.random() * (areaJuego.offsetWidth - 50);

    const randomY = Math.random() * (areaJuego.offsetHeight - 50);

    contenedor.style.left = randomX + "px";

    contenedor.style.top = randomY + "px";

    // Eventos drag
    manzana.addEventListener("dragstart", (e) => {

        e.dataTransfer.effectAllowed = "move";

        e.dataTransfer.setData("resultado", valor.toString());

        e.dataTransfer.setData("elemento", contenedor.id);
    });

    manzana.addEventListener("dragend", (e) => {

        if (e.dataTransfer.dropEffect === "none") {

            mostrarMensajeFeedback("❌", "error");

            reproducirSonido(sonidoError);
        }
    });

    // ID único
    contenedor.id = "manzana_" + Date.now() + "_" + manzanaIdCounter++;

    // Agregar elementos al contenedor
    contenedor.appendChild(manzana);

    contenedor.appendChild(numero);

    areaJuego.appendChild(contenedor);
}


// =========================
// PERMITIR SOLTAR
// =========================

function permitirSoltar(event) {

    event.preventDefault();

    event.dataTransfer.dropEffect = "move";

    event.target.closest(".canasta").classList.add("activa");
}


// =========================
// SOLTAR MANZANA
// =========================

function soltar(event) {

    event.preventDefault();

    const canasta = event.target.closest(".canasta");

    const manzanaId = event.dataTransfer.getData("elemento");

    const contenedor = document.getElementById(manzanaId);

    if (!contenedor || !canasta) {
        return;
    }

    const actuales = canasta.querySelectorAll(".contenedor-manzana").length;

    if (actuales >= 3) {
        mostrarMensajeFeedback("Solo 3 manzanas por canasta", "error");
        return;
    }

    contenedor.dataset.canasta = canasta.id;

    canasta.appendChild(contenedor);

    contenedor.style.position = "relative";
    contenedor.style.left = "0";
    contenedor.style.top = "0";
    contenedor.style.margin = "4px";

    actualizarContadoresCanasta();

    canasta.classList.remove("activa");
}


// =========================
// ACTUALIZAR CONTADORES
// =========================

function actualizarContadoresCanasta() {

    [1, 2, 3].forEach(index => {

        const canasta = document.getElementById("canasta" + index);

        const cantidad = canasta.querySelectorAll(".contenedor-manzana").length;

        aciertosCanasta["canasta" + index] = cantidad;

        document.getElementById("aciertos" + index).textContent =
            cantidad + "/3";
    });
}


// =========================
// MOSTRAR MENSAJE FEEDBACK
// =========================

function mostrarMensajeFeedback(mensaje, tipo) {

    const feedback = document.createElement("div");

    feedback.className = "mensajeFeedback " + tipo;

    feedback.textContent = mensaje;

    document.body.appendChild(feedback);

    setTimeout(() => {

        feedback.remove();

    }, 1500);
}


// =========================
// REPRODUCIR SONIDO
// =========================

function reproducirSonido(audio) {

    if (audio) {

        audio.currentTime = 0;

        audio.play().catch(err => console.log("Error al reproducir sonido:", err));
    }
}


// =========================
// VERIFICAR JUEGO
// =========================

function verificarJuego() {

    const manzanas = document.querySelectorAll(".contenedor-manzana");

    let correct = 0;

    let wrong = 0;

    manzanas.forEach(contenedor => {

        const resultado = parseInt(contenedor.dataset.resultado);

        const canastaId = contenedor.dataset.canasta;

        if (!canastaId) {

            wrong++;

            return;
        }

        const canastaResultado = parseInt(
            document.getElementById(canastaId).dataset.resultado
        );

        if (resultado === canastaResultado) {

            correct++;

        } else {

            wrong++;
        }

    });

    puntos = correct * 10;

    document.getElementById("puntos").textContent = puntos;

    if (wrong === 0 && manzanas.length > 0) {

        mostrarResultadoFinal(true, puntos);

    } else {

        mostrarResultadoFinal(false, puntos);
    }
}


// =========================
// RESULTADO FINAL
// =========================

function mostrarResultadoFinal(exito, puntos) {

    const overlay = document.createElement("div");

    overlay.className = "resultadoOverlay";

    if (exito) {

        overlay.innerHTML =
            "<div class=\"resultadoContenedor exito\">🎉<br>¡Muy bien!<br>" +
            puntos +
            " puntos</div>";

        crearConfetti();

        reproducirSonido(sonidoAcierto);

        hablar("Excelente. Todo está bien, ganaste " + puntos + " puntos");

    } else {

        overlay.innerHTML =
            "<div class=\"resultadoContenedor error\">😢<br>¡Ups!<br>✖</div>";

        reproducirSonido(sonidoError);

        hablar(
            "Intenta de nuevo analizando mejor las restas"
        );

        setTimeout(() => {

            reiniciarJuego();

        }, 2500);
    }

    document.body.appendChild(overlay);

    setTimeout(() => {

        overlay.remove();

    }, 2200);
}


// =========================
// CONFETTI
// =========================

function crearConfetti() {

    const cantidad = 30;

    for (let i = 0; i < cantidad; i++) {

        const confetti = document.createElement("span");

        confetti.className = "confetti";

        confetti.style.left = Math.random() * 100 + "%";

        confetti.style.background =
            ["#FF5252", "#FFEB3B", "#4CAF50", "#2196F3", "#9C27B0"][
                Math.floor(Math.random() * 5)
            ];

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 2200);
    }
}


// =========================
// VOZ
// =========================

function hablar(texto) {

    speechSynthesis.cancel();

    let voz = new SpeechSynthesisUtterance(texto);

    voz.lang = "es-ES";

    voz.rate = 0.95;

    voz.pitch = 1.1;

    speechSynthesis.speak(voz);
}


// =========================
// REINICIAR JUEGO
// =========================

function reiniciarJuego() {

    window.location.reload();
}


// =========================
// VOLVER
// =========================

function volver() {

    window.location.href = "aprendizaje.html";
}
