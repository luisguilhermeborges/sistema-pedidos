// --- ARQUIVO JS (js/pedidos.js) ---

// Ouve o evento do roteador
document.addEventListener('pageLoaded', (e) => {
    // Só executa se a página "meus pedidos" foi carregada
    if (e.detail.path === '/sistema/meus-pedidos') {
        initPedidosPage();
    }
});

function initPedidosPage() {
    
    // --- 1. SELETORES ---
    const listContainer = document.getElementById("pedidos-list-container");
    const emptyMsg = document.querySelector(".empty-list-message");
    const logoutButton = document.getElementById("logout-button");

    if (!listContainer) return;

    // --- 2. EVENTOS ---
    if (logoutButton) {
        logoutButton.onclick = function() {
            if (confirm("Você tem certeza que deseja sair?")) {
                window.location.hash = "#/login";
            }
        };
    }

    // --- 3. FUNÇÃO DE RENDERIZAÇÃO ---
    function renderSavedOrders() {
        const savedOrders = JSON.parse(localStorage.getItem("meusPedidos")) || [];

        if (savedOrders.length === 0) {
            emptyMsg.style.display = "block";
            listContainer.innerHTML = "";
            listContainer.appendChild(emptyMsg);
        } else {
            emptyMsg.style.display = "none";
            listContainer.innerHTML = ""; 

            savedOrders.forEach(order => {
                const orderCard = document.createElement("div");
                orderCard.className = "pedido-card";
                // ... (lógica de renderSavedOrders igual)
                let itemsHtml = "<ul>";
                order.items.forEach(item => {
                    itemsHtml += `<li><strong>${item.quantity}x</strong> ${item.nome}</li>`;
                });
                itemsHtml += "</ul>";
                orderCard.innerHTML = `...`; // (Seu HTML do card)
                
                listContainer.appendChild(orderCard);
            });
        }
    }

    // --- 4. INICIALIZAÇÃO ---
    renderSavedOrders();
}