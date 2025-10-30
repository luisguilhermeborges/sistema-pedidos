// --- ARQUIVO JS (js/login.js) ---

// Ouve o evento do roteador
document.addEventListener('pageLoaded', (e) => {
    // Só executa se a página de login foi carregada
    if (e.detail.path === '/login') {
        initLoginPage();
    }
});

function initLoginPage() {
    // Adiciona a classe no body para o CSS da página de login funcionar
    document.body.classList.add('login-page');
    
    const loginForm = document.getElementById("login-form");
    if (!loginForm) return; // Segurança

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.toLowerCase();
        const password = document.getElementById("password").value;

        if (password === "") {
             alert("Por favor, preencha a senha.");
             return;
        }

        const validUsers = ["comercial", "logistica", "gerente"];
        
        if (validUsers.includes(username)) {
            alert("Login realizado com sucesso! Redirecionando para o menu principal...");
            
            // Remove a classe do body antes de navegar
            document.body.classList.remove('login-page');
            
            // Navega usando o HASH (não recarrega a página)
            window.location.hash = "#/sistema/home"; 

        } else {
            alert("Usuário não reconhecido. Tente 'comercial', 'logistica' ou 'gerente'.");
        }
    });
}