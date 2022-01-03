<template>
	<div class="column">
		<div class="box box-materia">
			{{materia}}
			<div class="box-materia-professore">
				{{professore}}
			</div>
		</div>
		<div v-if="editable">
			<!-- Inserire grafica modifiche -->
			modificabile
		</div>
	</div>
</template>
<script>
export default {
	name:'Subject',
	props:{
		id:Number,
		materia:String,
		professore:String,
		editable:{
			type:Boolean,
			default:false
		}
	},
	methods:{
		prenota(){
			//TODO implementare la funzione di prenotazione
		},
		confermaEsecuzione(){
			//TODO implementare la funzione di conferma esecuzione della prenotazione
		},
		disdiciPrenotazione(){
			//TODO implementare la funzione di disdetta della prenotazione
		}
	}

}
</script>

<style>

</style>