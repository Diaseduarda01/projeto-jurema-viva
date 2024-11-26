DROP DATABASE IF EXISTS jurema_viva;
CREATE DATABASE jurema_viva;
USE jurema_viva;

CREATE TABLE usuario (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    telefone VARCHAR(15),
    religiao VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(10),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_detalhes (
    idQuiz INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    total_perguntas INT NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_pontuacao (
    idPontuacaoQuiz INT AUTO_INCREMENT PRIMARY KEY,
    FkUsuario INT NOT NULL,
    FkQuiz INT,
    pontuacao INT NOT NULL,
    total_questoes INT NOT NULL,
    acertos INT NOT NULL,
    erros INT NOT NULL,
    tempo_total decimal(5,2),
    tempo_medio decimal (5,2),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FkUsuario) REFERENCES usuario(idUsuario),
    FOREIGN KEY (FkQuiz) REFERENCES quiz_detalhes(idQuiz)
);

CREATE TABLE estatisticas_usuarios (
    idEstatisticas INT AUTO_INCREMENT PRIMARY KEY,
    FkUsuario INT NOT NULL,
    quizzes_realizados INT DEFAULT 0,
    pontuacao_total INT DEFAULT 0,
    ultima_participacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FkUsuario) REFERENCES usuario(idUsuario)
);

CREATE TABLE registro_acao_usuario (
    idRegistro INT AUTO_INCREMENT PRIMARY KEY,
    FkUsuario INT NOT NULL,
    acao VARCHAR(50) NOT NULL, -- Exemplo: "Login", "Quiz Iniciado", "Quiz Finalizado"
    descricao TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FkUsuario) REFERENCES usuario(idUsuario)
);

CREATE TABLE estatisticas_pergunta (
    FkQuiz INT,
    numero_pergunta INT,
    acertos INT DEFAULT 0,
    erros INT DEFAULT 0,
    PRIMARY KEY (FkQuiz, numero_pergunta),
    FOREIGN KEY (FkQuiz) REFERENCES quiz_detalhes(idQuiz)
);


