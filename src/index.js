import Vue from 'vue';
import Vuetify from './plugins/vuetify.js'
import App from './components/App.vue'
new Vue({
    el: '#app',
    vuetify: Vuetify,
    render: h => h(App)
});
    