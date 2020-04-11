<template>
    <div>
        <!--TODO: pass the ID of the conversation here-->
        <md-list-item class="chat-item" :to="{name: 'chatConversation', params: {id: this.id}}">
            <div class="md-list-item-text">
                <div class="chatTitle">
                    <h4>{{this.title}}</h4>
                    <md-badge v-if="this.unread" class="md-primary" md-content="1" />

                </div>
                <!--TODO: fix this-->
                <div class="chatLastMsg" v-if="this.lastSender !== null && this.lastMessage !== null">
                    <div class="lastMsg">
                        <label>{{this.lastSender}}: </label>
                        <span>{{this.lastMessage}}</span>
                    </div>
                    <div class="timeLastMsg">{{this.timeStamp}}</div>
                </div>
            </div>
        </md-list-item>
        <md-divider/>
    </div>
</template>

<script>
    export default {
        name: "ChatListItem",
        props: {
            id: {
                type: Number,
                default: 0
            },
            title: {
                type: String,
                default: ""
            },
            lastSender: {
                type: String,
                default: ""
            },
            lastMessage: {
                type: String,
                default: ""
            },
            timeStamp: {
                type: String,
                default: ""
            },
            unread: {
                type: Boolean,
                default: true
            }
        }
    }
</script>

<style scoped>
    .chatTitle{
        display: inline-flex;
        margin-bottom: 4px;
    }
    .chat-item{

    }
    .chatLastMsg{
        display: inline-flex;
        justify-content: space-between;
    }
    .lastMsg{
        width: 80%;
    }
    .timeLastMsg{
        width: fit-content;
    }
    .md-badge{
        width: 26px;
    }
</style>
