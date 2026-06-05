function mostrarMensaje(text, correcto) {
    const resultBox = document.getElementById('resultBox');
    if (!resultBox) return;
    resultBox.textContent = text;
    resultBox.className = 'result-box';
    if (!correcto) resultBox.classList.add('error');
}

const placeLabels = ['Miles', 'Centenas', 'Decenas', 'Unidades'];

let gameState = {
    number: null
};

function initJuego() {
    const digits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
    if (digits[0] === 0) digits[0] = Math.floor(Math.random() * 9) + 1;
    const number = Number(digits.join(''));
    const table = document.getElementById('placeTable');
    const questionLabel = document.getElementById('questionLabel');
    const numberInput = document.getElementById('studentNumber');
    const resultBox = document.getElementById('resultBox');

    numberInput.value = '';
    resultBox.textContent = '';
    table.innerHTML = '';
    questionLabel.textContent = 'Escribe el número que representa esta tabla posicional:';
    
    placeLabels.forEach((label, index) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.innerHTML = `<span class="label">${label}</span><strong>${digits[index]}</strong>`;
        table.appendChild(cell);
    });
    gameState.number = number;
}

function checkNumber() {
    const numberInput = document.getElementById('studentNumber');
    const answer = Number(numberInput.value.trim());
    if (!answer) {
        mostrarMensaje('Escribe un número para comprobar.', false);
        return;
    }
    const correcto = answer === gameState.number;
    mostrarMensaje(correcto ? `¡Perfecto! Es el número ${gameState.number}.` : 'Todavía no es correcto. Revisa los dígitos en la tabla.', correcto);
}

function showWord() {
    const palabras = leerNumero(gameState.number);
    mostrarMensaje(`El número se lee: ${palabras}.`, true);
}

function resetNumber() {
    initJuego();
}

function leerNumero(numero) {
    const especiales = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    if (numero === 0) return 'cero';
    const miles = Math.floor(numero / 1000);
    const resto = numero % 1000;
    let texto = '';

    if (miles > 0) {
        texto += miles === 1 ? 'mil ' : `${leerTrio(miles)} mil `;
    }
    texto += leerTrio(resto);
    return texto.trim().replace(/\s+/g, ' ');

    function leerTrio(valor) {
        if (valor === 0) return '';
        if (valor === 100) return 'cien';
        const c = Math.floor(valor / 100);
        const d = Math.floor((valor % 100) / 10);
        const u = valor % 10;
        let cadena = '';
        if (c > 0) cadena += `${centenas[c]} `;
        if (d === 1) cadena += `${especiales[10 + u]} `;
        else if (d === 2 && u > 0) cadena += `veinti${especiales[u]} `;
        else if (d >= 2) cadena += decenas[d] + (u > 0 ? ` y ${especiales[u]} ` : ' ');
        else if (u > 0) cadena += `${especiales[u]} `;
        return cadena;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const checkButton = document.getElementById('checkNumber');
    const showButton = document.getElementById('showWord');
    const resetButton = document.getElementById('resetNumber');
    
    if (checkButton) checkButton.addEventListener('click', checkNumber);
    if (showButton) showButton.addEventListener('click', showWord);
    if (resetButton) resetButton.addEventListener('click', resetNumber);
    
    initJuego();
});
