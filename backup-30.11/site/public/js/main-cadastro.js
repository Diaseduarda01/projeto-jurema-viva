const pwShowHide = document.querySelectorAll(".showHidePw"),  // Ícones de exibição de senha
      pwFields = document.querySelectorAll(".password");     // Campos de senha

// js code to show/hide password and change icon
pwShowHide.forEach((eyeIcon, index) => {
  eyeIcon.addEventListener("click", () => {
    const pwField = pwFields[index]; // Seleciona o campo de senha correspondente ao ícone

    if (pwField.type === "password") {
      pwField.type = "text"; // Altera o tipo do campo de senha para 'text'

      // Substitui o ícone de "ocultar" por "mostrar"
      eyeIcon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      pwField.type = "password"; // Altera o tipo do campo de senha para 'password'

      // Substitui o ícone de "mostrar" por "ocultar"
      eyeIcon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});
