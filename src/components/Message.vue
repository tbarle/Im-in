<template>
    <div>
        <md-card :class="messageClass">
            <md-card-header v-if="!this.isSent">
                <md-card-header-text >
                    <div class="md-subhead">{{this.fullName}}</div>
                </md-card-header-text>
            </md-card-header>
            <md-card-content>
                <div>{{this.text}}</div>
                <div class="timeStamp-div"><div>{{this.timeStamp}}</div></div>
            </md-card-content>
        </md-card>
    </div>
</template>

<script>
    import store from "../store";

    export default {
        name: "Message",
        props: {
            isSent: {
                type: Boolean,
                default: false
            },
            text: {
                type: String,
                default: ""
            },
            senderId: {
                type: Number,
                default: -1
            },
            timeStamp: {
                type: String,
                default: ""
            }
        },
        data: () => ({
            messageClass: null,
            fullName: ""
        }),
        mounted() {
            if (this.isSent) {
                this.messageClass = "sentMessage"
            } else {
               this.messageClass = "receivedMessage"
            }

            store.dispatch('getUser', this.senderId)
                .then(user => {
                    this.fullName = user.name + " " + user.surname;
                });
        }
    }
</script>

<style scoped>
    .md-card{
        border-radius: 7px;
        max-width: 75%;
        width: fit-content;
        margin-top: 1.5%;
        margin-bottom: 1.5%;
    }

    .md-card-header{
        padding: 3px;
        text-align: left;
    }

    .md-card-content{
        padding-left: 4px;
        padding-right: 4px;
        padding-bottom: 3px;
        font-size: 13px;
        line-height: 15px;
        text-align: left;
    }

    .sentMessage{
        margin-right: 2%;
        float: right;
        background-color: aliceblue;
    }

    .receivedMessage{
        margin-left: 2%;

    }

    .timeStamp-div{
        display: flex;
        flex-flow: row-reverse;
        font-size: 10px;
    }
</style>