const COMMON_GAMES = ['1', '2', '3', '4'];
const COMPLETED_PREFIX = 'ma04_common_game_';
const SUPER_UNLOCK_SEEN_KEY = 'ma04_super_unlock_seen';
const FINAL_COMPLETED_KEY = 'ma04_all_games_completed';

function isGameCompleted(gameId) {
    return localStorage.getItem(`${COMPLETED_PREFIX}${gameId}`) === 'completed';
}

function isSuperGameCompleted(gameId) {
    return localStorage.getItem(`superjuego${gameId}_completado`) === 'true';
}

function markFinalCompletedIfReady() {
    const commonGamesDone = COMMON_GAMES.every(isGameCompleted);
    const superGamesDone = isSuperGameCompleted('1') && isSuperGameCompleted('2');

    if (commonGamesDone && superGamesDone) {
        localStorage.setItem(FINAL_COMPLETED_KEY, 'true');
        setTimeout(() => {
            window.location.href = 'final.html';
        }, 900);
        return true;
    }

    return false;
}

function showSuperCards() {
    document.querySelectorAll('[data-super-card]').forEach(superCard => {
        superCard.style.display = 'block';
        const gameId = superCard.dataset.gameCard === 'super1' ? '1' : '2';
        const completed = isSuperGameCompleted(gameId);
        const badge = superCard.querySelector('.mission-badge');

        superCard.classList.toggle('is-completed', completed);
        if (badge) {
            badge.textContent = completed ? 'Completado' : 'Desbloqueado';
        }
    });
}

function updateProgressView() {
    const completed = COMMON_GAMES.filter(isGameCompleted);
    const progressText = document.getElementById('progressText');
    const unlock = document.getElementById('superUnlock');

    progressText.textContent = `${completed.length} de ${COMMON_GAMES.length} completadas`;

    COMMON_GAMES.forEach(gameId => {
        const card = document.querySelector(`[data-game-card="${gameId}"]`);
        if (!card) return;
        const badge = card.querySelector('.mission-badge');
        const isCompleted = isGameCompleted(gameId);
        card.classList.toggle('is-completed', isCompleted);
        badge.textContent = isCompleted ? 'Completado' : 'Pendiente';
    });

    if (completed.length === COMMON_GAMES.length) {
        progressText.textContent = '4 de 4 completadas';
        showSuperCards();

        if (markFinalCompletedIfReady()) return;
        if (localStorage.getItem(SUPER_UNLOCK_SEEN_KEY) === 'true') return;

        unlock.classList.add('is-visible');
        const audio = new Audio('sonidos/notificacion.mp3');
        audio.volume = 0.9;
        audio.play().catch(() => {
            // autoplay puede bloquearse en algunos navegadores
        });

        const playSuperButton = document.getElementById('playSuperButton');
        if (playSuperButton) {
            playSuperButton.addEventListener('click', () => {
                localStorage.setItem(SUPER_UNLOCK_SEEN_KEY, 'true');
                unlock.classList.remove('is-visible');
                window.location.href = 'superjuego1.html';
            }, { once: true });
        }

        const closeButton = document.getElementById('closeUnlockButton');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                localStorage.setItem(SUPER_UNLOCK_SEEN_KEY, 'true');
                unlock.classList.remove('is-visible');
            }, { once: true });
        }
    }
}

window.addEventListener('DOMContentLoaded', updateProgressView);
