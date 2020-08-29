import Vue from 'vue'
import Layr from './Layr.vue'

import axios from 'axios'

Vue.prototype.$http = axios.create({
    headers: {
        common: {
            Authorization: 'Bearer 1|4fa4LjnYOsRJVOHbksfsePvgSWu0yMhKlfu29j2QFHNYUEM6ORaE98cY37DWAqXh7HbCLclGOZQrkqtR'
        }
    },
    withCredentials: true,
    baseURL: 'http://localhost:8000'
})
Vue.prototype.$httpCross = axios.create(
    // headers: { 'Access-Control-Allow-Origin': '*' }
)

import '@/globalComponents'

// import ImageViewer from './components/programs/ImageViewer.vue'
// Vue.component('ImageViewer', ImageViewer);

Vue.config.productionTip = false

Vue.mixin({
    methods: {
      setNestedObjectValue(obj, path, value) {
        var schema = obj;  // a moving reference to internal objects within obj
        var pList = path.split('.');
        var len = pList.length;
        for (var i = 0; i < len - 1; i++) {
          var elem = pList[i];
          if (!schema[elem]) schema[elem] = {}
          schema = schema[elem];
        }

        schema[pList[len - 1]] = value;
      },
    }
})

new Vue({
    el: '#layr',
    render: h => h(Layr),

})

