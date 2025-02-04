<template>
    <Navbar />
    <br />
    <div class="div-principal">
        <div class="container my-5">
            <BotaoVoltar />
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
                                        @click="confirmarAcao(consulta.id, 'cancelar')">
                                        <i class="fas fa-ban"></i> Cancelar
                                    </button>
                                    <button v-if="consulta.situacao === 'Confirmada'" class="btn btn-sm btn-success"
                                        @click="confirmarAcao(consulta.id, 'Presente')">
                                        <i class="fas fa-check-circle"></i> Presente
                                    </button>
                                    <button v-if="consulta.situacao === 'Confirmada'" class="btn btn-sm btn-danger"
                                        @click="confirmarAcao(consulta.id, 'Ausente')">
                                        <i class="fas fa-times-circle"></i> Ausente
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
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
    deleteDoc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import BotaoVoltar from "@/components/BotaoVoltar.vue"; // 🔹 Importando o componente


export default {
    name: "AgendaMedico",
    components: {
        Navbar,
        Footer,
        BotaoVoltar,
    },
    data() {
        return {
            consultas: [],
            carregando: true,
            showModal: false,
            consultaSelecionada: null,
            acaoSelecionada: null,
            modalMensagem: { titulo: "", texto: "" },
            filtroSituacao: "Confirmada",
            medicoId: null,
            opcoesFiltro: [
                { label: "Confirmadas", valor: "Confirmada" },
                { label: "Canceladas pelo Paciente", valor: "Cancelada pelo paciente" },
                { label: "Canceladas pelo Médico", valor: "Cancelada pelo médico" },
                { label: "Presente", valor: "Presente" },
                { label: "Ausente", valor: "Ausente" },
            ],
        };
    },
    computed: {
        consultasFiltradas() {
            return this.consultas.filter((consulta) => consulta.situacao === this.filtroSituacao);
        },
    },
    methods: {
        async verificarAutenticacao() {
            const auth = getAuth();
            const db = getFirestore();

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const medicoRef = doc(db, "medicos", user.uid);
                    const medicoSnap = await getDoc(medicoRef);

                    if (medicoSnap.exists()) {
                        this.medicoId = user.uid;
                        this.carregarConsultas();
                    } else {
                        alert("Acesso negado! Apenas médicos podem acessar esta página.");
                        this.$router.push("/login");
                    }
                } else {
                    alert("Você precisa estar logado para acessar esta página.");
                    this.$router.push("/login");
                }
            });
        },
        async carregarConsultas() {
            if (!this.medicoId) return;
            try {
                const db = getFirestore();

                // Buscar as consultas da tabela 'agendamentos'
                const q = query(collection(db, "agendamentos"), where("medicoId", "==", this.medicoId));
                const snapshot = await getDocs(q);
                let consultasAgendadas = snapshot.empty ? [] : snapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data(),
                }));

                // Buscar a agenda do médico na tabela 'medicos'
                const medicoRef = doc(db, "medicos", this.medicoId);
                const medicoSnap = await getDoc(medicoRef);

                let agendaConsultas = [];
                if (medicoSnap.exists() && medicoSnap.data().agenda) {
                    agendaConsultas = medicoSnap.data().agenda;
                }

                // Combinar ambas as listas
                this.consultas = [...consultasAgendadas, ...agendaConsultas];

            } catch (error) {
                console.error("Erro ao carregar consultas:", error);
                alert("Erro ao carregar consultas.");
            } finally {
                this.carregando = false;
            }
        },
        confirmarAcao(id, acao) {
            this.consultaSelecionada = id;
            this.acaoSelecionada = acao;

            let titulo = "";
            let texto = "";

            if (acao === "Presente") {
                titulo = "Confirmar Presença";
                texto = "Tem certeza de que deseja marcar esta consulta como Presente?";
            } else if (acao === "Ausente") {
                titulo = "Confirmar Ausência";
                texto = "Tem certeza de que deseja marcar esta consulta como Ausente?";
            } else if (acao === "cancelar") {
                titulo = "Confirmar Cancelamento";
                texto = "Tem certeza de que deseja cancelar esta consulta?";
            }

            this.modalMensagem = { titulo, texto };
            this.showModal = true;
        },
        async confirmarAcaoModal() {
            if (this.acaoSelecionada === "cancelar") {
                await this.atualizarSituacaoConsulta(this.consultaSelecionada, "Cancelada pelo médico");
            } else if (this.acaoSelecionada === "Presente") {
                await this.atualizarSituacaoConsulta(this.consultaSelecionada, "Presente");
            } else if (this.acaoSelecionada === "Ausente") {
                await this.atualizarSituacaoConsulta(this.consultaSelecionada, "Ausente");
            }
            this.showModal = false; // Fecha o modal após a ação
        },
        async atualizarSituacaoConsulta(id, situacao) {
            const db = getFirestore();
            const consultaRef = doc(db, "agendamentos", id);

            try {
                const consultaSnap = await getDoc(consultaRef);
                if (consultaSnap.exists()) {
                    const consulta = consultaSnap.data();
                    consulta.situacao = situacao;

                    // Adicionar consulta à agenda do médico
                    const medicoRef = doc(db, "medicos", consulta.medicoId);
                    await updateDoc(medicoRef, { agenda: arrayUnion(consulta) });

                    // Adicionar consulta à lista de consultas do paciente
                    const pacienteRef = doc(db, "pacientes", consulta.pacienteId);
                    await updateDoc(pacienteRef, { consultas: arrayUnion(consulta) });

                    // Remover a consulta da tabela de agendamentos
                    await deleteDoc(consultaRef);

                    // Atualizar a lista de consultas na interface
                    this.consultas = this.consultas.filter((c) => c.id !== id);

                    alert(`Consulta marcada como ${situacao}`);
                } else {
                    alert("Consulta não encontrada.");
                }
            } catch (error) {
                console.error("Erro ao atualizar a situação da consulta:", error);
                alert("Erro ao atualizar a situação. Tente novamente.");
            } finally {
                this.showModal = false;
            }
        },
    },
    mounted() {
        this.verificarAutenticacao();
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
