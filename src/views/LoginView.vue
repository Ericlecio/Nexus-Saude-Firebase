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
            <input
              type="radio"
              name="userType"
              value="paciente"
              v-model="userType"
            />
            Paciente
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="medico"
              v-model="userType"
            />
            Médico
          </label>
        </div>
        <form @submit.prevent="login">
          <div v-if="userType === 'paciente'">
            <div class="btn-container">
              <button type="button" @click="loginWithGoogle" class="btn-google">
                <i class="fab fa-google"></i> Login com Google
              </button>
            </div>
          </div>
          <div v-if="userType === 'medico'">
            <div class="input-group">
              <i class="fas fa-user"></i>
              <input
                type="email"
                v-model="email"
                placeholder="E-mail"
                required
                class="input-field"
              />
            </div>
            <div class="input-group">
              <i class="fas fa-id-card"></i>
              <input
                type="text"
                v-model="crm"
                placeholder="CRM"
                required
                class="input-field"
                pattern="\d{6}"
                maxlength="6"
                @input="validarCRM"
              />
            </div>

            <div class="input-group">
              <i class="fas fa-lock"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Senha"
                required
                class="input-field"
              />
            </div>
            <div class="show-password" @click="togglePassword">
              <span>{{
                showPassword ? "Ocultar Senha" : "Mostrar Senha"
              }}</span>
            </div>
            <div class="options">
              <label><input type="checkbox" /> Lembrar Sempre</label>
              <a href="#">Esqueceu a Senha?</a>
            </div>
            <div class="btn-container">
              <button type="submit" class="btn">Entrar</button>
            </div>
          </div>
        </form>
      </div>
      <div class="logo-container">
        <img
          src="@/assets/img/NexusSaude_vertical.png"
          alt="Logo Nexus Saúde"
          class="logo"
        />
        <a href="#" class="create-account" @click.prevent="goToCadastro"
          >Criar Conta Médica</a
        >
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default {
  name: "LoginScreen",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      userType: "paciente", // Aba padrão
      email: "",
      crm: "",
      password: "",
      showPassword: false,
    };
  },
  created() {
    const { userType, email, crm, senha } = this.$route.query;

    // Preenche os campos automaticamente com base nos parâmetros da URL
    if (userType) this.userType = userType;
    if (email) this.email = email;
    if (crm) this.crm = crm;
    if (senha) this.password = senha;
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    goToCadastro() {
      this.$router.push("/cadastro");
    },
    async login() {
      if (this.userType === "medico") {
        try {
          const db = getFirestore();
          const q = query(
            collection(db, "medicos"),
            where("email", "==", this.email),
            where("crm", "==", this.crm)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const medicoDoc = querySnapshot.docs[0];
            const medico = medicoDoc.data();

            if (medico.senha === this.password) {
              localStorage.setItem(
                "user",
                JSON.stringify({
                  id: medicoDoc.id,
                  nomeCompleto: medico.nomeCompleto,
                  email: medico.email,
                  crm: medico.crm,
                  tipo: "medico",
                })
              );
              this.$router.push("/");
            } else {
              alert("Senha incorreta!");
            }
          } else {
            alert("Usuário não encontrado!");
          }
        } catch (error) {
          console.error("Erro ao autenticar médico: ", error);
          alert("Erro ao autenticar. Verifique suas credenciais.");
        }
      }
    },
    async loginWithGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const db = getFirestore();

      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userRef = doc(db, "pacientes", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          await setDoc(userRef, {
            nomeCompleto: user.displayName || "Nome não informado",
            email: user.email,
            telefone: user.phoneNumber || "Não informado",
            planoSaude: "",
            usuarioId: user.uid,
            tipo: "paciente",
            dataCadastro: new Date().toISOString(),
          });
        }

        localStorage.setItem(
          "user",
          JSON.stringify({
            nomeCompleto: user.displayName,
            email: user.email,
            usuarioId: user.uid,
            tipo: "paciente",
          })
        );

        this.$router.push("/");
      } catch (error) {
        console.error("Erro de autenticação com Google:", error.message);
        alert("Erro ao autenticar com o Google. Tente novamente.");
      }
    },
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
  font-family: "Poppins", sans-serif;
  height: 100%;
  background: linear-gradient(to right, #000524, #53ba83);
}

.main-container {
  margin-top: 65px;
  /* Adiciona espaçamento entre a navbar e o conteúdo */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  /* Garante que o conteúdo ocupe o espaço correto */
  padding: 20px 20px;
  /* Espaçamento interno para melhor layout */
  animation: fadeIn 1s ease-in-out;
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
  width: 90%;
  max-width: 1100px;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgb(26, 26, 60);
}

.login-form {
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-form header {
  text-align: center;
}

.logo-container {
  flex: 1;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 30px;
  color: #000524;
}

.login-container a {
  color: #000524;
}

.logo {
  max-width: 70%;
  height: auto;
  margin-bottom: 20px;
}

h1 {
  color: #000524;
  font-size: 2.5rem;
  font-weight: bold;
}

h2 {
  color: #53ba83;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.user-type-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.user-type-selector label {
  font-size: 1.1rem;
  color: #000524;
  margin: 0 15px;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-group i {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #999;
}

.input-field {
  width: 100%;
  padding: 15px 15px 15px 50px;
  border-radius: 25px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 1rem;
}

.input-field:focus {
  border-color: #53ba83;
  box-shadow: 0 0 8px rgba(83, 186, 131, 0.5);
}

.show-password {
  text-align: center;
  color: #53ba83;
  cursor: pointer;
}

.options {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.options a {
  color: #000524;
  text-decoration: none;
  font-weight: bold;
}

.options a:hover {
  text-decoration: underline;
}

.btn-container {
  text-align: center;
}

.btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 25px;
  background-color: #53ba83;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn:hover {
  background-color: #000524;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 30px;
  /* Espaçamento inferior aumentado */
}

.header h1,
.header h2 {
  text-align: center;
  width: 100%;
}

.btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 25px;
  background-color: #28a745;
  /* Cor verde */
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #218838;
  /* Tom mais escuro de verde ao passar o mouse */
}

.create-account {
  text-align: center;
  color: white;
  font-size: 1.1rem;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s ease;
}

.create-account:hover {
  text-decoration: underline;
}

.btn-google {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 25px;
  background-color: #db4437;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-google:hover {
  background-color: #b2301b;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column-reverse;
    width: 100%;
    max-width: 450px;
    box-shadow: none;
    border-radius: 10px;
  }

  .login-form {
    padding: 30px;
    text-align: center;
  }

  .logo-container {
    padding: 20px;
    text-align: center;
  }

  .logo {
    max-width: 60%;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  .user-type-selector {
    flex-direction: column;
  }

  .user-type-selector label {
    margin-bottom: 10px;
  }

  .input-group {
    margin-bottom: 15px;
  }

  .input-field {
    padding: 12px 12px 12px 40px;
    font-size: 0.9rem;
  }

  .btn {
    font-size: 1rem;
    padding: 12px;
  }

  .btn-google {
    font-size: 1rem;
    padding: 12px;
  }

  .options {
    flex-direction: column;
    text-align: center;
  }

  .options a {
    margin-top: 10px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
    max-width: 100%;
    box-shadow: none;
  }

  .login-form {
    padding: 20px;
  }

  .logo {
    max-width: 50%;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1rem;
  }

  .btn {
    font-size: 0.9rem;
    padding: 10px;
  }

  .btn-google {
    font-size: 0.9rem;
    padding: 10px;
  }

  .create-account {
    font-size: 1rem;
  }
}
</style>
