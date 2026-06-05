const juegoData = {
    uno: {
        sets: [
            [104, 315, 682, 1289],
            [432, 1293, 2795, 4020],
            [707, 228, 1003, 951],
            [6235, 4289, 7201, 5010],
            [889, 1777, 2789, 3254]
        ]
    },
    dos: {
        phrases: {
            mayor: '¿Cuál es el número más grande?',
            menor: '¿Cuál es el número más pequeño?'
        }
    },
    tres: {
        placeLabels: ['Miles', 'Centenas', 'Decenas', 'Unidades']
    }
};

let juegoUnoState = {};
let juegoDosState = { correctAnswer: null };
let juegoTresState = { number: null };

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function mostrarMensaje(text, correcto) {
    const resultBox = document.getElementById('resultBox');
    if (!resultBox) return;
    resultBox.textContent = text;
    resultBox.className = 'result-box';
    if (!correcto) resultBox.classList.add('error');
}

function crearTarjeta(numero, index) {
    const card = document.createElement('button');
    card.className = 'number-card';
    card.textContent = numero;
    card.setAttribute('draggable', 'true');
    card.id = `tile-${index}`;
    card.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text/plain', card.id);
    });
    return card;
}

function initJuegoUno() {
    const tilePool = document.getElementById('tilePool');
    const dropArea = document.getElementById('dropArea');
    const resultBox = document.getElementById('resultBox');

    tilePool.innerHTML = '';
    dropArea.innerHTML = '';
    resultBox.textContent = '';

    const numbers = [...juegoData.uno.sets[Math.floor(Math.random() * juegoData.uno.sets.length)]];
    shuffle(numbers);
    numbers.forEach((numero, index) => tilePool.appendChild(crearTarjeta(numero, index)));

    const zones = ['Primero', 'Segundo', 'Tercero', 'Cuarto'];
    zones.forEach((label, index) => {
        const zone = document.createElement('div');
        zone.className = 'drop-zone';
        zone.dataset.label = label;
        zone.dataset.index = index;
        zone.addEventListener('dragover', event => {
            event.preventDefault();
            zone.classList.add('over');
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('over'));
        zone.addEventListener('drop', event => {
            event.preventDefault();
            zone.classList.remove('over');
            const tileId = event.dataTransfer.getData('text/plain');
            const tile = document.getElementById(tileId);
            if (!tile) return;
            const existing = zone.querySelector('.number-card');
            if (existing) tilePool.appendChild(existing);
            zone.appendChild(tile);
        });
        dropArea.appendChild(zone);
    });

    juegoUnoState.tilePool = tilePool;
    juegoUnoState.dropArea = dropArea;
}

function checkJuegoUno() {
    const dropArea = juegoUnoState.dropArea;
    if (!dropArea) return;
    const selected = Array.from(dropArea.querySelectorAll('.drop-zone')).map(zone => {
        const tile = zone.querySelector('.number-card');
        return tile ? Number(tile.textContent) : null;
    });
    if (selected.includes(null)) {
        mostrarMensaje('Coloca todos los números en sus casillas primero.', false);
        return;
    }
    const esCorrecto = selected.every((num, index, arr) => index === 0 || num >= arr[index - 1]);
    mostrarMensaje(esCorrecto ? '¡Muy bien! Los números están ordenados de menor a mayor.' : 'Intenta otra vez: el orden debe ser de menor a mayor.', esCorrecto);
}

function setupJuegoUno() {
    const checkButton = document.getElementById('checkOrder');
    const resetButton = document.getElementById('resetGame');
    if (!checkButton || !resetButton) return;
    checkButton.addEventListener('click', checkJuegoUno);
    resetButton.addEventListener('click', initJuegoUno);
}

function initJuegoDos() {
    const questionType = Math.random() > 0.5 ? 'mayor' : 'menor';
    const numbers = shuffle([Math.floor(Math.random() * 9000) + 1000, Math.floor(Math.random() * 9000) + 1000, Math.floor(Math.random() * 9000) + 1000]);
    const pregunta = document.getElementById('questionText');
    const answerArea = document.getElementById('answers');
    const resultBox = document.getElementById('resultBox');

    answerArea.innerHTML = '';
    resultBox.textContent = '';

    let correctAnswer;
    if (questionType === 'mayor') {
        pregunta.textContent = juegoData.dos.phrases.mayor;
        correctAnswer = Math.max(...numbers);
    } else {
        pregunta.textContent = juegoData.dos.phrases.menor;
        correctAnswer = Math.min(...numbers);
    }
    juegoDosState.correctAnswer = correctAnswer;

    shuffle(numbers).forEach((numero) => {
        const boton = document.createElement('button');
        boton.className = 'button answer-button';
        boton.textContent = numero;
        boton.addEventListener('click', () => {
            const correcto = Number(boton.textContent) === juegoDosState.correctAnswer;
            mostrarMensaje(correcto ? '¡Genial! Elegiste el número correcto.' : 'No es correcto, vuelve a intentarlo.', correcto);
        });
        answerArea.appendChild(boton);
    });
}

function setupJuegoDos() {
    const newQuestion = document.getElementById('newQuestion');
    if (!newQuestion) return;
    newQuestion.addEventListener('click', initJuegoDos);
}

function initJuegoTres() {
    const digits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
    if (digits[0] === 0) digits[0] = Math.floor(Math.random() * 9) + 1;
    const number = Number(digits.join(''));
    const table = document.getElementById('placeTable');
    const numberInput = document.getElementById('studentNumber');
    const resultBox = document.getElementById('resultBox');

    numberInput.value = '';
    resultBox.textContent = '';
    table.innerHTML = '';
    juegoData.tres.placeLabels.forEach((label, index) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.innerHTML = `<span class="label">${label}</span><strong>${digits[index]}</strong>`;
        table.appendChild(cell);
    });
    juegoTresState.number = number;
}

