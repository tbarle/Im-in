<template>
  <div class="container">
    <div id="header">
      <md-card>
        <md-card-header>
          <md-card-media>
            <img src="../assets/generic-user.jpg" alt="User avatar">
          </md-card-media>

          <md-card-header-text>
            <div class="md-title">{{this.user_data.name}} {{this.user_data.surname}}</div>
            <div class="md-subhead">{{this.user_data.description}}</div>
          </md-card-header-text>
        </md-card-header>

        <md-card-content>
          <div class="header-userdetails " >
            <!--  <div id="user-presentation">
                <div id="user-avatar">
                  <img id="avatar" src="../assets/generic-user.jpg" alt="User avatar">
                </div>

                <div id="user-text">
                  <span id="user-name">{{this.user_data.name}} {{this.user_data.surname}}</span>
                  <br/>
                  <span id="user-description">{{this.user_data.description}}</span>
                </div>
              </div>-->

            <div id="user-rating">
              <div id="rating-box">
                <md-icon style="color: #ffca2f;">star</md-icon>
                <br/>
                <span>Rating</span>
              </div>
              <div id="rating-scores">
                <span>Organizzatore: {{this.user_data.host_rating}}%</span>
                <br/>
                <span>Partecipante: {{this.user_data.participant_rating}}%</span>
              </div>
            </div>
          </div>
        </md-card-content>

      </md-card>

      <div id="button-container">
        <md-button class="md-dense" id="created" :class="activities_classes" v-on:click="displayActivities">Attività</md-button>
        <md-button class="md-dense central-button" id="planned" :class="invites_classes" v-on:click="displayInvites">Inviti</md-button>
        <md-button class="md-dense md-flat" id="invites" :class="feedback_classes" v-on:click="displayFeedback">Feedback</md-button>
      </div>
      <md-divider/>
    </div>

    <div id="display-activities" v-if="select_details === 'activities'">
      <md-list>
        <ActivityListItem
          v-for="event in display_events"
          v-bind:key="event.id"
          :id="event.id"
          :title="event.title"
          :date="event.date"
          :time="event.time"
          :category="event.category"
          :address="event.address"
          :host="findUser(event.creator)"
          :show_location="true"
        />
      </md-list>
    </div>
  </div>
</template>

<script>
  import ActivityListItem from "../components/ActivityListItem";
  import ActivityList from "./ActivityList";
  import store from '../store/index.js';

  export default {
    name: "MyProfile",
    components: {ActivityList, ActivityListItem},
    data: function() {
      return {
        user_id: null,
        user_data: {
          "name": null,
          "surname": null,
          "description": null,
          "participated": [],
          "organized": [],
          "host_rating": null,
          "participant_rating": null
        },
        events: [],
        display_events: [],
        display_feedbacks: [],
        display_archive: [],
        select_details: 'activities',
        activities_classes: "md-primary",
        feedback_classes: "",
        invites_classes: ""
      }
    },
    methods: {
      displayActivities:function(){
        this.display_events=[];

        let feedback = store.getters.feedback;
        let archive = store.getters.archive;

        for (let index = 0; index < this.events.length; index++) {
          if (this.events[index].participants.includes(this.user_id)
                  && !feedback[this.user_id.toString()].includes(this.events[index].id)
                  && !archive[this.user_id.toString()].includes(this.events[index].id)) {
            this.display_events.push(this.events[index]);
          }
        }

        this.display_events.sort(this.compareDates);
        this.activities_classes = "md-primary";
        this.feedback_classes = "";
        this.invites_classes = "";
      },
      displayFeedback: function(){
        this.display_events=[];

        let user_feedbacks = store.getters.feedback[this.user_id.toString()];

        for (let index = 0; index < this.events.length; index++) {
          if (user_feedbacks.includes(this.events[index].id)) {
            this.display_events.push(this.events[index]);
          }
        }

        this.activities_classes = "";
        this.feedback_classes = "md-primary";
        this.invites_classes = "";
      },
      displayInvites: function() {
        this.display_events = [];

        for (let index = 0; index < this.events.length; index++) {
          if (store.getters.invites[this.user_id.toString()].includes(this.events[index].id)) {
            this.display_events.push(this.events[index]);
          }
        }

        this.activities_classes = "";
        this.feedback_classes = "";
        this.invites_classes = "md-primary";
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
      findUser: function(id) {
        for (let index = 0; index < store.getters.users.length; index++) {
          if (store.getters.users[index].id === id) {
            return store.getters.users[index].name + " " + store.getters.users[index].surname
          }
        }
      }
    },
    mounted() {
      this.events = store.getters.events;
      this.user_id = store.getters.userId;

      let user_archive = store.getters.archive[this.user_id];

      for (let index = 0; index < this.events.length; index++) {
        this.displayActivities();

        if (user_archive.includes(this.events[index].id)) {
          this.display_archive.push(this.events[index]);
        }
      }

      for (let index = 0; index < store.getters.users.length; index++) {
        let user = store.getters.users[index];

        if (user.id === this.user_id) {
          this.user_data = user;
        }
      }
    }
  }
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;

    background-color: white;
  }

  .header-userdetails {
    width: 100%;
    height: auto;
  }
  #header{
    height: 25%;
    position: fixed;
    width: 100%;
    background-color: white;
    z-index: 10;
    top: 0;
  }
  .md-card-header{
    padding: 10px;
  }

  .md-card-media{
    margin-left: 0px;
    border: 1px solid #e8f1ff;
  }

  .md-card-content{
    padding-bottom: 12px;
    padding-left: 10px;
  }

  #user-presentation {
    display: table;
  }

  #user-avatar {
    display: table-cell;
    vertical-align: middle;
    width: 20%;
    height: 100%;
  }

  #avatar {
    max-width: 100%;
    height: auto;
  }

  #user-text {
    display: table-cell;
    width: 80%;
    padding-left: 5%;
  }

  #user-name {
    text-align: left;
    font-size: 150%;
  }

  #user-description {
    display: inline-block;
    text-align: left;
    font-size: 90%;
    padding-top: 2%;
  }

  #user-rating {
    display: table;
    margin-top: 8px;
    font-size: 90%;
    align-items: center;
    width: 100%;
  }

  #rating-box {
    display: table-cell;
    height: 100%;
    text-align: center;
  }

  #rating-scores {
    text-align: left;
    font-size: 100%;
    padding-left: 12px;
  }

  #dropdown-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1%;
  }

  #dropdown {
    width: 30%;
    margin: 0;
    padding: 0;
  }

  .md-list{
    background-color: gainsboro;
    padding: 4px 0px 0px 0px;
  }

  #display-activities{
    position: fixed;
    top: 208px;
    overflow-y: scroll;
    height: calc(93% - 208px);

  }

  .md-field {
    min-height: 0;
  }

  .md-menu.md-icon {
    padding-top: 0;
    margin: 0;
  }

  #button-container {
    width: 100%;
  }

  .central-button{
    border-left: 1px solid gainsboro;
    border-right: 1px solid gainsboro;
  }

  #created, #planned, #invites {
    width: 32%;
    margin-left: 0;
    margin-right: 0;
  }
</style>
