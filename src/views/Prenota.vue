<template>
	<div class="container pt-6">
		<ModalConferma
			v-if="subjectPrenotating"
			:payload="subjectPrenotating"
			:confirmAction="axiosBookReservation"
			:cancelAction="clearOngoingAction"
		/>
		<ModalGenerico
			v-if="esitoOperazione"
			:isSuccess="esitoOperazione.success"
			:title="esitoOperazione.title"
			:subtitle="esitoOperazione.subtitle"
			:btnPrimary="esitoOperazione.btnPrimary"
			:btnSecondary="esitoOperazione.btnSecondary"
			:btnPAction="clearOngoingAction"
			:btnCloseAction="clearOngoingAction"
		/>
		<header>
			<h1 class="title">Prenota</h1>
			<h2 class="subtitle">Seleziona le materie a cui vuoi prenotarti</h2>
		</header>
		<div class="container pt-4">
			<div class="card pt-5">
				<header class="has-text-centered">
					<span class="icon-text is-vcentered is-size-4">
						<span class="icon is-vcentered faarrows is-size-6" @click="changeDay(-1)">
							<ion-icon name="chevron-back-outline" ></ion-icon>
						</span>
						<span
							><h1 class="mr-2 ml-2">{{ dayWeeks.extended[dayKey] }}</h1></span
						>
						<span
							class="icon is-vcentered faarrows is-size-6"
							@click="changeDay(1)"
						>
							<ion-icon name="chevron-forward-outline" ></ion-icon>
						</span>
					</span>
				</header>
				<div class="card-content" v-if="parsed">
					<div class="columns is-fixed-top"  v-for="(mat, index) in currentDaySubjects" :key="index">
						<div class="column is-1 has-text-right has-text-centered-mobile">
							<div class="mt-1">
								<p>{{convertTimeKey(index)}}</p>
							</div>
						</div>

						<div class="column is-11">
							<div class="columns is-mobile is-multiline">
								<Subject
									v-for="elem in mat"
									:key="elem.id"
									:id="elem.id"
									v-on:pPrenota="askReservation"
									:editable="false"
									:materia="elem.course.title"
									:orario="convertTimeKey(index)"
									:professore="elem.teacher.name + ' ' + elem.teacher.surname"
								/>
							</div>
						</div>
					</div>
					<p class="mb-6"></p>
				</div>
				<div class="card-content" v-else>
					<progress class="progress is-small is-primary mt-5" max="100">15%</progress>
				</div>
			</div>
		</div>
	</div>
</template>

<style></style>

<script>
import Subject from "../components/Subject";
import axios from "axios";
import ModalConferma from '../components/ModalConferma.vue'
import ModalGenerico from '../components/ModalGenerico.vue'

