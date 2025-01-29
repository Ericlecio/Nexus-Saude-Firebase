<template>
  <Navbar />
  <br />
  <div class="div-principal">
    <div class="container my-5">
      <button class="btn btn-primary btn-back" @click="voltarPagina">
        <i class="fas fa-arrow-left me-2"></i> Voltar
      </button>

      <h2 class="text-center text-primary fw-bold mb-4">Meus Agendamentos</h2>

      <div v-if="carregando" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <p class="mt-3 text-muted">Carregando seus agendamentos...</p>
      </div>

      <div v-else>
        <!-- Menu de Filtros -->
        <ul class="nav nav-pills justify-content-center mb-4">
          <li class="nav-item" v-for="opcao in opcoesFiltro" :key="opcao.valor">
            <a class="nav-link" :class="{ active: filtroSituacao === opcao.valor }"
              @click="filtroSituacao = opcao.valor">
              {{ opcao.label }}
            </a>
          </li>
        </ul>

        <div class="table-responsive">
          <table class="table table-striped table-hover shadow-sm">
            <thead class="table-primary">
              <tr>
                <th>Especialidade</th>
                <th>Profissional</th>
                <th>Local</th>
                <th>Data e Hora</th>
                <th>Telefone</th>
                <th>Situação</th>
                <th class="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="agendamento in agendamentosFiltrados" :key="agendamento.id" :class="{
                'consulta-cancelada': agendamento.situacao.toLowerCase().includes('cancelada'),
              }">
                <td>{{ agendamento.especialidade || 'Não informado' }}</td>
                <td>{{ agendamento.medicoNome || 'Nome não disponível' }}</td>
                <td>{{ agendamento.local || 'Não informado' }}</td>
                <td>{{ agendamento.data || 'Não informado' }}</td>
                <td>{{ agendamento.pacienteTelefone || 'Não informado' }}</td>
                <td>{{ agendamento.situacao || 'Não informado' }}</td>
                <td class="text-center">
                  <button v-if="agendamento.situacao === 'Confirmada'" class="btn btn-sm btn-warning"
                    @click="confirmarCancelamento(agendamento.id)">
                    <i class="fas fa-ban"></i> Cancelar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-if="!agendamentosFiltrados.length" class="text-center text-muted">
          Nenhum agendamento encontrado.
        </p>
      </div>
    </div>

    <!-- Modal de confirmação -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h4 class="text-center text-danger fw-bold">{{ modalMensagem.titulo }}</h4>
        <p class="text-center">{{ modalMensagem.texto }}</p>
        <div class="text-center mt-3">
          <button class="btn btn-danger me-3" @click="confirmarAcaoModal">
            Confirmar
          </button>
          <button class="btn btn-secondary" @click="showModal = false">Fechar</button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc, deleteDoc } from "firebase/firestore";
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
      showModal: false,
      agendamentoSelecionado: null,
      acaoSelecionada: null,
      modalMensagem: { titulo: "", texto: "" },
      filtroSituacao: "Confirmada",
      opcoesFiltro: [
        { label: "Confirmadas", valor: "Confirmada" },
        { label: "Canceladas pelo Paciente", valor: "Cancelada pelo paciente" },
        { label: "Canceladas pelo Médico", valor: "Cancelada pelo médico" },
      ],
    };
  },
  computed: {
    agendamentosFiltrados() {
      return this.agendamentos.filter(
        (agendamento) => agendamento.situacao === this.filtroSituacao
      );
    },
  },
  watch: {
    filtroSituacao: {
      handler() {
        this.carregarAgendamentos();
      },
      immediate: true, // Para carregar corretamente na inicialização
    },
  },
  methods: {
    async carregarAgendamentos() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.tipo !== "paciente" || !user.usuarioId) {
          alert("Apenas pacientes podem acessar esta página. Faça login.");
          this.$router.push("/login");
          return;
        }

        const db = getFirestore();

        // Se o filtro for "Confirmadas", buscar na tabela agendamentos
        if (this.filtroSituacao === "Confirmada") {
          const q = query(collection(db, "agendamentos"), where("pacienteId", "==", user.usuarioId));
          const snapshot = await getDocs(q);
          this.agendamentos = snapshot.empty
            ? []
            : snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }));
        } else {
          // Se for "Canceladas pelo Paciente" ou "Canceladas pelo Médico", buscar na tabela pacientes > consultas
          const pacienteRef = doc(db, "pacientes", user.usuarioId);
          const pacienteSnap = await getDoc(pacienteRef);

          if (pacienteSnap.exists()) {
            const pacienteData = pacienteSnap.data();
            this.agendamentos = (pacienteData.consultas || []).filter(
              (consulta) => consulta.situacao === this.filtroSituacao
            );
          } else {
            this.agendamentos = [];
          }
        }
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        alert("Erro ao carregar agendamentos.");
      } finally {
        this.carregando = false;
      }
    },
    confirmarCancelamento(id) {
      this.agendamentoSelecionado = id;
      this.acaoSelecionada = "cancelar";
      this.modalMensagem = {
        titulo: "Confirmar Cancelamento",
        texto: "Tem certeza de que deseja cancelar esta consulta?",
      };
      this.showModal = true;
    },
    async cancelarConsulta() {
      const db = getFirestore();
      const consultaRef = doc(db, "agendamentos", this.agendamentoSelecionado);

      try {
        const consultaSnap = await getDoc(consultaRef);

        if (consultaSnap.exists()) {
          const consulta = consultaSnap.data();

          // Atualizar a situação antes de remover
          await updateDoc(consultaRef, { situacao: "Cancelada pelo paciente" });

          // Copiar o registro para a tabela do paciente
          const pacienteRef = doc(db, "pacientes", consulta.pacienteId);
          await updateDoc(pacienteRef, {
            consultas: arrayUnion({
              id: consultaRef.id,
              ...consulta,
              situacao: "Cancelada pelo paciente",
            }),
          });

          // Copiar o registro para a agenda do médico
          const medicoRef = doc(db, "medicos", consulta.medicoId);
          await updateDoc(medicoRef, {
            agenda: arrayUnion({
              id: consultaRef.id,
              ...consulta,
              situacao: "Cancelada pelo paciente",
            }),
          });

          // Remover o registro da tabela agendamentos
          await deleteDoc(consultaRef);

          // Atualizar a lista de agendamentos na interface
          this.agendamentos = this.agendamentos.filter(
            (a) => a.id !== this.agendamentoSelecionado
          );

          alert("Consulta cancelada com sucesso e movida para o histórico do paciente e do médico.");
        } else {
          alert("Consulta não encontrada.");
        }
      } catch (error) {
        console.error("Erro ao cancelar consulta:", error);
        alert("Erro ao cancelar consulta. Tente novamente.");
      } finally {
        this.showModal = false;
      }
    },
    async confirmarAcaoModal() {
      if (this.acaoSelecionada === "cancelar") {
        await this.cancelarConsulta();
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

.btn-back {
  border-radius: 10px;
  padding: 10px 20px;
}

.nav-pills .nav-link {
  color: #53ba83;
  cursor: pointer;
}

.nav-pills .nav-link.active {
  background-color: #53ba83;
  color: white;
}

.table {
  border: 1px solid #ddd;
  border-radius: 10px;
}

.consulta-cancelada td {
  text-decoration: line-through;
  background: rgba(0, 0, 30, 0.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  text-align: center;
}
</style>
