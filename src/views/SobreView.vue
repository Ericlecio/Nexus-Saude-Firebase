<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: {
    Navbar,
    Footer
  }
};
</script>

<template>
  <div>
    <Navbar />

    <!-- Banner Quem Somos -->
    <section class="banner" style="background-image: url('/img/quem_somos_fundo.jpg')">
      <div class="text-center">
        <h1>Quem Somos</h1>
        <p>Comprometidos com a saúde e o bem-estar dos nossos pacientes</p>
      </div>
    </section>

    <!-- Nossa Missão -->
    <section class="container my-5">
      <h2 class="section-title text-center">Nossa Missão</h2>
      <p class="text-center">
        A Nexus Saúde é uma clínica comprometida em oferecer atendimento médico de qualidade, com profissionais experientes e dedicados, buscando sempre proporcionar bem-estar e segurança aos nossos pacientes. Nosso foco é proporcionar um atendimento humanizado e eficiente para todas as idades.
      </p>
    </section>

    <!-- Nossa História -->
    <section class="container my-5">
      <h2 class="section-title text-center">Nossa História</h2>
      <div class="row">
        <div class="col-md-6">
          <p>
            Fundada em 2010, a Nexus Saúde tem se destacado pelo compromisso com a excelência no atendimento médico. Ao longo dos anos, nossa clínica se consolidou como referência em diversas especialidades médicas, oferecendo sempre um atendimento rápido e de qualidade.
          </p>
        </div>
        <div class="col-md-6">
          <img src="/src/assets/img/clinico_geral.webp" class="img-fluid rounded" alt="Nossa História" />
        </div>
      </div>
    </section>

    <!-- Valores -->
    <section class="container my-5">
      <h2 class="section-title text-center">Nossos Valores</h2>
      <ul>
        <li>Excelência no atendimento</li>
        <li>Empatia e humanização no cuidado</li>
        <li>Compromisso com a saúde e bem-estar dos nossos pacientes</li>
        <li>Inovação no uso de tecnologias médicas</li>
        <li>Responsabilidade e ética profissional</li>
      </ul>
    </section>

    <Footer />
  </div>
</template>

<style scoped>
.banner {
  background-size: cover;
  background-position: center;
  height: 60vh;
  color: #fff;
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

.container {
  padding: 40px 0;
}

.container p {
  font-size: 1rem;
  color: #555;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}
</style>
