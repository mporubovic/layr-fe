import Vue from 'vue'
import Layr from './Layr.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Layr),
}).$mount('#app')
