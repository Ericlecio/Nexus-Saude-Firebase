<template>
  <nav class="navbar navbar-expand-lg fixed-top" :class="{ scrolled: isScrolled }">
    <div class="container">
      <a class="navbar-brand" href="/">
        <img src="/src/assets/img/NexusSaude_horizontal.png" alt="Nexus Saúde" class="logo" />
      </a>
      <button class="navbar-toggler" type="button" @click="toggleCollapse">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: !isCollapsed }">
        <!-- 🔹 Menu centralizado -->
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <a class="nav-link" href="/">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/sobre">Quem Somos</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/contato">Fale Conosco</a>
          </li>
        </ul>

        <!-- 🔹 Perfil do usuário alinhado à direita -->
        <div class="dropdown ms-3">
          <a href="#" class="d-flex align-items-center perfil-link" data-bs-toggle="dropdown">
            <i class="bi bi-person-circle"></i>
            <span v-if="user">{{ user.nomeCompleto }}</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end animate-dropdown">
            <li v-if="!user">
              <a class="dropdown-item" href="/login">Login</a>
            </li>

            <li v-if="user && user.tipo === 'paciente'">
              <a class="dropdown-item" href="/perfilPaciente">Meu Perfil</a>
              <a class="dropdown-item" href="/consultasAgendadas">Minhas Consultas</a>
            </li>

            <li v-if="user && user.tipo === 'medico'">
              <a class="dropdown-item" href="/perfilMedico">Meu Perfil</a>
              <a class="dropdown-item" href="/agendaMedica">Minha Agenda</a>
            </li>

            <li v-if="user">
              <a class="dropdown-item logout-btn" href="#" @click="logout">Sair</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default {
  data() {
    return {
      isScrolled: false,
      isCollapsed: true,
      user: null,
    };
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    async logout() {
      const auth = getAuth();
      await signOut(auth);
      sessionStorage.removeItem("user");
      this.user = null;
      this.$router.push("/login").then(() => window.location.reload());
    },
    async verificarUsuario() {
      const auth = getAuth();
      const db = getFirestore();
      const storedUser = sessionStorage.getItem("user");

      if (storedUser) {
        this.user = JSON.parse(storedUser);
        return;
      }

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
              this.user = { id: firebaseUser.uid, ...pacienteSnap.data(), tipo: "paciente" };
              sessionStorage.setItem("user", JSON.stringify(this.user));
            } else if (medicoSnap.exists()) {
              this.user = { id: firebaseUser.uid, ...medicoSnap.data(), tipo: "medico" };
              sessionStorage.setItem("user", JSON.stringify(this.user));
            } else {
              this.user = null;
              await signOut(auth);
            }
          } catch (error) {
            console.error("Erro ao verificar usuário na Navbar:", error);
            this.user = null;
          }
        } else {
          this.user = null;
        }
      });
    },
  },
  mounted() {
    this.verificarUsuario();
    window.addEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
/* Navbar geral */
.navbar {
  background: transparent;
  transition: all 0.4s ease-in-out;
  padding: 15px 0;
}

/* Navbar ao rolar a página */
.navbar.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  padding: 10px 0;
}

/* Responsividade */
@media (max-width: 991px) {
  .navbar {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
}

/* Logo */
.navbar-brand .logo {
  height: 50px;
  transition: all 0.3s ease-in-out;
}

/* Links da navbar */
.navbar-nav .nav-link {
  color: #000;
  font-weight: 600;
  text-transform: uppercase;
  padding: 10px 15px;
  border-radius: 30px;
  transition: all 0.3s ease-in-out;
}

.navbar-nav .nav-link:hover {
  color: #53ba83;
  font-weight: bold;
  text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

/* Ícone de usuário */
.bi-person-circle {
  font-size: 1.8rem;
  color: #53ba83;
  transition: all 0.3s ease-in-out;
}

.perfil-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: black;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease-in-out;
}

.perfil-link:hover .bi-person-circle {
  color: #1565C0;
}

/* Menu suspenso */
.dropdown-menu {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 8px;
  border: none;
  padding: 10px 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-menu .dropdown-item {
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease-in-out;
}

.dropdown-menu .dropdown-item:hover {
  background: #f1f1f1;
  transform: scale(1.05);
}

/* Botão de logout */
.logout-btn {
  color: red !important;
  font-weight: bold;
}

/* Botão de toggle */
.navbar-toggler {
  border: none;
  transition: all 0.3s ease-in-out;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.navbar-toggler-icon {
  transition: 0.3s ease-in-out;
}

.navbar-toggler:hover .navbar-toggler-icon {
  transform: rotate(90deg);
}
</style>
