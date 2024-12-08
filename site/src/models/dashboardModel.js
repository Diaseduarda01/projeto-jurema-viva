var database = require("../database/config");

function rankingUsuarios() {
    var instrucao = `
        SELECT * FROM vw_ranking_usuarios LIMIT 3;
    `;
    console.log("Executando instrução SQL:\n" + instrucao);
    return database.executar(instrucao);
}

function evolucaoDesempenho(idUsuario) {
    var instrucao = `
        SELECT * FROM vw_evolucao_desempenho WHERE FkUsuario = ${idUsuario};
    `;
    console.log("Executando instrução SQL para evolução de desempenho:\n" + instrucao);
    return database.executar(instrucao);
}

function percentualAcertos(idQuiz) {
    var instrucao = `
        SELECT * FROM vw_percentual_acertos WHERE FkQuiz = ${idQuiz};
    `;
    console.log("Executando instrução SQL para percentual de acertos:\n" + instrucao);
    return database.executar(instrucao);
}


// function crescimentoUsuarios() {
//     var instrucao = `
//         SELECT * FROM vw_crescimento_usuarios;
//     `;
//     console.log("Executando instrução SQL para crescimento de usuários:\n" + instrucao);
//     return database.executar(instrucao);
// }


function kpisUsuario(idUsuario) {
    var instrucao = `
        SELECT * FROM vw_kpis_usuario WHERE idUsuario = ${idUsuario};
    `;
    console.log("Executando instrução SQL para KPIs de usuário:\n" + instrucao);
    return database.executar(instrucao);
}


module.exports = {
    rankingUsuarios,
    evolucaoDesempenho,
    percentualAcertos,
    // crescimentoUsuarios,
    kpisUsuario
};
