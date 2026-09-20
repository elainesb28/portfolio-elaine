/* =========================================
   FOTO (aceita .jpeg, .jpg, .png ou .webp)
========================================= */

const foto = document.querySelector(".portrait img");

if (foto) {

    const formatos = ["jpg", "png", "webp", "JPG", "JPEG", "PNG"];
    let tentativa = 0;

    foto.addEventListener("error", () => {

        if (tentativa < formatos.length) {

            foto.src = `images/foto-elaine.${formatos[tentativa++]}`;

        }

    });

}


/* =========================================
   CURSOR
========================================= */

const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");

document.addEventListener("mousemove", (event) => {

    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;

    follower.style.left = `${event.clientX}px`;
    follower.style.top = `${event.clientY}px`;

});

/* o círculo cresce quando passa por cima de algo clicável */

document
    .querySelectorAll("a, button, .project-card, .tech-card")
    .forEach((item) => {

        item.addEventListener("mouseenter", () => follower.classList.add("hover"));
        item.addEventListener("mouseleave", () => follower.classList.remove("hover"));

    });


/* =========================================
   "ELAINE SILVA" SENDO ESCRITO
   (separa o nome em letras para animar uma a uma)
========================================= */

const nome = document.querySelector(".hero h1 .name");

if (nome) {

    const texto = nome.textContent.trim();

    nome.setAttribute("aria-label", texto);
    nome.textContent = "";

    let indice = 0;

    texto.split(" ").forEach((palavra, posicao, lista) => {

        const bloco = document.createElement("span");
        bloco.className = "word";
        bloco.setAttribute("aria-hidden", "true");

        [...palavra].forEach((letra) => {

            const item = document.createElement("span");
            item.className = "letter";
            item.textContent = letra;
            item.style.setProperty("--i", indice++);

            bloco.appendChild(item);

        });

        nome.appendChild(bloco);

        if (posicao < lista.length - 1) {

            nome.appendChild(document.createTextNode(" "));
            indice++;

        }

    });

    nome.style.setProperty("--n", indice);

}


/* =========================================
   BRILHOS FLUTUANDO NO INÍCIO
========================================= */

const hero = document.querySelector(".hero");

if (hero) {

    for (let i = 0; i < 24; i++) {

        const brilho = document.createElement("i");
        const tamanho = 2 + Math.random() * 3;

        brilho.className = "spark";
        brilho.style.left = `${Math.random() * 100}%`;
        brilho.style.top = `${5 + Math.random() * 70}%`;
        brilho.style.width = `${tamanho}px`;
        brilho.style.height = `${tamanho}px`;
        brilho.style.setProperty("--t", `${5 + Math.random() * 5}s`);
        brilho.style.setProperty("--dl", `${Math.random() * 6}s`);
        brilho.style.setProperty("--dx", `${-25 + Math.random() * 50}px`);

        hero.appendChild(brilho);

    }

}


/* =========================================
   APARECER AOS POUCOS AO ROLAR A PÁGINA

   Cada linha abaixo diz: [o que aparece, tipo de efeito, intervalo em ms].
   Tipos: up (sobe), left, right, zoom, pop, fade, frame, bloom
========================================= */

const efeitos = [

    /* SOBRE MIM */
    [".paper-content .section-label", "fade"],
    [".paper-content h2", "left"],
    [".paper-content h3", "up"],
    [".paper-content > p:not(.section-label)", "up"],
    [".values > div", "pop", 90],
    [".portrait-frame", "frame"],
    [".sunflower", "bloom"],

    /* PROJETOS */
    [".section-heading > p", "fade"],
    [".section-heading h2", "left"],
    [".section-heading > span", "up"],

    /* TECNOLOGIAS */
    [".tech-text .section-label", "fade"],
    [".tech-text h2", "left"],
    [".tech-text p:not(.section-label)", "up"],
    [".tech-card", "pop", 80],
    [".handwritten", "fade"],

    /* TRAJETÓRIA */
    [".timeline-title .section-label", "fade"],
    [".timeline-title h2", "left"],

    /* CONTATO */
    [".contact-content .section-label", "fade"],
    [".contact-content h2", "left"],
    [".contact-content p:not(.section-label)", "up"],
    [".contact-content .main-button", "zoom"],
    [".contact-links a", "right", 160],

    /* RODAPÉ */
    [".footer-art h2", "up"],
    [".footer-art p", "up"],
    [".footer-heart", "pop"],
    [".footer-bottom", "fade"]

];

/* elementos que "abrem" em sequência: um card e o que tem dentro dele */

