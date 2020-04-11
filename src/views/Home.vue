<template>
  <div class="home">
    <div id="map-container">
      <div id="map" />
      <div id="geocoder" class="geocoder" />
      <div class="control-div" id="left-controls">
        <font-awesome-icon icon="sliders-h" id="filters" v-on:click="openFilters"/>
        <font-awesome-icon icon="location-arrow" id="gps-position" v-on:click="this.getUserPosition"/>
      </div>
      <div class="control-div" id="right-controls">
        <font-awesome-icon icon="list-ul" id="list" @click="this.openList" />
        <font-awesome-icon icon="info-circle" id="help" @click="this.openHelp" />
      </div>
    </div>
    <FiltersMenu id="filters-menu" ref="filtersMenu"/>
    <md-dialog id="marker-event-details" v-if="showDialog" :md-active.sync="showDialog" :md-fullscreen="false">
      <span id="details-title">{{dialogEvent.title}}</span>
      <md-divider />
      <span id="details-date"><md-icon id="date-icon">calendar_today</md-icon> {{dialogEvent.date}} {{dialogEvent.time}}</span>
      <span id="details-category">
        <font-awesome-icon id="category-icon" :icon="this.getCategoryIcon(dialogEvent.category)" />
        {{this.getCategoryName(dialogEvent.category)}}
      </span>
      <div id="details-button-div" @click="showDialog = false">
        <md-button id="details-button" :to="{name: 'activityDetails', params: {id: dialogEvent.id, afterCreation: false}}">Dettagli</md-button>
      </div>
    </md-dialog>
    <md-dialog id="help-dialog" v-if="showHelp" :md-active.sync="showHelp" :md-fullscreen="false">
      <span>
        <font-awesome-icon id="default-marker" icon="map-marker-alt" size="lg"/> - Evento a te visibile
      </span>
      <span>
        <font-awesome-icon id="participated-marker" icon="map-marker-alt" size="lg"/> - Evento a cui stai partecipando
      </span>
    </md-dialog>
    <div class="panel-div" style="display: none" v-on:click="closeFilters"></div>
  </div>
</template>

