<template>
    <div id="container">
        <div id="activity-header">
            <div id="go-back" v-on:click="closePage">
                <md-icon id="go-back-icon">keyboard_arrow_left</md-icon>
            </div>
            <img id="activity-image" :src="imgUrl(image)" alt="activity detail image">
        </div>
        <md-divider />
        <div id="activity-main-title">
            <div id="title">
                <span>{{this.title}}</span>
            </div>
            <div id="first-detail-row">
                <div class="first-detail-items" id="date">
                    <md-icon>calendar_today</md-icon>
                    {{this.date}} {{this.time}}
                </div>
                <div class="first-detail-items" id="category" v-if="this.category">
                    <font-awesome-icon id="category-icon" :icon="this.getCategoryIcon(this.category)" />
                    {{this.getCategoryName(this.category)}}
                </div>
                <div class="first-detail-items" id="users">
                    <md-icon>people_alt</md-icon>
                    {{this.numParticipants}}/{{this.maxParticipants}}
                </div>
            </div>
            <div class="more-detail-row">
                <div id="position">
                    <md-icon>pin_drop</md-icon>
                    {{this.address}}
                </div>
            </div>
            <div class="more-detail-row">
                <div id="visibility">
                    <md-icon>lock</md-icon>
                    Visibilità: {{this.getVisibilityType()}}
                </div>
            </div>
        </div>
        <md-divider/>
        <div id="description-section">
            <div id="description-title">
                Descrizione
            </div>
            <div id="description-content">
                {{this.description}}
            </div>
        </div>
        <div id="participant-section">
            <div id="participant-title">
                Lista partecipanti
                <md-button class="md-raised" style="vertical-align: middle" v-if="isUserCreator" @click="this.editParticipants">
                    <md-icon>create</md-icon>
                    {{this.editText}}
                </md-button>
            </div>
            <ul id="participant-list">
                <ParticipantListItem
                        v-for="participant in participant_list"
                        v-bind:key="participant.id"
                        :id="participant.id"
                        :name="participant.name"
                        :surname="participant.surname"
                        :avatar="participant.avatar"
                        :creator="participant.creator"
                        :user="participant"
                />
            </ul>

            <md-button class="md-icon-button md-raised"
                       id="divFeedbackBtn"
                       v-if="checkFeedback() || this.feedbackSubmitted"
                       :disabled="this.feedbackSubmitted"
                       @click="showDialog = true">
                <font-awesome-icon icon="clipboard-list" size="2x" id="feedbackBtn"/>
            </md-button>
            <md-button class="md-icon-button md-raised" id="divChatBtn" v-if="checkParticipation()" @click="openChat">
                <font-awesome-icon icon="comments" size="2x" id="chatBtn"/>
            </md-button>
        </div>
        <md-button class="md-primary md-raised" v-if="showButton" id="participateButton" v-on:click="this.buttonFunction">{{this.buttonMessage}}</md-button>
        <UserDetails id="user-details"
                     v-bind:userId="selected_user.id"
                     :name="selected_user.name"
                     :surname="selected_user.surname"
                     :avatar="selected_user.avatar"
                     :description="selected_user.description"
                     :host_rating="selected_user.host_rating"
                     :participant_rating="selected_user.participant_rating"
        />
        <div class="panel-div" style="display: none" v-on:click="closeUserDetails"></div>
        <div id="modalFeedback">
            <md-dialog :md-active.sync="showDialog" :md-fullscreen="false" >
                <md-dialog-title>Feedback sui partecipanti</md-dialog-title>

                <md-list>
                    <FeedbackParticipantListItem
                            v-for="participant in feedback_list"
                            v-if="participant.id"
                            v-bind:key="participant.id"
                            :id="participant.id"
                            :name="participant.name"
                            :surname="participant.surname"
                            :avatar="participant.avatar"
                            :creator="participant.creator"
                    />
                </md-list>

                <md-dialog-actions>
                    <md-button class="md-primary" @click="submitFeedback">Archivia</md-button> <!-- TODO agganciare metodo che archivia l'evento e aggiorna i feedback degli utenti -->

                </md-dialog-actions>
            </md-dialog>
        </div>
        <div id="modalLeaveActivity">
            <md-dialog-confirm
                    id="confirmationModal"
                    :md-active.sync="showConfirmation"
                    :md-fullscreen="false"
                    md-title="Conferma eliminazione attività"
                    md-content="Sei sicuro di voler eliminare l'attività? <br> Verrà eliminata per tutti gli utenti."
                    md-confirm-text="Sì"
                    md-cancel-text="No"
                    @md-cancel="undoDeletion"
                    @md-confirm="confirmDeletion" />

        </div>
    </div>
</template>

