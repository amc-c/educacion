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
        'ma04_all_games_completed',
        'ma04_super_unlock_seen',
        'ma04_common_game_1',
        'ma04_common_game_2',
        'ma04_common_game_3',
        'ma04_common_game_4',
        'ma04_game_1_puntaje',
        'ma04_game_2_puntaje',
        'ma04_game_3_puntaje',
        'ma04_game_4_puntaje'
    ].forEach(key => localStorage.removeItem(key));
}

function initFinalPage() {
    const studentName = localStorage.getItem('nombre') || 'campeón';
    const avatar = localStorage.getItem('avatar') || 'img/avatar1.png';
    
    // Fetch common games score
    const scoreGame1 = getStoredScore('ma04_game_1_puntaje');
    const scoreGame2 = getStoredScore('ma04_game_2_puntaje');
    const scoreGame3 = getStoredScore('ma04_game_3_puntaje');
    const scoreGame4 = getStoredScore('ma04_game_4_puntaje');
    const scoreCommon = scoreGame1 + scoreGame2 + scoreGame3 + scoreGame4;

    const scoreSuper1 = getStoredScore('superjuego1_puntaje');
    const scoreSuper2 = getStoredScore('superjuego2_puntaje');
    const totalScore = scoreCommon + scoreSuper1 + scoreSuper2;

    const avatarEl = document.getElementById('finalAvatar');
    const celebrateButton = document.getElementById('celebrateButton');
    const backToGamesButton = document.getElementById('backToGamesButton');

    if (avatarEl) {
        avatarEl.src = avatar;
    }

    setText('finalTitle', `¡Felicitaciones, ${studentName}!`);
    setText('scoreCommon', `${scoreCommon} pts`);
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
