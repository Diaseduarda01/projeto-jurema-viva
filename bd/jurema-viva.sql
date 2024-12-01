	DROP DATABASE IF EXISTS jurema_viva;
	CREATE DATABASE jurema_viva;
	USE jurema_viva;

	CREATE TABLE usuario (
		idUsuario INT AUTO_INCREMENT PRIMARY KEY,
		nome VARCHAR(100),
		telefone VARCHAR(15),
		religiao VARCHAR(100),
		email VARCHAR(100) UNIQUE,
		senha VARCHAR(255), -- Para armazenar senhas criptografadas
		data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE jogo (
		idJogo INT AUTO_INCREMENT PRIMARY KEY,
		titulo VARCHAR(100) NOT NULL,
		descricao VARCHAR(255),
		tipo_jogo ENUM('quiz', 'forca', 'palavra_cruzada') NOT NULL, -- Classificação do jogo
		total_perguntas INT NOT NULL,
		configuracoes JSON, -- Detalhes específicos do jogo (opcional)
		data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	-- Insert para o jogo Quiz
	INSERT INTO jogo (titulo, descricao, tipo_jogo, total_perguntas, configuracoes)
	VALUES (
		'Quiz sobre a Jurema Sagrada',
		'Este quiz aborda diversos aspectos da Jurema Sagrada, incluindo tradições, história, práticas e significados espirituais. O objetivo é promover o conhecimento e a valorização desta rica cultura.',
		'quiz',
		30,
		null
	);

	-- Insert para o jogo Forca
	INSERT INTO jogo (titulo, descricao, tipo_jogo, total_perguntas, configuracoes)
	VALUES (
		'Forca sobre a Jurema Sagrada',
		'Descubra palavras relacionadas à Jurema Sagrada, incluindo termos espirituais, históricos e culturais, desafiando seu conhecimento e memória.',
		'forca',
		12,
		null
	);

	-- Insert para o jogo Palavra Cruzada
	INSERT INTO jogo (titulo, descricao, tipo_jogo, total_perguntas, configuracoes)
	VALUES (
		'Palavra Cruzada sobre a Jurema Sagrada',
		'Resolva cruzadinhas temáticas sobre a Jurema Sagrada, explorando tradições, histórias e práticas espirituais por meio de palavras-chave.',
		'palavra_cruzada',
		16,
		null
	);

	CREATE TABLE jogo_pontuacao (
		idPontuacao INT AUTO_INCREMENT PRIMARY KEY,
		FkUsuario INT NOT NULL,
		FkJogo INT,
		pontuacao INT NOT NULL,
		total_questoes INT NOT NULL, -- Número total de questões jogadas
		acertos INT NOT NULL,
		erros INT NOT NULL,
		tempo_total DECIMAL(5,2),
		tempo_medio DECIMAL(5,2),
		tipo_jogo varchar(255),	
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (FkUsuario) REFERENCES usuario(idUsuario),
		FOREIGN KEY (FkJogo) REFERENCES jogo(idJogo)
	);

	CREATE TABLE estatisticas_usuarios (
		idEstatisticas INT AUTO_INCREMENT PRIMARY KEY,
		FkUsuario INT NOT NULL,
		jogos_realizados INT DEFAULT 0, -- Total de jogos jogados
		pontuacao_total INT DEFAULT 0,
		ultima_participacao DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (FkUsuario) REFERENCES usuario(idUsuario)
	);

	CREATE TABLE registro_acao_usuario (
		idRegistro INT AUTO_INCREMENT PRIMARY KEY,
		FkUsuario INT NOT NULL,
		acao VARCHAR(50) NOT NULL, -- Exemplo: "Login", "Início de Jogo", "Finalização de Jogo"
		descricao TEXT,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (FkUsuario) REFERENCES usuario(idUsuario)
	);

	CREATE TABLE estatisticas_jogo (
		idEstatistica INT AUTO_INCREMENT PRIMARY KEY,
		FkJogo INT,
		elemento VARCHAR(255) NOT NULL, -- Representa a pergunta, palavra ou item dependendo do jogo
		tipo_elemento ENUM('pergunta', 'palavra') NOT NULL, -- Identifica o tipo de elemento
		acertos INT DEFAULT 0,
		erros INT DEFAULT 0,
		FOREIGN KEY (FkJogo) REFERENCES jogo(idJogo),
		UNIQUE KEY (FkJogo, elemento, tipo_elemento)
	);




-- Trigger: Registro de Logs de Finalização de Quizzes
DELIMITER $$

CREATE TRIGGER after_jogo_pontuacao_insert_log
AFTER INSERT ON jogo_pontuacao
FOR EACH ROW
BEGIN
    INSERT INTO registro_acao_usuario (FkUsuario, acao, descricao)
    VALUES (
        NEW.FkUsuario, 
        'Jogo Finalizado', 
        CONCAT(
            'Jogo ID: ', NEW.FkJogo, 
            ' | Pontuação: ', NEW.pontuacao, 
            ' | Total de perguntas: ', NEW.total_questoes, 
            ' | Acertos: ', NEW.acertos, 
            ' | Erros: ', NEW.erros
        )
    );
END$$
DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_quiz_pontuacao_insert_update_pergunta
AFTER INSERT ON jogo_pontuacao
FOR EACH ROW
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE total INT;

    -- Definir o total de questões
    SET total = NEW.total_questoes;

    -- Loop para iterar por todas as questões do quiz
    WHILE i <= total DO
        -- Atualiza ou insere as estatísticas para a pergunta no quiz
        INSERT INTO estatisticas_jogo (FkJogo, elemento, tipo_elemento, acertos, erros)
        VALUES (NEW.FkJogo, i, 'pergunta',  -- Aqui, usamos apenas o número da pergunta (i)
            CASE WHEN i <= NEW.acertos THEN 1 ELSE 0 END,  -- Lógica simples para acertos
            CASE WHEN i > NEW.acertos THEN 1 ELSE 0 END)    -- Lógica simples para erros
        ON DUPLICATE KEY UPDATE
            acertos = acertos + CASE WHEN i <= NEW.acertos THEN 1 ELSE 0 END,
            erros = erros + CASE WHEN i > NEW.acertos THEN 1 ELSE 0 END;

        -- Incrementa para a próxima pergunta
        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;




DELIMITER $$ 

-- Trigger Atualizar estatísticas do usuário
CREATE TRIGGER after_quiz_pontuacao_insert
AFTER INSERT ON jogo_pontuacao
FOR EACH ROW
BEGIN
  -- Atualizar estatísticas do usuário
  INSERT INTO estatisticas_usuarios (FkUsuario, jogos_realizados, pontuacao_total, ultima_participacao)
  VALUES (NEW.FkUsuario, 1, NEW.pontuacao, NEW.timestamp)
  ON DUPLICATE KEY UPDATE
    jogos_realizados = jogos_realizados + 1,
    pontuacao_total = pontuacao_total + NEW.pontuacao,
    ultima_participacao = NEW.timestamp;
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
    MAX(qp.pontuacao) AS pontuacao_total
FROM 
    usuario u
LEFT JOIN 
    jogo_pontuacao qp ON u.idUsuario = qp.FkUsuario
GROUP BY 
    u.idUsuario, u.nome
ORDER BY 
    pontuacao_total DESC;


-- View para percentual de acertos por pergunta em um quiz
CREATE OR REPLACE VIEW vw_percentual_acertos AS
SELECT 
    ep.FkJogo as FkQuiz,
    ep.elemento as numero_pergunta,
    ROUND((ep.acertos * 100.0) / NULLIF((ep.acertos + ep.erros), 0), 2) AS percentual_acertos
FROM 
    estatisticas_jogo ep;

-- View para evolução de desempenho de um usuário por quiz
 CREATE OR REPLACE VIEW vw_evolucao_desempenho AS
SELECT 
    qp.FkUsuario,
    qp.FkJogo AS id_jogo,
    ROW_NUMBER() OVER (PARTITION BY qp.FkUsuario ORDER BY qp.FkJogo) AS tentativa,
    qp.pontuacao AS pontuacao_usuario
FROM 
    jogo_pontuacao qp
ORDER BY 
    qp.FkUsuario, tentativa;


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
    ROUND(AVG(qp.pontuacao), 2) AS media_pontuacao_usuario,
    ROUND(AVG(qp.tempo_medio), 2) AS tempo_medio_usuario,
    ROUND((SELECT AVG(pontuacao) FROM jogo_pontuacao), 2) AS media_pontuacao_todos,
    ROUND(LEAST((COUNT(qp.idPontuacao) * 100.0 / (SELECT COUNT(*) FROM jogo)), 100), 2) AS taxa_conclusao
FROM 
    usuario u
LEFT JOIN 
    jogo_pontuacao qp ON u.idUsuario = qp.FkUsuario
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

 
-- use jurema_viva;


show tables;
select * from usuario;
select * from jogo_pontuacao;
select * from  jogo;
select * from registro_acao_usuario;
select * from estatisticas_jogo;
select * from estatisticas_usuarios;

-- select para ver as trigger criadas
SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE, ACTION_TIMING, ACTION_STATEMENT
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'jurema_viva';

-- DROP TRIGGER jurema_viva.after_quiz_pontuacao_insert_update_pergunta;

-- DROP VIEW nome_da_view;


-- select para ver as views criadas
SELECT TABLE_NAME AS view_name
FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'jurema_viva';

INSERT INTO jogo_pontuacao (FkUsuario, pontuacao, total_questoes, acertos, erros, timestamp, FkJogo, tempo_medio, tempo_total, tipo_jogo)
VALUES ('1','30','30','30', '0', NOW(), 1, '0.86', '25.81', 'quiz');



SELECT * FROM vw_percentual_acertos WHERE Fkquiz = 1;
