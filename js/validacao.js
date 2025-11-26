document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("formContato");
  const popupContainer = document.getElementById("popup-container");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf").value.trim();

    // --- Validação do e-mail ---
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
    if (!emailRegex.test(email)) {
      showPopup("Por favor, insira um e-mail válido no formato algo@dominio.com");
      return;
    }

    // --- Validação do CPF ---
    if (!validarCPF(cpf)) {
      showPopup("Por favor, insira um CPF válido no formato 999.999.999-99");
      return;
    }

    showPopup("Formulário enviado com sucesso!", "success");
    form.submit();
  });

  function showPopup(message, type = "error") {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    if (type === "success") popup.style.backgroundColor = "#4CAF50"; // verde
    popup.textContent = message;
    popupContainer.appendChild(popup);

    setTimeout(() => {
      popup.remove();
    }, 4000); // desaparece após 4s
  }

  function validarCPF(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpfLimpo.charAt(10));
  }
});
