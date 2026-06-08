const COMMON_GAMES = ['1', '2', '3', '4'];
const COMPLETED_PREFIX = 'ma04_common_game_';

function isGameCompleted(gameId) {
    return localStorage.getItem(`${COMPLETED_PREFIX}${gameId}`) === 'completed';
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
        unlock.classList.add('is-visible');
        progressText.textContent = '4 de 4 completadas';
        const audio = new Audio('sonidos/notificacion.mp3');
        audio.volume = 0.9;
        audio.play().catch(() => {
            // autoplay puede bloquearse en algunos navegadores
        });

        // Mostrar tarjeta del superjuego
        const superCard = document.querySelector('[data-game-card="super"]');
        if (superCard) {
            superCard.style.display = 'block';
        }

        const closeButton = document.getElementById('closeUnlockButton');
        const playButton = document.getElementById('playSuperButton');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                unlock.classList.remove('is-visible');
            });
        }

        if (playButton) {
            playButton.addEventListener('click', () => {
                window.location.href = 'superjuego1.html';
            });
        }
    }
}

window.addEventListener('DOMContentLoaded', updateProgressView);
