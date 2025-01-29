<template>
  <div>
    <Navbar />
    <br /><br />
    <div class="container py-5">
      <button class="btn-voltar" @click="voltarPagina">
        <i class="fas fa-arrow-left me-2"></i> Voltar
      </button>

      <h1 class="text-center mb-4 text-primary">
        {{ paciente ? paciente.nomeCompleto : "Carregando..." }}
      </h1>

      <div v-if="paciente">
        <!-- Informações Pessoais -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-info-circle me-2 text-primary"></i>
              <strong>Informações Pessoais</strong>
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModal"></i>
            </h5>
            <p><strong>Nome Completo:</strong> {{ paciente.nomeCompleto }}</p>
            <p><strong>E-mail:</strong> {{ paciente.email }}</p>
            <p><strong>Telefone:</strong> {{ paciente.telefone }}</p>
            <p>
              <strong>Plano de Saúde:</strong>
              {{ paciente.planoSaude || "Não informado" }}
            </p>
            <p><strong>CPF:</strong> {{ paciente.cpf || "Não informado" }}</p>
            <p>
              <strong>Data de Nascimento:</strong>
              {{ paciente.dataNascimento || "Não informado" }}
            </p>
          </div>
        </div>

        <!-- Histórico de Consultas -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-calendar-check me-2 text-primary"></i>
              <strong>Histórico de Consultas</strong>
            </h5>
            <div v-if="paciente.consultas && paciente.consultas.length">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Médico</th>
                    <th>Especialidade</th>
                    <th>Local</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="consulta in paciente.consultas" :key="consulta.id">
                    <td>{{ consulta.data }}</td>
                    <td>{{ consulta.medicoNome }}</td>
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
        <h4>Editar Informações</h4>
        <form @submit.prevent="salvarEdicao">
          <label>Nome Completo</label>
          <input v-model="formEdit.nomeCompleto" type="text" class="form-control" required @input="validarNome" />

          <label>E-mail</label>
          <input v-model="formEdit.email" type="email" class="form-control" required />

          <label>Telefone</label>
          <input v-model="formEdit.telefone" @input="formatarTelefone" type="text" class="form-control" required />

          <label>Plano de Saúde</label>
          <select v-model="formEdit.planoSaude" class="form-control">
            <option value="" disabled>Selecione o plano</option>
            <option value="Unimed">Unimed</option>
            <option value="Amil">Amil</option>
            <option value="Bradesco Saúde">Bradesco Saúde</option>
            <option value="SulAmérica">SulAmérica</option>
            <option value="Hapvida">Hapvida</option>
            <option value="Notredame Intermédica">Notredame Intermédica</option>
            <option value="Sem plano de saúde">Sem plano de saúde</option>
          </select>

          <label>CPF</label>
          <input v-model="formEdit.cpf" @input="formatarCPF" @blur="validarCPF" type="text" class="form-control"
            maxlength="14" required />
          <small v-if="cpfInvalido" class="text-danger">CPF inválido!</small>

          <label>Data de Nascimento</label>
          <input v-model="formEdit.dataNascimento" type="date" class="form-control" required :max="hoje" />

          <div class="mt-3 text-center">
            <button type="submit" class="btn btn-success" :disabled="cpfInvalido">
              Salvar
            </button>
            <button type="button" class="btn btn-secondary ms-2" @click="fecharModal">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Exclusão -->
    <!-- Modal de Exclusão -->
    <div v-if="showModalDelete" class="modal-overlay">
      <div class="modal-content">
        <h4 class="text-danger">Confirmação de Exclusão</h4>
        <p>
          Tem certeza de que deseja excluir sua conta? Todos os seus dados serão
          apagados permanentemente.
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


    <Footer />
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
  deleteDoc,
  writeBatch,
} from "firebase/firestore";

