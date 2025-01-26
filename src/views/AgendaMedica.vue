<template>
    <Navbar />
    <br />
    <div class="div-principal">
        <div class="container my-5">
            <button class="btn btn-primary btn-back" @click="voltarPagina">
                <i class="fas fa-arrow-left me-2"></i> Voltar
            </button>

            <h2 class="text-center text-primary fw-bold mb-4">Minhas Consultas</h2>

            <div v-if="carregando" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="mt-3 text-muted">Carregando suas consultas...</p>
            </div>

            <div v-else>
                <!-- Menu de Filtros -->
                <ul class="nav nav-pills justify-content-center mb-4">
                    <li class="nav-item" v-for="opcao in opcoesFiltro" :key="opcao.valor">
                        <a class="nav-link" :class="{ active: filtroSituacao === opcao.valor }"
                            @click="filtroSituacao = opcao.valor">
                            {{ opcao.label }}
                        </a>
                    </li>
                </ul>

                <div class="table-responsive">
                    <table class="table table-striped table-hover shadow-sm">
                        <thead class="table-primary">
                            <tr>
                                <th>Especialidade</th>
                                <th>Paciente</th>
                                <th>Telefone</th>
                                <th>Local</th>
                                <th>Data e Hora</th>
                                <th>Situação</th>
                                <th class="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="consulta in consultasFiltradas" :key="consulta.id"
                                :class="{ 'consulta-cancelada': consulta.situacao.toLowerCase().includes('cancelada') }">
                                <td>{{ consulta.especialidade || 'Não informado' }}</td>
                                <td>{{ consulta.pacienteNome || 'Não disponível' }}</td>
                                <td>{{ consulta.pacienteTelefone || 'Não informado' }}</td>
                                <td>{{ consulta.local || 'Não informado' }}</td>
                                <td>{{ consulta.data || 'Não informado' }}</td>
                                <td>{{ consulta.situacao || 'Não informado' }}</td>
                                <td class="text-center">
                                    <button v-if="consulta.situacao === 'Confirmada'" class="btn btn-sm btn-warning"
                                        @click="confirmarCancelamento(consulta.id)">
                                        <i class="fas fa-ban"></i> Cancelar
                                    </button>
                                    <button v-if="consulta.situacao.toLowerCase().includes('cancelada')"
                                        class="btn btn-sm btn-danger" @click="confirmarExclusao(consulta.id)">
                                        <i class="fas fa-trash"></i> Excluir
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p v-if="!consultasFiltradas.length" class="text-center text-muted">Nenhuma consulta encontrada.</p>
            </div>
        </div>

        <!-- Modal de confirmação de cancelamento/exclusão -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <h4 class="text-center text-danger fw-bold">{{ modalMensagem.titulo }}</h4>
                <p class="text-center">{{ modalMensagem.texto }}</p>
                <div class="text-center mt-3">
                    <button class="btn btn-danger me-3" @click="confirmarAcaoModal">Confirmar</button>
                    <button class="btn btn-secondary" @click="showModal = false">Fechar</button>
                </div>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script>
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
    name: "AgendaMedico",
    components: {
        Navbar,
        Footer,
    },
    data() {
        return {
            consultas: [],
            carregando: true,
            showModal: false,
            consultaSelecionada: null,
            acaoSelecionada: null,
            modalMensagem: { titulo: "", texto: "" },
            filtroSituacao: "todas",
            opcoesFiltro: [
                { label: "Todas", valor: "todas" },
                { label: "Confirmadas", valor: "Confirmada" },
                { label: "Canceladas pelo Paciente", valor: "Cancelada pelo paciente" },
                { label: "Canceladas pelo Médico", valor: "Cancelada pelo médico" },
            ],
        };
    },
    computed: {
        consultasFiltradas() {
            let filtradas = [...this.consultas];

            if (this.filtroSituacao !== "todas") {
                filtradas = filtradas.filter(consulta => consulta.situacao === this.filtroSituacao);
            }

            filtradas.sort((a, b) => new Date(a.data) - new Date(b.data));
            return filtradas;
        },
    },
    methods: {
        async carregarConsultas() {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || user.tipo !== "medico" || !user.id) {
                    alert("Apenas médicos podem acessar esta página. Faça login.");
                    this.$router.push("/login");
                    return;
                }

                const db = getFirestore();
                const q = query(collection(db, "agendamentos"), where("medicoId", "==", user.id));
                const snapshot = await getDocs(q);

                this.consultas = snapshot.empty ? [] : snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
            } catch (error) {
                console.error("Erro ao carregar consultas:", error);
                alert("Erro ao carregar consultas.");
            } finally {
                this.carregando = false;
            }
        },

        confirmarCancelamento(id) {
            this.consultaSelecionada = id;
            this.acaoSelecionada = "cancelar";
            this.modalMensagem = {
                titulo: "Confirmar Cancelamento",
                texto: "Tem certeza de que deseja cancelar esta consulta?",
            };
            this.showModal = true;
        },

        async cancelarConsulta() {
            const db = getFirestore();
            await updateDoc(doc(db, "agendamentos", this.consultaSelecionada), { situacao: "Cancelada pelo médico" });
            this.consultas = this.consultas.map(c => c.id === this.consultaSelecionada ? { ...c, situacao: "Cancelada pelo médico" } : c);
            this.showModal = false;
        },

        confirmarExclusao(id) {
            this.consultaSelecionada = id;
            this.acaoSelecionada = "excluir";
            this.modalMensagem = {
                titulo: "Confirmar Exclusão",
                texto: "Tem certeza de que deseja excluir esta consulta permanentemente?",
            };
            this.showModal = true;
        },

        async excluirConsulta() {
            const db = getFirestore();
            await deleteDoc(doc(db, "agendamentos", this.consultaSelecionada));
            this.consultas = this.consultas.filter(c => c.id !== this.consultaSelecionada);
            this.showModal = false;
        },

        async confirmarAcaoModal() {
            if (this.acaoSelecionada === "cancelar") await this.cancelarConsulta();
            else if (this.acaoSelecionada === "excluir") await this.excluirConsulta();
        },

        voltarPagina() {
            this.$router.push("/");
        },
    },
    async mounted() {
        await this.carregarConsultas();
    },
};
</script>


<style scoped>
.div-principal {
    margin-top: 5%;
}

.btn-back {
    border-radius: 10px;
    padding: 10px 20px;
}

.nav-pills .nav-link {
    color: #53ba83;
    cursor: pointer;
}

.nav-pills .nav-link.active {
    background-color: #53ba83;
    color: white;
}

.table {
    border: 1px solid #ddd;
    border-radius: 10px;
}

.consulta-cancelada td {
    text-decoration: line-through;
    background: rgba(0, 0, 30, 0.1);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    text-align: center;
}
</style>
