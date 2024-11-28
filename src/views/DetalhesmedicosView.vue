<template>
    <div>
      <Navbar />
      <div class="container py-5">
        <h1 class="text-center mb-4">{{ medico.nomeCompleto }}</h1>
  
        <div class="row mb-4">
          <div class="col-md-6">
            <h4>Especialidade: {{ medico.especialidade }}</h4>
            <h5>Preço da Consulta: R$ {{ medico.precoConsulta }}</h5>
          </div>
          <div class="col-md-6">
            <h4>Horários de Atendimento</h4>
            <ul>
              <li v-for="(horario, dia) in medico.diasAtendimento" :key="dia">
                <strong>{{ dia }}:</strong> {{ horario.inicio }} - {{ horario.fim }}
              </li>
            </ul>
          </div>
        </div>
  
        <div class="mb-4">
          <h4>Experiência:</h4>
          <p>{{ medico.experiencia }}</p>
        </div>
  
        <div class="mb-4">
          <h4>Avaliações:</h4>
          <div v-if="avaliacoes.length > 0">
            <ul>
              <li v-for="avaliacao in avaliacoes" :key="avaliacao.id">
                <strong>{{ avaliacao.paciente }}:</strong> {{ avaliacao.comentario }} ({{ avaliacao.nota }}/5)
              </li>
            </ul>
          </div>
          <div v-else>
            <p>Sem avaliações no momento.</p>
          </div>
        </div>
  
        <div class="text-center">
          <button class="btn btn-primary">Agendar Consulta</button>
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
        medico: null, // Dados do médico selecionado
        avaliacoes: [], // Avaliações dos pacientes
      };
    },
    methods: {
      async fetchMedicoDetails() {
        try {
          const dao = new DAOService("medicos");
          const medicoData = await dao.get(this.$route.params.id); // Buscar médico pelo ID
  
          this.medico = medicoData;
  
          // Aqui você pode buscar as avaliações do médico, se tiver alguma coleção de avaliações
          const avaliacoesDao = new DAOService("avaliacoes");
          this.avaliacoes = await avaliacoesDao.getAll(); // Buscar todas as avaliações
        } catch (error) {
          console.error("Erro ao buscar detalhes do médico: ", error);
        }
      },
    },
    mounted() {
      this.fetchMedicoDetails();
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 80%;
  }
  
  .card {
    border-radius: 10px;
    cursor: pointer;
  }
  
  .card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  ul {
    list-style-type: none;
  }
  </style>
  