const TOTAL_QUESTIONS = 10;
const FINISH_STEPS = 6;
const CAR_IDS = ['car0', 'car1', 'car2'];
const ANSWER_IDS = ['answer0', 'answer1', 'answer2'];
const ANSWER_TEXT_IDS = ['answerText0', 'answerText1', 'answerText2'];
const GUIDE_TEXT = 'Mira la pregunta, elige el auto que lleva la respuesta correcta y toca el auto para responder. También puedes usar W o flecha arriba para subir, S o flecha abajo para bajar, y Enter para confirmar.';

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedCar = 0;
let isAnswering = false;
let waitingNextQuestion = false;
let carProgress = [0, 0, 0];
let correctPlacementPlan = [];
let roundResults = [];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function formatNumber(number) {
    return number.toLocaleString('es-CL');
}

function formatOrder(numbers, separator) {
    return numbers.map(formatNumber).join(` ${separator} `);
}

function playSound(id) {
    const audio = document.getElementById(id);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

function speakGuide() {
    window.FourthGradeTools?.speakText(GUIDE_TEXT);
}

function makeOptions(correct, distractors) {
    const values = new Set([correct]);
    distractors.forEach(value => {
        if (value > 0 && value <= 10000) values.add(value);
    });
    while (values.size < 3) {
        values.add(randomInt(1, 10000));
    }
    const options = shuffle([...values].slice(0, 3));
    return {
        options: options.map(formatNumber),
        correctIndex: options.indexOf(correct)
    };
}

function buildPlaceValueQuestion() {
    const thousands = randomInt(1, 9);
    const hundreds = randomInt(0, 9);
    const tens = randomInt(0, 9);
    const units = randomInt(0, 9);
    const number = thousands * 1000 + hundreds * 100 + tens * 10 + units;
    const { options, correctIndex } = makeOptions(number, [
        thousands * 1000 + tens * 100 + hundreds * 10 + units,
        thousands * 1000 + hundreds * 100 + units * 10 + tens,
        hundreds * 1000 + thousands * 100 + tens * 10 + units
    ]);

    return {
        text: `${thousands} unidades de mil, ${hundreds} centenas, ${tens} decenas y ${units} unidades. ¿Qué número es?`,
        options,
        correctIndex
    };
}

function buildExpandedQuestion() {
    const thousands = randomInt(1, 9) * 1000;
    const hundreds = randomInt(0, 9) * 100;
    const tens = randomInt(0, 9) * 10;
    const units = randomInt(0, 9);
    const number = thousands + hundreds + tens + units;
    const parts = [thousands, hundreds, tens, units].filter(value => value > 0);
    const { options, correctIndex } = makeOptions(number, [
        thousands + tens + hundreds + units,
        Math.max(1, number - randomInt(10, 200)),
        Math.min(10000, number + randomInt(10, 200))
    ]);

    return {
        text: `Forma el número: ${parts.map(formatNumber).join(' + ')}`,
        options,
        correctIndex
    };
}

function buildOrderingQuestion() {
    const values = new Set();
    while (values.size < 3) values.add(randomInt(1000, 9999));
    const numbers = shuffle([...values]);
    const descending = Math.random() > 0.5;
    const correctNumbers = [...numbers].sort((a, b) => descending ? b - a : a - b);
    const separator = descending ? '>' : '<';
    const correct = formatOrder(correctNumbers, separator);
    const permutations = [
        [numbers[0], numbers[1], numbers[2]],
        [numbers[0], numbers[2], numbers[1]],
        [numbers[1], numbers[0], numbers[2]],
        [numbers[1], numbers[2], numbers[0]],
        [numbers[2], numbers[0], numbers[1]],
        [numbers[2], numbers[1], numbers[0]]
    ];
    const distractors = [...new Set(permutations.map(option => formatOrder(option, separator)))]
        .filter(option => option !== correct);
    const options = shuffle([correct, ...shuffle(distractors).slice(0, 2)]);

    return {
        text: `¿Cómo sería el orden de ${descending ? 'mayor a menor' : 'menor a mayor'} entre ${numbers.map(formatNumber).join(', ')}?`,
        options,
        correctIndex: options.indexOf(correct)
    };
}

function createQuestion() {
    const builders = [
        buildPlaceValueQuestion,
        buildExpandedQuestion,
        buildOrderingQuestion,
        buildOrderingQuestion
    ];
    return builders[randomInt(0, builders.length - 1)]();
}

function pickQuestions() {
    return Array.from({ length: TOTAL_QUESTIONS }, createQuestion);
}

function buildCorrectPlacementPlan() {
    const winnerCar = randomInt(0, 2);
    const otherCars = [0, 1, 2].filter(index => index !== winnerCar);
    const plan = Array.from({ length: FINISH_STEPS }, () => winnerCar);

    while (plan.length < TOTAL_QUESTIONS) {
        plan.push(otherCars[plan.length % otherCars.length]);
    }

    return shuffle(plan);
}

function placeCorrectAnswer(question, desiredIndex) {
    const options = [...question.options];
    const correctValue = options[question.correctIndex];
    options[question.correctIndex] = options[desiredIndex];
    options[desiredIndex] = correctValue;

    return {
        ...question,
        options,
        correctIndex: desiredIndex
    };
}

function updateScoreBar() {
    document.getElementById('questionCounter').textContent = `${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS}`;
    document.getElementById('scoreCounter').textContent = `Puntos: ${score}`;
}

function setNextButtonEnabled(enabled) {
    const nextButton = document.getElementById('nextQuestionButton');
    nextButton.disabled = !enabled;
}

function updateRoad() {
    const track = document.querySelector('.race-track');
    const trackWidth = track.getBoundingClientRect().width;
    const maxMove = Math.max(80, trackWidth - 430);

    CAR_IDS.forEach((id, index) => {
        const car = document.getElementById(id);
        const step = Math.min(carProgress[index], FINISH_STEPS);
        const offset = Math.round((step / FINISH_STEPS) * maxMove);
        car.style.setProperty('--x', `${offset}px`);
    });
}

function renderQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('questionText').textContent = question.text;
    question.options.forEach((value, index) => {
        const lane = document.getElementById(ANSWER_IDS[index]);
        const answerText = document.getElementById(ANSWER_TEXT_IDS[index]);
        answerText.textContent = value;
        lane.dataset.correct = index === question.correctIndex ? 'true' : 'false';
        lane.disabled = false;
        lane.classList.remove('selected', 'correct', 'wrong', 'boost');
        lane.style.boxShadow = '';
    });
    selectedCar = 0;
    highlightSelectedCar();
    updateScoreBar();
    showFeedback('Toca el auto que lleva la respuesta correcta.', true);
    isAnswering = false;
    waitingNextQuestion = false;
    setNextButtonEnabled(false);
}

