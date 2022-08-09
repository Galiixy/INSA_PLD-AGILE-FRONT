<script>
    export let width = 48.926;
    export let height = 38.053;
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
    <path id="Icon_awesome-map"
          d="M0,9.526V38.943A1.359,1.359,0,0,0,1.864,40.2l11.727-5.338V2.25L1.709,7A2.719,2.719,0,0,0,0,9.526ZM16.309,34.867,32.617,40.3V7.686L16.309,2.25ZM47.062,2.349,35.335,7.686V40.3l11.882-4.752a2.718,2.718,0,0,0,1.709-2.524V3.611A1.359,1.359,0,0,0,47.062,2.349Z"
          transform="translate(0 -2.25)"
    />
</svg>