<script>
  // @ is an alias to /src
  import FiltersMenu from "../components/FiltersMenu";
  import store from '../store/index.js';
  import axios from 'axios';

  export default {
    name: 'home',

    components: {
      FiltersMenu
    },
    data: function() {
      return {
        mapboxgl: require('mapbox-gl/dist/mapbox-gl.js'),
        geocoder: require('@mapbox/mapbox-gl-geocoder'),
        map: null,
        north: 0,
        south: 0,
        east: 0,
        west: 0,
        pulsingDot: null,
        source: null,
        layer: null,
        showFilters: false,
        displayEvents: [],
        markers: [],
        showDialog: false,
        showHelp: false,
        dialogEvent: {},
        filters: {
          'friendsOnly': false,
          'fromDate': -1,
          'toDate': -1,
          'categories': []
        },
        friends: []
      }
    },
    methods: {
      parseResponseData: function(response) {
        store.commit('events', response.events);
        store.commit('users', response.users);
        store.commit('archive', response.archive);
        store.commit('feedback', response.feedback);
        store.commit('invites', response.invites);
        store.commit('categories', response.categories);
        store.commit('chats', response.chats);

        this.friends = response.users[store.getters.userId.toString()].friends;

        this.$refs.filtersMenu.getCategories(response.categories);

        if (this.map != null) {
          this.updateMapView();
        }
      },
      getCategoryIcon: function(category) {
        return store.getters.categories[category.toString()].icon;
      },
      getCategoryName: function(category) {
        return store.getters.categories[category.toString()].name;
      },
      calculateBounds: function () {
        let bounds = this.map.getBounds();

        this.north = bounds.getNorth();
        this.south = bounds.getSouth();
        this.east = bounds.getEast();
        this.west = bounds.getWest();
      },
      updateMapView: function () {
        this.calculateBounds();

        for (let index = 0; index < this.markers.length; index++) {
          this.markers[index].remove();
        }

        this.markers = [];
        this.displayEvents = [];

        let allEvents = store.getters.events;

        for (let index = 0; index < allEvents.length; index++) {
          let event = allEvents[index];

          if (this.isEventInBoundingBox(event) && event.active === 1) {
            if (this.checkFriendsOnly(event) && this.checkCategory(event) && this.checkTimeBounds(event) && this.checkInvite(event)) {
              if (event.participants.includes(store.getters.userId)) {
                this.displayEvents.push(event);

                let marker = new this.mapboxgl.Marker({color: '#DC3220'}).setLngLat(event.coords).addTo(this.map);
                marker.getElement().addEventListener('click', () => {
                  this.dialogEvent = event;
                  this.showDialog = true;
                });

                this.markers.push(marker);
              } else {
                this.displayEvents.push(event);
                let marker = new this.mapboxgl.Marker({color: '#005AB5'}).setLngLat(event.coords).addTo(this.map);
                marker.getElement().addEventListener('click', () => {
                  this.dialogEvent = event;
                  this.showDialog = true;
                });

                this.markers.push(marker);
              }
            }
          }
        }

        store.commit('displayEvents', this.displayEvents);
      },
      checkFriendsOnly: function (event) {
        if (this.filters['friendsOnly']) {
          return this.friends.includes(event.creator);
        }

        return true;
      },
      checkInvite: function (event) {
        if (event.visibility === "invite") {
          return store.getters.invites[store.getters.userId].includes(event.id);
        }

        return true;
      },
      checkCategory: function (event) {
        if (this.filters.categories.length > 0) {
          return this.filters.categories.includes(event.category);
        }

        return true;
      },
      checkTimeBounds: function (event) {
        let timestamp = event.date.split("/")[2] + "-" + event.date.split("/")[1] + "-" + event.date.split("/")[0];
        timestamp += "T" + event.time;
        timestamp = new Date(timestamp).getTime();

        if (this.$refs.filtersMenu.$data.datetimeFilter) {
          if (this.filters.fromDate !== -1 && this.filters.toDate !== -1) {
            return this.filters.fromDate <= timestamp && timestamp <= this.filters.toDate;
          } else {
            if (this.filters.fromDate !== -1) {
              return this.filters.fromDate <= timestamp;
            } else if (this.filters.toDate !== -1) {
              return timestamp <= this.filters.toDate;
            } else {
              return true;
            }
          }
        }

        return true;
      },
      isEventInBoundingBox: function (event) {
        return event.coords[0] >= this.west && event.coords[0] <= this.east
                && event.coords[1] >= this.south && event.coords[1] <= this.north;
      },
      getUserPosition: function () {
        this.map.flyTo({
          center: store.getters.userPosition,
          essential: true
        });
      },
      openList: function() {
        this.$router.push({name: 'activityList'});
      },
      openFilters: function() {
        $('#filters-menu').slideToggle();
        $('.panel-div').css("display","block");
      },
      closeFilters: function(){
        $('#filters-menu').slideToggle();
        $('.panel-div').css("display","none");
      },
      openHelp: function() {
        this.showHelp = true;
      }
    },
    activated() {
      this.updateMapView();
    },
    mounted() {
      axios.get("static/db.json").then(json => {this.parseResponseData(json.data)});

      this.mapboxgl.accessToken = 'pk.eyJ1Ijoic2Z1bGxleiIsImEiOiJjazZqaDRxd3cwN21kM29sYTV0bnpxdHV1In0.M5Bj-O-7ccPESuxMCKpEpA';
      this.map = new this.mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: store.getters.userPosition,
        zoom: 13,
        attributionControl: false
      });

      let size = 100;
      let map = this.map;

      this.source = {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [11.2417595, 43.7995825]
          }
        }
      };

      this.layer = {
        "id": "points",
        "source": "user-marker",
        "type": "symbol",
        "layout": {
          "icon-image": "pulsing-dot"
        }
      };

      this.pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        onAdd: function() {
          var canvas = document.createElement('canvas');
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext('2d');
        },

        render: function() {
          var duration = 1000;
          var t = (performance.now() % duration) / duration;

          var radius = (size / 2) * 0.3;
          var outerRadius = (size / 2) * 0.7 * t + radius;
          var context = this.context;

          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
          context.fillStyle = 'rgba(111, 212, 255,' + (1 - t) + ')';
          context.fill();

          context.beginPath();
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
          context.fillStyle = 'rgba(61, 152, 255, 1)';
          context.strokeStyle = 'white';
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();

          this.data = context.getImageData(0, 0, this.width, this.height).data;

          map.triggerRepaint();

          return true;
        }
      };

      this.map.addControl(new this.mapboxgl.NavigationControl());
      let geocoder_search = new this.geocoder({
        accessToken: 'pk.eyJ1Ijoic2Z1bGxleiIsImEiOiJjazZqaDRxd3cwN21kM29sYTV0bnpxdHV1In0.M5Bj-O-7ccPESuxMCKpEpA',
        mapboxgl: this.mapboxgl,
        marker: false,
        zoom: 15
      });

      document.getElementById('geocoder').appendChild(geocoder_search.onAdd(this.map));

      if (store.getters.events.length !== 0) {
        this.updateMapView();
      }

      this.map.on('load', event => {
        this.map.addImage('pulsing-dot', this.pulsingDot, { pixelRatio: 2 });
        this.map.addSource('user-marker', this.source);
        this.map.addLayer(this.layer);
      });

      this.map.on('moveend', event => {
        this.updateMapView();
      });
    }
  }
