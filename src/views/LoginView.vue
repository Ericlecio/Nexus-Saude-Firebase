<template>
  <Navbar />
  <div class="main-container">
    <div class="login-container">
      <div class="login-form">
        <div class="header">
          <h2>Bem-Vindo</h2>
          <h1>Nexus Saúde</h1>
        </div>
        <div class="user-type-selector">
          <label>
            <input type="radio" name="userType" value="paciente" v-model="userType" />
            Paciente
          </label>
          <label>
            <input type="radio" name="userType" value="medico" v-model="userType" />
            Médico
          </label>
        </div>
        <form @submit.prevent="login">
          <div v-if="userType === 'paciente'">
            <div class="input-group">
              <i class="fas fa-user"></i>
              <input type="email" v-model="email" placeholder="E-mail" required class="input-field" />
            </div>
            <div class="input-group">
              <i class="fas fa-lock"></i>
              <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Senha" required class="input-field" />
            </div>
            <div class="show-password" @click="togglePassword">
              <span>{{ showPassword ? 'Ocultar Senha' : 'Mostrar Senha' }}</span>
            </div>
          </div>
          <div v-if="userType === 'medico'">
            <div class="input-group">
              <i class="fas fa-user"></i>
              <input type="email" v-model="email" placeholder="E-mail" required class="input-field" />
            </div>
            <div class="input-group">
              <i class="fas fa-id-card"></i>
              <input type="text" v-model="crm" placeholder="CRM" required class="input-field" />
            </div>
            <div class="input-group">
              <i class="fas fa-lock"></i>
              <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Senha" required class="input-field" />
            </div>
            <div class="show-password" @click="togglePassword">
              <span>{{ showPassword ? 'Ocultar Senha' : 'Mostrar Senha' }}</span>
            </div>
          </div>
          <div class="options">
            <label><input type="checkbox" /> Lembrar Sempre</label>
            <a href="#">Esqueceu a Senha?</a>
          </div>
          <div class="btn-container">
            <button type="submit" class="btn">Entrar</button>
            <button type="button" @click="loginWithGoogle" class="btn-google">Login com Google</button>
          </div>
        </form>
      </div>
      <div class="logo-container">
        <img src="@/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde" />
        <a href="#" class="create-account" @click.prevent="goToCadastro">Criar Conta</a>
      </div>
    </div>
  </div>
  <Footer />
</template>


<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { useRouter } from "vue-router";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"; 

export default {
  name: "LoginScreen",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      userType: "paciente", 
      email: "",
      crm: "", 
      password: "",
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    goToCadastro() {
      this.$router.push("/cadastro");
    },
    login() {
      if (this.userType === "paciente") {
        console.log("Paciente logado com e-mail: ", this.email);
      } else if (this.userType === "medico") {
        console.log("Médico logado com e-mail: ", this.email, " CRM: ", this.crm);
      }
      this.$router.push("/home"); 
    },
    loginWithGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          console.log("Usuário logado com Google:", user.email);
          this.$router.push("/home");
        })
        .catch((error) => {
          console.error("Erro de autenticação com Google:", error.message);
        });
    }
  },
};
</script>


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
  background: url("@/assets/img/img_fundo.png") no-repeat center center fixed;
  background-size: cover;
}

.main-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8% 0 5% 0;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  background-color: white;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 0px;
}

h2 {
  margin-bottom: 10px;
  font-size: 24px;
  color: white;
}

h1 {
  margin-bottom: 10px;
  font-size: 32px;
  color: white;
}

.user-type-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  color: white;
}

.user-type-selector label {
  margin: 0 10px;
}

.input-group {
  position: relative;
  margin-bottom: 15px;
}

.input-group i {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #ccc;
}

.input-group .fas.fa-user,
.input-group .fas.fa-lock,
.input-group .fas.fa-id-card {
  left: 10px;
}

.input-group .fas {
  right: 10px;
  cursor: pointer;
}

.input-field {
  width: 100%;
  padding: 15px 15px 15px 40px;
  border: 2px solid transparent;
  border-radius: 20px;
  background-color: #fff;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-field:focus {
  border-color: #53ba83;
  box-shadow: 0 0 5px #53ba83;
}

.show-password {
  text-align: center;
  margin-top: 5px;
  color: #53ba83;
  cursor: pointer;
}

.show-password span {
  font-size: 14px;
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

.options a:hover {
  text-decoration: underline;
}

.btn-container {
  display: flex;
  justify-content: center;
}

.btn {
  width: 50%;
  padding: 15px;
  border: 2px solid white;
  border-radius: 20px 0 0 20px;
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
  color: rgb(255, 255, 255);
  text-decoration: none;
  background-color: #000524;
  font-size: 16px;
  transition: background-color 0.1s ease, color 0.1s ease;
  padding: 20px;
  border-radius: 20px;
}

.create-account:hover {
  background-color: #53ba83;
  color: white;
}

.logo-container img {
  max-width: 80%;
  height: auto;
  margin-bottom: 20px;
}

.btn-google {
  width: 50%;
  padding: 15px;
  border: 2px solid white;
  border-radius: 0 20px 20px 0;
  background-color:#53ba83;
  color: white;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 20px
}

.btn-google:hover {
  background-color: #000524;
}
</style>
