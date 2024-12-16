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
              <th>Nome do Paciente</th>
              <th>Telefone do Paciente</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(agendamento, index) in agendamentos" :key="agendamento.id">
              <td>{{ agendamento.especialidade }}</td>
              <td>{{ agendamento.nomeDoMedico }}</td> <!-- Alterado para clareza -->
              <td>{{ agendamento.local }}</td>
              <td>{{ agendamento.data }}</td>
              <td>{{ agendamento.nomeDoPaciente }}</td>
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
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
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
    };
  },
  methods: {
    async buscarNomeRealDoMedico(medicoId) {
      try {
        const medicoRef = doc(firestore, "medicos", medicoId);
        const medicoSnap = await getDoc(medicoRef);

        if (medicoSnap.exists()) {
          const usuarioId = medicoSnap.data().usuarioId;
          const usuarioRef = doc(firestore, "usuarios", usuarioId);
          const usuarioSnap = await getDoc(usuarioRef);

          if (usuarioSnap.exists()) {
            return usuarioSnap.data().nomeCompleto;
          }
        }
        return "Nome não disponível";
      } catch (error) {
        console.error(`Erro ao buscar nome do médico:`, error);
        return "Erro ao carregar";
      }
    },

    async buscarNomeRealDoPaciente(usuarioId) {
      try {
        console.log(`Buscando paciente com usuarioId: ${usuarioId}`);

        const pacientesRef = collection(firestore, "pacientes");
        const querySnapshot = await getDocs(pacientesRef);

        let pacienteDoc = null;
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.usuarioId === usuarioId) {
            pacienteDoc = docSnap;
          }
        });

        if (!pacienteDoc) {
          console.warn(`Nenhum documento de paciente encontrado para usuarioId: ${usuarioId}`);
          return "Nome não disponível";
        }

        console.log("Documento de paciente encontrado:", pacienteDoc.data());

        const usuarioRef = doc(firestore, "usuarios", usuarioId);
        const usuarioSnap = await getDoc(usuarioRef);

        if (!usuarioSnap.exists()) {
          console.warn(`Documento de usuário não encontrado para usuarioId: ${usuarioId}`);
          return "Nome não disponível";
        }

        const usuarioData = usuarioSnap.data();
        console.log("Documento de usuário encontrado:", usuarioData);

        const nomeCompleto = usuarioData.nomeCompleto;
        if (!nomeCompleto) {
          console.warn(`Campo 'nomeCompleto' ausente ou vazio no documento de usuário: ${usuarioId}`);
          return "Nome não disponível";
        }

        return nomeCompleto;
      } catch (error) {
        console.error(`Erro ao buscar nome do paciente [${usuarioId}]:`, error);
        return "Erro ao carregar";
      }
    },

    async carregarAgendamentos() {
      try {
        const agendamentosRef = collection(firestore, "agendamentos");
        const snapshot = await getDocs(agendamentosRef);

        const agendamentos = [];
        for (const docSnap of snapshot.docs) {
          const agendamento = { id: docSnap.id, ...docSnap.data() };

          console.log("Carregando agendamento:", agendamento);

          agendamento.nomeDoMedico = await this.buscarNomeRealDoMedico(agendamento.medicoNome);
          agendamento.nomeDoPaciente = await this.buscarNomeRealDoPaciente(agendamento.pacienteNome);

          agendamentos.push(agendamento);
        }

        console.log("Agendamentos carregados com sucesso:", agendamentos);
        this.agendamentos = agendamentos;
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        alert("Erro ao carregar agendamentos. Tente novamente mais tarde.");
      } finally {
        this.carregando = false;
      }
    },

    async remarcarAgendamento(index) {
      const novaData = prompt("Informe a nova data e hora (Exemplo: Sexta: 07:00 às 14:30):");
      if (novaData) {
        const agendamento = this.agendamentos[index];
        const agendamentoRef = doc(firestore, "agendamentos", agendamento.id);

        try {
          await updateDoc(agendamentoRef, { data: novaData });
          this.agendamentos[index].data = novaData;
          alert("Agendamento remarcado com sucesso.");
        } catch (error) {
          console.error("Erro ao remarcar agendamento:", error);
          alert("Erro ao remarcar agendamento.");
        }
      }
    },

    async carregarAgendamentos() {
      try {
        const agendamentosRef = collection(firestore, "agendamentos");
        const snapshot = await getDocs(agendamentosRef);

        const agendamentos = [];
        for (const docSnap of snapshot.docs) {
          const agendamento = { id: docSnap.id, ...docSnap.data() };

          console.log("Carregando agendamento:", agendamento);

          agendamento.nomeDoMedico = await this.buscarNomeRealDoMedico(agendamento.medicoNome);
          agendamento.nomeDoPaciente = await this.buscarNomeRealDoPaciente(agendamento.pacienteNome);

          agendamentos.push(agendamento);
        }

        console.log("Agendamentos carregados com sucesso:", agendamentos);
        this.agendamentos = agendamentos;
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
        console.log("Tentando cancelar agendamento:", agendamento);

        if (!agendamento.id) {
          console.error("ID do agendamento ausente. Não é possível cancelar.");
          alert("Erro ao cancelar agendamento. ID não encontrado.");
          return;
        }

        const confirmar = confirm(`Deseja realmente cancelar o agendamento com ${agendamento.nomeDoMedico}?`);
        if (!confirmar) {
          console.log("Cancelamento abortado pelo usuário.");
          return;
        }
        const agendamentoRef = doc(firestore, "agendamentos", agendamento.id);

        await deleteDoc(agendamentoRef);

        this.agendamentos.splice(index, 1);
        alert("Agendamento cancelado com sucesso.");
        console.log("Agendamento cancelado com sucesso:", agendamento);
      } catch (error) {
        console.error("Erro ao cancelar agendamento:", error);
        alert("Erro ao cancelar agendamento. Tente novamente mais tarde.");
      }
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
  async mounted() {
    await this.carregarAgendamentos();
  },
};
</script>

<style scoped>
.div-principal {
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
