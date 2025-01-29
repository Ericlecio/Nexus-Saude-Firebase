<template>
  <div>
    <Navbar />
    <br /><br />
    <div class="container py-5">
      <button class="btn-voltar" @click="voltarPagina">
        <i class="fas fa-arrow-left me-2"></i> Voltar
      </button>

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
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export default {
  name: "PerfilMedico",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      medico: null,
      medicoId: null,
      showModalEdit: false,
      campoSelecionado: "",
      formEdit: null,
      hoje: new Date().toISOString().split("T")[0],
    };
  },
  methods: {
    async carregarPerfil() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.tipo === "medico") {
          const db = getFirestore();
          const q = query(
            collection(db, "medicos"),
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            this.medicoId = querySnapshot.docs[0].id;
            this.medico = querySnapshot.docs[0].data();
            this.formEdit = JSON.parse(JSON.stringify(this.medico)); // Cópia para edição
          } else {
            alert("Médico não encontrado.");
            this.$router.push("/");
          }
        } else {
          alert("Acesso negado!");
          this.$router.push("/");
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    },
    abrirModal(campo) {
      this.campoSelecionado = campo;
      this.showModalEdit = true;
    },
    fecharModal() {
      this.showModalEdit = false;
      this.campoSelecionado = "";
    },
    async salvarEdicao() {
      try {
        const db = getFirestore();
        const medicoRef = doc(db, "medicos", this.medicoId);

        await updateDoc(medicoRef, this.formEdit);
        this.medico = { ...this.formEdit };

        alert("Informações atualizadas com sucesso!");
        this.fecharModal();
      } catch (error) {
        console.error("Erro ao atualizar:", error);
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
    this.carregarPerfil();
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
