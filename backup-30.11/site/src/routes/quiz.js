const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");


router.post("/cadastrar", quizController.cadastrar);


module.exports = router;