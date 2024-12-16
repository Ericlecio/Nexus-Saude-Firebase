<template>
  <Navbar />
  <div class="container-fluid py-5 mt-5">
    <div class="row justify-content-center align-items-center">
      <div class="col-lg-10 col-md-10 col-sm-12">
        <div class="card shadow-lg border-0 rounded-4">
          <div class="row g-0">

            <div class="col-md-5 d-none d-md-block">
              <img src="@/assets/img/NexusSaude_vertical.png" alt="Imagem Nexus Saúde"
                class="img-fluid rounded-start" />
            </div>

            <div class="col-md-7 p-5 rounded-end custom-bg">
              <h1 class="text-center text-light mb-4 font-weight-bold">Nexus Saúde</h1>
              <h3 class="text-center text-light mb-5">Agendamento de Consultas</h3>
              <form @submit.prevent="submitForm">

                <div class="row mb-4">
                  <div class="col-md-6">
                    <label for="especialidade" class="form-label text-light">Selecione a Especialidade</label>
                    <select v-model="form.especialidade" id="especialidade" class="form-select rounded-3"
                      @change="filterMedicosByEspecialidade" required>
                      <option value="" disabled selected>Selecione</option>
                      <option v-for="especialidade in especialidades" :key="especialidade" :value="especialidade">
                        {{ especialidade }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="medicoNome" class="form-label text-light">Médico</label>
                    <select v-model="form.medicoNome" id="medico" class="form-select rounded-3" required
                      @change="medicoChanged">
                      <option value="">-</option>
                      <option :value="medico.id" v-for="medico of medicosFiltrados">
                        {{ medico.nomeCompleto }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Data e Paciente -->
                <div class="row mb-4">
                  <div class="col-md-6">
                    <label for="data" class="form-label text-light">Selecione a Data</label>
                    <select v-model="form.data" id="data" class="form-select rounded-3" required>
                      <option value="" disabled selected>Selecione</option>
                      <option v-for="data in horariosDisponiveis" :key="data" :value="data">
                        {{ data }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="pacienteNome" class="form-label text-light">Paciente</label>
                    <select v-model="form.pacienteNome" id="paciente" class="form-select rounded-3" required
                      @change="pacienteChanged">
                      <option value="">-</option>
                      <option :value="paciente.id" v-for="paciente in usuarios" :key="paciente.id">
                        {{ paciente.nomeCompleto }}
                      </option>
                    </select>
                  </div>
                </div>


                <div class="row mb-4">
                  <div class="col-md-6">
                    <label for="pacienteTelefone" class="form-label text-light">Telefone do Paciente</label>
                    <input type="text" id="pacienteTelefone" v-model="form.pacienteTelefone"
                      class="form-control rounded-3" placeholder="(00) 00000-0000" required
                      :disabled="!form.pacienteNome" @input="formatPhoneNumber" />
                  </div>
                  <div class="col-md-6">
                    <label for="local" class="form-label text-light">Local</label>
                    <input type="text" id="local" v-model="form.local" class="form-control rounded-3" readonly />
                  </div>
                </div>


                <div class="text-center">
                  <button class="btn btn-primary rounded-3 btn-lg shadow-lg" @click="voltarPagina">Voltar</button>
                  <button type="submit" class="btn btn-primary rounded-3 btn-lg shadow-lg">Agendar Consulta</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

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
      medicos: [],
      usuarios: [],
      medicosFiltrados: [],
      especialidades: [],
      form: {
        especialidade: "",
        medicoNome: "",
        local: "Clínica Nexus Saúde - Palmares, PE",
        data: "",
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
        const daoUsuarios = new DAOService("usuarios");

        this.medicos = await dao.getAll();
        const usuarios = await daoUsuarios.getAll();

        this.medicos.forEach((medico) => {
          const filteredUser = usuarios.filter(
            (u) => u.id === medico.usuarioId
          )[0];
          medico.nomeCompleto = filteredUser ? filteredUser.nomeCompleto : "";
        });

        this.especialidades = [
          ...new Set(this.medicos.map((medico) => medico.especialidade)),
        ];
      } catch (error) {
        console.error("Erro ao carregar médicos:", error);
        alert("Não foi possível carregar os médicos. Tente novamente.");
      }
    },

    async fetchPacientes() {
      try {
        const daoUsuarios = new DAOService("usuarios");
        const usuarios = await daoUsuarios.getAll();

        this.usuarios = usuarios.filter(
          (usuario) => usuario.tipo === "paciente"
        );
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
        alert("Não foi possível carregar os pacientes. Tente novamente.");
      }
    },

    filterMedicosByEspecialidade() {
      this.medicosFiltrados = this.medicos.filter(
        (medico) => medico.especialidade === this.form.especialidade
      );
      if (this.medicosFiltrados.length === 1) {
        this.form.medicoNome = this.medicosFiltrados[0].nomeCompleto;
      } else {
        this.form.medicoNome = "";
      }
    },

    medicoChanged() {
      const diasSemana = [
        "segunda", "terca", "quarta", "quinta", "sexta", "sabado"
      ];
      const dias = [];

      const medicoSelecionado = this.medicosFiltrados.find(
        (m) => m.id === this.form.medicoNome
      );

      if (medicoSelecionado) {
        diasSemana.forEach((dia) => {
          const diaAtendimento = medicoSelecionado.diasAtendimento[dia];
          if (diaAtendimento.inicio && diaAtendimento.fim) {
            dias.push(
              `${dia.charAt(0).toUpperCase() + dia.slice(1)}: ${diaAtendimento.inicio} às ${diaAtendimento.fim}`
            );
          }
        });
      }
      this.horariosDisponiveis = dias;
    },

    pacienteChanged() {
      const pacienteSelecionado = this.usuarios.find(
        (paciente) => paciente.id === this.form.pacienteNome
      );

      if (pacienteSelecionado) {
        this.form.pacienteTelefone = pacienteSelecionado.telefone || "";
      } else {
        this.form.pacienteTelefone = "";
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

    formatPhoneNumber(event) {
      let phone = event.target.value.replace(/\D/g, "");
      if (phone.length <= 2) {
        phone = `(${phone}`;
      } else if (phone.length <= 7) {
        phone = `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
      } else {
        phone = `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
      }
      event.target.value = phone;
    },

    async submitForm() {
      try {
        const agendamentoData = {
          especialidade: this.form.especialidade,
          medicoNome: this.form.medicoNome,
          local: this.form.local,
          data: this.form.data,
          pacienteNome: this.form.pacienteNome,
          pacienteTelefone: this.form.pacienteTelefone,

        };

        const dao = new DAOService("agendamentos");
        await dao.insert(agendamentoData);

        alert("Consulta agendada com sucesso!");
        this.$router.push("/");
      } catch (error) {
        console.error("Erro ao agendar consulta:", error);
        alert("Não foi possível agendar a consulta. Tente novamente.");
      }
    },
    voltarPagina() {
      if (window.history.length > 1) {

        this.$router.go(-1);
      } else {

        this.$router.push("/");
      }
    },
  },

  mounted() {
    this.fetchMedicos();
    this.fetchPacientes();
  },
};
</script>

<style scoped>
.container {
  width: 100%;
}

.card {
  background-color: #f8f9fa;
  border-radius: 1rem;
}

.card-body {
  padding: 2rem;
}

h1,
h3 {
  font-weight: 600;
}

.custom-bg {
  background-color: #0C0636;
}

.form-select,
.form-control {
  background-color: #f1f1f1;
  border: 1px solid #ccc;
}

.text-center button {
  margin-left: 5%;
  margin-right: 5%;

}

.form-select:focus,
.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25);
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
}

button[type="submit"]:hover {
  background-color: #0056b3;
  transition: background-color 0.3s ease-in-out;
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
  margin-bottom: 20px;
}

.btn-voltar:hover {
  background-color: #0056b3;
}
</style>
