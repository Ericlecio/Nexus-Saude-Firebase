<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import DAOService from "@/services/DAOService";

export default {
  name: "AgendamentoConsulta",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      medicos: [], // Lista completa de médicos cadastrados
      medicosFiltrados: [], // Médicos filtrados por especialidade
      especialidades: [], // Lista de especialidades disponíveis
      form: {
        especialidade: "",
        medicoNome: "", // Nome do médico selecionado automaticamente
        local: "Clínica Nexus Saúde - Palmares, PE", // Local fixo
        data: "",
        horario: "",
        pacienteNome: "",
        pacienteTelefone: "",
      },
      horariosDisponiveis: this.getTimeSlots(),
    };
  },
  methods: {
    async fetchMedicos() {
      try {
        const dao = new DAOService("medicos");
        this.medicos = await dao.getAll();

        // Extrair especialidades únicas dos médicos
        this.especialidades = [
          ...new Set(this.medicos.map((medico) => medico.especialidade)),
        ];
      } catch (error) {
        console.error("Erro ao carregar médicos:", error);
        alert("Não foi possível carregar os médicos. Tente novamente.");
      }
    },
    filterMedicosByEspecialidade() {
      // Filtrar médicos com base na especialidade selecionada
      this.medicosFiltrados = this.medicos.filter(
        (medico) => medico.especialidade === this.form.especialidade
      );
      if (this.medicosFiltrados.length > 0) {
        // Selecionar automaticamente o nome do primeiro médico da lista
        this.form.medicoNome = this.medicosFiltrados[0].nome;
      } else {
        this.form.medicoNome = ""; // Limpar caso nenhum médico seja encontrado
      }
    },
    getTimeSlots() {
      const slots = [];
      const startHour = 8;
      const endHour = 18;

      for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += 30) {
          const hour = h < 10 ? `0${h}` : h;
          const minute = m < 10 ? `0${m}` : m;
          slots.push(`${hour}:${minute}`);
        }
      }
      return slots;
    },
    async submitForm() {
      try {
        const agendamentoData = {
          especialidade: this.form.especialidade,
          medicoNome: this.form.medicoNome,
          local: this.form.local,
          data: this.form.data,
          horario: this.form.horario,
          pacienteNome: this.form.pacienteNome,
          pacienteTelefone: this.form.pacienteTelefone,
        };

        const dao = new DAOService("agendamentos");
        await dao.insert(agendamentoData);

        alert("Consulta agendada com sucesso!");
        this.$router.push("/"); // Redireciona para a página inicial
      } catch (error) {
        console.error("Erro ao agendar consulta:", error);
        alert("Não foi possível agendar a consulta. Tente novamente.");
      }
    },
  },
  mounted() {
    this.fetchMedicos();
  },
};
</script>

<template>
  <div>
    <Navbar />
    <div class="container py-5 mt-5">
      <div class="row justify-content-center align-items-center">
        <div class="col-lg-10">
          <div class="card shadow-lg border-0 rounded-3">
            <div class="row g-0">
              <div class="col-md-12 bg text-light p-4" style="background-color: #000524;">
                <h1 class="text-center mb-3">Nexus Saúde</h1>
                <h3 class="text-center mb-4">Agendamento de Consultas</h3>
                <form @submit.prevent="submitForm">
                  <div class="row mb-3">
                    <div class="col-md-12">
                      <label for="especialidade" class="form-label">Selecione a Especialidade</label>
                      <select
                        v-model="form.especialidade"
                        id="especialidade"
                        class="form-select rounded-3"
                        @change="filterMedicosByEspecialidade"
                        required
                      >
                        <option value="" disabled selected>Selecione</option>
                        <option
                          v-for="especialidade in especialidades"
                          :key="especialidade"
                          :value="especialidade"
                        >
                          {{ especialidade }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-md-12">
                      <label for="medicoNome" class="form-label">Médico</label>
                      <input
                        v-model="form.medicoNome"
                        type="text"
                        id="medicoNome"
                        class="form-control rounded-3"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-md-12">
                      <label for="data" class="form-label">Data</label>
                      <input
                        v-model="form.data"
                        type="date"
                        id="data"
                        class="form-control rounded-3"
                        required
                      />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-md-12">
                      <label for="horario" class="form-label">Horário</label>
                      <select
                        v-model="form.horario"
                        id="horario"
                        class="form-select rounded-3"
                        required
                      >
                        <option value="" disabled selected>Selecione um horário</option>
                        <option
                          v-for="horario in horariosDisponiveis"
                          :key="horario"
                          :value="horario"
                        >
                          {{ horario }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-md-12">
                      <label for="pacienteNome" class="form-label">Nome do Paciente</label>
                      <input
                        v-model="form.pacienteNome"
                        type="text"
                        id="pacienteNome"
                        class="form-control rounded-3"
                        required
                      />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-md-12">
                      <label for="pacienteTelefone" class="form-label">Telefone do Paciente</label>
                      <input
                        v-model="form.pacienteTelefone"
                        type="text"
                        id="pacienteTelefone"
                        class="form-control rounded-3"
                        required
                      />
                    </div>
                  </div>
                  <div class="text-center">
                    <button
                      type="submit"
                      class="btn btn-primary rounded-3 btn-lg"
                    >
                      Agendar Consulta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
/* Adicione seus estilos personalizados aqui */
</style>
