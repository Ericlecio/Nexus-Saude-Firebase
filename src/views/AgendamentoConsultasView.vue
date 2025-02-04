<template>
  <Navbar />
  <div class="container-fluid py-5 mt-5">
    <div class="row justify-content-center align-items-center">
      <div class="col-lg-10 col-md-12">
        <BotaoVoltar />
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div class="row g-0">
            <div class="col-md-4 d-none d-md-flex align-items-center justify-content-center bg-light">
              <img src="@/assets/img/NexusSaude_vertical.png" alt="Imagem Nexus Saúde" class="img-fluid logo" />
            </div>
            <div class="col-md-8 p-5 bg-white">
              <h1 class="text-center text-primary mb-3 font-weight-bold">
                Nexus Saúde
              </h1>
              <p class="text-center text-muted mb-4">
                Agende sua consulta com facilidade
              </p>
              <form @submit.prevent="submitForm">

                <!-- Linha 1 -->
                <div class="row g-4">
                  <div class="col-md-4 col-sm-12">
                    <label for="especialidade" class="form-label text-dark fw-bold">Especialidade</label>
                    <select v-model="form.especialidade" id="especialidade" class="form-select"
                      @change="filterMedicosByEspecialidade" required>
                      <option value="" disabled selected>Selecione</option>
                      <option v-for="especialidade in especialidades" :key="especialidade" :value="especialidade">
                        {{ especialidade }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <label for="medicoNome" class="form-label text-dark fw-bold">Médico</label>
                    <select v-model="form.medicoId" id="medico" class="form-select" required @change="medicoChanged">
                      <option value="" disabled selected>Selecione</option>
                      <option v-for="medico in medicosFiltrados" :key="medico.id" :value="medico.id">
                        {{ medico.nomeCompleto }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <label for="data" class="form-label text-dark fw-bold">Horários Disponíveis</label>
                    <select v-model="form.data" id="data" class="form-select" required>
                      <option value="" disabled selected>Selecione</option>
                      <option v-for="horario in horariosDisponiveis" :key="horario.horario" :value="horario.horario">
                        {{ horario.horario }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Linha 2 -->
                <div class="row g-4 mt-3">
                  <div class="col-md-4 col-sm-12">
                    <label for="pacienteNome" class="form-label text-dark fw-bold">Paciente</label>
                    <input type="text" id="pacienteNome" v-model="form.pacienteNome" class="form-control" readonly />
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <label for="telefoneConsultorio" class="form-label text-dark fw-bold">Telefone do
                      Consultório</label>
                    <input type="text" id="telefoneConsultorio" v-model="form.telefoneConsultorio" class="form-control"
                      readonly />
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <label for="valorConsulta" class="form-label text-dark fw-bold">Valor da Consulta</label>
                    <input type="text" id="valorConsulta" v-model="form.valorConsulta" class="form-control" readonly />
                  </div>
                </div>

                <!-- Linha 3 -->
                <div class="row g-4 mt-3">
                  <div class="col-md-4 col-sm-12">
                    <label for="pacienteTelefone" class="form-label text-dark fw-bold">Telefone</label>
                    <input type="text" id="pacienteTelefone" v-model="form.pacienteTelefone" class="form-control"
                      readonly />
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <label for="local" class="form-label text-dark fw-bold">Local</label>
                    <input type="text" id="local" v-model="form.local" class="form-control" readonly />
                  </div>
                </div>

                <!-- Botões -->

                <div class="text-center mt-4">
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
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import BotaoVoltar from "@/components/BotaoVoltar.vue"; // 🔹 Importando o componente


export default {
  name: "AgendamentoConsulta",
  components: {
    Navbar,
    Footer,
    BotaoVoltar,
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
        telefoneConsultorio: "",
        valorConsulta: "",
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
      const auth = getAuth();
      const db = getFirestore();

      onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) {
          alert("Apenas pacientes podem agendar consultas. Faça login.");
          this.$router.push("/login");
          return;
        }

        try {
          console.log("✅ Usuário autenticado:", firebaseUser.uid);

          // 🔹 Busca o paciente pelo UID no Firestore
          const pacienteRef = doc(db, "pacientes", firebaseUser.uid);
          const pacienteSnap = await getDoc(pacienteRef);

          if (pacienteSnap.exists()) {
            const pacienteData = pacienteSnap.data();
            console.log("🔹 Dados do paciente carregados:", pacienteData);

            this.pacienteLogado = {
              id: firebaseUser.uid,
              ...pacienteData
            };

            this.form.pacienteNome = pacienteData.nomeCompleto || "Nome não informado";
            this.form.pacienteTelefone = pacienteData.telefone || "Não informado";
          } else {
            console.error("❌ Paciente não encontrado no Firestore.");
            alert("Paciente não cadastrado no sistema.");
            this.$router.push("/login");
          }
        } catch (error) {
          console.error("🚨 Erro ao carregar dados do paciente:", error);
          alert("Erro ao carregar dados do paciente.");
        }
      });
    },

    async fetchMedicos() {
      try {
        const db = getFirestore();
        const q = query(collection(db, "medicos"));
        const querySnapshot = await getDocs(q);

        this.medicos = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            telefoneConsultorio: data.telefoneConsultorio || "Não informado",
            valorConsulta: data.valorConsulta ? `${data.valorConsulta}` : "Não informado"
          };
        });

        this.especialidades = [...new Set(this.medicos.map((medico) => medico.especialidade))];

        console.log("✅ Médicos carregados:", this.medicos); // Para verificar se os dados estão sendo carregados corretamente
      } catch (error) {
        console.error("❌ Erro ao carregar médicos:", error);
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

    async medicoChanged() {
      const medicoSelecionado = this.medicos.find((m) => m.id === this.form.medicoId);

      if (medicoSelecionado) {
        this.form.medicoNome = medicoSelecionado.nomeCompleto || "Nome não informado";
        this.form.telefoneConsultorio = medicoSelecionado.telefoneConsultorio || "Não informado";
        this.form.valorConsulta = medicoSelecionado.valorConsulta ? `${medicoSelecionado.valorConsulta},00` : "Não informado";

        console.log("✅ Dados do médico selecionado:", medicoSelecionado); // Para verificar se os dados estão sendo carregados corretamente

        this.carregarHorarios(medicoSelecionado);
      } else {
        this.horariosDisponiveis = [];
        this.form.telefoneConsultorio = "Não informado";
        this.form.valorConsulta = "Não informado";
      }
    },

    async carregarHorarios(medico) {
      if (!medico.diasAtendimento) {
        this.horariosDisponiveis = [{ horario: "Nenhum horário disponível", disponivel: false }];
        return;
      }

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Remove horas para comparação correta

      const duasSemanasDepois = new Date();
      duasSemanasDepois.setDate(hoje.getDate() + 14); // Definir limite de 2 semanas

      const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
      const horarios = [];

      for (let i = 0; i < 14; i++) { // Iterar pelos próximos 14 dias
        const dataConsulta = new Date(hoje);
        dataConsulta.setDate(hoje.getDate() + i);
        dataConsulta.setHours(0, 0, 0, 0); // Resetando horário

        const nomeDiaSemana = diasSemana[dataConsulta.getDay()];

        if (!medico.diasAtendimento[nomeDiaSemana]) continue; // Se o médico não atende nesse dia, pula para o próximo

        for (const horario of medico.diasAtendimento[nomeDiaSemana]) {
          const [hora, minuto] = horario.split(":").map(Number);
          const horarioCompleto = new Date(dataConsulta);
          horarioCompleto.setHours(hora, minuto, 0, 0);

          // Remover horários passados
          if (horarioCompleto < new Date()) continue;

          const horarioFormatado = `${horarioCompleto.toLocaleDateString("pt-BR")} ${horario}`;

          const disponivel = await this.verificarDisponibilidade(medico.id, horarioFormatado);
          if (disponivel) {
            horarios.push({ horario: horarioFormatado });
          }
        }
      }

      this.horariosDisponiveis = horarios.length
        ? horarios
        : [{ horario: "Nenhum horário disponível", disponivel: false }];
    },

    async verificarDisponibilidade(medicoId, horarioCompleto) {
      const db = getFirestore();

      // Verifica se já existe um agendamento para esse horário
      const q = query(
        collection(db, "agendamentos"),
        where("medicoId", "==", medicoId),
        where("data", "==", horarioCompleto)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.empty; // Retorna `true` se o horário está disponível, `false` se já estiver ocupado
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

        await addDoc(collection(db, "agendamentos"), {
          especialidade: this.form.especialidade,
          medicoId: this.form.medicoId,
          medicoNome: this.form.medicoNome,
          telefoneConsultorio: this.form.telefoneConsultorio, // ✅ Adicionando telefone do consultório
          valorConsulta: this.form.valorConsulta, // ✅ Adicionando valor da consulta
          local: this.form.local,
          data: this.form.data,
          pacienteId: this.pacienteLogado.id,
          pacienteNome: this.form.pacienteNome,
          pacienteTelefone: this.form.pacienteTelefone,
          situacao: "Confirmada",
        });

        alert("Consulta agendada com sucesso!");
        this.$router.push("/");
      } catch (error) {
        console.error("❌ Erro ao agendar consulta:", error);
        alert("Não foi possível agendar a consulta. Tente novamente.");
      }
    },
  },

  async mounted() {
    console.log("📌 Página de Agendamento carregada...");
    await this.verificarPacienteLogado();
    await this.fetchMedicos();
  }
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

/* 🔹 Tornando os campos responsivos */
@media (max-width: 768px) {
  .col-md-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
