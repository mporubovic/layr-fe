import Vue from 'vue'
import Layr from './Layr.vue'

import axios from 'axios' 

Vue.prototype.$http = axios.create({
    withCredentials: true,
    // baseURL: process.env.NODE_ENV === "development" ? 'http://localhost:8000' : 'https://api.mylayr.net/',
    baseURL: process.env.NODE_ENV === "development" ? location.hostname === "localhost" ? 'http://localhost:8000' : 'http://192.168.0.17:8000' : 'https://app.mylayr.com/',
    // ...(process.env.NODE_ENV === "development" && {headers: {
    //     authorization: 'Bearer 1|KGYCavjhIczvhijwB34eFlaBoc3LBbUoB4wygFw4cJVLb98wjmmH6zMD9JTxtPTjuOlDVpVDBLZCa8me'
    // }})

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

import Vue2TouchEvents from 'vue2-touch-events'
 
Vue.use(Vue2TouchEvents)

import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
})

new Vue({
    el: '#layr',
    render: h => h(Layr),
    router,

})

