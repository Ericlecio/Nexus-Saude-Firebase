<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'LoginScreen',
  components: {
    Navbar,
    Footer
  },

  methods: {
    togglePassword() {
      const passwordInput = document.getElementById('password');
      const toggleIcon = document.querySelector('.toggle-password');
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
      }
    }
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
            <div class="input-group">
              <i class="fas fa-user"></i>
              <input type="email" placeholder="E-mail" required />
            </div>
            <div class="input-group">
              <i class="fas fa-lock"></i>
              <input id="password" type="password" placeholder="Senha" required />
              <i class="fas fa-eye toggle-password" @click="togglePassword"></i>
            </div>
            <div class="options">
              <label>
                <input type="checkbox" /> Lembrar Sempre
              </label>
              <a href="#">Esqueceu a Senha</a>
            </div>
            <div class="btn-container">
              <button type="submit" class="btn">Entrar</button>
            </div>
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
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html,
  body {
    font-family: Arial, sans-serif;
    height: 100%;
    background: url('img/img_fundo.png') no-repeat center center fixed;
    background-size: cover;
  }
  
  .main-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-container {
    display: flex;
    width: 80%;
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
    margin-bottom: 30px;
  }
  
  h2 {
    margin-bottom: 10px;
    font-size: 24px;
    color:white;
  }
  
  h1 {
    margin-bottom: 30px;
    font-size: 32px;
    color:white;
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
  
  .input-group .fas.fa-user {
    left: 10px;
  }
  
  .input-group .fas.fa-lock {
    left: 10px;
  }
  
  .input-group .toggle-password {
    right: 10px;
    cursor: pointer;
  }
  
  .input-group input {
    width: 100%;
    padding: 15px 15px 15px 40px;
    border: none;
    border-radius: 8px;
    background-color: #fff;
    font-size: 16px;
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
  