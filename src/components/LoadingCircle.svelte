<script>
    import { fade } from 'svelte/transition';

    import {loading} from "../store";
</script>

<style>
    .circle {
        position: absolute;
        z-index: 5000;
        left: 60px;
        top: 88px;
        width: 65px;
        height: 65px;
        box-sizing: border-box;
        border: 4px solid transparent;
        border-top-color: var(--black-color);
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0px 0px 15px -5px;
        animation: circleSpin 2.5s linear infinite;
    }

    .circle:before,
    .circle:after {
        content: "";
        box-sizing: border-box;
        position: absolute;
        border: 4px solid transparent;
        border-radius: 50%;
    }

    .circle:after {
        border-top-color: var(--grey-color);
        top: 12px;
        left: 12px;
        right: 12px;
        bottom: 12px;
        animation: circleSpin 2s linear infinite;
    }

    .circle:before {
        border-top-color: var(--primary-color);
        top: 4px;
        left: 4px;
        right: 4px;
        bottom: 4px;
        animation: circleSpin 3s linear infinite;
    }

    @keyframes circleSpin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>

{#if $loading}
    <div transition:fade={{ delay:100 }} class="circle"></div>
{/if}
