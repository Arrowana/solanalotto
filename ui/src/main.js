import Vue from 'vue'
import App from './App.vue'
//import { initLottery } from './lottery';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
