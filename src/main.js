import Vue from 'vue';
import store from './store';
import App from './App.vue';
import router from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSlidersH, faLocationArrow, faListUl, faComments, faClipboardList, faMusic, faFilm, faGlobeEurope, faUtensils,
  faTheaterMasks, faCocktail, faUniversity, faRunning, faUserMinus, faUserPlus, faInfoCircle, faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faSlidersH, faLocationArrow, faListUl, faComments, faClipboardList, faMusic, faFilm, faGlobeEurope,
    faUtensils, faTheaterMasks, faCocktail, faUniversity, faRunning, faUserMinus, faUserPlus, faInfoCircle,
    faMapMarkerAlt);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
