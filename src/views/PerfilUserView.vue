<template>
    <Navbar />
    <div class="profile-container">
      <div class="profile-content">
        <div class="profile-header">
          <h1>Perfil do Usuário</h1>
          <p>Bem-vindo(a), <span>{{ userName }}</span>!</p>
        </div>
  
        <div class="profile-info">
          <div class="info-item">
            <label>Nome:</label>
            <p>{{ userName }}</p>
          </div>
          <div class="info-item">
            <label>E-mail:</label>
            <p>{{ userEmail }}</p>
          </div>
          <div class="info-item">
            <label>Tipo de Usuário:</label>
            <p>{{ userType }}</p>
          </div>
  
          <!-- Se for médico, mostra o CRM e especialidade -->
          <div v-if="userType === 'medico'" class="info-item">
            <label>CRM:</label>
            <p>{{ userCrm }}</p>
          </div>
  
          <!-- Se for médico, inclui a especialidade -->
          <div v-if="userType === 'medico'" class="info-item">
            <label>Especialidade:</label>
            <input v-model="userSpecialty" type="text" placeholder="Digite sua especialidade" />
          </div>
  
          <!-- Se for paciente, mostra informações adicionais específicas -->
          <div v-if="userType === 'paciente'" class="info-item">
            <label>Idade:</label>
            <p>{{ userAge }} anos</p>
          </div>
          <div v-if="userType === 'paciente'" class="info-item">
            <label>Endereço:</label>
            <p>{{ userAddress }}</p>
          </div>
  
          <!-- Formulário de Cadastro com dados adicionais -->
          <div v-if="userType === 'paciente' || userType === 'medico'" class="info-item">
            <label>Informações adicionais</label>
            <div v-if="userType === 'medico'">
              <input v-model="userCrm" type="text" placeholder="Digite seu CRM" />
              <input v-model="userSpecialty" type="text" placeholder="Digite sua especialidade" />
            </div>
            <div v-if="userType === 'paciente'">
              <input v-model="userAge" type="number" placeholder="Digite sua idade" />
              <input v-model="userAddress" type="text" placeholder="Digite seu endereço" />
            </div>
          </div>
  
        </div>
  
        <div class="profile-actions">
          <button @click="editProfile" class="btn">Editar Perfil</button>
          <button @click="logout" class="btn btn-logout">Logout</button>
        </div>
      </div>
    </div>
    <Footer />
  </template>
  
  <script>
  import Navbar from "@/components/Navbar.vue";
  import Footer from "@/components/Footer.vue";
  
  export default {
    name: "ProfileScreen",
    components: {
      Navbar,
      Footer,
    },
    data() {
      return {
        userName: localStorage.getItem("userName") || "Usuário", // Assume que o nome foi salvo na autenticação
        userEmail: "usuario@exemplo.com", // Exemplo de email
        userType: "paciente", // Pode ser "paciente" ou "medico"
        userCrm: "123456", // CRM do médico
        userSpecialty: "", // Especialidade do médico
        userAge: 30, // Idade do paciente
        userAddress: "Rua Exemplo, 123, Bairro", // Endereço do paciente
      };
    },
    methods: {
      editProfile() {
        this.$router.push("/editar-perfil"); // Redireciona para página de edição do perfil
      },
      logout() {
        localStorage.removeItem("userName"); // Limpa as informações do usuário
        this.$router.push("/login"); // Redireciona para a página de login
      },
    },
  };
  </script>
  
  <style scoped>
  .profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: url("@/assets/img/img_fundo.png") no-repeat center center fixed;
    background-size: cover;
  }
  
  .profile-content {
    width: 80%;
    max-width: 900px;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 30px;
    border-radius: 8px;
    color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
  
  .profile-header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .profile-header h1 {
    font-size: 32px;
    color: white;
  }
  
  .profile-header p {
    font-size: 18px;
  }
  
  .profile-info {
    margin-bottom: 30px;
  }
  
  .info-item {
    margin-bottom: 15px;
  }
  
  .info-item label {
    font-weight: bold;
  }
  
  .info-item input {
    padding: 10px;
    width: 100%;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .profile-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .btn {
    padding: 12px 20px;
    background-color: #53ba83;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn:hover {
    background-color: #429f6d;
  }
  
  .btn-logout {
    background-color: #d9534f;
  }
  
  .btn-logout:hover {
    background-color: #c9302c;
  }
  
  .profile-actions button {
    width: 48%;
  }
  </style>
  