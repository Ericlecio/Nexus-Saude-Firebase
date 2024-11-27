<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default {
  data() {
    return {
      name: '',
      email: '',
      message: ''
    };
  },
  methods: {
    handleSubmit() {
      alert('Mensagem enviada com sucesso!');
      // Aqui você pode adicionar lógica para enviar o formulário para o backend
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

    <!-- Banner Fale Conosco -->
    <section class="banner" style="background-image: url('/img/fale_conosco_fundo.jpg')">
      <div class="text-center">
        <h1>Fale Conosco</h1>
        <p>Estamos aqui para ajudar você!</p>
      </div>
    </section>

    <!-- Formulário de Contato -->
    <section class="container my-5">
      <h2 class="section-title text-center">Entre em Contato</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="name" class="form-label">Seu Nome</label>
          <input v-model="name" type="text" class="form-control" id="name" placeholder="Digite seu nome" required />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Seu E-mail</label>
          <input v-model="email" type="email" class="form-control" id="email" placeholder="Digite seu e-mail" required />
        </div>
        <div class="mb-3">
          <label for="message" class="form-label">Sua Mensagem</label>
          <textarea v-model="message" class="form-control" id="message" rows="4" placeholder="Digite sua mensagem" required></textarea>
        </div>
        <button type="submit" class="btn btn-success">Enviar Mensagem</button>
      </form>
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

form .form-control {
  border-radius: 8px;
}

button {
  margin-top: 20px;
}
</style>