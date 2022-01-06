<template>
        <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
                <div class="box has-text-centered mb-6 pt-5 pb-5 ">
                    <h1 class="title pt-5">Prenotazione</h1>
                    <h2 class="subtitle pb-5">
                        Confermi di volerti iscrivere?
                    </h2>
                    <h3 class="title is-3 pt-5">{{Materia}}</h3>
                    <p>
                        {{Docente}}
                    </p>
                    <p >
                        {{Data}}
                    </p>
                        <button class="button mt-4 is-primary is-fullwidth">Conferma</button>
                        <button class="button mt-4 is-fullwidth">
                            Annulla
                        </button>
                </div>
        </div>
        <button class="modal-close is-large" aria-label="close"></button>
    </div>  
 </template>
<script>
export default {
    name: "ModalConferma"
}
</script>
