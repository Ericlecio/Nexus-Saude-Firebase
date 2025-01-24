<template>
  <div>
    <Navbar />
    <br /><br />
    <div class="container py-5">
      <button class="btn-voltar" @click="voltarPagina">
        <i class="fas fa-arrow-left me-2"></i> Voltar
      </button>

      <h1 class="text-center mb-4 text-primary" style="margin-top: 50px; ">
        {{ medico ? medico.nomeCompleto : "Carregando..." }}
      </h1>

      <div v-if="medico">
        <!-- Informações Pessoais -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-info-circle me-2" style="color: #007bff;"></i>
              <strong>Informações Pessoais</strong>
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModal('info')"></i>
            </h5>
            <p><strong>Nome Completo:</strong> {{ medico.nomeCompleto }}</p>
            <p><strong>CPF:</strong> {{ formatCPF(medico.cpf) }}</p>
            <p><strong>Sexo:</strong> {{ medico.sexo }}</p>
            <p><strong>Data de Nascimento:</strong> {{ formatDate(medico.dataNascimento) }}</p>
          </div>
        </div>

        <!-- Contato -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-phone me-2" style="color: #28a745;"></i>
              <strong>Contato</strong>
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModal('contato')"></i>
            </h5>
            <p><strong>E-mail:</strong> {{ medico.email }}</p>
            <p><strong>Telefone:</strong> {{ formatPhone(medico.telefoneConsultorio) }}</p>
          </div>
        </div>

        <!-- Horários de Atendimento -->
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-clock me-2" style="color: #007bff;"></i>
              <strong>Horários de Atendimento</strong>
              <i class="fas fa-edit ms-2 text-primary cursor-pointer" @click="abrirModal('horarios')"></i>
            </h5>
            <ul class="list-unstyled">
              <li v-for="(horario, dia) in medico.diasAtendimento" :key="dia">
                <strong>{{ formatDia(dia) }}:</strong>
                {{ horario.inicio || "--:--" }} - {{ horario.fim || "--:--" }}
              </li>
            </ul>
          </div>
        </div>

        <button class="btn btn-danger" @click="deletarMedico">Excluir Médico</button>
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

            <label>CPF</label>
            <input v-model="formEdit.cpf" @input="handleCPFInput" type="text" class="form-control" required />

            <label>Sexo</label>
            <select v-model="formEdit.sexo" class="form-select" required>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>

            <label>Data de Nascimento</label>
            <input v-model="formEdit.dataNascimento" type="date" class="form-control" required />
          </div>

          <div v-if="campoSelecionado === 'contato'">
            <label>E-mail</label>
            <input v-model="formEdit.email" type="email" class="form-control" required />

            <label>Telefone</label>
            <input v-model="formEdit.telefoneConsultorio" @input="handlePhoneInput" type="text" class="form-control"
              required />
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
import { getFirestore, doc,collection, query, where, getDocs, updateDoc } from "firebase/firestore";


export default {
  name: "PerfilMedico",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      medico: null,
      showModal: false,
      campoSelecionado: "",
      formEdit: {},
      
    };
  },
  methods: {
    async carregarPerfil() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.tipo === "medico") {
          const db = getFirestore();
          const q = query(collection(db, "medicos"), where("email", "==", user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const medicoData = querySnapshot.docs[0].data();
            this.medicoId = querySnapshot.docs[0].id; // Armazena o ID do documento
            this.medico = medicoData;
            this.formEdit = { ...this.medico };
          } else {
            alert("Informações do médico não encontradas no banco de dados.");
          }
        } else {
          alert("Acesso negado! Redirecionando...");
          this.$router.push("/");
        }
      } catch (error) {
        console.error("Erro ao carregar perfil do médico:", error);
        alert("Erro ao carregar perfil.");
        this.$router.push("/");
      }
    },

    abrirModal(campo) {
      this.campoSelecionado = campo;
      this.formEdit = { ...this.medico };
      this.showModal = true;
    },


async salvarEdicao() {
  try {
    if (!this.medicoId) {
      console.error("ID do médico não encontrado.");
      alert("Erro ao atualizar informações. Tente novamente.");
      return;
    }

    const db = getFirestore();
    const medicoRef = doc(db, "medicos", this.medicoId);

    await updateDoc(medicoRef, {
      nomeCompleto: this.formEdit.nomeCompleto,
      cpf: this.formEdit.cpf,
      sexo: this.formEdit.sexo,
      dataNascimento: this.formEdit.dataNascimento,
      email: this.formEdit.email,
      telefoneConsultorio: this.formEdit.telefoneConsultorio,
    });

    this.medico = { ...this.formEdit };
    alert("Informações atualizadas com sucesso!");
    this.fecharModal();
  } catch (error) {
    console.error("Erro ao atualizar informações:", error);
    alert("Erro ao atualizar informações.");
  }
},


    fecharModal() {
      this.showModal = false;
    },

    deletarMedico() {
      if (confirm("Tem certeza que deseja excluir sua conta?")) {
        localStorage.removeItem("user");
        alert("Conta excluída com sucesso.");
        this.$router.push("/");
      }
    },

    formatCPF(cpf) {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    },

    formatPhone(phone) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("pt-BR");
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

    handleCPFInput(event) {
      this.formEdit.cpf = event.target.value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
        .slice(0, 14);
    },

    handlePhoneInput(event) {
      let phone = event.target.value.replace(/\D/g, "");
      phone = phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
      this.formEdit.telefoneConsultorio = phone.slice(0, 15);
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

button {
  width: 100px;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>
