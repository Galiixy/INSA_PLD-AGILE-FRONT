<script>
	import { createEventDispatcher } from 'svelte';

	import Justif from "../icons/Justif.svelte";
	import Route from "../icons/Route.svelte";
	import Plan from "../icons/Plan.svelte";
	import {map} from "../store";

	const dispatch = createEventDispatcher();

	let itineraryHover = false
	let mapHover = false
	let validMap = false

	function toggleItinaryIcon() {
		itineraryHover = !itineraryHover
	}

	function toggleMapIcon() {
		mapHover = !mapHover
	}

	function dispatchClick(type) {
		dispatch('click', { type: type });
	}

	function mapValidation(map) {
		if(map !== undefined) map.then(response => validMap = response.ok)
		else validMap = false
	}

	$: mapValidation($map)
</script>

<nav class="navbar">
	<button class="main-logo" on:click={() => dispatchClick("Tour")}>
		<span class="white-text big-text">Just'IF</span>
		<Justif/>
	</button>
	<div class="action-buttons">
		<button disabled="{!validMap}" class:disabled={!validMap} class="action-button" on:mouseenter={toggleItinaryIcon} on:mouseleave={toggleItinaryIcon} on:click={() => dispatchClick("Route")}>
			<Route isHover="{itineraryHover}"/>
			<span class="medium-text">Livraisons</span>
		</button>
		<button class="action-button" on:mouseenter={toggleMapIcon} on:mouseleave={toggleMapIcon} on:click={() => dispatchClick("Plan")}>
			<Plan isHover="{mapHover}"/>
			<span class="medium-text">Carte</span>
		</button>
	</div>
</nav>

<style>
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 48px;
		background-color: #3747CB;
		color: white;
		padding: 15px 0;
	}

	.main-logo {
		display: flex;
		align-items: center;
		margin-left: 30px;
		cursor: pointer;
	}

	.main-logo > span {
		margin-right: 10px;
	}

	.action-buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 30px;
	}

	.action-button {
		display: flex;
		align-items: center;
		border-radius: 10px;
		margin-left: 30px;
		padding: 10px 20px;
		transition: ease-out 0.2s;
		cursor: pointer;
	}

	.action-button:hover {
		background-color: var(--white-color);
	}

	.action-button > span {
		margin-left: 10px;
		color: var(--white-color);
	}

	.action-button:hover > span {
		color: var(--primary-color);
	}

	.disabled {
		display: none;
	}
</style>