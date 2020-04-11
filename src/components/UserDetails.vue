<template>
    <div class="overlay" v-bind:style="{display:style.displayOverlay}" >
        <div class="md-layout" id="headerUserDetails">

            <div class="md-layout-item md-medium-size-20" style="padding-top: 10px;" v-on:click="hideOverlay">
                <md-icon>close</md-icon>
            </div>
            <div class="md-layout-item md-medium-size-60">
                <h3>Dettagli utente</h3>
            </div>
            <div class="md-layout-item md-medium-size-20" style="padding-top: 0.5%;">

            </div>

        </div>
        <div class="contentUserDetails" >
            <div id="user-presentation">
                <div id="user-avatar">
                    <img id="avatar" src="../assets/generic-user.jpg" alt="User avatar">
                </div>
                <div id="user-NameSurname">
                    <span id="user-name">{{this.name}} {{this.surname}}</span>
                    <div class="addFriendDiv" v-if="!this.isFriend && !isMe" @click="addFriend">
                        <font-awesome-icon id="addIcon" icon="user-plus" size="1x" />
                    </div>
                    <div class="removeFriendDiv" v-if="this.isFriend && !isMe" @click="removeFriend">
                        <font-awesome-icon id="removeIcon" icon="user-minus" size="1x" />
                    </div>
                </div>
            </div>
            <div id="div-user-description" >
                <span id="user-description">{{this.description}}</span>
            </div>

            <div id="user-rating">
                <div id="rating-box">
                    <div>
                        <md-icon style="color: #ffca2f;">star</md-icon>
                    </div>
                    <div>
                        <span>Rating</span>
                    </div>
                </div>
                <div id="rating-scores">
                    <div>
                        <span>Organizzatore: {{this.host_rating}}%</span>
                    </div>
                    <div>
                        <span>Partecipante: {{this.participant_rating}}%</span>
                    </div>
                </div>
            </div>
        </div>
        <md-snackbar :md-position= "position" :md-duration="isInfinity ? Infinity : duration" :md-active.sync="showSnackbarAdded" md-persistent>
            <span>{{this.name}} {{this.surname}} è stato aggiunto agli amici!</span>
        </md-snackbar>
        <md-snackbar :md-position="position" :md-duration="isInfinity ? Infinity : duration" :md-active.sync="showSnackbarRemoved" md-persistent>
            <span>{{this.name}} {{this.surname}} è stato rimosso dagli amici!</span>
        </md-snackbar>
    </div>
</template>

<script>
    import store from '../store/index.js';

    export default {
        name: "UserDetails",
        data: () => ({
            style: {
                displayOverlay: "none",
            },
            isFriend: "none",
            isMe: false,
            showSnackbarAdded: false,
            showSnackbarRemoved: false,
            duration: 4000,
            isInfinity: false,
            position: "center"
        }),
        props: {
            userId: {
               type: Number,
               default: -1
            },
            name: {
                type: String,
                default: ""
            },
            surname: {
                type: String,
                default: ""
            },
            avatar: {
                type: String,
                default: "generic-user.jpg"
            },
            description: {
                type: String,
                default: ''
            },
            host_rating: {
                type: Number,
                default: 0
            },
            participant_rating: {
                type: Number,
                default: 0
            }
        },
        validations: {
        },
        methods: {
            hideOverlay(){
                $('.overlay').slideToggle();
                $('.panel-div').css('display','none');
            },
            checkFriendStatus: function () {
                console.log("Fired!");
                store.dispatch('getUser', this.userId).then(user => {
                    this.isFriend = user.friends.includes(store.getters.userId);

                    this.isMe = store.getters.userId === user.id;
                });
            },
            addFriend: function () {
                store.commit('addFriend', this.userId);
                this.isFriend = true;
                this.showSnackbarAdded = true;
            },
            removeFriend: function () {
                store.commit('removeFriend', this.userId);
                this.isFriend = false;
                this.showSnackbarRemoved = true;
            }
        },
        updated() {
            this.checkFriendStatus();
        }
    }
</script>

<style scoped>

    #headerUserDetails{
        position: absolute;
        width: 100%;
        height: auto;
        z-index: 1;
    }

    .overlay{
        position: fixed;
        width: 100%;
        height: 46%;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 20;
        border: 1px solid gainsboro;
    }

    .contentUserDetails{
        border-top: 1px solid gainsboro;
        overflow-y: overlay;
        position: absolute;
        width: 100%;
        top: 15%;
        bottom: 0;
        background-color: white;
    }

    #user-presentation {
        display: inline-flex;
        margin-top: 5px;
    }

    #user-avatar {
        display: table-cell;
        vertical-align: middle;
        width: 30%;
        height: 100%;
    }

    #avatar {
        max-width: 100%;
        height: auto;
    }

    #user-NameSurname {
        display: inline-flex;
        justify-content: space-around;
        width: 80%;
        vertical-align: middle;
        margin: auto;
        padding: 0px 4px;
    }

    #user-name {
        text-align: center;
        line-height: normal;
        font-size: 28px;
    }
    #div-user-description{
        padding: 7px;
        margin: 10px 5px;
        border: 1px solid gainsboro;
        border-radius: 5px;
        background-color: aliceblue;
    }
    #user-description {
        display: inline-block;
        text-align: left;
        font-size: 90%;
        padding-top: 2%;
    }

    #user-rating {
        display: flex;
        margin: 10px;
        padding: 7px;
        font-size: 90%;
        align-items: center;
    }

    #rating-box {
        height: 100%;
        margin: 5px 10px;
        text-align: center;
    }

    #rating-scores {
        margin: 5px 10px;
        height: 100%;
        text-align: left;
        font-size: 100%;

    }
    .removeFriendDiv{
        background-color: red;
        width: 30px;
        height: fit-content;
        border-radius: 6px;
        margin: auto 5px;
    }

    .addFriendDiv{
        background-color: #448aff;
        width: 30px;
        height: fit-content;
        border-radius: 6px;
        margin: auto 5px;
    }
    #removeIcon{
        color: white;
        padding: 1px;
    }
    #addIcon{
        color: white;
        padding: 1px;
    }
</style>
