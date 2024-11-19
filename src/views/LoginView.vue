<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "LoginScreen",
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
  },
};
</script>

<template>
  <Navbar />
  <div class="main-container">
    <div class="login-container">
      <div class="login-form">
        <div class="header">
          <h2>Bem-Vindo</h2>
          <h1>Nexus Saúde</h1>
        </div>
        <form>
          <div class="input-group">
            <i class="fas fa-user"></i>
            <input type="email" placeholder="E-mail" required class="input-field" />
          </div>
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input :type="showPassword ? 'text' : 'password'" placeholder="Senha" required class="input-field" />
            <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" @click="togglePassword"></i>
          </div>
          <div class="options">
            <label> <input type="checkbox" /> Lembrar Sempre </label>
            <a href="#">Esqueceu a Senha</a>
          </div>
          <div class="btn-container">
            <button type="submit" class="btn">Entrar</button>
          </div>
          <a href="#" class="create-account">Criar Conta</a>
          <div class="social-login">
            <p>Ou entre com:</p>
            <button class="social-btn google-btn">
              <i class="fab fa-google"></i> Google
            </button>
            <button class="social-btn facebook-btn">
              <i class="fab fa-facebook-f"></i> Facebook
            </button>
          </div>
        </form>
      </div>
      <div class="logo">
        <img src="@/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde" />
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
/* Estilos gerais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: Arial, sans-serif;
  height: 100%;
  background: url("@/assets/img/img_fundo.png") no-repeat center center fixed;
  background-size: cover;
}

/* Animação no carregamento */
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
  height: 88%;
  max-width: 900px;
  background-color: #000524;
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
}

.input-group i {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #ccc;
}

.input-group .fas.fa-user,
.input-group .fas.fa-lock {
  left: 10px;
}

input {
  border-radius: 10px !important;
}

.input-group .fas {
  right: 10px;
  cursor: pointer;
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
}

.options a {
  color: white;
  text-decoration: none;
}

.options a:hover {
  text-decoration: underline;
}

.options label {
  color: white;
  font-size: 14px;
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
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn:hover {
  background-color: #53ba83;
  color: white;
}

.social-login {
  text-align: center;
  margin-top: 20px;
}

.social-login p {
  color: white;
  font-size: 14px;
}

.social-btn {
  display: inline-block;
  margin: 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.google-btn {
  background-color: #db4437;
  color: white;
}

.google-btn:hover {
  background-color: #c33d2f;
  transform: scale(1.05);
}

.facebook-btn {
  background-color: #3b5998;
  color: white;
}

.facebook-btn:hover {
  background-color: #334b87;
  transform: scale(1.05);
}

.create-account {
  display: block;
  text-align: center;
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.1s ease, color 0.1s ease;
  padding: 1px;
  border-radius: 20px;
}

.create-account:hover {
  background-color: #53ba83;
  color: white;
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
