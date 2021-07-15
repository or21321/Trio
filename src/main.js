import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import Scrollbar from 'smooth-scrollbar';
import contenteditable from 'vue-contenteditable'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/styles.scss'

Vue.use(ElementUI);
Vue.use(contenteditable)
Vue.use(require('vue-moment'));
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
