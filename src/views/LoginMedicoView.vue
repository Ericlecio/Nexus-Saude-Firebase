<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'LoginMedico',
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  }
};
</script>

<template>
  <Navbar />
  <div class="main-container">
    <div class="login-container">
      <div class="login-form">
        <div class="header">
          <h2>Bem Vindo</h2>
          <h1>Nexus Saúde</h1>
        </div>
        <form>
          <!-- Campo de E-mail -->
          <div class="input-group">
            <i class="fas fa-user"></i>
            <input type="email" placeholder="E-mail" required class="input-field" />
          </div>
          <!-- Campo de CRM -->
          <div class="input-group">
            <i class="fas fa-id-card"></i>
            <input type="text" placeholder="CRM" required class="input-field"/>
          </div>
          <!-- Campo de Senha -->
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input id="password" type="password" placeholder="Senha" required />
            <i class="fas fa-eye toggle-password" @click="togglePassword"></i>
          </div>
          <!-- Opções de Lembrar e Esquecer Senha -->
          <div class="options">
            <label>
              <input type="checkbox" /> Lembrar Sempre
            </label>
            <a href="#">Esqueceu a Senha</a>
          </div>
          <!-- Botão Entrar -->
          <div class="btn-container">
            <button type="submit" class="btn">Entrar</button>
          </div>
          <!-- Link para Criar Conta -->
          <a href="#" class="create-account">Criar Conta</a>
        </form>
      </div>
      <div class="logo">
        <img src="/src/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde" />
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
/* Reset de margens e paddings */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: Arial, sans-serif;
  height: 100%;
  background: url('@/assets/img/img_fundo.png') no-repeat center center fixed; 
  background-size: cover; /* Faz com que a imagem cubra todo o fundo */
}

.main-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-container {
  display: flex;
  width: 80%;
  max-width: 900px;
  background-color: #000524; /* Fundo escuro do formulário */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.login-form {
  flex: 1;
  padding: 40px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 10px;
}

h2 {
  margin-bottom: 10px;
  font-size: 24px;
  color: white;
}

h1 {
  margin-bottom: 30px;
  font-size: 32px;
  color: white;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  overflow: hidden; /* Garante que o arredondamento funcione */
  border-radius: 10px; /* Arredonda todo o grupo */
  background-color: #fff; /* Fundo branco do campo */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Adiciona um leve sombreamento */
}

.input-group input {
  flex: 1; /* Faz o input ocupar todo o espaço restante */
  padding: 15px;
  border: none;
  border-radius: 0; /* Remove bordas internas */
  background-color: transparent; /* Fundo transparente para usar o do grupo */
  font-size: 16px;
}

.input-group i {
  padding: 0 15px;
  color: #ccc;
}

.input-group .toggle-password {
  cursor: pointer;
  padding-right: 10px;
}

.input-field {
  width: 100%;
  padding: 15px 15px 15px 40px;
  border: none;
  border-radius: 20px;
  background-color: #fff;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-field:focus {
  border: 2px solid #53ba83;
  box-shadow: 0 0 5px #53ba83;
}


.options {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 20px;
  color: #fff;
}

.options a {
  color: white;
  text-decoration: none;
}

.btn-container {
  display: flex;
  justify-content: center;
}

.btn {
  width: 50%;
  padding: 15px;
  border: 2px solid white;
  border-radius: 20px;
  background-color: #000524;
  color: white;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 20px;
}
.btn:hover {
  background-color: #53ba83;
  color: white;
}


.create-account {
  display: block;
  text-align: center;
  color: white;
  text-decoration: none;
  font-size: 16px;
}


.logo {
  flex: 1;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo img {
  max-width: 80%;
  height: auto;
}
</style>