export default {
	data: function () {
		return {
			dayKey: 0,
			parsed: false,
			materie: [],
			materieFiltered: {
			},
			currentDaySubjects:[],
			dayWeeks:{
				short:[
					'lun',
					'mar',
					'mer',
					'gio',
					'ven'
				],
				extended:[
				'lunedì',
				'martedì',
				'mercoledì',
				'giovedì',
				'venerdì'
			]},
			esitoOperazione:null,
			subjectPrenotating:null
			
		};
	},
	mounted() {
		this.getReservationsAvailable();
	},
	methods: {
		convertTimeKey(mat){
			var convertedTime = '';
			switch(mat){
				case 'time15':
					convertedTime = '15-16';
				break;
				case 'time16':
					convertedTime = '16-17';
				break;
				case 'time17':
					convertedTime = '17-18';
				break;
				case 'time18':
					convertedTime = '18-19';
				break;
			}
			return convertedTime;
		},
		getReservationsAvailable() {
			var self = this;

			axios
				.get(
					process.env.VUE_APP_SERVER_ADDRESS +
						"/available-reservations"
				)
				.then(function (response) {
					
					console.log(response);
					//TODO controllare il codice della response per vedere se parsare i dati o meno
					self.materie=response.data;
					self.filterSubjects();
					
				})
				.catch(function (error) {
					self.loginResponse = "" + error;
				})
				.finally(function () {
					self.caricamento = false;
				});
		},
		changeDay(operation){
			
			if(operation == -1){
				this.dayKey = this.dayKey==0?4:this.dayKey-1;
			}
			else 
				this.dayKey  = this.dayKey==4?0:this.dayKey+1;
			this.currentDaySubjects = this.materieFiltered[this.dayWeeks.short[this.dayKey]];
		},
		filterSubjects(){
			var lun = [];
			var mar = [];
			var mer = [];
			var gio = [];
			var ven = [];
			this.materie.forEach((elem) => {
				console.log(elem.date);
				/* if(elem.date=='lun')
					this.materieFiltered.lun[0][this.materieFiltered.lun.length()-1] = elem; */
				switch(elem.date){
					case 'lun':
						lun.push(elem);
						break;
					case 'mar':
						mar.push(elem);
						break;
					case 'mer':
						mer.push(elem);
						break;
					case 'gio':
						gio.push(elem);
						break;
					case 'ven':
						ven.push(elem);
						break;
					default:
						break;

				}
			});
			this.materieFiltered.lun = lun;
			this.materieFiltered.mar = mar;
			this.materieFiltered.mer = mer;
			this.materieFiltered.gio = gio;
			this.materieFiltered.ven = ven;
			this.filterSubjectsByHour();
		},
		filterSubjectsByHour(){
			var time15 = [];
			var time16 = [];
			var time17 = [];
			var time18 = [];
			for(const key in this.materieFiltered){
				this.materieFiltered[key].forEach(elem => {
					switch(elem.time){
						case '15':
							time15.push(elem);
							break;
						case '16':
							time16.push(elem);
							break;
						case '17':
							time17.push(elem);
							break;
						case '18':
							time18.push(elem);
							break;
						default:
							break;
					}
				})
				this.materieFiltered[key] = {
					time15,
					time16,
					time17,
					time18
				};
				time15 = [];
				time16 = [];
				time17 = [];
				time18 = [];
				
			}
			this.parsed = true;
			this.currentDaySubjects = this.materieFiltered[this.dayWeeks.short[this.dayKey]];
		},

		axiosBookReservation(){
			var self = this;
			axios.defaults.withCredentials = true;
			axios
				.put(
					process.env.VUE_APP_SERVER_ADDRESS +
						"/available-reservations?idReservationAvailable="+self.subjectPrenotating.materia.idPrenotazione,

					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					}
				)
				//TODO gestire gli errori e le conferme, deve comparire un popup che specifica l'esito dell'operazione
				.then(function (response) {
					console.log(response);
					if (response.status == 200) {
						self.esitoOperazione = {
							success: true,
							title: "Successo!",
							subtitle: "Ripetizione prenotata con successo.",
							btnPrimary: "Ok",
						};
					} else {
						self.esitoOperazione = {
							success: false,
							title: "Errore!",
							subtitle: "Server irraggiungibile",
							btnPrimary: "Ok",
						};
					}
				})
				.catch(function (error) {
					self.esitoOperazione = {
						success: false,
						title: "Errore!",
						subtitle: error.response.data
							? error.response.data
							: "Undefined",
						btnPrimary: "Ok",
					};
					//console.log(error.response.data);
					//self.requestOperazione = "" + error;
				})
				.finally(function () {
					//TODO scegliere se effettuare l'operazione di refresh anche in caso di fallimento
					self.getReservationsAvailable();
				});
		},
		askReservation(payload) {
			this.subjectPrenotating= {
				materia: {
					idPrenotazione: payload.idPrenotazione,
					docente: payload.docente,
					orario: payload.orario,
					materia: payload.materia,
				},
				actionTitle: "Prenota",
				actionText: `Confermi di volerti prenotare?`,
			};
		},
		clearOngoingAction(){
			this.esitoOperazione=null;
			this.subjectPrenotating=null;
		}
	},
	props: {
		giorno: String,
		prenotazioni: Object,
	},
	components: {
		Subject,
		ModalGenerico,
		ModalConferma,
	},
};
</script>
