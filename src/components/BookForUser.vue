<template>
	<div>
		<div class="modal is-active">
			<div class="modal-background"></div>
			<div class="modal-content">
				<div class="box has-text-centered mb-6 pt-5 pb-5">
					<h1 class="title pt-5">
						Prenota un ripetizione per un utente
					</h1>
					<h2 class="subtitle pb-5" style="white-space: pre-line">
						Seleziona l'utente
					</h2>
					<p>{{ reservation.name }}</p>
					<p>{{ teacher.name + " " + teacher.surname }}</p>
					<p>{{ hour.long + " " + day.long }}</p>
					<div v-if="hasRetriviedUsers">
						<AdminDropDown
							defaultValue="Scegli un utente"
							:elems="users"
							selectionEvent="utenteSelezionato"
							v-on:utenteSelezionato="
								(payload) => {
									this.selectedUser = payload;
									this.hasSelectedUser = true;
								}
							"
						/>
					</div>
					<progress
						v-else
						class="progress is-small is-primary mt-5"
						max="100"
					>
						15%
					</progress>

					<button
						class="button mt-4 is-primary is-fullwidth"
						@click="askBookingConfirmation()"
						:disabled="!hasSelectedUser"
					>
						Prenota
					</button>
					<button
						class="button mt-4 is-fullwidth"
						@click="btnCloseAction()"
					>
						Annulla
					</button>
				</div>
			</div>
			<button
				class="modal-close is-large"
				@click="btnCloseAction()"
				aria-label="close"
			></button>
		</div>
		<ModalConferma
			v-if="isBooking"
			:payload="confirmationPayload"
			:confirmAction="axiosBookUser"
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
	</div>
</template>

<script>
import AdminDropDown from "./AdminDropDown";
import axios from "axios";
import ModalConferma from "./ModalConferma";
import ModalGenerico from "./ModalGenerico";

export default {
	name: "BookForUser",
	props: {
		hour: {
			short: null,
			long: null,
		},
		day: {
			short: null,
			long: null,
		},
		reservation: {
			id: null,
			name: null,
		},
		teacher: {
			id: null,
			name: null,
			surname: null,
		},
	},
	data: function () {
		return {
			users: [],
			esitoOperazione: null,
			hasRetriviedUsers: false,
			//al return dal dropdown sarà un oggetto disposto di id utente e email
			selectedUser: null,
			hasSelectedUser: false,
			confirmationPayload: null,
			bookingPayload: null,
			isBooking: false,
		};
	},
	mounted() {
		this.getUsersList();
	},
	methods: {
		clearOngoingAction() {
            this.confirmationPayload = null;
			this.isBooking = false;
			this.bookingPayload = null;
            if(this.esitoOperazione && this.esitoOperazione.success)
                this.btnCloseAction();
			this.esitoOperazione = null;

		},
		//returns list of users' email
		getUsersList() {
			console.log("f");
			var self = this;
			axios.defaults.withCredentials = true;
			axios
				.get(process.env.VUE_APP_SERVER_ADDRESS + "/log-in", {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				})
				.then(function (response) {
					if (response.status == 200) {
						response.data.forEach((user) => {
							self.users.push({
								id: user.id,
								value: user.email,
							});
						});
						self.hasRetriviedUsers = true;
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
				});
		},
		askBookingConfirmation() {
            var user = this.users.find(
                (usr) => usr.id == this.selectedUser
            );
			this.bookingPayload = {
				idUser: user.id,
				idReservation: this.reservation.id,
			};
			this.confirmationPayload = {
				actionTitle: "Aggiungi",
				actionText: `Vuoi aggiungere questa prenotazione per questo utente?`,
				bookingForUser: {
					email: user.value,
					professore: this.teacher.name + " " + this.teacher.surname,
					data: this.day.long,
					ora: this.hour.long,
					materia: this.reservation.name,
				},
			};
			this.isBooking = true;
		},
		axiosBookUser() {
			var self = this;
			axios.defaults.withCredentials = true;
			axios
				.put(
					process.env.VUE_APP_SERVER_ADDRESS +
						"/available-reservations" +
						"?idReservationAvailable=" +
						self.bookingPayload.idReservation +
						"&uID=" +
						self.bookingPayload.idUser,
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
							subtitle: "Utente correttamente prenotato",
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
				})
				.finally(function () {
				});
		},
		btnCloseAction() {
			this.$emit("chiuso");
		},
	},
	components: {
		AdminDropDown,
		ModalGenerico,
		ModalConferma,
	},
};
</script>

<style></style>
