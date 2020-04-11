<template>
    <div id="map-container">
        <div id="map" />
        <div id="geocoder" class="geocoder" />
        <div id="confirm-position">
            <md-button class="md-raised md-primary" id="confirm-button" :disabled="this.marker === null" @click="returnPosition">Seleziona</md-button>
        </div>
    </div>
</template>

<script>
    import store from "../store";
    import axios from 'axios';

    export default {
        name: "MapModal",
        data: function() {
            return {
                mapboxgl: require('mapbox-gl/dist/mapbox-gl.js'),
                geocoder: require('@mapbox/mapbox-gl-geocoder'),
                map: null,
                marker: null,
                geocoder_client: null,
                disableButton: true
            }
        },
        methods: {
            addMarker: function(event) {
                if (this.marker !== null) {
                    this.marker.remove();
                }

                this.marker = new this.mapboxgl.Marker().setLngLat([event.lngLat.lng, event.lngLat.lat]).addTo(this.map);
            },
            returnPosition: function() {
                if (this.marker !== null) {
                    let lat = this.marker.getLngLat().lat;
                    let lng = this.marker.getLngLat().lng;

                    this.$parent.$parent.coordinates = [lng, lat];

                    axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+lng+','+lat+'.json?types=address&access_token='+ this.mapboxgl.accessToken)
                .then(response => this.setAddress(response));
                }
            },
            setAddress: function(response) {
                if (response.data.features[0].address !== undefined) {
                    this.$parent.$parent.form.address = response.data.features[0].text + ' ' + response.data.features[0].address + ', ' + response.data.features[0].context[1].text;
                } else {
                    this.$parent.$parent.form.address = response.data.features[0].text + ', ' + response.data.features[0].context[1].text;
                }

                this.$parent.$parent.showMap = false;
            }
        },
        mounted() {
            this.mapboxgl.accessToken = 'pk.eyJ1Ijoic2Z1bGxleiIsImEiOiJjazZqaDRxd3cwN21kM29sYTV0bnpxdHV1In0.M5Bj-O-7ccPESuxMCKpEpA';
            this.map = new this.mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: store.getters.userPosition,
                attributionControl: false,
                zoom: 15
            });

            this.map.on('click', this.addMarker);

            this.geocoder_client = new this.geocoder({
                accessToken: 'pk.eyJ1Ijoic2Z1bGxleiIsImEiOiJjazZqaDRxd3cwN21kM29sYTV0bnpxdHV1In0.M5Bj-O-7ccPESuxMCKpEpA',
                mapboxgl: this.mapboxgl,
                marker: false,
                types: 'address,poi'
            });

            document.getElementById('geocoder').appendChild(this.geocoder_client.onAdd(this.map));
        }
    }
</script>

<style scoped>
    #map-container {
        height: 100%;
        width: 100%;
    }

    #map {
        height: 100%;
        width: 100%;
    }

    .geocoder {
        position: absolute;
        z-index: 1;
        top: 10px;
        left: 15%;
        width: 70%;
    }

    #confirm-position {
        position: fixed;
        float: right;
        z-index: 14;
        right: 5px;
        bottom: 1%;
    }

    .md-button.md-theme-default.md-raised[disabled] {
        color: white;
        background-color: var(--md-theme-default-disabled-background-on-background, rgba(0,0,0,0.3));
    }
</style>
