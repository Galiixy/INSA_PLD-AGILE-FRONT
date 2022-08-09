<script>
    import { Map, TileLayer, Polyline, Popup, Marker, DivIcon} from 'svelte-map-leaflet';
    import {toasts, ToastContainer, FlatToast, BootstrapToast} from "svelte-toasts";
    import {graph, map, planning, shortestPaths, tour, loading, strategyTSP, textTour} from "../store";
    import {get, post} from "../apiQuery";

    import Delivery from "../icons/Delivery.svelte";
    import Depot from "../icons/Depot.svelte";
    import Pickup from "../icons/Pickup.svelte";
    import StrategySelector from "./StrategySelector.svelte";

    let leafletMap, computedTour;

    let colors = ["#00FF00", "#0000FF", "#FF0000", "#01FFFE", "#FFA6FE", "#FFDB66", "#006401", "#010067", "#95003A", "#007DB5", "#FF00F6", "#FFEEE8", "#774D00", "#90FB92", "#0076FF", "#D5FF00", "#FF937E", "#6A826C", "#FF029D", "#FE8900", "#7A4782", "#7E2DD2", "#85A900", "#FF0056", "#A42400", "#00AE7E", "#683D3B", "#BDC6FF", "#263400", "#BDD393", "#00B917", "#9E008E", "#001544", "#C28C9F", "#FF74A3", "#01D0FF", "#004754", "#E56FFE", "#788231", "#0E4CA1", "#91D0CB", "#BE9970", "#968AE8", "#BB8800", "#43002C", "#DEFF74", "#00FFC6", "#FFE502", "#620E00", "#008F9C", "#98FF52", "#7544B1", "#B500FF", "#FF6E41", "#005F39", "#6B6882", "#5FAD4E", "#A75740", "#FFB167", "#009BFF", "#E85EBE"].reverse()

    const mapOptions = {
        center: [47.08666377997771, 2.423015432529306],
        zoom: 6,
    };

    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const tileLayerOptions = {
        minZoom: 0,
        maxZoom: 20,
        maxNativeZoom: 19,
        attribution: "© OpenStreetMap contributors - Just'IF",
    };

    let depotMarker
    let pickupMarkers, pickupMarkersIds
    let deliveryMarkers, deliveryMarkersIds
    let tourPolyline, intersectionsIds

    const depotIconOption = {
        iconSize: [41, 41],
        iconAnchor: [20, 65],
        shadowSize: [41, 41],
        shadowAnchor: [10, 41],
        popupAnchor: [0, -60],
        tooltipAnchor: [16. -28],
     }

    const pickupIconOption = {
        iconSize: [41, 41],
        iconAnchor: [20, 65],
        shadowSize: [41, 41],
        shadowAnchor: [10, 41],
        popupAnchor: [0, -60],
        tooltipAnchor: [16. -28],
    }

    const deliveryIconOption = {
        iconSize: [41, 41],
        iconAnchor: [20, 65],
        shadowSize: [41, 41],
        shadowAnchor: [10, 41],
        popupAnchor: [0, -60],
        tooltipAnchor: [16. -28],
    }

    const tooltipOption = {
        permanent: "true",
        direction: "center",
        sticky: "true",
        offset: [15, -40],
        opacity: "0.9"
    }

    const showToast = (description) => {
        if(description === undefined || description.length === 0){
            description = "Une erreur interne est survenue, veuillez contacter un administrateur";
        }
        const toast = toasts.add({
            title: 'Une erreur est survenue',
            description: description,
            duration: 5000,
            theme: 'dark',
            placement: 'top-right',
            type: 'error',
            component: BootstrapToast
        });
        $loading = false
    };

    function setBounds(map) {
        if (map !== undefined) {
            map
                .then(response => {
                    if (response.ok) return response.json()
                    else if(response.status === 400) throw new Error("Le fichier n'est pas au bon format")
                    else if(response.status === 422) throw new Error("La structure du fichier XML est incorrecte")
                    else throw new Error()
                })
                .then(response => {
                    if (leafletMap !== null)
                        leafletMap.getInstance().fitBounds(
                            [
                                [response["latitudeMax"], response["longitudeMax"]],
                                [response["latitudeMin"], response["longitudeMin"]]
                            ])
                })
                .then(() => {
                    $graph = post("/graph", "{}", "")
                })
                .catch(error => {
                    showToast(error.message)
                })
        }
    }

    function setMarkers(planning) {
        if (planning !== undefined) {
            planning
                .then(response => {
                    if (response.ok) return response.json()
                    else if (response.status === 400) throw new Error("Le fichier n'est pas au bon format")
                    else if (response.status === 416) throw new Error("Le périmètre des livraisons ne correspond pas à la carte chargée")
                    else if (response.status === 422) throw new Error("La structure du fichier XML est incorrecte")
                    else if (response.status === 404) throw new Error(response.message)
                    else if (response.status === 500) throw new Error(response.message)
                    else throw new Error()
                })
                .then(response => {
                    post("/map/intersection", "[\"" + response["depot"]["address"] + "\"]" )
                        .then(response => {
                            if (response.ok) return response.json()
                            else throw new Error("Une erreur interne est survenue lors de la récupération du dépot")
                        })
                        .then(depot => {
                            if(depot.includes(null)) throw new Error("Les coordonnées du dépot sont introuvables")
                            else return depot
                        })
                        .then(depot => depotMarker = [depot[0]["latitude"], depot[0]["longitude"], depot[0].id])
                        .catch(error => {
                            showToast(error.message)
                        })

                    response["requests"].forEach( request => {
                        pickupMarkersIds = [...pickupMarkersIds, request["pickupAddress"]]
                        deliveryMarkersIds = [...deliveryMarkersIds, request["deliveryAddress"]]
                    })
                    post("/map/intersection", JSON.stringify(pickupMarkersIds))
                        .then(response => {
                            if (response.ok) return response.json()
                            else throw new Error("Une erreur interne est survenue lors de la récupération des marqueurs de pickup")
                        })
                        .then(intersections => {
                            if(intersections.includes(null)) throw new Error("Les coordonnées d'au moins un marqueur pickup sont introuvables")
                            else return intersections
                        })
                        .then(intersections => {
                            intersections.forEach((pickup, index) => {
                                let randomColor = colors[index%colors.length]
                                pickupMarkers = [...pickupMarkers, [index+1, pickup["latitude"], pickup["longitude"], randomColor, pickup.id]]
                            })
                        })
                        .catch(error => {
                            showToast(error.message)
                        })
                    post("/map/intersection", JSON.stringify(deliveryMarkersIds))
                        .then(response => {
                            if (response.ok) return response.json()
                            else throw new Error("Une erreur interne est survenue lors de la récupération marqueurs de livraison")
                        })
                        .then(intersections => {
                            if(intersections.includes(null)) throw new Error("Les coordonnées d'au moins un marqueur de livraison sont introuvables")
                            else return intersections
                        })
                        .then(intersections => {
                            intersections.forEach((delivery, index) => {
                                let randomColor = colors[index%colors.length]
                                deliveryMarkers = [...deliveryMarkers, [index+1, delivery["latitude"], delivery["longitude"], randomColor, delivery.id]]
                            })
                        })
                        .catch(error => {
                            showToast(error.message)
                        })
                })
                .then(() => {
                    if ($graph !== undefined) $graph.then(() => {$shortestPaths = post("/graph/shortest-paths", "{}", "")})
                })
                .catch(error => {
                    showToast(error.message)
                })
        }
    }

    function setLines() {
        if($shortestPaths !== undefined) {
            $shortestPaths
                .then(() => {$tour = get("/tour/" + $strategyTSP)})
                .then(() => {
                    if ($tour !== undefined) {
                        $tour
                            .then(response => {
                                computedTour = response
                                return response
                            })
                            .then(response => {
                                response["trips"].forEach( (trip, index) => {
                                    setMarkerRankByAddress(trip.from, index+1)
                                    trip["segments"].forEach(segment => {
                                        intersectionsIds = [...intersectionsIds, segment.origin]
                                    })
                                })
                                post("/map/intersection", JSON.stringify(intersectionsIds))
                                    .then(response => {
                                        if (response.ok) return response.json()
                                        else throw new Error("Errooooooooooor (setLines)")
                                    })
                                    .then(intersections => {
                                        intersections.forEach((intersection) => {
                                            tourPolyline = [...tourPolyline, [intersection.latitude, intersection.longitude]]
                                        })
                                        tourPolyline = [...tourPolyline, tourPolyline[0]]
                                        $loading = false
                                    })
                                    .catch(error => {
                                        showToast(error.message)
                                    })
                            })
                            .catch(error => {
                                showToast(error.message)
                            })
                    }
                })
                .catch(error => {
                    showToast(error.message)
                })
        }
    }

    function cleanMap() {
        $textTour = []
        pickupMarkers = deliveryMarkers = pickupMarkersIds = deliveryMarkersIds = intersectionsIds = tourPolyline = []
        depotMarker = undefined
    }

    function setMarkerRankByAddress(address, rank) {
        if(depotMarker[2] === address) {
            depotMarker[3] = rank
            return
        }

        let pickupIndex = pickupMarkers.findIndex(marker => marker[4] === address)
        if (pickupIndex !== -1) {
            pickupMarkers[pickupIndex][5] = rank
            return
        }

        let deliveryIndex = deliveryMarkers.findIndex(marker => marker[4] === address)
        if (deliveryIndex !== -1) {
            deliveryMarkers[deliveryIndex][5] = rank
        }
    }

    $: { cleanMap(); setBounds($map) }
    $: { cleanMap(); setMarkers($planning) }
    $: { $shortestPaths; setLines()}

