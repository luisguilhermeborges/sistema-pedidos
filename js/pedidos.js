// --- ARQUIVO JS (js/homepage.js) ---

document.addEventListener("DOMContentLoaded", function() {
    
    const logoutButton = document.getElementById("logout-button");

    if (logoutButton) {
        logoutButton.addEventListener("click", function() { 
            if (confirm("Você tem certeza que deseja sair?")) {
                alert("Deslogando...");
                // Volta para a página de login (index.html na raiz)
                window.location.href = "../index.html";
            }
        });
    }
});