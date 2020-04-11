<template>
    <md-list-item id="feedback-participant-list-item">
        <md-avatar>
            <img :src="require('../assets/' + avatar)" alt="Avatar">
        </md-avatar>
        <div id="NameSurname-container">
            <span id="Name">{{this.name}}</span>
            <span id="Surname">{{this.surname}}</span>
        </div>
        <div id="icons-container">
            <div class="div-md-icon" v-on:click="paintRed">
                <md-icon v-bind:style="this.negativeStyle">sentiment_very_dissatisfied</md-icon>
            </div>
            <div class="div-md-icon" v-on:click="paintOrange">
                <md-icon v-bind:style="this.neutralStyle">sentiment_satisfied</md-icon>
            </div>
            <div class="div-md-icon" v-on:click="paintGreen">
                <md-icon v-bind:style="this.positiveStyle">sentiment_very_satisfied</md-icon>
            </div>
        </div>

    </md-list-item>
</template>

<script>
    export default {
        name: "FeedbackParticipantListItem",
        props: {
            id: {
                type: Number,
                default: 0
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
            creator: {
                type: Boolean,
                default: false
            }
        },
        data: () =>({
            vote: 0,
            negativeStyle: {
                color: 'gray'
            },
            neutralStyle: {
                color: 'gray'
            },
            positiveStyle: {
                color: 'gray'
            }
        }),
        methods:{
           paintRed(){
               this.negativeStyle = {
                   color: 'red'
               };
               this.neutralStyle = {
                   color: 'gray'
               };
               this.positiveStyle = {
                   color: 'gray'
               };

               this.vote = -1;
           },
           paintOrange(){
               this.negativeStyle = {
                   color: 'gray'
               };
               this.neutralStyle = {
                   color: 'orange'
               };
               this.positiveStyle = {
                   color: 'gray'
               };

               this.vote = 0;
           },
           paintGreen(){
               this.negativeStyle = {
                   color: 'gray'
               };
               this.neutralStyle = {
                   color: 'gray'
               };
               this.positiveStyle = {
                   color: 'green'
               };

               this.vote = 1;
           }
        }

    }
</script>

<style scoped>

    #NameSurname-container{
        padding: 2px;
        display: flex;
        flex-wrap: wrap;
        min-width: 134px;
        justify-content: space-between;
    }
    #icons-container{
        margin: 3px 6px 3px 20px;
        display: flex;
        flex-wrap: nowrap;
    }
    .div-md-icon{
        margin: 0px 4px
    }
    .md-list-item >>> .md-list-item-content{
        padding:4px 8px;
    }
    .md-list-item-content>.md-avatar{
        margin-right: 5px;
    }
</style>