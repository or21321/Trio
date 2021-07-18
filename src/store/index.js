import Vue from 'vue'
import Vuex from 'vuex'
import { boardStore } from './modules/board.store'
import { userStore } from './modules/user.store'
Vue.use(Vuex)

export default new Vuex.Store({
   state: {
      userMsg: {
         txt: '',
         type: ''
      }
   },
   getters: {
      userMsg({ userMsg }) { return userMsg }
   },
   mutations: {
      setMsg(state, { msg }) {
         state.userMsg = msg;
      }
   },
   actions: {
      async showMsg({ commit }, { msg }) {
         try {
            commit({ type: 'setMsg', msg });
             msg = {
               txt: '',
               type: ''
            }
            setTimeout(() => { (commit({ type: 'setMsg', msg })) },2500 )
         } catch (err) {
            console.log('ERROR: cannot get userMsg', err);
         }
      }
   },
   modules: {
      boardStore,
      userStore,
   }
})
