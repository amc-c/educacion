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

let gameState = {
    correctAnswer: null,
    questionType: 'mayor',
    hasAnswered: false
};

function createNumbers() {
    const numbers = new Set();
    while (numbers.size < 3) {
        numbers.add(Math.floor(Math.random() * 10000) + 1);
    }
    return [...numbers];
}

function renderNumberLine(numbers) {
    const numberLine = document.getElementById('numberLine');
    const lineMin = document.getElementById('lineMin');
    const lineMax = document.getElementById('lineMax');
    numberLine.innerHTML = '';
    lineMin.textContent = '0';
    lineMax.textContent = '10.000';

    [...numbers].sort((a, b) => a - b).forEach((numero, index) => {
        const marker = document.createElement('span');
        marker.className = 'number-marker';
        marker.style.left = `${Math.max(2, Math.min(98, (numero / 10000) * 100))}%`;
        marker.style.setProperty('--marker-top', `${4 + (index * 50)}px`);
        marker.style.setProperty('--stem-height', `${126 - (index * 50)}px`);
        marker.textContent = formatNumber(numero);
        marker.title = `Número ${formatNumber(numero)}`;
        numberLine.appendChild(marker);
    });
}

function initJuego() {
    const questionType = Math.random() > 0.5 ? 'mayor' : 'menor';
    const numbers = createNumbers();
    const pregunta = document.getElementById('questionText');
    const answerArea = document.getElementById('answers');
    const resultBox = document.getElementById('resultBox');

    answerArea.innerHTML = '';
    resultBox.textContent = '';
    gameState.hasAnswered = false;

    if (questionType === 'mayor') {
        pregunta.textContent = '¿Cuál es el número más grande?';
        gameState.correctAnswer = Math.max(...numbers);
    } else {
        pregunta.textContent = '¿Cuál es el número más pequeño?';
        gameState.correctAnswer = Math.min(...numbers);
    }
    gameState.questionType = questionType;
    renderNumberLine(numbers);

    shuffle([...numbers]).forEach(numero => {
        const boton = document.createElement('button');
        boton.className = 'button answer-button';
        boton.textContent = formatNumber(numero);
        boton.dataset.value = numero;
        boton.addEventListener('click', () => answerQuestion(boton));
        answerArea.appendChild(boton);
    });
}

function answerQuestion(selectedButton) {
    if (gameState.hasAnswered) return;
    gameState.hasAnswered = true;

    const selectedValue = Number(selectedButton.dataset.value);
    const correcto = selectedValue === gameState.correctAnswer;
    const buttons = Array.from(document.querySelectorAll('.answer-button'));
    const sorted = buttons
        .map(button => Number(button.dataset.value))
        .sort((a, b) => a - b)
        .map(formatNumber)
        .join(' < ');
    const ayuda = gameState.questionType === 'mayor'
        ? 'El mayor es el que queda más a la derecha en la recta numérica.'
        : 'El menor es el que queda más a la izquierda en la recta numérica.';

    buttons.forEach(button => {
        button.disabled = true;
        if (Number(button.dataset.value) === gameState.correctAnswer) {
            button.classList.add('is-correct');
        }
    });
    selectedButton.classList.add(correcto ? 'selected-correct' : 'selected-wrong');
    if (correcto) markCommonGameCompleted('2');

    mostrarMensaje(
        correcto
            ? `¡Muy bien! ${formatNumber(gameState.correctAnswer)} es la respuesta correcta. Misión 2 completada. Orden: ${sorted}.`
            : `Esta vez no. La respuesta correcta era ${formatNumber(gameState.correctAnswer)}. ${ayuda} Orden: ${sorted}.`,
        correcto
    );
}

window.addEventListener('DOMContentLoaded', () => {
    const newQuestionButton = document.getElementById('newQuestion');
    if (newQuestionButton) newQuestionButton.addEventListener('click', initJuego);
    initJuego();
});
