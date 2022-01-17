<template>
	<div class="dropdown" :class="{'is-active':isToggled}" @click="toggleDropdown()">
		<div class="dropdown-trigger">
			<button
				class="button"
				aria-haspopup="true"
				aria-controls="dropdown-menu"
			>
				<span>{{dropDownText()}}</span>
				<span class="icon is-small">
					<ion-icon name="chevron-down-outline"></ion-icon>
				</span>
			</button>
		</div>
		<div class="dropdown-menu" id="dropdown-menu" role="menu">
			<div class="dropdown-content">
				<a @click="changeSelection(index, elem.id)" class="dropdown-item" v-for="(elem, index) in elems" :key="index"> {{elem.value}}</a>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "AdminDropDown",
	data: function(){
		return {
			isToggled: false,
			selectedElement:-1
		}

	},
	props: ['elems', 'defaultValue', 'selectionEvent'],
	methods:{
		toggleDropdown() {
			this.isToggled = !this.isToggled;
		},
		dropDownText(){
			return this.selectedElement == -1 ? this.defaultValue : this.elems[this.selectedElement].value;
		},
		changeSelection(selection, selectionID){
			this.selectedElement=selection;
			this.$emit(this.selectionEvent,selectionID);
		}
	}
};
</script>

<style></style>
