<template>
  <div>
    <Navbar />
    <div class="container py-5">
      <h1 class="text-center mb-4">Lista de Médicos</h1>

      <div v-if="loading" class="text-center">
        <p>Carregando médicos...</p>
      </div>

      <div class="row" v-else>
        <div class="col-md-4 mb-4" v-for="medico in medicos" :key="medico.id">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">{{ medico.nomeCompleto }}</h5>
              <p class="card-text">E-mail: {{ medico.email }}</p>
              <button class="btn btn-primary" @click="goToMedicoDetails(medico.id)">Ver Detalhes</button>
            </div>
          </div>
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
  name: "ListaMedicos",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      medicos: [],
      loading: true,
    };
  },
  methods: {
    async fetchMedicos() {
      try {
        const dao = new DAOService("usuarios");
        const usuarios = await dao.getAll();

        this.medicos = usuarios.filter(usuario => usuario.tipo === "medico");
      } catch (error) {
        console.error("Erro ao buscar médicos: ", error);
      } finally {
        this.loading = false;
      }
    },
    goToMedicoDetails(id) {
      this.$router.push({ name: 'DetalhesMedicos', params: { id } });
    },
  },
  mounted() {
    this.fetchMedicos();
  },
};
</script>

<style scoped>
.container {
  max-width: 90%;
}

.card {
  border-radius: 10px;
  cursor: pointer;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
