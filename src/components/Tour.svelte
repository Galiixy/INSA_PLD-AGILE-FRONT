<script>
    import {tour, textTour} from "../store";

    export let visible = true

    let bicycleSpeed = 5.6

    console.log($textTour)

    function computeTextTour(tour) {
        computeTourDurations(tour)
        console.log(tour)
        let depot = {isMarker: true, name: "Départ", time: tour.planning.depot.departureTime, order: 1}
        $textTour = [depot]
        tour.trips.forEach( (trip, index) => {
            let textTemp = {isMarker: false, name: "", length: 0};
            trip.segments.forEach(segment => {
                if (textTemp.name === segment.name || segment.name === "") {
                    textTemp.length += Math.round(segment.length)
                } else {
                    textTemp = {isMarker: false, name: segment.name, length: Math.round(segment.length)}
                    $textTour = [...$textTour, textTemp]
                }
            })
            let marker = findTourMarkerByAddress(tour, trip.to, index+2)
            marker.duration = trip.duration
            marker.timeSpend = trip.timeSpend
            marker.time = trip.estimatedArrival
            $textTour = [...$textTour, marker]
        })
        console.log($textTour)
    }

    function findTourMarkerByAddress(tour, address, index) {
        let depot = tour.planning.depot
        let marker = depot.address === address ? {isMarker: true, name: "Arrivée !", time: "Calculer le temps global", order: index} : undefined
        if (marker === undefined)
            tour.planning.requests.forEach(request => {
                if (request.pickupAddress === address) marker = {isMarker: true, name: "Pickup", order: index}
                if (request.deliveryAddress === address) marker = {isMarker: true, name: "Delivery", order: index}
            })
        return marker
    }

    function computeTourDurations(tour) {
        let requests = computeRequests(tour.planning.requests)

        let departureTime = new Date()
        let time = tour.planning.depot.departureTime.split(":")
        departureTime.setHours(time[0])
        departureTime.setMinutes(time[1])
        departureTime.setSeconds(time[2])

        tour.planning.depot.departureTime = departureTime.toLocaleTimeString().split(":").slice(0,2).join(":")

        let estimatedArrival = new Date(departureTime)

        tour.trips.forEach( trip => {
            trip.duration = Math.round(trip.distance / bicycleSpeed)
            trip.timeSpend = requests[trip.to]
            estimatedArrival.setSeconds(estimatedArrival.getSeconds() + trip.duration)
            trip.estimatedArrival = estimatedArrival.toLocaleTimeString().split(":").slice(0,2).join(":")
            if (trip.timeSpend !== undefined)
                estimatedArrival.setSeconds(estimatedArrival.getSeconds() + trip.timeSpend)
        })
        tour.duration = (estimatedArrival - departureTime) / 1000
    }

    function computeRequests(requests) {
        let computedRequests = []
        requests.forEach( request => {
            computedRequests[request.deliveryAddress] = request.deliveryDuration
            computedRequests[request.pickupAddress] = request.pickupDuration
        })
        return computedRequests
    }

    $: if ($tour !== undefined) $tour.then(tour =>  computeTextTour(tour))
    $: if ($textTour.length !== 0) visible = true
</script>

<style>
    .tour {
        width: 0;
        height: 100%;
        overflow-y: scroll;
        transition: width 0.5s cubic-bezier(.17,.84,.44,1);
    }

    .visible {
        width: 500px;
        padding: 0 20px;
    }

    .markers {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        margin-bottom: 4px;
        font-size: 20px;
        font-weight: 500;
    }

    .streets {
        display: flex;
        justify-content: space-between;
        padding-left: 25px;
        margin-bottom: 4px;
    }

    .streets-length {
        color: var(--grey-color);
    }
</style>

<div class:visible={visible && $textTour.length !== 0} class="tour">
    <!--{}-->
    {#each $textTour as text}
        {#if text.isMarker === false}
            <div class="streets">
                <span class="streets-name">{text.name}</span>
                <span class="streets-length">{text.length}m</span>
            </div>
        {:else}
            <div class="markers">
                <span class="markers-name">{text.order} - {text.name}</span>
                <span class="markers-time">{text.time}</span>
            </div>
        {/if}
    {/each}
</div>