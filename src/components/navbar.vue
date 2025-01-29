<template>
  <nav class="navbar navbar-expand-lg" :class="{ scrolled: isScrolled }">
    <div class="container">
      <a class="navbar-brand" href="#">
        <img
          src="/src/assets/img/NexusSaude_horizontal.png"
          alt="Nexus Saúde"
          class="logo"
        />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        @click="toggleCollapse"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse"
        :class="{ show: !isCollapsed }"
        id="navbarNav"
      >
        <ul class="navbar-nav ms-auto">
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
        <div class="dropdown ms-3">
          <a
            href="#"
            class="d-flex align-items-center text-dark text-decoration-none"
            data-bs-toggle="dropdown"
          >
            <i class="bi bi-person-circle me-2"></i>
            <span v-if="user">{{ user.nomeCompleto }}</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li v-if="!user">
              <a class="dropdown-item" href="/login">Login</a>
            </li>

            <li v-if="user && user.tipo === 'paciente'">
              <a class="dropdown-item" href="/perfilPaciente">Meu Perfil</a>
              <a class="dropdown-item" href="/consultasAgendadas"
                >Minhas Consultas</a
              >
            </li>

            <li v-if="user && user.tipo === 'medico'">
              <a class="dropdown-item" href="/perfilMedico">Meu Perfil</a>
              <a class="dropdown-item" href="/agendaMedica">Minha Agenda</a>
            </li>

            <li v-if="user">
              <a class="dropdown-item" href="#" @click="logout">Sair</a>
            </li>
            <li>
              <a class="dropdown-item" href="/medicos">Lista de Médicos</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      isScrolled: false,
      isCollapsed: true,
      user: null,
      userUnsubscribe: null, // Listener para o Firestore
    };
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    logout() {
      localStorage.removeItem("user");
      this.user = null;

      // Remove o listener ao deslogar
      if (this.userUnsubscribe) {
        this.userUnsubscribe();
      }

      this.$router.push("/login");
    },
    startListener() {
      const db = getFirestore();
      const auth = getAuth();

      // Monitora o estado de autenticação (Firebase Authentication)
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const storedUser = localStorage.getItem("user");

          // Verifica se há informações armazenadas no localStorage
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            this.user = userData;

            // Define a coleção e o ID de referência
            const collectionName =
              userData.tipo === "medico" ? "medicos" : "pacientes";
            const userId =
              userData.tipo === "medico" ? userData.id : firebaseUser.uid;

            const userRef = doc(db, collectionName, userId);

            // Configura o listener em tempo real
            this.userUnsubscribe = onSnapshot(
              userRef,
              (docSnapshot) => {
                if (docSnapshot.exists()) {
                  // Atualiza os dados do usuário na navbar
                  this.user = { ...this.user, ...docSnapshot.data() };
                  localStorage.setItem("user", JSON.stringify(this.user));
                } else {
                  // Desloga automaticamente se o documento for excluído
                  const userTypeMessage =
                    userData.tipo === "medico" ? "médica" : "paciente";
                  alert(
                    `Sua conta de ${userTypeMessage} foi removida do sistema.`
                  );
                  this.logout();
                }
              },
              (error) => {
                console.error(
                  `Erro ao monitorar os dados do ${userData.tipo}:`,
                  error
                );
                alert(
                  "Erro ao carregar as informações do usuário. Tente novamente mais tarde."
                );
                this.logout();
              }
            );
          }
        } else {
          // Se o usuário não estiver autenticado, desloga
          this.logout();
        }
      });
    },
  },
  mounted() {
    this.startListener(); // Configura o listener ao montar o componente
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    if (this.userUnsubscribe) {
      this.userUnsubscribe(); // Remove o listener ao desmontar o componente
    }
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped>
/* Navbar geral */
.navbar {
  background: transparent;
  color: white;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  transition: background-color 0.4s ease, box-shadow 0.4s ease,
    padding 0.3s ease;
  padding: 20px 0;
}

/* Quando rolar a página */
.navbar.scrolled {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* Navbar em telas menores */
@media (max-width: 991px) {
  .navbar {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
}

.navbar-brand .logo {
  height: 50px;
  transition: all 0.3s ease-in-out;
}

.navbar-nav .nav-link {
  color: #2c3e50;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 12px 18px;
  border-radius: 30px;
  transition: all 0.3s ease-in-out;
}

.navbar-nav .nav-link:hover,
.navbar-nav .nav-link.active {
  color: #53ba83;
  text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.bi-person-circle {
  color: #53ba83;
  font-size: 1.8rem;
  transition: color 0.3s ease;
}

.bi-person-circle:hover {
  color: #000524;
}

/* Menu suspenso */
.dropdown-menu {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: none;
  padding: 12px 16px;
  animation: fadeIn 0.4s ease-in-out;
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
  padding: 10px 15px;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.dropdown-menu .dropdown-item:hover {
  background-color: #f1f1f1;
  transform: scale(1.05);
}

/* Botão de toggle */
.navbar-toggler {
  border: none;
  outline: none;
  transition: transform 0.3s ease-in-out;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.navbar-toggler-icon {
  transition: 0.3s ease;
}

.navbar-toggler.collapsed .navbar-toggler-icon {
  transform: rotate(45deg);
}
</style>
