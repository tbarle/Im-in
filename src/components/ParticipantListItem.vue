<template>
    <li id="participant-list-item">
        <md-avatar>
            <img :src="require('../assets/' + avatar)" alt="Avatar">
        </md-avatar>
        <span v-on:click="this.openUserDetails">
            <span>{{this.name}} {{this.surname}}</span>
            <md-icon v-if="creator" style="color: #ffca2f;">star</md-icon>
        </span>
        <span v-on:click="this.doSomething">
            <md-icon v-if="!creator && this.$parent.$data.showEdit" style="color: red;">remove_circle</md-icon>
        </span>
    </li>
</template>

<script>
    export default {
        name: "ParticipantListItem",
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
            },
            user : {
                type: Object,
                default: null
            }
        },
        methods: {
            doSomething: function() {
                this.$parent.kickParticipant(this.id);
            },
            openUserDetails: function() {
                this.$parent.openUserDetails(this.user);
            }
        }
    }
</script>

<style scoped>
    #participant-list-item {
        text-align: left;
        font-size: 1.1em;
        padding-top: 2%;
        padding-bottom: 2%;
    }
</style>
