<template>
	<div class="container pt-6">
		<ModalConferma
			v-if="subjectDeleting"
			:payload="subjectDeleting"
			:confirmAction="axiosDeleteReservation"
			:cancelAction="clearOngoingAction"
		/>
		<ModalConferma
			v-if="subjectPrenotating"
			:materia="subjectDeleting"
			:confirmAction="axiosDeleteReservation"
			:actionTitle="Disiscrizione"
			:actionText="disiscrivere"
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
			<h1 class="title">Prenotazioni</h1>
			<h2 class="subtitle">Riepilogo delle tue prenotazioni</h2>
		</header>
		<div class="container pt-4">
			<div
				class="card pt-5"
				v-on:loginStatus:change="getReservationsBooked"
			>
				<header class="has-text-centered">
					<span class="icon-text is-vcentered is-size-4">
						<span
							class="icon is-vcentered faarrows is-size-6"
							@click="changeDay(-1)"
						>
							<ion-icon name="chevron-back-outline"></ion-icon>
						</span>
						<span
							><h1 class="mr-2 ml-2">
								{{ dayWeeks.extended[dayKey] }}
							</h1></span
						>
						<span
							class="icon is-vcentered faarrows is-size-6"
							@click="changeDay(1)"
						>
							<ion-icon name="chevron-forward-outline"></ion-icon>
						</span>
					</span>
				</header>
				<div class="card-content" v-if="parsed && isLoggedIn">
					<div
						class="columns is-fixed-top"
						v-for="(mat, index) in currentDaySubjects"
						:key="index"
					>
						<div
							class="column is-1 has-text-right has-text-centered-mobile"
						>
							<div class="mt-1">
								<p>{{ convertTimeKey(index) }}</p>
							</div>
						</div>

						<div class="column is-11">
							<div class="columns is-mobile is-multiline">
								<Subject
									@click="testMateria"
									v-on:pEffettuata="reservationDone"
									v-on:pDisdetta="reservationCancelled"
									v-for="elem in mat"
									:key="elem.id"
									:id="elem.id"
									:editable="true"
									:materia="elem.course.title"
									:professore="
										elem.teacher.name +
										' ' +
										elem.teacher.surname
									"
									:orario="convertTimeKey(index)"
								/>
							</div>
						</div>
					</div>
					<p class="mb-6"></p>
				</div>
				<div class="card-content" v-else>
					<div v-if="loginStatus">
						<progress
							class="progress is-small is-primary mt-5"
							max="100"
						>
							15%
						</progress>
					</div>
					<div v-else>
						<article class="message is-danger">
							<div class="message-header">
								<p>Attenzione!</p>
							</div>
							<div class="message-body">
								Per accedere a questa pagina devi aver
								effettuato l'accesso. <br />Clicca il bottone
								"Accedi" per autenticarti.
							</div>
						</article>
						<button
							class="button is-primary"
							@click="loginStatusChanged"
						>
							Accedi
						</button>
						<button
							class="button is-light ml-4"
							@click="goToHomePage"
						>
							Torna alla home
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style></style>

<script>
import Subject from "../components/Subject";
import axios from "axios";
import qs from "qs";
import ModalConferma from "../components/ModalConferma.vue";
import ModalGenerico from "../components/ModalGenerico.vue";
/* import { useCookies } from "vue-cookies";
const { Cookies } = useCookies();
 */
