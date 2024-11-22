use jurema_viva;

DELIMITER $$

CREATE TRIGGER after_quiz_pontuacao_insert
AFTER INSERT ON quiz_pontuacao
FOR EACH ROW
BEGIN
  -- Atualizar estatísticas do usuário
  INSERT INTO estatisticas_usuarios (FkUsuario, quizzes_realizados, pontuacao_total, ultima_participacao)
  VALUES (NEW.FkUsuario, 1, NEW.pontuacao, NEW.timestamp)
  ON DUPLICATE KEY UPDATE
    quizzes_realizados = quizzes_realizados + 1,
    pontuacao_total = pontuacao_total + NEW.pontuacao,
    ultima_participacao = NEW.timestamp;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_quiz_pontuacao_insert_update_pergunta
AFTER INSERT ON quiz_pontuacao
FOR EACH ROW
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE total INT;

    -- Definir o total de questões
    SET total = NEW.total_questoes;

    -- Loop para iterar por todas as questões do quiz
    WHILE i <= total DO
        -- Aqui, você vai atualizar a tabela de estatísticas para cada questão do quiz
        -- A lógica é simples: incrementa os acertos e erros com base no número total de acertos

        -- Atualiza ou insere as estatísticas para cada pergunta
        INSERT INTO estatisticas_pergunta (FkQuiz, numero_pergunta, acertos, erros)
        VALUES (NEW.FkQuiz, i, 
            CASE WHEN i <= NEW.acertos THEN 1 ELSE 0 END,  -- Lógica simples para acertos
            CASE WHEN i > NEW.acertos THEN 1 ELSE 0 END)  -- Lógica simples para erros
        ON DUPLICATE KEY UPDATE
            acertos = acertos + CASE WHEN i <= NEW.acertos THEN 1 ELSE 0 END,
            erros = erros + CASE WHEN i > NEW.acertos THEN 1 ELSE 0 END;

        -- Incrementa para a próxima pergunta
        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;




DELIMITER $$

CREATE TRIGGER after_quiz_pontuacao_insert_log
AFTER INSERT ON quiz_pontuacao
FOR EACH ROW
BEGIN
  -- Registrar log de finalização de quiz
  INSERT INTO logs_acesso (FkUsuario, acao, descricao)
  VALUES (NEW.FkUsuario, 'Quiz Finalizado', CONCAT('Pontuação: ', NEW.pontuacao, ' | Acertos: ', NEW.acertos));
END$$

DELIMITER ;



CREATE VIEW vw_ranking_usuarios AS
SELECT 
    u.nome,
    SUM(q.pontuacao) AS total_pontuacao
FROM 
    usuario u
JOIN 
    quiz_pontuacao q ON u.idUsuario = q.FkUsuario
GROUP BY 
    u.idUsuario
ORDER BY 
    total_pontuacao DESC;



CREATE VIEW vw_evolucao_desempenho AS
SELECT 
    WEEK(q.timestamp) AS semana,
    AVG(q.pontuacao) AS pontuacao_media
FROM 
    quiz_pontuacao q
GROUP BY 
    semana
ORDER BY 
    semana;
    
    
    
    CREATE VIEW vw_percentual_acertos AS
SELECT 
    ep.FkQuiz,
    ep.numero_pergunta,
    (ep.acertos / (ep.acertos + ep.erros)) * 100 AS percentual_acertos
FROM 
    estatisticas_pergunta ep;


CREATE VIEW vw_crescimento_usuarios AS
SELECT 
    DATE_FORMAT(la.timestamp, '%Y-%m') AS mes,
    COUNT(DISTINCT la.FkUsuario) AS usuarios_ativos
FROM 
    logs_acesso la
GROUP BY 
    mes
ORDER BY 
    mes;


