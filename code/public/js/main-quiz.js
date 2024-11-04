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

 var timeValue =  30;
 var que_count = 0;
 var que_numb = 1;
 var userScore = 0;
 var counter;
 var counterLine;
 var widthValue = 0;

 const next_btn = document.querySelector("footer .next_btn");
 const bottom_ques_counter = document.querySelector("footer .total_que");
 const restart_quiz = result_box.querySelector(".buttons .restart");
 const quit_quiz = result_box.querySelector(".buttons .quit");

 // Função para iniciar o quiz
 function comecarQuiz() {
     info_box.classList.add("activeInfo"); // Mostrar caixa de informações
 }

 // Função para sair da caixa de informações
 function sairQuizInfo() {
     info_box.classList.remove("activeInfo"); // Ocultar caixa de informações
 }

 // Função para continuar o quiz
 function continuarQuiz() {
     info_box.classList.remove("activeInfo"); // Ocultar caixa de informações
     quiz_box.classList.add("activeQuiz"); // Mostrar caixa do quiz
     showQuestions(0); // Chamando a função showQuestions
     queCounter(1); // Passando 1 como parâmetro para queCounter
     startTimer(30); // Chamando a função startTimer
     startTimerLine(0); // Chamando a função startTimerLine
 }

 // Função para reiniciar o quiz
 function refazerQuiz(){
     quiz_box.classList.add("activeQuiz"); // Mostrar caixa do quiz
     result_box.classList.remove("activeResult"); // Ocultar caixa de resultado
     timeValue = 30; 
     que_count = 0;
     que_numb = 1;
     userScore = 0;
     widthValue = 0;
     showQuestions(que_count); // Chamando a função showQuestions
     queCounter(que_numb); // Passando que_numb para queCounter
     clearInterval(counter); // Limpar contador
     clearInterval(counterLine); // Limpar contador da linha
     startTimer(timeValue); // Chamando a função startTimer
     startTimerLine(widthValue); // Chamando a função startTimerLine
     timeText.textContent = "Tempo"; // Alterar texto para "Tempo"
     next_btn.classList.remove("show"); // Ocultar botão de próximo
 }

 // Função para sair do quiz
 quit_quiz.onclick = () => {
     window.location.reload(); // Recarregar a página atual
 }

 // Função para próximo pergunta
 function proximaPergunta() {
     if(que_count < questions.length - 1) { // Se a contagem de perguntas for menor que o total
         que_count++; // Incrementar a contagem de perguntas
         que_numb++; // Incrementar o número da pergunta
         showQuestions(que_count); // Chamando a função showQuestions
         queCounter(que_numb); // Passando que_numb para queCounter
         clearInterval(counter); // Limpar contador
         clearInterval(counterLine); // Limpar contador da linha
         startTimer(timeValue); // Chamando a função startTimer
         startTimerLine(widthValue); // Chamando a função startTimerLine
         timeText.textContent = "Tempo"; // Alterar texto para "Tempo"
         next_btn.classList.remove("show"); // Ocultar botão de próximo
     } else {
         clearInterval(counter); // Limpar contador
         clearInterval(counterLine); // Limpar contador da linha
         showResult(); // Chamando a função showResult
     }
 }

 // Obtendo perguntas e opções do array
 function showQuestions(index) {
     const que_text = document.querySelector(".que_text");

     // Criando um novo span e div para pergunta e opções
     var que_tag = '<span>' + questions[index].numb + ". " + questions[index].question + '</span>';
     var option_tag = '<div class="option"><span>' + questions[index].options[0] + '</span></div>'
         + '<div class="option"><span>' + questions[index].options[1] + '</span></div>'
         + '<div class="option"><span>' + questions[index].options[2] + '</span></div>'
         + '<div class="option"><span>' + questions[index].options[3] + '</span></div>';
     que_text.innerHTML = que_tag; // Adicionando nova pergunta
     option_list.innerHTML = option_tag; // Adicionando novas opções
     
     const option = option_list.querySelectorAll(".option");

     // Definindo o atributo onclick para todas as opções
     option.forEach(opt => {
         opt.onclick = () => optionSelected(opt); // Chamar função optionSelected ao clicar
     });
 }

 // Função para verificar a resposta do usuário
 function optionSelected(answer) {
     clearInterval(counter); // Limpar contador
     clearInterval(counterLine); // Limpar contador da linha
     var userAns = answer.textContent; // Capturando resposta do usuário
     var correctAns = questions[que_count].answer; // Obtendo resposta correta
     const allOptions = option_list.children.length; // Capturando todas as opções

     if (userAns === correctAns) {
         userScore++; // Incrementar pontuação do usuário
         answer.classList.add("correct"); // Adicionar classe correta
         answer.insertAdjacentHTML("beforeend", '<div class="icon tick"><i class="fas fa-check"></i></div>'); // Adicionar ícone
     } else {
         answer.classList.add("incorrect"); // Adicionar classe incorreta
         answer.insertAdjacentHTML("beforeend", '<div class="icon cross"><i class="fas fa-times"></i></div>'); // Adicionar ícone

         // Mostrar resposta correta se a resposta do usuário estiver errada
         for (var i = 0; i < allOptions; i++) {
             if (option_list.children[i].textContent === correctAns) {
                 option_list.children[i].classList.add("correct"); // Adicionar classe correta
                 option_list.children[i].insertAdjacentHTML("beforeend", '<div class="icon tick"><i class="fas fa-check"></i></div>'); // Adicionar ícone
             }
         }
     }

     // Desabilitar todas as opções após a seleção
     for (var i = 0; i < allOptions; i++) {
         option_list.children[i].classList.add("disabled"); // Adicionar classe desabilitada
     }
     next_btn.classList.add("show"); // Mostrar botão de próximo
 }

 // Exibir o resultado do quiz
 function showResult() {
     info_box.classList.remove("activeInfo"); // Ocultar caixa de informações
     quiz_box.classList.remove("activeQuiz"); // Ocultar caixa do quiz
     result_box.classList.add("activeResult"); // Mostrar caixa de resultado
     const scoreText = result_box.querySelector(".score_text");

     // Avaliar a pontuação do usuário
     var scoreTag;
     if (userScore > 20) {
         scoreTag = '<span>Parabéns! Você acertou <p>' + userScore + '</p> de <p>' + questions.length + '</p></span>';
     } else if (userScore > 10) {
         scoreTag = '<span>Bom trabalho, você acertou <p>' + userScore + '</p> de <p>' + questions.length + '</p></span>';
     } else {
         scoreTag = '<span>Sentimos muito, você acertou apenas <p>' + userScore + '</p> de <p>' + questions.length + '</p></span>';
     }
     scoreText.innerHTML = scoreTag; // Adicionar pontuação ao texto
 }

 // Funções de temporizador
 function startTimer(time) {
     counter = setInterval(() => {
         timeCount.textContent = time; // Atualizar contagem do tempo
         time--; // Decrementar o tempo
         if (time < 9) timeCount.textContent = "0" + timeCount.textContent; // Formatar o tempo
         if (time < 0) {
             clearInterval(counter); // Limpar contador
             timeText.textContent = "Tempo Esgotado"; // Alterar texto para "Tempo Esgotado"
             showCorrectAnswer(); // Mostrar resposta correta
             next_btn.classList.add("show"); // Mostrar botão de próximo
         }
     }, 1000);
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
 }