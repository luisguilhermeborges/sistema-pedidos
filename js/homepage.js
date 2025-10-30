// --- ARQUIVO JS (js/homepage.js) ---

// Ouve o evento do roteador
document.addEventListener('pageLoaded', (e) => {
    // Só executa se a homepage do sistema foi carregada
    if (e.detail.path === '/sistema/home') {
        initHomePage();
    }
});

function initHomePage() {
    // O botão de logout está no index.html, então podemos buscá-lo
    const logoutButton = document.getElementById("logout-button");

    if (logoutButton) {
        // Usamos .onclick para garantir que o evento seja "fresco"
        logoutButton.onclick = function() { 
            if (confirm("Você tem certeza que deseja sair?")) {
                alert("Deslogando...");
                // Navega para a página de login
                window.location.hash = "#/login";
            }
        };
    }
}