const cartoes = [

    {
        seletor: ".project-card",
        efeito: "up",
        passo: 260,
        dentro: [
            [".project-image", "zoom"],
            [".project-info h3", "up"],
            [".project-info p", "up"],
            [".tags span", "pop"],
            [".project-info > a, .project-links a", "left"]
        ]
    },

    {
        seletor: ".timeline-item",
        efeito: "left",
        passo: 380,
        dentro: [
            [".timeline-dot", "pop"],
            [".timeline-date", "fade"],
            ["h3", "up"],
            ["p", "up"]
        ]
    }

];

const filhos = new Map();
const alvos = [];

function preparar(elemento, tipo, passo) {

    elemento.classList.add("rv");
    elemento.dataset.rv = tipo;

    if (passo) {

        elemento.dataset.passo = passo;

    }

    alvos.push(elemento);

}

efeitos.forEach(([seletor, tipo, passo]) => {

    document.querySelectorAll(seletor).forEach((el) => preparar(el, tipo, passo));

});

cartoes.forEach((grupo) => {

    document.querySelectorAll(grupo.seletor).forEach((cartao) => {

        preparar(cartao, grupo.efeito, grupo.passo);

        const lista = [];

        grupo.dentro.forEach(([seletor, tipo]) => {

            cartao.querySelectorAll(seletor).forEach((el) => {

                el.classList.add("rv");
                el.dataset.rv = tipo;
                lista.push(el);

            });

        });

        filhos.set(cartao, lista);

    });

});

function mostrar(elemento, atraso) {

    elemento.style.setProperty("--d", `${atraso}ms`);
    elemento.classList.add("rv-in");

    const dentro = filhos.get(elemento);

    if (dentro) {

        dentro.forEach((item, posicao) => {

            mostrar(item, atraso + 350 + posicao * 110);

        });

    }

}

const observador = new IntersectionObserver(

    (entradas) => {

        /* quem entra junto aparece em fila, um depois do outro */

        let atraso = 0;

        entradas
            .filter((entrada) => entrada.isIntersecting)
            .sort((a, b) =>
                a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
            )
            .forEach((entrada) => {

                const el = entrada.target;

                mostrar(el, atraso);
                atraso += Number(el.dataset.passo) || 110;

                observador.unobserve(el);

            });

    },

    {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    }

);

alvos.forEach((el) => observador.observe(el));


/* pinturas laterais deslizam para dentro; a linha da trajetória se desenha */

const decoracoes = new IntersectionObserver(

    (entradas) => {

        entradas.forEach((entrada) => {

            if (!entrada.isIntersecting) return;

            entrada.target.classList.add("art-in");

            const linha = entrada.target.querySelector(".timeline");

            if (linha) linha.classList.add("line-in");

            decoracoes.unobserve(entrada.target);

        });

    },

    { threshold: 0.2 }

);

document
    .querySelectorAll(".technology-section, .timeline-section")
    .forEach((secao) => decoracoes.observe(secao));


/* =========================================
   BOTÃO DE TEMA
========================================= */

const themeButton = document.getElementById("themeButton");

let dark = true;

themeButton.addEventListener("click", () => {

    dark = !dark;

    document.body.classList.toggle("light-mode");

    themeButton.textContent = dark ? "☼" : "☾";

});


/* =========================================
   MENU: item da seção atual fica destacado
========================================= */

const linksMenu = document.querySelectorAll(".navbar nav a");

linksMenu.forEach((link) => {

    link.addEventListener("click", () => {

        linksMenu.forEach((item) => item.classList.remove("active"));

        link.classList.add("active");

    });

});

const secoesMenu = document.querySelectorAll("main section[id]");

const espiao = new IntersectionObserver(

    (entradas) => {

        entradas.forEach((entrada) => {

            if (!entrada.isIntersecting) return;

            linksMenu.forEach((link) => {

                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${entrada.target.id}`
                );

            });

        });

    },

    { rootMargin: "-45% 0px -50% 0px" }

);

secoesMenu.forEach((secao) => espiao.observe(secao));


/* =========================================
   BARRA DE PROGRESSO + MENU QUE ENCOLHE
========================================= */

const barra = document.createElement("div");
barra.className = "scroll-progress";
document.body.appendChild(barra);

const menu = document.querySelector(".navbar");

let esperando = false;

function aoRolar() {

    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progresso = total > 0 ? window.scrollY / total : 0;

    barra.style.transform = `scaleX(${progresso})`;
    menu.classList.toggle("scrolled", window.scrollY > 60);

    esperando = false;

}

window.addEventListener("scroll", () => {

    if (!esperando) {

        esperando = true;
        requestAnimationFrame(aoRolar);

    }

}, { passive: true });

aoRolar();