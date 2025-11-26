window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("formContato");
    const popup = document.getElementById("popup-container");

    // Função global para mostrar popup com fade-in/fade-out
    window.showPopup = function(message, type = "erro") {
        if (!popup) return;

        // Define a cor do popup
        popup.classList.remove("erro", "sucesso");
        popup.classList.add(type);

        // Define a mensagem
        popup.textContent = message;

        // Exibe o popup com fade-in
        popup.style.display = 'block';
        setTimeout(() => {
            popup.style.opacity = 1;
        }, 50);

        // Fade-out após 3,5s
        setTimeout(() => {
            popup.style.opacity = 0;
            setTimeout(() => { popup.style.display = 'none'; }, 300);
        }, 3500);
    };

    // Validação de CPF
    function validarCPF(cpf) {
        const cpfLimpo = cpf.replace(/\D/g, "");
        if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
        let resto = (soma * 10) % 11;
        if (resto === 10) resto = 0;
        if (resto !== parseInt(cpfLimpo.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10) resto = 0;
        return resto === parseInt(cpfLimpo.charAt(10));
    }

    // Evento submit do formulário
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const cpf = document.getElementById("cpf").value.trim();

            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showPopup("Por favor, insira um e-mail válido.", "erro");
                return;
            }

            // Validação de CPF
            if (!validarCPF(cpf)) {
                showPopup("Por favor, insira um CPF válido.", "erro");
                return;
            }

            // Formulário válido
            showPopup("Formulário válido! Enviando...", "sucesso");

            // Delay para usuário ver popup
            setTimeout(() => {
                form.submit();
            }, 700);
        });
    }

    // Se houver mensagem pré-existente (PHP ou outro), aplicar fade-in/fade-out
    if (popup && popup.textContent.trim() !== '') {
        popup.style.display = 'block';
        setTimeout(() => { popup.style.opacity = 1; }, 50);
        setTimeout(() => {
            popup.style.opacity = 0;
            setTimeout(() => { popup.style.display = 'none'; }, 300);
        }, 3500);
    }
});
