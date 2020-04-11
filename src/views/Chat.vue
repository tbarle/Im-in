<template>
    <div>
        <div class="header-chat">
            <md-toolbar class="md-primary">
                <div class="md-toolbar-row">
                    <div class="md-toolbar-section-start">
                        <h3 class="md-title" style="margin-right: 10px">Chat</h3>
                    </div>

                    <md-autocomplete
                            class="search"
                            v-model="selectedActivity"
                            :md-options="options"
                            md-layout="box"
                            md-dense>
                        <label>Search...</label>
                    </md-autocomplete>

                    <div class="md-toolbar-section-end">
                        <md-button class="md-icon-button">
                            <md-icon>archive</md-icon>
                        </md-button>
                    </div>
                </div>
            </md-toolbar>
        </div>

        <md-divider/>
        <div id="contentChat" class="md-layout md-gutter">
            <md-list>
                <ChatListItem v-for="chat in this.chats"
                              :key="chat.id"
                              :id="chat.id"
                              :title="chat.title"
                              :last-message="chat[chat.length - 1] !== undefined ? chat[chat.length - 1].message : null"
                              :last-sender="chat[chat.length - 1] !== undefined ? chat[chat.length - 1].shortName : null"
                              :time-stamp="chat[chat.length - 1] !== undefined ? chat[chat.length - 1].timestamp : null"
                              :unread="chat[chat.length - 1] !== undefined ? getUnread(chat) : false" />
            </md-list>
        </div>
    </div>

</template>

<script>
    import ChatListItem from "../components/ChatListItem"
    import store from "../store/index.js";

    export default {
        name: "Chat",
        components:{ChatListItem},
        data:() => ({
            selectedActivity: null,
            chats: [],
            options: []
        }),
        methods: {
            getUnread: function(chat) {
                return chat[chat.length - 1].sender !== store.getters.userId;
            }
        },
        mounted() {
            let chats = store.getters.chats;
            let userId = store.getters.userId;
            let events = store.getters.events;

            store.dispatch('getUser', userId)
                .then(user => {
                    for (let index = 0; index < user['participated'].length; index++) {
                        let event;

                        for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
                            if (events[eventIndex] !== undefined) {
                                if (events[eventIndex].id === user['participated'][index]) {
                                    event = events[eventIndex];
                                }
                            }
                        }

                        if (chats[user['participated'][index]] !== undefined) {
                            chats[user['participated'][index]].title = event.title;
                            chats[user['participated'][index]].id = event.id;
                            this.chats.push(chats[user['participated'][index]]);
                        } else {
                            this.chats.push({
                                "id": event.id,
                                "title": event.title,
                                "unread": false
                            });
                        }
                    }
                });
        }
    }
</script>

<style scoped>
    .md-list{
        width: 100%;
    }
    .md-autocomplete{
        margin:4px;
        border-radius: 16px;
        width: 70%;
    }
    .header-chat{
        position: fixed;
        top: 0;
        z-index: 10;
        width: 100%;
        background-color: floralwhite;
    }
    #contentChat{
        margin-top: 58px;
        margin-bottom: 60px;
        height: 93%;
    }
    #title-page{
        font-size: 18px;
    }

</style>
