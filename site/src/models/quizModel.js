const database = require("../database/config");

function cadastrar(ID_USUARIO, pontuacao, total_questoes, acertos, erros, tempo_total, tempo_medio) {
    const instrucao = `
        INSERT INTO jogo_pontuacao (FkUsuario, pontuacao, total_questoes, acertos, erros, timestamp, FkJogo, tempo_medio, tempo_total, tipo_jogo)
        VALUES ('${ID_USUARIO}','${pontuacao}','${total_questoes}','${acertos}', '${erros}', NOW(), 1, '${tempo_medio}', '${tempo_total}', 'quiz');
    `;

    console.log("Executando a instrução SQL: \n" + instrucao);

    // Executa a query e retorna a Promise
    return database.executar(instrucao, [ID_USUARIO, pontuacao, total_questoes, acertos, erros, tempo_total, tempo_medio]);
}

module.exports = {
    cadastrar,
 };