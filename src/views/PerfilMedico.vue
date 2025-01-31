<template>
  <div>
    <Navbar />
    <br /><br />
    <div class="container py-5">
      <BotaoVoltar />

      <h1 class="text-center mb-4 text-primary">
        {{ medico ? medico.nomeCompleto : "Carregando..." }}
      </h1>

      <div v-if="medico">
        <!-- Informações Pessoais -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-info-circle me-2 text-primary"></i>
              <strong>Informações Pessoais</strong>
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModal('info')"></i>
            </h5>
            <p><strong>Nome Completo:</strong> {{ medico.nomeCompleto }}</p>
            <p><strong>E-mail:</strong> {{ medico.email }}</p>
            <p><strong>Telefone:</strong> {{ medico.telefone }}</p>
            <p><strong>CRM:</strong> {{ medico.crm || "Não informado" }}</p>
            <p><strong>Especialidade:</strong> {{ medico.especialidade || "Não informado" }}</p>
            <p><strong>Sexo:</strong> {{ medico.sexo }}</p>
            <p>
              <strong>Data de Nascimento:</strong>
              {{ medico.dataNascimento || "Não informado" }}
            </p>
          </div>
        </div>

        <!-- Horários de Atendimento -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-clock me-2 text-primary"></i>
              <strong>Horários de Atendimento</strong>
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModal('horarios')"></i>
            </h5>
            <ul class="list-unstyled">
              <li v-for="(horarios, dia) in medico.diasAtendimento" :key="dia">
                <strong>{{ formatDia(dia) }}:</strong> {{ horarios.join(", ") }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Histórico de Consultas -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-calendar-check me-2 text-primary"></i>
              <strong>Histórico de Consultas</strong>
            </h5>
            <div v-if="medico.agenda && medico.agenda.length">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Paciente</th>
                    <th>Especialidade</th>
                    <th>Local</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="consulta in medico.agenda" :key="consulta.id">
                    <td>{{ consulta.data }}</td>
                    <td>{{ consulta.pacienteNome }}</td>
                    <td>{{ consulta.especialidade }}</td>
                    <td>{{ consulta.local }}</td>
                    <td>{{ consulta.situacao }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else class="text-muted">Nenhuma consulta encontrada.</p>
          </div>
        </div>

        <!-- Botão de Exclusão -->
        <button class="btn btn-danger" @click="confirmarExclusao">
          Excluir Conta
        </button>
      </div>

      <div v-else class="text-center mt-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>
    </div>

    <!-- Modal de Edição -->
    <div v-if="showModalEdit" class="modal-overlay">
      <div class="modal-content">
        <h4 v-if="campoSelecionado === 'info'">Editar Informações Pessoais</h4>
        <h4 v-if="campoSelecionado === 'horarios'">Editar Horários de Atendimento</h4>

        <form @submit.prevent="salvarEdicao">
          <!-- Modal para Informações Pessoais -->
          <template v-if="campoSelecionado === 'info'">
            <label>Nome Completo</label>
            <input v-model="formEdit.nomeCompleto" type="text" class="form-control" required />

            <label>E-mail</label>
            <input v-model="formEdit.email" type="email" class="form-control" required />

            <label>Telefone</label>
            <input v-model="formEdit.telefone" type="text" class="form-control" required />

            <label>CRM</label>
            <input v-model="formEdit.crm" type="text" class="form-control" />

            <label>Especialidade</label>
            <input v-model="formEdit.especialidade" type="text" class="form-control" />

            <label>Sexo</label>
            <select v-model="formEdit.sexo" class="form-control">
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>

            <label>Data de Nascimento</label>
            <input v-model="formEdit.dataNascimento" type="date" class="form-control" required :max="hoje" />
          </template>

          <!-- Modal para Horários de Atendimento -->
          <template v-if="campoSelecionado === 'horarios'">
            <div v-for="(horarios, dia) in formEdit.diasAtendimento" :key="dia">
              <label>{{ formatDia(dia) }}</label>
              <input v-model="formEdit.diasAtendimento[dia]" type="text" class="form-control"
                placeholder="Digite os horários separados por vírgula" />
            </div>
          </template>

          <div class="mt-3 text-center">
            <button type="submit" class="btn btn-success">Salvar</button>
            <button type="button" class="btn btn-secondary ms-2" @click="fecharModal">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>


    <!-- Modal de Exclusão -->
    <div v-if="showModalDelete" class="modal-overlay">
      <div class="modal-content">
        <h4 class="text-danger">Confirmação de Exclusão</h4>
        <p>
          Tem certeza de que deseja excluir sua conta? Todos os seus dados serão apagados permanentemente.
        </p>
        <div class="text-center mt-3">
          <button class="btn btn-danger" @click="deletarConta">
            Confirmar
          </button>
          <button class="btn btn-secondary ms-2" @click="fecharModal">
            Cancelar
          </button>
        </div>
      </div>
    </div>




  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import {
  getFirestore,
  doc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import BotaoVoltar from "@/components/BotaoVoltar.vue"; // 🔹 Importando o componente



export default {
  name: "PerfilMedico",
  components: {
    Navbar,
    Footer,
    BotaoVoltar,

  },
  data() {
    return {
      medico: null,
      medicoId: null,
      showModalEdit: false,
      showModalDelete: false,
      campoSelecionado: "",
      formEdit: null,
      hoje: new Date().toISOString().split("T")[0],
    };
  },
  methods: {
    async verificarAutenticacao() {
      const auth = getAuth();
      const db = getFirestore();

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const medicoRef = doc(db, "medicos", user.uid);
          const medicoSnap = await getDoc(medicoRef);

          if (medicoSnap.exists()) {
            this.medicoId = user.uid;
            this.medico = medicoSnap.data();
            this.formEdit = JSON.parse(JSON.stringify(this.medico));
          } else {
            alert("Acesso negado! Apenas médicos podem acessar esta página.");
            this.$router.push("/login");
          }
        } else {
          alert("Você precisa estar logado para acessar esta página.");
          this.$router.push("/login");
        }
      });
    },

    abrirModal(campo) {
      this.campoSelecionado = campo;
      this.showModalEdit = true;
    },

    fecharModal() {
      this.showModalEdit = false;
      this.showModalDelete = false;
      this.campoSelecionado = "";
    },

    confirmarExclusao() {
      this.showModalDelete = true;
    },

    async deletarConta() {
      try {
        const db = getFirestore();
        const medicoRef = doc(db, "medicos", this.medicoId);

        console.log("Tentando excluir médico:", this.medicoId);

        const agendamentosQuery = query(
          collection(db, "agendamentos"),
          where("medicoId", "==", this.medicoId)
        );
        const agendamentosSnapshot = await getDocs(agendamentosQuery);

        if (!agendamentosSnapshot.empty) {
          for (const agendamento of agendamentosSnapshot.docs) {
            await deleteDoc(agendamento.ref);
            console.log(`Agendamento ${agendamento.id} excluído.`);
          }
        }

        await deleteDoc(medicoRef);
        console.log(`Médico ${this.medicoId} excluído.`);

        alert("Conta excluída com sucesso.");
        this.$router.push("/login");
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        alert(`Erro ao excluir conta: ${error.message}`);
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
        domingo: "Domingo",
      };
      return dias[dia] || dia;
    },
  },
  mounted() {
    this.verificarAutenticacao();
  },
};
</script>


<style scoped>
.container {
  max-width: 90%;
}

.cursor-pointer {
  cursor: pointer;
}

.btn-voltar:hover {
  background-color: #0056b3;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>
