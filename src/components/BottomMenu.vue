<template>
  <div class="bar-container">
    <md-bottom-bar md-sync-route class="md-layout" md-active-item="true">
      <md-bottom-bar-item class="md-layout-item" to="/" exact md-icon="home"></md-bottom-bar-item>
      <md-bottom-bar-item class="md-layout-item" to="/chat"  md-icon="forum"></md-bottom-bar-item>
      <md-bottom-bar-item class="md-layout-item" to="/create"  md-icon="add_circle"></md-bottom-bar-item>
      <md-bottom-bar-item class="md-layout-item" to="/myProfile" md-icon="person"></md-bottom-bar-item>
      <md-bottom-bar-item class="md-layout-item" @click="showDrawer" md-icon="menu"></md-bottom-bar-item>
    </md-bottom-bar>

    <md-drawer class="md-right" :md-active.sync="showNavigation" md-swipeable>
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">{{this.name}}</span>
      </md-toolbar>

      <md-list>
        <md-list-item>
          <md-icon>archive</md-icon>
          <span class="md-list-item-text">Archivio attività</span>
        </md-list-item>

        <md-list-item>
          <md-icon>settings</md-icon>
          <span class="md-list-item-text">Impostazioni</span>
        </md-list-item>

        <md-list-item>
          <md-icon>info</md-icon>
          <span class="md-list-item-text">About</span>
        </md-list-item>

        <md-list-item>
          <md-icon>help_outline</md-icon>
          <span class="md-list-item-text">Help</span>
        </md-list-item>

        <md-list-item>
          <md-icon>exit_to_app</md-icon>
          <span class="md-list-item-text">Logout</span>
        </md-list-item>
      </md-list>
    </md-drawer>
  </div>
</template>

<script>
  import store from '../store/index.js';

  export default {
    name: "BottomMenu",
    data: () => ({
      showNavigation: false,
      name: ""
    }),
    methods: {
      showDrawer: function () {
        store.dispatch('getUser', store.getters.userId).then(user => {
          this.name = user.name + " " + user.surname;
        });
        this.showNavigation = true;
      }
    }
  }
</script>

<style scoped>

  a.md-layout-item.md-button {
    min-width: 20%;
    height: auto;
  }
  button.md-layout-item.md-button{
    min-width: 20%;
    height: auto;
  }

  div.md-bottom-bar{
    position:fixed;
    bottom: 0px;
    height: 7%;
    background-color: white;
    z-index: 11;
  }

  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
    z-index: 15;
  }

  .md-right {
    border-radius: 10px;
  }
</style>

<style>
  .bar-container > .md-overlay {
    z-index: 14;
  }
</style>
