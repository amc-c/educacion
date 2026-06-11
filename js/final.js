function getStoredScore(key) {
    const value = Number(localStorage.getItem(key) || 0);
    return Number.isFinite(value) ? value : 0;
}

function setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
}

function playAchievement() {
    const achievementSound = document.getElementById('achievementSound');
    if (achievementSound) {
        achievementSound.currentTime = 0;
        achievementSound.volume = 0.95;
        achievementSound.play().catch(() => {});
    }
    window.FourthGradeTools?.startConfettiRain(7000, 300);
}

function resetSuperGamesForReplay() {
    [
        'superjuego1_completado',
        'superjuego2_completado',
        'superjuego1_puntaje',
        'superjuego2_puntaje',
        'ma04_all_games_completed'
    ].forEach(key => localStorage.removeItem(key));
}

function initFinalPage() {
    const studentName = localStorage.getItem('nombre') || 'campeon';
    const avatar = localStorage.getItem('avatar') || 'img/avatar1.png';
    const scoreSuper1 = getStoredScore('superjuego1_puntaje');
    const scoreSuper2 = getStoredScore('superjuego2_puntaje');
    const totalScore = scoreSuper1 + scoreSuper2;
    const avatarEl = document.getElementById('finalAvatar');
    const celebrateButton = document.getElementById('celebrateButton');
    const backToGamesButton = document.getElementById('backToGamesButton');

    if (avatarEl) {
        avatarEl.src = avatar;
    }

    setText('finalTitle', `¡Felicitaciones, ${studentName}!`);
    setText('scoreSuper1', `${scoreSuper1} pts`);
    setText('scoreSuper2', `${scoreSuper2} pts`);
    setText('scoreTotal', `${totalScore} pts`);

    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
        if (totalScore >= 12) {
            starsContainer.innerHTML = '<span>★</span><span>★</span><span>★</span>';
        } else if (totalScore >= 8) {
            starsContainer.innerHTML = '<span>★</span><span>★</span>';
        } else {
            starsContainer.innerHTML = '<span>★</span>';
        }
    }

    playAchievement();
    celebrateButton?.addEventListener('click', playAchievement);
    backToGamesButton?.addEventListener('click', resetSuperGamesForReplay);

    setTimeout(() => {
        window.FourthGradeTools?.speakText(
            `Felicitaciones ${studentName}. Completaste todos los juegos de cuarto basico. Tu puntaje total es ${totalScore} puntos.`
        );
    }, 700);
}

window.addEventListener('DOMContentLoaded', initFinalPage);
