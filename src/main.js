import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/styles.scss'

// import Scrollbar from 'smooth-scrollbar';
import contenteditable from 'vue-contenteditable'
Vue.use(contenteditable)
// const options = { 
//   damping: 0.9,
//   'alwaysShowTracks': true
// }
// Scrollbar.init(document.querySelector('#my-scrollbar'), options);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('.app')
