const PAIR_COUNT = 8;
const cardNumbers = [12, 45, 108, 230, 506, 1000, 3205, 9999];

let gameState = {
    firstCard: null,
    secondCard: null,
    locked: false,
    pairsFound: 0,
    tries: 0,
    mistakes: 0,
    seconds: 0,
    timerId: null,
    started: false
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

function mostrarMensaje(text, correcto = true) {
    const resultBox = document.getElementById('resultBox');
    resultBox.textContent = text;
    resultBox.className = 'result-box';
    if (!correcto) resultBox.classList.add('error');
}

function updateScore() {
    document.getElementById('pairsFound').textContent = `${gameState.pairsFound} / ${PAIR_COUNT}`;
    document.getElementById('triesCount').textContent = gameState.tries;
}

function updateTimer() {
    const minutes = String(Math.floor(gameState.seconds / 60)).padStart(2, '0');
    const seconds = String(gameState.seconds % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function startTimer() {
    if (gameState.started) return;
    gameState.started = true;
    gameState.timerId = setInterval(() => {
        gameState.seconds += 1;
        updateTimer();
    }, 1000);
}

function stopTimer() {
    clearInterval(gameState.timerId);
    gameState.timerId = null;
}

function createCard(number, index) {
    const card = document.createElement('button');
    card.className = 'memory-card';
    card.type = 'button';
    card.dataset.value = number;
    card.dataset.cardIndex = index;
    card.setAttribute('aria-label', 'Casilla oculta');
    card.innerHTML = `
        <span class="card-inner">
            <span class="card-face card-back"></span>
            <span class="card-face card-front">${formatNumber(number)}</span>
        </span>
    `;
    card.addEventListener('click', () => flipCard(card));
    card.style.animationDelay = `${index * 0.04}s`;
    return card;
}

function flipCard(card) {
    if (gameState.locked || card.classList.contains('is-flipped') || card.classList.contains('is-matched')) return;

    startTimer();
    card.classList.add('is-flipped');
    card.setAttribute('aria-label', `Número ${formatNumber(Number(card.dataset.value))}`);

    if (!gameState.firstCard) {
        gameState.firstCard = card;
        reproducirAudio('click.mp3');
        mostrarMensaje('Muy bien. Ahora busca una casilla con el mismo número.');
        return;
    }

    gameState.secondCard = card;
    gameState.tries += 1;
    updateScore();
    checkPair();
}

function checkPair() {
    const firstValue = gameState.firstCard.dataset.value;
    const secondValue = gameState.secondCard.dataset.value;
    const isPair = firstValue === secondValue;

    gameState.locked = true;

    if (isPair) {
        reproducirAudio('bien.mp3');
        window.FourthGradeTools?.burstConfetti(75);
        setTimeout(() => {
            gameState.firstCard.classList.add('is-matched');
            gameState.secondCard.classList.add('is-matched');
            gameState.firstCard.disabled = true;
            gameState.secondCard.disabled = true;
            gameState.pairsFound += 1;
            updateScore();
            clearSelection();

            if (gameState.pairsFound === PAIR_COUNT) {
                finishGame();
            } else {
                mostrarMensaje(`¡Par encontrado! Ya llevas ${gameState.pairsFound} de ${PAIR_COUNT}.`);
            }
        }, 420);
        return;
    }

    reproducirAudio('error4TO.mp3');
    gameState.firstCard.classList.add('is-wrong');
    gameState.secondCard.classList.add('is-wrong');
    gameState.mistakes += 1;
    mostrarMensaje('No son iguales. Míralos un momento y vuelve a intentar.', false);

    setTimeout(() => {
        gameState.firstCard.classList.remove('is-flipped', 'is-wrong');
        gameState.secondCard.classList.remove('is-flipped', 'is-wrong');
        gameState.firstCard.setAttribute('aria-label', 'Casilla oculta');
        gameState.secondCard.setAttribute('aria-label', 'Casilla oculta');
        clearSelection();
        mostrarMensaje('Elige otra casilla azul y busca su pareja.');
    }, 1150);
}

function clearSelection() {
    gameState.firstCard = null;
    gameState.secondCard = null;
    gameState.locked = false;
}

function finishGame() {
    stopTimer();
    markCommonGameCompleted('4');
    window.FourthGradeTools?.startConfettiRain(3600, 170);
    window.FourthGradeTools?.speakText('Super bien.');
    const panel = document.querySelector('.game-panel');
    panel.classList.add('celebration');
    mostrarMensaje(`¡Juego completo! Encontraste los 8 pares en ${gameState.tries} intentos. Misión 4 completada.`);
    setTimeout(() => panel.classList.remove('celebration'), 2200);
}

function initGame() {
    const board = document.getElementById('memoryBoard');
    const values = shuffle([...cardNumbers, ...cardNumbers]);

    stopTimer();
    gameState = {
        firstCard: null,
        secondCard: null,
        locked: false,
        pairsFound: 0,
        tries: 0,
        mistakes: 0,
        seconds: 0,
        timerId: null,
        started: false
    };

    board.innerHTML = '';
    values.forEach((number, index) => board.appendChild(createCard(number, index)));
    updateScore();
    updateTimer();
    mostrarMensaje('Elige una casilla azul para comenzar.');
}

window.addEventListener('DOMContentLoaded', () => {
    const restartButton = document.getElementById('restartGame');
    if (restartButton) restartButton.addEventListener('click', initGame);
    window.FourthGradeTools?.setupVoiceGuide(document.getElementById('voiceGuideText')?.textContent, 'voiceGuideButton');
    initGame();
});
