const quizModel = require("../models/quizModel");


const validateData = (FkUsuario, pontuacao, total_questoes, acertos, erros, tempo_total, tempo_medio) => {
    // Verificação de campos obrigatórios
    if (!FkUsuario || pontuacao === undefined || total_questoes === undefined || acertos === undefined || erros === undefined || tempo_total === undefined || tempo_medio === undefined) {
        return {
            status: 400,
            message: "Campos obrigatórios estão ausentes. Envie FkUsuario, pontuacao, total_questoes, acertos, erros, tempo_total e tempo_medio.",
        };
    }

    // Validação de valores numéricos e positivos
    if (
        isNaN(pontuacao) || isNaN(total_questoes) || isNaN(acertos) || isNaN(erros) ||
        isNaN(tempo_total) || isNaN(tempo_medio) ||
        pontuacao < 0 || total_questoes <= 0 || acertos < 0 || erros < 0 || tempo_total < 0 || tempo_medio < 0
    ) {
        return {
            status: 400,
            message: "Pontuação, total de questões, respostas corretas, incorretas, tempo total e tempo médio devem ser números positivos.",
        };
    }

    // Validação adicional: respostas corretas e incorretas devem ser coerentes com o total de questões
    if (acertos + erros !== total_questoes) {
        return {
            status: 400,
            message: "A soma de respostas corretas e incorretas deve ser igual ao total de questões.",
        };
    }

    // Se passou na validação
    return null;
};
function cadastrar(req, res) {
    const { ID_USUARIO, pontuacao, total_questoes, acertos, erros, tempo_total, tempo_medio } = req.body;

    console.log("Recebendo dados:", { ID_USUARIO, pontuacao, total_questoes, acertos, erros, tempo_total, tempo_medio });

    const validationError = validateData(ID_USUARIO, pontuacao, total_questoes, acertos, erros, tempo_total, tempo_medio);
    if (validationError) {
        console.log("Erro de validação:", validationError.message);
        return res.status(validationError.status).json({ message: validationError.message });
    }

    quizModel.cadastrar(ID_USUARIO, pontuacao, total_questoes, acertos, erros, tempo_total, tempo_medio)
        .then(() => {
            console.log("Dados cadastrados com sucesso");
            return res.status(200).json({ message: "Pontuação e tempos salvos com sucesso!" });
        })
        .catch((error) => {
            console.error("Erro ao cadastrar no banco de dados:", error);
            return res.status(500).json({ message: "Erro ao salvar pontuação e tempos." });
        });
}

module.exports = {
    validateData,
    cadastrar
};

