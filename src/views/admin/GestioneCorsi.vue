<template>
	<div>
		<div>
			<div class="container pt-6">
				<ModalConferma
					v-if="isDeletingCourse"
					:payload="deletingCoursePayload"
					:confirmAction="axiosDeleteCorso"
					:cancelAction="clearOngoingAction"
				/>
				<ModalConferma
					v-if="isInsertingCourse"
					:payload="insertingCoursePayload"
					:confirmAction="axiosInsertCorso"
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
					<h1 class="title">
						Gestione corsi
						<span class="tag is-primary is-danger">Admin</span>
					</h1>
					<h2 class="subtitle mb-5">Aggiungi o rimuovi un corso.</h2>
				</header>
				<div v-if="loginStatus">
					<div v-if="!hasRetrivedCourses">
						<progress
							class="progress is-small is-primary mt-5"
							max="100"
						>
							15%
						</progress>
					</div>
					<div v-else>
						<div class="card pt-5 pb-3 mb-5">
							<div class="card-content">
								<header>
									<h1 class="title is-4 pb-5">
										Rimozione corso
									</h1>
								</header>
								<table
									class="table is-hoverable is-striped is-fullwidth"
								>
									<thead>
										<tr>
											<th>ID corso</th>
											<th>Titolo corso</th>
											<th>Rimuovi</th>
										</tr>
									</thead>
									<tbody>
										<tr
											v-for="corso in corsi"
											:key="corso.id"
										>
											<td class="is-vcentered">
												{{ corso.id }}
											</td>
											<td class="is-vcentered">
												{{ corso.title }}
											</td>
											<td class="is-vcentered">
												<button
													class="button is-danger"
													@click="
														deleteCorsoConferma(
															corso.id
														)
													"
												>
													<span
														class="icon is-small mr-1"
													>
														<ion-icon
															name="trash-outline"
														></ion-icon>
													</span>
													Elimina
												</button>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div class="card pt-5">
						<div class="card-content">
							<header>
								<h1 class="title is-4">Inserimento corso</h1>
								<h2 class="subtitle is-6 pb-3">
									Inserisci i dettagli del corso
								</h2>
							</header>
							<div class="card-content">
								<div class="tag is-danger is-light mb-2">
									Tutti i campi sono obbligatori.
								</div>
								<form @submit="checkFieldsAndAsk">
									<div class="field">
										<label class="label">Titolo</label>
											<div class="control">
												<input
													class="input"
													type="text"
													placeholder="e.g Programmazione 3"
													v-model="titoloCorso"
													required
												/>
											</div>
									</div>
									<div>
										<button
											class="pt-3 button is-primary is-fullwidth"
										>
											Aggiungi
										</button>
										<button
											class="mt-3 button is-fullwidth"
											@click="clearFields()"
										>
											Pulisci i campi
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
				<div v-else>
					<article class="message is-danger">
						<div class="message-header">
							<p>Attenzione!</p>
						</div>
						<div class="message-body">
							Per accedere a questa pagina devi aver effettuato
							l'accesso come Admin. <br />Clicca il bottone
							"Accedi" per autenticarti.
						</div>
					</article>
					<button
						class="button is-primary"
						@click="loginStatusChanged"
					>
						Accedi
					</button>
					<button class="button is-light ml-4" @click="goToHomePage">
						Torna alla home
					</button>
				</div>
				<!-- Rimozione corso -->
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
import ModalConferma from "../../components/ModalConferma.vue";
import ModalGenerico from "../../components/ModalGenerico.vue";
const qs = require("qs");

