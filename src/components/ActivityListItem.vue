<template>
  <div class="Container-Activity-List-Item">
    <md-list-item class="activity-item" :to="{name: 'activityDetails', params: {id: this.id, afterCreation: false}}">
      <div id="activity-item">
        <div id="activity-info">
          <div id="title-div">
            <span id="activity-title">{{this.title}}</span>
          </div>
          <div id="distance" v-if="additional_details">
            <md-badge class="md-primary md-square" :md-content="distance_text" />
          </div>

          <div id="activity-details">
            <div class="details-row">
              <div id="date-div">
                <md-icon id="date-icon">calendar_today</md-icon>
                <span id="date-time">{{this.date}} {{this.time}}</span>
              </div>

              <div id="category-div">
                <font-awesome-icon id="category-icon" :icon="this.getCategoryIcon(this.category)" />
                <span id="category">{{this.getCategoryName(this.category)}}</span>
              </div>
            </div>

            <div class="details-row" v-if="show_location">
              <div id="position-div">
                <md-icon id="position-icon">pin_drop</md-icon>
                <span id="position">{{this.address}}</span>
              </div>
            </div>

            <div class="details-row">
              <span id="created-by">Organizzato da {{this.host}}</span>
            </div>
          </div>
        </div>
        <md-icon id="go-activity-page">keyboard_arrow_right</md-icon>
      </div>
    </md-list-item>
    <md-divider/>
  </div>
</template>

<script>
  import store from "../store";

  export default {
    name: "ActivityListItem",
    props: {
      id: {
        type: Number,
        default: 0
      },
      title: {
        type: String,
        default: ""
      },
      date: {
        type: String,
        default: ""
      },
      time: {
        type: String,
        default: ""
      },
      category: {
        type: Number,
        default: 0
      },
      address: {
        type: String,
        default: ""
      },
      distance: {
        type: Number,
        default: 0.0
      },
      host: {
        type: String,
        default: ""
      },
      show_location: {
        type: Boolean,
        default: true
      },
      additional_details: {
        type: Boolean,
        default: false
      }
    },
    data: function() {
      return {
        distance_text: this.distance.toString() + " km"
      }
    },
    methods: {
      getCategoryIcon: function(category) {
        return store.getters.categories[category.toString()].icon;
      },
      getCategoryName: function(category) {
        return store.getters.categories[category.toString()].name;
      }
    }
  }
</script>

<style scoped>
  .Container-Activity-List-Item{
    background-color: white;
    margin: 1px 0px;
  }

  #activity-item {
    display: table;
    color: black;
  }

  #activity-info {
    display: table-cell;
    width: 95%;
    vertical-align: middle;
  }

  #go-activity-page {
    display: table-cell;
    width: 5%;
    vertical-align: middle;
  }

  #title-div {
    display: inline-block;
    font-size: 100%;
    font-weight: bold;
    margin-bottom: 8px;
    width: 95%;
  }

  #distance {
    display: inline-block;
    width: fit-content;
  }

  #activity-details {
    display: table;
    table-layout: fixed;
    width: 100%;
  }

  .details-row {
    margin: 4px 0px;
  }

  #date-div, #category-div {
    display: inline;
  }

  #category-div {
    padding-left: 5%;
  }

  #date-time, #category, #position, #created-by {
    vertical-align: middle;
    font-size: 80%;
  }

  #created-by {
    margin-bottom: 1%;
  }

  #activity-details .md-icon {
    vertical-align: middle;
  }

  #category-icon {
    color: #757575;
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }
</style>
