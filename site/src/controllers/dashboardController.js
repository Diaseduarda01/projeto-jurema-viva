var dashboardModel = require("../models/dashboardModel");

function rankingUsuarios(req, res) {
    dashboardModel.rankingUsuarios()
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.error("Erro ao buscar ranking de usuários:", erro.sqlMessage);
            res.status(500).json({ message: "Erro interno ao buscar ranking", error: erro.sqlMessage });
        });
}


function evolucaoDesempenho(req, res) {
    const idUsuario = req.query.idUsuario;  // Obtém o id do usuário da query string
    
    if (!idUsuario) {
        return res.status(400).send("O ID do usuário é obrigatório!");
    }
  
    dashboardModel.evolucaoDesempenho(idUsuario)
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.error("Erro ao buscar evolução de desempenho:", erro.sqlMessage);
            res.status(500).json({ message: "Erro interno ao buscar evolução de desempenho", error: erro.sqlMessage });
        });

        console.log(pontuacao_usuario)
}

function percentualAcertos(req, res) {
    var idQuiz = req.query.idQuiz; // ID do quiz passado na query string

    if (!idQuiz) {
        return res.status(400).send("O ID do quiz é obrigatório!");
    }

    dashboardModel.percentualAcertos(idQuiz)
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.error("Erro ao buscar percentual de acertos:", erro.sqlMessage);
            res.status(500).json({ message: "Erro interno ao buscar percentual de acertos", error: erro.sqlMessage });
        });
}

function crescimentoUsuarios(req, res) {
    dashboardModel.crescimentoUsuarios()
        .then((resultado) => {
            res.status(200).json(resultado);
        })
        .catch((erro) => {
            console.error("Erro ao buscar crescimento de usuários:", erro.sqlMessage);
            res.status(500).json({ message: "Erro interno ao buscar crescimento de usuários", error: erro.sqlMessage });
        });
}

function kpisUsuario(req, res) {
    const idUsuario = req.query.idUsuario;
  
    if (!idUsuario) {
      return res.status(400).send("O ID do usuário é obrigatório!");
    }
  
    dashboardModel.kpisUsuario(idUsuario)
      .then((resultado) => {
        if (resultado.length > 0) {
          res.status(200).json(resultado[0]); // Envia apenas o primeiro item
        } else {
          res.status(404).send("KPIs não encontradas para o usuário.");
        }
      })
      .catch((erro) => {
        console.error("Erro ao buscar KPIs do usuário:", erro.sqlMessage || erro);
        res.status(500).json({ message: "Erro interno ao buscar KPIs do usuário", error: erro.sqlMessage || erro });
      });
  }

module.exports = {
    rankingUsuarios,
    evolucaoDesempenho,
    percentualAcertos,
    crescimentoUsuarios,
    kpisUsuario
};