</script>

<style scoped>
  .home{
    height: 100%;
    overflow-y: scroll;
  }

  #map-container {
    height: 94%;
    width: 100%;
  }

  #map {
    height: 100%;
    width: 100%;
  }

  #gps-position {
    padding: 5px;
    background: white;
    width: 29px;
    height: 29px;
    color: #333333;
    border-radius: 0 0 4px 4px;
  }

  #filters {
    padding: 5px;
    background: white;
    border-bottom: 1px solid grey;
    width: 29px;
    height: 29px;
    color: #333333;
    border-radius: 4px 4px 0 0;
  }

  #help {
    background: white;
    padding: 5px;
    width: 29px;
    height: 29px;
    color: #333333;
    border-radius: 0 0 4px 4px;
  }

  #list {
    background: white;
    border-bottom: 1px solid grey;
    padding: 5px;
    width: 29px;
    height: 29px;
    color: #333333;
    border-radius: 4px 4px 0 0;
  }

  #left-controls {
    width: 29px;
    height: 57px;
    position: fixed;
    float: left;
    z-index: 5;
    left: 10px;
    bottom: 12%;
  }

  #right-controls {
    width: 29px;
    height: 57px;
    position: fixed;
    float: right;
    z-index: 5;
    right: 10px;
    bottom: 12%;
  }

  .control-div {
    border-radius: 4px;
    box-shadow: 0 0 0 3px rgba(0,0,0,.1);
    line-height: 0;
  }

  .geocoder {
    position: absolute;
    z-index: 1;
    top: 10px;
    left: 15%;
    width: 70%;
  }

  #filters-menu {
    background-color: rgba(255,255,255,1);
    border-top-right-radius: 30px;
    border-top-left-radius: 30px;
    z-index: 12;
  }

  .panel-div{
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    background-color: #696969bd;
    z-index: 11;
  }

  #marker-event-details {
    width: fit-content;
    height: fit-content;
    border-radius: 30px;
  }

  #help-dialog {
    width: fit-content;
    height: fit-content;
    border-radius: 30px;
    padding: 10px;
  }

  #details-title {
    font-weight: bold;
    font-size: 1.3em;
    line-height: 2.6em;
    padding: 2px;
  }

  #details-date {
    margin-top: 1%;
    font-size: 1em;
  }

  #details-title, #details-date, #details-category, #details-button, #details-button-div {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    width: fit-content;
  }

  #details-button {
    border: 1px solid gainsboro;
    border-radius: 8px;
  }

  .md-dialog {
    z-index: 13;
  }

  #category-icon {
    color: #757575;
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }

  #default-marker {
    color: #005AB5;
  }

  #participated-marker {
    color: #DC3220;
  }

  .mapboxgl-control-container>.mapboxgl-ctrl-bottom-right {
    display: none;
  }
</style>

<style>
  .md-overlay.md-fixed.md-dialog-overlay{
    z-index: 12;
  }
</style>
