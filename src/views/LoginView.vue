<template>
  <Navbar />
  <div class="main-container">
    <div class="login-container">
      <div class="login-form">
        <div class="header">
          <h2 v-if="!isResettingPassword">Bem-Vindo</h2>
          <h1>Nexus Saúde</h1>
        </div>

        <div v-if="!isResettingPassword">
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
              <div class="btn-container">
                <button type="button" @click="loginWithGoogle" class="btn-google">
                  <i class="fab fa-google"></i> Login com Google
                </button>
              </div>
            </div>

            <div v-if="userType === 'medico'">
              <div class="input-group">
                <i class="fas fa-user"></i>
                <input type="email" v-model="email" placeholder="E-mail" required class="input-field" />
              </div>

              <div class="input-group">
                <i class="fas fa-lock"></i>
                <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Senha" required
                  class="input-field" />
              </div>

              <div class="show-password" @click="togglePassword">
                <span>{{ showPassword ? "Ocultar Senha" : "Mostrar Senha" }}</span>
              </div>

              <div class="options">
                <a href="#" @click.prevent="isResettingPassword = true">Esqueceu a Senha?</a>
              </div>

              <div class="btn-container">
                <button type="submit" class="btn">Entrar</button>
              </div>
            </div>
          </form>
        </div>

        <div v-else>
          <h2>Redefinir Senha</h2>
          <p>Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.</p>

          <form @submit.prevent="resetPassword">
            <div class="input-group">
              <i class="fas fa-envelope"></i>
              <input type="email" v-model="email" placeholder="Digite seu e-mail" required class="input-field" />
            </div>

            <div class="btn-container">
              <button type="submit" class="btn">Enviar Link</button>
            </div>

            <p class="back-login">
              <a href="#" @click.prevent="isResettingPassword = false">Voltar para o Login</a>
            </p>
          </form>
        </div>
      </div>

      <div class="logo-container">
        <img src="@/assets/img/NexusSaude_vertical.png" alt="Logo Nexus Saúde" class="logo" />
        <a href="#" class="create-account" @click.prevent="goToCadastro">Criar Conta Médica</a>
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
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

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
      password: "",
      showPassword: false,
      isResettingPassword: false,
    };
  },
  created() {
    this.verificarUsuarioLogado();

    const { userType, email, senha } = this.$route.query;
    if (userType) this.userType = userType;
    if (email) this.email = email;
    if (senha) this.password = senha;
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    goToCadastro() {
      this.$router.push("/cadastro");
    },

    async verificarUsuarioLogado() {
      const auth = getAuth();
      const db = getFirestore();

      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const pacienteRef = doc(db, "pacientes", firebaseUser.uid);
            const medicoRef = doc(db, "medicos", firebaseUser.uid);

            const [pacienteSnap, medicoSnap] = await Promise.all([
              getDoc(pacienteRef),
              getDoc(medicoRef),
            ]);

            if (pacienteSnap.exists()) {
              sessionStorage.setItem("user", JSON.stringify({
                id: firebaseUser.uid,
                ...pacienteSnap.data(),
                tipo: "paciente"
              }));
              this.$router.push("/");
            } else if (medicoSnap.exists()) {
              sessionStorage.setItem("user", JSON.stringify({
                id: firebaseUser.uid,
                ...medicoSnap.data(),
                tipo: "medico"
              }));
              this.$router.push("/");
            } else {
              alert("Usuário não encontrado no banco de dados.");
              await signOut(auth);
            }
          } catch (error) {
          }
        }
      });
    },

    async login() {
      try {
        const auth = getAuth();
        const db = getFirestore();

        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const userId = userCredential.user.uid;

        if (this.userType === "medico") {
          const medicoRef = doc(db, "medicos", userId);
          const medicoSnap = await getDoc(medicoRef);

          if (medicoSnap.exists()) {
            sessionStorage.setItem("user", JSON.stringify({
              id: userId,
              ...medicoSnap.data(),
              tipo: "medico"
            }));
            this.$router.push("/").then(() => window.location.reload());
          } else {
            alert("Dados do médico não encontrados no sistema.");
            await signOut(auth);
          }
        } else if (this.userType === "paciente") {
          const pacienteRef = doc(db, "pacientes", userId);
          const pacienteSnap = await getDoc(pacienteRef);

          if (pacienteSnap.exists()) {
            sessionStorage.setItem("user", JSON.stringify({
              id: userId,
              ...pacienteSnap.data(),
              tipo: "paciente"
            }));
            this.$router.push("/").then(() => window.location.reload());
          } else {
            alert("Dados do paciente não encontrados no sistema.");
            await signOut(auth);
          }
        }
      } catch (error) {
        console.error("Erro ao autenticar usuário: ", error);
        alert("Email ou Senha invalido.");
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
            tipo: "paciente",
            dataCadastro: new Date().toISOString(),
          });
        }

        const pacienteData = await getDoc(userRef);
        sessionStorage.setItem("user", JSON.stringify({
          id: user.uid,
          ...pacienteData.data(),
          tipo: "paciente"
        }));

        this.$router.push("/").then(() => window.location.reload());
      } catch (error) {
        alert("Erro ao autenticar com o Google. Tente novamente.");
      }
    },

    async resetPassword() {
      if (!this.email) {
        alert("Por favor, insira um e-mail válido.");
        return;
      }

      const auth = getAuth();
      try {
        await sendPasswordResetEmail(auth, this.email);
        alert("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
        this.isResettingPassword = false;
      } catch (error) {
        alert("Erro ao enviar o e-mail. Verifique se o e-mail está correto.");
      }
    },
  },
};
</script>