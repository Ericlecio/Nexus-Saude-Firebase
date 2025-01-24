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
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModal('info')"></i>
            </h5>
            <p><strong>Nome Completo:</strong> {{ paciente.nomeCompleto }}</p>
            <p><strong>E-mail:</strong> {{ paciente.email }}</p>
            <p><strong>Plano de Saúde:</strong> {{ paciente.planoSaude }}</p>
            <p><strong>Telefone:</strong> {{ paciente.telefone }}</p>
          </div>
        </div>

        <button class="btn btn-danger" @click="deletarConta">Excluir Conta</button>
      </div>

      <div v-else class="text-center mt-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>
    </div>

    <!-- Modal de Edição -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h4>Editar {{ campoSelecionado }}</h4>
        <form @submit.prevent="salvarEdicao">
          <div v-if="campoSelecionado === 'info'">
            <label>Nome Completo</label>
            <input v-model="formEdit.nomeCompleto" type="text" class="form-control" required />

            <label>E-mail</label>
            <input v-model="formEdit.email" type="email" class="form-control" required />

            <label>Plano de Saúde</label>
            <input v-model="formEdit.planoSaude" type="text" class="form-control" />

            <label>Telefone</label>
            <input v-model="formEdit.telefone" @input="handlePhoneInput" type="text" class="form-control" />
          </div>

          <div class="mt-3 text-center">
            <button type="submit" class="btn btn-success">Salvar</button>
            <button type="button" class="btn btn-secondary ms-2" @click="fecharModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { getFirestore, doc, collection, query, where, getDocs, updateDoc, deleteDoc } from "firebase/firestore";

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
      showModal: false,
      campoSelecionado: "",
      formEdit: {},
    };
  },
  methods: {
    async carregarPerfil() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.tipo === "paciente") {
          const db = getFirestore();
          const q = query(collection(db, "pacientes"), where("email", "==", user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const pacienteData = querySnapshot.docs[0].data();
            this.pacienteId = querySnapshot.docs[0].id;
            this.paciente = pacienteData;
            this.formEdit = { ...this.paciente };
          } else {
            alert("Informações do paciente não encontradas no banco de dados.");
          }
        } else {
          alert("Acesso negado! Redirecionando...");
          this.$router.push("/");
        }
      } catch (error) {
        console.error("Erro ao carregar perfil do paciente:", error);
        alert("Erro ao carregar perfil.");
        this.$router.push("/");
      }
    },

    abrirModal(campo) {
      this.campoSelecionado = campo;
      this.formEdit = { ...this.paciente };
      this.showModal = true;
    },

    async salvarEdicao() {
      try {
        if (!this.pacienteId) {
          console.error("ID do paciente não encontrado.");
          alert("Erro ao atualizar informações. Tente novamente.");
          return;
        }

        const db = getFirestore();
        const pacienteRef = doc(db, "pacientes", this.pacienteId);

        await updateDoc(pacienteRef, {
          nomeCompleto: this.formEdit.nomeCompleto,
          email: this.formEdit.email,
          planoSaude: this.formEdit.planoSaude,
          telefone: this.formEdit.telefone,
        });

        this.paciente = { ...this.formEdit };
        localStorage.setItem("user", JSON.stringify(this.paciente));
        alert("Informações atualizadas com sucesso!");
        this.fecharModal();
      } catch (error) {
        console.error("Erro ao atualizar informações:", error);
        alert("Erro ao atualizar informações.");
      }
    },

    async deletarConta() {
      if (confirm("Tem certeza que deseja excluir sua conta?")) {
        try {
          if (!this.pacienteId) {
            alert("Erro ao excluir conta. ID não encontrado.");
            return;
          }

          const db = getFirestore();
          const pacienteRef = doc(db, "pacientes", this.pacienteId);

          await deleteDoc(pacienteRef);
          localStorage.removeItem("user");
          alert("Conta excluída com sucesso.");
          this.$router.push("/");
        } catch (error) {
          console.error("Erro ao excluir conta:", error);
          alert("Erro ao excluir conta.");
        }
      }
    },

    fecharModal() {
      this.showModal = false;
    },

    handlePhoneInput(event) {
      let phone = event.target.value.replace(/\D/g, "");
      phone = phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      this.formEdit.telefone = phone.slice(0, 15);
    },

    voltarPagina() {
      this.$router.push("/");
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
