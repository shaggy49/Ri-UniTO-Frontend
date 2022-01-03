<template>
	<div id="app">
		<div id="nav">
			<NavBar
				:autenticato="isLoggedIn"
				:accesso="showLoginForm"
				:disconnetti="doDisconnetti"
			></NavBar>
			<ModalAccesso
				v-if="showLogin"
				:caricamento="caricamento"
				:toggle="toggleLoginForm"
				v-on:accedi-cliccato="doAccedi"
			></ModalAccesso>
		</div>

		<router-view />
	</div>
</template>

<script>
import NavBar from "./components/NavBar";
import ModalAccesso from "./components/ModalAccesso";
import axios from "axios";

export default {
	data() {
		return {
			pagina: 0,
			titolo_settore: "Pagina web",
			message: "Hello Vue1!2",
			showLogin: true,
			isLoggedIn: false,
			caricamento: false,
		};
	},
	methods: {
		toggleLoginForm() {
			this.showLogin = !this.showLogin;
		},
		showLoginForm() {
			this.showLogin = true;
		},
		doAccedi(payload) {
			this.caricamento = true;
			var self = this;
			axios
				.post("http://restapi.adequateshop.com/api/authaccount/login", {
					email: payload.email,
					password: payload.password,
				})
				.then(function (response) {
					console.log(response.data.code, payload);
					if (response.status == 200) {
						if (response.data.code == 1) {
							console.log("ok");
							self.toggleLoginForm();
							self.isLoggedIn = true;
						} else console.log("username o password errati");
					} else console.log("Server irraggiungibile");
				})
				.catch(function (error) {
					console.log(error);
				})
				.finally(function () {
					self.caricamento = false;
				});
		},
		doDisconnetti() {
			console.log('uscito');
			this.isLoggedIn = false;
			//TODO --> collegarlo alla navbar con il prop disconnetti
		},
	},
	components: {
		NavBar,
		ModalAccesso,
	},
};
</script>

<style>
@import "./css/mystyles.css";
</style>
