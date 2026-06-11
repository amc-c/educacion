const ROUND_TOTAL = 3;

const placeLabels = [
    { label: 'Unidades de mil', value: 1000, short: 'UM' },
    { label: 'Centenas', value: 100, short: 'C' },
    { label: 'Decenas', value: 10, short: 'D' },
    { label: 'Unidades', value: 1, short: 'U' }
];

let gameState = {
    number: null,
    round: 1,
    hadMistake: false,
    roundResults: [],
    currentRoundHadMistake: false
};

function reproducirAudio(sonido) {
    const audio = new Audio(`sonidos/${sonido}`);
    audio.play().catch(err => console.log('Error al reproducir sonido:', err));
}

function mostrarMensaje(text, correcto) {
    const resultBox = document.getElementById('resultBox');
    if (!resultBox) return;
    resultBox.innerHTML = text;
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

function getDigits(number) {
    return String(number).padStart(4, '0').split('').map(Number);
}

function initJuego(resetRounds = false) {
    const number = Math.floor(Math.random() * 9000) + 1000;
    const digits = getDigits(number);
    const table = document.getElementById('placeTable');
    const questionLabel = document.getElementById('questionLabel');
    const numberInput = document.getElementById('studentNumber');
    const resultBox = document.getElementById('resultBox');

    if (resetRounds) {
        gameState.round = 1;
        gameState.hadMistake = false;
        gameState.roundResults = [];
        gameState.currentRoundHadMistake = false;
    }

    numberInput.value = '';
    resultBox.textContent = `Ronda ${gameState.round} de ${ROUND_TOTAL}`;
    table.innerHTML = '';
    questionLabel.textContent = `Ronda ${gameState.round} de ${ROUND_TOTAL}: ordena mentalmente las posiciones y escribe el número que forman:`;

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

function finishRounds() {
    markCommonGameCompleted('3');
    
    let tableRows = gameState.roundResults.map(res => `
        <tr style="border-bottom: 1px solid rgba(0,0,0,0.08);">
            <td style="padding: 6px; font-weight: bold;">Ronda ${res.round}</td>
            <td style="padding: 6px;">${res.correct ? '✅ Bien' : '❌ Mal'}</td>
            <td style="padding: 6px; font-family: monospace; font-size: 0.95rem;">${res.correctAnswer}</td>
        </tr>
    `).join('');

    const tableHtml = `
        <div style="margin-top: 10px;">
            <strong style="display: block; margin-bottom: 6px;">Resumen del juego:</strong>
            <table style="width: 100%; border-collapse: collapse; text-align: left; background: rgba(255,255,255,0.6); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <thead>
                    <tr style="background: rgba(0,0,0,0.05); border-bottom: 2px solid rgba(0,0,0,0.1);">
                        <th style="padding: 8px;">Ronda</th>
                        <th style="padding: 8px;">Resultado</th>
                        <th style="padding: 8px;">Respuesta Correcta</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;

    const resultBox = document.getElementById('resultBox');
    if (resultBox) {
        resultBox.innerHTML = `¡Juego completo! Misión 3 completada.<br>${tableHtml}`;
        resultBox.className = 'result-box';
    }
    
    reproducirAudio(gameState.hadMistake ? 'error4TO.mp3' : 'bien.mp3');
    if (!gameState.hadMistake) {
        window.FourthGradeTools?.burstConfetti(90);
    }
    window.FourthGradeTools?.speakGameResult(!gameState.hadMistake);
}

function checkNumber() {
    const numberInput = document.getElementById('studentNumber');
    const answer = Number(numberInput.value.trim().replace(/\./g, ''));
    if (!answer) {
        const resultBox = document.getElementById('resultBox');
        if (resultBox) {
            resultBox.textContent = 'Escribe un número para comprobar.';
            resultBox.className = 'result-box error';
        }
        return;
    }

    const correcto = answer === gameState.number;
    if (!correcto) {
        gameState.hadMistake = true;
        gameState.currentRoundHadMistake = true;
        const resultBox = document.getElementById('resultBox');
        if (resultBox) {
            resultBox.textContent = `Ronda ${gameState.round} de ${ROUND_TOTAL}`;
            resultBox.className = 'result-box';
        }
        return;
    }

    gameState.roundResults.push({
        round: gameState.round,
        correct: !gameState.currentRoundHadMistake,
        correctAnswer: formatNumber(gameState.number)
    });
    gameState.currentRoundHadMistake = false;

    if (gameState.round >= ROUND_TOTAL) {
        finishRounds();
        return;
    }

    gameState.round += 1;
    setTimeout(() => initJuego(false), 300);
}

function showWord() {
    const palabras = leerNumero(gameState.number);
    mostrarMensaje(`El número se lee: ${palabras}.`, true);
}

function resetNumber() {
    initJuego(true);
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

    initJuego(true);
});
