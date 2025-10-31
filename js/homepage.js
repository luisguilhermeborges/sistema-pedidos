// --- ARQUIVO JS (js/homepage.js) ---
// (Versão correta com DOMContentLoaded)

document.addEventListener("DOMContentLoaded", function() {
    
    const logoutButton = document.getElementById("logout-button");

    if (logoutButton) {
        logoutButton.addEventListener("click", function() { 
            if (confirm("Você tem certeza que deseja sair?")) {
                alert("Deslogando...");
                // Volta para a raiz (index.html)
                window.location.href = "../index.html";
            }
        });
    }
});