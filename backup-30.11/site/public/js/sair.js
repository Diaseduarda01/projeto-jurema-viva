function logout() {
    // Limpa os dados de autenticação armazenados
    localStorage.removeItem('ID_USUARIO');
    localStorage.removeItem('NOME_USUARIO');
    localStorage.removeItem('EMAIL_USUARIO');

    // Redireciona o usuário para a página de login ou outra página
    window.location.href = './entrar.html';
}