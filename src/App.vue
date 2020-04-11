<template>
  <div id="app">
    <transition :name="transitionName" mode="out-in">
      <keep-alive :include="['home']">
        <router-view/>
      </keep-alive>
    </transition>
    <BottomMenu/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.min.css'
  import 'vue-material/dist/theme/default.css'

  Vue.use(VueMaterial);

  import BottomMenu from "./components/BottomMenu";
  import axios from "axios";
  export default {
    name: 'App',
    components: {BottomMenu},
    data() {
      return {
        transitionName: ''
      }
    },
    watch: {//Use watch to monitor changes in $router
      $route(to, from) {
        //If the to index is larger than the from index, it is judged to be in the forward state, and vice versa, in the backward state.
        if (to.meta.index > from.meta.index) {
          //Setting Animation Name
          this.transitionName = 'slide-left';
        } else {
          this.transitionName = 'slide-right';
        }
      }
    }
  }
</script>

<style>
html{
  width: 100%;
  overflow-x: hidden;
}
body{
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  background-color: white;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.10s;
  transition-property: height, opacity, transform;
  transition-timing-function: ease-in-out;
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(50%, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-50%, 0);
}

</style>
