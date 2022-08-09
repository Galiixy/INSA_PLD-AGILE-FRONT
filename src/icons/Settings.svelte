<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

</script>

<style>
    span {
        position: absolute;
        z-index: 420;
        background-color: #ffffff;
        border: 2px solid rgba(0,0,0,0.2);
        border-radius: 4px;
        cursor: pointer;
        margin-left: 10px;
        margin-top: calc(100vh - 142px);
    }

    span:hover {
        background-color: #f4f4f4;
    }

    svg {
        width: 38px;
        height: 38px;
        padding: 6px;
        border-radius: 2px;
    }
</style>

<span on:click={() => dispatch('click')}>
    <svg fill="000" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M4 7H3V2h1v5zm-1 7h1v-3H3v3zm5 0h1V8H8v6zm5 0h1v-2h-1v2zm1-12h-1v6h1V2zM9 2H8v2h1V2zM5 8H2c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1zm5-3H7c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1zm5 4h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1z">
        </path>
    </svg>
</span>
