<template>
        <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
                <div class="box has-text-centered mb-6 pt-5 pb-5 ">
                    <h1 class="title pt-5">{{payload.actionTitle}}</h1>
                    <h2 class="subtitle pb-5" style="white-space: pre-line">
                        {{payload.actionText}}
                    </h2>
                    <h3 class="title is-3 pt-3">{{payload.materia.materia}}</h3>
                    <p>
                        {{payload.materia.docente}}
                    </p>
                    <p >
                        {{payload.materia.data + " "+ payload.materia.orario}}
                    </p>
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

}
</script>
