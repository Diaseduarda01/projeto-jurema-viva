const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector(".play-again");
const difficultyDisplay = document.querySelector(".difficulty b");

let palavrasAdivinhadas = 0;
let palavrasJogadas = 0;
let tentativasTotais = 0;
let tempoInicio, tempoGastoTotal = 0;
let nivelDificuldade = "Fácil";

let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;
let usedLetters = new Set();

const wordList = [
    { "word": "indigena", "hint": "Qual a origem da jurema?" },
    { "word": "catolicismo", "hint": "Qual a influência que a jurema aderiu ao passar dos anos?" },
    { "word": "caboclo", "hint": "Qual a entidade mais importante da jurema?" },
    { "word": "batismo", "hint": "Qual é a primeira etapa que um discípulo passa ao adentrar a jurema?" },
    { "word": "natureza", "hint": "Qual a força que a jurema emana?" },
    { "word": "cachimbo", "hint": "Usado na Jurema" },
    { "word": "juremeiro", "hint": "Pessoa preparada dentro da ritualística da jurema" },
    { "word": "discipulo", "hint": "Como é chamada a pessoa que começa seu desenvolvimento dentro da jurema?" },
    { "word": "invocacao", "hint": "Qual a importância do maracá?" },
    { "word": "purificacao", "hint": "Qual a importância das ervas no culto da jurema?" },
    { "word": "maraca", "hint": "Um instrumento sagrado na jurema" },
    { "word": "tambor", "hint": "O que é elu?" }
];

const atualizarNivelDificuldade = () => {
    if (palavrasJogadas > 5) nivelDificuldade = "Médio";
    if (palavrasJogadas > 10) nivelDificuldade = "Difícil";
    difficultyDisplay.innerText = nivelDificuldade;
};

const getRandomWord = () => {
    if (wordList.length > 0) {
        const index = Math.floor(Math.random() * wordList.length);
        const { word, hint } = wordList.splice(index, 1)[0];
        currentWord = word;
        document.querySelector(".hint-text").innerText = hint;
        wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    } else {
        console.error("Não há mais palavras disponíveis.");
    }
};

const handleLetterInput = (letter) => {
    if (usedLetters.has(letter)) return;
    usedLetters.add(letter);

    const button = keyboardDiv.querySelector(`button[data-letter="${letter}"]`);
    if (button) button.disabled = true;

    if (currentWord.includes(letter)) {
        [...currentWord].forEach((char, index) => {
            if (char === letter) {
                correctLetters.push(char);
                const letterElement = wordDisplay.querySelectorAll(".letter")[index];
                letterElement.innerText = char;
                letterElement.classList.add("guessed");
            }
        });
    } else {
        wrongGuessCount++;
        hangmanImage.src = `assets/images/hangman-${wrongGuessCount}.svg`;
    }

    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
};

const gameOver = (isVictory) => {
    const tempoPalavra = Math.floor((Date.now() - tempoInicio) / 1000);
    tempoGastoTotal += tempoPalavra;

    if (isVictory) palavrasAdivinhadas++;
    const modalText = isVictory ? "Você encontrou a palavra:" : "A palavra correta era:";
    gameModal.querySelector("img").src = `assets/images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? "Parabéns!!" : "Game Over!";
    gameModal.querySelector("p").innerHTML = `
        ${modalText} <b>${currentWord}</b><br>
        <small>Tempo gasto: ${tempoPalavra}s</small>`;
    gameModal.classList.add("show");
};

const initKeyboard = () => {
    keyboardDiv.innerHTML = "";
    const abntKeys = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "á", "é", "í", "ó", "ú", "ã", "õ", "ç"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l", "à", "â", "ê", "î", "ô", "û"],
        ["z", "x", "c", "v", "b", "n", "m"]
    ];
    abntKeys.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("keyboard-row");
        row.forEach(letter => {
            const button = document.createElement("button");
            button.innerText = letter;
            button.dataset.letter = letter;
            button.addEventListener("click", () => handleLetterInput(letter));
            button.classList.add("keyboard-btn");
            rowDiv.appendChild(button);
        });
        keyboardDiv.appendChild(rowDiv);
    });
};

const reiniciarJogo = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    usedLetters.clear();
    hangmanImage.src = "assets/images/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    gameModal.classList.remove("show");
    palavrasJogadas++;
    tempoInicio = Date.now();
    atualizarNivelDificuldade();
    getRandomWord();
    initKeyboard();
};

playAgainBtn.addEventListener("click", reiniciarJogo);

document.addEventListener("keydown", (event) => {
    const letter = event.key.toLowerCase();
    if (/^[a-záéíóúãõçàâêîôû]$/.test(letter)) {
        handleLetterInput(letter);
    }
});

// Inicializa o jogo
initKeyboard();
getRandomWord();
correctLetters = [];
wrongGuessCount = 0;
tempoInicio = Date.now();