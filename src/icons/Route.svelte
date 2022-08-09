<script>
    export let width = 38;
    export let height = 38;
    export let isHover = false;
</script>

<style>
    svg > path {
        fill: var(--white-color);
    }

    .isHover > path {
        fill: var(--primary-color);
    }
</style>

<svg class:isHover={isHover} xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 {width} {height}">
    <path id="Icon_awesome-route"
          d="M30.875,23.75H23.75a2.375,2.375,0,1,1,0-4.75h7.125S38,11.059,38,7.125a7.125,7.125,0,0,0-14.25,0c0,1.893,1.648,4.705,3.362,7.125H23.75a7.125,7.125,0,0,0,0,14.25h7.125a2.375,2.375,0,1,1,0,4.75H13.768A51.241,51.241,0,0,1,10.257,38H30.875a7.125,7.125,0,1,0,0-14.25Zm0-19A2.375,2.375,0,1,1,28.5,7.125,2.372,2.372,0,0,1,30.875,4.75ZM7.125,19A7.127,7.127,0,0,0,0,26.125C0,30.059,7.125,38,7.125,38s7.125-7.941,7.125-11.875A7.127,7.127,0,0,0,7.125,19Zm0,9.5A2.375,2.375,0,1,1,9.5,26.125,2.372,2.372,0,0,1,7.125,28.5Z"
    />
</svg>