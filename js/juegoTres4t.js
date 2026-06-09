function reproducirAudio(sonido) {
    const audio = new Audio(`sonidos/${sonido}`);
    audio.play().catch(err => console.log('Error al reproducir sonido:', err));
}

function mostrarMensaje(text, correcto) {
    const resultBox = document.getElementById('resultBox');
    if (!resultBox) return;
    resultBox.textContent = text;
    resultBox.className = 'result-box';
    if (!correcto) resultBox.classList.add('error');
    
    if (correcto) {
        reproducirAudio('bien.mp3');
        window.FourthGradeTools?.burstConfetti(90);
    } else {
        reproducirAudio('error4TO.mp3');
    }
}

function formatNumber(number) {
    return number.toLocaleString('es-CL');
}

function markCommonGameCompleted(gameId) {
    localStorage.setItem(`ma04_common_game_${gameId}`, 'completed');
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const placeLabels = [
    { label: 'Unidades de mil', value: 1000, short: 'UM' },
    { label: 'Centenas', value: 100, short: 'C' },
    { label: 'Decenas', value: 10, short: 'D' },
    { label: 'Unidades', value: 1, short: 'U' }
];

let gameState = {
    number: null
};

function getDigits(number) {
    return String(number).padStart(4, '0').split('').map(Number);
}

function initJuego() {
    const number = Math.floor(Math.random() * 9000) + 1000;
    const digits = getDigits(number);
    const table = document.getElementById('placeTable');
    const questionLabel = document.getElementById('questionLabel');
    const numberInput = document.getElementById('studentNumber');
    const resultBox = document.getElementById('resultBox');

    numberInput.value = '';
    resultBox.textContent = '';
    table.innerHTML = '';
    questionLabel.textContent = 'Ordena mentalmente las posiciones y escribe el número que forman:';

    const cells = placeLabels.map((place, index) => ({
        ...place,
        digit: digits[index]
    }));

    shuffle(cells).forEach(place => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.innerHTML = `<span class="label">${place.label}</span><strong>${place.digit}</strong>`;
        table.appendChild(cell);
    });

    gameState.number = number;
    renderRepresentations(number, digits);
}

function renderRepresentations(number, digits) {
    const panel = document.getElementById('representationPanel');
    const expanded = digits
        .map((digit, index) => digit * placeLabels[index].value)
        .filter(value => value > 0);
    const expandedText = expanded.length ? expanded.map(formatNumber).join(' + ') : '0';

    panel.innerHTML = `
        <div class="representation-box">
            <span class="representation-label">Forma desarrollada</span>
            <strong>${expandedText}</strong>
        </div>
        <div class="representation-box">
            <span class="representation-label">Lectura</span>
            <strong>${leerNumero(number)}</strong>
        </div>
    `;
}

function checkNumber() {
    const numberInput = document.getElementById('studentNumber');
    const answer = Number(numberInput.value.trim().replace(/\./g, ''));
    if (!answer) {
        mostrarMensaje('Escribe un número para comprobar.', false);
        return;
    }
    const correcto = answer === gameState.number;
    if (correcto) markCommonGameCompleted('3');
    mostrarMensaje(
        correcto
            ? `¡Perfecto! Es el número ${formatNumber(gameState.number)}. Misión 3 completada.`
            : 'Todavía no es correcto. Recuerda ordenar: unidades de mil, centenas, decenas y unidades.',
        correcto
    );
}

function showWord() {
    const palabras = leerNumero(gameState.number);
    mostrarMensaje(`El número se lee: ${palabras}.`, true);
}

function resetNumber() {
    initJuego();
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
    const checkButton = document.getElementById('checkNumber');
    const showButton = document.getElementById('showWord');
    const resetButton = document.getElementById('resetNumber');

    if (checkButton) checkButton.addEventListener('click', checkNumber);
    if (showButton) showButton.addEventListener('click', showWord);
    if (resetButton) resetButton.addEventListener('click', resetNumber);
    window.FourthGradeTools?.setupVoiceGuide(document.getElementById('voiceGuideText')?.textContent, 'voiceGuideButton');

    initJuego();
});
