// Selecionando todos os elementos necessários
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

var correctAnswers = 0; // Contador de acertos
var incorrectAnswers = 0; // Contador de erros
var timeValue = 20;
var que_count = 0;
var que_numb = 1;
var userScore = 0;
var counter;
var counterLine;
var widthValue = 0;
var startTime; // Tempo de início do quiz
var endTime; // Tempo de término do quiz

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// Função para iniciar o quiz
function comecarQuiz() {
    info_box.classList.add("activeInfo"); // Mostrar caixa de informações
}

// Função para sair da caixa de informações e voltar ao dashboard
function sairQuizInfo() {
    info_box.classList.remove("activeInfo"); // Ocultar caixa de informações
    window.location.href = "dashboard.html"; // Redirecionar para a página dashboard.html
}

// Função para continuar o quiz
function continuarQuiz() {
    info_box.classList.remove("activeInfo"); // Ocultar caixa de informações
    quiz_box.classList.add("activeQuiz"); // Mostrar caixa do quiz
    showQuestions(0); // Mostrar primeira questão
    queCounter(1); // Atualizar contador
    startTimer(20); // Iniciar temporizador
    startTimerLine(0); // Iniciar linha do temporizador
    startTime = Date.now(); // Registrar início do quiz
}

// Função para reiniciar o quiz
function refazerQuiz() {
    quiz_box.classList.add("activeQuiz");
    result_box.classList.remove("activeResult");
    timeValue = 20;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    widthValue = 0;
    showQuestions(que_count);
    queCounter(que_numb);
    clearInterval(counter);
    clearInterval(counterLine);
    startTimer(timeValue);
    startTimerLine(widthValue);
    timeText.textContent = "Tempo";
    next_btn.classList.remove("show");
}

// Função para sair do quiz
quit_quiz.onclick = () => window.location.reload();

// Função para avançar para a próxima pergunta
function proximaPergunta() {
    if (que_count < questions.length - 1) {
        que_count++;
        que_numb++;
        showQuestions(que_count);
        queCounter(que_numb);
        clearInterval(counter);
        clearInterval(counterLine);
        startTimer(timeValue);
        startTimerLine(widthValue);
        timeText.textContent = "Tempo";
        next_btn.classList.remove("show");
    } else {
        clearInterval(counter);
        clearInterval(counterLine);
        showResult();
    }
}

// Exibir perguntas e opções
function showQuestions(index) {
    const que_text = document.querySelector(".que_text");
    let que_tag = `<span>${questions[index].numb}. ${questions[index].question}</span>`;
    let option_tag = questions[index].options.map(opt => `<div class="option"><span>${opt}</span></div>`).join('');
    que_text.innerHTML = que_tag;
    option_list.innerHTML = option_tag;

    const options = option_list.querySelectorAll(".option");
    options.forEach(opt => opt.onclick = () => optionSelected(opt));
}

// Verificar resposta selecionada
function optionSelected(answer) {
    clearInterval(counter);
    clearInterval(counterLine);
    const userAns = answer.textContent;
    const correctAns = questions[que_count].answer;
    const allOptions = option_list.children;

    if (userAns === correctAns) {
        userScore++;
        correctAnswers++;
        answer.classList.add("correct");
        answer.insertAdjacentHTML("beforeend", '<div class="icon tick"><i class="fas fa-check"></i></div>');
    } else {
        incorrectAnswers++;
        answer.classList.add("incorrect");
        answer.insertAdjacentHTML("beforeend", '<div class="icon cross"><i class="fas fa-times"></i></div>');

        Array.from(allOptions).forEach(opt => {
            if (opt.textContent === correctAns) {
                opt.classList.add("correct");
                opt.insertAdjacentHTML("beforeend", '<div class="icon tick"><i class="fas fa-check"></i></div>');
            }
        });
    }

    Array.from(allOptions).forEach(opt => opt.classList.add("disabled"));
    next_btn.classList.add("show");
}

// Exibir resultado
function showResult() {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");

    const scoreText = result_box.querySelector(".score_text");
    const scoreTag = `
        <span>${userScore > 20 ? 'Parabéns!' : userScore > 10 ? 'Bom trabalho!' : 'Sentimos muito,'} 
        Você acertou <p>${userScore}</p> de <p>${questions.length}</p></span>`;
    scoreText.innerHTML = scoreTag;

    endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    const avgTimePerQuestion = totalTime / questions.length;

    // Envio dos dados ao backend
    fetch("/quiz/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ID_USUARIO: sessionStorage.getItem('ID_USUARIO'),
            pontuacao: userScore,
            total_questoes: questions.length,
            acertos: correctAnswers,
            erros: incorrectAnswers,
            tempo_total: totalTime.toFixed(2),
            tempo_medio: avgTimePerQuestion.toFixed(2)
        }),
    })
        .then(res => res.json())
        .then(data => alert("Pontuação e tempo salvos com sucesso!"))
        .catch(error => alert("Erro ao salvar dados: " + error));
}

function startTimer(time) {
    counter = setInterval(() => {
        timeCount.textContent = time; // Atualizar contagem do tempo
        time--; // Decrementar o tempo
        if (time < 10) timeCount.textContent = "0" + time; // Formatar o tempo (adicionar zero à esquerda)
        if (time < 0) {
            clearInterval(counter); // Limpar contador
            timeText.textContent = "Tempo Esgotado"; // Alterar texto para "Tempo Esgotado"
            showCorrectAnswer(); // Mostrar resposta correta
            next_btn.classList.add("show"); // Mostrar botão de próximo
        }
    }, 1000); // Intervalo correto de 1 segundo
}

function resetTimer() {
    clearInterval(counter); // Limpar contador
    clearInterval(counterLine); // Limpar contador da linha
    startTimer(timeValue); // Reiniciar temporizador
    startTimerLine(widthValue); // Reiniciar temporizador da linha
    timeText.textContent = "Tempo Restante"; // Alterar texto para "Tempo Restante"
    next_btn.classList.remove("show"); // Ocultar botão de próximo
}

function startTimerLine(time) {
    counterLine = setInterval(() => {
        time += 1; // Incrementar o tempo da linha
        time_line.style.width = time + "px"; // Alterar largura da linha
        if (time > 549) clearInterval(counterLine); // Limpar contador da linha
    }, 29);
}

// Contagem de perguntas
function queCounter(index) {
    var totalQueCounTag = '<span><p>' + index + '</p> de <p>' + questions.length + '</p> Perguntas</span>'; // Texto de contagem
    bottom_ques_counter.innerHTML = totalQueCounTag; // Adicionar contagem ao texto
}

// Mostrar resposta correta quando o tempo se esgota
function showCorrectAnswer() {
    const allOptions = option_list.children.length; // Capturar todas as opções
    var correctAns = questions[que_count].answer; // Obter resposta correta

    for (var i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent === correctAns) {
            option_list.children[i].classList.add("correct"); // Adicionar classe correta
            option_list.children[i].insertAdjacentHTML("beforeend", '<div class="icon tick"><i class="fas fa-check"></i></div>'); // Adicionar ícone
        }
    }
    for (var i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); // Desabilitar todas as opções
    }

     // Incrementar o contador de erros
     incorrectAnswers++;
}