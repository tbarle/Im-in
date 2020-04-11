<template>
    <div class="overlay" v-bind:style="{display:style.displayOverlay}" >
        <div class="md-layout" id="headerFilters">

            <div class="md-layout-item md-medium-size-20" style="padding-top: 10px;" v-on:click="hideOverlay">
                <md-icon>close</md-icon>
            </div>
            <div class="md-layout-item md-medium-size-50">
                <h3>Filtri</h3>
            </div>
            <div class="md-layout-item md-medium-size-30" style="padding-top: 0.5%;">
                <md-button class="md-raised" v-on:click="resetFilter">
                    Azzera
                </md-button>
            </div>

        </div>
        <div class="contentFilter">
            <div class="md-layout md-gutter">
                <div class="md-layout-item md-medium-size-60">
                    <h4>Organizzato da amici</h4>
                    <p>Visualizza solo le attività organizzate dai tuoi amici.</p>
                </div>
                <div class="md-layout-item md-medium-size-40">
                    <md-switch v-model="friendsFilter" @change="getFriendsFilter" class="md-primary" style="margin-top: 26%"></md-switch>
                </div>
            </div>
            <div class="md-layout md-gutter">
                <div class="md-layout-item md-medium-size-60">
                    <h4>Data e ora</h4>
                    <p>Visualizza le attività in base a giorno, ora, o entrambi.</p>
                </div>
                <div class="md-layout-item md-medium-size-40">
                    <md-switch v-model="datetimeFilter" @change="getTimeFilter" class="md-primary" style="margin-top: 26%"></md-switch>
                </div>
            </div>
            <div class="md-layout md-gutter" v-if="datetimeFilter">
                <div class="md-layout-item md-medium-size-100" id="div-date" v-on:click="updateMinDatetime">
                    <div id="fromDateDiv">
                        <form class="dateFilterForm">
                            <md-field>
                                <md-icon class="datetimeIcon">calendar_today</md-icon>
                                <label class="datetimeInputLabel" v-if="fromDate === ''">Da</label>
                                <Datetime v-model="fromDate"
                                          type="datetime"
                                          input-id="fromInputDatetime"
                                          input-style="height:100%; width:100%; font-size:16px; font-family:Avenir; padding-left:10px;"
                                          hidden-name="from-datetime"
                                          value-zone="Europe/Rome"
                                          locale="it"
                                          zone="Europe/Rome"
                                          :format="{ year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit'}"
                                          :phrases="{ok: 'Continua', cancel: 'Esci'}"
                                          :hour-step="1"
                                          :minute-step="5"
                                          :min-datetime=fromMinDatetime
                                          :week-start="7"
                                          v-on:close="this.updateFromDate"
                                          required
                                          auto>
                                </Datetime>
                            </md-field>
                        </form>


                    </div>
                    <div id="toDateDiv">
                        <form class="dateFilterForm">
                            <md-field>
                                <md-icon class="datetimeIcon">calendar_today</md-icon>
                                <label class="datetimeInputLabel" v-if="toDate === ''">A</label>
                                <Datetime v-model="toDate"
                                          type="datetime"
                                          input-id="toInputDatetime"
                                          input-style="height:100%; width:100%; font-size:16px; font-family:Avenir; padding-left:10px;"
                                          hidden-name="to-datetime"
                                          value-zone="Europe/Rome"
                                          locale="it"
                                          zone="Europe/Rome"
                                          :format="{ year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit'}"
                                          :phrases="{ok: 'Continua', cancel: 'Esci'}"
                                          :hour-step="1"
                                          :minute-step="5"
                                          :min-datetime=toMinDateTime
                                          :week-start="7"
                                          v-on:close="this.updateToDate"
                                          required
                                          auto>
                                </Datetime>
                            </md-field>
                        </form>
                    </div>
                </div>
            </div>
            <div class="md-layout md-gutter">
                <div class="md-layout-item md-medium-size-60">
                    <h4>Categorie</h4>
                    <md-checkbox v-model="categoryFilter"
                                 v-for="category in categoriesDictionary"
                                 :value="getCategoryIndex(category)"
                                 :key="getCategoryIndex(category)"
                                 @change="updateCategories">
                        {{category.name.charAt(0).toUpperCase()}}{{category.name.substring(1)}}
                    </md-checkbox>
                </div>
            </div>
            <div class="md-layout md-gutter">
                <div class="md-layout-item md-medium-size-100">
                    <md-button class="md-primary md-raised" id="filter-btn" v-on:click="hideOverlay">Filtra</md-button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import { Datetime } from 'vue-datetime';
    import 'vue-datetime/dist/vue-datetime.css'
    import store from '../store/index.js';
    export default {
        name: "FiltersMenu",
        components:{Datetime},
        data: () => ({
            friendsFilter: false,
            datetimeFilter: false,
            fromHour: 0,
            toHour: 0,
            categoryFilter: [],
            style: {
                displayOverlay: "none"
            },
            fromMinDatetime: new Date().toISOString(),
            toMinDateTime: new Date().toISOString(),
            fromDate: null,
            toDate: null,
            categoriesDictionary: []
        }),
        validations: {
        },
        methods: {
            getValidationClass(fieldName) {
                const field = this.$v.form[fieldName];

                if (field) {
                    return {
                        'md-invalid': field.$invalid && field.$dirty
                    }
                }
            },
            getCategories: function(categories) {
                this.categoriesDictionary = categories;
            },
            getTimeFilter: function() {
                if (!this.datetimeFilter) {
                    this.fromDate = "";
                    this.$parent.$data.filters['fromDate'] = -1;
                    this.toDate = "";
                    this.$parent.$data.filters['toDate'] = -1;
                }
                this.$parent.updateMapView();
            },
            getCategoryIndex: function(category) {
                for (let index = 1; index < Object.keys(this.categoriesDictionary).length; index++) {
                    if (category.name === this.categoriesDictionary[index.toString()].name) {
                        return index;
                    }
                }
            },
            getFriendsFilter: function() {
                this.$parent.$data.filters['friendsOnly'] = this.friendsFilter;
                this.$parent.updateMapView();
            },
            resetFilter(){
                this.friendsFilter = false;
                this.datetimeFilter = false;
                this.categoryFilter = [];
                this.toHour = 0;
                this.toDate = null;
                this.fromDate = null;
                this.fromHour = 0;
                this.$parent.$data.filters = {
                    'friendsOnly': false,
                    'fromDate': -1,
                    'toDate': -1,
                    'categories': []
                };
                this.$parent.updateMapView();
                this.hideOverlay();
            },
            hideOverlay(){
                $('.overlay').slideToggle();
                $('.panel-div').css("display","none");
            },
            updateMinDatetime() {
                this.minDatetime = new Date().toISOString();
            },
            updateFromDate: function () {
                if (this.fromDate !== "") {
                    this.$parent.$data.filters['fromDate'] = new Date(this.fromDate).getTime();
                }
                this.$parent.updateMapView();
            },
            updateToDate: function () {
                if (this.toDate !== "") {
                    this.$parent.$data.filters['toDate'] = new Date(this.toDate).getTime();
                }
                this.$parent.updateMapView();
            },
            updateCategories: function () {
                this.$parent.$data.filters['categories'] = this.categoryFilter;
                this.$parent.updateMapView();
            }
        },
        mounted() {
            this.categoriesDictionary = store.getters.categories;
        }
    }
</script>

<style lang="css" scoped>
    .md-checkbox {
        display: flex;
        margin-left: 5%;
    }

    #headerFilters{

        position: absolute;
        width: 100%;
        height: auto;
        z-index: 1;
    }
    #filter-btn{
        position: fixed;
        bottom: 10px;
        right: 7px;
    }
    .overlay{
        position: fixed;
        display: block;
        width: 100%;
        height: 65%;
        left: 0;
        right: 0;
        bottom: 0;
        z-index:10;
        border: 1px solid gainsboro;
    }

    .contentFilter{
        border-top: 1px solid gainsboro;
        overflow-y: overlay;
        position: absolute;
        width: 100%;
        top: 15%;
        bottom: 0;
    }

    .md-button{
        border: 1px solid gainsboro;
        border-radius: 8px;
    }

   #fromDateDiv{
       display: flex;
       justify-content: left;
   }

   #toDateDiv{
       display: flex;
       justify-content: left;
   }

   .dateFilterForm{
       margin-left: 20px;
   }


</style>
