// theme.js
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggle = document.getElementById('theme-toggle');

    // Aplica tema salvo
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light');
        if (toggle) toggle.checked = false;
    }

    // Altera tema quando o switch é acionado
    if (toggle) {
        toggle.addEventListener('change', () => {
            body.classList.toggle('light');
            localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
        });
    }
});
