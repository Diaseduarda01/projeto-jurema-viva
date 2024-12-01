var dashboardModel = require("../models/dashboardModel");

function handleError(res, error, message) {
    console.error(message, error.sqlMessage || error.message || error);
    res.status(500).json({ message, error: error.sqlMessage || error.message || error });
}

function rankingUsuarios(req, res) {
    dashboardModel.rankingUsuarios()
        .then((resultado) => res.status(200).json(resultado))
        .catch((erro) => handleError(res, erro, "Erro ao buscar ranking de usuários"));
}

function evolucaoDesempenho(req, res) {
    const idUsuario = req.query.idUsuario;

    if (!idUsuario || isNaN(idUsuario)) {
        return res.status(400).send("O ID do usuário é obrigatório e deve ser um número!");
    }

    dashboardModel.evolucaoDesempenho(idUsuario)
        .then((resultado) => res.status(200).json(resultado))
        .catch((erro) => handleError(res, erro, "Erro ao buscar evolução de desempenho"));
}

function percentualAcertos(req, res) {
    const idQuiz = req.query.idQuiz;

    if (!idQuiz || isNaN(idQuiz)) {
        return res.status(400).send("O ID do quiz é obrigatório e deve ser um número!");
    }
    console.log("idQuiz recebido no controller:", idQuiz);

    dashboardModel.percentualAcertos(idQuiz)
        .then((resultado) => res.status(200).json(resultado))
        .catch((erro) => handleError(res, erro, "Erro ao buscar percentual de acertos"));
}

function crescimentoUsuarios(req, res) {
    dashboardModel.crescimentoUsuarios()
        .then((resultado) => res.status(200).json(resultado))
        .catch((erro) => handleError(res, erro, "Erro ao buscar crescimento de usuários"));
}

function kpisUsuario(req, res) {
    const idUsuario = req.query.idUsuario;

    if (!idUsuario || isNaN(idUsuario)) {
        return res.status(400).send("O ID do usuário é obrigatório e deve ser um número!");
    }

    dashboardModel.kpisUsuario(idUsuario)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado[0]);
            } else {
                res.status(404).send("KPIs não encontradas para o usuário.");
            }
        })
        .catch((erro) => handleError(res, erro, "Erro ao buscar KPIs do usuário"));
}

module.exports = {
    rankingUsuarios,
    evolucaoDesempenho,
    percentualAcertos,
    crescimentoUsuarios,
    kpisUsuario
};
