use jurema_viva;
INSERT INTO quiz_detalhes (titulo, descricao, total_perguntas)
VALUES (
    'Quiz sobre a Jurema Sagrada',
    'Este quiz aborda diversos aspectos da Jurema Sagrada, incluindo tradições, história, práticas e significados espirituais. O objetivo é promover o conhecimento e a valorização desta rica cultura.',
    30
);


show tables;
select * from usuario;
select * from quiz_pontuacao;
select * from  quiz_detalhes;
select * from logs_acesso;
select * from estatisticas_pergunta;
select * from estatisticas_usuarios;

		SELECT 
    u.idUsuario,
    u.nome,
    AVG(qp.pontuacao) AS media_pontuacao_usuario,
    AVG(qp.tempo_medio) AS tempo_medio_usuario,
    (SELECT AVG(pontuacao) FROM quiz_pontuacao) AS media_pontuacao_todos,
    (COUNT(qp.id) * 100.0 / (SELECT COUNT(*) FROM quiz_detalhes)) AS taxa_conclusao
FROM 
    usuario u
JOIN 
    quiz_pontuacao qp ON u.idUsuario = qp.FkUsuario

GROUP BY 
    u.idUsuario, u.nome
LIMIT 1000;

SELECT 
        u.idUsuario,
        u.nome,
        ROUND(AVG(qp.pontuacao), 2) AS media_pontuacao_usuario,
        ROUND(AVG(qp.tempo_medio), 2) AS tempo_medio_usuario,
        ROUND((SELECT AVG(pontuacao) FROM quiz_pontuacao), 2) AS media_pontuacao_todos,
        ROUND((COUNT(qp.id) * 100.0 / (SELECT COUNT(*) FROM quiz_detalhes)), 2) AS taxa_conclusao
    FROM 
        usuario u
    JOIN 
        quiz_pontuacao qp ON u.idUsuario = qp.FkUsuario
    WHERE 
        u.idUsuario = 1
    GROUP BY 
        u.idUsuario, u.nome
    LIMIT 100;
  

-- Ranking dos Usuários
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
    total_pontuacao DESC
LIMIT 5;


-- Evolução do Desempenho
SELECT 
    WEEK(q.timestamp) AS semana,
    AVG(q.pontuacao) AS pontuacao_media
FROM 
    quiz_pontuacao q
GROUP BY 
    semana
ORDER BY 
    semana;
    
-- Percentual de Acertos por Pergunta
SELECT 
    ep.numero_pergunta,
    (ep.acertos / (ep.acertos + ep.erros)) * 100 AS percentual_acertos
FROM 
    estatisticas_pergunta ep
WHERE 
    ep.FkQuiz = 1; -- Substitua pelo ID do quiz desejado
    
    
-- Crescimento de Usuários Ativos
SELECT 
    DATE_FORMAT(la.timestamp, '%Y-%m') AS mes,
    COUNT(DISTINCT la.FkUsuario) AS usuarios_ativos
FROM 
    logs_acesso la
GROUP BY 
    mes
ORDER BY 
    mes;
    
SELECT * FROM estatisticas_pergunta WHERE FkQuiz = 1;
SELECT * FROM logs_acesso WHERE FkUsuario;
SELECT * FROM vw_ranking_usuarios;
SELECT * FROM vw_evolucao_desempenho;
SELECT * FROM vw_percentual_acertos_;
SELECT * FROM vw_crescimento_usuarios;


SELECT 
    AVG(qp.pontuacao) AS pontuacao_media,  -- Média de pontuação do usuário
    COUNT(DISTINCT qp.FkQuiz) AS quizzes_concluidos,  -- Quantidade de quizzes concluídos
    AVG(
        IFNULL(
            TIMESTAMPDIFF(HOUR, 
                (SELECT MIN(la.timestamp)  -- Hora do "Quiz Iniciado"
                 FROM logs_acesso la
                 WHERE la.FkUsuario = qp.FkUsuario
                   AND la.acao = 'Quiz Iniciado'
                   AND EXISTS (SELECT 1 FROM quiz_pontuacao q WHERE q.FkQuiz = la.FkQuiz AND q.FkUsuario = la.FkUsuario AND q.FkQuiz = qp.FkQuiz)),  -- Assegura que é o mesmo quiz
                (SELECT MAX(la.timestamp)  -- Hora do "Quiz Finalizado"
                 FROM logs_acesso la
                 WHERE la.FkUsuario = qp.FkUsuario
                   AND la.acao = 'Quiz Finalizado'
                   AND EXISTS (SELECT 1 FROM quiz_pontuacao q WHERE q.FkQuiz = la.FkQuiz AND q.FkUsuario = la.FkUsuario AND q.FkQuiz = qp.FkQuiz))   -- Assegura que é o mesmo quiz
            ), 
            0  -- Caso não haja registros de tempo, atribui 0
        )
    ) AS tempo_medio,  -- Tempo entre o início e fim do quiz, substitui NULL por 0
    COUNT(DISTINCT la.FkUsuario) AS usuarios_ativos  -- Contagem de usuários ativos
FROM 
    quiz_pontuacao qp
JOIN 
    logs_acesso la ON la.FkUsuario = qp.FkUsuario  -- Relacionamento entre logs e quiz
WHERE 
    qp.FkUsuario = 11  -- Substitua pelo ID do usuário
GROUP BY 
    qp.FkUsuario;






CREATE UNIQUE INDEX idx_unique_quiz_pergunta ON estatisticas_pergunta (FkQuiz, numero_pergunta);
