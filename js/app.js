// --- ARQUIVO JS (js/app.js) ---
// Este é o roteador principal da sua SPA

// (Garante que o DOM está carregado antes de tudo)
document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    const navLinks = document.querySelectorAll(".nav__link[data-link]");
    const navToggle = document.getElementById("navToggle");
    const menu = document.getElementById("menu");
    const body = document.body;

    // Mapa de Rotas: URL Hash -> Arquivo HTML a carregar
    // Crie uma pasta 'views/' para guardar esses "fragmentos"
    const routes = {
        "/home": "views/home.html",
        "/eventos": "views/eventos.html",
        "/clube": "views/clube.html",
        "/lojas": "views/lojas.html",
        "/quem-somos": "views/quem-somos.html",
        
        // --- ROTAS DO SISTEMA ---
        "/login": "views/login.html", 
        "/sistema/home": "views/homepage.html", 
        "/sistema/novo-pedido": "views/transferencias.html", 
        "/sistema/meus-pedidos": "views/pedidos.html" 
    };

    // Função para carregar o conteúdo da página
    async function loadContent(url) {
        mainContent.setAttribute("aria-busy", "true");
        
        const path = url.split('?')[0] || "/home";
        const viewPath = routes[path] || routes["/home"]; 

        try {
            const response = await fetch(viewPath);
            if (!response.ok) throw new Error("Página não encontrada");
            
            const html = await response.text();
            mainContent.innerHTML = html;
            
            // ATIVA OS SCRIPTS DA PÁGINA CARREGADA
            dispatchPageLoadEvent(path);

            // Adiciona/Remove classes do BODY
            if (path.startsWith("/sistema") || path === "/login") {
                body.classList.add("system-active");
            } else {
                body.classList.remove("system-active");
            }

        } catch (error) {
            console.error("Erro ao carregar página:", error);
            mainContent.innerHTML = "<div class='card container'><p>Erro ao carregar o conteúdo. Tente novamente.</p></div>";
        }
        
        mainContent.setAttribute("aria-busy", "false");
        updateActiveLink(path);
    }

    // "Avisa" os outros scripts que a página mudou
    function dispatchPageLoadEvent(path) {
        const event = new CustomEvent('pageLoaded', { detail: { path: path } });
        document.dispatchEvent(event);
    }

    // Atualiza qual link está "ativo" no menu
    function updateActiveLink(path) {
        navLinks.forEach(link => {
            const linkPath = link.getAttribute("href").substring(1); // Remove o '#'
            if (linkPath === path) {
                link.classList.add("is-active");
            } else {
                link.classList.remove("is-active");
            }
        });
        // Fecha o menu mobile ao navegar
        if (menu.classList.contains("is-open")) {
            menu.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    }

    // Ouve mudanças na URL
    window.addEventListener("hashchange", () => {
        loadContent(window.location.hash.substring(1));
    });

    // Carrega a página inicial
    loadContent(window.location.hash.substring(1) || "/home");

    // Lógica do Menu Toggle (do seu app.js original)
    navToggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });
});