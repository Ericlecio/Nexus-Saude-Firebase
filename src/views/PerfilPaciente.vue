<template>
  <div>
    <Navbar />
    <div class="container py-5">
      <h1 class="text-center mb-4 text-primary">
        {{ paciente ? paciente.nomeCompleto : "Carregando..." }}
      </h1>

      <div v-if="paciente">
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fas fa-info-circle me-2 text-primary"></i>
              <strong>Informações Pessoais</strong>
            </h5>
            <p><strong>Nome Completo:</strong> {{ paciente.nomeCompleto }}</p>
            <p><strong>E-mail:</strong> {{ paciente.email }}</p>
            <p><strong>Plano de Saúde:</strong> {{ paciente.planoSaude }}</p>
          </div>
        </div>

        <button class="btn btn-danger" @click="deletarConta">Excluir Conta</button>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "PerfilPaciente",
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      paciente: null,
    };
  },
  methods: {
    async carregarPerfil() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.tipo === "paciente") {
        this.paciente = user;
      } else {
        alert("Acesso negado!");
        this.$router.push("/");
      }
    },
    deletarConta() {
      if (confirm("Tem certeza que deseja excluir sua conta?")) {
        localStorage.removeItem("user");
        this.$router.push("/");
      }
    },
  },
  mounted() {
    this.carregarPerfil();
  },
};
</script>
