import Vue from 'vue'
import credCAPI from "@/utils/credCAPI";
import router from './router';
import App from './App.vue'
import config from "config";
Vue.config.productionTip = false
/*CONFIG */
Vue.prototype.$config = Vue['$config'] = window.config;
console.log(Vue.prototype.$config)

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
import '@/assets/css/style.scss'

const servertype = config.jsonserver ? 'jsonserver' : 'apiserver';
const baseurl = config.jsonserver ? config.JREST : config.NREST;
window.credCAPI = Vue.$credCAPI = Vue.prototype.$credCAPI = credCAPI({ baseurl: baseurl, servertype: servertype });



new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
