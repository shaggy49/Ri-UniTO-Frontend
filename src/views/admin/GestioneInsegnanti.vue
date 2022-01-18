<template>
	<div>
		<div>
			<div class="container pt-6">
				<ModalConferma
					v-if="isDeletingTeacher"
					:payload="deletingTeacherPayload"
					:confirmAction="axiosDeleteInsegnante"
					:cancelAction="clearOngoingAction"
				/>
				<ModalConferma
					v-if="isInsertingTeacher"
					:payload="insertingTeacherPayload"
					:confirmAction="axiosInsertInsegnante"
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
						Gestione insegnanti
						<span class="tag is-primary is-danger">Admin</span>
					</h1>
					<h2 class="subtitle mb-5">
						Aggiungi o rimuovi un insegnante.
					</h2>
				</header>
				<div v-if="loginStatus">
					<div v-if="!hasRetrivedTeachers">
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
										Rimozione insegnante
									</h1>
								</header>
								<table
									class="table is-hoverable is-striped is-fullwidth"
								>
									<thead>
										<tr>
											<th>Identificativo</th>
											<th>Nome</th>
											<th>Cognome</th>
											<th>Rimuovi</th>
										</tr>
									</thead>
									<tbody>
										<tr
											v-for="insegnante in insegnanti"
											:key="insegnante.id"
										>
											<td class="is-vcentered">
												{{ insegnante.id }}
											</td>
											<td class="is-vcentered">
												{{ insegnante.name }}
											</td>
											<td class="is-vcentered">
												{{ insegnante.surname }}
											</td>
											<td class="is-vcentered">
												<button
													class="button is-danger"
													@click="
														deleteInsegnanteConferma(
															insegnante.id
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
								<h1 class="title is-4">
									Inserimento insegnante
								</h1>
								<h2 class="subtitle is-6 pb-3">
									Inserisci i dettagli dell'insegnante
								</h2>
							</header>
							<div class="card-content">
								<div class="tag is-danger is-light mb-2">
									Tutti i campi sono obbligatori.
								</div>
								<form @submit="checkFieldAndAsk">
								<div class="field">
									<label class="label">Nome</label>
									<div class="control">
										<input
											class="input"
											type="text"
											placeholder="e.g Mario"
											v-model="nome"
											required
										/>
									</div>
								</div>
								<div class="field">
									<label class="label">Cognome</label>
									<div class="control">
										<input
											class="input"
											type="text"
											placeholder="e.g Rossi"
											v-model="cognome"
											required
										/>
									</div>
								</div>
								<div>
									<button
									type="submit"
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
				<!-- Rimozione insegnante -->
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
	name: "GestioneInsegnanti",
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
	data: function () {
		return {
			hasRetrivedTeachers: true,
			esitoOperazione: null,
			insegnanti: null,
			isDeletingTeacher: false,
			deletingTeacherPayload: null,
			insertingTeacherPayload: null,
			nome: null,
			cognome: null,
			isInsertingTeacher: false,
		};
	},
	watch: {
		//?controllore per il cambiamento del prop loginStatus
		loginStatus(val) {
			if (val) this.getInsegnanti();
		},
	},
	mounted() {
		if(this.loginStatus)
			this.getInsegnanti();
	},
	methods: {
		clearOngoingAction() {
			this.esitoOperazione = null;
			this.isDeletingTeacher = false;
			this.deletingTeacherPayload = null;
			this.isInsertingTeacher = false;
			this.insertingTeacherPayload = null;
		},
		clearFields() {
			(this.nome = null), (this.cognome = null);
		},
		goToHomePage() {
			this.$router.push("/prenota");
		},
		loginStatusChanged() {
			this.accesso();
		},

		checkFieldAndAsk() {
			var regex = /^([a-zA-Z])+(( ){1}[A-z]+)*$/;
			if (this.nome!= null && regex.test(this.nome.trim())) {
				this.insertInsegnanteConferma();
				if (this.nome!= null && regex.test(this.cognome.trim())) {
					this.insertInsegnanteConferma();
				} else {
					this.esitoOperazione = {
						success: false,
						title: "Errore!",
						subtitle: `Formato cognome errato! 
					Il cognome può contenere solo lettere.
					Separare più cognomi tramite uno spazio.
					`,
						btnPrimary: "Ok",
					};
				}
			} else {
				this.esitoOperazione = {
					success: false,
					title: "Errore!",
					subtitle: `Formato nome errato! 
					Il nome può contenere solo lettere.
					Separare più nomi tramite uno spazio.
					`,
					btnPrimary: "Ok",
				};
			}
		},

		//TODO gestire l'errore che compare quando si elimina un docente che ha delle prenotazioni (attive e non credo)
		axiosDeleteInsegnante() {
			var self = this;
			axios.defaults.withCredentials = true;
			axios
				.delete(
					process.env.VUE_APP_SERVER_ADDRESS +
						"/teacher?idTeacher=" +
						self.deletingTeacherPayload.insegnante.id,
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					}
				)
				//TODO gestire gli errori e le conferme, deve comparire un popup che specifica l'esito dell'operazione
				.then(function (response) {
					console.log("fff" + response.data);
					if (response.status == 200) {
						self.esitoOperazione = {
							success: true,
							title: "Successo!",
							subtitle: "Insegnante correttamente rimosso",
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
					console.log("fff" + error);
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
					self.hasRetrivedTeachers = false;
					self.getInsegnanti();
				});
		},
		deleteInsegnanteConferma(val) {
			var insegnante = this.insegnanti.find((prof) => prof.id == val);
			this.isDeletingTeacher = true;
			this.deletingTeacherPayload = {
				actionTitle: "Elimina",
				actionText: `Vuoi rimuovere questo insegnante?
				Questa operazione è irreversibile`,
				insegnante: {
					nome: insegnante.name,
					cognome: insegnante.surname,
					id: insegnante.id,
				},
			};
			console.log(val);
		},
		axiosInsertInsegnante() {
			var self = this;
			axios.defaults.withCredentials = true;
			axios
				.post(
					process.env.VUE_APP_SERVER_ADDRESS + "/teacher",
					qs.stringify({
						name: self.insertingTeacherPayload.insegnante.nome,
						surname:
							self.insertingTeacherPayload.insegnante.cognome,
					}),
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					}
				)
				//TODO gestire gli errori e le conferme, deve comparire un popup che specifica l'esito dell'operazione
				.then(function (response) {
					console.log("fff" + response.data);
					if (response.status == 200) {
						self.esitoOperazione = {
							success: true,
							title: "Successo!",
							subtitle: "Insegnante correttamente rimosso",
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
					console.log("fff" + error);
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
					self.hasRetrivedTeachers = false;
					self.getInsegnanti();
				});
		},
		insertInsegnanteConferma() {
			this.isInsertingTeacher = true;
			this.insertingTeacherPayload = {
				actionTitle: "Inserisci",
				actionText: `Vuoi aggiunre questo insegnante?`,
				insegnante: {
					nome: this.nome.trim(),
					cognome: this.cognome.trim(),
				},
			};
		},
		getInsegnanti() {
			this.hasRetrivedTeachers = false;
			var self = this;
			axios.defaults.withCredentials = true;
			axios
				.get(process.env.VUE_APP_SERVER_ADDRESS + "/teacher", {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				})
				//TODO gestire gli errori e le conferme, deve comparire un popup che specifica l'esito dell'operazione
				.then(function (response) {
					console.log(response);
					if (response.status == 200) {
						self.insegnanti = response.data;
						self.hasRetrivedTeachers = true;
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
