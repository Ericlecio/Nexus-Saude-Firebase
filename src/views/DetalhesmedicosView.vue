<template>
  <div>
    <Navbar />
    <br /><br />
    <div class="container py-5">
      <button class="btn-voltar" @click="voltarPagina">
        <i class="fas fa-arrow-left me-2"></i> Voltar
      </button>

      <h1 class="text-center mb-4 text-primary" style="margin-top: 50px;">
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
            <p><strong>CPF:</strong> {{ medico.cpf }}</p>
            <p><strong>Sexo:</strong> {{ medico.sexo }}</p>
            <p><strong>Data de Nascimento:</strong> {{ medico.dataNascimento }}</p>
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
            <p><strong>Telefone:</strong> {{ medico.telefoneConsultorio }}</p>
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

          <div v-if="campoSelecionado === 'horarios'">
            <h4 class="text-center mb-3">Editar Horários de Atendimento</h4>
            <div class="row justify-content-center">
              <div class="col-md-10">
                <div class="card shadow-lg border-0 rounded-4 p-4 bg-light">
                  <div class="row g-4">
                    <div class="col-md-4" v-for="(horario, dia) in formEdit.diasAtendimento" :key="dia">
                      <label class="form-label"><strong>{{ formatDia(dia) }}</strong></label>
                      <div class="d-flex align-items-center">
                        <select v-model="horario.inicio" class="form-select me-2" @change="validateHorario(dia)">
                          <option v-for="hora in horarios" :key="hora" :value="hora">{{ hora }}</option>
                        </select>
                        <span class="me-2">às</span>
                        <select v-model="horario.fim" class="form-select" @change="validateHorario(dia)">
                          <option v-for="hora in horarios" :key="hora" :value="hora">{{ hora }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
      showModal: false,
      campoSelecionado: "",
      formEdit: {},
      horarios: this.gerarHorarios("07:00", "17:00", 30), // Geração de horários com intervalo de 30 min
      diasAtendimento: {
        segunda: { inicio: "", fim: "" },
        terca: { inicio: "", fim: "" },
        quarta: { inicio: "", fim: "" },
        quinta: { inicio: "", fim: "" },
        sexta: { inicio: "", fim: "" },
        sabado: { inicio: "", fim: "" },
      },
    };
  },
  methods: {
    async fetchMedicoDetails() {
      try {
        const medicoId = this.$route.params.id;
        const medicosDao = new DAOService("medicos");
        this.medico = await medicosDao.get(medicoId);
        this.formEdit = { ...this.medico };
      } catch (error) {
        console.error("Erro ao buscar detalhes do médico: ", error);
      }
    },

    abrirModal(campo) {
      this.campoSelecionado = campo;
      this.formEdit = { ...this.medico };
      this.showModal = true;
    },

    async salvarEdicao() {
      try {
        const medicosDao = new DAOService("medicos");
        await medicosDao.update(this.$route.params.id, this.formEdit);
        this.medico = { ...this.formEdit };
        alert("Informação atualizada com sucesso!");
        this.fecharModal();
      } catch (error) {
        console.error("Erro ao atualizar informações: ", error);
        alert("Erro ao atualizar.");
      }
    },

    fecharModal() {
      this.showModal = false;
    },

    async deletarMedico() {
      if (confirm("Tem certeza que deseja excluir este médico?")) {
        try {
          const medicosDao = new DAOService("medicos");
          await medicosDao.delete(this.$route.params.id);
          alert("Médico excluído com sucesso!");
          this.$router.push("/"); // Redireciona para a página inicial após exclusão
        } catch (error) {
          console.error("Erro ao excluir médico: ", error);
          alert("Erro ao excluir médico.");
        }
      }
    },

    handleCPFInput(event) {
      this.formEdit.cpf = event.target.value.replace(/\D/g, "")
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2")
        .slice(0, 14);
    },

    handlePhoneInput(event) {
      let phone = event.target.value.replace(/\D/g, "");
      phone = phone.replace(/^(\d{2})(\d)/g, "($1) $2");
      phone = phone.replace(/(\d{5})(\d)/, "$1-$2");
      this.formEdit.telefoneConsultorio = phone.slice(0, 15);
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

    validateHorario(dia) {
      if (this.formEdit.diasAtendimento[dia].fim <= this.formEdit.diasAtendimento[dia].inicio) {
        alert("O horário final deve ser maior que o horário inicial.");
        this.formEdit.diasAtendimento[dia].fim = "";
      }
    },

    gerarHorarios(horaInicio, horaFim, intervaloMinutos) {
      const horarios = [];
      let [hora, minuto] = horaInicio.split(":").map(Number);
      const [fimHora, fimMinuto] = horaFim.split(":").map(Number);

      while (hora < fimHora || (hora === fimHora && minuto <= fimMinuto)) {
        const horaFormatada = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
        horarios.push(horaFormatada);
        minuto += intervaloMinutos;
        if (minuto >= 60) {
          minuto -= 60;
          hora++;
        }
      }
      return horarios;
    },

    voltarPagina() {
      this.$router.push("/");
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
