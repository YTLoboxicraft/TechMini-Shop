// --- Modo claro/oscuro manual y automático ---
function applyTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else if (theme === 'light') {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    } else {
        // Automático según sistema
        document.body.classList.remove('dark-mode');
        document.body.classList.remove('light-mode');
    }
}

function toggleTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        localStorage.setItem('theme', 'light');
    } else if (theme === 'light') {
        localStorage.setItem('theme', 'dark');
    } else {
        // Si está en automático, pasa a oscuro
        localStorage.setItem('theme', 'dark');
    }
    applyTheme();
}

document.addEventListener('DOMContentLoaded', function() {
    applyTheme();
    const modeToggle = document.getElementById('modeToggle');
    if (modeToggle) {
        modeToggle.onclick = toggleTheme;
    }
});