export default {
	data: function () {
		return {
			//?giorno scelto dal calendario
			dayKey: 0,
			//?true se la chiamata al backend è stata effettuata
			parsed: false,
			//?dove vengono salvate le materie prese dal bckend
			materie: [],
			//? serve per visualizzare il warning
			isLoggedIn: false,
			//? materie ma ordinate
			materieFiltered: {},
			//?al click di conferma o disdici diventano oggetti con payload per visualizzare
			//? la pagina di conferma
			subjectPrenotating: null,
			subjectDeleting: null,
			//?contiente le materie del giorno corrente -- daykey
			currentDaySubjects: [],
			//?servono alla conversione da enum nel db a human freindly
			dayWeeks: {
				short: ["lun", "mar", "mer", "gio", "ven"],
				extended: [
					"lunedì",
					"martedì",
					"mercoledì",
					"giovedì",
					"venerdì",
				],
			},
			//?esito delle richieste axios
			//?diventa un oggetto alla fine di ogni richiesta
			/**
			 * @param {Boolean} isSuccess
			 * @param {String} title
			 * @param {String} subtitle
			 * @param {String} btnPrimary
			 * @param {String} btnSecondary
			 *
			 */
			esitoOperazione: null,
		};
	},
	props: ["loginStatus", "accesso"],
	watch: {
		//?controllore per il cambaimento del prop loginStatus
		loginStatus(val) {
			console.log(val);
			if (val) this.getReservationsBooked();
			else this.isLoggedIn = false;
		},
	},
	mounted() {
		this.getReservationsBooked();
	},
	methods: {
		//?quando si preme annulla si resettano gli oggetti
		//?serve anche per far scomparire il modal di conferma
		clearOngoingAction() {
			(this.subjectPrenotating = null), (this.subjectDeleting = null);
			this.esitoOperazione = null;
		},
		axiosDeleteReservation(id) {
			var self = this;
			axios.defaults.withCredentials = true;
			axios
				.put(
					process.env.VUE_APP_SERVER_ADDRESS +
						"/requested-reservations",
					qs.stringify({
						idRequestedReservation: id,
						status: "deleted",
					}),
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
							subtitle: "Prenotazione cancellata con sucesso.",
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
						subtitle: error.response.data,
						btnPrimary: "Ok",
					};
					//console.log(error.response.data);
					//self.requestOperazione = "" + error;
				})
				.finally(function () {
					//TODO scegliere se effettuare l'operazione di refresh anche in caso di fallimento
					self.getReservationsBooked();
				});
		},
		/*
		 * la funzione riceve dalla materia un emit con la richiesta di cancellazione della prentoazione
		 * la difficoltà è che non abbiamo traccia di quale materia sia, potremmo ricercarla tra quelle scaricate
		 * ma con molte materie la ricerca sarebbe estremamente dispendiosa
		 * per questo si sceglie di creare della ridondanza.
		 */
		//? serve per generare il popup, viene chiamato da Subject quando si clicca disdici
		reservationCancelled(payload) {
			this.subjectDeleting = {
				materia: {
					idPrenotazione: payload.id,
					docente: payload.docente,
					orario: payload.orario,
					materia: payload.materia,
				},
				actionTitle: "Disiscrizione",
				actionText: "disiscrivere",
			};
			//?la chiamata alla funzione è automatica grazie al v-if del ModalConferma
			//? che esegue un controllo su subjectDeleting
			//? che a sua volta, in caso di conferma, chiamerà axiosDeleteReservation
		},
		reservationDone(/* id */) {
			//TODO COPAIRE IL TUTTO DA RESERVATION DELETED
			//var self = this;
		},

		/*
		 *funzione di login
		 * esiste solo in app.vue, è un collegamento
		 * all'apertura del modal
		 */
		loginStatusChanged() {
			this.accesso();
		},

		//*conversione del meta-orario in orario humanfriendly
		convertTimeKey(mat) {
			var convertedTime = "";
			switch (mat) {
				case "time15":
					convertedTime = "15-16";
					break;
				case "time16":
					convertedTime = "16-17";
					break;
				case "time17":
					convertedTime = "17-18";
					break;
				case "time18":
					convertedTime = "18-19";
					break;
			}
			return convertedTime;
		},

		//*retrive delle prenotazioni effettuate dall'utente
		getReservationsBooked() {
			var self = this;

			axios
				.get(process.env.VUE_APP_SERVER_ADDRESS + "/user-reservations")
				.then(function (response) {
					self.isLoggedIn = true;
					console.log(response);
					
					//TODO controllare il codice della response per vedere se parsare i dati o meno
					self.materie = response.data;
					self.filterSubjects();
				})
				.catch(function () {
					self.isLoggedIn = false;
				})
				.finally(function () {
					self.caricamento = false;
				});
		},
		//cambia il girno nel calendario
		changeDay(operation) {
			if (operation == -1) {
				this.dayKey = this.dayKey == 0 ? 4 : this.dayKey - 1;
			} else this.dayKey = this.dayKey == 4 ? 0 : this.dayKey + 1;
			this.currentDaySubjects =
				this.materieFiltered[this.dayWeeks.short[this.dayKey]];
		},
		//filtering per giorno, genera degli oggetti lun,mar,...
		filterSubjects() {
			console.log("ref");
			var lun = [];
			var mar = [];
			var mer = [];
			var gio = [];
			var ven = [];
			this.materie.forEach((elem) => {
				console.log(elem.rDate);
				/* if(elem.date=='lun')
					this.materieFiltered.lun[0][this.materieFiltered.lun.length()-1] = elem; */
				switch (elem.rDate) {
					case "lun":
						lun.push(elem);
						break;
					case "mar":
						mar.push(elem);
						break;
					case "mer":
						mer.push(elem);
						break;
					case "gio":
						gio.push(elem);
						break;
					case "ven":
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
		//filtra le materie in array per fascia oraria
		filterSubjectsByHour() {
			var time15 = [];
			var time16 = [];
			var time17 = [];
			var time18 = [];
			for (const key in this.materieFiltered) {
				this.materieFiltered[key].forEach((elem) => {
					switch (elem.rTime) {
						case "15":
							time15.push(elem);
							break;
						case "16":
							time16.push(elem);
							break;
						case "17":
							time17.push(elem);
							break;
						case "18":
							time18.push(elem);
							break;
						default:
							break;
					}
				});
				this.materieFiltered[key] = {
					time15,
					time16,
					time17,
					time18,
				};
				time15 = [];
				time16 = [];
				time17 = [];
				time18 = [];
			}
			this.parsed = true;
			this.currentDaySubjects =
				this.materieFiltered[this.dayWeeks.short[this.dayKey]];
		},
		testMateria() {
			alert("");
		},
		goToHomePage() {
			this.$router.push("/prenota");
		},
	},
	components: {
		Subject,
		ModalConferma,
		ModalGenerico,
	},
};
</script>
