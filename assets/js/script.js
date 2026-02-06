const about = document.querySelector('#about');
const swiperWrapper = document.querySelector('.swiper-wrapper');
const formulario = document.querySelector('#formulario');
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


async function getAboutGithub() {
    try {
        const resposta = await fetch('https://api.github.com/users/deboracamposs');
        const perfil = await resposta.json();
        about.innerHTML = '';

        about.innerHTML = `
            <figure class="about-image">
                <img src="${perfil.avatar_url}" alt="Foto do Perfil - ${perfil.name}">
            </figure>

            <article class="about-content">
                <h2>Sobre mim</h2>
                <p>
                    Desenvolvedora Full Stack em constante evolução.
                    Sou apaixonada por tecnologia e por transformar ideias em código. Tenho experiência com metodologias ágeis e 
                    foco no ecossistema JavaScript/TypeScript, 
                    buscando sempre criar soluções eficientes e escaláveis.
                </p>
                
                <p>
                    Possuo base analítica sólida adquirida em atuação anterior com dados, o que contribui para a construção 
                    de sistemas bem estruturados, orientados a regras de negócio e manutenção. Experiência com 
                    versionamento de código (Git/GitHub) e boas práticas de programação.
                </p>

                <div class="about-buttons-data">
                    <div class="buttons-container">
                        <a href="${perfil.html_url}" target="_blank" class="botao">Ver Github</a>
                        <a href="#" target="_blank" class="botao-outline">Currículo</a>
                    </div>
                    
                    <div class="data-container">
                        <div class="data-item">
                            <span class="data-number">${perfil.followers}</span>
                            <span class="data-label">Seguidores</span>
                        </div>
                        <div class="data-item">
                            <span class="data-number">${perfil.public_repos}</span>
                            <span class="data-label">Repositórios</span>
                        </div>
                    </div>
                </div>
            </article>
        `;
    } catch (error) {
        console.log('Erro ao buscar dados do Github:', error);            
    }
    
}   

getAboutGithub();

async function getProjectsGithub(){
    try { 
        const resposta = await fetch('https://api.github.com/users/deboracamposs/repos?sort=updated&per_page=6');
        const repositorios = await resposta.json();

        swiperWrapper.innerHTML = '';

        const linguagens = {
            'Javascript': { icone: 'javascript' },
            'TypeScript': { icone: 'typescript' },
            'HTML': { icone: 'html5' },
            'CSS': { icone: 'css3' },
        };

        repositorios.forEach(repositorio => {
            const linguagemExibir = repositorio.language || 'Github';
            const config = linguagens[repositorio.language] || { icone: 'github' };
            const urlIcone = `./assets/icons/languages/${config.icone}.svg`;

            const nomeFormatado = repositorio.name
                .replace(/[-_]/g, ' ')
                .replace(/[^a-zA-Z0-9\s]/g, '')
                .toUpperCase();

            const descricao = repositorio.description
                ? (repositorio.description.length > 100 ? repositorio.description.substring(0, 97) + '...' : repositorio.description)
                : 'Projeto Desenvolvido no Github';

            const tags = repositorio.topics?.length > 0
                ? repositorio.topics.slice(0,3).map(topic => `<span class="tag">${topic}</span>`).join('')
                : `<span class="tag">${linguagemExibir}</span>`;

            const botoesAcao = `
                <div class="project-buttons">
                    <a href="${repositorio.html_url}" target="_blank" class="botao botao-sm">
                        Github
                    </a>
                    ${repositorio.homepage ? `
                        <a href="${repositorio.homepage}" target="_blank" class="botao-outline botao-sm">
                            Deployed
                        </a>
                    ` : ''}
                </div>
            `;

            swiperWrapper.innerHTML += `
                <div class="swiper-slide">
                    <article class="project-card">
                        <div class="project-image">
                            <img src="${urlIcone}"
                                alt="Icone ${linguagemExibir}"
                                onerror="this.onerror=null; this.src='./assets/icons/languages/github.svg';">
                        </div>
                        
                        <div class="project-content">
                            <h3>${nomeFormatado}</h3>
                            <p>${descricao}</p>
                            <div class="project-tags">${tags}</div>
                            ${botoesAcao}
                        </div>
                    </article>
                </div>
            `;
        });

        iniciarSwiper();

    } catch (error) {
        console.log('Erro ao buscar repositórios do Github:', error);
    }
}

getProjectsGithub();

function iniciarSwiper() {
    new Swiper ('.projects-swiper',{
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 24,
        centeredSlides:false,
        loop: true,
        watchOverflow: true,
        
        breakpoints: {
            0: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 40,
                centeredSlides:false,
            },
            769: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 40,
                centeredSlides:false,
                
            },
            1025: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 54,
                centeredSlides:false
            }
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },

        autoplay: {
            delay: 5000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
        },

        grabCursor: true,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
    
    });
}

formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    document.querySelectorAll('form span')
        .forEach(span => span.innerHTML = '');

    let isValid = true;
    
    const nome = document.querySelector('#nome');
    const erroNome = document.querySelector('#erro-nome');

    if (nome.value.trim().length < 3) {
        erroNome.innerHTML = "O nome de ter pelo menos 3 caracteres";
        if (isValid) nome.focus();
        isValid = false;
    }

    const email = document.querySelector('#email');
    const erroEmail = document.querySelector('#erro-email');

    if (!email.value.trim().match(emailRegex)) {
        erroEmail.innerHTML = "Digite um e-mail válido";
        if (isValid) email.focus();
        isValid = false;
    }

    const assunto = document.querySelector('#assunto');
    const erroAssunto = document.querySelector('#erro-assunto');

    if (assunto.value.trim().length < 5) {
        erroAssunto.innerHTML = "O assunto de ter pelo menos 5 caracteres";
        if (isValid) assunto.focus();
        isValid = false;
    }

    const mensagem = document.querySelector('#mensagem');
    const erroMensagem = document.querySelector('#erro-mensagem');

    if (mensagem.value.trim().length === 0) {
        erroMensagem.innerHTML = "A mensagem não pode estar vazia";
        if (isValid) mensagem.focus();
        isValid = false;
    }

    if (isValid) {
        const submitButton = formulario.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = 'Enviando...';

        formulario.submit();
    }

});


