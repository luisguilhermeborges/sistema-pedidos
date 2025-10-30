// --- ARQUIVO JS (js/transferencias.js) ---

// Ouve o evento do roteador
document.addEventListener('pageLoaded', (e) => {
    // Só executa se a página de novo pedido foi carregada
    if (e.detail.path === '/sistema/novo-pedido') {
        initTransferenciasPage();
    }
});

// Colocamos todo o seu código original dentro de uma função
function initTransferenciasPage() {
    
    // --- 1. BANCO DE DADOS ---
    if (typeof mockDatabase === 'undefined') {
        alert("Erro fatal: Banco de dados de produtos não carregou.");
        return;
    }

    // --- 2. VARIÁVEIS GLOBAIS E SELETORES ---
    let cart = []; 
    let currentOrderInfo = {}; 

    // Seletores (eles existem agora, pois o HTML foi injetado)
    const selectionOverlay = document.getElementById("selection-overlay");
    const operationTypeSelect = document.getElementById("operation-type");
    const pedidoFields = document.getElementById("pedido-fields");
    const lojaOrigemSelect = document.getElementById("loja-origem");
    const lojaDestinoSelect = document.getElementById("loja-destino");
    const startOperationBtn = document.getElementById("start-operation-btn");
    const logoutButton = document.getElementById("logout-button"); // Está no index
    const pedidoHeaderInfo = document.getElementById("pedido-header-info");
    const categoriesWrapper = document.getElementById("categories-wrapper");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const finalizeBtn = document.getElementById("finalize-order-btn");
    const cartEmptyMsg = document.querySelector(".cart-empty-message");
    const searchInput = document.getElementById("search-input");
    const btnSearchClear = document.getElementById("btn-search-clear");

    // Segurança: se os elementos não carregaram, pare.
    if (!selectionOverlay) return;

    // --- 3. FLUXO DE INICIALIZAÇÃO (MODAL) ---
    // (Todo o seu código original daqui para baixo)

    operationTypeSelect.addEventListener("change", function() {
        // ... (lógica do modal igual)
        const type = this.value;
        if (type === "pedido") {
            pedidoFields.classList.remove("hidden");
            validateModal();
        } else if (type === "transferencia") {
            pedidoFields.classList.add("hidden");
            startOperationBtn.disabled = false;
        } else {
            pedidoFields.classList.add("hidden");
            startOperationBtn.disabled = true;
        }
    });
    lojaOrigemSelect.addEventListener("change", validateModal);
    lojaDestinoSelect.addEventListener("change", validateModal);
    function validateModal() {
        const origem = lojaOrigemSelect.value;
        const destino = lojaDestinoSelect.value;
        startOperationBtn.disabled = !(origem && destino && origem !== destino);
    }
    startOperationBtn.addEventListener("click", function() {
        const type = operationTypeSelect.value;
        if (type === "pedido") {
            startNewPedido();
        } else if (type === "transferencia") {
            startNewPedido(true); 
        }
    });
    function startNewPedido(isTransferencia = false) {
        // ... (lógica do startNewPedido igual)
        const origem = lojaOrigemSelect.value;
        const destino = lojaDestinoSelect.value;
        const orderId = Math.floor(10000 + Math.random() * 90000); 
        const orderDate = new Date().toLocaleString("pt-BR", {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        currentOrderInfo = { /* ... */ };
        if (isTransferencia) { /* ... */ } else { /* ... */ }
        pedidoHeaderInfo.style.display = "block";
        selectionOverlay.style.display = "none";
        renderProductCategories();
        setupSearchListeners();
    }

    // --- 4. RENDERIZAÇÃO DE PRODUTOS ---
    function renderProductCategories() {
        // ... (lógica de renderProductCategories igual)
        categoriesWrapper.innerHTML = "";
        const groupedItems = mockDatabase.reduce((acc, item) => {
            (acc[item.classificacao] = acc[item.classificacao] || []).push(item);
            return acc;
        }, {});
        for (const category in groupedItems) { /* ... */ }
    }
    function createProductCard(item) {
        // ... (lógica de createProductCard igual)
        const card = document.createElement("div");
        card.className = "product-card";
        /* ... */
        return card;
    }

    // --- 5. LÓGICA DO CARRINHO ---
    function handleAddItem(cardElement, itemData) {
        // ... (lógica de handleAddItem igual)
    }
    function renderCart() {
        // ... (lógica de renderCart igual)
    }
    
    // --- 6. FINALIZAR PEDIDO ---
    finalizeBtn.onclick = function() { // Use .onclick para garantir
        if (cart.length === 0) { /* ... */ return; }
        if (!confirm("Tem certeza?")) { /* ... */ return; }
        
        currentOrderInfo.items = cart;
        const savedOrders = JSON.parse(localStorage.getItem("meusPedidos")) || [];
        savedOrders.push(currentOrderInfo);
        localStorage.setItem("meusPedidos", JSON.stringify(savedOrders));

        alert(`Pedido #${currentOrderInfo.id} salvo com sucesso!`);
        
        // Navega para a homepage do sistema
        window.location.hash = "#/sistema/home";
    };

    // --- 7. LÓGICA DE PESQUISA ---
    function setupSearchListeners() {
        // ... (lógica de setupSearchListeners igual)
        searchInput.addEventListener("input", () => { /* ... */ });
        btnSearchClear.addEventListener("click", () => { /* ... */ });
    }
    function filterItems(term) {
        // ... (lógica de filterItems igual)
    }

    // --- 8. OUTROS EVENTOS ---
    if (logoutButton) {
        logoutButton.onclick = function() { // Use .onclick
            if (confirm("Você tem certeza que deseja sair?")) {
                window.location.hash = "#/login";
            }
        };
    }

    // Inicializa o carrinho
    renderCart();
}