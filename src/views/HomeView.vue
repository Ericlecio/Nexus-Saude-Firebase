<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default {
  data() {
        return {
            scrolled: false
        };
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
            this.scrolled = window.scrollY > 50;
        }
    },

  components: {
    Navbar,
    Footer
  }
};
</script>

<template>
    <div>
        <Navbar />

        <section class="banner" style="background-image: url('/img/Fundo.png')">
            <div class="text-center">
                <h1>Cuide da sua Saúde com Profissionais de Confiança</h1>
                <p>Consultas rápidas e seguras ao alcance de um clique</p>
                <a href="/Agendamento" class="btn btn-success btn-lg">MARQUE SUA CONSULTA</a>
            </div>
        </section>

        <section class="container my-5">
            <h2 class="section-title text-center">Nossos Serviços</h2>
            <div class="row text-center">
                <div class="col-md-4">
                    <div class="card service-card">
                        <img src="/src/assets/img/clinico_geral.webp" class="card-img-top" alt="Clínica Geral" style="height: 30%; border-radius: 10%;" />
                        <div class="card-body">
                            <h5 class="card-title">Clínica Geral</h5>
                            <p class="card-text">
                                Atendimento completo para diversas especialidades.
                            </p>
                        </div>
                    </div>
                </div>


                <div class="col-md-4">
                    <div class="card service-card">
                        <img src="/src/assets/img/dermatologia.webp" class="card-img-top" alt="Dermatologia" style="height: 30%; border-radius: 10%;" />
                        <div class="card-body">
                            <h5 class="card-title">Dermatologia</h5>
                            <p class="card-text">
                                Tratamentos para uma pele saudável e bonita.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card service-card">
                        <img src="/src/assets/img/cardiologia.webp" class="card-img-top" alt="Cardiologia" style="height: 30%; border-radius: 10%;" />
                        <div class="card-body">
                            <h5 class="card-title">Cardiologia</h5>
                            <p class="card-text">
                                Cuide da saúde do seu coração com nossos especialistas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="testimonial bg-light">
            <div class="container">
                <h2 class="section-title text-center">Depoimentos</h2>
                <div class="row">
                    <div class="col-md-6">
                        <blockquote class="blockquote">
                            <p>
                                "A Nexus Saúde me proporcionou um atendimento rápido e
                                eficiente. Recomendo!"
                            </p>
                            <footer class="blockquote-footer">João da Silva</footer>
                        </blockquote>
                    </div>
                    <div class="col-md-6">
                        <blockquote class="blockquote">
                            <p>
                                "Melhor clínica que já fui, médicos atenciosos e estrutura de
                                primeira."
                            </p>
                            <footer class="blockquote-footer">Maria Oliveira</footer>
                        </blockquote>
                    </div>
                </div>
            </div>
        </section>

        <section class="faq">
            <div class="container">
                <h2 class="section-title text-center">Perguntas Frequentes</h2>
                <div class="accordion" id="faqAccordion">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingOne">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Como faço para agendar uma consulta?
                            </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne">
                            <div class="accordion-body">
                                Para agendar uma consulta, basta clicar no botão "Marque sua
                                Consulta" e escolher o melhor horário.
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingTwo">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Quais convênios são aceitos?
                            </button>
                        </h2>
                        <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo">
                            <div class="accordion-body">
                                Aceitamos diversos convênios. Entre em contato para verificar o
                                seu.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer />
    </div>
</template>

<style scoped>
body,
html {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow-x: hidden;
}

.banner {
    background-size: cover;
    background-position: center;
    height: 100vh;
    color: #0C0636;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.section-title {
    margin-top: 30px;
    font-size: 2rem;
    color: #333;
}

.service-card {
    border: none;
    text-align: center;
    transition: transform 0.2s ease;
}

.service-card:hover {
    transform: scale(1.05);
}

.testimonial,
.faq,
.footer {
    padding: 40px 0;
}
</style>