(function () {
    const colors = ['#fff176', '#22c55e', '#38bdf8', '#f97316', '#ec4899', '#8b5cf6', '#ef4444'];
    let voiceTimer = null;

    function speakText(text) {
        if (!('speechSynthesis' in window) || !text) return;
        window.speechSynthesis.cancel();
        window.dispatchEvent(new CustomEvent('speechend'));

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-CL';
        utterance.rate = 0.94;
        utterance.pitch = 1.08;

        utterance.onstart = () => {
            window.dispatchEvent(new CustomEvent('speechstart'));
        };
        utterance.onend = () => {
            window.dispatchEvent(new CustomEvent('speechend'));
        };
        utterance.onerror = () => {
            window.dispatchEvent(new CustomEvent('speechend'));
        };

        window.speechSynthesis.speak(utterance);
    }

    function setupVoiceGuide(text, buttonId, autoRead = true) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        button.addEventListener('click', () => speakText(text));
        if (autoRead) {
            clearTimeout(voiceTimer);
            voiceTimer = setTimeout(() => speakText(text), 650);
        }
    }

    function speakGameResult(perfect) {
        const text = perfect
            ? 'Excelente, te fue super bien.'
            : 'Te pudo haber ido mejor, pero vas muy bien. Intentalo de nuevo y veras que puedes lograrlo.';
        setTimeout(() => speakText(text), 650);
    }

    function getLayer() {
        let layer = document.querySelector('.confetti-layer');
        if (!layer) {
            layer = document.createElement('div');
            layer.className = 'confetti-layer';
            document.body.appendChild(layer);
        }
        return layer;
    }

    function createPiece(layer, intense = false) {
        const piece = document.createElement('span');
        const size = intense ? random(8, 18) : random(7, 15);
        const duration = intense ? random(1700, 3200) : random(1200, 2300);
        const shapes = ['', 'round', 'ribbon'];
        piece.className = `confetti-piece ${shapes[randomInt(0, shapes.length - 1)]}`.trim();
        piece.style.left = `${random(-4, 104)}vw`;
        piece.style.setProperty('--size', `${size}px`);
        piece.style.setProperty('--duration', `${duration}ms`);
        piece.style.setProperty('--drift', `${random(-170, 170)}px`);
        piece.style.setProperty('--spin', `${random(420, 1180)}deg`);
        piece.style.setProperty('--color', colors[randomInt(0, colors.length - 1)]);
        layer.appendChild(piece);
        setTimeout(() => piece.remove(), duration + 250);
    }

    function burstConfetti(count = 70) {
        const layer = getLayer();
        for (let i = 0; i < count; i++) {
            setTimeout(() => createPiece(layer, false), i * 8);
        }
        setTimeout(cleanLayerIfEmpty, 2800);
    }

    function startConfettiRain(duration = 4200, count = 190) {
        const layer = getLayer();
        for (let i = 0; i < count; i++) {
            setTimeout(() => createPiece(layer, true), random(0, duration));
        }
        setTimeout(cleanLayerIfEmpty, duration + 3600);
    }

    function cleanLayerIfEmpty() {
        const layer = document.querySelector('.confetti-layer');
        if (layer && !layer.children.length) layer.remove();
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    window.FourthGradeTools = {
        speakText,
        setupVoiceGuide,
        speakGameResult,
        burstConfetti,
        startConfettiRain
    };
    document.documentElement.dataset.fourthGradeEffects = 'ready';
})();