function highlightSelectedCar() {
    ANSWER_IDS.forEach((id, index) => {
        document.getElementById(id).classList.toggle('selected', index === selectedCar);
    });
}

function showFeedback(message, success = true) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.classList.toggle('error', !success);
}

function advanceSelection(delta) {
    if (isAnswering) return;
    selectedCar = Math.max(0, Math.min(2, selectedCar + delta));
    highlightSelectedCar();
}

function answerQuestion(index = selectedCar) {
    if (isAnswering || waitingNextQuestion) return;
    isAnswering = true;
    selectedCar = index;
    highlightSelectedCar();

    const question = questions[currentQuestionIndex];
    const correct = selectedCar === question.correctIndex;
    const selectedLane = document.getElementById(ANSWER_IDS[selectedCar]);

    ANSWER_IDS.forEach(id => {
        document.getElementById(id).disabled = true;
    });

    // Neutral selection visual highlight (no correct/wrong classes)
    selectedLane.style.boxShadow = 'inset 0 0 0 6px #7a52ff';

    if (correct) {
        score += 1;
        carProgress[selectedCar] += 1;
    }

    roundResults.push({
        round: currentQuestionIndex + 1,
        correct: correct,
        correctAnswer: question.options[question.correctIndex]
    });
    updateRoad();
    updateScoreBar();

    waitingNextQuestion = true;
    setNextButtonEnabled(true);

    if (currentQuestionIndex + 1 < TOTAL_QUESTIONS) {
        showFeedback('Presiona “Siguiente pregunta” para continuar.', true);
    } else {
        setNextButtonEnabled(false);
        setTimeout(finishGame, 1000);
    }
}

function goToNextQuestion() {
    if (!waitingNextQuestion || currentQuestionIndex + 1 >= TOTAL_QUESTIONS) return;
    currentQuestionIndex += 1;
    renderQuestion();
}

function goToFinalIfEverythingIsDone() {
    const commonGamesDone = [1, 2, 3, 4].every(gameNumber => (
        localStorage.getItem(`ma04_common_game_${gameNumber}`) === 'completed'
    ));
    const superGamesDone = localStorage.getItem('superjuego1_completado') === 'true'
        && localStorage.getItem('superjuego2_completado') === 'true';

    if (commonGamesDone && superGamesDone) {
        localStorage.setItem('ma04_all_games_completed', 'true');
    }
}