export default {
  name: "PerfilPaciente",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      paciente: null,
      pacienteId: null,
      showModalEdit: false,
      showModalDelete: false,
      formEdit: {},
      hoje: new Date().toISOString().split("T")[0],
      cpfInvalido: false,
    };
  },
  methods: {
    async carregarPerfil() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.tipo === "paciente") {
          const db = getFirestore();
          const q = query(
            collection(db, "pacientes"),
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            this.pacienteId = querySnapshot.docs[0].id;
            this.paciente = querySnapshot.docs[0].data();
            this.formEdit = { ...this.paciente };
          } else {
            alert("Paciente não encontrado.");
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
    abrirModal() {
      this.showModalEdit = true;
    },
    fecharModal() {
      this.showModalEdit = false;
      this.showModalDelete = false;
    },
    validarNome(event) {
      this.formEdit.nomeCompleto = event.target.value.replace(
        /[^a-zA-Z\s]/g,
        ""
      );
    },
    formatarTelefone(event) {
      let telefone = event.target.value.replace(/\D/g, "");
      telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      this.formEdit.telefone = telefone.slice(0, 15);
    },
    formatarCPF(event) {
      let cpf = event.target.value.replace(/\D/g, "");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
      cpf = cpf.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
      this.formEdit.cpf = cpf.slice(0, 14);
    },
    validarCPF() {
      const cpf = this.formEdit.cpf.replace(/\D/g, "");
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        this.cpfInvalido = true;
        return;
      }

      const calcularDigito = (base) =>
        Array.from(
          { length: base },
          (_, i) => parseInt(cpf[i]) * (base + 1 - i)
        ).reduce((a, b) => a + b) % 11;

      const digito1 = calcularDigito(9) < 2 ? 0 : 11 - calcularDigito(9);
      const digito2 = calcularDigito(10) < 2 ? 0 : 11 - calcularDigito(10);

      this.cpfInvalido = !(
        digito1 === parseInt(cpf[9]) && digito2 === parseInt(cpf[10])
      );
    },
    confirmarExclusao() {
      console.log("Abrindo modal de exclusão...");
      this.showModalDelete = true; // Exibe o modal
    },
    async deletarConta() {
      try {
        const db = getFirestore();
        const pacienteRef = doc(db, "pacientes", this.pacienteId);

        console.log("Tentando excluir paciente:", this.pacienteId);

        // Buscar todos os agendamentos do paciente
        const agendamentosQuery = query(
          collection(db, "agendamentos"),
          where("pacienteId", "==", this.pacienteId)
        );
        const agendamentosSnapshot = await getDocs(agendamentosQuery);

        // Excluir agendamentos um por um (sem batch para evitar remoção da coleção)
        if (!agendamentosSnapshot.empty) {
          for (const agendamento of agendamentosSnapshot.docs) {
            await deleteDoc(agendamento.ref);
            console.log(`Agendamento ${agendamento.id} excluído.`);
          }
        }

        // Excluir apenas o registro do paciente
        await deleteDoc(pacienteRef);
        console.log(`Paciente ${this.pacienteId} excluído.`);

        // Remover informações do usuário do localStorage e redirecionar
        localStorage.removeItem("user");
        alert("Conta excluída com sucesso.");
        this.$router.push("/");
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        alert(`Erro ao excluir conta: ${error.message}`);
      }
    },
    async salvarEdicao() {
      try {
        if (!this.pacienteId) {
          console.error("ID do paciente não encontrado.");
          alert("Erro ao atualizar dados. ID do paciente não encontrado.");
          return;
        }

        const db = getFirestore();
        const pacienteRef = doc(db, "pacientes", this.pacienteId);

        console.log("Atualizando dados do paciente:", this.formEdit);

        await updateDoc(pacienteRef, this.formEdit);

        // Atualizar localmente os dados do paciente
        this.paciente = { ...this.formEdit };

        alert("Informações atualizadas com sucesso!");
        this.fecharModal();
      } catch (error) {
        console.error("Erro ao atualizar paciente:", error);
        alert("Erro ao atualizar paciente. Tente novamente.");
      }
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