import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'animate.css'
// app.js
Vue.use(ElementUI)

if (localStorage.getItem('car')) {
  JSON.parse(localStorage.getItem('car'))
} else {
  localStorage.setItem('car', '[]')
}

import qs from 'qs'
Vue.prototype.qs = qs
import 'wowjs/css/libs/animate.css'
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

// import BaiduMap from 'vue-baidu-map'

// Vue.use(BaiduMap, {
//   // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
//   ak: '1osmW7Bs7lIFr67cBjF0n9kmu8W5ZVe4'
// })

// Vue.config.productionTip = false

new Vue({
  router,
  store,
  mounted() {
    // You'll need this for renderAfterDocumentEvent.
    document.dispatchEvent(new Event('render-event'))
  },
  render: h => h(App)
}).$mount('#app')
