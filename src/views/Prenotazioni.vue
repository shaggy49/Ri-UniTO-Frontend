<template>
	<div class="container pt-6">
		<header>
			<h1 class="title">Prenotazioni</h1>
			<h2 class="subtitle">Riepilogo delle tue prenotazioni</h2>
		</header>
		<div class="container pt-4" >
			<div class="card pt-5" v-on:loginStatus:change="getReservationsBooked">
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
				<div class="card-content" v-if="parsed && isLoggedIn" >
					<div class="columns is-fixed-top"  v-for="(mat, index) in currentDaySubjects" :key="index">
						<div class="column is-1 has-text-right has-text-centered-mobile">
							<div class="mt-1">
								<p>{{convertTimeKey(index)}}</p>
							</div>
						</div>

						<div class="column is-11">
							<div class="columns is-mobile is-multiline">
								<Subject @click="testMateria"
									v-on:pEffettuata="reservationDone"
									v-on:pDisdetta="reservationCancelled"
									v-for="elem in mat"
									:key="elem.id"
									:id="elem.id"
									:editable="true"
									:materia="elem.course.title"
									:professore="elem.teacher.name + ' ' + elem.teacher.surname"
								/>
							</div>
						</div>
					</div>
					<p class="mb-6"></p>
				</div>
				<div class="card-content" v-else>
					<div v-if="loginStatus">
						<progress class="progress is-small is-primary mt-5" max="100">15%</progress>
					</div>
					<div v-else>
							<article class="message is-danger">
								<div class="message-header">
									<p>Attenzione!</p>
								</div>
								<div class="message-body">
								Per accedere a questa pagina devi aver effettuato l'accesso. <br>Clicca il bottone "Accedi" per autenticarti.
								</div>
							</article>
								<button class="button is-primary" @click="loginStatusChanged">Accedi</button>
								<button class="button is-light ml-4" @click="goToHomePage">Torna alla home</button>
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
import qs from 'qs';
/* import { useCookies } from "vue-cookies";
const { Cookies } = useCookies();
 */
export default {
	data: function () {
		return {
			dayKey: 0,
			parsed: false,
			materie: [],
			isLoggedIn: false,
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
			]}
			
		};
	},
	props:['loginStatus', 'accesso'],
	watch:{
		loginStatus(val){
			console.log(val);
			if(val)
				this.getReservationsBooked();
			else 
				this.isLoggedIn = false;
		}
	},
	mounted() {
		this.getReservationsBooked();
	},
	methods: {
		reservationCancelled(id){
			var self = this;
			axios.put(
				process.env.VUE_APP_SERVER_ADDRESS + "/requested-reservations",
				qs.stringify({
					idRequestedReservation: id,
					status: 'deleted'
				}),
				{
					headers: {	
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}
			)
			.then(function (response) {
				console.log(response);
				if (response.status == 200) {
					if (response.data.role) {
						if(response.data=='Prenotazione modificata'){
							self.role = 'admin';
						}else{
							self.role = 'user';
						}
						console.log("ok");
						self.toggleLoginForm();
						self.isLoggedIn = true;
					} else
						self.loginResponse = "username o password errati";
				} else
					self.loginResponse = "Server irraggiungibile";
			})
			.catch(function (error) {
				self.loginResponse = ""+error;
			})
			.finally(function () {
				self.caricamento = false;
			});
		},
		reservationDone(/* id */){
			//var self = this;
		},
		loginStatusChanged(){
			this.accesso();
		},
		//conversione del metaorario in orario humanfriendly
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
		//retrive delle prenotazioni effettuate dall'utente
		getReservationsBooked() {
			var self = this;

			axios.get(
					process.env.VUE_APP_SERVER_ADDRESS +
						"/user-reservations"
				)
				.then(function (response) {
					self.isLoggedIn = true;
					console.log(response);
					//TODO controllare il codice della response per vedere se parsare i dati o meno
					self.materie=response.data;
					self.filterSubjects();
					
					
				})
				.catch(function () {
					self.isLoggedIn = false;
				})
				.finally(function () {
					self.caricamento = false;
				});
		},
		//cambai il girno nel calendario
		changeDay(operation){
			
			if(operation == -1){
				this.dayKey = this.dayKey==0?4:this.dayKey-1;
			}
			else 
				this.dayKey  = this.dayKey==4?0:this.dayKey+1;
			this.currentDaySubjects = this.materieFiltered[this.dayWeeks.short[this.dayKey]];
		},
		//filtering per giorno, genera degli oggetti lun,mar,...
		filterSubjects(){
			console.log('ref');
			var lun = [];
			var mar = [];
			var mer = [];
			var gio = [];
			var ven = [];
			this.materie.forEach((elem) => {
				console.log(elem.rDate);
				/* if(elem.date=='lun')
					this.materieFiltered.lun[0][this.materieFiltered.lun.length()-1] = elem; */
				switch(elem.rDate){
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
		//filtra le materie in array per fascia oraria
		filterSubjectsByHour(){
			var time15 = [];
			var time16 = [];
			var time17 = [];
			var time18 = [];
			for(const key in this.materieFiltered){
				this.materieFiltered[key].forEach(elem => {
					switch(elem.rTime){
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
		testMateria() {
			alert('');
		},
		goToHomePage(){
            this.$router.push('/prenota')
        },
	},
	components: {
		Subject,
	},
};
</script>
