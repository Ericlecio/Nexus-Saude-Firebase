<template>
  <div class="div-principal">
    <Navbar />
    <div class="container my-5">
      <button class="btn-voltar" @click="voltarPagina">
        <i class="fas fa-arrow-left me-2"></i> Voltar
      </button>
      <h2 class="text-success text-center mb-10">Meus Agendamentos</h2>

      <div v-if="carregando" class="text-center">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-2">Carregando seus agendamentos...</p>
      </div>

      <div v-else>
        <table class="table table-hover" v-if="agendamentos.length">
          <thead>
            <tr>
              <th>Especialidade</th>
              <th>Nome do Profissional</th>
              <th>Local</th>
              <th>Data e Hora</th>
              <th>Telefone do Paciente</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(agendamento, index) in agendamentos" :key="agendamento.id">
              <td>{{ agendamento.especialidade }}</td>
              <td>{{ agendamento.medicoNome || 'Nome não disponível' }}</td>
              <td>{{ agendamento.local }}</td>
              <td>{{ agendamento.data }}</td>
              <td>{{ agendamento.pacienteTelefone }}</td>
              <td>
                <button class="btn btn-success btn-sm me-2" @click="remarcarAgendamento(index)">Remarcar</button>
                <button class="btn btn-danger btn-sm" @click="cancelarAgendamento(index)">Cancelar</button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else class="text-center text-muted">Nenhum agendamento encontrado.</p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "MinhasConsultas",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      agendamentos: [],
      carregando: true,
      pacienteLogado: null,
    };
  },
  methods: {
    async carregarAgendamentos() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || user.tipo !== "paciente" || !user.usuarioId) {
          console.warn("Nenhum paciente logado encontrado. Redirecionando...");
          alert("Apenas pacientes podem acessar esta página. Faça login.");
          this.$router.push("/login");
          return;
        }

        this.pacienteLogado = user;
        console.log("Paciente logado encontrado:", this.pacienteLogado);

        const db = getFirestore();
        const agendamentosRef = collection(db, "agendamentos");

        // Busca os agendamentos do paciente logado
        const q = query(agendamentosRef, where("pacienteId", "==", this.pacienteLogado.usuarioId));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          console.warn("Nenhum agendamento encontrado para este paciente.");
          this.agendamentos = [];
        } else {
          this.agendamentos = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
        }

        console.log("Agendamentos carregados com sucesso:", this.agendamentos);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        alert("Erro ao carregar agendamentos. Tente novamente mais tarde.");
      } finally {
        this.carregando = false;
      }
    },


    async cancelarAgendamento(index) {
      try {
        const agendamento = this.agendamentos[index];
        const confirmar = confirm(`Deseja realmente cancelar o agendamento com ${agendamento.medicoNome}?`);

        if (!confirmar) return;

        const db = getFirestore();
        await deleteDoc(doc(db, "agendamentos", agendamento.id));

        this.agendamentos.splice(index, 1);
        alert("Agendamento cancelado com sucesso.");
      } catch (error) {
        console.error("Erro ao cancelar agendamento:", error);
        alert("Erro ao cancelar agendamento. Tente novamente.");
      }
    },

    voltarPagina() {
      this.$router.push("/");
    },
  },
  async mounted() {
    await this.carregarAgendamentos();
  },
};
</script>



<style scoped>
.div-principal {
  margin-top: 5%;
}

.container {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 26px;
  font-weight: 600;
  color: #28a745;
  margin-bottom: 30px;
}

table {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

th {
  background-color: #007bff;
  color: white;
  text-align: center;
}

td {
  text-align: center;
  vertical-align: middle;
  padding: 10px;
}

.btn {
  border-radius: 30px;
  font-size: 14px;
  padding: 8px 18px;
  transition: background-color 0.3s ease;
}

.btn-success {
  background-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.text-muted {
  color: #6c757d;
  font-size: 16px;
}

.btn-voltar {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 20px;
}

.btn-voltar:hover {
  background-color: #0056b3;
}
</style>
