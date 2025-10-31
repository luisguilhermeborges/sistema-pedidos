// --- ARQUIVO JS (js/pedidos.js) ---
// (Versão correta com DOMContentLoaded)

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. SELETORES ---
    const listContainer = document.getElementById("pedidos-list-container");
    const emptyMsg = document.querySelector(".empty-list-message");
    const logoutButton = document.getElementById("logout-button");

    if (!listContainer) return;

    // --- 2. EVENTOS ---
    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            if (confirm("Você tem certeza que deseja sair?")) {
                window.location.href = "../index.html";
            }
        });
    }

    // --- 3. FUNÇÃO DE RENDERIZAÇÃO ---
    function renderSavedOrders() {
        const savedOrders = JSON.parse(localStorage.getItem("meusPedidos")) || [];

        if (savedOrders.length === 0) {
            emptyMsg.style.display = "block";
            listContainer.innerHTML = "";
        } else {
            emptyMsg.style.display = "none";
            listContainer.innerHTML = ""; 

            savedOrders.reverse(); // Mostra os mais recentes primeiro

            savedOrders.forEach(order => {
                const orderCard = document.createElement("div");
                orderCard.className = "pedido-card";
                
                let itemsHtml = "<ul>";
                order.items.forEach(item => {
                    itemsHtml += `<li><strong>${item.quantity}x</strong> ${item.nome} (#${item.cod})</li>`;
                });
                itemsHtml += "</ul>";

                orderCard.innerHTML = `
                    <div class="pedido-card-header">
                        <h3>Pedido #${order.id}</h3>
                        <span>${order.date}</span>
                    </div>
                    <div class="pedido-card-lojas">
                        <div>Origem: <strong>${order.origem}</strong></div>
                        <div>Destino: <strong>${order.destino}</strong></div>
                    </div>
                    <div class="pedido-card-body">
                        <h4>Itens Solicitados (${order.items.length}):</h4>
                        ${itemsHtml}
                    </div>
                `;
                
                listContainer.appendChild(orderCard);
            });
        }
    }

    // --- 4. INICIALIZAÇÃO ---
    renderSavedOrders();
});