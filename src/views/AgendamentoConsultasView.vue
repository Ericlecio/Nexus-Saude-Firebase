<template>
  <Navbar />
  <div class="container-fluid py-5 mt-5">
    <div class="row justify-content-center align-items-center">
      <div class="col-lg-8 col-md-10 col-sm-12">
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div class="row g-0">
            <div class="col-md-5 d-none d-md-flex align-items-center justify-content-center bg-light">
              <img src="@/assets/img/NexusSaude_vertical.png" alt="Imagem Nexus Saúde" class="img-fluid logo" />
            </div>
            <div class="col-md-7 p-5 bg-white">
              <h1 class="text-center text-primary mb-3 font-weight-bold">
                Nexus Saúde
              </h1>
              <p class="text-center text-muted mb-4">
                Agende sua consulta com facilidade
              </p>
              <form @submit.prevent="submitForm">
                <div class="row g-4">
                  <div class="col-md-6">
                    <label for="especialidade" class="form-label text-dark fw-bold">Especialidade</label>
                    <select v-model="form.especialidade" id="especialidade" class="form-select"
                      @change="filterMedicosByEspecialidade" required>
                      <option value="" disabled selected>Selecione</option>
                      <option v-for="especialidade in especialidades" :key="especialidade" :value="especialidade">
                        {{ especialidade }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label for="medicoNome" class="form-label text-dark fw-bold">Médico</label>
                    <select v-model="form.medicoId" id="medico" class="form-select" required @change="medicoChanged">
                      <option value="" disabled selected>Selecione</option>
                      <option v-for="medico in medicosFiltrados" :key="medico.id" :value="medico.id">
                        {{ medico.nomeCompleto }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="row g-4 mt-3">
                  <div class="col-md-6">
                    <label for="data" class="form-label text-dark fw-bold">Horários Disponíveis</label>
                    <select v-model="form.data" id="data" class="form-select" required>
                      <option value="" disabled selected>Selecione</option>
                      <option v-for="horario in horariosDisponiveis" :key="horario.horario" :value="horario.horario"
                        :class="{ 'text-success': horario.disponivel, 'text-danger': !horario.disponivel }"
                        :disabled="!horario.disponivel">
                        {{ horario.horario }}
                      </option>
                    </select>


                  </div>

                  <div class="col-md-6">
                    <label for="pacienteNome" class="form-label text-dark fw-bold">Paciente</label>
                    <input type="text" id="pacienteNome" v-model="form.pacienteNome" class="form-control" readonly />
                  </div>
                </div>

                <div class="row g-4 mt-3">
                  <div class="col-md-6">
                    <label for="pacienteTelefone" class="form-label text-dark fw-bold">Telefone</label>
                    <input type="text" id="pacienteTelefone" v-model="form.pacienteTelefone" class="form-control"
                      readonly />
                  </div>
                  <div class="col-md-6">
                    <label for="local" class="form-label text-dark fw-bold">Local</label>
                    <input type="text" id="local" v-model="form.local" class="form-control" readonly />
                  </div>
                </div>

                <div class="text-center mt-4">
                  <button class="btn btn-outline-secondary btn-lg me-3" @click="voltarPagina">
                    Voltar
                  </button>
                  <button type="submit" class="btn btn-primary btn-lg">
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
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";

export default {
  name: "AgendamentoConsulta",
  components: {
    Navbar,
    Footer,
  },

  data() {
    return {
      medicos: [],
      medicosFiltrados: [],
      especialidades: [],
      horariosDisponiveis: [],
      form: {
        especialidade: "",
        medicoId: "",
        medicoNome: "",
        local: "Clínica Nexus Saúde - Palmares, PE",
        data: "",
        pacienteNome: "",
        pacienteTelefone: "",
      },
      pacienteLogado: null,
    };
  },

  methods: {
    async verificarPacienteLogado() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.tipo !== "paciente") {
          alert("Apenas pacientes podem agendar consultas. Faça login.");
          this.$router.push("/login");
        } else {
          const db = getFirestore();
          const q = query(
            collection(db, "pacientes"),
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const pacienteData = querySnapshot.docs[0].data();
            this.pacienteLogado = pacienteData;
            this.form.pacienteNome = pacienteData.nomeCompleto;
            this.form.pacienteTelefone = pacienteData.telefone || "Não informado";
          } else {
            alert("Informações do paciente não encontradas.");
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do paciente:", error);
        alert("Erro ao carregar dados do paciente.");
        this.$router.push("/login");
      }
    },

    async fetchMedicos() {
      try {
        const db = getFirestore();
        const q = query(collection(db, "medicos"));
        const querySnapshot = await getDocs(q);

        this.medicos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        this.especialidades = [
          ...new Set(this.medicos.map((medico) => medico.especialidade)),
        ];
      } catch (error) {
        console.error("Erro ao carregar médicos:", error);
        alert("Erro ao carregar médicos. Tente novamente.");
      }
    },

    filterMedicosByEspecialidade() {
      this.medicosFiltrados = this.medicos.filter(
        (medico) => medico.especialidade === this.form.especialidade
      );
      this.form.medicoId = "";
      this.form.medicoNome = "";
      this.horariosDisponiveis = [];
    },

    medicoChanged() {
      const medicoSelecionado = this.medicos.find(
        (m) => m.id === this.form.medicoId
      );
      if (medicoSelecionado) {
        this.form.medicoNome = medicoSelecionado.nomeCompleto;
        this.carregarHorarios(medicoSelecionado);
      } else {
        this.horariosDisponiveis = [];
      }
    },


    async carregarHorarios(medico) {
      if (medico.diasAtendimento) {
        const hoje = new Date(); // Data e hora atual
        const diasSemana = {
          segunda: 1,
          terca: 2,
          quarta: 3,
          quinta: 4,
          sexta: 5,
          sabado: 6,
        };

        const horarios = [];

        for (const [dia, horariosDia] of Object.entries(medico.diasAtendimento)) {
          if (horariosDia && horariosDia.length > 0) {
            // Calcular a próxima data correspondente ao dia da semana
            const diff = (diasSemana[dia] - hoje.getDay() + 7) % 7;
            const proximaData = new Date(hoje);
            proximaData.setDate(hoje.getDate() + diff);
            proximaData.setHours(0, 0, 0, 0); // Resetar para início do dia

            // Verificar a disponibilidade de cada horário e se o horário já passou
            const horariosDiaDisponiveis = await Promise.all(
              horariosDia.map(async (horario) => {
                const [hora, minuto] = horario.split(":").map(Number);
                const horarioCompleto = new Date(proximaData);
                horarioCompleto.setHours(hora, minuto, 0, 0);

                const disponivel =
                  horarioCompleto > hoje && // Apenas horários futuros
                  (await this.verificarDisponibilidade(medico.id, horarioCompleto.toISOString()));

                return {
                  horario: `${proximaData.toLocaleDateString()} ${horario}`,
                  disponivel,
                };
              })
            );

            horarios.push(...horariosDiaDisponiveis);
          }
        }

        this.horariosDisponiveis = horarios.filter((h) => h.disponivel).length
          ? horarios
          : [{ horario: "Nenhum horário disponível", disponivel: false }];
      } else {
        this.horariosDisponiveis = [{ horario: "Nenhum horário disponível", disponivel: false }];
      }
    },

    async verificarDisponibilidade(medicoId, horario) {
      const db = getFirestore();
      const q = query(
        collection(db, "agendamentos"),
        where("medicoId", "==", medicoId),
        where("data", "==", horario)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.empty; // Retorna true se estiver disponível
    },


    calcularProximaData(diaSemana, dataAtual) {
      const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
      const diaIndex = diasSemana.indexOf(diaSemana.toLowerCase());
      const hojeIndex = dataAtual.getDay();
      const diferenca = (diaIndex - hojeIndex + 7) % 7 || 7;
      const proximaData = new Date(dataAtual);
      proximaData.setDate(dataAtual.getDate() + diferenca);
      return proximaData;
    },

    async submitForm() {
      try {
        const db = getFirestore();
        const q = query(
          collection(db, "agendamentos"),
          where("medicoId", "==", this.form.medicoId),
          where("data", "==", this.form.data)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          alert("Este horário já está ocupado. Por favor, escolha outro horário.");
          return;
        }

        // Salvar o agendamento no banco de dados
        await addDoc(collection(db, "agendamentos"), {
          especialidade: this.form.especialidade,
          medicoId: this.form.medicoId,
          medicoNome: this.form.medicoNome,
          local: this.form.local,
          data: this.form.data,
          pacienteId: this.pacienteLogado.usuarioId, // Adicionando o ID do paciente
          pacienteNome: this.pacienteLogado.nomeCompleto,
          pacienteTelefone: this.pacienteLogado.telefone,
          situacao: "Confirmada", // Adicionando o campo de situação com valor padrão
        });

        alert("Consulta agendada com sucesso!");
        this.$router.push("/");
      } catch (error) {
        console.error("Erro ao agendar consulta:", error);
        alert("Não foi possível agendar a consulta. Tente novamente.");
      }
    },
  },

  async mounted() {
    await this.verificarPacienteLogado();
    await this.fetchMedicos();
  },
};
</script>


<style scoped>
.card {
  border-radius: 20px;
  overflow: hidden;
}

.logo {
  max-width: 80%;
}

.form-label {
  font-size: 1rem;
}

.form-select,
.form-control {
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 10px;
}

.btn-lg {
  padding: 12px 30px;
  font-size: 1.2rem;
}

.bg-white {
  background-color: #fff;
}

.text-muted.text-decoration-line-through {
  color: #6c757d;
  text-decoration: line-through;
}

.text-success {
  color: #28a745 !important;
  /* Verde */
}

.text-danger {
  color: #dc3545 !important;
  /* Vermelho */
}
</style>
