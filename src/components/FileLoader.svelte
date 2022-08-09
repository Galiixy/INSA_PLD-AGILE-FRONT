<script>
	import { fade } from 'svelte/transition';
	import { post } from "../apiQuery.js";
	import {map, planning, loading} from "../store";

	import Close from "../icons/Close.svelte";
	import DropZone from "svelte-atoms/DropZone.svelte";

	export let title;
	export let type;

	export let shown = false;

	let file
	let fileName = ""

	const onChange = e => {
		file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0]
		fileName = file ? file.name : ""
	};

	function handleValidate() {
		let fileData = new FormData()
		fileData.append("file", file)
		if (type === "Plan") {
			$map = post("/map", fileData, "")
			shown = false
		}
		if (type === "Route") {
			$planning = post("/planning", fileData, "")
			$loading = true
			shown = false
		}
	}
</script>

{#if shown}
	<div class="modal-background" transition:fade="{{duration:100}}">

		<div class="close-div" on:click={() => shown = false}></div>

		<div class="modal" aria-modal="true">
			<div class="close-icon" on:click={() => shown = false}>
				<Close/>
			</div>

			<div class="modal-title medium-text">
				{title}
			</div>

			<div class="drag-drop-zone">
				<DropZone fileTitle={fileName} dropOnPage on:drop={onChange} on:change={onChange} />
			</div>

			{#if (fileName === "")}
			<button disabled class="modal-button-disabled">
				Valider
			</button>
			{:else}
			<button class="modal-button" on:click={handleValidate}>
				Valider
			</button>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-background {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1200;
		background-color: rgba(0, 0, 0, 0.4);
	}

	.modal {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 800px;
		padding: 1em;
		border-radius: 10px;
		z-index: 1200;
		background-color: var(--white-color);
	}

	.close-div {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.close-icon {
		margin-left: auto;
		cursor: pointer;
	}

	.modal-title {
		color: var(--grey-color);
	}

	.drag-drop-zone {
		background-color: var(--light-grey-color);
		color: var(--grey-color);
		border-radius: 6px;
		width: 80%;
		margin: 40px 0;
		border: 1px dashed rgba(0,0,0,0.2);
		box-shadow: inset 0 0 15px -5px rgba(0, 0, 0, 0.1);
	}

	.modal-button, .modal-button-disabled {
		width: 200px;
		height: 60px;
		border-radius: 60px;
		background: var(--light-primary-color);
		color: var(--primary-color);
		font-size: 22px;
		font-weight: bold;
		margin-bottom: 20px;
		transition: 0.5s cubic-bezier(.3,.91,.41,1.01);
	}

	.modal-button-disabled {
		color: var(--light-grey-color);
		cursor: not-allowed;
	}

	.modal-button:hover {
		cursor: pointer;
		color: var(--white-color);
		background-color: var(--strongest-primary-color);
	}
</style>