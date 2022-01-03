<template>
  <div class="container pt-6">
			<header>
				<h1 class="title">Prenota</h1>
				<h2 class="subtitle">
					Seleziona le materie a cui vuoi prenotarti
				</h2>
			</header>
			<div class="container pt-4">
				<div class="card pt-5">
					<header class="has-text-centered">
						<span class="icon-text is-vcentered is-size-4">
							<span class="icon is-vcentered faarrows is-size-6">
								<i class="fas fa-chevron-left"></i>
							</span>
							<span><h1 class="mr-2 ml-2">{{giorno}}</h1></span>
							<span class="icon is-vcentered faarrows">
								<i class="fas fa-chevron-right is-size-6"></i>
							</span>
						</span>
					</header>
					<div class="card-content">
						<table class="table"></table>
						<div class="columns is-fixed-top">
							<div class=" column is-1 has-text-right has-text-centered-mobile ">
								<div class="mt-1">
									<p>15-16</p>
								</div>
							</div>
							<div class="column is-11">
								<div class="columns is-mobile">
									<div class="column">
										<div class="box box-materia">Prog3</div>
									</div>
								</div>
							</div>
						</div>
						<!--row materie-->
						<div class="columns">
							<div class="column is-1 is-one-fifth has-text-right has-text-centered-mobile">
								<div class="mt-1">
									<p>16-17</p>
								</div>
							</div>
							<div class="column is-11">
								<div class="columns is-desktop">
									<!--prop-->
									<div class="column">
										<div class="box box-materia">Prog3
											<div class="box-materia-professore">Mario rossi</div>
										</div>
									</div>
									<!--prop-->
									<div class="column">
										<div class="box box-materia ">Prog3
											<div class="box-materia-professore">Mario rossi</div>
										</div>
									</div>
									<!--prop-->
									<div class="column">
										<div class="box box-materia">Prog3
											<div class="box-materia-professore">Mario rossi</div>
										</div>
									</div>
								</div>
							</div>

						</div>
						<p class="mb-6">
						  </p>
					</div>
				</div>
			</div>
		</div>
</template>

<script>
export default {
    props:{
        giorno:String,
        prenotazioni:Object
    }

}
</script>

<style>

</style>