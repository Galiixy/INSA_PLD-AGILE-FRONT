<script>
    import { fade } from 'svelte/transition';

    import { strategyTSP } from "../store";

    import Close from "../icons/Close.svelte";
    import Settings from "../icons/Settings.svelte";

    export let title = "Choisir une stratégie de recherche du plus court chemin";

    export let shown = false;

    function setStrategy(strategy) {
        $strategyTSP = strategy
        setTimeout(() => { shown = false }, 200)
    }
</script>

<Settings on:click={() => {shown = true}}/>

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

            <div class="modal-content">
                <div on:click={() => setStrategy("simulated-annealing")} class:choosen-strategy={$strategyTSP==="simulated-annealing"} class="strategy-choice">Simulated Annealing</div>
                <div on:click={() => setStrategy("branch-bound")} class:choosen-strategy={$strategyTSP==="branch-bound"} class="strategy-choice">Branch and Bound</div>
            </div>

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
        background: var(--white-color);
        z-index: 1200;
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
        margin-bottom: 30px;
    }

    .modal-content {
        display: flex;
        width: 100%;
        margin-bottom: 25px;
    }

    .strategy-choice {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100px;
        margin: 10px;
        font-size: 22px;
        color: var(--primary-color);
        background-color: var(--light-primary-color);
        border-radius: 60px;
        transition: 0.5s cubic-bezier(.3,.91,.41,1.01);
        font-weight: bold;
    }

    .strategy-choice:hover, .choosen-strategy {
        cursor: pointer;
        color: var(--white-color);
        background-color: var(--strongest-primary-color);
    }
</style>