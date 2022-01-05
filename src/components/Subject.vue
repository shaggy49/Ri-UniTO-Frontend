<template>
	<div class="column" @click="test()">
		<div class="box box-materia is-size-4">
			
			{{materia}}
			<span v-if="editable" class="ml-2 has-text-right tag is-link">Prenotata</span>
			<div class="box-materia-professore">
				{{professore}}
			</div>
			<div v-if="editable" class="mt-4 has-text-right">
				<!-- Inserire grafica modifiche -->
				<button class="button is-success is-light mr-2">Effettuata</button>
				<button class="button is-danger is-light ">Disdici</button>
			</div>
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
		test(){
			console.log(this.id)
		},
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