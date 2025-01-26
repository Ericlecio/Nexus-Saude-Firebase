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
            <div class="footer-section logo">
                <img src="/src/assets/img/NexusSaude_icon.png" alt="Nexus Saúde Logo">
                <p><i class="bi bi-telephone"></i> 3661-0000</p>
                <p><i class="bi bi-envelope"></i> contato@nexussaude.com.br</p>
                <p><i class="bi bi-geo-alt"></i> Rua Exemplo, 123 - Cidade, Estado</p>
            </div>

            <div class="footer-section">
                <h5>Links úteis</h5>
                <ul class="nav-links">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Quem Somos</a></li>
                    <li><a href="#">Fale Conosco</a></li>
                    <li><a href="#">Política de Privacidade</a></li>
                    <li><a href="#">Termos de Uso</a></li>
                    <li><a href="#">Mapa do Site</a></li>
                    <li><a href="#">FAQ</a></li>
                </ul>
            </div>

            <div class="footer-section social-section">
                <h5>Acompanhe nossas redes</h5>
                <div class="social-media">
                    <a href="#"><i class="bi bi-instagram"></i></a>
                    <a href="#"><i class="bi bi-linkedin"></i></a>
                    <a href="#"><i class="bi bi-whatsapp"></i></a>
                    <a href="#"><i class="bi bi-x"></i></a>
                </div>
            </div>

            <div class="footer-section newsletter">
                <h5>Receba novidades</h5>
                <form @submit.prevent="subscribe">
                    <input type="email" placeholder="Seu e-mail" required>
                    <button type="submit">Inscrever-se</button>
                </form>
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

.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
}

.footer-section {
    max-width: 300px;
    text-align: center;
}

.logo img {
    width: 80px;
    margin-bottom: 15px;
}

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

.social-media {
    display: flex;
    gap: 15px;
    justify-content: center;
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

.newsletter input {
    padding: 10px;
    width: 100%;
    max-width: 250px;
    border: none;
    border-radius: 5px;
    margin-bottom: 10px;
}

.newsletter button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #00ff9d;
    color: #1a1a3c;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.newsletter button:hover {
    background-color: #fff;
    color: #1a1a3c;
}

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
@media (max-width: 768px) {
    .container {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .footer-section {
        max-width: 100%;
    }

    .newsletter input,
    .newsletter button {
        width: 100%;
    }

    .social-media {
        gap: 10px;
    }

    .nav-links li {
        margin-bottom: 5px;
    }
}

@media (max-width: 480px) {
    footer {
        font-size: 0.8rem;
    }

    .logo img {
        width: 60px;
    }

    .social-media a {
        font-size: 1.5rem;
    }

    .back-to-top a {
        font-size: 1rem;
    }
}
</style>
