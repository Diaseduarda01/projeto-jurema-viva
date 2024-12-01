var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
  
    if (!email) {
      res.status(400).send("Seu email está undefined!");
    } else if (!senha) {
      res.status(400).send("Sua senha está indefinida!");
    } else {
      usuarioModel.autenticar(email, senha)
        .then((resultado) => {
          if (resultado.length === 1) {
            res.json({
              idUsuario: resultado[0].idUsuario,
              nome: resultado[0].nome,
              email: resultado[0].email,
            });
          } else if (resultado.length === 0) {
            res.status(403).send("Email e/ou senha inválido(s)");
          } else {
            res.status(500).send("Mais de um usuário com o mesmo login e senha!");
          }
        })
        .catch((erro) => {
          console.error("Erro ao autenticar:", erro.sqlMessage);
          res.status(500).json(erro.sqlMessage);
        });
    }
  }

function cadastrar(req, res) {
    var nome = req.body.nome;
    var telefone = req.body.telefone;
    var religiao = req.body.religiao;
    var email = req.body.email;
    var senha = req.body.senha;

    if (!nome) {
        res.status(400).send("Seu nome está undefined!");
    } else if (!telefone) {
        res.status(400).send("Seu telefone está undefined!");
    } else if (!religiao) {
        res.status(400).send("Sua religião está undefined!");
    } else if (!email) {
        res.status(400).send("Seu email está undefined!");
    } else if (!senha) {
        res.status(400).send("Sua senha está undefined!");
    } else {
        usuarioModel.cadastrar(nome, telefone, religiao, email, senha)
            .then((resultado) => {
                res.json(resultado);
            })
            .catch((erro) => {
                console.error("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    autenticar,
    cadastrar
};
