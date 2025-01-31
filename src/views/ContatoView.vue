<template>
  <div>
    <Navbar />

    <!-- Banner Fale Conosco -->
    <section class="banner d-flex justify-content-center align-items-center">
      <div class="text-center banner-content">
        <h1 class="display-4">Fale Conosco</h1>
        <p class="lead">Estamos aqui para ajudar você!</p>
      </div>
    </section>

    <!-- Formulário de Contato -->
    <section class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">
              <h2 class="section-title text-center mb-4">Entre em Contato</h2>
              <form @submit.prevent="handleSubmit">
                <div class="mb-4">
                  <label for="name" class="form-label fw-bold">Seu Nome</label>
                  <input v-model="name" type="text" class="form-control form-control-lg" id="name"
                    placeholder="Digite seu nome" required />
                </div>
                <div class="mb-4">
                  <label for="email" class="form-label fw-bold">Seu E-mail</label>
                  <input v-model="email" type="email" class="form-control form-control-lg" id="email"
                    placeholder="Digite seu e-mail" required />
                </div>
                <div class="mb-4">
                  <label for="message" class="form-label fw-bold">Sua Mensagem</label>
                  <textarea v-model="message" class="form-control form-control-lg" id="message" rows="5"
                    placeholder="Digite sua mensagem" required></textarea>
                </div>
                <div class="text-center">
                  <button type="submit" class="btn btn-success btn-lg px-5 shadow-sm">
                    Enviar Mensagem
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import emailjs from 'emailjs-com';

export default {
  data() {
    return {
      name: '',
      email: '',
      message: ''
    };
  },
  methods: {
    // Função chamada quando o formulário for enviado
    async handleSubmit() {
      try {
        const serviceID = 'service_147efri'; // ID do seu Serviço no EmailJS
        const templateID = 'template_brj1e0g'; // ID do seu Template no EmailJS

        const templateParams = {
          from_name: this.name,
          from_email: this.email,
          message: this.message,
        };

        // Envia o e-mail através do EmailJS
        await emailjs.send(serviceID, templateID, templateParams);

        // Se o envio for bem-sucedido, exibe a mensagem
        alert("E-mail enviado com sucesso!");

        // Limpa os campos do formulário após o envio
        this.name = "";
        this.email = "";
        this.message = "";
      } catch (error) {
        // Exibe um erro se houver algum problema
        console.error("Erro ao enviar o e-mail:", error);
        alert("Houve um erro ao enviar o e-mail. Tente novamente mais tarde.");
      }
    },
  },
  components: {
    Navbar,
    Footer,
  },
};
</script>

<style scoped>
/* Banner com Gradiente e Sombra */
.banner {
  background: linear-gradient(rgb(26, 26, 60),
      rgb(26, 26, 60)),
    url("/src/assets/img/fale_conosco_fundo.jpg") no-repeat center center;
  background-size: cover;
  height: 50vh;
  color: #fff;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
}

.banner-content h1 {
  font-weight: bold;
  letter-spacing: 2px;
}

.banner-content p {
  font-size: 1.2rem;
}

/* Formulário */
.card {
  background-color: #f8f9fa;
  border: none;
}

.form-control {
  border: 1px solid #ced4da;
  border-radius: 8px;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.form-control:focus {
  box-shadow: 0 0 8px rgba(83, 186, 131, 0.7);
  border-color: #53ba83;
  transform: scale(1.02);
}

button {
  transition: all 0.3s ease;
}

button:hover {
  background-color: #3e9c6e;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Títulos */
.section-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  position: relative;
}

.section-title::after {
  content: "";
  width: 50px;
  height: 3px;
  background-color: #53ba83;
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
