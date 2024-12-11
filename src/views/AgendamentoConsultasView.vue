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
      usuarios: [], // Aqui vão os pacientes
      medicosFiltrados: [],
      especialidades: [],
      form: {
        especialidade: "",
        medicoNome: "",
        local: "Clínica Nexus Saúde - Palmares, PE",
        data: "",
        horario: "",
        pacienteNome: "", // Ajuste para armazenar o nome do paciente
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

        // Obtendo médicos
        this.medicos = await dao.getAll();

        // Obtendo usuários (pacientes)
        const usuarios = await daoUsuarios.getAll();

        // Associando o nome completo do usuário (paciente) aos médicos
        this.medicos.forEach(medico => {
          const filteredUser = usuarios.filter(u => u.id === medico.usuarioId)[0];
          medico.nomeCompleto = filteredUser ? filteredUser.nomeCompleto : "";
        });

        // Definindo as especialidades baseadas nos médicos
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

        // Obtendo todos os usuários (pacientes)
        const usuarios = await daoUsuarios.getAll();

        // Filtrando apenas os pacientes
        this.usuarios = usuarios.filter(usuario => usuario.tipo === 'paciente'); // Filtrando para pacientes

        console.log('Pacientes carregados:', this.usuarios); // Para depuração, verifique a estrutura.
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
        alert("Não foi possível carregar os pacientes. Tente novamente.");
      }
    },


    filterMedicosByEspecialidade() {
      // Filtrando médicos pela especialidade
      this.medicosFiltrados = this.medicos.filter(medico => medico.especialidade === this.form.especialidade);
      if (this.medicosFiltrados.length === 1) {
        this.form.medicoNome = this.medicosFiltrados[0].nomeCompleto;
      } else {
        this.form.medicoNome = "";
      }
    },

    medicoChanged() {
      // Definindo os horários disponíveis com base no médico selecionado
      const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
      const dias = [];

      const medicoSelecionado = this.medicosFiltrados.find(m => m.id === this.form.medicoNome);

      if (medicoSelecionado) {
        diasSemana.forEach(dia => {
          const diaAtendimento = medicoSelecionado.diasAtendimento[dia];
          if (diaAtendimento.inicio && diaAtendimento.fim) {
            dias.push(`${dia.charAt(0).toUpperCase() + dia.slice(1)}: ${diaAtendimento.inicio} às ${diaAtendimento.fim}`);
          }
        });
      }
      this.horariosDisponiveis = dias;
    },

    pacienteChanged() {
      console.log("Paciente selecionado ID:", this.form.pacienteNome); // Verifique se o ID está correto.

      // Encontrar o paciente selecionado pelo ID
      const pacienteSelecionado = this.usuarios.find(paciente => paciente.id === this.form.pacienteNome);

      if (pacienteSelecionado) {
        console.log("Paciente encontrado:", pacienteSelecionado); // Verifique o paciente encontrado.
        // Preenche o telefone no form.pacienteTelefone
        this.form.pacienteTelefone = pacienteSelecionado.telefone || '';
      } else {
        // Limpa o campo de telefone se o paciente não for encontrado
        this.form.pacienteTelefone = '';
      }
    },

    getTimeSlots() {
      // Gerando os horários disponíveis de 08:00 às 18:00
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
      // Enviando os dados do agendamento para o banco de dados
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
    // Carregando médicos e pacientes ao montar o componente
    this.fetchMedicos();
    this.fetchPacientes();
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
              <div class="col-md-12 bg text-light p-4" style="background-color: #000524">
                <h1 class="text-center mb-3">Nexus Saúde</h1>
                <h3 class="text-center mb-4">Agendamento de Consultas</h3>
                <form @submit.prevent="submitForm">
                  <div class="row mb-3">
                    <div class="col-md-12">
                      <label for="especialidade" class="form-label">Selecione a Especialidade</label>
                      <select v-model="form.especialidade" id="especialidade" class="form-select rounded-3"
                        @change="filterMedicosByEspecialidade" required>
                        <option value="" disabled selected>Selecione</option>
                        <option v-for="especialidade in especialidades" :key="especialidade" :value="especialidade">
                          {{ especialidade }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-md-12">
                      <label for="medicoNome" class="form-label">Médico</label>
                      <select v-model="form.medicoNome" id="medico" class="form-select rounded-3" required
                        @change="medicoChanged">
                        <option value="">-</option>
                        <option :value="medico.id" v-for="medico of medicosFiltrados">
                          {{ medico.nomeCompleto }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-12">
                      <label for="data" class="form-label">Selecione a Data</label>
                      <select v-model="form.data" id="data" class="form-select rounded-3" required>
                        <option value="" disabled selected>Selecione</option>
                        <option v-for="data in horariosDisponiveis" :key="data" :value="data">
                          {{ data }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Select para escolher o paciente -->
                  <div class="row mb-3">
                    <div class="col-md-12">
                      <label for="pacienteNome" class="form-label">Paciente</label>
                      <select v-model="form.pacienteNome" id="paciente" class="form-select rounded-3" required
                        @change="pacienteChanged">
                        <option value="">-</option>
                        <option :value="paciente.id" v-for="paciente in usuarios" :key="paciente.id">
                          {{ paciente.nomeCompleto }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Select para o telefone do paciente -->
                  <div class="row mb-3">
                    <div class="col-md-12">
                      <label for="pacienteTelefone" class="form-label">Telefone do Paciente</label>
                      <select v-model="form.pacienteTelefone" id="pacienteTelefone" class="form-select rounded-3"
                        required disabled>
                        <option v-if="form.pacienteTelefone" :value="form.pacienteTelefone">{{ form.pacienteTelefone }}
                        </option>
                        <option value="" disabled selected>Selecione um paciente para ver o telefone</option>
                      </select>
                    </div>
                  </div>



                  <div class="text-center">
                    <button type="submit" class="btn btn-primary rounded-3 btn-lg">
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

<style scoped></style>
