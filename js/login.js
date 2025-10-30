// Espera o HTML carregar completamente antes de executar o script
document.addEventListener("DOMContentLoaded", function() {
    
    // Seleciona o formulário de login pelo ID
    const loginForm = document.getElementById("login-form");

    // Adiciona um "escutador" para o evento de "submit" (envio) do formulário
    loginForm.addEventListener("submit", function(event) {
        // 1. Impede o comportamento padrão do formulário (que é recarregar a página)
        event.preventDefault();

        // 2. Pega os valores digitados nos campos
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // 3. ----- LÓGICA DE VALIDAÇÃO -----
        // (No futuro, aqui você fará uma chamada para o seu backend para
        // verificar se o usuário e a senha são válidos)

        // 4. Simulação de login:
        if (username !== "" && password !== "") {
            console.log("Usuário:", username);
            console.log("Senha:", password);
            
            // Exibe um alerta de sucesso
            alert("Login realizado com sucesso! Redirecionando...");
            
            // CAMINHO CORRIGIDO:
            // Da raiz (index.html) para dentro da pasta html/
            window.location.href = "html/homepage.html"; 

        } else {
            alert("Por favor, preencha todos os campos.");
        }
    });

});