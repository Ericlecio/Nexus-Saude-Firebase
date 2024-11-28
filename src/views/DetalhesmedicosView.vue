<template>
  <div>
    <Navbar />
    <div class="container py-5">
      <h1 class="text-center mb-4">{{ medico ? medico.nomeCompleto : 'Carregando...' }}</h1>

      <div v-if="medico">
        <div class="row mb-4">
          <div class="col-md-6">
            <h4>Especialidade: {{ medico.especialidade }}</h4>
            <h5>Preço da Consulta: R$ {{ medico.precoConsulta }}</h5>
            <h5>CRM: {{ medico.crm }}</h5>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-md-12">s
            <h4>Experiência:</h4>
            <p>{{ medico.experiencia }}</p>
          </div>
        </div>

        <div class="mb-4">
          <h4>Horários de Atendimento:</h4>
          <div v-if="medico.diasAtendimento && Object.keys(medico.diasAtendimento).length > 0">
            <ul>
              <li v-for="(horario, dia) in medico.diasAtendimento" :key="dia">
                <strong>{{ dia.charAt(0).toUpperCase() + dia.slice(1) }}:</strong> 
                {{ horario.inicio }} - {{ horario.fim }}
              </li>
            </ul>
          </div>
          <div v-else>
            <p>Sem horários definidos.</p>
          </div>
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
      avaliacoes: [], 
      loading: true,
    };
  },
  methods: {
    async fetchMedicoDetails() {
      try {
        const usuarioId = this.$route.params.id; 
        console.log('ID do Usuário (Médico):', usuarioId); 

        const dao = new DAOService("usuarios");
        const usuarioData = await dao.get(usuarioId); 

        console.log('Dados do Usuário:', usuarioData); 

        if (usuarioData && usuarioData.tipo === "medico") {
          const medicoDetails = await dao.getFromCollection("medicos", usuarioId); 
          console.log('Detalhes do Médico:', medicoDetails); 
          
          this.medico = { ...usuarioData, ...medicoDetails };
        } else {
          console.error("Usuário não é um médico");
        }

        // Buscar as avaliações (caso necessário)
        const avaliacoesDao = new DAOService("avaliacoes");
        this.avaliacoes = await avaliacoesDao.search("medicoId", usuarioId); 
        console.log('Avaliações do Médico:', this.avaliacoes); 
      } catch (error) {
        console.error("Erro ao buscar detalhes do médico: ", error);
      } finally {
        this.loading = false;
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
