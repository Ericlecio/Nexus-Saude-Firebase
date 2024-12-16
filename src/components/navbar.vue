<template>
    <nav class="navbar navbar-expand-lg" :class="{ scrolled: isScrolled }">
        <div class="container">
            <a class="navbar-brand" href="#">
                <img src="/src/assets/img/NexusSaude_horizontal.png" alt="Nexus Saúde" style="height: 55px" />
            </a>
            <button class="navbar-toggler" :class="{ collapsed: isCollapsed }" type="button" @click="toggleCollapse"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" :class="{ show: !isCollapsed }" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/sobre">Quem Somos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/contato">Fale Conosco</a>
                    </li>
                </ul>
                <div class="dropdown ms-3">
                    <a href="#" class="d-flex align-items-center text-dark text-decoration-none" data-bs-toggle="dropdown">
                        <i class="bi bi-person-circle me-2"></i>
                        <span v-if="userName">{{ userName }}</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li v-if="!userName"><a class="dropdown-item" href="/login">Login</a></li>
                        <li v-if="!userName"><a class="dropdown-item" href="/consultasAgendadas">Consultas</a></li>
                        <li v-else>
                            <a class="dropdown-item" href="/perfil">Perfil</a>
                        </li>
                        <li v-if="userName"><a class="dropdown-item" href="#" @click="logout">Sair</a></li>
                        <li><a class="dropdown-item" href="/medicos">Lista de Médicos</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>


<script>
export default {
    data() {
        return {
            isScrolled: false,
            isCollapsed: true,
            userName: null, 
        };
    },
    methods: {
        handleScroll() {
            this.isScrolled = window.scrollY > 50;
        },
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
        },
        logout() {
       
            localStorage.removeItem("userName");
            this.userName = null;

            this.$router.push("/login");
        },
    },
    mounted() {
   
        this.userName = localStorage.getItem("userName");
        window.addEventListener("scroll", this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener("scroll", this.handleScroll);
    },
};

</script>

<style scoped>

.navbar {
    background: transparent;
    color: white;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
    transition: background-color 0.4s ease, box-shadow 0.4s ease, padding 0.3s ease;
    box-shadow: none;
    padding: 15px 0;
}

.navbar.scrolled {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.navbar-brand {
    animation: slideIn 1s ease;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}


.navbar-nav .nav-link {
    color: #2c3e50; 
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 12px 18px;
    border-radius: 30px;
    transition: color 0.3s ease, transform 0.3s ease;
    background: none; 
}

.navbar-nav .nav-link:hover,
.navbar-nav .nav-link.active {
    color: #53ba83; 
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
}

/* Ícone de Usuário */
.bi-person-circle {
    color: #53ba83;
    font-size: 1.7rem;
    transition: color 0.3s ease;
}

.bi-person-circle:hover {
    color: #000524;
}


.dropdown-menu {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    backdrop-filter: blur(10px);
    border: none;
    padding: 12px 16px;
    animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dropdown-menu .dropdown-item {
    padding: 10px 15px;
    border-radius: 8px;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.dropdown-menu .dropdown-item:hover {
    background-color: #f1f1f1;
    transform: scale(1.05);
}

/* Navbar Toggler */
.navbar-toggler-icon {
    transition: 0.3s ease;
}

.navbar-toggler.collapsed .navbar-toggler-icon {
    transform: rotate(45deg);
}
</style>
