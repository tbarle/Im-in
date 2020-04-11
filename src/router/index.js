import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Chat from "../views/Chat";
import Create from "../views/Create";
import MyProfile from "../views/MyProfile";
import ChatConversation from "../views/ChatConversation";
import ActivityList from "../views/ActivityList";
import ActivityDetails from "../views/ActivityDetails";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { index: 0 }
  },
  {
    path: '/chat',
    name: 'chat',
    component: Chat,
    meta: { index: 1 }
  },
  {
    path: '/create',
    name: 'create',
    component: Create,
    meta: { index: 2 }
  },
  {
    path: '/myProfile',
    name: 'myProfile',
    component: MyProfile,
    meta: { index: 3 }
  },
  {
    path: '/chatConversation/:id',
    name: 'chatConversation',
    component: ChatConversation,
    props: true,
    meta: { index: 4 }
  },
  {
    path: '/activityDetails/:id/:afterCreation',
    name: 'activityDetails',
    component: ActivityDetails,
    props: true,
    meta: { index: 4 }
  },
  {
    path: '/activityList',
    name: 'activityList',
    component: ActivityList,
    props: true,
    meta: { index: 3 }
  }
];

const router = new VueRouter({
  routes
});

export default router;
