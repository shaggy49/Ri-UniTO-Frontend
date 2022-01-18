<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <router-link class="navbar-item is-primary is-active" to="/">
            Ri-UniTO
            </router-link>
            <a
                role="button"
                class="navbar-burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                @click="showNavbar = !showNavbar"
            >       
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu"  :class="{ 'is-active': showNavbar }">
            <div class="navbar-end">
                <router-link class="navbar-item center" :active-class='active' to="/prenota">
                    Prenota
                </router-link>
                <router-link class="navbar-item center" :active-class='active' to="/prenotazioni"> Le tue prenotazioni </router-link>
            </div>
            <div class="navbar-item has-dropdown is-hoverable" v-if="role=='admin'">
                <a class="navbar-link"> Admin tools </a>
                <div class="navbar-dropdown">
                    <router-link class="navbar-item" to="/admin/insegnanti" >Insegnanti</router-link>
                    <router-link class="navbar-item" to="/admin/corsi">Corsi</router-link>
                    <router-link class="navbar-item" to="/admin/prenotazioni">Prenotazioni</router-link>
                </div>
            </div>

            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <a @click="primaryButtonCliccato" class="button is-primary">
                            <strong>{{autenticato ? 'Disconnetti' : 'Accedi'}}</strong>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<style>
@import '../css/mystyles.css';
</style>

<script>
export default {
    name: 'NavBar',
    props:['accesso', 'autenticato', 'disconnetti', 'role'],

    methods:{
        testoBottoneAccesso (val){
            if(val)
                this.testo = 'Disconnetti';
            else
                this.testo = 'Accedi';     
        },
        primaryButtonCliccato(){
             if(this.autenticato)
                this.disconnetti();
            else
                this.accesso(); 
        },
    },
    data: function(){
        return{
            showNavbar: false,
            testo: 'Accedi',
            active:'is-tab is-active'
        }
    },
}
</script>