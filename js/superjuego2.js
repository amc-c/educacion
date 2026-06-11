const ROUND_TOTAL = 5;
const PLAYER_SIZE = 48;
const GRAVITY = 0.72;
const MOVE_SPEED = 5.2;
const JUMP_SPEED = 24;

let world;
let playerEl;
let cardsLayer;
let challengeText;
let carryText;
let roundText;
let feedbackEl;
let slots = [];
let cards = [];
let platforms = [];
let keys = {};
let round = 1;
let mode = 'desc';
let orderedNumbers = [];
let carriedCard = null;
let animationId = null;
let mistakes = 0;
let roundResults = [];
let currentRoundHadMistake = false;

const player = {
    x: 60,
    y: 320,
    vx: 0,
    vy: 0,
    grounded: false
};

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

function playSound(id) {
    const audio = document.getElementById(id);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

function rectsOverlap(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function getWorldSize() {
    return {
        width: world.clientWidth,
        height: world.clientHeight
    };
}

function getElementRectInWorld(el) {
    const worldRect = world.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return {
        x: rect.left - worldRect.left,
        y: rect.top - worldRect.top,
        width: rect.width,
        height: rect.height
    };
}

function setupPlatforms() {
    platforms = Array.from(document.querySelectorAll('.platform')).map(getElementRectInWorld);
}

function makeNumbers() {
    const values = new Set();
    while (values.size < 3) values.add(randomInt(1000, 9999));
    return [...values];
}

function getCardSpots() {
    const size = getWorldSize();
    return [
        { x: 56, y: Math.max(188, size.height - 190) },
        { x: Math.max(220, size.width - 178), y: Math.max(188, size.height - 190) },
        { x: Math.max(120, (size.width / 2) - 54), y: 162 }
    ];
}

function startRound(resetRoundNumber = false) {
    if (resetRoundNumber) round = 1;
    const numbers = makeNumbers();
    mode = Math.random() > 0.5 ? 'desc' : 'asc';
    orderedNumbers = [...numbers].sort((a, b) => mode === 'desc' ? b - a : a - b);
    carriedCard = null;
    cardsLayer.innerHTML = '';
    slots.forEach(slot => {
        slot.dataset.value = '';
        slot.classList.remove('filled', 'wrong');
        slot.innerHTML = `<span>${Number(slot.dataset.slot) + 1}</span>`;
    });

    challengeText.textContent = `Ordena de ${mode === 'desc' ? 'mayor a menor' : 'menor a mayor'}`;
    carryText.textContent = 'Nada';
    roundText.textContent = `${round} / ${ROUND_TOTAL}`;
    showFeedback('Busca una tarjeta, tócala con el cubo y llévala a la zona correcta.', true);

    const spots = getCardSpots();
    cards = shuffle(numbers).map((number, index) => createNumberCard(number, spots[index], index));
    resetPlayer();
}

function createNumberCard(number, spot, index) {
    const el = document.createElement('div');
    el.className = 'number-card';
    el.dataset.value = number;
    el.dataset.cardIndex = index;
    el.textContent = formatNumber(number);
    el.style.left = `${spot.x}px`;
    el.style.top = `${spot.y}px`;
    cardsLayer.appendChild(el);
    return {
        value: number,
        el,
        placed: false
    };
}

function resetPlayer() {
    const size = getWorldSize();
    player.x = 54;
    player.y = Math.max(80, size.height - 105);
    player.vx = 0;
    player.vy = 0;
    player.grounded = false;
}

function updatePlayer() {
    const size = getWorldSize();
    player.vx = 0;
    if (keys.a || keys.arrowleft) player.vx = -MOVE_SPEED;
    if (keys.d || keys.arrowright) player.vx = MOVE_SPEED;

    if ((keys.w || keys[' '] || keys.arrowup) && player.grounded) {
        player.vy = -JUMP_SPEED;
        player.grounded = false;
    }

    player.vy += GRAVITY;
    player.x += player.vx;
    player.y += player.vy;
    player.x = Math.max(0, Math.min(size.width - PLAYER_SIZE, player.x));

    const playerRect = { x: player.x, y: player.y, width: PLAYER_SIZE, height: PLAYER_SIZE };
    player.grounded = false;

    platforms.forEach(platform => {
        const falling = player.vy >= 0;
        const previousBottom = player.y + PLAYER_SIZE - player.vy;
        const crossesTop = previousBottom <= platform.y + 10;
        if (falling && crossesTop && rectsOverlap(playerRect, platform)) {
            player.y = platform.y - PLAYER_SIZE;
            player.vy = 0;
            player.grounded = true;
        }
    });

    if (player.y > size.height + 120) {
        resetPlayer();
    }

    playerEl.style.left = `${player.x}px`;
    playerEl.style.top = `${player.y}px`;
}

function checkCardPickup() {
    if (carriedCard) return;
    const playerRect = { x: player.x, y: player.y, width: PLAYER_SIZE, height: PLAYER_SIZE };
    const card = cards.find(item => !item.placed && rectsOverlap(playerRect, getElementRectInWorld(item.el)));
    if (!card) return;
    carriedCard = card;
    card.el.classList.add('carried');
    carryText.textContent = formatNumber(card.value);
    playSound('pickupSound');
    showFeedback(`Cargando ${formatNumber(card.value)}. Llévalo a una zona de respuesta.`, true);
}

function updateCarriedCard() {
    if (!carriedCard) return;
    carriedCard.el.style.left = `${player.x - 28}px`;
    carriedCard.el.style.top = `${player.y - 66}px`;
}

function checkDropZone() {
    if (!carriedCard) return;
    const playerRect = { x: player.x, y: player.y, width: PLAYER_SIZE, height: PLAYER_SIZE };
    const slot = getNearestOpenSlot(playerRect);
    if (!slot) return;

    const slotIndex = Number(slot.dataset.slot);
    slot.dataset.value = carriedCard.value;
    slot.classList.add('filled');
    slot.innerHTML = `<span>${slotIndex + 1}</span>${formatNumber(carriedCard.value)}`;
    carriedCard.el.remove();
    carriedCard.placed = true;
    playSound('pickupSound');
    carryText.textContent = 'Nada';
    carriedCard = null;

    const filled = slots.filter(item => item.dataset.value).length;
    if (filled === 3) validateOrder();
    else showFeedback(`Bien. Ahora busca la tarjeta para la zona ${filled + 1}.`, true);
}

function getNearestOpenSlot(playerRect) {
    const playerCenter = {
        x: playerRect.x + playerRect.width / 2,
        y: playerRect.y + playerRect.height / 2
    };
    let nearest = null;
    let nearestDistance = Infinity;

    slots.forEach(slot => {
        if (slot.dataset.value) return;
        const rect = getElementRectInWorld(slot);
        const expanded = {
            x: rect.x - 34,
            y: rect.y - 42,
            width: rect.width + 68,
            height: rect.height + 84
        };
        const overlaps = rectsOverlap(playerRect, expanded);
        const slotCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
        };
        const distance = Math.hypot(playerCenter.x - slotCenter.x, playerCenter.y - slotCenter.y);
        if (overlaps && distance < nearestDistance) {
            nearest = slot;
            nearestDistance = distance;
        }
    });

    return nearest;
}

function updateNearestSlotHighlight() {
    const playerRect = { x: player.x, y: player.y, width: PLAYER_SIZE, height: PLAYER_SIZE };
    const nearest = carriedCard ? getNearestOpenSlot(playerRect) : null;
    slots.forEach(slot => slot.classList.toggle('near', slot === nearest));
}

function validateOrder() {
    const selected = slots.map(slot => Number(slot.dataset.value));
    const correct = selected.every((value, index) => value === orderedNumbers[index]);
    
    // Determine relation symbol and format answers
    const modeSymbol = mode === 'desc' ? ' > ' : ' < ';
    const correctStr = orderedNumbers.map(formatNumber).join(modeSymbol);
    const childStr = selected.map(formatNumber).join(modeSymbol);

    if (!correct) {
        mistakes += 1;
    }

    roundResults.push({
        round: round,
        correct: correct,
        childAnswer: childStr,
        correctAnswer: correctStr
    });

    if (round >= ROUND_TOTAL) {
        setTimeout(finishGame, 1000);
        return;
    }

    round += 1;
    showFeedback('Preparando la siguiente ronda...', true);
    
    setTimeout(() => {
        startRound(false);
    }, 1200);
}

function goToFinalIfEverythingIsDone() {
    const commonGamesDone = [1, 2, 3, 4].every(gameNumber => (
        localStorage.getItem(`ma04_common_game_${gameNumber}`) === 'completed'
    ));
    const superGamesDone = localStorage.getItem('superjuego1_completado') === 'true'
        && localStorage.getItem('superjuego2_completado') === 'true';

    if (commonGamesDone && superGamesDone) {
        localStorage.setItem('ma04_all_games_completed', 'true');
        setTimeout(() => {
            window.location.href = 'final.html';
        }, 3600);
    }
}

function finishGame() {
    playSound(mistakes === 0 ? 'correctSound' : 'errorSound');
    if (mistakes === 0) {
        window.FourthGradeTools?.startConfettiRain(5200, 230);
    }
    window.FourthGradeTools?.speakGameResult(mistakes === 0);
    
    const finishText = document.getElementById('finishText');
    if (finishText) {
        let tableRows = roundResults.map(res => `
            <tr style="border-bottom: 1px solid rgba(0,0,0,0.08);">
                <td style="padding: 6px; font-weight: bold;">Ronda ${res.round}</td>
                <td style="padding: 6px;">${res.correct ? '✅ Bien' : '❌ Mal'}</td>
                <td style="padding: 6px; font-family: monospace; font-size: 0.95rem;">${res.childAnswer}</td>
                <td style="padding: 6px; font-family: monospace; font-size: 0.95rem;">${res.correctAnswer}</td>
            </tr>
        `).join('');

        const tableHtml = `
            <div style="margin-top: 10px; max-height: 220px; overflow-y: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; background: rgba(255,255,255,0.7); border-radius: 10px; font-size: 0.85rem; color: #333;">
                    <thead>
                        <tr style="background: rgba(0,0,0,0.05); border-bottom: 2px solid rgba(0,0,0,0.1);">
                            <th style="padding: 6px;">Ronda</th>
                            <th style="padding: 6px;">Resultado</th>
                            <th style="padding: 6px;">Tu respuesta</th>
                            <th style="padding: 6px;">Respuesta Correcta</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;

        const mistakesMsg = mistakes === 0 
            ? '¡Excelente! Ordenaste los números sin errores.' 
            : `Completado con ${mistakes} ${mistakes === 1 ? 'error' : 'errores'}.`;
        finishText.innerHTML = `${mistakesMsg}<br>${tableHtml}`;
    }

    document.getElementById('finishOverlay').classList.add('visible');
    document.getElementById('finishOverlay').setAttribute('aria-hidden', 'false');
    localStorage.setItem('superjuego2_completado', 'true');
    localStorage.setItem('superjuego2_puntaje', String(ROUND_TOTAL));
    goToFinalIfEverythingIsDone();
}

function showFeedback(text, success) {
    feedbackEl.textContent = text;
    feedbackEl.classList.toggle('error', !success);
}

function loop() {
    updatePlayer();
    checkCardPickup();
    updateCarriedCard();
    updateNearestSlotHighlight();
    animationId = requestAnimationFrame(loop);
}

function initGame(resetRoundNumber = false) {
    document.getElementById('finishOverlay').classList.remove('visible');
    document.getElementById('finishOverlay').setAttribute('aria-hidden', 'true');
    if (resetRoundNumber) {
        mistakes = 0;
        roundResults = [];
    }
    currentRoundHadMistake = false;
    setupPlatforms();
    startRound(resetRoundNumber);
    if (!animationId) loop();
}

let bgMusic = null;
let targetVolume = 0.35;
let musicInterval = null;

function playBgMusic() {
    if (bgMusic) return;
    bgMusic = new Audio('sonidos/selectKirby.mp3');
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
    world = document.getElementById('world');
    playerEl = document.getElementById('player');
    cardsLayer = document.getElementById('cardsLayer');
    challengeText = document.getElementById('challengeText');
    carryText = document.getElementById('carryText');
    roundText = document.getElementById('roundText');
    feedbackEl = document.getElementById('feedback');
    slots = Array.from(document.querySelectorAll('.drop-slot'));

    window.FourthGradeTools?.setupVoiceGuide(document.getElementById('voiceGuideText')?.textContent, 'voiceGuideButton');

    const newRoundBtn = document.getElementById('newRoundButton');
    if (newRoundBtn) newRoundBtn.style.display = 'none';
    document.getElementById('restartButton').addEventListener('click', () => initGame(true));
    document.getElementById('playAgainButton').addEventListener('click', () => initGame(true));

    window.addEventListener('keydown', event => {
        const key = event.key.toLowerCase();
        if (['a', 'd', 'w', ' ', 'arrowleft', 'arrowright', 'arrowup', 'e'].includes(key)) {
            event.preventDefault();
            if (key === 'e') {
                checkDropZone();
            } else {
                keys[key] = true;
            }
        }
    });

    window.addEventListener('keyup', event => {
        keys[event.key.toLowerCase()] = false;
    });

    window.addEventListener('resize', () => {
        setupPlatforms();
        startRound(false);
    });

    initGame(true);
    playBgMusic();
});
