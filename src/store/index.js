import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        globalEventId: 15,
        events: [],
        users: [],
        archive: [],
        feedback: [],
        invites: [],
        categories: {},
        chats: {},
        userPosition: [11.2417595, 43.7995825],
        displayEvents: [],
        userId: 1,
        modalMapDetails: {
            coords: [],
            address: ''
        }
    },
    getters: {
        globalEventId(state) {
            return state.globalEventId;
        },
        events(state) {
            return state.events;
        },
        users(state) {
            return state.users;
        },
        archive(state) {
            return state.archive;
        },
        feedback(state) {
            return state.feedback;
        },
        invites(state) {
            return state.invites;
        },
        categories(state) {
            return state.categories;
        },
        chats(state) {
          return state.chats;
        },
        userPosition(state) {
            return state.userPosition;
        },
        displayEvents(state) {
            return state.displayEvents;
        },
        userId(state) {
            return state.userId;
        },
        modalMapDetails(state) {
            return state.modalMapDetails;
        }
    },
    mutations: {
        incrementEventId(state) {
            state.globalEventId++;
        },
        events(state, events) {
            state.events = events;
        },

        addEvent(state, event) {
            state.events.push(event);
        },
        deleteEvent(state, index) {
            state.events.splice(index, 1);
        },
        users(state, users) {
            state.users = users;
        },
        addFriend(state, userId) {
            for (let index = 0; index < state.users.length; index++) {
                if (state.users[index].id === userId) {
                    state.users[index].friends.push(state.userId);
                } else if (state.users[index].id === state.userId) {
                    state.users[index].friends.push(userId);
                }
            }
        },
        removeFriend(state, userId) {
            for (let index = 0; index < state.users.length; index++) {
                if (state.users[index].id === userId) {
                    state.users[index].friends.splice(state.users[index].friends.indexOf(state.userId), 1);
                } else if (state.users[index].id === state.userId) {
                    state.users[index].friends.splice(state.users[index].friends.indexOf(userId), 1);
                }
            }
        },
        archive(state, archive) {
            state.archive = archive;
        },
        feedback(state, feedback) {
            state.feedback = feedback;
        },
        removeFeedback(state, {userId, eventId}) {
            state.feedback[userId.toString()].splice(state.feedback[userId.toString()].indexOf(eventId), 1);
        },
        invites(state, invites) {
            state.invites = invites;
        },
        categories(state, categories) {
            state.categories = categories;
        },
        chats(state, chats) {
            state.chats = chats;
        },
        userPosition(state, userPosition) {
            state.userPosition = userPosition;
        },
        displayEvents(state, events) {
            state.displayEvents = events;
        },
        modalMapDetails(state, details) {
            state.modalMapDetails = details;
        },
        removeParticipantFromEvent(state, {eventId, participantId}) {
            for (let index = 0; index < state.events.length; index++) {
                if (state.events[index].id === eventId) {
                    state.events[index].participants.splice(state.events[index].participants.indexOf(participantId), 1);
                }
            }
        },
        removeEventFromUser(state, {userId, eventId}) {
            for (let index = 0; index < state.users.length; index++) {
                if (state.users[index].id === userId) {
                    state.users[index].participated.splice(state.events[index].participants.indexOf(eventId), 1);
                }
            }
        }
    },
    actions: {
        getUser(state, userId) {
            for (let index = 0; index < state.getters.users.length; index++) {
                if (state.getters.users[index].id === userId) {
                    return state.getters.users[index];
                }
            }
        },
        getEvent(state, eventId) {
            for (let index = 0; index < state.getters.events.length; index++) {
                if (state.getters.events[index].id === eventId) {
                    return state.getters.events[index];
                }
            }
        },
        deleteEvent(state, eventId) {
            for (let index = 0; index < state.getters.events.length; index++) {
                if (state.getters.events[index].id === eventId) {
                    state.commit('deleteEvent', index);
                }
            }
        }
    }
});
