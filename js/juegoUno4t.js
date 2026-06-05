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

const numerosSets = [
    [104, 315, 682, 1289],
    [432, 1293, 2795, 4020],
    [707, 228, 1003, 951],
    [6235, 4289, 7201, 5010],
    [889, 1777, 2789, 3254]
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

    gameState.tilePool = tilePool;
    gameState.dropArea = dropArea;
}

function checkOrder() {
    const dropArea = gameState.dropArea;
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
