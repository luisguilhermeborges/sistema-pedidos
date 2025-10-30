// Espera o HTML carregar
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. SIMULAÇÃO DE BANCO DE DADOS ---
    const mockDatabase = [
        { cod: "1001", nome: "Picanha", classificacao: "Resfriados" },
        { cod: "1002", nome: "Alcatra", classificacao: "Resfriados" },
        { cod: "2001", nome: "Pão de Alho", classificacao: "Congelados" },
        { cod: "2002", nome: "Batata Frita", classificacao: "Congelados" },
        { cod: "3001", nome: "Sal Grosso", classificacao: "Secos" },
        { cod: "4001", nome: "Embalagem P", classificacao: "Insumos" },
        { cod: "9001", nome: "Kit Churrasco", classificacao: "Secos" },
    ];

    // --- 2. VARIÁVEIS GLOBAIS E SELETORES ---
    let cart = []; // Nosso carrinho
    
    const availableItemsContainer = document.getElementById("available-items-container");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const finalizeBtn = document.getElementById("finalize-order-btn");
    const cartEmptyMsg = document.querySelector(".cart-empty-message");
    
    // Botão de Logout (no header)
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            if (confirm("Você tem certeza que deseja sair?")) {
                window.location.href = "../index.html";
            }
        });
    }

    // --- 3. FUNÇÕES DE RENDERIZAÇÃO ---

    /**
     * Renderiza (desenha) todos os itens do "banco de dados" na tela.
     */
    function renderAvailableItems() {
        availableItemsContainer.innerHTML = ""; // Limpa a lista
        
        mockDatabase.forEach(item => {
            const itemCard = document.createElement("div");
            itemCard.className = "item-card";
            itemCard.dataset.cod = item.cod; 
            
            itemCard.innerHTML = `
                <div class="item-info">
                    <h4>${item.nome}</h4>
                    <span class="tag-classificacao">${item.classificacao}</span>
                </div>
                <div class="item-actions">
                    <select class="item-motivo">
                        <option value="">-- Selecione o Motivo --</option>
                        <option value="Retorno de Loja">Retorno de Loja</option>
                        <option value="Vencimento">Vencimento</option>
                        <option value="Revisão">Revisão</option>
                        <option value="Transferência">Transferência</option>
                    </select>
                    <input type="number" class="item-quantity" min="0" value="0">
                    <button class="btn-add-item">Adicionar</button>
                </div>
            `;
            
            itemCard.querySelector(".btn-add-item").addEventListener("click", handleAddItem);
            availableItemsContainer.appendChild(itemCard);
        });
    }

    /**
     * Renderiza (desenha) os itens que estão no carrinho.
     */
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
                cartItem.dataset.motivo = item.motivo; // Armazena o motivo tbm

                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <strong>${item.nome}</strong> (Qtd: ${item.quantity})
                        <span>Motivo: ${item.motivo}</span>
                    </div>
                    <button class="btn-remove-item" title="Excluir item">✖</button>
                `;

                cartItem.querySelector(".btn-remove-item").addEventListener("click", handleRemoveItem);
                cartItemsContainer.appendChild(cartItem);
            });
            
            finalizeBtn.disabled = false;
        }
    }

    // --- 4. FUNÇÕES DE EVENTO (Handlers) ---

    /**
     * Chamado quando o botão "Adicionar" é clicado.
     */
    function handleAddItem(event) {
        const card = event.target.closest(".item-card");
        const cod = card.dataset.cod;
        
        const quantityInput = card.querySelector(".item-quantity");
        const motivoSelect = card.querySelector(".item-motivo");
        
        const quantity = parseInt(quantityInput.value, 10);
        const motivo = motivoSelect.value;

        // Validação
        if (motivo === "") {
            alert("Por favor, selecione um motivo.");
            motivoSelect.focus();
            return;
        }
        if (quantity <= 0) {
            alert("Por favor, insira uma quantidade maior que zero.");
            quantityInput.focus();
            return;
        }

        const itemData = mockDatabase.find(item => item.cod === cod);
        
        // Verifica se o item (com o MESMO motivo) já está no carrinho
        const itemInCart = cart.find(item => item.cod === cod && item.motivo === motivo);

        if (itemInCart) {
            // Se já existe, apenas soma a quantidade
            itemInCart.quantity += quantity;
            alert("Quantidade somada ao item existente no carrinho!");
        } else {
            // Se não está, adiciona o novo item
            cart.push({
                ...itemData,
                quantity: quantity,
                motivo: motivo // Adiciona o motivo ao objeto
            });
            alert("Item adicionado ao carrinho!");
        }

        // Reseta os campos do card
        quantityInput.value = "0";
        motivoSelect.value = "";

        renderCart();
    }

    /**
     * Chamado quando o botão "Remover" (X) é clicado.
     */
    function handleRemoveItem(event) {
        const itemElement = event.target.closest(".cart-item");
        const cod = itemElement.dataset.cod;
        const motivo = itemElement.dataset.motivo; // Precisa do motivo para saber qual remover

        if (confirm("Tem certeza que deseja remover este item?")) {
            // Remove o item que bate o COD e o MOTIVO
            cart = cart.filter(item => !(item.cod === cod && item.motivo === motivo));
            renderCart();
        }
    }

    /**
     * Chamado quando o botão "Finalizar Transferência" é clicado.
     */
    function handleFinalizeOrder() {
        if (cart.length === 0) {
            alert("O carrinho está vazio.");
            return;
        }
        
        console.log("--- TRANSFERÊNCIA FINALIZADA ---");
        console.log(cart); // Mostra o array do carrinho no console
        
        alert("Transferência registrada com sucesso!");

        cart = [];
        renderCart();
    }

    // --- 5. INICIALIZAÇÃO ---
    finalizeBtn.addEventListener("click", handleFinalizeOrder);
    renderAvailableItems();
    renderCart();

});