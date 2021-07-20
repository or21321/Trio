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


Vue.directive('clickoutside', {
   inserted: (el, binding, vnode) => {
 // assign event to the element
     el.clickOutsideEvent = function (event) {
       // here we check if the click event is outside the element and it's children
       if (!(el == event.target || el.contains(event.target))) {
         // if clicked outside, call the provided method
         vnode.context[binding.expression](event)
       }
     }
 // register click and touch events
     document.body.addEventListener('click', el.clickOutsideEvent)
     document.body.addEventListener('touchstart', el.clickOutsideEvent)
   },
   unbind: function (el) {
 // unregister click and touch events before the element is unmounted
     document.body.removeEventListener('click', el.clickOutsideEvent)
     document.body.removeEventListener('touchstart', el.clickOutsideEvent)
   },
   stopProp(event) {
     event.stopPropagation()
   },
 })


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('.app')
