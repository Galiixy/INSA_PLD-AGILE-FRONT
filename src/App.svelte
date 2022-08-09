<script>
    import {loading} from "./store";

    import NavBar from './components/NavBar.svelte';
    import Map from "./components/Map.svelte";
    import Tour from "./components/Tour.svelte";
    import FileLoader from "./components/FileLoader.svelte";
    import LoadingCircle from "./components/LoadingCircle.svelte";

    let itineraryModal = false;
    let mapModal = false;
    let tourDetail = false;

    function handleNavbarButtonClick(event) {
        let type = event.detail.type
        if (type === "Route") itineraryModal = true
        if (type === "Plan") mapModal = true
        if (type === "Tour") tourDetail = !tourDetail
    }
</script>

<style>
	:global(:root){
		--primary-color: #3747CB;
        --light-primary-color: #aeb5ea;
        --strong-primary-color: #2c38a2;
        --strongest-primary-color: #26318e;
		--white-color: #f5f5f5;
        --grey-color: #707070;
        --light-grey-color: #ededed;
        --black-color: #111111;
	}

    .main-container {
        display: flex;
        height: calc(100% - 78px);
    }
</style>

<NavBar on:click={handleNavbarButtonClick}/>

<FileLoader bind:shown={itineraryModal} type="Route" title="Charger un itinéraire"/>
<FileLoader bind:shown={mapModal} type="Plan" title="Charger une carte"/>

<LoadingCircle visible="{loading}" />

<div class="main-container">
    <Tour bind:visible={tourDetail}/>
    <Map/>
</div>
