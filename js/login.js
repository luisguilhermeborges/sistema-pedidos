// --- ARQUIVO JS (js/login.js) ---
// (Versão correta com DOMContentLoaded)

document.addEventListener("DOMContentLoaded", function() {
    
    const loginForm = document.getElementById("login-form");
    if (!loginForm) return; // Segurança

    loginForm.addEventListener("submit", function(event) {
        // 1. Impede o comportamento padrão do formulário
        event.preventDefault();

        // 2. Pega os valores
        const username = document.getElementById("username").value.toLowerCase();
        
        // Pega a senha (campo não é obrigatório)
        const passwordInput = document.getElementById("password");
        const password = passwordInput ? passwordInput.value : ""; 

        // 3. Validação
        const validUsers = ["comercial", "logistica", "gerente"];
        
        if (validUsers.includes(username)) {
            alert("Login realizado com sucesso! Redirecionando...");
            
            // 4. Redireciona para a pasta html/
            window.location.href = "html/homepage.html"; 

        } else {
            alert("Usuário não reconhecido. Tente 'comercial', 'logistica' ou 'gerente'.");
        }
    });
});