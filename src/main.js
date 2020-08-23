import Vue from 'vue'
import Layr from './Layr.vue'

import Axios from 'axios'

Vue.prototype.$http = Axios;

import '@/globalComponents'

// import ImageViewer from './components/programs/ImageViewer.vue'
// Vue.component('ImageViewer', ImageViewer);

Vue.config.productionTip = false

  new Vue({
    el: '#layr',
    render: h => h(Layr),
    
  })

