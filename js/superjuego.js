const QUESTION_POOL = [
    {
        text: '2 decenas y 5 unidades, ¿qué número forma?',
        options: ['25', '52', '205'],
        correctIndex: 0
    },
    {
        text: '7 centenas y 3 unidades, ¿qué número es?',
        options: ['703', '730', '37'],
        correctIndex: 0
    },
    {
        text: '4 miles y 8 decenas, ¿qué número aparece?',
        options: ['4080', '4800', '8040'],
        correctIndex: 0
    },
    {
        text: '¿Cuál es mayor? 3.205 o 3.250',
        options: ['3.205', '3.250', '3.052'],
        correctIndex: 1
    },
    {
        text: '¿Cuál es menor? 4.008 o 4.080',
        options: ['4.008', '4.080', '4.800'],
        correctIndex: 0
    },
    {
        text: '5 unidades de mil, 2 centenas y 9 unidades, ¿qué número es?',
        options: ['5209', '5290', '5029'],
        correctIndex: 0
    },
    {
        text: '¿Qué número tiene 7 miles, 5 centenas y 2 unidades?',
        options: ['7502', '7250', '5720'],
        correctIndex: 0
    },
    {
        text: 'Si sumas 1 decena y 6 unidades a 40, ¿cuál es el resultado?',
        options: ['46', '64', '50'],
        correctIndex: 0
    },
    {
        text: '¿Cuál es mayor? 8.007 o 7.999',
        options: ['8.007', '7.999', '8.070'],
        correctIndex: 0
    },
    {
        text: '¿Qué número representa 3 centenas, 4 decenas y 8 unidades?',
        options: ['348', '384', '438'],
        correctIndex: 0
    },
    {
        text: '¿Cuál es correcto para 9 decenas y 1 unidad?',
        options: ['91', '19', '901'],
        correctIndex: 0
    },
    {
        text: '¿Cuál número es más pequeño? 2.010 o 2.100',
        options: ['2.010', '2.100', '2.001'],
        correctIndex: 0
    }
];

const TOTAL_QUESTIONS = 8;
const CAR_IDS = ['car0', 'car1', 'car2'];
const ANSWER_IDS = ['answer0', 'answer1', 'answer2'];
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedCar = 0;
let isAnswering = false;
let carProgress = [0, 0, 0];

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function pickQuestions() {
    return shuffle(QUESTION_POOL).slice(0, TOTAL_QUESTIONS);
}

function updateScoreBar() {
    document.getElementById('questionCounter').textContent = `${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS}`;
    document.getElementById('scoreCounter').textContent = `Puntos: ${score}`;
}

function updateRoad() {
    const road = document.querySelector('.road');
    const roadWidth = road.getBoundingClientRect().width;
    const maxMove = roadWidth - 180;

    CAR_IDS.forEach((id, index) => {
        const car = document.getElementById(id);
        const step = Math.min(carProgress[index], TOTAL_QUESTIONS);
        const offset = Math.round((step / TOTAL_QUESTIONS) * maxMove);
        car.style.transform = `translateX(${offset}px)`;
        car.classList.toggle('moved', offset > 10);
    });
}

function renderQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('questionText').textContent = question.text;
    question.options.forEach((value, index) => {
        const answer = document.getElementById(ANSWER_IDS[index]);
        answer.textContent = value;
        answer.classList.remove('selected');
    });
    selectedCar = 0;
    highlightSelectedCar();
    updateScoreBar();
    showFeedback('Selecciona el auto correcto y presiona ENTER.', true);
    isAnswering = false;
}

function highlightSelectedCar() {
    CAR_IDS.forEach((id, index) => {
        document.getElementById(id).classList.toggle('selected', index === selectedCar);
    });
    ANSWER_IDS.forEach((id, index) => {
        document.getElementById(id).classList.toggle('selected', index === selectedCar);
    });
}

function showFeedback(message, success = true) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.style.color = success ? '#c8f7c5' : '#ffb3b3';
}

function advanceSelection(delta) {
    if (isAnswering) return;
    selectedCar = Math.max(0, Math.min(2, selectedCar + delta));
    highlightSelectedCar();
}

function answerQuestion() {
    if (isAnswering) return;
    isAnswering = true;
    const question = questions[currentQuestionIndex];
    const correct = selectedCar === question.correctIndex;
    const selectedCarEl = document.getElementById(CAR_IDS[selectedCar]);

    if (correct) {
        score += 1;
        carProgress[selectedCar] += 1;
        selectedCarEl.style.boxShadow = '0 0 30px rgba(118, 255, 180, 0.95)';
        showFeedback('¡Correcto! Tu auto avanzó en la pista.', true);
    } else {
        selectedCarEl.style.boxShadow = '0 0 30px rgba(255, 105, 105, 0.95)';
        showFeedback('No es correcto. Elige otro auto en la siguiente pregunta.', false);
    }

    updateRoad();
    highlightSelectedCar();

    setTimeout(() => {
        selectedCarEl.style.boxShadow = '';
        if (currentQuestionIndex + 1 < TOTAL_QUESTIONS) {
            currentQuestionIndex += 1;
            renderQuestion();
        } else {
            finishGame();
        }
    }, 900);
}

function finishGame() {
    const overlay = document.getElementById('finishOverlay');
    const finishText = document.getElementById('finishText');
    const resultText = score === TOTAL_QUESTIONS
        ? '¡Excelente! Respondiste todas perfecto.'
        : `Obtuviste ${score} de ${TOTAL_QUESTIONS}. ¡Muy bien!`;
    finishText.textContent = resultText;
    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');
    localStorage.setItem('superjuego1_completado', 'true');
}

function initGame() {
    questions = pickQuestions();
    currentQuestionIndex = 0;
    score = 0;
    selectedCar = 0;
    carProgress = [0, 0, 0];
    isAnswering = false;
    updateRoad();
    const overlay = document.getElementById('finishOverlay');
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
    renderQuestion();
}

window.addEventListener('DOMContentLoaded', () => {
    const restartButton = document.getElementById('restartButton');
    const playAgainButton = document.getElementById('playAgainButton');

    restartButton.addEventListener('click', initGame);
    playAgainButton.addEventListener('click', initGame);

    ANSWER_IDS.forEach((id, index) => {
        document.getElementById(id).addEventListener('click', () => {
            selectedCar = index;
            highlightSelectedCar();
            answerQuestion();
        });
    });

    document.addEventListener('keydown', (event) => {
        if (overlayVisible()) return;
        if (event.key === 'w' || event.key === 'W' || event.key === 'ArrowUp') {
            event.preventDefault();
            advanceSelection(-1);
        }
        if (event.key === 's' || event.key === 'S' || event.key === 'ArrowDown') {
            event.preventDefault();
            advanceSelection(1);
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            answerQuestion();
        }
    });

    initGame();
    window.addEventListener('resize', updateRoad);
});

function overlayVisible() {
    const overlay = document.getElementById('finishOverlay');
    return overlay.classList.contains('visible');
}
