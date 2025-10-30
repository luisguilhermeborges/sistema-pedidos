// --- ARQUIVO JS (js/transferencias.js) ---

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. BANCO DE DADOS ---
    if (typeof mockDatabase === 'undefined') {
        alert("Erro fatal: Banco de dados de produtos não carregou.");
        return;
    }

    // --- 2. VARIÁVEIS GLOBAIS E SELETORES ---
    let cart = []; 
    let currentOrderInfo = {}; 

    const selectionOverlay = document.getElementById("selection-overlay");
    const operationTypeSelect = document.getElementById("operation-type");
    const pedidoFields = document.getElementById("pedido-fields");
    const lojaOrigemSelect = document.getElementById("loja-origem");
    const lojaDestinoSelect = document.getElementById("loja-destino");
    const startOperationBtn = document.getElementById("start-operation-btn");
    const logoutButton = document.getElementById("logout-button");
    const pedidoHeaderInfo = document.getElementById("pedido-header-info");
    const categoriesWrapper = document.getElementById("categories-wrapper");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const finalizeBtn = document.getElementById("finalize-order-btn");
    const cartEmptyMsg = document.querySelector(".cart-empty-message");
    const searchInput = document.getElementById("search-input");
    const btnSearchClear = document.getElementById("btn-search-clear");

    if (!selectionOverlay) return; // Segurança

    // --- 3. FLUXO DE INICIALIZAÇÃO (MODAL) ---
    operationTypeSelect.addEventListener("change", function() {
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
        const origem = lojaOrigemSelect.value;
        const destino = lojaDestinoSelect.value;
        const orderId = Math.floor(10000 + Math.random() * 90000); 
        const orderDate = new Date().toLocaleString("pt-BR", {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        currentOrderInfo = {
            id: orderId,
            date: orderDate,
            origem: isTransferencia ? "Loja Atual" : origem,
            destino: isTransferencia ? "Central" : destino,
            items: []
        };

        if (isTransferencia) {
            pedidoHeaderInfo.innerHTML = `<strong>Transferência #${currentOrderInfo.id}</strong> - ${currentOrderInfo.date}`;
        } else {
            pedidoHeaderInfo.innerHTML = `<strong>Pedido #${currentOrderInfo.id}</strong> (De: ${origem} | Para: ${destino}) - ${currentOrderInfo.date}`;
        }
        pedidoHeaderInfo.style.display = "block";
        selectionOverlay.style.display = "none";
        
        renderProductCategories();
        setupSearchListeners();
    }

    // --- 4. RENDERIZAÇÃO DE PRODUTOS ---
    function renderProductCategories() {
        categoriesWrapper.innerHTML = "";
        const groupedItems = mockDatabase.reduce((acc, item) => {
            (acc[item.classificacao] = acc[item.classificacao] || []).push(item);
            return acc;
        }, {});

        for (const category in groupedItems) {
            const categoryBlock = document.createElement("div");
            categoryBlock.className = "category-block";

            const categoryHeader = document.createElement("h3");
            categoryHeader.className = "category-header";
            categoryHeader.textContent = category;
            
            const itemGrid = document.createElement("div");
            itemGrid.className = "item-grid";

            groupedItems[category].forEach(item => {
                const itemCard = createProductCard(item);
                itemGrid.appendChild(itemCard);
            });

            categoryHeader.addEventListener("click", () => {
                itemGrid.style.display = itemGrid.style.display === "grid" ? "none" : "grid";
            });

            categoryBlock.appendChild(categoryHeader);
            categoryBlock.appendChild(itemGrid);
            categoriesWrapper.appendChild(categoryBlock);
        }
    }

    function createProductCard(item) {
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.cod = item.cod;
        card.dataset.nome = item.nome.toLowerCase();

        card.innerHTML = `
            <div class="product-card-header">
                <h4>${item.nome}</h4>
                <span class="item-cod">#${item.cod}</span>
            </div>
            <div class="qty-selector">
                <button class="qty-btn minus" aria-label="Diminuir" disabled>-</button>
                <input type="number" class="item-quantity" value="1" min="1">
                <button class="qty-btn plus" aria-label="Aumentar">+</button>
            </div>
            <button class="btn-add-item">Adicionar</button>
        `;

        const qtyInput = card.querySelector(".item-quantity");
        const btnMinus = card.querySelector(".qty-btn.minus");
        const btnPlus = card.querySelector(".qty-btn.plus");
        const btnAdd = card.querySelector(".btn-add-item");
        
        btnMinus.addEventListener("click", () => {
            let qty = parseInt(qtyInput.value);
            if (qty > 1) {
                qtyInput.value = qty - 1;
                btnMinus.disabled = (qtyInput.value == 1);
            }
        });
        btnPlus.addEventListener("click", () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
            btnMinus.disabled = false;
        });
        qtyInput.addEventListener("change", () => {
             btnMinus.disabled = (qtyInput.value == 1);
        });
        
        btnAdd.addEventListener("click", () => handleAddItem(card, item));
        return card;
    }

    // --- 5. LÓGICA DO CARRINHO ---
    function handleAddItem(cardElement, itemData) {
        const cod = itemData.cod;
        const itemInCart = cart.find(item => item.cod === cod);
        
        if (itemInCart) {
            cart = cart.filter(item => item.cod !== cod);
            cardElement.classList.remove("item-selected");
            cardElement.querySelector(".btn-add-item").textContent = "Adicionar";
        } else {
            const quantity = parseInt(cardElement.querySelector(".item-quantity").value);
            if (quantity <= 0) {
                alert("A quantidade deve ser pelo menos 1.");
                return;
            }
            cart.push({ ...itemData, quantity: quantity });
            cardElement.classList.add("item-selected");
            cardElement.querySelector(".btn-add-item").textContent = "Remover";
        }
        renderCart();
    }

    function renderCart() {
        if (cart.length === 0) {
            cartEmptyMsg.style.display = "block";
            cartItemsContainer.innerHTML = "";
            finalizeBtn.disabled = true;
        } else {
            cartEmptyMsg.style.display = "none";
            cartItemsContainer.innerHTML = ""; 
            
            cart.forEach(item => {
                const cartItem = document.createElement("div");
                cartItem.className = "cart-item";
                cartItem.dataset.cod = item.cod;
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <strong>${item.nome}</strong>
                        <span>(#${item.cod} | Qtd: ${item.quantity})</span>
                    </div>
                    <button class="btn-remove-item" title="Excluir item">✖</button>
                `;
                cartItem.querySelector(".btn-remove-item").addEventListener("click", () => {
                    const cardElement = categoriesWrapper.querySelector(`.product-card[data-cod="${item.cod}"]`);
                    if (cardElement) {
                        handleAddItem(cardElement, item);
                    }
                });
                cartItemsContainer.appendChild(cartItem);
            });
            finalizeBtn.disabled = false;
        }
    }
    
    // --- 6. FINALIZAR PEDIDO ---
    finalizeBtn.addEventListener("click", function() {
        if (cart.length === 0) {
            alert("O carrinho está vazio.");
            return;
        }
        if (!confirm("Tem certeza que deseja finalizar e enviar este pedido?")) {
            return;
        }
        
        currentOrderInfo.items = cart;
        const savedOrders = JSON.parse(localStorage.getItem("meusPedidos")) || [];
        savedOrders.push(currentOrderInfo);
        localStorage.setItem("meusPedidos", JSON.stringify(savedOrders));

        alert(`Pedido #${currentOrderInfo.id} salvo com sucesso!`);
        
        // Redireciona para a homepage do sistema
        window.location.href = "homepage.html";
    });

    // --- 7. LÓGICA DE PESQUISA ---
    function setupSearchListeners() {
        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            filterItems(searchTerm);
            btnSearchClear.style.display = searchTerm ? "block" : "none";
        });

        btnSearchClear.addEventListener("click", () => {
            searchInput.value = "";
            filterItems("");
            btnSearchClear.style.display = "none";
        });
    }

    function filterItems(term) {
        const allCards = categoriesWrapper.querySelectorAll(".product-card");
        const allCategoryBlocks = categoriesWrapper.querySelectorAll(".category-block");

        allCards.forEach(card => {
            const nome = card.dataset.nome;
            const cod = card.dataset.cod;
            const isMatch = nome.includes(term) || cod.includes(term);
            card.style.display = isMatch ? "flex" : "none";
        });

        allCategoryBlocks.forEach(block => {
            const header = block.querySelector(".category-header");
            const grid = block.querySelector(".item-grid");
            const hasVisibleItems = block.querySelector(".product-card[style*='display: flex']");

            if (hasVisibleItems) {
                header.style.display = "block";
                grid.style.display = "grid";
            } else {
                header.style.display = "none";
            }
            
            if (term === "") {
                grid.style.display = "none";
                header.style.display = "block";
            }
        });
    }

    // --- 8. OUTROS EVENTOS ---
    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            if (confirm("Você tem certeza que deseja sair?")) {
                window.location.href = "../index.html";
            }
        });
    }

    // Inicializa o carrinho
    renderCart();
});