const toggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Carrega preferência salva
  if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light');
    toggle.checked = true;
  }

  toggle.addEventListener('change', () => {
    body.classList.toggle('light');
    localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
  });