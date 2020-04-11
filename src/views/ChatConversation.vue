<template>
    <div>
        <md-toolbar class="md-primary md-dense" id="headerChat">
            <div id="goBackToChat" @click="goBack">
                <md-icon >keyboard_arrow_left</md-icon>
            </div>
            <div id="chatTitle">
                <h4 class="md-title">{{this.title}}</h4>
            </div>
        </md-toolbar>

        <md-list>
            <Message v-for="message in this.messages"
                     :key="message.sender.toString() + message.timestamp"
                     :isSent="checkIfSenderIsUser(message.sender)"
                     :text="message.message"
                     :sender-id="message.sender"
                     :timeStamp="message.timestamp"></Message>
        </md-list>

        <md-toolbar class="md-dense md-layout" id="footerChat">
            <div class="md-layout-item md-medium-size-85">
                <md-field id="messageArea">
                    <label id="labelMess">Messaggio</label>
                    <md-textarea v-model="messageToSend" md-autogrow></md-textarea>
                </md-field>
            </div>
            <div class="md-layout-item md-medium-size-15">
                <md-icon>send</md-icon>
            </div>

        </md-toolbar>

    </div>
</template>

<script>
    import Message from "../components/Message";
    import store from "../store/index.js";

    export default {
        name: "ChatConversation",
        data: () => ({
            messageToSend: null,
            messages: [],
            title: ""
        }),
        props: {
            id: {
                type: Number,
                default: -1
            }
        },
        components:{Message},
        methods:{
            goBack: function() {
                this.$router.push({name: 'chat'});
            },
            checkIfSenderIsUser: function(id) {
                return id === store.getters.userId;
            }
        },
        mounted() {
            this.messages = store.getters.chats[this.id];

            store.dispatch('getEvent', this.id)
            .then(event => {
               this.title = event.title;
            });
        }
    }
</script>

<style scoped>
    .md-toolbar#headerChat{
        width: 100%;
        position: fixed;
        top: 0;
    }

    #goBackToChat{
        width: 8%;
    }
    #chatTitle{
        width: 88%;
    }
    .md-toolbar#footerChat{
        width: 100%;
        position: fixed;
        bottom: 0;
        min-height: 7%;
        background-color: white;
        z-index: 16;
    }
    .md-list{
        position: fixed;
        top: 7%;
        height: 85%;
        overflow-y: overlay;
        padding: 15px 0 ;
    }
    #messageArea{
        margin-right: 5%;
    }
    .md-field:after{
        height: 0px;
    }
    .md-field:before{
        height: 0px;
    }

    #labelMess{
        left: 14px;
    }

    .md-field.md-theme-default.md-focused label{
        display: none;
    }
    .md-textarea{
        border: 1px solid gainsboro;
        border-radius: 8px;
        padding-left: 4px;
        padding-right: 4px;
    }


</style>