<script>
    import ParticipantListItem from "../components/ParticipantListItem";
    import FeedbackParticipantListItem from "../components/FeedbackParticipantListItem"
    import UserDetails from "../components/UserDetails";
    import store from '../store/index.js';

    export default {
        name: "ActivityPage",
        components: {FeedbackParticipantListItem, UserDetails, ParticipantListItem},
        props: {
            id: {
                type: Number,
                default: 0
            },
            afterCreation: {
                type: Boolean,
                default: false
            }
        },
        data: function() {
            return {
                title: '',
                image: 'generic-user.jpg',
                date: '',
                time: '',
                category: '',
                numParticipants: 0,
                maxParticipants: 0,
                address: '',
                description: '',
                creator: '',
                visibility: '',
                participants: [],
                participant_list: [],
                feedback_list: [],
                selected_user: {
                    id: -1,
                    name: "",
                    surname: "",
                    description: "",
                    avatar: "generic-user.jpg",
                    host_rating: 0,
                    participant_rating: 0
                },
                showDialog: false,
                showConfirmation: false,
                showButton: false,
                buttonMessage: "",
                buttonFunction: function(){},
                isUserCreator: false,
                editText: 'Modifica',
                showEdit: false,
                feedbackSubmitted: false
            }
        },
        methods: {
            loadUsers: function (participants) {
                let users = store.getters.users;
                this.participants = participants;
                this.participant_list = [];

                for (let index = 0; index < users.length; index++) {
                    if (this.participants.includes(users[index].id)) {
                        if (users[index].id === this.creator) {
                            users[index].creator = true;
                            this.participant_list.splice(0, 0, users[index]);
                        } else {
                            users[index].creator = false;
                            this.participant_list.push(users[index]);
                        }

                        if (users[index].id !== store.getters.userId) {
                            this.feedback_list.push(users[index]);
                        }
                    }
                }
            },
            buttonText: function() {
                if (this.participants.includes(store.getters.userId)) {
                    if (this.checkCreator()) {
                        this.buttonFunction = this.deleteActivity;
                        return "Elimina attività";
                    } else {
                        this.buttonFunction = this.leaveActivity;
                        return "Abbandona attività";
                    }
                } else if (store.getters.invites[store.getters.userId.toString()].includes(this.id)) {
                    this.buttonFunction = this.acceptInvite;
                    return "Accetta invito all'attività";
                } else {
                    this.buttonFunction = this.participateActivity;
                    return "Partecipa all'attività";
                }
            },
            deleteActivity: function() {
                this.showConfirmation = true;
            },
            confirmDeletion: function() {
                store.dispatch('deleteEvent', this.id);
                this.showConfirmation = false;
                this.$router.go(-1);
            },
            undoDeletion: function () {
                this.showConfirmation = false;
            },
            participateActivity: function() {
                store.dispatch('getEvent', this.id).then(event => {
                    event.participants.push(store.getters.userId);
                    this.loadUsers(event.participants);
                    store.dispatch('getUser', store.getters.userId).then(user => {
                        user.participated.push(this.id);
                    });
                });

                this.buttonMessage = "Abbandona attività";
                this.buttonFunction = this.leaveActivity;
                this.numParticipants += 1;
            },
            acceptInvite: function() {
                store.dispatch('getEvent', this.id).then(event => {
                    event.participants.push(store.getters.userId);
                    this.loadUsers(event.participants);
                    store.dispatch('getUser', store.getters.userId).then(user => {
                        user.participated.push(this.id);
                    });
                });

                store.getters.invites[store.getters.userId.toString()]
                    .splice(store.getters.invites[store.getters.userId.toString()].indexOf(this.id), 1);

                this.buttonMessage = "Abbandona attività";
                this.buttonFunction = this.leaveActivity;
                this.numParticipants += 1;
            },
            leaveActivity: function() {
                store.dispatch('getEvent', this.id).then(event => {
                    event.participants.splice(event.participants.indexOf(store.getters.userId), 1);
                    this.loadUsers(event.participants);
                    store.dispatch('getUser', store.getters.userId).then(user => {
                        user.participated.splice(user.participated.indexOf(this.id), 1);
                    });
                });

                this.buttonMessage = "Partecipa all'attività";
                this.buttonFunction = this.participateActivity;
                this.numParticipants -= 1;
            },
            checkFeedback() {
                return store.getters.feedback[store.getters.userId].includes(this.id);
            },
            checkParticipation() {
                return this.participants.includes(store.getters.userId);
            },
            openChat: function() {
                this.$router.push({name: 'chatConversation', params: {id: this.id}});
            },
            imgUrl: function(pic) {
                return require('../assets/' + pic);
            },
            openUserDetails: function(user) {
                this.selected_user = user;
                $('#user-details').slideToggle();
                $('.panel-div').css("display","block");
            },
            closeUserDetails:function(){
                $('#user-details').slideToggle();
                $('.panel-div').css('display','none');
            },
            closePage: function() {
                if (this.afterCreation) {
                    this.$router.push({name: 'home'});
                } else {
                    this.$router.go(-1);
                }
            },
            getCategoryIcon: function(category) {
                return store.getters.categories[category.toString()].icon;
            },
            getCategoryName: function(category) {
                return store.getters.categories[category.toString()].name;
            },
            getVisibilityType: function() {
                if (this.visibility === 'public') {
                    return "Pubblica"
                } else if (this.visibility === 'friends') {
                    return "Solo amici"
                } else {
                    return "Solo su invito"
                }
            },
            editParticipants: function() {
                this.showEdit = !this.showEdit;
                if (this.showEdit) {
                    this.editText = "Applica";
                } else {
                    this.editText = "Modifica";
                }
            },
            kickParticipant: function(id) {
                this.numParticipants -= 1;
                this.participant_list = this.participant_list.filter(function(user) {
                    return user.id !== id;
                });

                let userId = id;
                let eventId = this.id;

                store.commit('removeParticipantFromEvent', {eventId, userId});
                store.commit('removeEventFromUser', {userId, eventId});
            },
            checkCreator: function() {
                return this.creator === store.getters.userId;
            },
            submitFeedback: function() {
                this.showDialog = false;

                let userId = store.getters.userId;
                let eventId = this.id;

                store.commit('removeFeedback', {userId, eventId});

                this.feedbackSubmitted = true;
            }
        },
        mounted() {
            let events = store.getters.events;

            for (let index = 0; index < events.length; index++) {
                if (events[index].id === this.id) {
                    this.title = events[index].title;
                    this.image = events[index].image;
                    if (this.image === '') {
                        this.image = 'generic-user.jpg';
                    }
                    this.date = events[index].date;
                    this.time = events[index].time;
                    this.category = events[index].category;
                    this.visibility = events[index].visibility;
                    this.numParticipants = events[index].participants.length;
                    this.maxParticipants = events[index].maxParticipants;
                    this.address = events[index].address;
                    this.description = events[index].description;
                    this.creator = events[index].creator;
                    this.participants = events[index].participants;
                }
            }

            this.loadUsers(this.participants);

            if(!this.checkFeedback()) {
                this.showButton = true;
                this.buttonMessage = this.buttonText();
            }

            this.isUserCreator = this.checkCreator();
        }
    }
