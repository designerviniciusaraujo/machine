// assets/js/theme.js

function updateThemeIcon() {
    const btn = document.getElementById('themeToggle');

    if (!btn) return;

    btn.textContent =
        document.documentElement.classList.contains('dark')
            ? '☀️'
            : '🌙';
}

function loadTheme() {

    const savedTheme = localStorage.getItem('theme');

    // Primeira visita
    if (!savedTheme) {
        document.documentElement.classList.add('dark');
    }

    // Tema salvo
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }

    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
    }

    updateThemeIcon();
}

function toggleTheme() {

    const root = document.documentElement;

    root.classList.toggle('dark');

    localStorage.setItem(
        'theme',
        root.classList.contains('dark')
            ? 'dark'
            : 'light'
    );

    updateThemeIcon();
}

// Disponibiliza para onclick=""
window.toggleTheme = toggleTheme;

// Inicialização
document.addEventListener('DOMContentLoaded', loadTheme);