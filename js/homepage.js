// Espera o HTML carregar completamente
document.addEventListener("DOMContentLoaded", function() {

    // Encontra o botão de "Sair" pelo ID
    const logoutButton = document.getElementById("logout-button");

    // Verifica se o botão existe antes de adicionar o evento
    if (logoutButton) {
        // Adiciona um "escutador" para o evento de clique
        logoutButton.addEventListener("click", function() {
            
            // Pergunta ao usuário se ele realmente quer sair
            const confirmed = confirm("Você tem certeza que deseja sair?");
            
            if (confirmed) {
                // Se sim, redireciona para a página de login
                alert("Deslogando...");
                
                // CAMINHO CORRIGIDO:
                // De dentro da pasta html/ (homepage.html) para a raiz (index.html)
                // ".." significa "voltar um nível"
                window.location.href = "../index.html";
            }
            // Se não, não faz nada
        });
    }

    // No futuro, aqui você também pode buscar o nome do usuário
    // e substituir o texto "[Nome do Usuário]" no HTML.

});