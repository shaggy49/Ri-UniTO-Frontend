<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box has-text-centered mb-6 pt-5 pb-5">
        <figure class="image is-128x128 is-inline-block">
          <img src="../assets/Logo.svg" />
        </figure>
        <h1 class="title pt-5">Accedi al tuo account</h1>
        <h2 class="subtitle pb-5">Inserisci email e password.</h2>
        <form>
          <div class="field mt-4">
            <div class="control">
              <input
                class="input"
                v-model="email"
                type="email"
                placeholder="e.g. email@esempio.com"
                required
              />
            </div>
          </div>

          <div class="field mt-4">
            <div class="control">
              <input
                class="input"
                v-model="password"
                type="password"
                placeholder="********"
                required
              />
            </div>
          </div>
          <h2 v-if="risultatoAccesso" class="subtitle has-text-danger">
            {{ risultatoAccesso }}
          </h2>

          <button
            type="submit"
            @click="accedi"
            class="button mt-4 is-primary is-fullwidth"
            v-bind:class="[caricamento ? 'is-loading' : '']"
          >
            Accedi
          </button>
          <button @click="toggle" class="button mt-4 is-fullwidth">
            Annulla
          </button>
        </form>
      </div>
    </div>
    <button
      @click="toggle"
      class="modal-close is-large"
      aria-label="close"
    ></button>
  </div>
</template>

<script>
export default {
	name: "ModalAccesso",
	props: ["toggle", "caricamento"],
	data: function () {
		return {
			email: "",
			password: "",
			risultatoAccesso: "",
		};
	},
	methods: {
		validateEmail(email) {
			return String(email)
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				);
		},
		accedi() {
			if (!this.password && !this.email)
				this.risultatoAccesso = "Campi vuoti"
			else if (!this.email)
				this.risultatoAccesso = "Mail vuota";
			else if (!this.password)
				this.risultatoAccesso = "Password vuota"
			else if (this.validateEmail(this.email))
				this.$emit("accedi-cliccato", {
					email: this.email,
					password: this.password,
				});
			else 
				this.risultatoAccesso = "Email in formato errato";
			//TODO implementare axios
		},
	},
};
</script>

<style></style>
