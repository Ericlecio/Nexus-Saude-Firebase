<script>
export default {
    methods: {
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
};
</script>

<template>
    <footer>
        <div class="container">
            <div class="logo">
                <img src="/src/assets/img/NexusSaude_icon.png" alt="Nexus Saúde Logo">
                <p><i class="bi bi-telephone"></i> 3661-0000</p>
                <p><i class="bi bi-envelope"></i> contato@nexussaude.com.br</p>
                <p><i class="bi bi-geo-alt"></i> Rua Exemplo, 123 - Cidade, Estado</p>
            </div>

            <ul class="nav-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">Quem Somos</a></li>
                <li><a href="#">Fale Conosco</a></li>
                <li><a href="#">Política de Privacidade</a></li>
                <li><a href="#">Termos de Uso</a></li>
                <li><a href="#">Mapa do Site</a></li>
                <li><a href="#">FAQ</a></li>
            </ul>

            <div class="social-section">
                <h5>Acompanhem nossas redes sociais</h5>
                <div class="social-media">
                    <a href="#"><i class="bi bi-instagram"></i></a>
                    <a href="#"><i class="bi bi-linkedin"></i></a>
                    <a href="#"><i class="bi bi-whatsapp"></i></a>
                    <a href="#"><i class="bi bi-x"></i></a>
                </div>
            </div>

            <div class="newsletter">
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
    padding: 20px 0;
    font-size: 0.9rem;
    text-align: center;
}

footer .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: start;
    gap: 20px;
}

footer .logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

footer .logo img {
    width: 50px;
    margin-bottom: 10px;
}

footer .nav-links {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

footer .nav-links li a {
    color: #fff;
    text-decoration: none;
}

footer .nav-links li a:hover {
    text-decoration: underline;
}

footer .social-section h5 {
    font-size: 1rem;
    margin-bottom: 10px;
}

footer .social-media {
    display: flex;
    gap: 15px;
    justify-content: center;
}

footer .social-media a {
    color: #00ff9d;
    font-size: 1.5rem;
    transition: transform 0.3s ease, color 0.3s ease;
}

footer .social-media a:hover {
    transform: scale(1.2);
    color: #fff;
}

footer .newsletter {
    text-align: center;
}

footer .newsletter h5 {
    font-size: 1rem;
    margin-bottom: 10px;
}

footer .newsletter input {
    padding: 5px;
    margin-top: 10px;
    width: 80%;
    max-width: 200px;
    border: none;
    border-radius: 3px;
}

footer .newsletter button {
    padding: 5px 10px;
    margin-top: 10px;
    border: none;
    border-radius: 3px;
    background-color: #00ff9d;
    color: #1a1a3c;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

footer .newsletter button:hover {
    background-color: #fff;
    color: #1a1a3c;
}

footer .back-to-top {
    margin-top: 15px;
}

footer .back-to-top a {
    color: #00ff9d;
    text-decoration: none;
    font-size: 1.2rem;
}

footer .back-to-top a:hover {
    color: #fff;
    text-decoration: underline;
}

footer .copyright {
    font-size: 0.8rem;
    margin-top: 10px;
}
</style>
