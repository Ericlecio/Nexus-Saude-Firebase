<template>
  <div>
    <Navbar />
    <div class="container py-5">
      <!-- Botão de Voltar -->
      <button class="btn-voltar" @click="voltarPagina">
        <i class="fas fa-arrow-left me-2"></i> Voltar
      </button>

      <!-- Nome do Médico com Espaçamento -->
      <h1 class="text-center mb-4 text-primary" style="margin-top: 50px;">
        {{ medico ? medico.nomeCompleto : "Carregando..." }}
      </h1>

      <!-- Informações do Médico -->
      <div v-if="medico">
        <!-- Card de Informações -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-info-circle me-2" style="color: #007bff;"></i>
              <strong>Informações</strong>
            </h5>
            <p>
              <i class="fas fa-user-md me-2" style="color: #28a745;"></i>
              <strong>Especialidade:</strong> {{ medico.especialidade }}
            </p>
            <p>
              <i class="fas fa-id-badge me-2" style="color: #17a2b8;"></i>
              <strong>CRM:</strong> {{ medico.crm }}
            </p>
            <p>
              <i class="fas fa-dollar-sign me-2" style="color: #ffc107;"></i>
              <strong>Preço da Consulta:</strong> R$ {{ medico.valorConsulta }}
            </p>
            <p>
              <i class="fas fa-phone me-2" style="color: #28a745;"></i>
              <strong>Contato:</strong> {{ medico.telefoneConsultorio }}
            </p>
          </div>
        </div>

        <!-- Experiência -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-briefcase me-2" style="color: #6c757d;"></i>
              <strong>Experiência</strong>
            </h5>
            <p>{{ medico.experiencia || "Nenhuma informação disponível." }}</p>
          </div>
        </div>

        <!-- Horários de Atendimento -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-clock me-2" style="color: #007bff;"></i>
              <strong>Horários de Atendimento</strong>
            </h5>
            <ul class="list-unstyled">
              <li v-for="dia in diasOrdenados" :key="dia">
                <strong>{{ formatDia(dia) }}:</strong>
                {{ medico.diasAtendimento[dia]?.inicio || "--" }} -
                {{ medico.diasAtendimento[dia]?.fim || "--" }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Carregando -->
      <div v-else class="text-center mt-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import DAOService from "@/services/DAOService";

export default {
  name: "MedicoDetails",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      medico: null,
      diasOrdenados: ["segunda", "terca", "quarta", "quinta", "sexta", "sabado"],
    };
  },
  methods: {
    async fetchMedicoDetails() {
      try {
        const usuarioId = this.$route.params.id;

        const usuariosDao = new DAOService("usuarios");
        const usuarioData = await usuariosDao.get(usuarioId);

        if (usuarioData.tipo === "medico") {
          const medicosDao = new DAOService("medicos");
          const medicoDetails = await medicosDao.search("usuarioId", usuarioId);

          this.medico = { ...usuarioData, ...medicoDetails[0] };
        } else {
          console.error("Usuário não é um médico.");
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do médico: ", error);
      }
    },
    formatDia(dia) {
      const dias = {
        segunda: "Segunda-feira",
        terca: "Terça-feira",
        quarta: "Quarta-feira",
        quinta: "Quinta-feira",
        sexta: "Sexta-feira",
        sabado: "Sábado",
      };
      return dias[dia] || dia;
    },
    voltarPagina() {
      if (window.history.length > 1) {
        // Se houver histórico, volta para a página anterior
        this.$router.go(-1);
      } else {
        // Se não houver histórico, redireciona para a rota desejada
        this.$router.push("/");
      }
    },
  },
  mounted() {
    this.fetchMedicoDetails();
  },
};
</script>

<style scoped>
.container {
  max-width: 90%;
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
}

.card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.2rem;
}

.list-unstyled li {
  margin-bottom: 10px;
  font-size: 1rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.btn-voltar {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.btn-voltar:hover {
  background-color: #0056b3;
}
</style>

<style scoped>
.container {
  max-width: 90%;
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
}

.card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.2rem;
}

.list-unstyled li {
  margin-bottom: 10px;
  font-size: 1rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.btn-voltar {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: 5%;
}

.btn-voltar:hover {
  background-color: #0056b3;
}
</style>