</script>

<style>
    .map {
        width: 100%;
        height: 100%;
    }

    .popup {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 16px;
    }

    .order-pin {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        position: absolute;
        top: -14px;
        right: -20px;
        font-size: 16px;
        height: 20px;
        width: 20px;
        padding: 5px;
        border-radius: 30px;
        font-weight: bold;
        box-shadow: 2px 2px 10px 0 black;
    }
</style>

<div class="map">

    <StrategySelector />

    <ToastContainer placement="top-right" let:data={data}>
        <FlatToast {data}/>
    </ToastContainer>

    <Map bind:this={leafletMap} options={mapOptions}>
        <TileLayer name="TileLayer" url={tileUrl} options={tileLayerOptions}/>
        {#if depotMarker !== undefined}
        <Marker name="Depot Marker" latLng={depotMarker.slice(0,2)}>
            <DivIcon options={depotIconOption}>
                <Depot/>
                {#if depotMarker[3] !== undefined}
                    <span class="order-pin">{depotMarker[3]}</span>
                {/if}
            </DivIcon>
            <Popup name="Depot Popup">
                <div class="popup">
                    <span class="bold-text">Depot Marker</span>
                    <span>Latitude : {depotMarker[0]}</span>
                    <span>Longitude : {depotMarker[1]}</span>
                </div>
            </Popup>
        </Marker>
        {/if}
        {#if pickupMarkers !== undefined && pickupMarkers.length > 0}
            {#each pickupMarkers as pickupMarker (pickupMarker[0])}
                <Marker name="Pickup Marker {pickupMarker[0]}" latLng={pickupMarker.slice(1,3)}>
                    <DivIcon options={pickupIconOption}>
                        <Pickup pinColor="{pickupMarker[3]}"/>
                        {#if pickupMarker[5] !== undefined}
                            <span class="order-pin">{pickupMarker[5]}</span>
                        {/if}
                    </DivIcon>
                    <Popup name="Pickup Popup {pickupMarker[0]}">
                        <div class="popup">
                            <span class="bold-text">Pickup Marker N°{pickupMarker[0]}</span>
                            <span>Latitude : {pickupMarker[1]}</span>
                            <span>Longitude : {pickupMarker[2]}</span>
                            {#if pickupMarker[5] !== undefined && computedTour !== undefined && computedTour.trips[pickupMarker[5]-2].timeSpend !== undefined}
                                <span>{Math.trunc(computedTour.trips[pickupMarker[5]-2].timeSpend / 60)} minutes sur place</span>
                            {/if}
                        </div>
                    </Popup>
                </Marker>
            {/each}
        {/if}
        {#if deliveryMarkers !== undefined && deliveryMarkers.length > 0}
            {#each deliveryMarkers as deliveryMarker (deliveryMarker[0])}
                <Marker name="Delivery Marker {deliveryMarker[0]}" latLng={deliveryMarker.slice(1,3)}>
                    <DivIcon options={deliveryIconOption}>
                        <Delivery pinColor="{deliveryMarker[3]}"/>
                        {#if deliveryMarker[5] !== undefined}
                            <span class="order-pin">{deliveryMarker[5]}</span>
                        {/if}
                    </DivIcon>
                    <Popup name="Delivery Popup {deliveryMarker[0]}">
                        <div class="popup">
                            <span class="bold-text">Delivery Marker N°{deliveryMarker[0]}</span>
                            <span>Latitude : {deliveryMarker[1]}</span>
                            <span>Longitude : {deliveryMarker[2]}</span>
                            {#if deliveryMarker[5] !== undefined && computedTour !== undefined && computedTour.trips[deliveryMarker[5]-2].timeSpend !== undefined}
                                <span>{Math.trunc(computedTour.trips[deliveryMarker[5]-2].timeSpend / 60)} minutes sur place</span>
                            {/if}
                        </div>
                    </Popup>
                </Marker>
            {/each}
        {/if}
        <Polyline name="Tour" latLngs="{tourPolyline}" options="">

        </Polyline>
    </Map>
</div>
