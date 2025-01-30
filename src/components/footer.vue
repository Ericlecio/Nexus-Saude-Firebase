<script>
export default {
    methods: {
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        subscribe() {
            alert("Inscrição realizada com sucesso!");
        }
    }
};
</script>

<template>
    <footer>
        <div class="container">
            <!-- Seção à esquerda -->
            <div class="footer-section left">
                <img src="/src/assets/img/NexusSaude_icon.png" alt="Nexus Saúde Logo" class="footer-logo">
                <p><i class="bi bi-telephone"></i> (81) 3661-0000</p>
                <p><i class="bi bi-envelope"></i> nexussaude2024@gmail.com</p>
                <p><i class="bi bi-geo-alt"></i> Rua das Palmeiras, 123 - Centro, Palmares - PE</p>
            </div>

            <!-- Seção ao centro -->
            <div class="footer-section center">
                <h5>Links úteis</h5>
                <ul class="nav-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/sobre">Quem Somos</a></li>
                    <li><a href="/contato">Fale Conosco</a></li>
                    <!-- <li><a href="#">Política de Privacidade</a></li>
                    <li><a href="#">Termos de Uso</a></li>
                    <li><a href="#">Mapa do Site</a></li>
                    <li><a href="#">FAQ</a></li> -->
                </ul>
            </div>

            <!-- Seção à direita -->
            <div class="footer-section right">
                <h5>Acompanhe nossas redes</h5>
                <div class="social-media">
                    <a href="#"><i class="bi bi-instagram"></i></a>
                    <a href="#"><i class="bi bi-linkedin"></i></a>
                    <a href="#"><i class="bi bi-whatsapp"></i></a>
                    <a href="#"><i class="bi bi-x"></i></a>
                </div>
            </div>
        </div>

        <div class="back-to-top">
            <a href="#" @click.prevent="scrollToTop"><i class="bi bi-arrow-up-circle"></i> Voltar ao topo</a>
        </div>

        <div class="text-center mt-3 copyright">
            © 2024 Nexus Saúde. Todos os direitos reservados.
        </div>
    </footer>
</template>



<style scoped>
footer {
    background-color: #1a1a3c;
    color: #fff;
    padding: 40px 20px;
    font-size: 0.9rem;
    text-align: center;
}

/* Distribui os itens em três colunas */
.container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    text-align: left;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: auto;
}

/* Define tamanhos fixos para melhor alinhamento */
.footer-section {
    flex: 1;
    min-width: 250px;
    max-width: 350px;
    padding: 10px;
}

/* Mantém a logo no tamanho original */
.footer-logo {
    width: auto;
    max-width: 80px;
    /* Tamanho original corrigido */
    height: auto;
    margin-bottom: 15px;
}

/* Centraliza a seção do meio */
.center {
    text-align: center;
}

.left {
    text-align: left;
}

.right {
    text-align: right;
}

/* Ajusta a lista de links */
.nav-links {
    list-style: none;
    padding: 0;
}

.nav-links li {
    margin-bottom: 10px;
}

.nav-links li a {
    color: #fff;
    text-decoration: none;
    transition: all 0.3s ease;
}

.nav-links li a:hover {
    text-decoration: underline;
    color: #00ff9d;
}

/* Ícones das redes sociais */
.social-media {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 10px;
}

.social-media a {
    color: #00ff9d;
    font-size: 1.8rem;
    transition: transform 0.3s ease, color 0.3s ease;
}

.social-media a:hover {
    transform: scale(1.2);
    color: #fff;
}

/* Voltar ao topo */
.back-to-top {
    margin-top: 20px;
}

.back-to-top a {
    color: #00ff9d;
    text-decoration: none;
    font-size: 1.2rem;
}

.back-to-top a:hover {
    color: #fff;
    text-decoration: underline;
}

.copyright {
    font-size: 0.8rem;
    margin-top: 20px;
}

/* Responsividade */
@media (max-width: 992px) {
    .container {
        flex-direction: column;
        text-align: center;
    }

    .footer-section {
        max-width: 100%;
    }

    .social-media {
        justify-content: center;
    }
}
</style>
