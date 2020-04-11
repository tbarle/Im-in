# I'm In App: find and create group activities
Design, mockupping and prototyping of a mobile application to find and participate or create group activities, made as final assignment for the Human Computer Interaction course at Università degli Studi di Firenze by [Federico Tammaro](https://github.com/Sfullez) and [Tommaso Barletti](https://github.com/tbarle).
**This is only a prototype and not completely functional**: no backend and side functionalities have been implemented and the application has an initial local state restored every time the application is started.
Full project report (in Italian) can be found [here](https://github.com/Sfullez/im-in/blob/master/Project_Report.pdf).

## Techonologies used

 - **Vue.js** as the main programming framework for HTML, JavaScript and CSS
	 - [Vuex](https://vuex.vuejs.org/) - State management pattern and library for the application state
	 - [Vue Router](https://router.vuejs.org/) - Official Vue.js router used for the internal application navigation to create a single-page application
	 - [Vue Material](https://vuematerial.io/) - Library that eases the use of Material Design in a Vue.js application
- **Cordova** to deploy everything as a mobile application and use it as a native smartphone application

The application requires the installation of Vue.js via NPM (full instructions can be found [here](https://vuejs.org/v2/guide/installation.html#NPM))

    npm install vue

and Cordova: since the installation varies with each OS, full instructions to install Cordova and add the needed platforms can be found [here](https://cordova.apache.org/docs/en/latest/guide/cli/).

Cordova needs the following plugins, that can be installed as follows:

    cordova plugin add cordova-custom-config
    cordova plugin add cordova-plugin-fullscreen
    cordova plugin add cordova-plugin-whitelist

 
  Then, the installation of all the needed node modules can be done directly via NPM by navigating inside the project folder and executing
  
    npm install
Then, the application can be run locally (__not recommended__ since it is designed as a mobile application) using

    npm run dev

or deployed on the smartphone (after having configured Cordova) using

    npm run build
    cordova [platform] build
    cordova run [platform] --device

## Screenshots
<img src="https://i.ibb.co/2YDmR0f/App-Mappa.png" width="250"> <img src="https://i.ibb.co/0Bxd1ZN/App-Filtri.png" width="250"> <img src="https://i.ibb.co/n0sVrVN/App-Lista.png" width="250">
<img src="https://i.ibb.co/L9pwDN6/App-Crea.png" width="250"> <img src="https://i.ibb.co/nrjdT7Z/App-Profilo.png" width="250"> <img src="https://i.ibb.co/tPgZQh3/App-Dettagli.png" width="250">
<img src="https://i.ibb.co/0JQ635X/App-Chat.png" width="250"> <img src="https://i.ibb.co/b2g8nHk/App-Conversazione.png" width="250">
