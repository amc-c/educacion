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

let gameState = {
    correctAnswer: null
};

function initJuego() {
    const questionType = Math.random() > 0.5 ? 'mayor' : 'menor';
    const numbers = shuffle([Math.floor(Math.random() * 9000) + 1000, Math.floor(Math.random() * 9000) + 1000, Math.floor(Math.random() * 9000) + 1000]);
    const pregunta = document.getElementById('questionText');
    const answerArea = document.getElementById('answers');
    const resultBox = document.getElementById('resultBox');

    answerArea.innerHTML = '';
    resultBox.textContent = '';

    let correctAnswer;
    if (questionType === 'mayor') {
        pregunta.textContent = '¿Cuál es el número más grande?';
        correctAnswer = Math.max(...numbers);
    } else {
        pregunta.textContent = '¿Cuál es el número más pequeño?';
        correctAnswer = Math.min(...numbers);
    }
    gameState.correctAnswer = correctAnswer;

    shuffle(numbers).forEach((numero) => {
        const boton = document.createElement('button');
        boton.className = 'button answer-button';
        boton.textContent = numero;
        boton.addEventListener('click', () => {
            const correcto = Number(boton.textContent) === gameState.correctAnswer;
            mostrarMensaje(correcto ? '¡Genial! Elegiste el número correcto.' : 'No es correcto, vuelve a intentarlo.', correcto);
        });
        answerArea.appendChild(boton);
    });
}

function newQuestion() {
    initJuego();
}

window.addEventListener('DOMContentLoaded', () => {
    const newQuestion = document.getElementById('newQuestion');
    if (newQuestion) newQuestion.addEventListener('click', newQuestion);
    initJuego();
});
