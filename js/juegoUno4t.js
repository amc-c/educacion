const ROUND_TOTAL = 4;

const numerosSets = [
    [104, 315, 682, 1289],
    [432, 1293, 2795, 4020],
    [707, 228, 1003, 951],
    [6235, 4289, 7201, 10000],
    [889, 1777, 2789, 3254],
    [98, 1000, 5099, 8102]
];

let gameState = {
    round: 1,
    hadMistake: false,
    tilePool: null,
    dropArea: null,
    roundResults: [],
    currentCorrectAnswer: "",
    currentNumbers: []
};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function formatNumber(number) {
    return number.toLocaleString('es-CL');
}

function markCommonGameCompleted(gameId) {
    localStorage.setItem(`ma04_common_game_${gameId}`, 'completed');
}

function reproducirAudio(sonido) {
    const audio = new Audio(`sonidos/${sonido}`);
    audio.play().catch(err => console.log('Error al reproducir sonido:', err));
}

function crearTarjeta(numero, index) {
    const card = document.createElement('div');
    card.className = 'number-card';
    card.textContent = formatNumber(numero);
    card.dataset.value = numero;
    card.setAttribute('draggable', 'true');
    card.id = `tile-${index}`;
    card.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text/plain', card.id);
        reproducirAudio('click.mp3');
        window.FourthGradeTools?.speakText(String(numero));
    });
    card.addEventListener('click', () => {
        reproducirAudio('click.mp3');
        window.FourthGradeTools?.speakText(String(numero));
    });
    return card;
}

function initJuego(resetRounds = false) {
    const tilePool = document.getElementById('tilePool');
    const dropArea = document.getElementById('dropArea');
    const resultBox = document.getElementById('resultBox');

    if (resetRounds) {
        gameState.round = 1;
        gameState.hadMistake = false;
        gameState.roundResults = [];
    }

    tilePool.innerHTML = '';
    dropArea.innerHTML = '';
    resultBox.textContent = `Ronda ${gameState.round} de ${ROUND_TOTAL}`;
    resultBox.className = 'result-box';

    const numbers = [...numerosSets[Math.floor(Math.random() * numerosSets.length)]];
    gameState.currentNumbers = [...numbers];
    // Store the correct sorted order for the summary table
    const sorted = [...numbers].sort((a, b) => a - b);
    gameState.currentCorrectAnswer = sorted.map(n => formatNumber(n)).join(' → ');

    shuffle(numbers).forEach((numero, index) => tilePool.appendChild(crearTarjeta(numero, index)));

    const zones = ['Menor', 'Segundo', 'Tercero', 'Mayor'];
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

    gameState.tilePool = tilePool;
    gameState.dropArea = dropArea;
}

function finishRounds() {
    markCommonGameCompleted('1');
    const correctCount = gameState.roundResults.filter(res => res.correct).length;
    localStorage.setItem('ma04_game_1_puntaje', String(correctCount));
    
    let tableRows = gameState.roundResults.map(res => `
        <tr style="border-bottom: 1px solid rgba(0,0,0,0.08);">
            <td style="padding: 6px; font-weight: bold;">Ronda ${res.round}</td>
            <td style="padding: 6px;">${res.correct ? '✅ Bien' : '❌ Mal'}</td>
            <td style="padding: 6px; font-family: monospace; font-size: 0.85rem;">${res.childAnswer}</td>
            <td style="padding: 6px; font-family: monospace; font-size: 0.85rem;">${res.correctAnswer}</td>
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
                        <th style="padding: 8px;">Tu respuesta</th>
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
        resultBox.innerHTML = `¡Juego completo! Misión 1 completada.<br>${tableHtml}`;
        resultBox.className = 'result-box';
    }
    
    reproducirAudio(gameState.hadMistake ? 'error4TO.mp3' : 'bien.mp3');
    if (!gameState.hadMistake) {
        window.FourthGradeTools?.burstConfetti(90);
    }
    window.FourthGradeTools?.speakGameResult(!gameState.hadMistake);
}

function checkOrder() {
    const dropArea = gameState.dropArea;
    if (!dropArea) return;

    const zones = Array.from(dropArea.querySelectorAll('.drop-zone'));
    const selected = zones.map(zone => {
        const tile = zone.querySelector('.number-card');
        return tile ? Number(tile.dataset.value) : null;
    });

    // All slots must be filled before checking
    if (selected.includes(null)) {
        const resultBox = document.getElementById('resultBox');
        if (resultBox) {
            resultBox.textContent = 'Coloca todos los números en sus casillas primero.';
            resultBox.className = 'result-box error';
        }
        return;
    }

    const esCorrecto = selected.every((num, index, arr) => index === 0 || num >= arr[index - 1]);
    const childAnswer = selected.map(n => formatNumber(n)).join(' → ');

    if (!esCorrecto) {
        gameState.hadMistake = true;
    }

    // Always record the result and advance — never block
    gameState.roundResults.push({
        round: gameState.round,
        correct: esCorrecto,
        childAnswer: childAnswer,
        correctAnswer: gameState.currentCorrectAnswer
    });

    if (gameState.round >= ROUND_TOTAL) {
        finishRounds();
        return;
    }

    gameState.round += 1;
    setTimeout(() => initJuego(false), 300);
}

function resetGame() {
    initJuego(true);
}

window.addEventListener('DOMContentLoaded', () => {
    const checkButton = document.getElementById('checkOrder');
    const resetButton = document.getElementById('resetGame');
    const tilePool = document.getElementById('tilePool');

    if (checkButton) checkButton.addEventListener('click', checkOrder);
    if (resetButton) resetButton.addEventListener('click', resetGame);
    
    if (tilePool) {
        tilePool.addEventListener('dragover', event => {
            event.preventDefault();
        });
        tilePool.addEventListener('drop', event => {
            event.preventDefault();
            const tileId = event.dataTransfer.getData('text/plain');
            const tile = document.getElementById(tileId);
            if (tile) tilePool.appendChild(tile);
        });
    }

    window.FourthGradeTools?.setupVoiceGuide(document.getElementById('voiceGuideText')?.textContent, 'voiceGuideButton');

    initJuego(true);
});
