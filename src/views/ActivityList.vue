<template>
    <div id="activity-list" v-bind:style="{display: listStyle}">
        <div id="header-activity-list" class="md-layout">
            <div class="float-wrapper md-layout-item md-size-30" id="go-back-div" v-on:click="closePage">
                <md-icon class="md-primary" id="go-back">keyboard_arrow_left</md-icon>
                <div style="height: fit-content; color: #468cff;">Mappa</div>
            </div>
            <div class="float-wrapper  md-layout-item md-size-40" id="spacer-div">
                Elenco
            </div>
            <div class="float-wrapper  md-layout-item md-size-30" id="dropdown-div">
                <md-field id="dropdown">
                    <md-select class="md-dense" name="sort-by" id="sort-by" placeholder="Ordina" v-model="sortBy" @md-selected="selected">
                        <md-option value="distance">Distanza</md-option>
                        <md-option value="name">Nome</md-option>
                        <md-option value="date">Data</md-option>
                    </md-select>
                </md-field>
            </div>
        </div>

        <div id="list-div">
            <div id="No-activity-div" v-if="displayEvents.length === 0">
                <md-icon>priority_high</md-icon>
                <p>Siamo spiacenti non ci sono attività disponibili in quest'area</p></div>
            <md-list id="my-list">
                <ActivityListItem
                        v-for="event in displayEvents"
                        v-bind:key="event.id"
                        :id="event.id"
                        :title="event.title"
                        :date="event.date"
                        :time="event.time"
                        :category="event.category"
                        :address="event.address"
                        :distance="event.distance"
                        :host="getHost(event.creator)"
                        :show_location="true"
                        :additional_details="true"
                />
            </md-list>
        </div>

        <UserDetails id="user-details" />
    </div>

</template>

<script>
    import ActivityListItem from "../components/ActivityListItem";
    import store from '../store/index.js';
    import UserDetails from "../components/UserDetails";
    export default {
        name: "ActivityList",
        components: {UserDetails, ActivityListItem},
        data: function() {
            return {
                sortBy: "",
                displayEvents: [],
                listStyle: ""
            }
        },
        methods: {
            selected: function() {
                if (this.sortBy === "distance") {
                    this.displayEvents.sort(this.compareDistances);
                } else if (this.sortBy === "name") {
                    this.displayEvents.sort(this.compareTitles);
                } else if (this.sortBy === "date") {
                    this.displayEvents.sort(this.compareDates);
                }
            },
            compareDistances: function(first, second) {
                if (first.distance < second.distance) {
                    return -1;
                } else if (first.distance === second.distance) {
                    return 0;
                } else {
                    return 1;
                }
            },
            compareTitles: function(first, second) {
                if (first.title < second.title) {
                    return -1;
                } else if (first.title === second.title) {
                    return 0;
                } else {
                    return 1;
                }
            },
            compareDates: function(first, second) {
                let firstDateUTC = first.date.split("/")[2] + "-" + first.date.split("/")[1] + "-" + first.date.split("/")[0];
                let firstDate = Date.parse(firstDateUTC + "T" + first.time + ":00Z");

                let secondDateUTC = second.date.split("/")[2] + "-" + second.date.split("/")[1] + "-" + second.date.split("/")[0];
                let secondDate = Date.parse(secondDateUTC + "T" + second.time + ":00Z");

                if (firstDate < secondDate) {
                    return -1;
                } else if (firstDate === secondDate) {
                    return 0;
                } else {
                    return 1;
                }
            },
            closePage: function() {
                this.$router.go(-1);
            },
            getHost: function(id) {
                let users = store.getters.users;

                for (let index = 0; index < users.length; index++) {
                    if (users[index].id === id) {
                        return users[index].name + ' ' + users[index].surname;
                    }
                }
            },
            calculateDistance: function(event) {
                let userLat = store.getters.userPosition[1] * Math.PI / 180;
                let userLon = store.getters.userPosition[0] * Math.PI / 180;
                let eventLat = event.coords[1] * Math.PI / 180;
                let eventLon = event.coords[0] * Math.PI / 180;
                let latDiff = userLat - eventLat;
                let lonDiff = userLon - eventLon;
                let R = 6371000; // metres
                let phi1 = eventLat;
                let phi2 = userLat;
                let deltaPhi = latDiff;
                let deltalambda = lonDiff;

                let a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
                    Math.cos(phi1) * Math.cos(phi2) *
                    Math.sin(deltalambda/2) * Math.sin(deltalambda/2);
                let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                let d = R * c;

                return (Math.round(Math.acos( Math.sin(phi1)*Math.sin(phi2) + Math.cos(phi1)*Math.cos(phi2) * Math.cos(deltalambda) ) * R) / 1000).toFixed(2);
            }
        },
        mounted() {
            let eventsList = store.getters.displayEvents;

            for (let index = 0; index < eventsList.length; index++) {
                let currentEvent = eventsList[index];

                currentEvent.distance = parseFloat(this.calculateDistance(currentEvent));
                this.displayEvents.push(currentEvent);
            }
        }
    }
</script>

<style scoped>
    #activity-list {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 11;
        width: 100%;
        height: 100%;
        background-color: white;
        overflow-y: scroll;
    }

    #header-activity-list {
        width: 100%;
        height: 7%;
        position: absolute;
        background-color: white;
        z-index: 12;
        border-bottom: 1px solid gainsboro;
    }

    #list-div {
        position: absolute;
        overflow-y: overlay;
        width: 100%;
        top: 7%;
        bottom: 0;
        background-color: gainsboro;
    }
    #my-list{
        margin: 6px 0px;
        padding: 0px;
        background-color: gainsboro;
    }
    .md-field {
        min-height: 0;
        margin: 0;
        padding: 0;
    }
    .md-field::after{
        height: 0px;
    }
    .md-field::before{
        height: 0px;
    }

    .md-menu.md-icon {
        padding-top: 0;
        margin: 0;
    }
    .md-menu.md-select{
        padding: 1px;
        margin: 1px;
    }

    .float-wrapper {
        display: inline-block;
        vertical-align: middle;
    }

    #go-back-div {
        display: flex;
        align-items: center;
    }

    #go-back {
        margin: 0px 2px;
    }

    #spacer-div {
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #dropdown-div {
        display: flex;
        align-items: center;
        padding-right: 3px;
    }

    #dropdown {

        border: 1px solid gainsboro;
        box-shadow: floralwhite 0px 1px;
        border-radius: 5px;
    }
    #No-activity-div{
        padding-top: 25%;
    }
    #user-details{
        background-color: rgba(255,255,255,1);
        border-top-right-radius: 30px;
        border-top-left-radius: 30px;
        border-top: 1px solid gainsboro;
    }

</style>