function finishGame() {
    const overlay = document.getElementById('finishOverlay');
    const finishText = document.getElementById('finishText');
    const resultText = score === TOTAL_QUESTIONS
        ? '¡Excelente! Contestaste todas correctamente y ganaste la carrera.'
        : `Obtuviste ${score} de ${TOTAL_QUESTIONS}. Vuelve a correr para mejorar tu marca.`;
    
    let tableRows = roundResults.map(res => `
        <tr style="border-bottom: 1px solid rgba(0,0,0,0.08);">
            <td style="padding: 4px; font-weight: bold;">Pág. ${res.round}</td>
            <td style="padding: 4px;">${res.correct ? '✅ Bien' : '❌ Mal'}</td>
            <td style="padding: 4px; font-family: monospace; font-size: 0.95rem;">${res.correctAnswer}</td>
        </tr>
    `).join('');

    const tableHtml = `
        <div style="margin-top: 10px; max-height: 180px; overflow-y: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; background: rgba(255,255,255,0.7); border-radius: 10px; font-size: 0.85rem; color: #333;">
                <thead>
                    <tr style="background: rgba(0,0,0,0.05); border-bottom: 2px solid rgba(0,0,0,0.1);">
                        <th style="padding: 6px;">Pregunta</th>
                        <th style="padding: 6px;">Resultado</th>
                        <th style="padding: 6px;">Respuesta Correcta</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;

    finishText.innerHTML = `${resultText}<br>${tableHtml}`;
    
    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');
    
    playSound(score === TOTAL_QUESTIONS ? 'correctSound' : 'errorSound');
    if (score === TOTAL_QUESTIONS) {
        window.FourthGradeTools?.startConfettiRain(5200, 240);
    }
    window.FourthGradeTools?.speakGameResult(score === TOTAL_QUESTIONS);
    localStorage.setItem('superjuego1_completado', 'true');
    localStorage.setItem('superjuego1_puntaje', String(score));
    goToFinalIfEverythingIsDone();
}

function initGame() {
    correctPlacementPlan = buildCorrectPlacementPlan();
    questions = pickQuestions().map((question, index) => placeCorrectAnswer(question, correctPlacementPlan[index]));
    currentQuestionIndex = 0;
    score = 0;
    selectedCar = 0;
    carProgress = [0, 0, 0];
    isAnswering = false;
    waitingNextQuestion = false;
    roundResults = [];
    setNextButtonEnabled(false);
    updateRoad();
    const overlay = document.getElementById('finishOverlay');
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
    renderQuestion();
}

function overlayVisible() {
    const overlay = document.getElementById('finishOverlay');
    return overlay.classList.contains('visible');
}

let bgMusic = null;
let targetVolume = 0.35;
let musicInterval = null;

function playBgMusic() {
    if (bgMusic) return;
    bgMusic = new Audio('sonidos/1-10. Friend Puzzle Solving.mp3');
    bgMusic.loop = true;
    bgMusic.volume = targetVolume;
    bgMusic.play().catch(err => {
        console.log('Autoplay prevented, will play on interaction:', err);
        const startOnInteraction = () => {
            bgMusic.play().catch(() => {});
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('keydown', startOnInteraction);
        };
        document.addEventListener('click', startOnInteraction);
        document.addEventListener('keydown', startOnInteraction);
    });

    window.addEventListener('speechstart', () => {
        fadeVolume(0.08);
    });
    window.addEventListener('speechend', () => {
        fadeVolume(0.35);
    });
}

function fadeVolume(target) {
    targetVolume = target;
    if (musicInterval) clearInterval(musicInterval);
    
    musicInterval = setInterval(() => {
        if (!bgMusic) {
            clearInterval(musicInterval);
            return;
        }
        const diff = targetVolume - bgMusic.volume;
        if (Math.abs(diff) < 0.01) {
            bgMusic.volume = targetVolume;
            clearInterval(musicInterval);
        } else {
            bgMusic.volume += Math.sign(diff) * 0.01;
        }
    }, 30);
}

window.addEventListener('DOMContentLoaded', () => {
    const restartButton = document.getElementById('restartButton');
    const playAgainButton = document.getElementById('playAgainButton');
    const speakButton = document.getElementById('speakGuide');
    const nextQuestionButton = document.getElementById('nextQuestionButton');

    restartButton.addEventListener('click', initGame);
    playAgainButton.addEventListener('click', initGame);
    speakButton.addEventListener('click', speakGuide);
    nextQuestionButton.addEventListener('click', goToNextQuestion);

    ANSWER_IDS.forEach((id, index) => {
        document.getElementById(id).addEventListener('click', () => answerQuestion(index));
    });

    document.addEventListener('keydown', event => {
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

    document.querySelectorAll('a[href="lista.html"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const commonGamesDone = [1, 2, 3, 4].every(gameNumber => (
                localStorage.getItem(`ma04_common_game_${gameNumber}`) === 'completed'
            ));
            const superGamesDone = localStorage.getItem('superjuego1_completado') === 'true'
                && localStorage.getItem('superjuego2_completado') === 'true';
            
            if (commonGamesDone && superGamesDone) {
                e.preventDefault();
                window.location.href = 'final.html';
            }
        });
    });

    initGame();
    window.addEventListener('resize', updateRoad);
    setTimeout(speakGuide, 650);
    playBgMusic();
});
