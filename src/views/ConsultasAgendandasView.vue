<template>
  <div class="div-principal">
    <Navbar />
    <div class="container my-5">
      <!-- Título -->
      <h2 class="text-success text-center mb-10">Meus Agendamentos</h2>

      <!-- Indicador de carregamento -->
      <div v-if="carregando" class="text-center">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-2">Carregando seus agendamentos...</p>
      </div>

      <!-- Lista de agendamentos -->
      <div v-else>
        <table class="table table-hover" v-if="agendamentos.length">
          <thead>
            <tr>
              <th>Especialidade</th>
              <th>Nome do Profissional</th>
              <th>Local</th>
              <th>Data e Hora</th>
              <th>Nome do Paciente</th>
              <th>Telefone do Paciente</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(agendamento, index) in agendamentos" :key="agendamento.id">
              <td>{{ agendamento.especialidade }}</td>
              <td>{{ agendamento.medicoNome}}</td>
              <td>{{ agendamento.local }}</td>
              <td>{{ agendamento.data }}</td>
              <td>{{ agendamento.pacienteNome }}</td>
              <td>{{ agendamento.pacienteTelefone }}</td>
              <td>
                <button class="btn btn-success btn-sm me-2" @click="remarcarAgendamento(index)">Remarcar</button>
                <button class="btn btn-danger btn-sm" @click="cancelarAgendamento(index)">Cancelar</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Caso não haja agendamentos -->
        <p v-else class="text-center text-muted">Nenhum agendamento encontrado.</p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/firebase"; // Importa o Firestore configurado
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
      agendamentos: [], // Lista de agendamentos carregada do Firestore
      carregando: true, // Indicador de carregamento
    };
  },
  methods: {
    // Carregar agendamentos do Firestore
    async carregarAgendamentos() {
      try {
        const agendamentosRef = collection(firestore, "agendamentos"); // Nome da coleção no Firestore
        const snapshot = await getDocs(agendamentosRef);
        this.agendamentos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        alert("Erro ao carregar agendamentos. Tente novamente mais tarde.");
      } finally {
        this.carregando = false; // Finaliza o carregamento
      }
    },

    // Remarcar agendamento
    async remarcarAgendamento(index) {
      const novaDataHora = prompt("Informe a nova data e hora no formato (YYYY-MM-DD HH:mm):");
      if (novaDataHora) {
        const agendamento = this.agendamentos[index];
        const agendamentoRef = doc(firestore, "agendamentos", agendamento.id); // Use "agendamentos" aqui
        try {
          await updateDoc(agendamentoRef, { dataHora: novaDataHora });
          this.agendamentos[index].dataHora = novaDataHora; // Atualiza localmente
          alert("Agendamento remarcado com sucesso.");
        } catch (error) {
          console.error("Erro ao remarcar agendamento:", error);
          alert("Erro ao remarcar agendamento. Tente novamente.");
        }
      }
    },

    // Cancelar agendamento
    async cancelarAgendamento(index) {
      const agendamento = this.agendamentos[index];
      if (confirm(`Deseja realmente cancelar o agendamento com ${agendamento.profissional}?`)) {
        const agendamentoRef = doc(firestore, "agendamentos", agendamento.id); // Use "agendamentos" aqui também
        try {
          await deleteDoc(agendamentoRef);
          this.agendamentos.splice(index, 1); // Remove o agendamento da lista local
          alert("Agendamento cancelado com sucesso.");
        } catch (error) {
          console.error("Erro ao cancelar agendamento:", error);
          alert("Erro ao cancelar agendamento. Tente novamente.");
        }
      }
    },
  },
  mounted() {
    this.carregarAgendamentos(); // Carrega os agendamentos ao montar o componente
  },
};
</script>

<style scoped>
.div-principal{
  margin-top: 5%
}
.container {
  margin-top: 100%;
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
</style>
