// Função genérica para carregar gráficos
function carregarGrafico(ctx, url, atualizarGrafico, processarDados) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const processed = processarDados(data);

      // Garantir que labels e values tenham fallback
      const labels = processed.labels || [];
      const values = processed.values.map((v) => v || 0); // Substituir valores inexistentes por 0

      atualizarGrafico(ctx, labels, values);
    })
    .catch((err) => console.error(`Erro ao buscar dados de ${url}:`, err));
}


// Função para atualizar o gráfico de Ranking dos Usuários
function atualizarGraficoRanking(ctx, labels, data) {
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Pontuação",
        backgroundColor: "#43A047",
        data: data,
        barThickness: 30,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { ticks: { color: "#737373" }, grid: { display: false } },
        y: { ticks: { color: "#737373" }, grid: { color: "#e5e5e5" } },
      },
    },
  });
}

// Função para atualizar o gráfico de Evolução do Desempenho
function atualizarGraficoPerformance(ctx, labels, data) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Pontuação Média",
        borderColor: "#43A047",
        backgroundColor: "rgba(67, 160, 71, 0.2)",
        data: data,
        tension: 0.4,
        fill: true,
        pointRadius: 4, // Remove as "bolas" (pontos) no gráfico
        pointHoverRadius: 4 // Remove o efeito de hover sobre os pontos
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { ticks: { color: "#737373" }, grid: { display: false } },
        y: { ticks: { color: "#737373" }, grid: { color: "#e5e5e5" } },
      },
    },
  });
}

// Função para atualizar o gráfico de Percentual de Acertos
function atualizarGraficoAccuracy(ctx, labels, data) {
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Percentual de Acertos",
        backgroundColor: "#43A04776",
        data: data,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: {
            color: "#737373",
            autoSkip: false, // Garante que todos os rótulos sejam exibidos
          },
          grid: { display: false },
        },
        y: { ticks: { color: "#737373" }, grid: { color: "#e5e5e5" } },
      }      
    },
  });
}

// Função para atualizar o gráfico de Crescimento de Usuários Ativos
function atualizarGraficoGrowth(ctx, labels, data) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Usuários Ativos",
        borderColor: "#43A047",
        backgroundColor: "rgba(67, 160, 71, 0.2)",
        data: data,
        tension: 0.4,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { ticks: { color: "#737373" }, grid: { display: false } },
        y: { ticks: { color: "#737373" }, grid: { color: "#e5e5e5" } },
      },
    },
  });
}

// Função para obter KPIs do usuário
function obterKpisUsuario() {
  const idUsuario = sessionStorage.getItem("ID_USUARIO");

  if (!idUsuario) {
    console.error("ID do usuário não encontrado no sessionStorage.");
    return;
  }

  fetch(`/dashboard/kpis?idUsuario=${idUsuario}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error(`Erro na API: ${resposta.statusText}`);
      }
      return resposta.json();
    })
    .then((kpis) => {
      console.log("KPIs recebidas com sucesso:", kpis);

      // Garantir valores padrão caso as KPIs estejam ausentes
      const mediaPontuacao = parseFloat(kpis.media_pontuacao_usuario) || 0;
      const taxaConclusao = parseFloat(kpis.taxa_conclusao) || 0;
      const tempoMedio = parseFloat(kpis.tempo_medio_usuario) || 0;
      const usuariosAtivos = parseInt(kpis.media_pontuacao_todos, 10) || 0;

      // Atualiza os elementos do HTML com valores tratados
      const elMediaPontuacao = document.getElementById("average-score");
      const elTaxaConclusao = document.getElementById("completion-rate");
      const elTempoMedio = document.getElementById("average-time");
      const elUsuariosAtivos = document.getElementById("active-users");

      if (elMediaPontuacao) elMediaPontuacao.textContent = mediaPontuacao.toFixed(2);
      if (elTaxaConclusao) elTaxaConclusao.textContent = `${taxaConclusao.toFixed(2)}%`;
      if (elTempoMedio) elTempoMedio.textContent = `${tempoMedio.toFixed(2)} min`;
      if (elUsuariosAtivos) elUsuariosAtivos.textContent = usuariosAtivos;
    })
    .catch((erro) => {
      console.error("Erro ao obter KPIs:", erro.message);
      alert("Erro ao carregar as KPIs. Tente novamente.");
    });
}


document.addEventListener("DOMContentLoaded", () => {
  const idUsuario = sessionStorage.getItem("ID_USUARIO"); // Pegue o ID do usuário logado
  if (!idUsuario) {
    console.error("ID do usuário não encontrado no sessionStorage.");
    return;
  }

  // Gráfico de Ranking dos Usuários
  const ctxRanking = document.getElementById("ranking-chart")?.getContext("2d");
  if (ctxRanking) {
    carregarGrafico(ctxRanking, "/dashboard/ranking", atualizarGraficoRanking, (data) => ({
      labels: data.map((item) => item.nome),
      values: data.map((item) => item.pontuacao_total || 0) // Garantir fallback
    }));
  }

  // Gráfico de Evolução de Desempenho
  const ctxPerformance = document.getElementById("performance-chart")?.getContext("2d");
  if (ctxPerformance) {
    carregarGrafico(ctxPerformance, `/dashboard/evolucao?idUsuario=${idUsuario}`, atualizarGraficoPerformance, (data) => ({
      labels: data.map((item) => `Tentativa ${item.tentativa}`),
      values: data.map((item) => item.pontuacao_usuario || 0) // Garantir fallback
    }));
  }

// Gráfico de Percentual de Acertos
const ctxAccuracy = document.getElementById("accuracy-chart")?.getContext("2d");
if (ctxAccuracy) {
  carregarGrafico(ctxAccuracy, `/dashboard/acertos?idQuiz=1`, atualizarGraficoAccuracy, (data) => ({
    labels: data.map((item) => `Pergunta ${item.numero_pergunta}`),
    values: data.map((item) => item.percentual_acertos || 0)
  }));
}
  // Gráfico de Crescimento de Usuários Ativos
  const ctxGrowth = document.getElementById("growth-chart")?.getContext("2d");
  if (ctxGrowth) {
    carregarGrafico(ctxGrowth, "/dashboard/crescimento", atualizarGraficoGrowth, (data) => ({
      labels: data.map((item) => item.mes),
      values: data.map((item) => item.usuarios_ativos || 0) // Garantir fallback
    }));
  }

  // Obter KPIs do usuário
  obterKpisUsuario();
});

