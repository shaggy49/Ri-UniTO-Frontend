<template>
	<div>
		<div>
			<div class="container pt-6">
				<ModalConferma
					v-if="isDeletingAvailableBooking"
					:payload="tutoringDeleting"
					:confirmAction="axiosDeleteAvailableTutoring"
					:cancelAction="clearOngoingAction"
				/>
				<ModalConferma
					v-if="isAddingNewAvailableReservation"
					:payload="modalNewAvailableReservationPayload"
					:confirmAction="axiosAddNewAvailableReservation"
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
				<!-- btnCloseAction,
					payload: {
						required: true,
					},
					hour: {
						short,
						long,
					},
					day: {
						short,
						long,
					},
					reservation: {
						id,
						name,
					},
					teacher: {
						id,
						name,
						surname,
					}, -->
				<BookForUser
					v-if="bookingUser"
					v-on:chiuso="bookingUserClosed"
					:hour="bookingUserPayload.hour"
					:day="bookingUserPayload.day"
					:reservation="bookingUserPayload.reservation"
					:teacher="bookingUserPayload.teacher"
				/>
				<header>
					<h1 class="title">
						Gestione prenotazioni
						<span class="tag is-primary is-danger">Admin</span>
					</h1>
					<h2 class="subtitle mb-5">
						Aggiungi o rimuovi una prenotazione.
					</h2>
				</header>
				<div v-if="loginStatus">
					<div v-if="!hasRetriviedBookingsAvailable">
						<progress
							class="progress is-small is-primary mt-5"
							max="100"
						>
							15%
						</progress>
					</div>
					<!-- PRENOTAZIONI DISPONIBILI -->
					<div v-else>
						<div class="card pt-5 pb-3 mb-5">
							<div class="card-content">
								<header>
									<h1 class="title is-4 pb-5">
										Prenotazioni disponibili
									</h1>
								</header>
								<table
									class="table is-hoverable is-striped is-fullwidth"
								>
									<thead>
										<tr>
											<th>ID</th>
											<th>Materia</th>
											<th>Insegnante</th>
											<th>Giorno</th>
											<th>Orario</th>
											<th>Prenota per</th>
											<th>Rimuovi</th>
										</tr>
									</thead>
									<tbody>
										<tr
											v-for="prenotation in availableCourses"
											:key="prenotation.id"
										>
											<td class="is-vcentered">
												{{ prenotation.id }}
											</td>
											<td class="is-vcentered">
												{{ prenotation.course.title }}
											</td>
											<td
												class="is-vcentered is-capitalized"
											>
												{{
													prenotation.teacher.name +
													" " +
													prenotation.teacher.surname
												}}
											</td>
											<td
												class="is-vcentered is-capitalized"
											>
												{{ dayWeeks[prenotation.date] }}
											</td>
											<td class="is-vcentered">
												{{
													timeframes[prenotation.time]
												}}
											</td>
											<td class="is-vcentered">
												<button
													class="button is-primary"
													@click="
														bookingForUser(
															prenotation
														)
													"
												>
													<span
														class="icon is-small mr-1"
													>
														<ion-icon
															name="bookmark-outline"
														></ion-icon>
													</span>
													Prenota
												</button>
											</td>
											<td class="is-vcentered">
												<button
													class="button is-danger"
													@click="
														deleteAvailableResConferma(
															prenotation.id
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
					<!-- * INSERISCI RIPETIZIONE-->
					<div class="card pt-5 pb-3 mb-5">
						<div class="card-content">
							<header>
								<h1 class="title is-4">
									Inserimento ripetizione
								</h1>
								<h2 class="subtitle is-6 pb-3">
									Inserisci i dettagli della ripetizione
								</h2>
							</header>
							<div class="card-content">
								<div class="tag is-danger is-light mb-2">
									Tutti i campi sono obbligatori.
								</div>
								<div class="columns">
									<div class="column">Materia</div>
									<div class="column">Insegnante</div>
									<div class="column">Giorno</div>
									<div class="column">Ora</div>
									<div class="column"></div>
								</div>
								<div class="columns">
									<div class="column">
										<AdminDropDown
											defaultValue="Scegli una materia"
											:elems="materie"
											selectionEvent="materiaSelezionata"
											v-on:materiaSelezionata="
												(payload) => {
													this.newReservationPayload.materia =
														payload;
													this.isNewReservationFormComplete();
												}
											"
										/>
									</div>
									<div class="column">
										<AdminDropDown
											defaultValue="Scegli un professore"
											:elems="insegnanti"
											selectionEvent="insegnanteSelezionato"
											v-on:insegnanteSelezionato="
												(payload) => {
													this.newReservationPayload.professore =
														payload;
													this.isNewReservationFormComplete();
												}
											"
										/>
									</div>
									<div class="column">
										<AdminDropDown
											defaultValue="Scegli un giorno"
											:elems="date"
											selectionEvent="giornoSelezionato"
											v-on:giornoSelezionato="
												(payload) => {
													this.newReservationPayload.giorno =
														payload;
													this.isNewReservationFormComplete();
												}
											"
										/>
									</div>
									<div class="column">
										<AdminDropDown
											defaultValue="Scegli un orario"
											:elems="orari"
											selectionEvent="orarioSelezionato"
											v-on:orarioSelezionato="
												(payload) => {
													this.newReservationPayload.ora =
														payload;
													this.isNewReservationFormComplete();
												}
											"
										/>
									</div>
									<div class="column">
										<button
											class="pt-3 button is-primary"
											:disabled="
												!isNewReservationFormComplete()
											"
											@click="
												addingAvailableReservationConfirmation()
											"
										>
											Conferma
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!-- HISTORY -->
					<div class="card pt-5">
						<div class="card-content">
							<header>
								<h1 class="title is-4 pb-5">
									Storico prenotazioni
								</h1>
							</header>
							<table
								v-if="hasRetriviedHistory"
								class="table is-hoverable is-striped is-fullwidth"
							>
								<thead>
									<tr>
										<th>
											<abbr title="ID Prenotazione"
												>IDP</abbr
											>
										</th>
										<th>
											<abbr title="ID Utente">IDU</abbr>
										</th>
										<th>Email utente</th>
										<th>
											<abbr title="ID Corso">IDC</abbr>
										</th>
										<th>Corso</th>
										<th>Giorno</th>
										<th>Orario</th>
										<th>
											<abbr title="ID Insegnante"
												>IDI</abbr
											>
										</th>
										<th>Insegnante</th>
										<th>Status</th>
										<th>Cambia stato</th>
									</tr>
									<!-- 					    {
						"id": 2,
						"user": {
							"id": 1,
							"email": "mc@unito.it",
							"role": 0
						},
						"teacher": {
							"id": 1,
							"name": "Liliana",
							"surname": "Ardissono"
						},
						"course": {
							"id": 1,
							"title": "TWeb"
						},
						"rDate": "mar",
						"rTime": "15",
						"status": "deleted"
					}, -->
								</thead>
								<tbody>
									<tr
										v-for="booked in bookingHistory"
										:key="booked.id"
									>
										<td class="is-vcentered">
											{{ booked.id }}
										</td>
										<td class="is-vcentered">
											{{ booked.user.id }}
										</td>
										<td class="is-vcentered">
											{{ booked.user.email }}
										</td>
										<td class="is-vcentered">
											{{ booked.course.id }}
										</td>
										<td class="is-vcentered">
											{{ booked.course.title }}
										</td>
										<td class="is-vcentered">
											{{ booked.rDate }}
										</td>
										<td class="is-vcentered">
											{{ booked.rTime }}
										</td>
										<td class="is-vcentered">
											{{ booked.teacher.id }}
										</td>
										<td class="is-vcentered">
											{{
												booked.teacher.name +
												" " +
												booked.teacher.surname
											}}
										</td>
										<td class="is-vcentered">
											<!-- {{ booked.status }} -->
											<span
												class="ml-2 has-text-right tag"
												v-bind:class="
													booked.status == 'completed'
														? 'is-success'
														: booked.status ==
														'deleted'
														? 'is-warning'
														: 'is-link'
												"
												>{{ booked.status }}</span
											>
										</td>

										<td class="is-vcentered">
											<div class="buttons">
												<button
													:disabled="
														booked.status !=
														'deleted'
															? false
															: true
													"
													class="button is-danger is-full-width mr-1"
													@click="
														reservationManagment(
															'deleted',
															booked.id
														)
													"
												>
													<span
														class="icon is-medium"
													>
														<ion-icon
															name="trash"
														></ion-icon>
													</span>
												</button>

												<button
													:disabled="
														booked.status !=
														'completed'
															? false
															: true
													"
													class="button is-success is-full-width"
													@click="
														reservationManagment(
															'completed',
															booked.id
														)
													"
												>
													<span
														class="icon is-medium"
													>
														<ion-icon
															name="checkmark-circle"
														></ion-icon>
													</span>
												</button>

												<button
													:disabled="
														booked.status !=
														'booked'
															? false
															: true
													"
													class="button is-info is-full-width"
													@click="
														reservationManagment(
															'booked',
															booked.id
														)
													"
												>
													<span
														class="icon is-medium"
													>
														<ion-icon
															name="calendar-number"
														></ion-icon>
													</span>
												</button>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
							<progress
								v-else
								class="progress is-small is-primary mt-5"
								max="100"
							>
								15%
							</progress>
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
import AdminDropDown from "../../components/AdminDropDown.vue";
import BookForUser from "../../components/BookForUser.vue";

export default {
	name: "GestionePrenotazioni",
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
			hasRetriviedBookingsAvailable: true,
			tutoringDeleting: null,
			esitoOperazione: null,
			availableCourses: null,
			isDeletingAvailableBooking: false,
			isAddingNewAvailableReservation: false,
			deletingTeacherPayload: null,
			modalNewAvailableReservationPayload: null,
			nome: null,
			cognome: null,
			isInsertingTeacher: false,
			bookingHistory: null,
			hasRetriviedHistory: false,
			availableCoursesFiltered: {},
			dayWeeks: {
				lun: "lunedì",
				mar: "martedì",
				mer: "mercoledì",
				gio: "giovedì",
				ven: "venerdì",
			},
			timeframes: {
				15: "15-16",
				16: "16-17",
				17: "17-18",
				18: "18-19",
			},
			materie: [],
			insegnanti: [],
			utenti: null,
			date: [
				{ id: 0, value: "lun" },
				{ id: 1, value: "mar" },
				{ id: 2, value: "mer" },
				{ id: 3, value: "gio" },
				{ id: 4, value: "ven" },
			],
			orari: [
				{ id: 0, value: "15" },
				{ id: 1, value: "16" },
				{ id: 2, value: "17" },
				{ id: 3, value: "18" },
			],
			newReservationPayload: {
				professore: null,
				giorno: null,
				materia: null,
				ora: null,
			},
			//booleano per aprire il modal di prenotazione per l'utente
			bookingUser: false,
			bookingUserPayload: null,
		};
	},
	watch: {
		//?controllore per il cambiamento del prop loginStatus
		loginStatus(val) {
			if (val) {
				this.axiosBasicCalls();
			}
		},
	},
	mounted() {
		if(this.loginStatus)
			this.axiosBasicCalls();
	},
	methods: {
		axiosBasicCalls(){
			this.axiosGetPrenotazioniDisponibili();
			this.axiosGetBookingHistory();
			this.getInsegnanti();
			this.getMaterie();
		},
		isNewReservationFormComplete() {
			var noNullValues = true;
			for (const element in this.newReservationPayload) {
				if (this.newReservationPayload[element] == null)
					noNullValues = false;
			}
			console.log(noNullValues);
			return noNullValues;
		},
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
		clearOngoingAction() {
			this.esitoOperazione = null;
			this.isDeletingAvailableBooking = false;
			this.deletingTeacherPayload = null;
			this.isInsertingTeacher = false;
			this.tutoringDeleting = null;
			this.isAddingNewAvailableReservation = false;
			this.bookingUserPayload = null;
			this.bookingUser = false;
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
			if (regex.test(this.nome.trim())) {
				this.insertInsegnanteConferma();
				if (regex.test(this.cognome.trim())) {
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

		//* parte cancellazione prenotazione
		axiosDeleteAvailableTutoring() {
			var self = this;
			axios.defaults.withCredentials = true;
			axios
				.delete(
					process.env.VUE_APP_SERVER_ADDRESS +
						"/available-reservations?idAvailableReservation=" +
						self.tutoringDeleting.materia.idPrenotazione,
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
							subtitle: "Prenotazione correttamente rimossa",
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
						subtitle:
							"data" in error.response
								? error.response.data
								: "Undefined",
						btnPrimary: "Ok",
					};
					//console.log(error.response.data);
					//self.requestOperazione = "" + error;
				})
				.finally(function () {
					//TODO scegliere se effettuare l'operazione di refresh anche in caso di fallimento
					self.hasRetriviedBookingsAvailable = false;
					self.axiosGetPrenotazioniDisponibili();
				});
		},
		deleteAvailableResConferma(val) {
			var availableCourse = this.availableCourses.find(
				(pren) => pren.id == val
			);
			console.log(availableCourse);
			this.isDeletingAvailableBooking = true;
			this.tutoringDeleting = {
				actionTitle: "Elimina",
				actionText: `Vuoi rimuovere questa ripetizione?
				Questa operazione è irreversibile`,
				materia: {
					idPrenotazione: availableCourse.id,
					docente:
						availableCourse.teacher.name +
						" " +
						availableCourse.teacher.surname,
					data: this.dayWeeks[availableCourse.date],
					orario: this.timeframes[availableCourse.time],
					materia: availableCourse.course.title,
				},
			};
			console.log(val);
		},


		addingAvailableReservationConfirmation() {
			var nomeMat = this.materie.find(
				(x) => x.id === this.newReservationPayload.materia
			).value;
			var nomeProfessore = this.insegnanti.find(
				(x) => x.id === this.newReservationPayload.professore
			).value;
			this.modalNewAvailableReservationPayload = {
				actionTitle: "Inserisci",
				actionText: `Vuoi aggiungere questa ripetizione?`,
				ripetizione: {
					materia: nomeMat,
					professore: nomeProfessore,
					giorno: this.dayWeeks[
						this.date[this.newReservationPayload.giorno].value
					],
					ora: this.timeframes[
						this.orari[this.newReservationPayload.ora].value
					],
				},
			};
			this.isAddingNewAvailableReservation = true;
			/* 
			+
				self.newReservationPayload.professore
				self.newReservationPayload.materia
				self.date[self.newReservationPayload.giorno].value
				self.orari[self.newReservationPayload.ora].value)
			 */
		},
		axiosGetPrenotazioniDisponibili() {
			this.hasRetriviedBookingsAvailable = false;
			var self = this;
			axios.defaults.withCredentials = true;
			axios
				.get(
					process.env.VUE_APP_SERVER_ADDRESS +
						"/available-reservations"
				)
				//TODO gestire gli errori e le conferme, deve comparire un popup che specifica l'esito dell'operazione
				.then(function (response) {
					console.log(response);
					if (response.status == 200) {
						console.log(response.data);
						self.availableCourses = response.data;
						self.hasRetriviedBookingsAvailable = true;
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
						subtitle:
							"data" in error.response
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

		axiosGetBookingHistory() {
			var self = this;
			axios.defaults.withCredentials = true;
			axios
				.get(
					process.env.VUE_APP_SERVER_ADDRESS +
						"/requested-reservations"
				)
				//TODO gestire gli errori e le conferme, deve comparire un popup che specifica l'esito dell'operazione
				.then(function (response) {
					console.log(response);
					if (response.status == 200) {
						console.log(response.data);
						self.bookingHistory = response.data;
						self.hasRetriviedHistory = true;
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
						subtitle:
							"data" in error.response
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

		reservationManagment(operation, id) {
			var self = this;
			axios.defaults.withCredentials = true;
			axios
				.put(
					process.env.VUE_APP_SERVER_ADDRESS +
						"/requested-reservations?idRequestedReservation=" +
						id +
						"&status=" +
						operation,

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
							subtitle: "Modifica effettuata con successo.",
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
					if('data' in error.response){
						if(error.response.data.includes('reservation_available_duplicate')){
							self.esitoOperazione = {
								success: true,
								title: "Successo!",
								subtitle: "Ripetizione modificata.",
								btnPrimary: "Ok",
							};
						}else{
							self.esitoOperazione = {
								success: false,
								title: "Errore!",
								subtitle: error.response.data,
								btnPrimary: "Ok",
							};
						}
					}else{
						self.esitoOperazione = {
							success: false,
							title: "Errore!",
							subtitle: "Riprovare",
							btnPrimary: "Ok",
						};
					}
					//console.log(error.response.data);
					//self.requestOperazione = "" + error;
				})
				.finally(function () {
					//TODO scegliere se effettuare l'operazione di refresh anche in caso di fallimento
					self.axiosGetBookingHistory();
				});
		},

		axiosAddNewAvailableReservation() {
			var self = this;
			this.isAddingNewAvailableReservation = true;
			console.log(
				process.env.VUE_APP_SERVER_ADDRESS +
					"/available-reservations?idTeacher=" +
					self.newReservationPayload.professore +
					"&idCourse=" +
					self.newReservationPayload.materia +
					"&date=" +
					self.date[self.newReservationPayload.giorno].value +
					"&time=" +
					self.orari[self.newReservationPayload.ora].value
			);
			axios.defaults.withCredentials = true;
			axios
				.post(
					process.env.VUE_APP_SERVER_ADDRESS +
						"/available-reservations?idTeacher=" +
						self.newReservationPayload.professore +
						"&idCourse=" +
						self.newReservationPayload.materia +
						"&date=" +
						self.date[self.newReservationPayload.giorno].value +
						"&time=" +
						self.orari[self.newReservationPayload.ora].value,
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
							subtitle:
								"Nuova ripetizione correttamente aggiunta",
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
						subtitle:
							"data" in error.response
								? error.response.data
								: "Undefined",
						btnPrimary: "Ok",
					};
					if('data' in error.response){
						if(error.response.data.includes('reservation_available_duplicate'))
							self.esitoOperazione.subtitle = 'Prenotazione già disponibile';
					}
					//console.log(error.response.data);
					//self.requestOperazione = "" + error;
				})
				.finally(function () {
					//TODO scegliere se effettuare l'operazione di refresh anche in caso di fallimento
					self.hasRetriviedBookingsAvailable = false;
					self.axiosGetPrenotazioniDisponibili();
				});
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
						response.data.forEach((insegnante) => {
							self.insegnanti.push({
								id: insegnante.id,
								value:
									insegnante.name + " " + insegnante.surname,
							});
						});
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
		getMaterie() {
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
						response.data.forEach((materia) => {
							self.materie.push({
								id: materia.id,
								value: materia.title,
							});
						});
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
		bookingUserClosed() {
			this.hasRetriviedBookingsAvailable = false;
			this.axiosGetPrenotazioniDisponibili();
			this.axiosGetBookingHistory();
			this.bookingUser = false;
		},
		bookingForUser(prenotation) {
			/* 			btnCloseAction,
		payload: {
			required: true,
		},
		hour: {
			short,
			long,
		},
		day: {
			short,
			long,
		},
		reservation: {
			id,
			name,
		},
		teacher: {
			id,
			name,
			surname,
		}, */
			this.bookingUserPayload = {
				hour: {
					short: prenotation.time,
					long: this.timeframes[prenotation.time],
				},
				day: {
					short: prenotation.date,
					long: this.dayWeeks[prenotation.date],
				},
				reservation: {
					id: prenotation.id,
					name: prenotation.course.title,
				},
				teacher: {
					id: prenotation.teacher.id,
					name: prenotation.teacher.name,
					surname: prenotation.teacher.surname,
				},
			};
			this.bookingUser = true;
		},
	},
	components: {
		ModalConferma,
		ModalGenerico,
		AdminDropDown,
		BookForUser,
	},
};
</script>

<style>
.is-vertical-center {
	align-items: center;
}
</style>