export default {
	name: "GestioneCorsi",
	props: {
		loginStatus: {
			required: true,
			//TODO rimuovere, solo test
			default: false,
		},
		accesso: {
			required: true,
		},
	},
	watch: {
		//?controllore per il cambiamento del prop loginStatus
		loginStatus(val) {
			if (val) this.getCorsi();
		},
	},
	mounted() {
		if(this.loginStatus)
			this.getCorsi();
	},
	data: function () {
		return {
			hasRetrivedCourses: true,
			esitoOperazione: null,
			corsi: null,
			isDeletingCourse: false,
			deletingCoursePayload: null,
			insertingCoursePayload: null,
			titoloCorso: null,
			isInsertingCourse: false,
		};
	},
	methods: {
		clearOngoingAction() {
			this.esitoOperazione = null;
			this.isDeletingCourse = false;
			this.deletingCoursePayload = null;
			this.isInsertingCourse = false;
			this.insertingCoursePayload = null;
		},
		clearFields() {
			this.titoloCorso = null;
		},
		checkFieldsAndAsk(){
			if(/^(([A-Za-z][a-z])+((-| )?([A-z0-9]))*)$/.test(this.titoloCorso)){
				this.insertCorsoConferma();
			}else{
				this.esitoOperazione = {
					success: false,
					title: "Errore!",
					subtitle: `Formato titolo errato! 
					Il titolo non può cominciare con un numero.
					Può contenere solo lettere, numeri ed i caratteri spazio o trattino (-).`,
					btnPrimary: "Ok",
				};
			}
		},
		goToHomePage() {
			this.$router.push("/prenota");
		},
		loginStatusChanged() {
			this.accesso();
		},

		axiosDeleteCorso() {
			var self = this;
			axios.defaults.withCredentials = true;
			axios
				.delete(
					process.env.VUE_APP_SERVER_ADDRESS +
						"/course?idCourse=" +
						self.deletingCoursePayload.corso.id,
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					}
				)
				//TODO gestire gli errori e le conferme, deve comparire un popup che specifica l'esito dell'operazione
				.then(function (response) {
					if (response.status == 200) {
						self.esitoOperazione = {
							success: true,
							title: "Successo!",
							subtitle: "Corso correttamente rimosso",
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
					self.hasRetrivedCourses = false;
					self.getCorsi();
				});
		},
		deleteCorsoConferma(val) {
			var corso = this.corsi.find((crs) => crs.id == val);
			this.isDeletingCourse = true;
			this.deletingCoursePayload = {
				actionTitle: "Elimina",
				actionText: `Vuoi rimuovere questo corso?
				Questa operazione è irreversibile`,
				corso: {
					titoloCorso: corso.title,
					id: corso.id,
				},
			};
			console.log(val);
		},
		axiosInsertCorso() {
			var self = this;
			axios.defaults.withCredentials = true;
			axios
				.post(
					process.env.VUE_APP_SERVER_ADDRESS + "/course",
					qs.stringify({
						title: self.insertingCoursePayload.corso.titoloCorso,
					}),
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					}
				)
				//TODO gestire gli errori e le conferme, deve comparire un popup che specifica l'esito dell'operazione
				.then(function (response) {
					if (response.status == 200) {
						self.esitoOperazione = {
							success: true,
							title: "Successo!",
							subtitle: "Corso correttamente rimosso",
							btnPrimary: "Ok",
						};
						self.clearFields();
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
					self.hasRetrivedCourses = false;
					self.getCorsi();
				});
		},
		insertCorsoConferma() {
			this.isInsertingCourse = true;
			this.insertingCoursePayload = {
				actionTitle: "Inserisci",
				actionText: `Vuoi aggiungere questo corso?`,
				corso: {
					titoloCorso: this.titoloCorso,
				},
			};
		},
		getCorsi() {
			this.hasRetrivedCourses = false;
			var self = this;
			axios.defaults.withCredentials = true;
			axios
				.get(process.env.VUE_APP_SERVER_ADDRESS + "/course", {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				})
				//TODO gestire gli errori e le conferme, deve comparire un popup che specifica l'esito dell'operazione
				.then(function (response) {
					console.log(response);
					if (response.status == 200) {
						self.corsi = response.data;
						self.hasRetrivedCourses = true;
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
				});
		},
	},
	components: {
		ModalConferma,
		ModalGenerico,
	},
};
</script>

<style>
.is-vertical-center {
	align-items: center;
}
</style>
