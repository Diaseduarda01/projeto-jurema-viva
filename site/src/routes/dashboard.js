var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

// Rotas para gráficos específicos
router.get("/ranking", function (req, res) {
    dashboardController.rankingUsuarios(req, res);
});

router.get("/evolucao", function (req, res) {
    dashboardController.evolucaoDesempenho(req, res);
});

router.get("/acertos", function (req, res) {
    dashboardController.percentualAcertos(req, res);
});

router.get("/crescimento", function (req, res) {
    dashboardController.crescimentoUsuarios(req, res);
});

// Rota para KPIs de um usuário
router.get("/kpis", function (req, res) {
    dashboardController.kpisUsuario(req, res);
});

module.exports = router;
