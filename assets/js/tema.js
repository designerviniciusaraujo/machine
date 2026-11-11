
// ===============================
// THEME SYSTEM
// DEFAULT: LIGHT
// ===============================

const root = document.documentElement;

// Atualizar todos os botões
function updateThemeIcon() {

    const isDark = root.classList.contains('dark');

    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {

        btn.textContent = isDark ? '☀️' : '🌙';

        btn.setAttribute(
            'aria-label',
            isDark ? 'Ativar tema claro' : 'Ativar tema escuro'
        );

        btn.setAttribute(
            'title',
            isDark ? 'Tema claro' : 'Tema escuro'
        );

    });
}

// Carregar tema
function loadTheme() {

    const savedTheme = localStorage.getItem('theme');

    root.classList.remove('dark', 'light');

    // Light como padrão
    if (savedTheme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.add('light');
    }

    updateThemeIcon();
}

// Alternar tema
function toggleTheme() {

    const isDark = root.classList.contains('dark');

    root.classList.remove('dark', 'light');

    if (isDark) {
        root.classList.add('light');
        localStorage.setItem('theme', 'light');
    } else {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }

    updateThemeIcon();
}

// Disponibilizar globalmente
window.toggleTheme = toggleTheme;

// Inicializar imediatamente
loadTheme();
