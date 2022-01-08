<template>
	<div class="modal is-active">
		<div class="modal-background"></div>
		<div class="modal-content">
			<div class="box has-text-centered mb-6 pt-5 pb-5">
				<h1 class="title pt-5">
					{{ title }}
				</h1>
				<h2 class="subtitle pb-5" v-if="subtitle">
					{{ subtitle }}
				</h2>
				<!-- <span class="material-icons md-48">face</span> -->
				<ion-icon
					v-if="isSuccess"
					class="ion-icon-big-success"
					name="checkmark-circle-outline"
				>
				</ion-icon>
				<ion-icon
					v-else
					class="ion-icon-big-error"
					name="close-circle-outline"
				>
				</ion-icon>

				<button
					class="button mt-4 is-primary is-fullwidth"
					@click="btnPAction">
					{{ btnPrimary }}
				</button>
				<button
					class="button mt-4 is-fullwidth"
					@click="btnSAction"
					v-if="btnSecondary">
					{{ btnSecondary }}
				</button>
			</div>
		</div>
		<button class="modal-close is-large" @click="btnCloseAction" aria-label="close"></button>
	</div>
</template>

<script>
export default {
	name: "ModalGenerico",
	props: {
		isSuccess: {
			required: false,
			default: true,
		},
		title: String,
		subtitle: {
			type: String,
			required: false,
		},
		btnPrimary: String,
		btnSecondary: {
			required: false,
			type: String,
		},
		btnPAction: {
			required: false,
		},
		btnSAction: {
			required: false,
		},
		btnCloseAction:{
			required:true
		}
	},
};
</script>

<style></style>
