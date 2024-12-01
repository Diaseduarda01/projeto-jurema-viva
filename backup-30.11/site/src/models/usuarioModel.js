var database = require("../database/config");

function autenticar(email, senha) {
    console.log("Usuário Model: Iniciando autenticação para:", email);
    
    var instrucaoSql = `
        SELECT idUsuario, nome, telefone, religiao, email, senha 
        FROM usuario 
        WHERE email = '${email}' AND senha = '${senha}';
    `;
    
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, telefone, religiao, email, senha) {
    console.log("Usuário Model: Iniciando cadastro para:", nome, email);

    var instrucaoSql = `
        INSERT INTO usuario (nome, telefone, religiao, email, senha) 
        VALUES ('${nome}', '${telefone}', '${religiao}', '${email}', '${senha}');
    `;
    
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
};
