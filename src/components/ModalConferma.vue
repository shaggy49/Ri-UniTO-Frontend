<template>
        <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
                <div class="box has-text-centered mb-6 pt-5 pb-5 ">
                    <h1 class="title pt-5">{{payload.actionTitle}}</h1>
                    <h2 class="subtitle pb-5" style="white-space: pre-line">
                        {{payload.actionText}}
                    </h2>
                    <h3 class="title is-3 pt-3" v-if="isMateria()">{{payload.materia.materia}}</h3>
                    <p v-if="isMateria()">
                        {{payload.materia.docente}}
                    </p>
                    <p v-if="isInsegnanteWithID()" >
                        {{payload.insegnante.id}}
                    </p>
                    <p v-if="isInsegnante()" >
                        {{payload.insegnante.nome + " "+ payload.insegnante.cognome }}
                    </p>
                    <p v-if="isCorsoWithID()" >
                        {{payload.corso.id}}
                    </p>
                    <p v-if="isCorso()" >
                        {{payload.corso.titoloCorso}}
                    </p>
                    <p v-if="isMateria()" >
                        {{payload.materia.data + " "+ payload.materia.orario}}
                    </p>

                    <div v-if="isAddingNewReservation()">
                        <p class="is-capitalized">{{payload.ripetizione.materia}}</p>
                        <p class="is-capitalized">{{payload.ripetizione.professore}}</p>
                        <p class="is-capitalized">{{payload.ripetizione.giorno + ' ' + payload.ripetizione.ora}}</p>
                    </div>
                    <div v-if="isBookingForUser()">
                        <p class="is-capitalized">{{payload.bookingForUser.email}}</p>
                        <p class="is-capitalized">{{payload.bookingForUser.materia}}</p>
                        <p class="is-capitalized">{{payload.bookingForUser.professore}}</p>
                        <p class="is-capitalized">{{payload.bookingForUser.data + ' ' + payload.bookingForUser.ora}}</p>
                    </div>
                        <button @click="confirmAction" class="button mt-4 is-primary is-fullwidth">Conferma</button>
                        <button @click="cancelAction" class="button mt-4 is-fullwidth">
                            Annulla
                        </button>
                </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="cancelAction"></button>
    </div>  
</template>
<script>
export default {
    name: "ModalConferma",
    props:['payload', 'confirmAction', 'cancelAction'],
    methods:{
        isMateria(){
            return 'materia' in this.payload ? true : false;
        },
        isInsegnante(){
            return 'insegnante' in this.payload ? true : false;
        },
        isInsegnanteWithID(){
            return this.isInsegnante() && 'id' in this.payload.insegnante ? true : false; 
        },
        isCorso(){
            return 'corso' in this.payload ? true : false;
        },
        isCorsoWithID(){
            return this.isCorso() && 'id' in this.payload.corso ? true : false; 
        },
        isAddingNewReservation(){
            return 'ripetizione' in this.payload ? true : false; 
        },
        isBookingForUser(){
            return 'bookingForUser' in this.payload ? true : false; 
        }
    }
}
</script>
