// --- ARQUIVO JS (js/transferencias.js) ---
// (Lógica de "sempre adicionar" + categorias recolhidas)

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

    if (!selectionOverlay) return;

    // --- 3. FLUXO DE INICIALIZAÇÃO (MODAL) ---
    // (Esta parte não muda)
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
        if (type === "pedido") startNewPedido();
        else if (type === "transferencia") startNewPedido(true); 
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
        pedidoHeaderInfo.innerHTML = isTransferencia ? `<strong>Transferência #${currentOrderInfo.id}</strong> - ${currentOrderInfo.date}` : `<strong>Pedido #${currentOrderInfo.id}</strong> (De: ${origem} | Para: ${destino}) - ${currentOrderInfo.date}`;
        pedidoHeaderInfo.style.display = "block";
        selectionOverlay.style.display = "none";
        renderProductCategories();
        setupSearchListeners();
    }

    // --- 4. RENDERIZAÇÃO DE PRODUTOS (COM ACORDEÃO) ---
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
            // (display: none; é o padrão do CSS)

            groupedItems[category].forEach(item => {
                const itemCard = createProductCard(item);
                itemGrid.appendChild(itemCard);
            });

            // --- LÓGICA DO CLIQUE (RE-ADICIONADA) ---
            categoryHeader.addEventListener("click", () => {
                const isOpen = itemGrid.style.display === "grid";
                if (isOpen) {
                    itemGrid.style.display = "none";
                    categoryHeader.classList.remove("is-open");
                } else {
                    itemGrid.style.display = "grid";
                    categoryHeader.classList.add("is-open");
                }
            });
            // --- FIM DA ATUALIZAÇÃO ---

            categoryBlock.appendChild(categoryHeader);
            categoryBlock.appendChild(itemGrid);
            categoriesWrapper.appendChild(categoryBlock);
        }
    }

    // --- createProductCard (Sem mudança na estrutura) ---
    function createProductCard(item) {
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.cod = item.cod;
        card.dataset.nome = item.nome.toLowerCase();

        // O HTML do card é o mesmo da versão anterior
        card.innerHTML = `
            <div class="product-info">
                <h4>${item.nome}</h4>
                <span class="item-cod">#${item.cod}</span>
            </div>
            <div class="product-actions">
                <div class="qty-selector">
                    <button class="qty-btn minus" aria-label="Diminuir" disabled>-</button>
                    <input type="number" class="item-quantity" value="1" min="1">
                    <button class="qty-btn plus" aria-label="Aumentar">+</button>
                </div>
                <button class="btn-add-item">Adicionar</button>
            </div>
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
        
        // O clique chama a nova lógica de "sempre adicionar"
        btnAdd.addEventListener("click", () => handleAddItem(card, item));
        return card;
    }

    // --- 5. LÓGICA DO CARRINHO (ATUALIZADA) ---
    
    // --- NOVA LÓGICA "SEMPRE ADICIONAR" ---
    function handleAddItem(cardElement, itemData) {
        const cod = itemData.cod;
        const quantityInput = cardElement.querySelector(".item-quantity");
        const quantity = parseInt(quantityInput.value, 10);
        
        if (quantity <= 0) {
            alert("A quantidade deve ser pelo menos 1.");
            return;
        }

        const itemInCart = cart.find(item => item.cod === cod);
        
        if (itemInCart) {
            // Se já está, SOMA a quantidade
            itemInCart.quantity += quantity;
        } else {
            // Se não está, ADICIONA novo item
            cart.push({
                ...itemData,
                quantity: quantity
            });
        }

        // Reseta o input de quantidade para 1
        quantityInput.value = "1";
        const btnMinus = cardElement.querySelector(".qty-btn.minus");
        if (btnMinus) btnMinus.disabled = true;

        // Não muda o texto do botão nem a classe do card
        renderCart();
    }

    // --- LÓGICA DO CARRINHO (BOTÃO "X" CORRIGIDO) ---
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

                // --- LÓGICA DO "X" CORRIGIDA ---
                cartItem.querySelector(".btn-remove-item").addEventListener("click", () => {
                    if (confirm(`Tem certeza que deseja remover "${item.nome}" do carrinho?`)) {
                        cart = cart.filter(cartItem => cartItem.cod !== item.cod);
                        renderCart(); // Atualiza o carrinho
                    }
                });
                cartItemsContainer.appendChild(cartItem);
            });
            finalizeBtn.disabled = false;
        }
    }
    
    // --- 6. FINALIZAR PEDIDO (Sem alteração) ---
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
        window.location.href = "homepage.html";
    });

    // --- 7. LÓGICA DE PESQUISA (ATUALIZADA para Acordeão) ---
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

        // Agora, ajusta as categorias (acordeão)
        allCategoryBlocks.forEach(block => {
            const header = block.querySelector(".category-header");
            const grid = block.querySelector(".item-grid");
            const hasVisibleItems = block.querySelector(".product-card[style*='display: flex']");

            if (term === "") {
                // Se limpou a busca, fecha tudo
                block.style.display = "block";
                grid.style.display = "none";
                header.classList.remove("is-open");
            } else {
                // Se está buscando
                if (hasVisibleItems) {
                    block.style.display = "block"; // Mostra o bloco
                    grid.style.display = "grid";   // Força a abertura
                    header.classList.add("is-open"); // Adiciona a classe para o ícone
                } else {
                    block.style.display = "none"; // Esconde o bloco inteiro
                }
            }
        });
    }

    // --- 8. OUTROS EVENTOS (Sem alteração) ---
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