</script>

<style scoped>
    #container {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: white;
        z-index: 12;
        overflow-y: scroll;
    }

    #activity-header {
        height: 20%;
        width: 100%;
        margin-bottom: 1%;
    }

    #go-back {
        position: absolute;
        margin-top: 2%;
        margin-left: 2%;
        z-index: 12;
        border-radius: 50%;
        background-color: white;
    }

    #activity-image {
        z-index: 11;
        object-fit: cover;
        width: 100%;
        height: 100%;
    }

    #activity-main-title {
        width: 100%;
        height: auto;
        padding: 4% 3% 4% 3%;
        z-index: 20;
    }

    #title {
        font-size: 2em;
        font-weight: bold;
        display: flex;
        width: 100%;
        text-align: center;
        flex-wrap: wrap;
        justify-content: center;
    }

    #first-detail-row {
        display: flex;
        width: 100%;
        padding-top: 10px;
    }

    .first-detail-items {
        display: inline-block;
    }

    #date {
        width: 50%;
    }

    #category, #users {
        flex-grow: 1;
    }

    #first-detail-items .md-icon {
        vertical-align: middle;
    }

    .more-detail-row {
        width: 100%;
        align-content: center;
        padding-top: 1%;
    }

    #description-section {
        width: 100%;
        height: auto;
        padding: 8px;
    }

    #description-title, #participant-title {
        font-weight: bold;
        font-size: 1.4em;
        text-align: left;
        padding-top: 1%;
        padding-left: 4%;
    }

    #description-content {
        text-align: left;
        font-size: 1.1em;
        padding-top: 1%;
        padding-left: 4%;
        height: auto;
    }

    #participant-section {
        margin-top: 5%;
        padding: 8px;
    }

    #participant-list {
        list-style-type: none;
        padding-left: 4%;
        margin-top: 1%;
    }

    #user-details {
        background-color: white;
        border-top-right-radius: 30px;
        border-top-left-radius: 30px;
    }
    #divFeedbackBtn{
        position: fixed;
        display: flex;
        height: 56px;
        width: 56px;
        bottom: 25%;
        right: 10%;
        align-items: center;
        justify-content: center;
    }

    #divChatBtn{
        position: fixed;
        display: flex;
        height: 56px;
        width: 56px;
        bottom: 15%;
        right: 10%;
        align-items: center;
        justify-content: center;
    }

    .panel-div{
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        background-color: #696969bd;
        z-index: 11;
    }
    .md-dialog{
        z-index: 13;
        width: fit-content;
        max-width: 90%;
    }

    #category-icon {
        color: #757575;
        width: 20px;
        height: 20px;
        vertical-align: middle;
    }

    #participateButton {
        position: absolute;
        left: 0;
        bottom: 0;
        margin: 0 5% 3% 5%;
        width: 90%;
    }

    #confirmationModal {
        width: fit-content;
        height: fit-content;
        border-radius: 20px;
    }
</style>

<style>
    .md-overlay.md-fixed.md-dialog-overlay{
        z-index: 12;
    }
</style>
