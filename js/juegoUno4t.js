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

function mostrarMensaje(text, correcto) {
    const resultBox = document.getElementById('resultBox');
    if (!resultBox) return;
    resultBox.textContent = text;
    resultBox.className = 'result-box';
    if (!correcto) resultBox.classList.add('error');
    
    if (correcto) {
        reproducirAudio('bien.mp3');
    } else {
        reproducirAudio('error4TO.mp3');
    }
}

function crearTarjeta(numero, index) {
    const card = document.createElement('button');
    card.className = 'number-card';
    card.textContent = formatNumber(numero);
    card.dataset.value = numero;
    card.setAttribute('draggable', 'true');
    card.id = `tile-${index}`;
    card.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text/plain', card.id);
    });
    return card;
}

const numerosSets = [
    [104, 315, 682, 1289],
    [432, 1293, 2795, 4020],
    [707, 228, 1003, 951],
    [6235, 4289, 7201, 10000],
    [889, 1777, 2789, 3254],
    [98, 1000, 5099, 8102]
];

let gameState = {};

function initJuego() {
    const tilePool = document.getElementById('tilePool');
    const dropArea = document.getElementById('dropArea');
    const resultBox = document.getElementById('resultBox');

    tilePool.innerHTML = '';
    dropArea.innerHTML = '';
    resultBox.textContent = '';

    const numbers = [...numerosSets[Math.floor(Math.random() * numerosSets.length)]];
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

function checkOrder() {
    const dropArea = gameState.dropArea;
    if (!dropArea) return;
    const selected = Array.from(dropArea.querySelectorAll('.drop-zone')).map(zone => {
        const tile = zone.querySelector('.number-card');
        return tile ? Number(tile.dataset.value) : null;
    });
    if (selected.includes(null)) {
        mostrarMensaje('Coloca todos los números en sus casillas primero.', false);
        return;
    }
    const esCorrecto = selected.every((num, index, arr) => index === 0 || num >= arr[index - 1]);
    const ordenCorrecto = [...selected].sort((a, b) => a - b).map(formatNumber).join(' < ');
    if (esCorrecto) markCommonGameCompleted('1');
    mostrarMensaje(
        esCorrecto
            ? `¡Muy bien! El orden es ${ordenCorrecto}. Misión 1 completada.`
            : 'Intenta otra vez: el orden debe ir desde el número menor hasta el número mayor.',
        esCorrecto
    );
}

function resetGame() {
    initJuego();
}

window.addEventListener('DOMContentLoaded', () => {
    const checkButton = document.getElementById('checkOrder');
    const resetButton = document.getElementById('resetGame');

    if (checkButton) checkButton.addEventListener('click', checkOrder);
    if (resetButton) resetButton.addEventListener('click', resetGame);

    initJuego();
});