function checkJuegoTres() {
    const numberInput = document.getElementById('studentNumber');
    const answer = Number(numberInput.value.trim());
    if (!answer) {
        mostrarMensaje('Escribe un número para comprobar.', false);
        return;
    }
    const correcto = answer === juegoTresState.number;
    mostrarMensaje(correcto ? `¡Perfecto! Es el número ${juegoTresState.number}.` : 'Todavía no es correcto. Revisa los dígitos en la tabla.', correcto);
}

function setupJuegoTres() {
    const checkNumber = document.getElementById('checkNumber');
    const showWord = document.getElementById('showWord');
    const resetNumber = document.getElementById('resetNumber');

    if (!checkNumber || !showWord || !resetNumber) return;
    checkNumber.addEventListener('click', checkJuegoTres);
    showWord.addEventListener('click', () => {
        const palabras = leerNumero(juegoTresState.number);
        mostrarMensaje(`El número se lee: ${palabras}.`, true);
    });
    resetNumber.addEventListener('click', initJuegoTres);
}

function leerNumero(numero) {
    const especiales = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    if (numero === 0) return 'cero';
    const miles = Math.floor(numero / 1000);
    const resto = numero % 1000;
    let texto = '';

    if (miles > 0) {
        texto += miles === 1 ? 'mil ' : `${leerTrio(miles)} mil `;
    }
    texto += leerTrio(resto);
    return texto.trim().replace(/\s+/g, ' ');

    function leerTrio(valor) {
        if (valor === 0) return '';
        if (valor === 100) return 'cien';
        const c = Math.floor(valor / 100);
        const d = Math.floor((valor % 100) / 10);
        const u = valor % 10;
        let cadena = '';
        if (c > 0) cadena += `${centenas[c]} `;
        if (d === 1) cadena += `${especiales[10 + u]} `;
        else if (d === 2 && u > 0) cadena += `veinti${especiales[u]} `;
        else if (d >= 2) cadena += decenas[d] + (u > 0 ? ` y ${especiales[u]} ` : ' ');
        else if (u > 0) cadena += `${especiales[u]} `;
        return cadena;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const game = document.body.dataset.game;
    if (game === 'uno') {
        setupJuegoUno();
        initJuegoUno();
    }
    if (game === 'dos') {
        setupJuegoDos();
        initJuegoDos();
    }
    if (game === 'tres') {
        setupJuegoTres();
        initJuegoTres();
    }
});
