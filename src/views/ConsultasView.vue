<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "MinhasConsultas",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      consultas: [
        {
          especialidade: "Cardiologia",
          profissional: "Dr. João Silva",
          local: "Clínica Nexus",
          dataHora: "2024-12-01 14:30",
          status: "Confirmada",
        },
        {
          especialidade: "Pediatria",
          profissional: "Dra. Maria Clara",
          local: "Clínica Nexus",
          dataHora: "2024-12-03 10:00",
          status: "Confirmada",
        },
        {
          especialidade: "Dermatologia",
          profissional: "Dr. Pedro Santos",
          local: "Clínica Nexus",
          dataHora: "2024-12-05 16:00",
          status: "Confirmada",
        },
      ],
    };
  },
  methods: {
    remarcarConsulta(index) {
      alert(`Você escolheu remarcar a consulta com ${this.consultas[index].profissional}.`);
    },
    cancelarConsulta(index) {
      if (confirm(`Deseja realmente cancelar a consulta com ${this.consultas[index].profissional}?`)) {
        this.consultas.splice(index, 1);
        alert("Consulta cancelada com sucesso.");
      }
    },
  },
};
</script>

<template>
  <div>
    <Navbar />
    <div class="container my-5">
      <!-- Título -->
      <h2 class="text-success text-center mb-4">Minhas Consultas</h2>
      <!-- Tabela de Consultas -->
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Especialidade</th>
            <th>Nome do Profissional</th>
            <th>Local</th>
            <th>Data e Hora</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(consulta, index) in consultas" :key="index">
            <td>{{ consulta.especialidade }}</td>
            <td>{{ consulta.profissional }}</td>
            <td>{{ consulta.local }}</td>
            <td>{{ consulta.dataHora }}</td>
            <td>{{ consulta.status }}</td>
            <td>
              <button class="btn btn-success btn-sm me-2" @click="remarcarConsulta(index)">Remarcar</button>
              <button class="btn btn-danger btn-sm" @click="cancelarConsulta(index)">Cancelar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.container {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

table {
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
}

th {
  background-color: #000524;
  color: #ffffff;
  text-align: center;
}

td {
  text-align: center;
  vertical-align: middle;
}

.btn {
  border-radius: 20px;
  font-size: 14px;
  padding: 5px 10px;
}

h2 {
  font-size: 24px;
  font-weight: bold;
}
</style>
