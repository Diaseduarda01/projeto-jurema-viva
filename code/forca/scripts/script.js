// Selecionando elementos do DOM para manipular no jogo
const wordDisplay = document.querySelector(".word-display"); // Mostra as letras da palavra
const guessesText = document.querySelector(".guesses-text b"); // Exibe o número de tentativas
const keyboardDiv = document.querySelector(".keyboard"); // Teclado virtual
const hangmanImage = document.querySelector(".hangman-box img"); // Imagem do carrasco
const gameModal = document.querySelector(".game-modal"); // Modal de fim de jogo
const playAgainBtn = gameModal.querySelector("button"); // Botão para reiniciar o jogo

// Variáveis de estado do jogo
let currentWord, correctLetters, wrongGuessCount; // Palavra atual, letras corretas, e contador de erros
const maxGuesses = 6; // Número máximo de tentativas

// Função para resetar o jogo
const resetGame = () => {
    correctLetters = []; // Reinicia as letras corretas
    wrongGuessCount = 0; // Reinicia o contador de erros
    hangmanImage.src = "images/hangman-0.svg"; // Imagem inicial do carrasco
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`; // Atualiza o número de tentativas
    // Cria a estrutura da palavra com letras ocultas
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    // Habilita todos os botões do teclado
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show"); // Esconde o modal de fim de jogo
}

// Função para escolher uma palavra aleatória
const getRandomWord = () => {
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)]; // Seleciona uma palavra aleatória
    currentWord = word; // Define a palavra atual
    document.querySelector(".hint-text b").innerText = hint; // Exibe a dica da palavra
    resetGame(); // Reinicia o jogo com a nova palavra
}

// Função de fim de jogo
const gameOver = (isVictory) => {
    const modalText = isVictory ? `Você encontrou a palavra:` : 'A palavra correta era:'; // Define o texto com base no resultado
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`; // Define a imagem de vitória ou derrota
    gameModal.querySelector("h4").innerText = isVictory ? 'Parabéns!!' : 'Game Over!'; // Define a mensagem de vitória ou derrota
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`; // Mostra a palavra correta
    gameModal.classList.add("show"); // Exibe o modal
}

// Função principal que lida com a jogada do jogador
const initGame = (button, clickedLetter) => {
    if(currentWord.includes(clickedLetter)) { // Se a letra clicada está na palavra
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) { // Revela todas as ocorrências da letra
                correctLetters.push(letter); // Adiciona a letra correta
                wordDisplay.querySelectorAll("li")[index].innerText = letter; // Exibe a letra no display
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed"); // Marca a letra como adivinhada
            }
        });
    } else {
        wrongGuessCount++; // Aumenta o número de erros
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`; // Atualiza a imagem do carrasco
    }
    button.disabled = true; // Desativa o botão clicado
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`; // Atualiza o número de tentativas

    // Verifica se o jogo acabou
    if(wrongGuessCount === maxGuesses) return gameOver(false); // Derrota se o número de erros for atingido
    if(correctLetters.length === currentWord.length) return gameOver(true); // Vitória se todas as letras forem adivinhadas
}

// Criação dos botões do teclado virtual
for (let i = 97; i <= 122; i++) { // Cria botões de 'a' a 'z'
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i); // Define o texto do botão com a letra correspondente
    keyboardDiv.appendChild(button); // Adiciona o botão ao teclado virtual
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i))); // Adiciona evento de clique no botão
}

// Inicia o jogo com uma palavra aleatória
getRandomWord();

// Reinicia o jogo quando o botão 'Jogar Novamente' é clicado
playAgainBtn.addEventListener("click", getRandomWord);
