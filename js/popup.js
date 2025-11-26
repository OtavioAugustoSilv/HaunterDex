
window.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup-container');
    if (popup && popup.textContent.trim() !== '') {
        popup.style.display = 'block';
        setTimeout(() => {
            popup.style.opacity = 1;
        }, 50);

        setTimeout(() => {
            popup.style.opacity = 0;
            setTimeout(() => { popup.style.display = 'none'; }, 300);
        }, 3000); // some após 3s
    }
});