CREATE TABLE jogos_forca (
    idForca INT AUTO_INCREMENT PRIMARY KEY,
    palavra TEXT NOT NULL,
    dica TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pontuacoes_forca (
    idPontuacaoForca INT AUTO_INCREMENT PRIMARY KEY,
    FkUsuario INT NOT NULL,
    FkForca INT NOT NULL,
    pontuacao INT NOT NULL,
    tentativas INT NOT NULL,
    FOREIGN KEY (FkUsuario) REFERENCES usuario(idUsuario),
    FOREIGN KEY (FkForca) REFERENCES jogos_forca(idForca)
);

-- insert padrão da forca e quiz 
INSERT INTO quiz_detalhes (titulo, descricao, total_perguntas)
VALUES (
    'Quiz sobre a Jurema Sagrada',
    'Este quiz aborda diversos aspectos da Jurema Sagrada, incluindo tradições, história, práticas e significados espirituais. O objetivo é promover o conhecimento e a valorização desta rica cultura.',
    30
);


-- Trigger: Registro de Logs de Finalização de Quizzes
DELIMITER $$

CREATE TRIGGER after_quiz_pontuacao_insert_log
AFTER INSERT ON quiz_pontuacao
FOR EACH ROW
BEGIN
    INSERT INTO registro_acao_usuario (FkUsuario, acao, descricao)
    VALUES (
        NEW.FkUsuario, 
        'Quiz Finalizado', 
        CONCAT('Pontuação: ', NEW.pontuacao, ' | Total de perguntas: ', NEW.total_questoes)
    );
END$$

DELIMITER ;


DELIMITER $$

-- Trigger: Atualizar estatísticas das perguntas do quiz após a inserção de pontuação no quiz
CREATE TRIGGER after_quiz_pontuacao_insert_update_pergunta
AFTER INSERT ON quiz_pontuacao
FOR EACH ROW
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE total INT;

    -- Definir o total de questões com base na inserção do quiz
    SET total = NEW.total_questoes;

    -- Loop para iterar por todas as questões do quiz
    WHILE i <= total DO
        -- Atualiza as estatísticas para a pergunta
        UPDATE estatisticas_pergunta 
        SET 
            acertos = acertos + CASE WHEN i <= NEW.acertos THEN 1 ELSE 0 END,  -- Incrementa os acertos
            erros = erros + CASE WHEN i > NEW.acertos THEN 1 ELSE 0 END  -- Incrementa os erros
        WHERE 
            FkQuiz = NEW.FkQuiz 
            AND numero_pergunta = i;

        -- Incrementa para a próxima pergunta
        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;


-- views de usuários ativos por mes
    CREATE VIEW usuarios_ativos_por_mes AS
SELECT 
    DATE_FORMAT(ra.timestamp, '%Y-%m') AS mes,
    COUNT(DISTINCT ra.FkUsuario) AS usuarios_ativos
FROM 
    registro_acao_usuario ra
GROUP BY 
    DATE_FORMAT(ra.timestamp, '%Y-%m')
ORDER BY 
    mes;
    
-- View para ranking de usuários com base na pontuação total
CREATE OR REPLACE VIEW vw_ranking_usuarios AS
SELECT 
    u.idUsuario,
    u.nome,
    SUM(qp.pontuacao) AS pontuacao_total,
    COUNT(qp.idPontuacaoQuiz) AS quizzes_realizados
FROM 
    usuario u
LEFT JOIN 
    quiz_pontuacao qp ON u.idUsuario = qp.FkUsuario
GROUP BY 
    u.idUsuario, u.nome
ORDER BY 
    pontuacao_total;


-- View para percentual de acertos por pergunta em um quiz
CREATE OR REPLACE VIEW vw_percentual_acertos AS
SELECT 
    ep.FkQuiz,
    ep.numero_pergunta,
    ROUND((ep.acertos * 100.0) / (ep.acertos + ep.erros), 2) AS percentual_acertos
FROM 
    estatisticas_pergunta ep;

-- View para evolução de desempenho de um usuário por quiz
CREATE OR REPLACE VIEW vw_evolucao_desempenho AS
SELECT 
    qp.FkUsuario,
    q.idQuiz AS numero_quiz,
    qp.pontuacao AS pontuacao_usuario
FROM 
    quiz_pontuacao qp
JOIN 
    quiz_detalhes q ON qp.FkQuiz = q.idQuiz
ORDER BY 
    qp.FkUsuario, q.idQuiz;

-- View para monitorar o crescimento de usuários ao longo do tempo
CREATE OR REPLACE VIEW vw_crescimento_usuarios AS
SELECT 
    DATE_FORMAT(ra.timestamp, '%Y-%m') AS mes,
    COUNT(DISTINCT ra.FkUsuario) AS usuarios_ativos
FROM 
    registro_acao_usuario ra
GROUP BY 
    mes
ORDER BY 
    mes;
    
-- View para KPIs de Usuário
    CREATE OR REPLACE VIEW vw_kpis_usuario AS
SELECT 
    u.idUsuario,
    u.nome,
    ROUND(AVG(qp.pontuacao), 2) AS media_pontuacao_usuario,   -- Média de pontuação do usuário
    ROUND(AVG(qp.tempo_medio), 2) AS tempo_medio_usuario,       -- Tempo médio do usuário
    ROUND((SELECT AVG(pontuacao) FROM quiz_pontuacao), 2) AS media_pontuacao_todos,  -- Média de pontuação de todos os usuários
    ROUND((COUNT(qp.idPontuacaoQuiz) * 100.0 / (SELECT COUNT(*) FROM quiz_detalhes)), 2) AS taxa_conclusao -- Taxa de conclusão
FROM 
    usuario u
LEFT JOIN 
    quiz_pontuacao qp ON u.idUsuario = qp.FkUsuario
GROUP BY 
    u.idUsuario, u.nome
ORDER BY 
    u.idUsuario;


-- select de view

SELECT * FROM usuarios_ativos_por_mes;
SELECT * FROM vw_ranking_usuarios;
SELECT * FROM vw_percentual_acertos;
SELECT * FROM vw_evolucao_desempenho;
SELECT * FROM vw_kpis_usuario;
SELECT * FROM vw_crescimento_usuarios;


show tables;
select * from usuario;
select * from quiz_pontuacao;
select * from  quiz_detalhes;
select * from registro_acao_usuario;
select * from estatisticas_pergunta;
select * from estatisticas_usuarios;

-- select para ver as trigger criadas
SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE, ACTION_TIMING, ACTION_STATEMENT
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'jurema_viva';

-- DROP TRIGGER jurema_viva.after_quiz_pontuacao_insert_update_pergunta;


-- select para ver as views criadas
SELECT TABLE_NAME AS view_name
FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'jurema_viva';

